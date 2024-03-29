/**
 * Barranco\Checkout
 */

define([
    'Magento_Checkout/js/model/quote'
], function(quote) {
    'use strict';
    
    return function (shippingAddress) {
        quote.shippingAddress(shippingAddress);
    }
});
