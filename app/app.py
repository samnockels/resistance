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

@app.route('/', methods=['GET'])
def hello_world():
  return jsonify({
    "players": store.get_players()
  })

@app.route('/enter/<string:name>')
def enter(name):
  return jsonify({
    "uid": store.insert_player(name)
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

@app.route('/test')
def test():
  return jsonify([store.get_number_votes_for_crew()])
