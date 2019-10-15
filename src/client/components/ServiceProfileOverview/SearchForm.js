import React from 'react';
import PropTypes from 'prop-types';
import { Components } from '@opuscapita/service-base-ui';

import BusinessPartner from '../BusinessPartner';
import Client from '../Client';
import Select from '@opuscapita/react-select';

import commonTranslations from '../i18n';

class SearchForm extends Components.ConditionalRenderComponent {

    static propTypes = {
        serviceProfiles: PropTypes.array,
        onChange: PropTypes.func,
        onSubmit: PropTypes.func,
        onReset: PropTypes.func,
    };

    static defaultProps = {
        onChange: () => null,
        onSubmit: () => null,
        onReset: () => null,
    }

    constructor(props, context) {
        super(props);
        context.i18n.register('Common', commonTranslations);
    }

    handleChange(value, key) {
        this.props.onChange({
            ...this.props.params,
            [key]: value,
        })
    }

    getDefaultLabel(value, filedName) {
        const { i18n } = this.context;
        const label = value && i18n.getMessage(`ServiceProfileOverview.${filedName}.${value}`);
        return { value, label };
    }

    render() {
        const { i18n } = this.context;
        const { params } = this.props;

        return (<div className='searchForm'>
            <form className='form-horizontal'>
                <div className='row'>
                    <div className='col-sm-6'>

                        <div className='form-group'>
                            <label className='col-sm-4'>{i18n.getMessage('Common.name')}</label>
                            <div className='col-sm-8'>
                                <input
                                    className='form-control'
                                    value={params.name}
                                    onChange={e => this.handleChange(e.target.value, 'name')}
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label className='col-sm-4'>{i18n.getMessage('Common.client')}</label>
                            <div className='col-sm-8'>
                                <Client.Dropdown
                                    id={params.clientId}
                                    onChange={value => this.handleChange(value && value.id, 'clientId')}
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label className='col-sm-4'>{i18n.getMessage('Common.businessPartner')}</label>
                            <div className='col-sm-8'>
                                <BusinessPartner.Dropdown
                                    id={params.businessPartnerId}
                                    onChange={value => this.handleChange(value && value.id, 'businessPartnerId')}
                                />
                            </div>
                        </div>

                    </div>

                    <div className='col-sm-6'>

                        <div className='form-group'>
                            <label className='col-sm-4'>{i18n.getMessage('ServiceProfileOverview.docType.label')}</label>
                            <div className='col-sm-8'>
                                <Select
                                    value={this.getDefaultLabel(params.docType, 'docType')}
                                    onChange={item => this.handleChange(item, 'docType')}
                                    options={
                                        ['invoice', 'order', 'orderResponse', 'despatchAdvice']
                                            .map(docType => this.getDefaultLabel(docType, 'docType'))
                                    }
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label className='col-sm-4'>{i18n.getMessage('ServiceProfileOverview.direction')}</label>
                            <div className='col-sm-8'>
                                <Select
                                    value={this.getDefaultLabel(params.direction, 'direction')}
                                    onChange={item => this.handleChange(item && item.value, 'direction')}
                                    options={
                                        ['sending', 'receiving']
                                            .map(direction => this.getDefaultLabel(direction, 'direction'))
                                    }
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <div className='form-submit text-right'>
                    <button
                        type='button'
                        className='btn btn-link'
                        onClick={this.props.onReset}
                    >
                        {i18n.getMessage('ServiceProfileOverview.reset')}
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary'
                        onClick={this.props.onSubmit}
                    >
                        {i18n.getMessage('ServiceProfileOverview.search')}
                    </button>
                </div>
            </form>
        </div>)
    }
}

export default SearchForm;
