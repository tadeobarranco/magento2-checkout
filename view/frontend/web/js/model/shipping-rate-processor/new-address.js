define([
    'Barranco_Checkout/js/model/resource-url-manager',
    'Barranco_Checkout/js/model/shipping-service',
    'Magento_Checkout/js/model/quote',
    'mage/storage'
], function(urlManager, shippingService, quote, storage) {
    'use strict';

    return {

        /**
         * Get shipping rates for new address
         *
         * @param {Object} address
         */
        getRates: function (address) {
            var url, data;

            shippingService.isLoading(true);

            url = urlManager.getUrlForEstimationShippingMethodsForNewAddress(quote);
            data = JSON.stringify({
                address: {
                    'city': address.city,
                    'country_id':  address.countryId,
                    'firstname': address.firstname,
                    'lastname': address.lastname,
                    'postcode': address.postcode,
                    'region': address.region,
                    'region_id': address.regionId,
                    'street': address.street,
                    'telephone': address.telephone
                }
            });

            storage.post(
                url, data, false
            ).done(function () {
                console.log('post done');
            }).fail(function () {
                console.log('post fail');
            }).always(function () {
                shippingService.isLoading(false);
            });
        }
    }
});
