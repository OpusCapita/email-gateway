'use strict';

const KafkaClient = require('@opuscapita/kafka-client');

const TxContext = require('./TransactionContext');

// TODO - Update consumer/producer topic names
// TODO - Move topic configs to toplevel config
module.exports.init = async function(db, logger) {
    const eventClient = new KafkaClient();

    await eventClient.init();

    logger.info('Starting registration of event subscription...');

    await eventClient.subscribe(
        'emailgateway.inbound.tx',
        async (payload, context, topic) => {
            await TxContext.processIncomingEmail({
                payload,
                context,
                topic,
                logger,
                eventClient,
                db,
                emitTopic: 'emailgateway.outbound.tx'
            });
            return true;
        }
    );

    logger.info(
        "Registered event subscription for topic 'emailgateway.inbound.tx'"
    );

    return true;
};
