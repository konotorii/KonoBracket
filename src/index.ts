import { Scoring } from './../interfaces/scoring';
import { Round } from './../interfaces/round';
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
const superagent = require('superagent');
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

    let sheet_file_csv = null

    let scores

    sheet_file_csv = fs.readFileSync('./sheets/seeds.csv', { encoding: 'utf-8' })

    consola.info('Processing scores...')

    if (!env_check.sheet_template) {
        await guessHeaders('./sheets/seeds.csv')
    }
    else {
        if (env.sheet_template == 'hitomi_v4') {
            csv_headers = hitomi_v4_filteredScores

            const e = await parseCsv(sheet_file_csv, csv_headers, 'seeds')
            scores = e.data
        }
    }

    consola.success('Scores processed.')

    csv_headers = []
    sheet_file_csv = null

    sheet_file_csv = fs.readFileSync('./sheets/teams.csv', { encoding: 'utf-8' })

    let csv_parse

    // Check if sheet template was provided / isn't supported, if so it tries different headers to parse without support. UNSTABLE!

    if (!env_check.sheet_template) {
        await guessHeaders('./sheets/teams.csv')
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
            const result = await parseCsv(sheet_file_csv, csv_headers, 'teams')
            csv_parse = result.data
        }
    }

    // Start logic

    consola.info(`Amount of teams found: ${csv_parse.length - 1}`)
    await delay(100)

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

    consola.success(`Ruleset: '${env.ruleset}' applied.`)

    consola.info('Processing mappools...')

    bracket_json.Rounds = []

    // Qualifiers
    const quals = await quals_mappool()
    if (quals.length != 0) bracket_json.Rounds.push(quals.round);

    consola.success('Mappools processed.')

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
                // consola.log(player)
                if (!player[0]) {
                    players.push({ id: 0, Username: 'API ERROR', country_code: '', Rank: 0, CoverUrl: '' })
                }
                else {
                    players.push({ id: teams[team][`p${count}_id`], Username: teams[team][`p${count}_username`], country_code: player[0]['country'], Rank: player[0]['pp_rank'], CoverUrl: '' })
                }

                await delay(100)
                count += 1
            }
            let avg_rank = 0
            players.forEach((e) => {
                avg_rank += e.Rank
            })
            avg_rank /= env.player_per_team
            bracket_json.Teams.push({
                FullName: teams[team]['Real_Team'], FlagName: '', Acronym: '', Seed: 0, LastYearPlacing: 0,
                AverageRank: avg_rank, Players: players
            })
        }
    }

    consola.success(`Teams and Players processed.`)

    consola.info('Processing seedings...')

    const seed_teams = bracket_json.Teams

    for (let team in seed_teams) {

        const scoress = scores.filter((e: any) => {
            return e.Team == seed_teams[team]['FullName']
        })

        // Calculate scores and seedings

    }

    consola.success('Seedings processed.')

    consola.info('Creating matches...')

    consola.success(`Created '${bracket_json.ChromaKeyWidth}`)

    consola.success(`Completed entire bracket.json.`)

    fs.writeFileSync('./bracket.json', JSON.stringify(bracket_json)) // File saved
}

async function parseCsv(file: any, headers: string[], type: string) {
    let data
    try {
        parse(file, {
            delimiter: ',',
            columns: headers,
            cast: (columnValue, context) => {
                if (
                    context.column === "p1_id" || context.column === "p2_id" ||
                    context.column === "p3_id" || context.column === "p4_id" ||
                    context.column === "p5_id" || context.column === "p6_id" ||
                    context.column === "p7_id" || context.column === "p8_id" ||
                    context.column === "Map ID" || context.column === "User ID" ||
                    context.column === "Score" || context.column === "Max Combo" ||
                    context.column === "Hit 300" || context.column === 'Hit 100' ||
                    context.column === 'Hit 50' || context.column === 'Hit Miss'

                ) {
                    return Number(columnValue.replace(/\,/g, ''))
                }
                if (context.column === 'Mods') {
                    let ewe
                    env.filter_mods.forEach((e) => {
                        ewe = columnValue.replace(e, '')
                    })
                    return ewe
                }
                if (
                    context.column === 'Filter' || context.column === 'Passed'
                ) {
                    if (columnValue === "TRUE") {
                        return true
                    }
                    else if (columnValue === 'FALSE') {
                        return false
                    }
                }
                if (
                    context.column === 'Accuracy'
                ) {
                    return Number(columnValue.replace('%', '').replace(',', '.'))
                }
                return columnValue
            }
        }, (err, result) => {
            if (err) {
                console.log(err)
            }
            // consola.log(result)
            fs.writeFileSync(`./dump/${type}.json`, JSON.stringify(result))
        })
        await delay(2000) // This it to wait for parse to finish
        const filee = await fs.readFileSync(`./dump/${type}.json`, { encoding: 'utf-8' })
        data = JSON.parse(filee)
        return { data, passed: true }

    }
    catch (err) {
        consola.error(err)
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

async function guessHeaders(file_path: string) {

}

async function quals_mappool() {
    let round: Round = {
        "Name": 'Qualifiers',
        "Description": "Qualifiers",
        "BestOf": env.qf_best_of,
        "Beatmaps": [],
        "StartDate": DateTime.now().toJSDate(),
        'Matches': []
    }

    if (env.qual_nm[0] !== "") {
        for (let nm in env.qual_nm) {
            round.Beatmaps.push({ "ID": Number(env.qual_nm[nm]), "Mods": "NM" })
        }
    }
    if (env.qual_hd[0] !== "") {
        for (let e in env.qual_hd) {
            round.Beatmaps.push({ "ID": Number(env.qual_hd[e]), "Mods": "HD" })
        }
    }
    if (env.qual_ez[0] !== "") {
        for (let e in env.qual_ez) {
            round.Beatmaps.push({ "ID": Number(env.qual_ez[e]), "Mods": 'EZ' })
        }
    }
    if (env.qual_fl[0] !== "") {
        for (let e in env.qual_fl) {
            round.Beatmaps.push({ "ID": Number(env.qual_fl[e]), "Mods": 'FL' })
        }
    }
    if (env.qual_hr[0] !== "") {
        for (let e in env.qual_hr) {
            round.Beatmaps.push({ 'ID': Number(env.qual_hr[e]), 'Mods': 'HR' })
        }
    }
    if (env.qual_dt[0] !== "") {
        for (let e in env.qual_dt) {
            round.Beatmaps.push({ "ID": Number(env.qual_dt[e]), 'Mods': 'DT' })
        }
    }

    return { round, length: round.Beatmaps.length }
}

async function scoring(method: Scoring) {
    
}

async function getMapInfo(id: string) {

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

const hitomi_v4_filteredScores = [
    'Filter', '', '', 'Pick', 'FM', 'Beatmap', 'Beatmap_Title', 'Map ID', 'Player', 'User ID', 'Team', 'Passed', 'Score', 'Accuracy', 'Max Combo', 'Hit 300', 'Hit 100', 'Hit 50', 'Hit Miss', 'Mods'
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
