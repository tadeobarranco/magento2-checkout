define([
    'Barranco_Checkout/js/model/url-builder',
    'Magento_Customer/js/model/customer'
], function(urlBuilder, customer) {
    'use strict';

    return {

        /**
         * Get URL for estimation based on customer or guest users
         *
         * @param {Object} quote
         * @return {*}
         */
        getUrlForEstimationShippingMethodsForNewAddress: function (quote) {
            var params, urls;

            params = this.getCheckoutMethod() == 'customer' ? {} : { quoteId: quote.getQuoteId() };
            urls = {
                'customer': '/my-carts/mine/estimate-shipping-methods',
                'guest': '/my-guest-carts/:quoteId/estimate-shipping-methods'
            };

            return this.getUrl(urls, params);
        },

        /**
         * Get checkout method
         *
         * @return {String}
         */
        getCheckoutMethod: function () {
            return customer.isLoggedIn() ? 'customer' : 'guest';
        },

        /**
         * Get URL
         *
         * @param {*} urls
         * @param {*} params
         * @return {String}
         */
        getUrl: function (urls, params) {
            var url = urls[this.getCheckoutMethod()];

            return urlBuilder.createUrl(url, params);
        }
    }
});
