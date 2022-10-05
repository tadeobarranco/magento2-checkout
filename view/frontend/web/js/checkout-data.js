define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'jquery/jquery-storageapi'
], function($, storage) {
    'use strict';
    
    var cacheKey = 'my-checkout-data',

    /**
     * Initialize the component properties
     *
     * @returns {*}
     */
    initData = function () {
        return {
            'newCustomerShippingAddress': null,
            'selectedShippingAddress': null
        }
    },

    /**
     * Save object to the customer data storage
     *
     * @param {Object} data
     * @returns {*}
     */
    saveData = function (data) {
        storage.set(cacheKey, data);
    },

    /**
     * Get data from the customer data storage
     *
     * @returns {*}
     */
    getData = function () {
        var data = storage.get(cacheKey)();

        if ($.isEmptyObject(data)) {
            data = $.initNamespaceStorage('mage-cache-storage').localStorage.get(cacheKey);

            if ($.isEmptyObject(data)) {
                data = initData();
                saveData(data);
            }
        }

        return data;
    };

    return {

        /**
         * Set new customer shipping address to the customer data storage
         *
         * @param {Object} data 
         */
        setNewCustomerShippingAddress: function (data) {
            var checkoutData = getData();

            checkoutData.newCustomerShippingAddress = data;
            saveData(checkoutData);
        },

        /**
         * Get new customer shipping address from the customer data storage
         *
         * @returns {*}
         */
        getNewCustomerShippingAddress: function () {
            var checkoutData = getData();

            return checkoutData.newCustomerShippingAddress;
        },

        /**
         * Set new customer address as selected to the customer data storage
         *
         * @param {Object} data 
         */
        setSelectedShippingAddress: function(data) {
            var checkoutData = getData();

            checkoutData.selectedShippingAddress = data;
            saveData(checkoutData);
        },

        /**
         * Get new customer address as selected from the customer data storage
         *
         * @returns {*}
         */
        getSelectedShippingAddress: function () {
            var checkoutData = getData();

            return checkoutData.selectedShippingAddress;
        }
    }
});
