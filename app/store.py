from pymongo import MongoClient
import uuid
from enum import Enum

client = MongoClient('resistance-db', 27017)
db = client.resistance
admin = db.admin
players = db.players
games = db.games
mission = db.mission
crew = db.crew

class GameStatus(Enum):
    NOT_STARTED = 0
    IN_GAME = 1
    FINISHED = 2


def error(e):
    return {
        "error": e
    }

#---------------------------------------#
#--------Start up game methods----------#
#---------------------------------------#

def id():
    uid = uuid.uuid4()
    while players.count_documents({ "_id": uid }) > 0:
        uid = uuid.uuid4()
    return str(uid)

def init_game_master_pass(p):
    if admin.count_documents({}) < 1:
        admin.insert_one({
            "_id": "game-master-pass",
            "pass": p
        })

def validate_game_master_pass(p):
    return admin.find_one({ "_id": "game-master-pass" })["pass"] == p

#---------------------------------------#
#-----------Create methods--------------#
#---------------------------------------#

def create_game(player_id, game_name):
    game_id=id()
    mission_id=id()
    crew_id = id()
    games.insert_one({
        '_id': game_id,
        'game_name':game_name,
        'created_by':player_id,
        'mission':[mission_id],
        'player_order':[player_id],
        'current_player_idx':0,
        'crew_selection':crew_id,
        'status': GameStatus.NOT_STARTED.value
    })


def initialise_players(player_ids):
    for player_id in player_ids:
        if(has_player_created_game(player_id) == True):
            return games.update_one({'created_by': player_id}, {'$set':{'player_order':player_ids}})

def create_crew(crew_member_ids):
    crew_id = get_crew_id()
    crew.insert_one({
        '_id': crew_id,
        'crew':crew_member_ids,
        'approval':{},
        'result':'unassigned',
    })

    games.update_one({'_id':'game_data'}, {'$set':{'crew_selection':crew_id}})


def create_player(name, avatar):
    if (players.count_documents({ "name": name }) > 0):
        return error('player-name-already-exists')
    return players.insert_one({
        "_id": id(),
        "name": name,
        "avatar": avatar,
        "role": "unassigned"
    }).inserted_id

def create_mission():
    mission_id = games.find_one({"_id":'game_data'})['mission'][0]
    crew_members = get_crew()
    no_crew = len(crew_members)

    crew = {}
    
    for crew_member in crew_members:
        crew[crew_member] = 'unassigned'

    return mission.insert_one({
        '_id': mission_id,
        'no_crew':no_crew,
        'crew':crew,
        'result':'unassigned',
    })

#---------------------------------------#
#------------GET methods----------------#
#---------------------------------------#

def get_games():
    return list(games.find())

def get_players():
    return list(players.find())

def get_player(id):
    results = list(players.find({ "_id": id }))
    if(len(results) == 0): 
        return False
    return results[0]

def get_no_players():
    players = get_players()
    return len(players)

def get_player_id(name):
    return players.find_one({"name" : name})['_id']

def name_is_available(name):
    return players.count_documents({ 'name': name }) == 0

def get_next_crew_number():
    return crew.count()

def get_players_already_voted_for_crew():
    crew_id = get_crew_id()
    votes = crew.find_one({"_id":crew_id})['approval']
    players_already_voted = list(votes.keys())
    return players_already_voted

def get_crew_votes():
    crew_id = get_crew_id()
    votes = crew.find_one({"_id":crew_id})['approval']
    return votes

def get_crew_id():
    crew_id = games.find_one({"_id" : 'game_data'})['crew_selection']
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

def get_mission_votes():
    mission_id = get_mission_id()
    mission_votes = mission.find_one({"_id":mission_id})['crew']
    return set(mission_votes.values())

def get_mission_id():
    missions = games.find_one({'_id':'game_data'})['mission']
    current_mission_id = missions[-1]
    return current_mission_id

def get_no_mission_crew():
    mission_id = get_mission_id()
    return mission.find_one({"_id":mission_id})['no_crew']

def get_game_id(player_id):
    return games.find_one({"created_by":player_id})['_id']

#---------------------------------------#
#-----------Update methods--------------#
#---------------------------------------#

def update_mission_crew(crew_ids):
    return games.update_one({'_id': 'game_data'}, {'$set':{'crew_selection':crew_ids}})

def update_votes_for_crew(_id, vote):
    crew_member_id = 'approval.' + _id
    crew_id = get_crew_id()

    return crew.update_one({"_id":crew_id}, {'$set':{crew_member_id:vote}})

def update_crew_result(result):
    crew_id = get_crew_id()
    return crew.update_one({'_id':crew_id}, {'$set':{'result':result}})

def update_mission_vote(player_id, vote):
    mission_id = get_mission_id()
    crew_member_id = 'crew.' + player_id
    return mission.update_one({'_id':mission_id}, {'$set':{crew_member_id:vote}})

#---------------------------------------#
#------------Delete methods-------------#
#---------------------------------------#

def delete_player(player_id):
    players.delete_one({ '_id': player_id })

#---------------------------------------#
#------------Other methods--------------#
#---------------------------------------#

def assign_role(player_id, role):
    return players.update_one({ "_id": player_id }, { '$set': { 'role': role } })

def select_next_player():
    current_player_index = games.find_one({'_id':'game_data'})['current_player_idx']
    next_player_index = current_player_index + 1

    no_players = get_no_players()

    if(next_player_index == no_players):
        next_player_index = 0

    return games.update_one({'_id':'game_data'}, {'$set':{'current_player_idx':next_player_index}})

def has_player_already_voted_mission(player_id):
    mission_id = get_mission_id()
    mission_votes = mission.find_one({"_id":mission_id})['crew']
    player_vote = mission_votes[player_id]

    if(player_vote == 'unassigned'):
        return False
    else:
        return True

def set_mission_result(result):
    mission_id = get_mission_id()
    return mission.update_one({'_id':mission_id}, {'$set':{'result':result}})

def has_player_created_game(player_id):
    if(games.find_one({'created_by':player_id})):
        return True

def join_game(player_id, game_name):
    games.update_one({'game_name':game_name}, {'$push': {'player_order': {'$each': [player_id]}}})