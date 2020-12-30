import random


def assign_roles(no_players):
    # Assign each player a role

    data = {5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 4}

    player_index = list(range(0, no_players))
    no_spies = data[no_players]
    spy_index = random.choices(player_index, weights=None, k=no_spies)
    roles = []

    for i in range(no_players):
        if(i not in spy_index):
            roles.append('resistance')
        else:
            roles.append('spy')

    roles_json = {'roles': roles}
    return roles_json


def get_no_crew(no_players):

    data = {5: [2, 3, 2, 3, 3], 6: [2, 3, 4, 3, 4], 7: [2, 3, 3, 4, 4], 8: [
        3, 4, 4, 5, 5], 9: [3, 4, 4, 5, 5], 10: [3, 4, 4, 5, 5]}

    no_crew = data[no_players]
    no_crew_json = {'crew': no_crew}

    return no_crew_json


if __name__ == "__main__":
    print(assign_roles(7))
    print(get_no_crew(7))


# admin starts lobby
# players join
# admin starts game
# assign roles - done
# frontend lets spys see eachother
# initialise player_order  - done
# select current_player
# game loop:
# 1. current player picks crew - done
#    - set game.crew_selection - done
# 2. players vote on crew - done
# 3. if majority reject: - done
#    - increment game.current_player_idx - done
#    - select next player
# 4. if majority approve: - done
#    - copy crew into mission - done
#    - add mission id to game.missions -done
#    - give crew succeed/fail buttons depending on role
#    - crew succeed/fail mission - done
#    - Calculate if mission succeeded or not - done
#     - return number of fails from mission
# 5. increment game.current_player_idx - done
# 6. if all missions complete:
#    - decide winner
# 7. else goto 1

# game = {
#     missions = ['mission1']
#     player_order = ['alice', 'sam', 'conor']
#     current_player_idx = 0
#     crew_selection = 'crew1'
# }

# players = {
#     id: str
#     name: str
#     role: spy resistance
# }

# mission = {
#     id: 'mission1'
#     nocrew: 2
#     crew = {
#         'alice': 'success/fail'
#         'conor': 'success/fail'
#     }
#     result = 'success/fail'
# }

# crew = {
#     id: 'crew1'
#     crew = ['alice', 'conor']
#     approval = {
#         'sam': 'approve/reject'
#     }
#     result = 'approved/rejected'
# }
