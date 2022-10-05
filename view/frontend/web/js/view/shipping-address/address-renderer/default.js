/**
 * Barranco\Checkout
 */

define([
    'ko',
    'uiComponent',
    'Barranco_Checkout/js/action/select-shipping-address',
    'Magento_Customer/js/customer-data',
    'Magento_Checkout/js/model/quote'
], function(ko, Component, selectShippingAddressAction, customerData, quote) {
    'use strict';

    var countryData = customerData.get('directory-data');

    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/shipping-address/address-renderer/default'
        },

        /** @inheritdoc */
        initObservable: function () {
            this._super();

            this.isSelected = ko.computed(function () {
                var isSelected = false,
                    shippingAddress = quote.shippingAddress();

                if (shippingAddress) {
                    isSelected = shippingAddress.getKey() == this.address().getKey();
                }

                return isSelected;
            }, this);

            return this;
        },

        /**
         * Get country name
         *
         * @param {String} countryId
         * @return {String}
         */
        getCountryName: function(countryId) {
            return countryData()[countryId] != undefined ? countryData()[countryId].name : '';
        },

        /**
         * Select shipping address
         */
        selectAddress: function() {
            selectShippingAddressAction(this.address());
        }
    });
});
