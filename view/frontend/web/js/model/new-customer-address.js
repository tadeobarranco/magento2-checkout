define([
    'underscore',
], function(_) {
    'use strict';

    return function (addressData) {

        var countryId = addressData['country_id'] || window.checkoutConfig.defaultCountryId;

        return {
            firstname: addressData.firstname,
            lastname: addressData.lastname,
            street: addressData.street ? _.compact(addressData.street) : addressData.street,
            city: addressData.city,
            regionId: addressData.region['region_id'],
            regionCode: addressData.region['region_code'],
            region: addressData.region.region,
            postcode: addressData.postcode,
            countryId: countryId,
            telephone: addressData.telephone,

            /**
             * @return {String}
             */
            getType: function () {
                return 'new-customer-address';
            },

            /**
             * @return {String}
             */
            getKey: function () {
                return this.getType();
            }
        }
    }
});
