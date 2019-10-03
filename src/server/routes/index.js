const MyApi = require('../api/MyApi');

/**
 * Initializes all routes for RESTful access.
 *
 * @param {object} app - [Express]{@link https://github.com/expressjs/express} instance.
 * @param {object} db - If passed by the web server initialization, a [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - Everything from [config.routes]{@link https://github.com/OpusCapita/web-init} passed when running the web server initialization.
 * @returns {Promise} JavaScript Promise object.
 * @see [Minimum setup]{@link https://github.com/OpusCapita/web-init#minimum-setup}
 */
module.exports.init = async function(app, db, config) {
    const api = new MyApi();
    app.get('/', (req, res) => res.send(api.sayHello()));
    app.post('/event', async (req, res) =>
        res.send(await api.sendDummyEvent(req, res))
    );
};
