define([
    'Barranco_Checkout/js/model/shipping-rate-processor/new-address',
    'Magento_Checkout/js/model/quote'
], function(newAddressProcessor, quote) {
    'use strict';

    var processors = {};

    processors.default = newAddressProcessor;
    
    quote.shippingAddress.subscribe(function () {
        processors.default.getRates(quote.shippingAddress());
    });
});
