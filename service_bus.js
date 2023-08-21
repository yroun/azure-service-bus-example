require("dotenv").config();
const {
  SERVICE_BUS_NAME_SPACE,
  SERVICE_BUS_QUEUE_NAME,
  SERVICE_BUS_SECRET_KEY,
} = process.env;

class ServiceBusConfig {
  constructor({ serviceBusNameSpace, queueName, secretKey }) {
    if (!serviceBusNameSpace || !queueName || !secretKey) {
      console.error("invalid config");
      process.exit(1);
    }
    this.serviceBusNameSpace = serviceBusNameSpace;
    this.queueName = queueName;
    this.secretKey = secretKey;
  }

  forServiceBusClient() {
    return `Endpoint=sb://${this.serviceBusNameSpace}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=${this.secretKey}`;
  }

  getQueueName() {
    return this.queueName;
  }
}

const serviceBusConfig = new ServiceBusConfig({
  serviceBusNameSpace: SERVICE_BUS_NAME_SPACE,
  queueName: SERVICE_BUS_QUEUE_NAME,
  secretKey: SERVICE_BUS_SECRET_KEY,
});

module.exports = {
  ServiceBusConfig,
  serviceBusConfig,
};
