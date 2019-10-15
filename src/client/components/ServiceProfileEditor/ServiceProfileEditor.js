import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import commonTranslations from '../i18n';
import translations from './i18n';
import ServiceProfileApi from '../../api/ServiceProfileApi';
import BusinessPartner from '../BusinessPartner';
import Client from '../Client';
import ProductProfileDropdown from './ProductProfileDropdown';
import GatewayReferenceSelection from './GatewayReferenceSelection';
import Select from '@opuscapita/react-select';
import docTypesMap from './docTypesMap';
import validate from './validate';
import BusinessChannelPrioritization from './BusinessChannelPrioritization';
import ReceptionChannelConfigDropdown from './ReceptionChannelConfigDropdown';
import ReceptionChannelConfig from '../ReceptionChannelConfig';
import BusinessChannelField from '../BusinessChannelField';

class ServiceProfileForm extends Components.ContextComponent {

    constructor(props, context) {
        super(props);
        const { i18n } = context;

        i18n.register('Common', commonTranslations);
        i18n.register('ServiceProfileEditor', translations);

        this.state = {
            serviceProfile: {},
            productProfile: null,
            receptionChannelConfig: null,
            receptionChannelConfigEdit: false,
            docTypes: [],
        }
    }

    async componentDidMount() {
        const { i18n, router, showSpinner, hideSpinner, showNotification } = this.context;
        const { id } = router.params;

        try {
            showSpinner();
            const serviceProfile = id ? await ServiceProfileApi.find(id) : {};

            let receptionChannelConfig
            if(serviceProfile.receptionChannelConfigId) {
                receptionChannelConfig = { id: serviceProfile.receptionChannelConfigId };
            }

            this.setState({ serviceProfile, receptionChannelConfig });
            hideSpinner();
        }
        catch (error) {
            showNotification(i18n.getMessage('ServiceProfileEditor.notification.serviceProfileNotFound'), 'error')
            hideSpinner();
        }
    }

    handleReceptionConfigChange(receptionChannelConfig) {
        if (receptionChannelConfig !== null) {
            const { clientId, businessPartnerId } = this.state.serviceProfile;
            receptionChannelConfig.clientId = clientId;
            receptionChannelConfig.businessPartnerId = businessPartnerId;
        }

        this.setState({ receptionChannelConfig });
    }

    handleChange(value, filedName) {
        let { errors, docTypes, serviceProfile, productProfile, receptionChannelConfig, receptionChannelConfigEdit } = this.state;
        let items = {
            [filedName]: value,
        }

        if (errors) {
            delete errors[filedName];
        }

        if (filedName === 'productProfile') {
            errors = null;
            productProfile = value;
            items = {
                productProfileId: productProfile && productProfile.id,
                docType: serviceProfile.docType
            };

            if (productProfile) {
                const docTypeMap = docTypesMap[productProfile.commercialOffering];
                docTypes = Object.keys(docTypeMap);
                if (docTypes && docTypes.length === 1) {
                    items.docType = docTypes[0];
                }

                if (docTypeMap && docTypeMap.hasOwnProperty(items.docType)) {
                    items.direction = docTypeMap[items.docType];
                    errors && delete errors['docType'];
                }
                else {
                    items.docType = null;
                    items.direction = null;
                }
            }
            else {
                items.docType = null;
                items.direction = null;
            }
        }
        else if (filedName === 'docType') {
            const docTypeMap = docTypesMap[productProfile.commercialOffering];
            if (docTypeMap && docTypeMap.hasOwnProperty(value)) {
                items.direction = docTypeMap[value];
                errors && delete errors['docType'];
            }
            else {
                items.docType = null;
                items.direction = null;
            }
        }
        else if (['clientId', 'businessPartnerId'].includes(filedName)) {
            productProfile = null;
            items.productProfileId = null;
            items.receptionChannelConfigId = null;
        }
        else if (filedName === 'receptionChannelConfigId') {
            receptionChannelConfigEdit = false;
            receptionChannelConfig = {
                ...ReceptionChannelConfig.initialState.receptionChannelConfig,
                id: items.receptionChannelConfigId,
            }
        }

        this.setState({
            errors,
            docTypes,
            productProfile,
            receptionChannelConfig,
            receptionChannelConfigEdit,
            serviceProfile: {
                ...serviceProfile,
                ...items,
            },
        });
    }

