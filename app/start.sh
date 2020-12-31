#!/bin/sh

export FLASK_APP=server.py
export FLASK_RUN_HOST=0.0.0.0
export GAME_MASTER_PASS=resistanceiscool
export FLASK_ENV=development
export FLASK_DEBUG=1
export PYTHONPATH=/app
export FLASK_RUN_PORT=5002

python server.py