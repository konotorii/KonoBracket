export default {
    // General Info
    player_per_team: Number(process.env.PLAYER_PER_TEAM),
    bracket_stage: process.env.BRACKET_STAGE,
    bracket_type: process.env.BRACKET_TYPE,
    ruleset: process.env.RULESET,
    sheet_template: process.env.SHEET_TEMPLATE,
    osu_api_key: process.env.OSU_API_KEY,
    scoring: process.env.SCORING,
    filter_mods: String(process.env.FILTER_MODS).split(','),
    country: Boolean(process.env.COUNTRY),

    // Best of
    ro128_best_of: Number(process.env.RO128_BEST_OF),
    ro64_best_of: Number(process.env.RO64_BEST_OF),
    ro32_best_of: Number(process.env.RO32_BEST_OF),
    ro16_best_of: Number(process.env.RO16_BEST_OF),
    qf_best_of: Number(process.env.QF_BEST_OF),
    sf_best_of: Number(process.env.SF_BEST_OF),
    f_best_of: Number(process.env.F_BEST_OF),
    gf_best_of: Number(process.env.GF_BEST_OF),

    // Mappools

    // Qualifiers
    qual_nm: String(process.env.QUAL_NM).split(','),
    qual_hd: String(process.env.QUAL_HD).split(','),
    qual_ez: String(process.env.QUAL_EZ).split(','),
    qual_fl: String(process.env.QUAL_FL).split(','),
    qual_hr: String(process.env.QUAL_HR).split(','),
    qual_dt: String(process.env.QUAL_DT).split(','),

    // Round of 128
    ro128_nm: String(process.env.RO128_NM).split(','),
    ro128_hd: String(process.env.RO128_HD).split(','),
    ro128_ez: String(process.env.RO128_EZ).split(','),
    ro128_fl: String(process.env.RO128_FL).split(','),
    ro128_hr: String(process.env.RO128_HR).split(','),
    ro128_dt: String(process.env.RO128_DT).split(','),
    ro128_fm: String(process.env.RO128_FM).split(','),
    ro128_am: String(process.env.RO128_AM).split(','),
    ro128_rm: String(process.env.RO128_RM).split(','),
    ro128_tb: String(process.env.RO128_TB).split(','),

    // Round of 64
    ro64_nm: String(process.env.RO64_NM).split(','),
    ro64_hd: String(process.env.RO64_HD).split(','),
    ro64_ez: String(process.env.RO64_EZ).split(','),
    ro64_fl: String(process.env.RO64_FL).split(','),
    ro64_hr: String(process.env.RO64_HR).split(','),
    ro64_dt: String(process.env.RO64_DT).split(','),
    ro64_fm: String(process.env.RO64_FM).split(','),
    ro64_am: String(process.env.RO64_AM).split(','),
    ro64_rm: String(process.env.RO64_RM).split(','),
    ro64_tb: String(process.env.RO64_TB).split(','),

    // Round of 32
    ro32_nm: String(process.env.RO32_NM).split(','),
    ro32_hd: String(process.env.RO32_HD).split(','),
    ro32_ez: String(process.env.RO32_EZ).split(','),
    ro32_fl: String(process.env.RO32_FL).split(','),
    ro32_hr: String(process.env.RO32_HR).split(','),
    ro32_dt: String(process.env.RO32_DT).split(','),
    ro32_fm: String(process.env.RO32_FM).split(','),
    ro32_am: String(process.env.RO32_AM).split(','),
    ro32_rm: String(process.env.RO32_RM).split(','),
    ro32_tb: String(process.env.RO32_TB).split(','),

    // Round of 16
    ro16_nm: String(process.env.RO16_NM).split(','),
    ro16_hd: String(process.env.RO16_HD).split(','),
    ro16_ez: String(process.env.RO16_EZ).split(','),
    ro16_fl: String(process.env.RO16_FL).split(','),
    ro16_hr: String(process.env.RO16_HR).split(','),
    ro16_dt: String(process.env.RO16_DT).split(','),
    ro16_fm: String(process.env.RO16_FM).split(','),
    ro16_am: String(process.env.RO16_AM).split(','),
    ro16_rm: String(process.env.RO16_RM).split(','),
    ro16_tb: String(process.env.RO16_TB).split(','),

    // Quarterfinals
    qf_nm: String(process.env.QF_NM).split(','),
    qf_hd: String(process.env.QF_HD).split(','),
    qf_ez: String(process.env.QF_EZ).split(','),
    qf_fl: String(process.env.QF_FL).split(','),
    qf_hr: String(process.env.QF_HR).split(','),
    qf_dt: String(process.env.QF_DT).split(','),
    qf_fm: String(process.env.QF_FM).split(','),
    qf_am: String(process.env.QF_AM).split(','),
    qf_rm: String(process.env.QF_RM).split(','),
    qf_tb: String(process.env.QF_TB).split(','),

    // Semifinals
    sf_nm: String(process.env.SF_NM).split(','),
    sf_hd: String(process.env.SF_HD).split(','),
    sf_ez: String(process.env.SF_EZ).split(','),
    sf_fl: String(process.env.SF_FL).split(','),
    sf_hr: String(process.env.SF_HR).split(','),
    sf_dt: String(process.env.SF_DT).split(','),
    sf_fm: String(process.env.SF_FM).split(','),
    sf_am: String(process.env.SF_AM).split(','),
    sf_rm: String(process.env.SF_RM).split(','),
    sf_tb: String(process.env.SF_TB).split(','),

    // Finals
    f_nm: String(process.env.F_NM).split(','),
    f_hd: String(process.env.F_HD).split(','),
    f_ez: String(process.env.F_EZ).split(','),
    f_fl: String(process.env.F_FL).split(','),
    f_hr: String(process.env.F_HR).split(','),
    f_dt: String(process.env.F_DT).split(','),
    f_fm: String(process.env.F_FM).split(','),
    f_am: String(process.env.F_AM).split(','),
    f_rm: String(process.env.F_RM).split(','),
    f_tb: String(process.env.F_TB).split(','),

    // Grand Finals
    gf_nm: String(process.env.GF_NM).split(','),
    gf_hd: String(process.env.GF_HD).split(','),
    gf_ez: String(process.env.GF_EZ).split(','),
    gf_fl: String(process.env.GF_FL).split(','),
    gf_hr: String(process.env.GF_HR).split(','),
    gf_dt: String(process.env.GF_DT).split(','),
    gf_fm: String(process.env.GF_FM).split(','),
    gf_am: String(process.env.GF_AM).split(','),
    gf_rm: String(process.env.GF_RM).split(','),
    gf_tb: String(process.env.GF_TB).split(','),
}
