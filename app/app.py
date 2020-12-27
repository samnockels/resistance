from flask import Flask, jsonify, request, session
import resistance
import store
import os 
import util
from flask_socketio import SocketIO, emit, join_room, leave_room, send
import crypto
import string
import random

store.init_game_master_pass(os.environ['GAME_MASTER_PASS'])
app = Flask(__name__)

# app.secret_key = b'_5#y2L"FaSFLKASFNSNKLa3q3gNM4Q8z\n\xec]/'
# app.config['SECRET_KEY'] = 'secret!'
# socketio = SocketIO(app, logger=True, engineio_logger=True)
# socketio.run(app)
# socketio.init_app(app, cors_allowed_origins="*")

# @socketio.on('connect')
# def test_connect():
#     # clients.append(request.sid)
#     emit('connection', {'sid': request.sid})
#     emit('msg', 'testtt')

# @socketio.on('disconnect')
# def test_disconnect():
#     # clients.remove(request.sid)
#     print('Client disconnected')

@app.after_request
def apply_cors_headers(response):
  response.headers["Access-Control-Allow-Origin"] = "*"
  response.headers["Access-Control-Allow-Headers"] = "*"
  return response

#
# Routes
#

#
# Auth
#

@app.route('/game_master_verify', methods=['post'])
@util.login_required
def game_master_verify():
  success = store.validate_game_master_pass(
      util.get_request_body().get("password"))
  return {
      "success": success
  }


@app.route('/check_name/<string:name>', methods=['get'])
def check_name(name):
  return jsonify({
    "available": store.name_is_available(name)
  })



@app.route('/enter', methods=['post'])
def enter():
  player = util.get_request_body()

  name = player.get('name')
  avatar = player.get('avatar')

  if(not name):
    return util.error('name-invalid', 'Please provide a name!')
  
  if(not avatar):
    letters = 'qwertyuiopasdfghjklzxcvbnm'
    avatar = 'https://avatars.dicebear.com/api/bottts/'+''.join(random.choice(letters) for i in range(10))+'.svg'
  
  if(len(name) < 3):
    return util.error('name-invalid', 'Name must be at least 3 characters long!')
  
  if (not store.name_is_available(name)):
    return util.error('player-name-already-exists', 'That player name already exists!')
  
  player_id = store.create_player(name, avatar)
  
  return jsonify({
    "token": crypto.encrypt(player_id),
    "debug": {
      "name": name,
      "avatar": avatar
    }
  })


@app.route('/whoami', methods=['get'])
@util.login_required
def whoAmI(player_id):
  player = store.get_player(player_id)
  return jsonify({
    'me': player
  })

@app.route('/logout')
@util.login_required
def logout(player_id):
  store.delete_player(player_id)
  return jsonify({
    "message": "bye felicia"
  })

#
# Game
#

@app.route('/players', methods=['GET'])
@util.login_required
def players(player_id):
  return jsonify(store.get_players())

@app.route('/players/<string:id>', methods=['GET'])
@util.login_required
def get_player(player_id, id):
  player = store.get_player(id)
  if(not player):
    return jsonify({ "name": '-' })
  return jsonify(players[0])

@app.route('/create_game/<string:info>')
@util.login_required
def create_game(player_id, info):
  [player_id, game_name] = info.split('&')
  games = store.get_games()
  for game in games:
    if game.get('game_name') == game_name:
      return util.error('game-name-already-exists', 'That game name already exists!')
  resistance.create_game(player_id, game_name)
  return jsonify({
    "success": True
  })

@app.route('/list_games')
@util.login_required
def list_games(player_id):
  return jsonify(store.get_games())

@app.route('/join_game/<string:info>')
@util.login_required
def join_game(player_id, info):
  return jsonify(resistance.join_game(info))

@app.route('/assign')
@util.login_required
def assign(player_id):
  return jsonify(resistance.assign_roles())

@app.route('/player_order')
@util.login_required
def initialise_player_order(player_id):
  return jsonify(resistance.initialise_player_order())

@app.route('/crew/<string:crew_member_ids>')
@util.login_required
def crew_select(player_id, crew_member_ids):
  return jsonify(resistance.crew_selection(crew_member_ids))

@app.route('/vote/<string:vote>')
@util.login_required
def crew_vote(player_id, vote):
  return jsonify(resistance.vote_on_crew(vote))

@app.route('/mission_vote/<string:mission_vote>')
@util.login_required
def mission_vote(player_id, mission_vote): 
  return jsonify(resistance.vote_on_mission(mission_vote))
