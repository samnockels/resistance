import random

#Assign each player a role
def assign_roles(no_players):    

    data = {5:2, 6:2, 7:3, 8:3, 9:3, 10:4}

    player_index = list(range(0, no_players))
    no_spies = data[no_players]
    spy_index = random.choices(player_index, weights=None, k=no_spies)
    roles = []
    
    for i in range(no_players):
        if(i not in spy_index):
            roles.append('resistance')
        else:
            roles.append('spy')

    roles_json = {'roles':roles}
    return roles_json

def get_no_crew(no_players):

    data = {5:[2,3,2,3,3], 6:[2,3,4,3,4], 7:[2,3,3,4,4],8:[3,4,4,5,5],9:[3,4,4,5,5],10:[3,4,4,5,5]}

    no_crew = data[no_players]
    no_crew_json = {'crew':no_crew}

    return no_crew_json

if __name__ == "__main__":
    print(assign_roles(7))
    print(get_no_crew(7))

