import { Match } from './matches';
import { Progression } from './progressions';
import { Ruleset } from './ruleset';
import { Team } from './teams';

export interface Bracket {
    Ruleset: Ruleset;
    Matches: Match[]; 
    Rounds: any; // need to change
    Teams: Team[];
    Progressions: Progression[];
    ChromaKeyWidth: number;
    PlayersPerTeam: number;
}