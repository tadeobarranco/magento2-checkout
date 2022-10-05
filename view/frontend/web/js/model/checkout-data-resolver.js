/**
 * Barranco\Checkout
 */

define([
    'underscore',
    'Barranco_Checkout/js/action/create-shipping-address',
    'Barranco_Checkout/js/action/select-shipping-address',
    'Barranco_Checkout/js/checkout-data',
    'Magento_Checkout/js/model/quote',
    'Magento_Customer/js/model/address-list'
], function(
    _,
    createShippingAddressAction,
    selectShippingAddressAction,
    checkoutData,
    quote,
    addressList
) {
    'use strict';
    
    return {

        /**
         * Resolve shipping address
         */
        resolveShippingAddress: function () {
            var newCustomerShippingAddress = checkoutData.getNewCustomerShippingAddress();

            if (newCustomerShippingAddress) {
                createShippingAddressAction(newCustomerShippingAddress);
            }

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
                    return checkoutData.getSelectedShippingAddress() == address.getKey();
                }
            );

            if (!shippingAddress) {
                shippingAddress = _.find(
                    addressList(),
                    function (address) {
                        return address.isDefaultShipping();
                    }
                );
            }

            return shippingAddress;
        }
    }
});
