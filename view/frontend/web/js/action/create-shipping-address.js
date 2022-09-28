define([
    'Magento_Customer/js/model/address-list',
    'Barranco_Checkout/js/model/address-converter'
], function(addressList, addressConverter) {
    'use strict';

    return function (addressData) {
        var address = addressConverter.formAddressDataToQuoteAddress(addressData);

        addressList.push(address);

        return address;
    }
});
