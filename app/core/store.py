from core.db import players, admin
import uuid


def id():
    uid = uuid.uuid4()
    while players.count_documents({"_id": uid}) > 0:
        uid = uuid.uuid4()
    return str(uid)


def init_game_master_pass(p):
    if admin.count_documents({}) < 1:
        admin.insert_one({
            "_id": "game-master-pass",
            "pass": p
        })


def validate_game_master_pass(p):
    return admin.find_one({"_id": "game-master-pass"})["pass"] == p
