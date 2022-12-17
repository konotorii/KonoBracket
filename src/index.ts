import { Player } from './../interfaces/player';
import { Bracket } from './../interfaces/main';
import * as fs from "fs";
import * as path from "path";
import * as readline from 'readline'
import { DateTime } from 'luxon';
import { join } from 'path';
import { parse } from 'csv-parse';
import delay from 'delay';
import * as dotenv from 'dotenv';
dotenv.config();
const consola = require('consola');
import superagent = require('superagent');
import env from '../env.config';

async function main() {
    const env_check = await checkEnv()
    if (env_check) consola.success('.env loaded and verified.')

    // Check if file exists
    if (!fs.existsSync('../bracket.json')) {
        const dummy_data: Bracket = {
            Ruleset: {
                "ShortName": "osu",
                "Name": "osu!",
                "Available": true,
                "InstantiationInfo": "osu.Game.Rulesets.Osu.OsuRuleset, osu.Game.Rulesets.Osu",
                "LastAppliedDifficultyVersion": 20220701
            },
            ChromaKeyWidth: 1366,
            PlayersPerTeam: 1,
            AutoProgressScreens: true
        }
        fs.writeFileSync('../bracket.json', JSON.stringify(dummy_data)) // Creates file if file doesn't exist with dummy data
    }
    const bracket_json_file = fs.readFileSync('../bracket.json', { encoding: "utf-8" })

    let bracket_json: Bracket = JSON.parse(bracket_json_file) // Asign Type for type checking and parse file into JSON

    let csv_headers: any[] = []

    const sheet_file_csv = fs.readFileSync('./sheets/teams.csv', { encoding: 'utf-8' })

    let csv_parse

    // Check if sheet template was provided / isn't supported, if so it tries different headers to parse without support. UNSTABLE!

    if (!env_check.sheet_template) {
        let sheets_check = false

        while (sheets_check) {
            // Needs to be written
        }
    }
    else {
        if (env.sheet_template == 'hitomi_v4') {
            csv_headers = hitomi_v4_sortedTeamData
            let i = 0

            for (let head in csv_headers) {
                if (csv_headers[head].endsWith('flag')) {
                    const reg = /\D/g
                    const num = Number(csv_headers[head].replace(reg, ''))
                    if (Number(num) !== 1 && Number(num) !== 2) {
                        csv_headers.splice(i, 16)
                    }
                }
                i += 1
            }
            const result = await parseCsv(sheet_file_csv, csv_headers)
            csv_parse = result.data
        }
    }

    // Start logic

    consola.info(`Amount of teams found: ${csv_parse.length - 1}`)

    // Ruleset stuff

    consola.info(`Applying ruleset...`)

    if (env.ruleset == 'osu!') {
        bracket_json.Ruleset.Name = 'osu!'
        bracket_json.Ruleset.ShortName = 'osu'
        bracket_json.Ruleset.InstantiationInfo = 'osu.Game.Rulesets.Osu.OsuRuleset, osu.Game.Rulesets.Osu'
        bracket_json.Ruleset.Available = true
    }
    else if (env.ruleset == 'osu!catch') {
        bracket_json.Ruleset.Name = 'osu!catch'
        bracket_json.Ruleset.ShortName = 'fruits'
        bracket_json.Ruleset.InstantiationInfo = 'osu.Game.Rulesets.Catch.CatchRuleset, osu.Game.Rulesets.Catch'
        bracket_json.Ruleset.Available = true
    }
    else if (env.ruleset == 'osu!mania') {
        bracket_json.Ruleset.Name = 'osu!mania'
        bracket_json.Ruleset.ShortName = 'mania'
        bracket_json.Ruleset.InstantiationInfo = 'osu.Game.Rulesets.Mania.ManiaRuleset, osu.Game.Rulesets.Mania'
        bracket_json.Ruleset.Available = true
    }
    else if (env.ruleset == 'osu!taiko') {
        bracket_json.Ruleset.Name = 'osu!taiko'
        bracket_json.Ruleset.ShortName = 'taiko'
        bracket_json.Ruleset.InstantiationInfo = 'osu.Game.Rulesets.Taiko.TaikoRuleset, osu.Game.Rulesets.Taiko'
        bracket_json.Ruleset.Available = true
    }

    consola.success(`Ruleset: ${env.ruleset} applied.`)

    // Teams

    consola.info('Processing teams and players...')

    let teams = csv_parse
    bracket_json.Teams = []
    for (let team in teams) {
        if (teams[team].p1_id !== null) {
            const players: Player[] = []
            let count = 1
            while (count <= env.player_per_team) {
                const res = await superagent.get(`https://osu.ppy.sh/api/get_user?k=${env.osu_api_key}&u=${teams[team][`p${count}_id`]}&type=id`)
                const player = res.body
                players.push({ id: teams[team][`p${count}_id`], Username: teams[team][`p${count}_username`], country_code: player[0]['country'], Rank: player[0]['pp_rank'], CoverUrl: '' })

                await delay(100)
                count += 1
            }
            bracket_json.Teams.push({
                FullName: teams[team]['Real_Team'], FlagName: '', Acronym: '', Seed: 0, LastYearPlacing: 0,
                AverageRank: teams[team]['Avg Rank'].replace(/\D/g, ''), Players: players
            })
        }
    }

    consola.success(`Teams and Players processed.`)

    fs.writeFileSync('./bracket.json', JSON.stringify(bracket_json)) // File saved
}