    async onSave() {
        const { i18n, router, showSpinner, hideSpinner, showNotification } = this.context;
        let { serviceProfile, receptionChannelConfig, receptionChannelConfigEdit } = this.state;
        showSpinner();

        const errors = validate(serviceProfile, i18n);
        this.setState({ errors });
        if (errors) {
            hideSpinner();
            return;
        }

        if (serviceProfile.receptionChannelConfigId === 'new' || receptionChannelConfigEdit) {
            try {
                receptionChannelConfig = await this.receptionChannelConfig.onSave();
                serviceProfile.receptionChannelConfigId = receptionChannelConfig.id;
                this.setState({ receptionChannelConfigEdit: true });
                this.handleReceptionConfigChange(receptionChannelConfig);
                this.receptionChannelConfigDropdown.reload().then();
            }
            catch (err) {
                hideSpinner();
                return;
            }
        }

        try {
            if (serviceProfile.id) {
                await ServiceProfileApi.update(serviceProfile);
            }
            else {
                serviceProfile = await ServiceProfileApi.create(serviceProfile);
                this.setState({ serviceProfile });
                router.push(`/routing/service-profile/edit/${serviceProfile.id}`)
            }

            await this.gatewayReferenceSelection.onSave();

            showNotification(i18n.getMessage('ServiceProfileEditor.notification.successfullySaved'), 'success');
            hideSpinner();
        }
        catch (error) {
            hideSpinner();
            showNotification(i18n.getMessage('ServiceProfileEditor.notification.failedToSave'), 'error');
        }
    }

    getDefaultLabel(value, filedName) {
        const { i18n } = this.context;
        const label = value && i18n.getMessage(`ServiceProfileEditor.${filedName}.${value}`);
        return { value, label };
    }

    getError(filedName) {
        const { errors } = this.state;
        if (errors && errors.hasOwnProperty(filedName)) {
            return <span className='label label-danger'>
                {errors[filedName][0]}
            </span>
        }
        else {
            return null;
        }
    }

