const queryParamsMTDT = "INSERT INTO DELETE_TERM SELECT * FROM TERM WHERE SYSTEM_KEY_ID = ?"
const queryParamsDMTDT = "DELETE FROM TERM WHERE SYSTEM_KEY_ID = ?"

module.exports = {
    queryParamsMTDT,
    queryParamsDMTDT,
}