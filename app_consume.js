const { serviceBusConfig } = require("./service_bus");
const { delay, ServiceBusClient } = require("@azure/service-bus");

async function main() {
  const startedAt = new Date();
  let count = 0;
  while (true) {
    const serviceBusClient = new ServiceBusClient(
      serviceBusConfig.forServiceBusClient()
    );
    const receiver = serviceBusClient.createReceiver(
      serviceBusConfig.getQueueName()
    );
    receiver.subscribe({
      processMessage: async (messageReceived) => {
        count += 1;
        const duration = new Date().getTime() - startedAt.getTime();
        console.log(
          `Received: ${messageReceived.body}: ${
            duration / count / 1000
          } seconds / 1 message`
        );
      },
      processError: async (error) => {
        console.log(error);
        process.exit(1);
      },
    });
    await delay(1_000);
    await receiver.close();
    await serviceBusClient.close();
  }
}

main().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});