    render() {
        const { i18n, router } = this.context;
        const { serviceProfile, productProfile, receptionChannelConfig, docTypes, receptionChannelConfigEdit, errors } = this.state;

        return (
            <div className='serviceProfileEditor'>
                <h1>
                    {i18n.getMessage('ServiceProfileForm.header')}
                    <div className="control-bar text-right pull-right">
                        <button
                            type="button"
                            className="btn btn-link"
                            onClick={(e) => {
                                e.preventDefault();
                                router.push(`/routing/service-profile/search`);
                            }}
                        >
                            {i18n.getMessage('ServiceProfileEditor.goToOverview')}
                        </button>
                    </div>
                </h1>
                <div className='form-horizontal'>
                    <div className='row'>

                        <div className='col-sm-12'>

                            <div className='form-group'>
                                <label className='col-sm-4'>{i18n.getMessage('Common.client')} *</label>
                                <div className='col-sm-8'>
                                    <Client.Dropdown
                                        id={serviceProfile.clientId}
                                        onChange={(value) => this.handleChange(value && value.id, 'clientId')}
                                    />
                                    {this.getError('clientId')}
                                </div>
                            </div>

                            <div className='form-group'>
                                <label className='col-sm-4'>{i18n.getMessage('Common.businessPartner')}</label>
                                <div className='col-sm-8'>
                                    <BusinessPartner.Dropdown
                                        className='form-control'
                                        id={serviceProfile.businessPartnerId}
                                        onChange={value => this.handleChange(value && value.id, 'businessPartnerId')}
                                    />
                                </div>
                            </div>

                            <div className='form-group'>
                                <div className='col-sm-4'>
                                    <label>{`${i18n.getMessage('Common.name')} *`}</label>
                                </div>
                                <div className='col-sm-8'>
                                    <input
                                        className='form-control'
                                        value={serviceProfile.name || ''}
                                        onChange={e => this.handleChange(e.target.value, 'name')}
                                    />
                                    {this.getError('name')}
                                </div>
                            </div>

                            <div className='form-group'>
                                <div className='col-sm-4'>
                                    <label>{i18n.getMessage('Common.description')}</label>
                                </div>
                                <div className='col-sm-8'>
                                    <input
                                        className='form-control'
                                        value={serviceProfile.description || ''}
                                        onChange={e => this.handleChange(e.target.value, 'description')}
                                    />
                                </div>
                            </div>

                            {serviceProfile.clientId &&
                                <div className='form-group'>
                                    <div className='col-sm-4'>
                                        <label>{i18n.getMessage('ServiceProfileEditor.productProfile.label')} *</label>
                                    </div>
                                    <div className='col-sm-8'>
                                        <ProductProfileDropdown
                                            clientId={serviceProfile.clientId}
                                            productProfileId={serviceProfile.productProfileId}
                                            onChange={({ productProfile }) => this.handleChange(productProfile, 'productProfile')}
                                        />
                                        {this.getError('productProfileId')}
                                    </div>
                                </div>
                            }


                            {productProfile && productProfile.commercialOffering && <div>

                                <div className='form-group'>
                                    <div className='col-sm-4'>
                                        <label>{i18n.getMessage('ServiceProfileEditor.docType.label')} *</label>
                                    </div>
                                    <div className='col-sm-8'>
                                        <Select
                                            value={this.getDefaultLabel(serviceProfile.docType, 'docType')}
                                            onChange={item => this.handleChange(item && item.value, 'docType')}
                                            options={
                                                docTypes
                                                    .map(docType => this.getDefaultLabel(docType, 'docType'))
                                            }
                                        />
                                        {this.getError('docType')}
                                    </div>
                                </div>

                                {serviceProfile.direction &&
                                    <div className='form-group'>
                                        <div className='col-sm-4'>
                                            <label>{i18n.getMessage('ServiceProfileEditor.direction')}</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            <span>{
                                                serviceProfile.direction &&
                                                i18n.getMessage(`ServiceProfileEditor.${serviceProfile.direction}`)
                                            }</span>
                                        </div>
                                    </div>
                                }

                                {serviceProfile.direction === 'receiving' && <div>

                                    <div className='form-group'>
                                        <label className='col-sm-4'>{i18n.getMessage('ServiceProfileEditor.inboundBusinessChannelId.label') + " *"}</label>
                                        <div className='col-sm-8'>
                                            <BusinessChannelField
                                                id={serviceProfile.inboundBusinessChannelId || ''}
                                                direction="inbound"
                                                docTypes={[serviceProfile.docType]}
                                                onChange={businessChannel => this.handleChange(businessChannel && businessChannel.id, 'inboundBusinessChannelId')}
                                            />
                                            {this.getError('inboundBusinessChannelId')}
                                        </div>
                                    </div>

                                    <div className='form-group'>
                                        <div className='col-sm-4'>
                                            <label>{i18n.getMessage('ServiceProfileEditor.allowedInboundChannels.label')}</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            <Select
                                                isMulti
                                                defaultValue={
                                                    (serviceProfile.allowedInboundChannels || []).map((allowedInboundChannel) => (
                                                        this.getDefaultLabel(allowedInboundChannel, 'allowedInboundChannels')
                                                    ))
                                                }
                                                onChange={items => this.handleChange((items || []).map(i => i.value), 'allowedInboundChannels')}
                                                options={
                                                    [
                                                        'interoperabilityPartners',
                                                        'chargeableInteroperabilityPartners',
                                                        'PEPPOL',
                                                        'finnishB2BBankConnections',
                                                        'ediVanInteroperabilityPartners',
                                                    ]
                                                        .map(allowedInboundChannels => this.getDefaultLabel(allowedInboundChannels, 'allowedInboundChannels'))
                                                }
                                            />
                                        </div>
                                    </div>

                                </ div>}

                                {serviceProfile.direction === 'sending' && <div>

                                    <div className="schema-form-title">
                                        <h4>{i18n.getMessage('ServiceProfileEditor.gateway.header')}</h4>
                                        <hr />
                                    </div>

                                    <GatewayReferenceSelection
                                        serviceProfileId={serviceProfile.id}
                                        ref={ref => this.gatewayReferenceSelection = ref}
                                    />

                                    <div className="schema-form-title">
                                        <h4>{i18n.getMessage('ServiceProfileEditor.routing.header')}</h4>
                                        <hr />
                                    </div>

                                    <div className='form-group'>
                                        <label className='col-sm-4'>{i18n.getMessage('ServiceProfileEditor.inboundBusinessChannelId.label') + " *"}</label>
                                        <div className='col-sm-8'>
                                            <BusinessChannelField
                                                id={serviceProfile.inboundBusinessChannelId || ''}
                                                direction="inbound"
                                                docTypes={[serviceProfile.docType]}
                                                onChange={businessChannel => this.handleChange(businessChannel && businessChannel.id, 'inboundBusinessChannelId')}
                                            />
                                            {this.getError('inboundBusinessChannelId')}
                                        </div>
                                    </div>

                                    <div className='form-group'>
                                        <div className='col-sm-4'>
                                            <label>{i18n.getMessage('ServiceProfileEditor.routingPreferencePriorityList.label') + " *"}</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            <BusinessChannelPrioritization
                                                direction='outbound'
                                                value={serviceProfile.routingPreferencePriorityList}
                                                onChange={items => this.handleChange(items, 'routingPreferencePriorityList')}
                                            />
                                            {this.getError('routingPreferencePriorityList')}
                                        </div>
                                    </div>

                                    <div className='form-group'>
                                        <div className='col-sm-4'>
                                            <label>{i18n.getMessage('ServiceProfileEditor.routingPreferencesDeactivated.label')}</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            <input
                                                type="checkbox"
                                                onChange={e => this.handleChange(e.target.checked, 'routingPreferencesDeactivated')}
                                                checked={serviceProfile.routingPreferencesDeactivated || false}
                                            />
                                        </div>
                                    </div>

                                </div>}


                                {serviceProfile.direction && <div>

                                    <div className="schema-form-title">
                                        <h4>{i18n.getMessage('ServiceProfileEditor.receptionChannel.header')}</h4>
                                        <hr/>
                                    </div>

                                    <div className='form-group'>
                                        <div className='col-sm-4'>
                                            <label>{i18n.getMessage('ServiceProfileEditor.receptionChannel.label')}</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            <ReceptionChannelConfigDropdown
                                                receptionChannelConfigId={serviceProfile.receptionChannelConfigId}
                                                clientId={serviceProfile.clientId}
                                                businessPartnerId={serviceProfile.businessPartnerId ? [null, serviceProfile.businessPartnerId] : null}
                                                onChange={item => this.handleChange(item && item.id, 'receptionChannelConfigId')}
                                                ref={ref => this.receptionChannelConfigDropdown = ref}
                                            />
                                            {this.getError('receptionChannelConfigId')}
                                            {(serviceProfile.receptionChannelConfigId !== 'new' && serviceProfile.receptionChannelConfigId != null) &&
                                                <label className="checkbox-inline">
                                                    <input
                                                        type="checkbox"
                                                        checked={receptionChannelConfigEdit}
                                                        onChange={e => this.setState({ receptionChannelConfigEdit: e.target.checked })}
                                                    />
                                                    {i18n.getMessage('Common.edit')}
                                                </label>
                                            }
                                        </div>
                                    </div>
                                </div>}

                                {(serviceProfile.receptionChannelConfigId === 'new' || receptionChannelConfigEdit === true) &&
                                    <ReceptionChannelConfig
                                        receptionChannelConfig={receptionChannelConfig}
                                        onChange={receptionChannelConfig => this.handleReceptionConfigChange(receptionChannelConfig)}
                                        ref={ref => this.receptionChannelConfig = ref}
                                    />
                                }

                            </div>}

                            <br />

                            <div>
                                <button
                                    className='btn btn-primary'
                                    onClick={this.onSave.bind(this)}
                                >
                                    {i18n.getMessage('System.save')}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ServiceProfileForm;
