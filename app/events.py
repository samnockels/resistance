from flask_socketio import emit, join_room, leave_room, Blueprint
from server import socketio


@socketio.on('hello')
def hello(*args):
    emit('helloworld', args)

# @socketio.on('connect')
# def test_connect():
#     clients.append(request.sid)
#     emit('connection', {'data': clients})
#     emit('msg', 'testtt')

# @socketio.on('disconnect')
# def test_disconnect():
#     clients.remove(request.sid)
#     print('Client disconnected')

# @socketio.on('join')
# def on_join(data):
#     app.logger.debug('join1')
#     username = data['username']
#     join_room(room_name)
#     app.logger.debug('join2')
#     send(username + ' has entered the room ')
#     app.logger.debug('join23')

# @socketio.on('leave')
# def on_leave(data):
#     app.logger.debug('leave1')
#     username = data['username']
#     leave_room(room_name)
#     app.logger.debug('leave2')
#     send(username + ' has left the room ')

# #
# # TODO
# # resistance stuff
# #

# @app.route('/assign')
# @util.login_required
# def assign(player_id):
#     return jsonify(resistance.assign_roles())

# @app.route('/player_order')
# @util.login_required
# def initialise_player_order(player_id):
#     return jsonify(resistance.initialise_player_order())

# @app.route('/crew/<string:crew_member_ids>')
# @util.login_required
# def crew_select(player_id, crew_member_ids):
#     return jsonify(resistance.crew_selection(crew_member_ids))

# @app.route('/vote/<string:vote>')
# @util.login_required
# def crew_vote(player_id, vote):
#     return jsonify(resistance.vote_on_crew(vote))

# @app.route('/mission_vote/<string:mission_vote>')
# @util.login_required
# def mission_vote(player_id, mission_vote):
#     return jsonify(resistance.vote_on_mission(mission_vote))
