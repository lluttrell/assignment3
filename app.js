let socket = io();

// if (localStorage.getItem('coolchat-name')) {
//   user = JSON.parse(u)
//   socket.emit('chat message', localStorage.getItem('coolchat-id'));
// }

function appendChatMessage(socket, msg) {
  if (typeof msg === 'string') msg = JSON.parse(msg);
  $('#messages').append($('<li>')
    .text(`${msg.timestamp} ${msg.user.name}: ${msg.content}`))
    .css('color',`#${msg.user.color}`);
}

function appendErrorMessage(socket, error) {
  $('#messages').append($('<li>').text(`Error: ${error}`));
}

function updateUserInfo(socket, u) {
  let user = JSON.parse(u);
  id = user.id;
  // localStorage.setItem('coolchat-user-id', id);
}

$(function () {

  $('form').submit(function(e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('user', updateUserInfo.bind(null,socket))

  socket.on('message history', function(msgHist) {
    let messages = JSON.parse(msgHist);
    messages.forEach(function(message) {
      appendChatMessage(null,message)
    })
  })

  socket.on('error message', appendErrorMessage.bind(null,socket));

  socket.on('chat message', appendChatMessage.bind(null,socket));

  socket.on('user list', function(userList) {
    let users = JSON.parse(userList);
    $('#users').empty();
    users.forEach(function(user) {
      $('#users').append($('<li>').text(`${user.name}`));
    })
  })
});

