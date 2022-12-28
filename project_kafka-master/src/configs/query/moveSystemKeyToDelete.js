const queryParamsMSDS = "INSERT INTO DELETE_SYSTEM_KEY SELECT * FROM SYSTEM_KEY WHERE SYSTEM_KEY_ID = ?"
const queryParamsDMSDS = "DELETE FROM SYSTEM_KEY WHERE SYSTEM_KEY_ID = ?"


module.exports = {
    queryParamsMSDS,
    queryParamsDMSDS,
}