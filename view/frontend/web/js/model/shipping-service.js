define([
    'ko'
], function(ko) {
    'use strict';
    
    var shippingRates = ko.observableArray([]);

    return {
        isLoading: ko.observable(false),

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