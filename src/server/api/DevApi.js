const KafkaClient = require('@opuscapita/kafka-client');

class DevApi {
    async publishToKafka(req, res) {
        const eventClient = new KafkaClient();
        await eventClient.init();
        return await eventClient.publish(
            'emailgateway.inbound.tx',
            'Test event from DevApi'
        );
    }
}

module.exports = DevApi;
