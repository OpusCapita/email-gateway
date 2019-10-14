const { ApiError, catchError } = require('../ApiError');
const ServiceProfileApi = require('../api/ServiceProfileApi');

class ServiceProfile {
    constructor(app, db) {
        this.app = app;
        this.db = db;
        this.serviceProfileApi = new ServiceProfileApi(db);
    }

    async init() {
        this.app.get('/api/service-profiles', (req, res) =>
            catchError(req, res, this.sendServiceProfiles.bind(this))
        );
        this.app.post('/api/service-profiles', (req, res) =>
            catchError(req, res, this.createServiceProfile.bind(this))
        );
        this.app.get('/api/service-profiles/:id', (req, res) =>
            catchError(req, res, this.sendServiceProfile.bind(this))
        );
        this.app.put('/api/service-profiles/:id', (req, res) =>
            catchError(req, res, this.updateServiceProfile.bind(this))
        );
        this.app.delete('/api/service-profiles/:id', (req, res) =>
            catchError(req, res, this.deleteServiceProfile.bind(this))
        );
    }

    async sendServiceProfiles(req, res) {
        const { query } = req;
        const result = await this.serviceProfileApi.findAll(query);
        res.json(result);
    }

    async sendServiceProfile(req, res) {
        const { id } = req.params;
        const result = await this.serviceProfileApi.find(id);
        res.json(result);
    }

    async createServiceProfile(req, res) {
        const serviceProfile = req.body;
        serviceProfile.createdBy = req.opuscapita.userData('id');
        const result = await this.serviceProfileApi.create(serviceProfile);
        res.json(result);
    }

    async updateServiceProfile(req, res) {
        const { id } = req.params;
        const serviceProfile = req.body;
        serviceProfile.changedBy = req.opuscapita.userData('id');
        const result = await this.serviceProfileApi.update(id, serviceProfile);
        res.json(result);
    }

    async deleteServiceProfile(req, res) {
        const { id } = req.params;
        const result = await this.serviceProfileApi.delete(id);
        res.json({
            deletedServiceProfiles: result
        });
    }
}

module.exports = ServiceProfile;
