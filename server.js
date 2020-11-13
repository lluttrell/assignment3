const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Message = require('./message');
const User = require('./user');

let totalUsers = 0;
let allUsers = [];
let users = [];
let messages = [];

/**
 * Checks if name is already taken in the user list
 * @param {string} uname Username to check
 */
function usernameExists(uname) {
  return users.filter(user => user.name === uname).length > 0
}

/**
 * Returns a random integer between min and max
 * @param {int} min Minimum value of random number
 * @param {int} max Maximum value of random number
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Creates a random username, checks to ensure name isn't taken
 */
function createRandomName() {
  let uname;
  do uname =`user${getRandomInt(100,999)}`
  while (usernameExists(uname))
  return uname
}

function createUserID() {
  totalUsers++;
  return totalUsers
}

function handleNameChange(socket, message) {
  if (usernameExists(message.toNameString())) {
    socket.emit('error message', `username ${message.toNameString()} already taken`);
  } else {
    message.user.name = message.toNameString();
    io.emit('user list', JSON.stringify(sortUsers(users)));
    socket.emit('user', JSON.stringify(message.user));
    io.emit('message history', JSON.stringify(messages))
  }
}

function sortUsers(users) {
  let removedDuplicates = users.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
  return removedDuplicates.sort((a,b) => a.name.localeCompare(b.name));
}

function handleMessage(socket, message) {
  if (messages.length >= 200) messages = messages.shift();
  messages.push(message);
  io.emit('chat message', JSON.stringify(message));
}

function handleColorChange(socket, message) {
  if (message.user.setColor(message.toColorString())) {
    io.emit('message history', JSON.stringify(messages))
    io.emit('user list', JSON.stringify(sortUsers(users)));
    } else {
    socket.emit('error message', `invalid hex code`);  
    }
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
  let user;
  socket.on('logged in', function(id) {
    if (allUsers.filter(u => u.id == id).length > 0) {
      user = allUsers.filter(u => u.id == id)[0]
    } else {
      user = new User(createUserID(), createRandomName());
      allUsers.push(user);
    }
    users.push(user);
    socket.emit('user', JSON.stringify(user))
    io.emit('user list', JSON.stringify(sortUsers(users)))
    socket.emit('message history', JSON.stringify(messages))  
  })

  socket.on('disconnect', () => {
    users = users.filter(u => u.id != user.id)
    io.emit('user list', JSON.stringify(sortUsers(users)))
  });

  socket.on('chat message', (msg) => {
    let message = new Message(user, msg);
    if (message.isColorChange()) handleColorChange(socket, message);
    else if (message.isNameChange()) handleNameChange(socket, message);
    else handleMessage(socket, message);
  });

})

const port = process.env.PORT || 41399
http.listen(port, () => {
  console.log(`listening on *:${port}`);
})

module.exports = {
  createRandomName: createRandomName,
  usernameExists
}