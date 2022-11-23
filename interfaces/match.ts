export interface Match {
    ID: number;
    Team1Acronym: string;
    Team1Score: number;
    Team2Acronym: string;
    Team2Score: number;
    Completed: boolean;
    Losers: boolean;
    PicksBans: any; // need to change
    Current: boolean;
    Date: Date;
    ConditionalMatches?: any; // need to change, no clue what it even is
    Position: any; // no clue
    Acronyms: any[]; 
    WinnerColour: string;
    PointsToWin: number;
}