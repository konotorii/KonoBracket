import json
import os
from py.mappools import *
from py.teams import *

session_txt = 'session.json'
bracket_json = "bracket.json"
bracket = []
bracket_name = ""

ruleset: int
bracket_stage: str
bracket_type: str
playersperteam: int


mappool = []

session = []


def write_json(target_path, target_file, data):
    if not os.path.exists(target_path):
        try:
            os.makedirs(target_path)
        except Exception as e:
            print(e)
            raise
    with open(os.path.join(target_path, target_file), 'w') as f:
        json.dump(data, f)


def createSession():
    print("What gamemode is the tournament?\n1: osu!\n2: taiko\n3: catch\n4: mania")
    ruleset = input("")
    session.append({"Ruleset": ruleset})

    print("What bracket stage is the tournament?\n1: Ro64 (Round of 64)\n2: Ro32 (Round of 32)\n3: Ro16 (Round of 16)")
    bracket_stage = input("")
    session.append({"Bracket Stage": bracket_stage})

    print("What bracket type is the tournament?\n1: Double Elimination\n2: Single Elimination")
    bracket_type = input("")
    session.append({"Bracket Type": bracket_type})

    print("How many players per team?")
    playersperteam = input("")
    session.append({"Players per Team": playersperteam})

    with open(session_txt, 'w') as fp:
        json.dump(session, fp, indent=2, separators=(',', ': '))


def makeBracket():
    if os.path.exists(session_txt) is False:
        createSession()

    else:
        changeSessionInfo = input(
            "Would you like to change your session settings? (y/N)")
        if (changeSessionInfo == "y"):
            createSession()

        with open(session_txt, 'r') as session_txt_open:
            deets = json.load(session_txt_open)

        if (deets[0]['Ruleset'] == "1"):
            bracket_name = f"./configs/osu_{bracket_json}"
            with open(f"./configs/osu_{bracket_json}") as br:
                bracket = json.load(br)

        print(bracket)
        # print(deets)

        write_json('./', bracket_json, bracket)

        print("\nLet's get started by adding all the teams/players...\n")

        createTeams(bracket_json, deets[3]['Players per Team'], deets[1]['Bracket Stage'])


def initial():
    makeBracket()


initial()
