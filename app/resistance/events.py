from server import socketio
import core.events
from flask_socketio import emit

#
# TODO
# convert to socket events:
#

# @app.route('/assign')
# @http.login_required
# def assign(player_id):
#     return jsonify(resistance.assign_roles())

# @app.route('/player_order')
# @http.login_required
# def initialise_player_order(player_id):
#     return jsonify(resistance.initialise_player_order())

# @app.route('/crew/<string:crew_member_ids>')
# @http.login_required
# def crew_select(player_id, crew_member_ids):
#     return jsonify(resistance.crew_selection(crew_member_ids))

# @app.route('/vote/<string:vote>')
# @http.login_required
# def crew_vote(player_id, vote):
#     return jsonify(resistance.vote_on_crew(vote))

# @app.route('/mission_vote/<string:mission_vote>')
# @http.login_required
# def mission_vote(player_id, mission_vote):
#     return jsonify(resistance.vote_on_mission(mission_vote))
