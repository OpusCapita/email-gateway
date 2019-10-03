const Sequelize = require('sequelize');

// TODO - FIX ALL
module.exports.up = async function(db, config) {
    return Promise.all([
        db.queryInterface.addColumn('ServiceProfile', 'name', {
            type: Sequelize.STRING(60),
            allowNull: false
        }),
        db.queryInterface.addColumn('ServiceProfile', 'description', {
            type: Sequelize.STRING(200),
            allowNull: true
        })
    ]);
};

module.exports.down = async function(db, config) {
    return Promise.all([
        db.queryInterface.removeColumn('ServiceProfile', 'name'),
        db.queryInterface.removeColumn('ServiceProfile', 'description')
    ]);
};
