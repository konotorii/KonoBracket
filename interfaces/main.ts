import { Round } from './round';
import { Match } from './match';
import { Progression } from './progression';
import { Ruleset } from './ruleset';
import { Team } from './team';

export interface Bracket {
    Ruleset: Ruleset;
    Matches?: Match[]; 
    Rounds?: Round[]; // need to change
    Teams?: Team[];
    Progressions?: Progression[];
    ChromaKeyWidth: number;
    PlayersPerTeam: number;
    AutoProgressScreens: boolean;
}