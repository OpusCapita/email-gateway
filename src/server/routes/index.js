const Dev = require('./Dev');
const ServiceProfile = require('./ServiceProfile');

module.exports.init = async function(app, db, config) {
    if (process.env.NODE_ENV === 'development') {
        await new Dev(app, db).init();
    }
    await new ServiceProfile(app, db).init();
};
