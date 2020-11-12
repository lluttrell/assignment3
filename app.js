let socket = io();

if (localStorage.getItem('username')) {
  socket.emit('chat message', `/name ${localStorage.getItem('username')}`);
}

if (localStorage.getItem('color')) {
  socket.emit('chat message', `/color ${localStorage.getItem('color')}`);
}

function appendChatMessage(socket, message) {
  let msg = JSON.parse(message)

  console.log(msg)
  $('#messages').append($('<li>').text(`${msg.timestamp} ${msg.user.name}: ${msg.content}`));
}

$(function () {

  $('form').submit(function(e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('message history', function(msgHist) {
    let messages = JSON.parse(msgHist);
    messages.forEach(function(message) {
      appendChatMessage(null,message)
    })
  })

  socket.on('chat message', appendChatMessage.bind(null,socket));

  socket.on('user list', function(userList) {
    let users = JSON.parse(userList);
    $('#users').empty();
    users.forEach(function(user) {
      $('#users').append($('<li>').text(`${user.name}`));
    })
  })
});

