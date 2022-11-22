import { Beatmap } from './beatmap';
export interface Round {
    Name: string;
    Description: string;
    BestOf: number;
    Beatmaps: Beatmap[];
    StartDate: Date;
    Matches: number[];
}