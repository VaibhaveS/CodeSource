//To get HTML elements
const output = document.getElementById('output');
const message = document.getElementById('message');
const send = document.getElementById('send');
const feedback = document.getElementById('feedback');
const roomMessage = document.querySelector('.room-message');
const users = document.querySelector('.users');

//Socket server URL
const socket = io.connect('http://localhost:3000');

//Sending data when user clicks send
send.addEventListener('click', () => {
  socket.emit('chat', {
    username: username,
    message: message.value,
    roomname: roomname,
  });
  message.value = '';
});

//Displaying the message sent from user
socket.on('chat', (data) => {
  output.innerHTML += '<p><strong>' + data.username + '</strong>: ' + data.message + '</p>';
  feedback.innerHTML = '';
  document.querySelector('.chat-message').scrollTop =
    document.querySelector('.chat-message').scrollHeight;
});
