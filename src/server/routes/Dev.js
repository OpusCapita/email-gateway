const { ApiError, catchError } = require('../ApiError');
const DevApi = require('../api/DevApi');

class Dev {
    constructor(app) {
        this.app = app;
        this.dev = new DevApi();
    }

    async init() {
        this.app.post('/api/dev/event', (req, res) =>
            catchError(req, res, this.postEvent.bind(this))
        );
    }

    async postEvent(req, res) {
        const result = await this.dev.publishToKafka(req, res);
        res.json(result);
    }
}

module.exports = Dev;
