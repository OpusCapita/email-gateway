const productProfiles = require('../data/044-product-profiles.json');
const serviceProfiles = require('../data/044-service-profiles.json');
const receptionChannelConfigs = require('../data/044-reception-channel-configs.json');

let productProfileIds = [];
let serviceProfileIds = [];
let receptionChannelConfigIds = [];

// TODO - FIX ALL
module.exports.up = async function(db, config) {
    productProfileIds = await Promise.all(
        productProfiles.map(productProfile =>
            db.queryInterface.insert(null, 'ProductProfile', {
                ...productProfile,
                createdOn: new Date()
            })
        )
    );
    productProfileIds = productProfileIds.sort();

    receptionChannelConfigIds = await Promise.all(
        receptionChannelConfigs.map(receptionChannelConfig =>
            db.queryInterface.insert(null, 'ReceptionChannelConfig', {
                ...receptionChannelConfig,
                createdOn: new Date()
            })
        )
    );
    receptionChannelConfigIds = receptionChannelConfigIds.sort();

    serviceProfileIds = await Promise.all(
        serviceProfiles.map((serviceProfile, idx) =>
            db.queryInterface.insert(null, 'ServiceProfile', {
                ...serviceProfile,
                productProfileId: productProfileIds[idx],
                receptionChannelConfigId:
                    serviceProfile.direction === 'receiving'
                        ? receptionChannelConfigIds[
                              idx % receptionChannelConfigIds.length
                          ]
                        : null,
                createdOn: new Date()
            })
        )
    );
};

module.exports.down = async function(db, config) {
    await Promise.all([
        db.queryInterface.bulkDelete('ProductProfile', {
            id: { $in: productProfileIds }
        }),
        db.queryInterface.bulkDelete('ServiceProfile', {
            id: { $in: serviceProfileIds }
        }),
        db.queryInterface.bulkDelete('ReceptionChannelConfig', {
            id: { $in: receptionChannelConfigIds }
        })
    ]);
};
