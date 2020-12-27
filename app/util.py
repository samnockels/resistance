from functools import wraps
from flask import Flask, jsonify, request, session
import store
import crypto

AUTH_HEADER = 'Authorization'


def login_required(f):
	@wraps(f)
	def decorated_function(*args, **kwargs):
		UNAUTHORIZED = jsonify({
				"error": {
						"message": "Please log in to continue!",
				}
		})
		if AUTH_HEADER not in request.headers:
			return UNAUTHORIZED
		try:
			player_id = crypto.decrypt(request.headers[AUTH_HEADER])
			player = store.get_player(player_id)
			if (not player):
				return UNAUTHORIZED
			return f(player_id, *args, **kwargs)
		except:
			return UNAUTHORIZED
	return decorated_function

def error(id, message): 
  return jsonify({
      "error": {
        "id": id,
        "message": message,
      },
    })

def get_request_body():
  return request.json['body']
