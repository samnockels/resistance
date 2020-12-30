from functools import wraps
from flask import Flask, jsonify, request, session
import store
import crypto
import traceback
from cerberus import Validator

AUTH_HEADER = 'Authorization'
SHOW_DEBUG = True


def unauthorized(debug):
    err = {
        "message": "Please log in to continue!",
    }
    if(debug and SHOW_DEBUG):
        err['debug'] = debug
    return jsonify({
        "error": err
    })


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if AUTH_HEADER not in request.headers:
            return unauthorized('auth header not set')
        try:
            player_id = crypto.decrypt(request.headers[AUTH_HEADER])
            player = store.get_player(player_id)
            if (not player):
                return unauthorized('player not found')
            return f(player_id, *args, **kwargs)
        except Exception as e:
            return unauthorized(str(e))
    return decorated_function


def error(id, message):
    return jsonify({
        "error": {
            "id": id,
            "message": message,
        },
    })


def get_request_body():
    return request.json

# return [isValid, errors]


def validate(document, schema):
    v = Validator(schema)
    valid = v.validate(document)
    if(valid):
        return [True, {}]
    return [False, v.errors]

# return [isValid, error]


def validateField(fieldName, field, schema):
    document = {}
    document[fieldName] = field
    return validate(document, schema)
