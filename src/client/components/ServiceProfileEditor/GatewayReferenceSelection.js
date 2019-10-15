import React from 'react';
import PropTypes from 'prop-types';
import { Components } from '@opuscapita/service-base-ui';
import Select from '@opuscapita/react-select';
import GatewayReferenceApi from '../../api/GatewayReference';

class GatewayReferenceDropdown extends Components.ContextComponent {

    static propsTypes = {
        gatewayReferenceId: PropTypes.string,
        onChange: PropTypes.func,
    }

    static defaultProps = {
        onChange: () => null,
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            gatewayReferences: [],
            toDelete: [],
        };
    }

    async componentDidMount() {
        await this.loadGatewayReferences();
    }


    addGateway(gatewayType)
    {
        const { gatewayReferences } = this.state;

        let newGateway = {
            gatewayType
        }

        gatewayReferences.push(newGateway)

        this.setState({
            gatewayReferences
        });
    }

    deleteGateway(index)
    {
        const { gatewayReferences, toDelete } = this.state;

        const [gatewayReference] = gatewayReferences.splice(index, 1);
        if (gatewayReference.id) {
            toDelete.push(gatewayReference);
        }

        this.setState({
            toDelete
        });
    }

    /**
     * Some gateways should not be used repeatedly - like the Legacy SFTP Gateway.
     *
     * TODO: Render not allowed gateway types in the select component as disabled (greyed out)
     */
    isAddingAllowed(supportedGatewayTypes, selectedGatewayType)
    {
        const sg = supportedGatewayTypes.find(item => item.value === selectedGatewayType)

        if (sg && sg.singleUsage && this.state.gatewayReferences && this.state.gatewayReferences.length)
        {
            // already in use?
            let found = this.state.gatewayReferences.find((item) => {
                return item.gatewayType === selectedGatewayType;
            })
            return !found;
        }
        else {
            return true;
        }
    }


    async loadGatewayReferences() {
        const { i18n, showNotification } = this.context;
        const { serviceProfileId } = this.props;

        try {
            if (serviceProfileId) {
                this.setState({ loading: true });
                let gatewayReferences = await GatewayReferenceApi.findAll({ serviceProfileId });
                this.setState({ gatewayReferences, loading: false });
            }
        }
        catch (error) {
            showNotification(i18n.getMessage('ServiceProfileEditor.notification.failedToLoadGatewayReferences'), 'error');
        }
    }

    async onSave() {
        const { i18n, showNotification } = this.context;
        const { serviceProfileId } = this.props;
        let { gatewayReferences, toDelete } = this.state;

        try {
            const results = await Promise.all([
                ...gatewayReferences.map(async gr => {
                    const gatewayReference = {
                        ...gr,
                        serviceProfileId,
                        gatewayId: 'unknown',
                    };
                    if (gatewayReference.id) {
                        return GatewayReferenceApi.update(gatewayReference);
                    }
                    else {
                        return GatewayReferenceApi.create(gatewayReference);
                    }
                }),
                ...toDelete.map(async gatewayReference => {
                    return GatewayReferenceApi.delete(gatewayReference.id);
                }),
            ]);

            gatewayReferences = results.slice(0, gatewayReferences.length);

            this.setState({ gatewayReferences, toDelete: [] });

        }
        catch (error) {
            showNotification(i18n.getMessage('ServiceProfileEditor.notification.failedToSaveGatewayReference'), 'error');
        }
    }

    // TODO: Group gateway references by gateway type!
    render()
    {

        const { i18n } = this.context;
        const { selectedGatewayType, gatewayReferences, loading } = this.state;

        // TODO: Move to e.g. class variable and do the label determination in componentDidMount
        const supportedGatewayTypes = [
            {
                value: 'legacySftpGateway',
                label: i18n.getMessage('ServiceProfileEditor.gatewayType.legacySftpGateway'),
                singleUsage: true
            },
            {
                value: 'sftpGateway',
                label: i18n.getMessage('ServiceProfileEditor.gatewayType.sftpGateway'),
            }

       ];

        return <div className='form-group'>

            <div className='col-sm-4'>
                <label>{i18n.getMessage('ServiceProfileEditor.gatewayReference.label')}</label>
            </div>

            <div className='col-sm-7'>
                <Select
                    loading={loading}
                    options={supportedGatewayTypes}
                    value={ selectedGatewayType ? { value: selectedGatewayType, label: i18n.getMessage(`ServiceProfileEditor.gatewayType.${selectedGatewayType}`) } : null}
                    onChange={item => this.setState({selectedGatewayType: (item && item.value)})}
                    placeholder=''
                />
            </div>

            <div className='col-sm-1'>
                <button type="button" className="btn btn-default"
                    disabled={!(selectedGatewayType && this.isAddingAllowed(supportedGatewayTypes, selectedGatewayType))}
                    onClick={() => this.addGateway(selectedGatewayType)}
                >
                    <i className="glyphicon glyphicon-plus" aria-hidden="true"></i>
                </button>
            </div>


            {!!gatewayReferences.length && gatewayReferences.map(({ gatewayType }, index) => {

                return <div key={index}>

                    <div className="col-sm-12">
                        <h5>{i18n.getMessage(`ServiceProfileEditor.gatewayType.${gatewayType}`)}</h5>
                    </div>

                    <div className='col-sm-4'>
                        {/* <label>{(index + 1) + ". " + i18n.getMessage(`ServiceProfileEditor.gatewayType.${gatewayType}`)}</label> */}
                    </div>

                    {gatewayType === 'legacySftpGateway' ?
                        <div className='col-sm-7'
                            dangerouslySetInnerHTML={{ __html: i18n.getMessage('ServiceProfileEditor.legacySftpGateway.info').replace(/\n/g, "<br/>")}}
                        />
                    :
                        <div className='col-sm-7'>
                            {i18n.getMessage('ServiceProfileEditor.gatewayReference.noComponent').replace(/\n/g, "<br/>")}
                        </div>
                    }

                    <div className='col-sm-1'>
                        <button type="button" className="btn btn-trans btn-link btn-narrow"
                            onClick={e => this.deleteGateway(index)}
                        >
                            <i className="glyphicon glyphicon-remove" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            })}

        </div>
    }
}

export default GatewayReferenceDropdown;
