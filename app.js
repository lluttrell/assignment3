let socket = io();
let id;

socket.emit('logged in',localStorage.getItem('coolchat-id'))

function appendChatMessage(socket, msg) {
  if (typeof msg === 'string') msg = JSON.parse(msg);
  $('#messages').prepend($('<li>')
    .html(`<span class="timestamp">${msg.timestamp}</span> ${msg.user.name}: ${msg.content}`)
    .css('color',`#${msg.user.color}`)
    .addClass(() => (id === msg.user.id) ? 'user-message' : 'other-message'));
}

function appendErrorMessage(socket, error) {
  $('#messages').prepend($('<li>')
    .text(`Error: ${error}`)
    .addClass('error'));
}

function updateUserInfo(socket, u) {
  let user = JSON.parse(u);
  id = user.id;
  localStorage.setItem('coolchat-id', user.id);
}

function updateUserList(socket, userList) {
  let users = JSON.parse(userList);
  $('#users').empty();
  
  users.forEach(function(u) {
    $('#users').append($('<li>')
      .text(`${u.name}`)
      .css('color', `#${u.color}`)
      .addClass(() => (id == u.id) ? 'current-user' : ''));
  })
}

$(function () {
  $('form').submit(function(e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('message history', function(msgHist) {
    $('#messages').empty();
    let messages = JSON.parse(msgHist);
    messages.forEach(function(message) {
      appendChatMessage(null,message)
    })
  })

  socket.on('user', updateUserInfo.bind(null,socket))
  socket.on('error message', appendErrorMessage.bind(null,socket));
  socket.on('chat message', appendChatMessage.bind(null,socket));
  socket.on('user list', updateUserList.bind(null, socket));
});

