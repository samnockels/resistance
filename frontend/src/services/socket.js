import io from 'socket.io-client';
import api from '../services/api'
// export const socket = io('localhost:5000');

// socket.on('connect', function () { console.log('connect') });
// socket.on('disconnect', function () { console.log('disconnect') });

// /**
//  * Send a message to the server
//  */
// export const send = (event, data) => {
//   socket.emit(event, {
//     data,
//     auth: sessionStorage.getItem('token')
//   })
// }

// socket.onAny((event, ...args) => {
//   console.log(`-> ${event}`, JSON.stringify(args, null, 2))
// })

// window.socket = socket
// window.send = send
// window.api = api