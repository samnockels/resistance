from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import os

import routes.auth
import routes.game
import routes.player
from core.store import init_game_master_pass

socketio = SocketIO()
app = Flask(__name__)


def init():
    print('init()')
    app.debug = True
    app.config['SECRET_KEY'] = 'gjr38dkjn344_!67#'

    # seed the database
    init_game_master_pass(os.environ['GAME_MASTER_PASS'])

    # register http routes
    print('1. registring routes')
    app.register_blueprint(routes.auth.app, url_prefix='/')
    app.register_blueprint(routes.game.app, url_prefix='/game')
    app.register_blueprint(routes.player.app, url_prefix='/player')

    # cors
    @app.after_request
    def apply_cors_headers(response):
        """Enable CORS test"""
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

    # register socket events
    print('2. registring events')
    import core.events
    import resistance.events

    socketio.init_app(app, cors_allowed_origins="*")


init()
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
