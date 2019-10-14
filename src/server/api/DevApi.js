const KafkaClient = require('@opuscapita/kafka-client');

class DevApi {
    async publishToKafka(req, res) {
        const eventClient = new KafkaClient();
        await eventClient.init();
        return await eventClient.publish(
            'emailgateway.inbound.tx',
            {
                test: 'test-toplevel-data',
                eventOrigin: { systemNode: 'test-system-node' },
                origin: { flowId: 'test-origin-flowid' }
            },
            null,
            { partitionKey: '1' }
        );
    }
}

module.exports = DevApi;
