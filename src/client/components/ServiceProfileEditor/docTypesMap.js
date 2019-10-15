

const docTypesMap = {
    invoiceSending: {
        invoice: 'sending',
    },
    invoiceReceiving: {
        invoice: 'receiving',
    },
    order2Cash: {
        invoice: 'sending',
        order: 'receiving',
        orderResponse: 'sending',
        despatchAdvice: 'sending'
    },
    purchase2Pay: {
        invoice: 'receiving',
        order: 'sending',
        orderResponse: 'receiving',
        despatchAdvice: 'receiving'
    },
};

export default docTypesMap;
