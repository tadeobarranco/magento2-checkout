/**
 * Barranco\Checkout
 */

define([
    'underscore',
    'Barranco_Checkout/js/action/select-shipping-address',
    'Magento_Checkout/js/model/quote',
    'Magento_Customer/js/model/address-list'
], function(_, selectShippingAddressAction, quote, addressList) {
    'use strict';
    
    return {

        /**
         * Resolve shipping address
         */
        resolveShippingAddress: function () {
            this.applyShippingAddress();
        },

        /**
         * Apply address to quote
         */
        applyShippingAddress: function () {
            var shippingAddress;

            shippingAddress = quote.shippingAddress();

            if (!shippingAddress) {
                shippingAddress = this.getShippingAddressFromCustomerAddressList();

                if (shippingAddress) {
                    selectShippingAddressAction(shippingAddress);
                }
            }
        },

        /**
         * Get shipping address form customer address list
         */
        getShippingAddressFromCustomerAddressList: function () {
            var shippingAddress = _.find(
                addressList(),
                function (address) {
                    return address.isDefaultShipping();
                }
            );

            return shippingAddress;
        }
    }
});
