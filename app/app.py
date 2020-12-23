from flask import Flask, jsonify, request
import resistance
import store
import os 
from flask_socketio import SocketIO, emit, join_room, leave_room, send

store.init_game_master_pass(os.environ['GAME_MASTER_PASS'])

app = Flask(__name__)

def get_request_body():
  return request.json.get("body")

@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

@app.route('/login', methods=['post'])
def login():
  success = store.validate_game_master_pass(get_request_body().get("password"))
  return {
    "success": success
  }

@app.route('/players', methods=['GET'])
def players():
  return jsonify(store.get_players())

@app.route('/create_game/<string:info>')
def create_game(info):
  return jsonify(resistance.create_game(info))

@app.route('/list_games')
def list_games():
  return jsonify(store.get_games())

@app.route('/join_game/<string:info>')
def join_game(info):
  return jsonify(resistance.join_game(info))

@app.route('/create_player/<string:name>')
def enter(name):
  return jsonify({
    "uid": store.create_player(name)
  })

@app.route('/assign')
def assign(): 
  return jsonify(resistance.assign_roles())

@app.route('/player_order')
def initialise_player_order(): 
  return jsonify(resistance.initialise_player_order())

@app.route('/crew/<string:crew_member_ids>')
def crew_select(crew_member_ids): 
  return jsonify(resistance.crew_selection(crew_member_ids))

@app.route('/vote/<string:vote>')
def crew_vote(vote): 
  return jsonify(resistance.vote_on_crew(vote))

@app.route('/mission_vote/<string:mission_vote>')
def mission_vote(mission_vote): 
  return jsonify(resistance.vote_on_mission(mission_vote))