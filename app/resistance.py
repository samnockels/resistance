import store
import random
import math

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

    no_players = store.get_no_players()
    players_already_voted = store.get_players_already_voted_for_crew()

    if(_id not in players_already_voted):
        store.update_votes_for_crew(_id, vote) 

        if(len(players_already_voted)+1 == no_players):
            was_crew_vote_approved = was_vote_approved()
            
            if(was_crew_vote_approved == True):
                store.update_crew_result('Approved')
            else:
                store.update_crew_result('Rejected')

            #Crew was accepted
            if(was_crew_vote_approved == True):
                mission()
            
            #Select next player
            store.select_next_player()
            
        else:
            return ['Not every player has voted']

    else:
        return ['Player has already voted for the crew']
    

def was_vote_approved():

    player_votes = store.get_crew_votes()
    votes = player_votes.values()

    no_votes = len(votes)
    no_approvals_needed = no_votes/2

    #Vote tie is a rejection
    if(isinstance(no_approvals_needed, float)):
        no_approvals_needed = math.ceil(no_approvals_needed)
    else:
        no_approvals_needed +=1

    no_approves = 0

    for vote in votes:
        if vote == 'approve':
            no_approves +=1

    #If majority approve crew
    if no_approves >= no_approvals_needed:
        return True
    #If majority reject crew
    else:
        return False

def mission():
    store.create_mission()

    crew_members = store.get_crew()

    for member in crew_members:
        role = store.get_role(member)
        
        # if(role=='spy'):
        #     #Give success and fail card
        # else:
        #     #Only give success card

def vote_on_mission(vote):
    id_vote = vote.split('&')
    _id = id_vote[0]
    vote = id_vote[1]

    has_player_already_voted = store.has_player_already_voted_mission(_id)

    if(has_player_already_voted == True):
        return ['Player has already voted for the mission']
    else:
        store.update_mission_vote(_id, vote)

        mission_votes = store.get_mission_votes()

        #If every crew member has voted update outcome of vote
        if('unassigned' not in mission_votes):
            if('fail' in mission_votes):
                store.set_mission_result('fail')
                return ['Mission failed']
            else:
                store.set_mission_result('success')
                return ['Mission succeeded']

        else:
            return ['Not every crew member has voted']

