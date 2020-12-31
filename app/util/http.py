from functools import wraps
from flask import Flask, jsonify, request, session
import traceback
from resistance import store
from util import crypto
from cerberus import Validator

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
        AUTH_HEADER = 'Authorization'
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


def validate(document, schema):
    """return [isValid, errors]"""
    v = Validator(schema)
    valid = v.validate(document)
    if(valid):
        return [True, {}]
    return [False, v.errors]


def validateField(fieldName, field, schema):
    """return [isValid, errors]"""
    document = {}
    document[fieldName] = field
    return validate(document, schema)
