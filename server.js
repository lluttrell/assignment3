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

  setName(name) {
    if (usernameExists(name)) {
      return false;
    }
    this.name = name;
    return true;
  }

  setColor(color) {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      this.color = color;
      return true;
    }
    return false;
  }
}

class Message {
  constructor(user, content) {
    this.user = user;
    this.content = content
    this.timestamp = this.getTimestamp();
  }

  getTimestamp() {
    let timestamp = new Date();
    return `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`
  }

  isColorChange() {
    return this.content.startsWith('/color ');
  }
  
  isNameChange() {
    return this.content.startsWith('/name ');
  }

  toColorString() {
    if (this.isColorChange()) {
      return this.content.replace('/color ', '');
    } else {
      return false
    }
  }

  toNameString() {
    if (this.isNameChange()) {
      return this.content.replace('/name ', '');
    } else {
      return false
    }
  }
}


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
  let uname
  do uname =`user${getRandomInt(100,999)}`
  while (usernameExists(uname))
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
  io.emit('user list', JSON.stringify(users))
  //io.emit('chat message', `${user.name} connected`);

  socket.emit('message history', JSON.stringify(messages))

  socket.on('disconnect', () => {
    users = users.filter(u => u.name != user.name )
    io.emit('chat message', `${user.name} disconnected`);
  });

  socket.on('chat message', (msg) => {
    let message = new Message(user, msg);
    if (message.isColorChange()) {
      user.setColor(message.toColorString())
    } else if (message.isNameChange()) {
      user.setName(message.toNameString())
    } else {
      if (messages.length >= 200) messages = messages.shift();
      messages.push(message);
      io.emit('chat message', JSON.stringify(message));
    }
  });
})

const port = process.env.PORT || 41399
http.listen(port, () => {
  console.log(`listening on *:${port}`);
})