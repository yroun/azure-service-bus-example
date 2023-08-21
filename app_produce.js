const { ServiceBusClient, delay } = require("@azure/service-bus");
const { serviceBusConfig } = require("./service_bus");

async function sendMessages(messages) {
  const serviceBusClient = new ServiceBusClient(serviceBusConfig.forServiceBusClient());
  const sender = serviceBusClient.createSender(serviceBusConfig.getQueueName());

  try {
    let batch = await sender.createMessageBatch();
    for (let i = 0; i < messages.length; i++) {
      if (!batch.tryAddMessage(messages[i])) {
        await sender.sendMessages(batch);
        batch = await sender.createMessageBatch();
        if (!batch.tryAddMessage(messages[i])) {
          throw new Error("Message too big to fit in a batch");
        }
      }
    }
    await sender.sendMessages(batch);
    await sender.close();
  } finally {
    await serviceBusClient.close();
  }
}

async function main(options) {
  if (!options.size || options.delay > 1000) {
    console.error("invalid size");
    process.exit(1);
  }
  if (!options.delay || options.delay < 0) {
    console.error("invalid delay");
    process.exit(1);
  }
  if (!options.iter || options.iter < 0) {
    console.error("invalid number of iteration");
    process.exit(1);
  }
  for (let i = 0; i < options.iter; ++i) {
    await sendMessages(
      Array(options.size).fill({
        body: new Date().toLocaleString(),
      })
    );
    console.log("sent");
    await delay(options?.delay);
  }
}

main({ size: 100, delay: 1_000, iter: 10 }).catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});
