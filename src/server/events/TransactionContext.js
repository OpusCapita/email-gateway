'use strict';

const ServiceProfile = require('../api/ServiceProfile');

/*
const ServiceClient = require('ocbesbn-service-client');

const ServiceProfile = require('../api/serviceprofile');
const ProductProfile = require('../api/productprofile');
const BusinessPartner = require('../api/businesspartner');
const ReceptionChannelConfig = require('../api/receptionchannelconfig');

const serviceClient = new ServiceClient();
const BusinessPartnerApi = new BusinessPartner();
*/

/**
 * Attention! Topics for subscription and emitting has to be agreed on!
 * Currently we use following topics:
 *   - subscribe
 *      - routing.inbound.tx
 *      - routing.outbound.tx
 *   - emit
 *      - reception.<common|masterdata|digitizing>.tx
 *      - delivery.<common|masterdata|digitizing>.tx
 *
 * What about adding a command as part of the transaction? ???
 *      tx (add ServiceProfile)  ->   tx (ServiceProfile added)
 *
 *
 * Transaction Context Example:
 * {
 *      version: 2.0
 *      transactionId: 123456-...
 *      locaccess: both
 *      stepStatus: Processing
 *      ...
 *      inbound: {
 *          serviceProfile: {
 *              id: 1234,
 *              clientId: ...
 *              ...
 *          }
 *      }
 *      outbound: {
 *          serviceProfile: {
 *              id: 4567
 *              clientId: ...
 *              ...
 *          }
 *      }
 *      ...
 * }
 */

const States = {
    PROCESSING: 'PROCESSING',
    FAILED: 'FAILED',
    DONE: 'DONE'
};

module.exports.processIncomingEmail = async function(data) {
    const { tx, context, topic, logger, eventClient, db, emitTopic } = data;
    logger.info(
        'processIncomingEmail - payload, context, topic, target: ',
        tx,
        context,
        topic
    );

    tx = await enrichWithServiceProfile(tx);
    tx = updateTx(
        tx,
        States.DONE,
        'Processing completed',
        'Incoming TX enriched successfully'
    );

    logger.info(
        'processIncomingEmail - Publishing event with: ',
        emitTopic,
        tx,
        context
    );
    await eventClient.publish(emitTopic, enrichedTx, context);
};

const enrichWithServiceProfile = async function(tx) {
    // TODO - Write this
    return updateTx(
        tx,
        States.PROCESSING,
        'Service profile added',
        'Processing still ongoing, tx now enriched with serviceprofile'
    );
};

// Channel type?
function determineChannelType(serviceProfile) {
    return 'common';
}

function updateTx(tx, status, shortDesc, longDesc) {
    const origin = {
        systemNode: tx.eventOrigin && tx.eventOrigin.systemNode,
        systemType: 'Andariel',
        flowId: tx.origin && tx.origin.flowId
    };
    tx.eventOrigin = origin;
    tx.timestamp = new Date().toISOString();
    tx.logAccess = 'Sender';
    tx.stepStatus = status;
    tx.shortEventText = shortDesc;
    tx.eventText = longDesc;
    return tx;
}
