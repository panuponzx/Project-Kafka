const {kaf_Broker,kaf_Mechennism,kaf_Pass_del,kaf_Topic_con,kaf_User_del,kaf_cilientID} = require("../configs/middleware")


async function runProducer(tran_id, messageValue) {
  var result;
  const {
      Kafka
  } = require('kafkajs')

  const kafka = new Kafka({
      clientId: kaf_cilientID,
      brokers: [kaf_Broker],
      ssl: {
          rejectUnauthorized: true
      },
      sasl: {
          mechanism: kaf_Mechennism,
          username: kaf_User_del,
          password: kaf_Pass_del
      }
  })

  const producer = kafka.producer();
  await producer.connect()
  await producer.send({
          topic: kaf_Topic_con,
          messages: [{
              key: tran_id,
              value: messageValue
          }],
      }).then((res) => {
          result = res;
      })
      .catch(e => console.error(`[example/producer] ${e.message}`, e))
      

  console.log("Response is ", result);

  await producer.disconnect()
  return 1;

}

module.exports = runProducer
