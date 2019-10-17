import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import ServiceProfileApi from '../../api/ServiceProfileApi';
import ServiceProfileList from './ServiceProfileList';
import SearchForm from './SearchForm';
import translations from './i18n';

class ServiceProfileOverview extends Components.ContextComponent {
    constructor(props, context) {
        super(props);
        this.loadServiceProfiles = this.loadServiceProfiles.bind(this);
        const { i18n } = context;
        this.state = {
            serviceProfiles: [],
            params: {},
            loading: false,
        }
        
        i18n.register('ServiceProfileOverview', translations);
    }

    async componentDidMount() {
        await this.loadServiceProfiles();
    }

    async onHandleDelete(id) {
        const { i18n, showNotification } = this.context;
        try {
            this.setState({ loading: true });
            await ServiceProfileApi.delete(id);
            await this.loadServiceProfiles();
            this.setState({ loading: false });
        }
        catch(error) {
            this.setState({ loading: false });
            showNotification(i18n.getMessage('ServiceProfileOverview.notification.failedDeletingServiceOrder'), 'error')
        }
    }

    async loadServiceProfiles() {
        const { i18n, showNotification } = this.context;
        const { params } = this.state;

        let query = {};
        const emptyState = ['', undefined, null];
        for (let key in params) {
            if (!emptyState.includes(params[key])) {
                if(key === 'name') {
                    query[key] = `%${params[key]}%`;
                }
                else {
                    query[key] = params[key];
                }
            }
        }

        try {
            this.setState({ loading: true });
            const serviceProfiles = await ServiceProfileApi.findAll(query);
            this.setState({ serviceProfiles, loading: false });
        }
        catch (error) {
            this.setState({ loading: false });
            showNotification(i18n.getMessage('ServiceProfileOverview.notification.serviceProfilesNotFound'), 'error')
        }
    }

    handleChange(params) {
        this.setState({ params });
    }

    onReset() {
        const params = {};
        this.setState({ params }, this.loadServiceProfiles)
    }

    render() {
        const { i18n, router } = this.context;
        const { serviceProfiles, params, loading } = this.state;
        
        return (<div className='serviceProfileOverview'>
            <h1>
                {i18n.getMessage('ServiceProfileOverview.header')}
                <div className="control-bar text-right pull-right">
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={(e) => {
                            e.preventDefault();
                            router.push(`/email-gateway/service-profile/edit`);
                        }}
                        >
                        {i18n.getMessage('ServiceProfileOverview.createNewServceProfile')}
                    </button>
                </div>
            </h1>
            <SearchForm
                onChange={this.handleChange.bind(this)}
                params={params}
                onReset={this.onReset.bind(this)}
                onSubmit={this.loadServiceProfiles.bind(this)}
                />
            <br />
            <ServiceProfileList
                serviceProfiles={serviceProfiles}
                onHandleDelete={this.onHandleDelete.bind(this)}
                loading={loading}
                />
        </div>)
    }
}

export default ServiceProfileOverview;
