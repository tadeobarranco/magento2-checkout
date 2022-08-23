/**
 * Barranco\Checkout
 */

define([
    'uiComponent',
    'Magento_Customer/js/customer-data'
], function(Component, customerData) {
    'use strict';

    var countryData = customerData.get('directory-data');

    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/shipping-address/address-renderer/default'
        },

        /**
         * Get country name
         *
         * @param {String} countryId
         * @return {String}
         */
        getCountryName: function(countryId) {
            return countryData()[countryId] != undefined ? countryData()[countryId].name : '';
        }
    });
});
