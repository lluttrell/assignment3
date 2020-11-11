var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let users = []
let messages = []

class User {
  constructor() {
    this.name = createRandomName();
    this.color = '000000';
  }
}

class Message {
  constructor(user, content) {
    this.user = user;
    this.content = content
    this.timestamp = Date.now();
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function createRandomName() {
  let uname = `user${getRandomInt(100,999)}`
  while (users.filter(user => user.name === uname).length > 0 ) {
    uname = `user${getRandomInt(100,999)}`
  }
  return uname
}

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', (req,res) => {
  res.sendFile(__dirname + '/style.css')
})

app.get('/app.js', (req,res) => {
  res.sendFile(__dirname + '/app.js')
})

io.on('connection', (socket) => {
  let user = new User();
  users.push(user);
  io.emit('chat message', `${user.name} connected`);
  console.log(`${user.name} connected`)

  socket.on('disconnect', () => {
    users = users.filter(u => u.name != user.name )
    io.emit('chat message', `${user.name} disconnected`);
    console.log(`${user.name} disconnected`)
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', `${user.name}: ${msg}`);
    console.log('chat message', `${user.name}: ${msg}`);
  });
})

http.listen(3000, () => {
  console.log('listening on *:3000');
})