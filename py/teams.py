from itertools import count
import json
from optparse import TitledHelpFormatter


def createTeams(bracket_json, PlayersPerTeam, bracket_stage):
    # json.load(json_file)
    with open(f"./{bracket_json}", 'r+') as br:
        bracket = json.load(br)
    teams = bracket["Teams"]

    print(teams)

    counter = 1

    while counter <= int(bracket_stage):
        print(f"Team/player: {counter}")

        name = input("Team/player name?")

        acronym = input("Team/player acronym?")

        flag = input("Team/player flag?")

        seed = input("Overall bracket seed?")

        players = []

        while len(players) + 1 <= int(PlayersPerTeam):
            player_id = input(f"Player {len(players) + 1}'s ID?")
            players.append({"id": player_id})

        team = {"FullName": name, "FlagName": flag,
                "Acronym": acronym, "Seed": seed, "Players": players}

        counter += 1
        # with open(json_file["Teams"], 'w') as fp:
        #     json.dump(team, fp, indent=2, separators=(',', ': '))\

        bracket["Teams"].append(team)

        # with open(bracket_json, 'r+') as fp:
        #     team_data = json.load(fp)
        #     team_data["Teams"].append(teams)
        #     fp.seek(0)
        #     json.dump(team_data, fp, indent=2, separators=(',', ': '))

    print(teams)

    json.dump(bracket, br, indent=2, separators=(',', ': '))
