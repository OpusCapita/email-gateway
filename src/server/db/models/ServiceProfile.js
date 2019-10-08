const Sequelize = require('sequelize');

const dbDefinition = {
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
};

const init = function(db, config) {
    /**
     * ServiceProfile
     * @class ServiceProfile
     */
    return db.define(
        'ServiceProfile',
        /** @lends ServiceProfile */
        dbDefinition,
        {
            freezeTableName: true,
            updatedAt: 'changedOn',
            createdAt: 'createdOn'
        }
    );
};

module.exports = { dbDefinition, init };
