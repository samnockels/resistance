from pymongo import MongoClient
import uuid

client = MongoClient('resistance-db', 27017)
db = client.resistance
players = db.players
game = db.game
mission = db.mission
crew = db.crew

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
    return game.find_one({ "_id": "game-master-pass" })["pass"] == p

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

def get_player_id(name):
    return players.find_one({"name" : name})['_id']

def get_next_crew_number():
    return crew.count()

def initialise_players(player_ids):
    return game.insert_one({
        '_id': 'game_data',
        'mission':['mission1'],
        'player_order':player_ids,
        'current_player_idx':0,
        'crew_selection':'crew1'
    })

def update_mission_crew(crew_ids):
    return game.update_one({'_id': 'game_data'}, {'$set':{'crew_selection':crew_ids}})

def create_crew(crew_member_ids):
    crew_id = id()
    crew.insert_one({
        '_id': crew_id,
        'crew':crew_member_ids,
        'approval':{},
        'result':'unassigned',
    })

    game.update_one({'_id':'game_data'}, {'$set':{'crew_selection':crew_id}})

def update_votes_for_crew(_id, vote):
    crew_member_id = 'approval.' + _id
    crew_id = game.find_one({"_id" : 'game_data'})['crew_selection']

    return crew.update_one({"_id":crew_id}, {'$set':{crew_member_id:vote}})

def get_players_already_voted_for_crew():
    crew_id = game.find_one({"_id" : 'game_data'})['crew_selection']
    votes = crew.find_one({"_id":crew_id})['approval']
    players_already_voted = list(votes.keys())

    return players_already_voted

def get_crew_votes():
    crew_id = game.find_one({"_id" : 'game_data'})['crew_selection']
    votes = crew.find_one({"_id":crew_id})['approval']
    
    return votes