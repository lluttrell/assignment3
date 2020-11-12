let socket = io();
let user;

if (localStorage.getItem('coolchat-id') !) {
  socket.emit('reconnect', localStorage.getItem('coolchat-id'));
}

function appendChatMessage(socket, message) {
  let msg = JSON.parse(message)
  $('#messages').append($('<li>').text(`${msg.timestamp} ${msg.user.name}: ${msg.content}`));
}

function appendErrorMessage(socket, error) {
  $('#messages').append($('<li>').text(`Error: ${error}`));
}

function updateUserInfo(socket, u) {
  user = JSON.parse(u);
  console.log(user);
  localStorage.setItem('coolchat-id',u.id);
}

$(function () {

  $('form').submit(function(e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('user', updateUserInfo.bind(null,socket))

  // socket.on('message history', function(msgHist) {
  //   let messages = JSON.parse(msgHist);
  //   messages.forEach(function(message) {
  //     appendChatMessage(null,message)
  //   })
  // })

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

