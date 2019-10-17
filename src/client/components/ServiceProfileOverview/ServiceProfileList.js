import React from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import { Components } from '@opuscapita/service-base-ui';


class ServiceProfileList extends Components.ContextComponent {

    static propTypes = {
        serviceProfiles: PropTypes.array,
        onHandleDelete: PropTypes.func,
    };

    static defaultProps = {
        onHandleDelete: () => null,
    }

    constructor(props, context) {
        super(props);
    }

    getColumns() {
        const { i18n, router } = this.context;
        return [{
            accessor: 'name',
            Header: i18n.getMessage('Common.name')
        }, {
            accessor: 'description',
            Header: i18n.getMessage('Common.description')
        }, {
            id: 'actions',
            accessor: data => data,
            Cell: ({ value }) =>
                <nobr>
                    <button
                        type="button"
                        className="btn btn-sm btn-default"
                        onClick={(e) => {
                            e.preventDefault();
                            router.push(`/email-gateway/service-profile/edit/${value.id}`);
                        }}
                    >
                        {i18n.getMessage('ServiceProfileOverview.actions.open')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-default"
                        onClick={(e) => {
                            e.preventDefault();
                            this.props.onHandleDelete(value.id)
                        }}
                    >
                        {i18n.getMessage('ServiceProfileOverview.actions.delete')}
                    </button>
                </nobr>
        }]
    }

    render() {
        const { i18n } = this.context;
        const { serviceProfiles, loading } = this.props;

        console.log(serviceProfiles);
        
        return (<div className="row">
            <div className="col-xs-12">
                
                {serviceProfiles.length > 0 ? 
                <ReactTable
                    data={serviceProfiles}
                    columns={this.getColumns()}
                    loading={loading}

                    loadingText={i18n.getMessage('ServiceProfileOverview.loading')}
                    noDataText={i18n.getMessage('ServiceProfileOverview.nodata')}
                    previousText={i18n.getMessage('ServiceProfileOverview.pagination.previous')}
                    nextText={i18n.getMessage('ServiceProfileOverview.pagination.next')}
                    pageText={i18n.getMessage('ServiceProfileOverview.pagination.page')}
                    ofText={i18n.getMessage('ServiceProfileOverview.pagination.of')}
                    rowsText={i18n.getMessage('ServiceProfileOverview.pagination.rows')}
                    className="-striped -highlight ocbn table" 
                /> : <p>Empty array</p>}
            </div>
        </div>)
    }
}

export default ServiceProfileList;
