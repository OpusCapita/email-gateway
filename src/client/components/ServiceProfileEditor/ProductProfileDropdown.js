import React from 'react';
import PropTypes from 'prop-types';
import Select from '@opuscapita/react-select';
import { Components } from '@opuscapita/service-base-ui';
import ProductProfileApi from '../../api/ProductProfileApi';
import docTypesMap from './docTypesMap';

class ProductProfile extends Components.ContextComponent {

    static propsTypes = {
        onChange: PropTypes.func,
        productProfileId: PropTypes.string,
        clientId: PropTypes.string,
    }

    static defaultProps = {
        onChange: () => null,
    }

    constructor(props) {
        super(props);

        this.state = {
            productProfile: null,
            productProfiles: [],
        };
    }

    async componentDidMount() {
        const { i18n, showSpinner, hideSpinner, showNotification } = this.context;
        const { clientId, productProfileId } = this.props;

        try {
            showSpinner();
            const productProfiles = await ProductProfileApi.findAll({ clientId });
            this.setState({ productProfiles }, () => this.updateProductProfile(productProfileId));
            hideSpinner();
        }
        catch (error) {
            hideSpinner();
            showNotification(i18n.getMessage('ServiceProfileEditor.notification.failedLoadingProductProfiles'), 'error');
        }
    }

    componentWillReceiveProps(nextProps) {
        const { productProfileId } = nextProps;
        const { productProfile } = this.state;

        if (productProfileId) {
            if ((productProfile == null) || (productProfileId !== productProfile.id)) {
                this.updateProductProfile(productProfileId);
            }
        }
        else {
            this.setState({ productProfile: null });
        }
    }

    getLabel(productProfile) {
        const { i18n } = this.context;
        if (productProfile) {
            const { id, commercialOffering } = productProfile;
            return {
                value: id,
                label: `${i18n.getMessage(`ServiceProfileEditor.commercialOffering.${commercialOffering}`)}`,
            }
        }
        return {};
    }

    handleChange(productProfileId) {
        if (productProfileId) {
            this.updateProductProfile(productProfileId);
        }
        else {
            this.setState(
                { productProfile: null },
                () => this.props.onChange({
                    docTypes: [],
                    productProfile: null,
                }),
            );
        }
    }

    updateProductProfile(productProfileId) {
        const { i18n, showSpinner, hideSpinner, showNotification } = this.context;
        showSpinner();
        ProductProfileApi.find(productProfileId)
            .catch(error => {
                hideSpinner();
                showNotification(i18n.getMessage('ServiceProfileEditor.notification.failedLoadingProductProfile'), 'error');
            })
            .then(productProfile => {
                let docTypes = [];
                if (productProfile) {
                    docTypes = docTypesMap[productProfile.commercialOffering];
                    docTypes = Object.keys(docTypes);
                }

                this.setState(
                    { productProfile },
                    () => {
                        hideSpinner();
                        this.props.onChange({
                            docTypes,
                            productProfile: this.state.productProfile,
                        })
                    },
                );
            });
    }

    render() {
        const { productProfile, productProfiles } = this.state;
        return <Select
            onChange={item => this.handleChange(item && item.value)}
            value={this.getLabel(productProfile)}
            options={
                (productProfiles || [])
                    .map(productProfile => this.getLabel(productProfile))
            }
        />
    }
}

export default ProductProfile;
