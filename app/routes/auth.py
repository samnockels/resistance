from flask import Flask, jsonify, request, session, Blueprint
from util import http, crypto

#
# Auth routes at '/'
#

app = Blueprint('auth', __name__)


@app.route('/enter', methods=['POST'])
def enter():
    [isValid, errors] = http.validate(request.json, {
        'name': {
            'type': 'string',
            'minlength': 3
        },
        'avatar': {
            'type': 'string',
        },
        'adminPassword': {
            'type': 'string',
            'empty': True
        }
    })

    if not isValid:
        return errors

    isAdmin = False
    player = request.json
    name = player.get('name')
    avatar = player.get('avatar')
    adminPassword = player.get('adminPassword')

    if (not store.name_is_available(name)):
        return http.error('player-name-already-exists', 'That player name already exists!')

    if(adminPassword):
        if(not store.validate_game_master_pass(adminPassword)):
            return http.error('password-invalid', 'Password incorrect!')
        isAdmin = True

    player_id = store.create_player(name, avatar, isAdmin=isAdmin)

    return jsonify({
        "token": crypto.encrypt(player_id),
        "debug": {
            "request-body": player
        }
    })


@app.route('/check_name/<string:name>', methods=['GET'])
def check_name(name):
    return jsonify({
        "available": store.name_is_available(name)
    })


@app.route('/whoami', methods=['GET'])
@http.login_required
def whoAmI(player_id):
    player = store.get_player(player_id)
    return jsonify({
        'me': player
    })


@app.route('/logout')
@http.login_required
def logout(player_id):
    store.delete_player(player_id)
    return jsonify({
        "message": "bye felicia"
    })
