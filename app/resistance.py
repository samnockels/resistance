import store
import random

def assign_roles():
    data = {5:2, 6:2, 7:3, 8:3, 9:3, 10:4}
    players = store.get_players()
    no_players = len(players)
    player_index = list(range(0, no_players))
    no_spies = data[no_players]
    spy_index = random.sample(player_index, no_spies)
    roles = []
    
    for i in range(no_players):
        if(i not in spy_index):
            roles.append('resistance')
        else:
            roles.append('spy')
    
    players = store.get_players()
    for i, player in enumerate(players):
        store.assign_role(player.get('_id'), roles[i])

# initialise player_order
def initialise_player_order():
    players = store.get_players()
    random.shuffle(players)

    player_ids = []
    for i in range(len(players)):
        player_ids.append(players[i]['_id'])
    
    store.initialise_players(player_ids)

#Initialise crew selected
def crew_selection(crew_member_ids):
    crew_member_ids = crew_member_ids.split('&')
    # store.update_mission_crew(crew_ids)
    store.create_crew(crew_member_ids)

#Handle crew votes and when every person hasd voted on the crew return 'All players voted'
#Only let a player vote for the crew once
def vote_on_crew(vote):
    id_vote = vote.split('&')
    _id = id_vote[0]
    vote = id_vote[1]

    no_players = int(len(store.get_players()))
    players_already_voted = store.get_players_already_voted_for_crew()

    if(_id not in players_already_voted):
        store.update_votes_for_crew(_id, vote) 

        if(len(players_already_voted)+1 == no_players):
            return determine_vote_result()
            # return ['All players voted']
        else:
            return ['Not every player has voted']

    else:
        return ['Player has already voted for the crew']
    

def determine_vote_result():

    votes = store.get_crew_votes()

    return votes