import { Beatmap } from './beatmap';
export interface SeedingResult {
    Beatmaps: Beatmap[];
    Mod: string;
    Seed: number;
}