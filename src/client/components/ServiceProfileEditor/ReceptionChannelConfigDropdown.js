import React from 'react';
import PropTypes from 'prop-types';
import { Components } from '@opuscapita/service-base-ui';
import Select from '@opuscapita/react-select';
import ReceptionChannelConfigApi from '../../api/ReceptionChannelConfigApi';

class ReceptionChannelConfigDropdown extends Components.ContextComponent {

    static propsTypes = {
        receptionChannelConfigId: PropTypes.string,
        clientId: PropTypes.oneOf([PropTypes.string, PropTypes.array]),
        businessPartnerId: PropTypes.oneOf([PropTypes.string, PropTypes.array]),
        onChange: PropTypes.func,
    }

    static defaultProps = {
        onChange: () => null,
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            receptionChannelConfig: null,
            receptionChannelConfigs: [],
        };
    }

    async componentDidMount() {
        await this.reload();
    }

    async componentWillReceiveProps(nextProps) {
        this.setReceptionChannelConfig(nextProps);
        if (nextProps.clientId !== this.props.clientId || nextProps.businessPartnerId !== this.props.businessPartnerId) {
            await this.reload(nextProps);
        }
    }

    handleChange(receptionChannelConfigId) {
        const { receptionChannelConfigs } = this.state;
        let receptionChannelConfig = null;

        if (receptionChannelConfigId && receptionChannelConfigs) {
            receptionChannelConfig = receptionChannelConfigs.find(config => config.id === receptionChannelConfigId);
        }

        this.props.onChange(receptionChannelConfig);
    }

    setReceptionChannelConfig({ receptionChannelConfigId }) {
        const { receptionChannelConfigs } = this.state;
        if (receptionChannelConfigs) {
            const receptionChannelConfig = receptionChannelConfigs.find(config => config.id === receptionChannelConfigId);
            this.setState({ receptionChannelConfig });
        }
    }

    async reload({ clientId, businessPartnerId } = this.props) {
        const { i18n, showNotification } = this.context;

        try {
            this.setState({ loading: true });
            let receptionChannelConfigs = await ReceptionChannelConfigApi.findAll({ clientId, businessPartnerId });
            receptionChannelConfigs.unshift({
                id: 'new',
                name: i18n.getMessage('Common.createNew'),
            })
            this.setState({ receptionChannelConfigs, loading: false }, () => this.setReceptionChannelConfig(this.props));
            return receptionChannelConfigs;
        }
        catch (error) {
            showNotification(i18n.getMessage('ServiceProfileEditor.notification.failedToReceptionChannelConfigs'), 'error');
        }
    }

    getLabel(receptionChannelConfig) {
        if (receptionChannelConfig) {
            return {
                value: receptionChannelConfig.id,
                label: receptionChannelConfig.name,
            }
        }
        else {
            return null
        }
    }

    render() {
        const { receptionChannelConfig, receptionChannelConfigs, loading } = this.state;
        return <Select 
            loading={loading}
            value={this.getLabel(receptionChannelConfig)}
            options={receptionChannelConfigs.map(rcc => this.getLabel(rcc))}
            onChange={item => this.handleChange(item && item.value)}
            placeholder=''
        />
    }
}

export default ReceptionChannelConfigDropdown;
