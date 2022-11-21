import { Player } from "./players";

export interface Team {
    FullName: string;
    FlagName: string;
    Acronym: string;
    SeedingResults: any; // needs to be changed
    Seed: string;
    LastYearPlacing: number;
    AverageRank: number;
    Players: Player[];
}