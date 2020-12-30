from flask import Flask, jsonify, request, session, Blueprint
import resistance
import store
import util
import crypto

#
# Player routes at '/player'
#

app = Blueprint('player', __name__)


@app.route('/<string:id>', methods=['GET'])
@util.login_required
def get_player(player_id, id):
    player = store.get_player(id)
    if(not player):
        return jsonify({"name": '-'})
    return jsonify(players[0])


@app.route('/list', methods=['GET'])
@util.login_required
def list_players(player_id):
    return jsonify(store.get_players())
