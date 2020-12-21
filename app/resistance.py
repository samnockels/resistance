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

    return spy_index
    
    for i in range(no_players):
        if(i not in spy_index):
            roles.append('resistance')
        else:
            roles.append('spy')
    
    players = store.get_players()
    for i, player in enumerate(players):
        store.assign_role(player.get('_id'), roles[i])