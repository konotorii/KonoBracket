const BT2 = 'e'
if (BT2 !== "") {
    if ('_variables'!$D$6 = 0) {
        INDEX(
            if (ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1) = "") {

        }
        else {
            RANK(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1), ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1))
        }
        )
    }
    else if ('_variables'!$D$6 = 1) {
        INDEX(IF(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1) = "",, VALUE(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1)) / MAX(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1)))),
            
    
} 
else if ('_variables'!$D$6 = 2) {
        INDEX(
            IF(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1) = "",,
                IF((ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1) - MIN(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1))) < 0, 0, (ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1) - MIN(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1)))) / MAX(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1)))),
                
            }
            else if ('_variables'!$D$6 = 3) {
        INDEX(IF(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1) = "",, NORM.S.DIST((ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1) - AVERAGE(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1))) / STDEV(ARRAY_CONSTRAIN(AN3: AN, COUNTA($AM$3: $AM), 1)))))
    }
}
