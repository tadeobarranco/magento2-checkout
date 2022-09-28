define([
    'jquery',
    'Barranco_Checkout/js/model/new-customer-address',
    'Magento_Customer/js/customer-data'
], function($, newCustomerAddress, customerData) {
    'use strict';

    var countryData = customerData.get('directory-data');

    return {

        /**
         * Convert form data to adress object
         *
         * @param {Object} formData
         * @return {Object}
         */
        formAddressDataToQuoteAddress: function (formData) {
            var addressData = $.extend(true, {}, formData),
                region,
                regionName = addressData.region;

            addressData.region = {
                'region_id': addressData['region_id'],
                'region_code': addressData['region_code'],
                region: regionName
            }

            if (addressData['region_id'] &&
                countryData()[addressData['country_id']] &&
                countryData()[addressData['country_id']].regions
            ) {
                region = countryData()[addressData['country_id']].regions[addressData['region_id']];

                if (region) {
                    addressData.region['region_id'] = addressData['region_id'];
                    addressData.region['region_code'] = region.code;
                    addressData.region.region = region.name
                }
            }

            return newCustomerAddress(addressData);
        }
    }
});
