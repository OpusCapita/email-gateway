const KafkaClient = require('@opuscapita/kafka-client');

// TODO - Remove this full class, initially only here for testing while we gain domain knowledge
class MyApi {
    sayHello() {
        return 'Hello, world!';
    }

    async sendDummyEvent(req, res) {
        const { logger } = req.opuscapita;
        const eventClient = new KafkaClient();
        await eventClient.init();
        return await eventClient.publish(
            'emailgateway.inbound.tx',
            'test event to kafka'
        );
    }
}

module.exports = MyApi;
