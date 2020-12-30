from flask import Flask, jsonify, request, session, Blueprint
import resistance
import store
import util
import crypto
#
# Game routes at '/game'
#

app = Blueprint('game', __name__)

# TODO
valid_games = [
    'resistance'
]


@app.route('/<string:game_id>', methods=['GET'])
@util.login_required
def players_in_lobby(player_id, game_id):
    game = store.get_game(game_id)
    if(not game):
        return util.error('game-not-exists', 'Game not found')
    return jsonify(game)


@app.route('/create', methods=['POST'])
@util.login_required
def create_game(player_id):
    [isValid, errors] = util.validate(request.json, {
        'name': {
            'type': 'string',
            'minlength': 3
        },
        'game': {
            'type': 'string',
            'oneof': valid_games
        },
    })

    if not isValid:
        return errors

    games = store.get_games()
    for g in games:
        if g.get('name') == name:
            return util.error('game-name-already-exists', 'That game name already exists!')

    game_id = resistance.create_game(player_id, name, game)

    return jsonify(store.get_game(game_id))


@app.route('/list', methods=['GET'])
@util.login_required
def list_games(player_id):
    return jsonify(store.get_games())


@app.route('/join/<string:game_id>', methods=['POST'])
@util.login_required
def join_game(player_id, game_id):
    return jsonify(resistance.join_game(player_id, game_id))


@app.route('/leave/<string:game_id>', methods=['POST'])
@util.login_required
def leave_game(player_id, game_id):
    return jsonify(["todo"])
