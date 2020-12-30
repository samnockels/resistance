import io from 'socket.io-client';

export const socket = io('localhost:5000');

socket.on('connect', function () { console.log('connect') });
socket.on('disconnect', function () { console.log('disconnect') });

/**
 * Send a message to the server
 */
export const send = (event, data) => {
  socket.emit('lol', {
    data,
    auth: sessionStorage.getItem('token')
  })
}

socket.onAny(console.log)