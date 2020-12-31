from flask_socketio import emit
from server import socketio
import util.crypto as crypto
import resistance.store as store

"""
List of connected clients 
Format: {
  'player_id': { # player object } 
}
"""
clients = {}


#---------------------------------------#
#----------------Helpers----------------#
#---------------------------------------#


def socketError(message):
    emit('error', message)
    raise Exception(message)


def socketGetPlayer(req):
    player_id = crypto.decrypt(req.get('auth'))
    player = store.get_player(player_id)
    if not player:
        socketError('socketGetPlayer - player not found')
    if not clients.get(player_id):
        clients[player_id] = player
    # update the sid
    clients[player_id]['sid'] = request.sid
    return player
