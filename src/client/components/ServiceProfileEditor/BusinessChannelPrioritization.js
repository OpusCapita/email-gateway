import React from 'react';
import PropTypes from 'prop-types';
import { Components } from '@opuscapita/service-base-ui';
import PrioritySelect from '../PrioritySelect';
import BusinessChannelGroupApi from '../../api/BusinessChannelGroupApi';

class BusinessChannelPrioritization extends Components.ContextComponent {

    static propTypes = {
        value: PropTypes.array,
        onChange: PropTypes.func,
        direction: PropTypes.string,
    }

    static defaultProps = {
        onChange: () => {},
    }

    constructor(props) {
        super(props);

        this.state = {
            businessChannelGroups: [],
            loading: true,
        }
    } 

    async componentDidMount() {
        await this.findBusinessChannelGroups();
    }

    async findBusinessChannelGroups() {
        const { direction } = this.props;
        const { i18n, showNotification } = this.context;
        try {
            this.setState({ loading: true });
            const businessChannelGroups = await BusinessChannelGroupApi.getAll({ direction });
            this.setState({ businessChannelGroups, loading: false });
        }
        catch (err) {
            console.log(err.message)
            showNotification(i18n.getMessage('ServiceProfileEditor.notification.failedToLoadBusinessChannelGroups'), 'error')
        }
    }

    get selectedBusinessChannelsGroups() {
        const { value } = this.props;
        const { businessChannelGroups } = this.state;
        return value ? value.map(v => businessChannelGroups.find(group => group.id === v)).filter(res => res != null) : [];
    }

    getLabel(businessChannelGroup) {
        return {
            value: businessChannelGroup.id,
            label: businessChannelGroup.name,
        }
    }

    render() {
        const { onChange } = this.props;
        const { businessChannelGroups, loading } = this.state;

        return <PrioritySelect
            value={this.selectedBusinessChannelsGroups.map(this.getLabel)}
            options={businessChannelGroups.map(this.getLabel)}
            loading={loading}
            onChange={items => onChange((items || []).map(i => i.value))}
        />
    }
}

export default BusinessChannelPrioritization;
