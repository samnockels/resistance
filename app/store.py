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

def get_no_players():
    players = get_players()
    return len(players)

def assign_role(player_id, role):
    return players.update_one({ "_id": player_id }, { '$set': { 'role': role } })

def get_player_id(name):
    return players.find_one({"name" : name})['_id']

def get_next_crew_number():
    return crew.count()

def initialise_players(player_ids):
    mission_id=id()
    crew_id = id()
    return game.insert_one({
        '_id': 'game_data',
        'mission':[mission_id],
        'player_order':player_ids,
        'current_player_idx':0,
        'crew_selection':crew_id
    })

def update_mission_crew(crew_ids):
    return game.update_one({'_id': 'game_data'}, {'$set':{'crew_selection':crew_ids}})

def create_crew(crew_member_ids):
    crew_id = get_crew_id()
    crew.insert_one({
        '_id': crew_id,
        'crew':crew_member_ids,
        'approval':{},
        'result':'unassigned',
    })

    game.update_one({'_id':'game_data'}, {'$set':{'crew_selection':crew_id}})

def update_votes_for_crew(_id, vote):
    crew_member_id = 'approval.' + _id
    crew_id = get_crew_id()

    return crew.update_one({"_id":crew_id}, {'$set':{crew_member_id:vote}})

def get_players_already_voted_for_crew():
    crew_id = get_crew_id()
    votes = crew.find_one({"_id":crew_id})['approval']
    players_already_voted = list(votes.keys())

    return players_already_voted

def get_crew_votes():
    crew_id = get_crew_id()
    votes = crew.find_one({"_id":crew_id})['approval']
    
    return votes

def select_next_player():
    current_player_index = game.find_one({'_id':'game_data'})['current_player_idx']
    next_player_index = current_player_index + 1

    no_players = get_no_players()

    if(next_player_index == no_players):
        next_player_index = 0

    game.update_one({'_id':'game_data'}, {'$set':{'current_player_idx':next_player_index}})

def update_crew_result(result):
    crew_id = get_crew_id()
    crew.update_one({'_id':crew_id}, {'$set':{'result':result}})

def create_mission():
    mission_id = game.find_one({"_id":'game_data'})['mission'][0]
    crew_members = get_crew()
    no_crew = len(crew_members)

    crew = {}
    
    for crew_member in crew_members:
        crew[crew_member] = 'unassigned'

    mission.insert_one({
        '_id': mission_id,
        'no_crew':no_crew,
        'crew':crew,
        'result':'unassigned',
    })

def get_crew_id():
    crew_id = game.find_one({"_id" : 'game_data'})['crew_selection']
    return crew_id

def get_crew():
    crew_id = get_crew_id()
    crew_members = crew.find_one({'_id':crew_id})['crew']
    return crew_members

def get_no_crew():
    crew = get_crew()
    return len(crew)

def get_role(player_id):
    return players.find_one({'_id':player_id})['role']

def has_player_already_voted_mission(player_id):
    mission_id = get_mission_id()
    mission_votes = mission.find_one({"_id":mission_id})['crew']
    player_vote = mission_votes[player_id]

    if(player_vote == 'unassigned'):
        return False
    else:
        return True

def get_mission_id():
    missions = game.find_one({'_id':'game_data'})['mission']
    current_mission_id = missions[-1]
    
    return current_mission_id

def update_mission_vote(player_id, vote):
    mission_id = get_mission_id()
    crew_member_id = 'crew.' + player_id
    return mission.update_one({'_id':mission_id}, {'$set':{crew_member_id:vote}})

def get_no_mission_crew():
    mission_id = get_mission_id()
    return mission.find_one({"_id":mission_id})['no_crew']

def get_mission_votes():
    mission_id = get_mission_id()
    mission_votes = mission.find_one({"_id":mission_id})['crew']
    return set(mission_votes.values())

def set_mission_result(result):
    mission_id = get_mission_id()
    return mission.update_one({'_id':mission_id}, {'$set':{'result':result}})

# mission = {
#     id: 'mission1'
#     nocrew: 2
#     crew = {
#         'alice': 'success/fail'
#         'conor': 'success/fail'
#     }
#     result = 'success/fail'
# }