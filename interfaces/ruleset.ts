export interface Ruleset {
    ShortName: "osu" | "fruits" | "mania" | "taiko";
    OnlineID?: 1 | 2 | 3; // for taiko, fruits, mania. IN that order
    Name: "osu!" | "osu!catch" | "osu!mania" | "osu!taiko";
    InstantiationInfo: "osu.Game.Rulesets.Osu.OsuRuleset, osu.Game.Rulesets.Osu" | "osu.Game.Rulesets.Catch.CatchRuleset, osu.Game.Rulesets.Catch" | "osu.Game.Rulesets.Mania.ManiaRuleset, osu.Game.Rulesets.Mania" | "osu.Game.Rulesets.Taiko.TaikoRuleset, osu.Game.Rulesets.Taiko";
    LastAppliedDifficultyVersion: number;
    Available: boolean;
}