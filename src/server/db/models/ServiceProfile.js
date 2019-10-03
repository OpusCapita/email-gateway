const Sequelize = require('sequelize');

// TODO - Update serviceprofile to match Email GW
module.exports.init = function(db, config) {
    /**
     * ServiceProfile
     * @class ServiceProfile
     */
    return db.define(
        'ServiceProfile',
        /** @lends ServiceProfile */
        {
            /**
             * Unique identifier for internal use
             */
            id: {
                type: Sequelize.BIGINT(),
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            /**
             * Name used for the users to identify the service profile.
             */
            name: {
                type: Sequelize.STRING(60),
                allowNull: false
            },

            /**
             * Optional description that the user could use to further identify the service profile.
             */
            description: {
                type: Sequelize.STRING(200),
                allowNull: true
            },

            /**
             * Identifier of the product the profile belongs to
             */
            productProfileId: {
                type: Sequelize.BIGINT(),
                allowNull: false
            },

            /**
             * Identifer of the client that is paying for the product
             */
            clientId: {
                type: Sequelize.STRING(30),
                allowNull: true
            },

            /**
             * Identifier of the business partner owning the service profile
             */
            businessPartnerId: {
                type: Sequelize.STRING(30),
                allowNull: true
            },

            /**
             * Type of the document being sent with the transaction. E.g. order, orderResponse or despatchAdvice.
             */
            docType: {
                type: Sequelize.STRING(30),
                allowNull: false
            },

            /**
             * Direction the document is being sent
             */
            direction: {
                type: Sequelize.STRING(30),
                allowNull: false
            },

            /*
             * Reference to the BusinessChannel (of type inbound) this Service Profile is assigned to.
             */
            inboundBusinessChannelId: {
                type: Sequelize.STRING(30),
                allowNull: true
            },

            /**
             * List of preferred outbound channels. Sorted from most to least preferred.
             */
            routingPreferencePriorityList: {
                type: Sequelize.JSON(),
                allowNull: true
            },

            /**
             * Flag for disabeling routing preferences
             */
            routingPreferencesDeactivated: {
                type: Sequelize.BOOLEAN(),
                allowNull: true
            },

            /**
             * Identifer of the reception channel config
             */
            receptionChannelConfigId: {
                type: Sequelize.BIGINT(),
                allowNull: true
            },

            /**
             * List of allowed inbound channels
             */
            allowedInboundChannels: {
                type: Sequelize.JSON(),
                allowNull: true
            },

            createdBy: {
                type: Sequelize.STRING(60),
                allowNull: false
            },
            createdOn: {
                type: Sequelize.DATE(),
                allowNull: false,
                defaultValue: Sequelize.NOW()
            },
            changedBy: {
                type: Sequelize.STRING(60),
                allowNull: true
            },
            changedOn: {
                type: Sequelize.DATE(),
                allowNull: true
            }
        },
        {
            freezeTableName: true,
            updatedAt: 'changedOn',
            createdAt: 'createdOn'
        }
    );
};
