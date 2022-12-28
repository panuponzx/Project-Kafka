const util = require('util');
const moment = require('moment');
const pool = require("../services/database");
const producer = require("../middleware/producer");
const {getRecordFromCancelMemberCustomer} = require("../controller/function/getRecord");
const {moveConsentToDeleteConsent,moveSystemKeyToDeleteSystemKey,moveTermToDeleteTerm} = require("../controller/function/movefunction");
const {updateMoveFlagOnCancelMemberCustomer} = require("../controller/function/updateFunction");
const {kaf_channel} = require("../configs/middleware");
const { Kafka } = require('kafkajs');

async function main() {
    try {

        var arrayMessageValue = [];
        var messageValue = {};
        var tranIdIndex;

        // get message from CANCEL_MEMBER_CUSTOMER
        var rs = await getRecordFromCancelMemberCustomer();


        if (rs.length > 0) {

            for (let i = 0; i < rs.length; i++) {

                // move recode from CONSENT to DELETE_CONSENT
                let moveConsentResult = await moveConsentToDeleteConsent(rs[i].SYSTEM_KEY_ID);
                // console.info('moveConsentResult => ', moveConsentResult)
                // move recode from TERM to DELETE_TERM
                let moveTermResult = await moveTermToDeleteTerm(rs[i].SYSTEM_KEY_ID);
                // console.info('moveTermResult => ', moveTermResult);
                // move recode from SYSTEM_KEY to DELETE_SYSTEM_KEY
                let moveSystemKeyResult = await moveSystemKeyToDeleteSystemKey(rs[i].SYSTEM_KEY_ID);
                // console.info('moveSystemKeyResult => ', moveSystemKeyResult);


                if (moveConsentResult == 1 || moveTermResult == 1 || moveSystemKeyResult == 1) {
                    let updateMoveFlagResult = await updateMoveFlagOnCancelMemberCustomer(rs[i].SYSTEM_KEY_ID);
                    console.info('updateMoveFlagResult => ', updateMoveFlagResult);
                    
                    // Prepare a message value for producer.
                    if (updateMoveFlagResult == 1) {
                        var objectDetail = {
                            cmd: rs[i].CMD,
                            channel_id: kaf_channel,
                            channel_tran_id: rs[i].TRAN_ID,
                            channel_sys_date_time: rs[i].SYS_DATE_TIME,
                            status: 1,
                        };

                        if (arrayMessageValue.some(item => item.tran_id == rs[i].TRAN_ID)) {
                            tranIdIndex = arrayMessageValue.findIndex(item => item.tran_id == rs[i].TRAN_ID);
                            arrayMessageValue[tranIdIndex].cmd_list.push(objectDetail);
                        } else {
                            messageValue = {
                                tran_id: rs[i].TRAN_ID,
                                // sys_date_time: moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss'),
                                cmd_list: []
                            }
                            messageValue.cmd_list.push(objectDetail);
                            arrayMessageValue.push(messageValue);
                        }
                    } 
                } else if (moveConsentResult == 0 || moveTermResult == 0 || moveSystemKeyResult == 0) {
                var objectDetail = {
                    cmd: rs[i].CMD,
                    channel_id: kaf_channel,
                    channel_tran_id: rs[i].TRAN_ID,
                    channel_sys_date_time: rs[i].SYS_DATE_TIME,
                    status: 3,
                };
                if (arrayMessageValue.some(item => item.tran_id == rs[i].TRAN_ID)) {
                    tranIdIndex = arrayMessageValue.findIndex(item => item.tran_id == rs[i].TRAN_ID);
                    arrayMessageValue[tranIdIndex].cmd_list.push(objectDetail);
                } else {
                    messageValue = {
                        tran_id: rs[i].TRAN_ID,
                        // sys_date_time: moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss'),
                        cmd_list: []
                    }
                    messageValue.cmd_list.push(objectDetail);
                    arrayMessageValue.push(messageValue);
                }
            } else 
                var objectDetail = {
                    cmd: rs[i].CMD,
                    channel_id: kaf_channel,
                    channel_tran_id: rs[i].TRAN_ID,
                    channel_sys_date_time: rs[i].SYS_DATE_TIME,
                    status: 2,
                };
                if (arrayMessageValue.some(item => item.tran_id == rs[i].TRAN_ID)) {
                    tranIdIndex = arrayMessageValue.findIndex(item => item.tran_id == rs[i].TRAN_ID);
                    arrayMessageValue[tranIdIndex].cmd_list.push(objectDetail);
                } else {
                    messageValue = {
                        tran_id: rs[i].TRAN_ID,
                        // sys_date_time: moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss'),
                        cmd_list: []
                    }
                    messageValue.cmd_list.push(objectDetail);
                    arrayMessageValue.push(messageValue);
                }
            }
            for (let a = 0; a < arrayMessageValue.length; a++) {
                // console.info('arrayMessageValue tran_id : ' ,arrayMessageValue[a].tran_id);
                let readableString = util.inspect(arrayMessageValue, { depth: 4 ,colors: 0 });
                let messageSendProducer = JSON.stringify(readableString[a]).toString();
                console.info('arrayMessageValue:', readableString);

                // Send message to kafka by producer.js
                 await producer(arrayMessageValue[a].tran_id,messageSendProducer);
            }
        }
        pool.end();
        return 1; // Success
    } catch (error) {
        console.error(error);
        return 0; // Error
    }
}

main().catch(console.error);