async function parseCsv(file: any, headers: string[]) {
    let data
    try {
        parse(file, {
            delimiter: ',',
            columns: headers,
            cast: (columnValue, context) => {
                if (context.column === "p1_id" || context.column === "p2_id" || context.column === "p3_id" || context.column === "p4_id" || context.column === "p5_id" || context.column === "p6_id" || context.column === "p7_id" || context.column === "p8_id") {
                    return Number(columnValue)
                }

                return columnValue
            }
        }, async (err, result) => {
            if (err) {
                console.log(err)
            }
            // consola.log(result)
            // data = result
            // return { data: result, passed: true }
            await fs.writeFileSync('./dump/teams.json', JSON.stringify(result))
        })
        const filee = await fs.readFileSync('./dump/teams.json', { encoding: 'utf-8' })
        data = JSON.parse(filee)
        return { data, passed: true }

    }
    catch (err) {
        return { passed: false }
    }
}

async function checkEnv() {
    // consola.info(env)
    let check: any = {}
    if (fs.existsSync('./sheets/teams.csv')) check.teams = true;
    else {
        consola.error(`No teams.csv was found in folder: 'sheets'.`)
        throw Error()
    }

    if (fs.existsSync('./sheets/seeds.csv')) check.seeds = true;
    else {
        consola.error(`No seeds.csv was found in folder: 'sheets'.`)
        throw Error()
    }

    if (fs.existsSync('./sheets/maps.csv')) check.maps = true;
    else {
        consola.error(`No maps.csv was found in folder: 'sheets'.`)
        throw Error()
    }

    if (Number(env.player_per_team) < 9 && Number(env.player_per_team) > 0) check.player_per_team = true;
    else {
        consola.error(`Invalid Players per team input! Value inputted: ${env.player_per_team}`)
        throw Error()
    };

    if (supported_bracket_stages.includes(String(env.bracket_stage))) check.bracket_stage = true;
    else {
        consola.error(`Bracket Stage not supported! Supported Bracket stages: ${supported_bracket_stages}`)
        throw Error()
    };

    if (supported_bracket_types.includes(String(env.bracket_type))) check.bracket_type = true;
    else {
        consola.error(`Bracket Type not supported! Supported Bracket types: ${supported_bracket_types}`)
        throw Error()
    };

    if (supported_rulesets.includes(String(env.ruleset))) check.ruleset = true;
    else {
        consola.error(`Invalid Ruleset! Value inputted: ${env.ruleset}`)
        throw Error()
    };

    if (supported_sheets.includes(String(env.sheet_template))) check.sheet_template = true;
    else {
        consola.error(`Sheet not supported! Supported sheets: ${supported_sheets}. Will try to detect which sheet...`)
        check.sheet_template = false
        // throw Error()
    };

    if (String(env.osu_api_key).length > 1) check.osu_api_key = true;
    else {
        consola.error(`No osu! Api Key provided.`)
        throw Error()
    }


    return check
}

const hitomi_v4_sortedTeamData = [
    'Team', 'Real_Team', 'Avg Rank', 'timezone',
    'I', 'p1_id', 'p2_id', 'p3_id', 'p4_id', 'p5_id', 'p6_id', 'p7_id', 'p8_id', 'p9_id', 'p10_id', 'p11_id', 'p12_id', 'p13_id', 'p14_id', 'p15_id', 'p16_id',
    'U', 'p1_username', 'p2_username', 'p3_username', 'p4_username', 'p5_username', 'p6_username', 'p7_username', 'p8_username', 'p9_username', 'p10_username', 'p11_username', 'p12_username', 'p13_username', 'p14_username', 'p15_username', 'p16_username',
    'P', 'p1_pfp', 'p2_pfp', 'p3_pfp', 'p4_pfp', 'p5_pfp', 'p6_pfp', 'p7_pfp', 'p8_pfp', 'p9_pfp', 'p10_pfp', 'p11_pfp', 'p12_pfp', 'p13_pfp', 'p14_pfp', 'p15_pfp', 'p16_pfp',
    'D', 'p1_discord', 'p2_discord', 'p3_discord', 'p4_discord', 'p5_discord', 'p6_discord', 'p7_discord', 'p8_discord', 'p9_discord', 'p10_discord', 'p11_discord', 'p12_discord', 'p13_discord', 'p14_discord', 'p15_discord', 'p16_discord',
    'R', 'p1_rank', 'p2_rank', 'p3_rank', 'p4_rank', 'p5_rank', 'p6_rank', 'p7_rank', 'p8_rank', 'p9_rank', 'p10_rank', 'p11_rank', 'p12_rank', 'p13_rank', 'p14_rank', 'p15_rank', 'p16_rank',
    'F', 'p1_flag', 'p2_flag', 'p3_flag', 'p4_flag', 'p5_flag', 'p6_flag', 'p7_flag', 'p8_flag', 'p9_flag', 'p10_flag', 'p11_flag', 'p12_flag', 'p13_flag', 'p14_flag', 'p15_flag', 'p16_flag'
]

const supported_bracket_stages = [
    'RO128', 'RO64', 'RO32', 'RO16', 'QF', 'SF', 'F', 'GF'
]

const supported_bracket_types = [
    'double_elim', 'single_elim'
]

const supported_rulesets = [
    'osu!',
    'osu!catch',
    'osu!mania',
    'osu!taiko'
]

const supported_sheets = [
    'hitomi_v4'
]

main()
