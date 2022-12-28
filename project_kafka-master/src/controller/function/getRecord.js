const pool = require("../../services/database")
const {queryParamsGRCM,} = require("../../configs/query/getRecord")



const getRecordFromCancelMemberCustomer = async()=> {
    return await pool.query(queryParamsGRCM, ['N']);
    console.log(queryParamsGRCM)
}

module.exports = {getRecordFromCancelMemberCustomer}