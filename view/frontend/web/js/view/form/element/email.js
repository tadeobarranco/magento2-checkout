/**
 * Barranco\Checkout
 */

define([
    'ko',
    'uiComponent',
    'Magento_Customer/js/model/customer'
], function(ko, Component, customer) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/form/element/email',
            isPasswordVisible: ko.observable(false)
        },

        isCustomerLoggedIn: customer.isLoggedIn,

        /**
         * @inheritdoc
         */
        initialize: function () {
            this._super();
        }
    });
});
