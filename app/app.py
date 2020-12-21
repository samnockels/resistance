from flask import Flask, jsonify
import resistance
import store
import os 

app = Flask(__name__)
store.init_game_master_pass(os.environ['GAME_MASTER_PASS'])

def format(data):
  return json.dumps(data)

@app.route('/', methods=['GET'])
def hello_world():
  return jsonify({
    "players": resistance.get_players()
  })

@app.route('/enter/<string:name>')
def enter(name):
  return jsonify({
    "uid": store.insert_player(name)
  })

@app.route('/assign')
def assign(): 
  return jsonify(resistance.assign_roles())