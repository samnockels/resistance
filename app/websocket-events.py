app.config['SECRET_KEY'] = 'secret!'
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