const Sequelize = require('sequelize');

module.exports.up = async function(db, config)
{
    return db.queryInterface.createTable('ServiceProfile', {
        id: {
            type: Sequelize.BIGINT(),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        productProfileId: {
            type: Sequelize.BIGINT(),
            allowNull: false,
        },

        clientId: {
            type: Sequelize.STRING(30),
            allowNull: true,
        },

        businessPartnerId: {
            type: Sequelize.STRING(30),
            allowNull: true,
        },

        docType: {
            type: Sequelize.STRING(30),
            allowNull: false,
        },

        direction: {
            type: Sequelize.STRING(30),
            allowNull: false,
        },

        routingPreferencePriorityList: {
            type: Sequelize.JSON(),
            allowNull: true,
        },

        routingPreferencesDeactivated: {
            type: Sequelize.BOOLEAN(),
            allowNull: true,
        },

        allowedInboundChannels: {
            type: Sequelize.JSON(),
            allowNull: true,
        },

        createdBy: {
            type: Sequelize.STRING(60),
            allowNull: false,
        },
        createdOn: {
            type: Sequelize.DATE(),
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        changedBy: {
            type: Sequelize.STRING(60),
            allowNull: true,
        },
        changedOn: {
            type: Sequelize.DATE(),
            allowNull: true,
        }
    })
}

module.exports.down = async function(db, config)
{
    return db.queryInterface.dropTable('ServiceProfile');
}
