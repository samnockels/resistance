from pymongo import MongoClient
import uuid

client = MongoClient('resistance-db', 27017)
db = client.resistance
players = db.players
game = db.game

def error(e):
    return {
        "error": e
    }

def id():
    uid = uuid.uuid4()
    while players.count_documents({ "_id": uid }) > 0:
        uid = uuid.uuid4()
    return str(uid)

def init_game_master_pass(p):
    if game.count_documents({}) < 1:
        game.insert_one({
            "_id": "game-master-pass",
            "pass": p
        })

def validate_game_master_pass(p):
    return game.find_one({ _id: "game-master-pass" })["pass"] == p

def insert_player(name):
    if (players.count_documents({ "name": name }) > 0):
        return error('player-name-already-exists')
    return players.insert_one({
        "_id": id(),
        "name": name,
        "role": "unassigned"
    }).inserted_id

def get_players():
    return list(players.find())

def assign_role(player_id, role):
    return players.update_one({ "_id": player_id }, { '$set': { 'role': role } })