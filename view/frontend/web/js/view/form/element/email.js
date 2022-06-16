/**
 * Barranco\Checkout
 */

define([
    'uiComponent',
    'Magento_Customer/js/model/customer'
], function(Component, customer) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/form/element/email',
            isPasswordVisible: false
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
