from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import Flask, request
import routes.auth
import routes.game
import store
import os
import crypto
# from events import register_events

socketio = SocketIO()
app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'gjr38dkjn344_!67#'

# Seed the database
store.init_game_master_pass(os.environ['GAME_MASTER_PASS'])

# Register http routes
app.register_blueprint(routes.auth.app, url_prefix='/')
app.register_blueprint(routes.game.app, url_prefix='/game')
app.register_blueprint(routes.player.app, url_prefix='/player')


@app.after_request
def apply_cors_headers(response):
    """Enable CORS"""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

#
# Put events here:
#


clients = {}


def socketError(message):
    emit('error', message)
    raise Exception(message)


def socketGetPlayer(req):
    player_id = crypto.decrypt(req.get('auth'))
    player = store.get_player(player_id)
    if not player:
        socketError('socketGetPlayer - player not found')
    if not clients.get(player_id):
        clients[player_id] = player
    # update the sid
    clients[player_id]['sid'] = request.sid
    return player


@socketio.event
def hello(req):
    player = socketGetPlayer(req)
    emit('welcome', 'Welcome ' + player.get('name'))
    emit('clients-updated', clients)


@socketio.event
def echo(req):
    emit('echoreply', req)


@socketio.event
def join(req):
    player = socketGetPlayer(req)
    data = req.get('data')
    room = data.get('room')
    if not room:
        socketError('room is a required field')
    join_room(data.get('room'))
    emit('onJoin', player.get('name') + ' joined the room.', room=room)


@socketio.event
def leave(req):
    player = socketGetPlayer(req)
    data = req.get('data')
    room = data.get('room')
    if not room:
        socketError('room is a required field')
    leave_room(data.get('room'))
    emit('onLeave', player.get('name') + ' left the room', room=request.sid)


socketio.init_app(app, cors_allowed_origins="*")

if __name__ == '__main__':
    socketio.run(app)
