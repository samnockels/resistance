from flask import Flask
from flask_socketio import SocketIO
import routes.auth
from events import register_events
import store
import os

socketio = SocketIO()
print(__name__)
app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'gjr38dkjn344_!67#'

# Seed the database
store.init_game_master_pass(os.environ['GAME_MASTER_PASS'])

# Register http routes
app.register_blueprint(routes.auth.app, url_prefix='/')
# app.register_blueprint(routes.game.app, url_prefix='/game')
# app.register_blueprint(routes.player.app, url_prefix='/player')


@app.after_request
def apply_cors_headers(response):
    """Enable CORS"""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response


# Register socketio events
register_events(socketio)
socketio.init_app(app, cors_allowed_origins="*")

if __name__ == '__main__':
    socketio.run(app)
