const queryParamsMCDC = "INSERT INTO DELETE_CONSENT SELECT * FROM CONSENT WHERE SYSTEM_KEY_ID = ?"
const queryParamsDMCDC = "DELETE FROM CONSENT WHERE SYSTEM_KEY_ID = ?"


module.exports = {
    queryParamsMCDC,
    queryParamsDMCDC,
}