const SequelizeUtils = require('./sequelizeUtils');

// TODO - Validate that all functionality here is needed
class ServiceProfile extends SequelizeUtils {
    constructor(db) {
        super();

        this.db = db;
        this.ServiceProfile = db.models.ServiceProfile;
    }

    async findAll(params) {
        const where = this.prepareWhere(params);
        const res = await this.ServiceProfile.findAll({ where });
        return res.map(r => this.fromDb(r));
    }

    async find(id) {
        let res = await this.ServiceProfile.find({
            where: { id }
        });

        return this.fromDb(res);
    }

    async create(serviceProfile) {
        ['id', 'changedBy', 'changedOn'].forEach(
            key => delete serviceProfile[key]
        );
        serviceProfile.createdOn = Date.now();

        const res = await this.ServiceProfile.create(serviceProfile);
        return this.find(res.id);
    }

    async update(id, serviceProfile) {
        ['id', 'createdBy', 'createdOn'].forEach(
            key => delete serviceProfile[key]
        );
        serviceProfile.changedOn = Date.now();

        await this.ServiceProfile.update(serviceProfile, {
            where: { id }
        });
        return this.find(id);
    }

    async delete(id) {
        const res = await this.ServiceProfile.destroy({
            where: { id }
        });
        return res;
    }

    fromDb(res) {
        if (res) {
            res = res.get();
            res.allowedInboundChannels = JSON.parse(res.allowedInboundChannels);
            res.routingPreferencePriorityList = JSON.parse(
                res.routingPreferencePriorityList
            );
            return res;
        } else {
            return null;
        }
    }
}

module.exports = ServiceProfile;
