from flask import Flask, jsonify, request
import resistance
import store
import os 
from flask_socketio import SocketIO, emit, join_room, leave_room, send

store.init_game_master_pass(os.environ['GAME_MASTER_PASS'])

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, logger=True, engineio_logger=True)
socketio.run(app)
socketio.init_app(app, cors_allowed_origins="*")

clients = []
room_name = 'resistance'
room = []

@socketio.on('show_room')
def handle_json(json):
    emit('received json: ' + str(json))

@socketio.on('connect')
def test_connect():
    clients.append(request.sid)
    emit('connection', {'data': clients})
    emit('msg', 'testtt')

@socketio.on('disconnect')
def test_disconnect():
    clients.remove(request.sid)
    print('Client disconnected')

@socketio.on('join')
def on_join(data):
    app.logger.debug('join1')
    username = data['username']
    join_room(room_name)
    app.logger.debug('join2')
    send(username + ' has entered the room ')
    app.logger.debug('join23')

@socketio.on('leave')
def on_leave(data):
    app.logger.debug('leave1')
    username = data['username']
    leave_room(room_name)
    app.logger.debug('leave2')
    send(username + ' has left the room ')

# def get_request_body():
#   return request.json.get("body")

@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# @socketio.event
# def login():
# #   success = store.validate_game_master_pass(get_request_body().get("password"))
#   return {
#     "success": success
#   }

# @app.route('/players', methods=['GET'])
# def players():
#   return jsonify({
#     "players": store.get_players()
#   })

# @app.route('/enter/<string:name>')
# def enter(name):
#   return jsonify({
#     "uid": store.insert_player(name)
#   })

# @app.route('/assign')
# def assign(): 
#   return jsonify(resistance.assign_roles())