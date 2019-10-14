const Sequelize = require('sequelize');
const { dbDefinition } = require('../models/serviceProfile');

module.exports.up = async function(db, config) {
    return db.queryInterface.createTable('ServiceProfile', dbDefinition);
};

module.exports.down = async function(db, config) {
    return db.queryInterface.dropTable('ServiceProfile');
};
