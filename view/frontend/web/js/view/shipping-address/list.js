/**
 * Barranco\Checkout
 */

define([
    'uiComponent',
    'Magento_Customer/js/model/address-list'
], function(Component, customerAddressList) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/shipping-address/list',
            visible: customerAddressList().length > 0
        },

        initialize: function () {
            this._super();

            return this;
        }
    });
});