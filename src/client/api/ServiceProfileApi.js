import superagent from 'superagent';

class ServiceProfileApi {
    static async find(id) {
        const { body } = await superagent.get(`/email-gateway/api/service-profiles/${id}`);
        return body;
    }

    static async findAll(parmas) {
        const { body } = await superagent.get(`/email-gateway/api/service-profiles`)
            .query(parmas);
        return body;
    }

    static async create(serviceProfile) {
        const { body } = await superagent.post(`/email-gateway/api/service-profiles`)
            .set('content-type', 'application/json')
            .send(serviceProfile);
        return body;
    }

    static async update(serviceProfile) {
        const { id } = serviceProfile;
        const { body } = await superagent.put(`/email-gateway/api/service-profiles/${id}`, serviceProfile);
        return body;
    }

    static async delete(id) {
        const { body } = await superagent.delete(`/email-gateway/api/service-profiles/${id}`);
        return body;
    }
}

export default ServiceProfileApi;