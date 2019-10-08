module.exports.up = function(db, config) {
    const serviceProfiles = require('../data/001-service-profiles');
    serviceProfiles.forEach(
        serviceProfile => (serviceProfile.createdOn = new Date())
    );

    return db.queryInterface.bulkInsert('ServiceProfile', serviceProfiles);
};

module.exports.down = function(db, config) {
    const serviceProfileIds = [1];
    return db.queryInterface.bulkDelete('ServiceProfile', {
        id: {
            $in: serviceProfileIds
        }
    });
};
