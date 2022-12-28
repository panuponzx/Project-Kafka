const pool = require("../../services/database")
const {queryParamsUMFC} = require("../../configs/query/updateMember");

const updateMoveFlagOnCancelMemberCustomer = async(SYSTEM_KEY_ID) =>{
    let rs = await pool.query(queryParamsUMFC, [SYSTEM_KEY_ID]);
   if (rs.affectedRows > 0) {
       return 1; // Update successfully.
   } else {
       return 0; // No update.
   }
}

module.exports = {updateMoveFlagOnCancelMemberCustomer}
 