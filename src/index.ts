import * as fs from "fs";
import * as path from "path";
import { DateTime } from 'luxon';
import { join } from 'path';
import { parse } from 'csv-parse';
import delay from 'delay';
import { readFileSync, writeFileSync, promises as fsPromises } from 'fs';

async function main() {
    const bracket_json_file = fs.readFileSync('../bracket.json', { encoding: "utf-8"})
    let bracket_json = JSON.parse(bracket_json_file)

    
}

main()