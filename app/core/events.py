from flask import request
from flask_socketio import emit
from server import socketio
import resistance.store
from core.socket import socketError, socketGetPlayer


#---------------------------------------#
#-----------------Events----------------#
#---------------------------------------#


@socketio.event
def hello(req):
    player = socketGetPlayer(req)
    emit('welcome', 'Welcome ' + player.get('name'))
    emit('clients-updated', clients)


@socketio.event
def echo(req):
    emit('echo-reply1', req)


@socketio.event
def join(req):
    player = socketGetPlayer(req)
    data = req.get('data')
    room = data.get('room')
    if not room:
        socketError('room is a required field')
    join_room(data.get('room'))
    emit('on-join', player.get('name') + ' joined the room.', room=room)


@socketio.event
def leave(req):
    player = socketGetPlayer(req)
    data = req.get('data')
    room = data.get('room')
    if not room:
        socketError('room is a required field')
    leave_room(data.get('room'))
    emit('on-leave', player.get('name') + ' left the room', room=request.sid)
