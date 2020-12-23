import io from 'socket.io-client';

const socket = io('localhost:5000');
socket.on('connect', function(){console.log('connect')});
socket.on('disconnect', function(){console.log('disconnect')});
window.socket = socket
socket.onAny((eventName, ...args) => {
  console.log(eventName, args)
});