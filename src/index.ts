import { Bracket } from './../interfaces/main';
import * as fs from "fs";
import * as path from "path";
import * as readline from 'readline'
import { DateTime } from 'luxon';
import { join } from 'path';
import { parse } from 'csv-parse';
import delay from 'delay';
import { readFileSync, writeFileSync, promises as fsPromises } from 'fs';

async function main() {
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
        fs.writeFileSync('../bracket.json', JSON.stringify(dummy_data)) // Creates file if file doesn't exist
    }
    const bracket_json_file = fs.readFileSync('../bracket.json', { encoding: "utf-8" })

    let bracket_json: Bracket = JSON.parse(bracket_json_file) // Asign Type for type checking and parse file into JSON

    // const sheet_file_stream = fs.createReadStream('../sheet.csv')

    let csv_headers: any[] = []

    const sheet_file_csv = fs.readFileSync('../sheets.csv', { encoding: 'utf-8' })

    parse(sheet_file_csv, {
        delimiter: ',',
        columns: csv_headers,
        cast: (columnValue, context) => {
            if (context.column === "p1_id" || context.column === "p2_id" || context.column === "p3_id" || context.column === "p4_id" || context.column === "p5_id" || context.column === "p6_id" || context.column === "p7_id" || context.column === "p8_id") {
                return Number(columnValue)
            }

            return columnValue
        }
    }, (err, result) => {
        if (err) {
            console.log(err)
        }

        fs.writeFileSync('../sheets.json', JSON.stringify(result))
    }

    )

    // const rl = readline.createInterface({
    //     input: sheet_file_stream,
    //     crlfDelay: Infinity
    // })



    // Start logic

    fs.writeFileSync('../bracket.json', JSON.stringify(bracket_json)) // File saved
}

main()