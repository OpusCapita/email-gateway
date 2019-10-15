import validatejs from 'validate.js';

validatejs.options = { fullMessages: false };

function validate(productProfile, i18n) {
    const constraints = {
        name: {
            presence: {
                message: i18n.getMessage('System.required'),
                allowEmpty: false,
            },
        },
        clientId: {
            presence: {
                message: i18n.getMessage('System.required'),
                allowEmpty: false,
            },
        },
        productProfileId: {
            presence: {
                message: i18n.getMessage('System.required'),
                allowEmpty: false,
            },
        },
        docType: {
            presence: {
                message: i18n.getMessage('System.required'),
                allowEmpty: false,
            },
        },
        inboundBusinessChannelId: (value, serviceProfile) => {
            if(serviceProfile.direction !== 'sending') {
                return null;
            }
            return {
                presence: {
                    allowEmpty: false,
                    message: i18n.getMessage('System.required'),
                },
            }
        },
        routingPreferencePriorityList: (value, serviceProfile) => {
            if(serviceProfile.direction !== 'sending') {
                return null;
            }
            return {
                presence: {
                    allowEmpty: false,
                    message: i18n.getMessage('System.required'),
                },
            }
        },
        direction: true,
        receptionChannelConfigId: (value, attributes) => {
            if(attributes.direction !== 'sending') {
                return null;
            }
            return {
                presence: {
                    allowEmpty: false,
                    message: i18n.getMessage('System.required'),
                },
            };
        }
    };

    return validatejs(productProfile, constraints);
}

export default validate;
