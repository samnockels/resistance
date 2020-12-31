from pymongo import MongoClient

client = MongoClient('resistance-db', 27017)
db = client.resistance

# collections
admin = db.admin
players = db.players
games = db.games
mission = db.mission
crew = db.crew
