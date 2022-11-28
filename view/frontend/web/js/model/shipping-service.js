define([
    'ko'
], function(ko) {
    'use strict';
    
    var shippingRates = ko.observableArray([]);

    return {
        isLoading: ko.observable(false),

        /**
         * Set shipping rates
         *
         * @param {*} rates
         */
        setShippingRates: function (rates) {
            shippingRates(rates);
        },

        /**
         * Get shipping rates
         *
         * @return {*}
         */
        getShippingRates: function () {
            return shippingRates;
        }
    }
});