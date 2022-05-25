/**
 * Barranco\Checkout
 */

define([
    'uiComponent',
    'ko'
], function(Component, ko) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/payment'
        },
        isVisible: ko.observable(false),

        initialize: function () {
            this._super();
        }
    });
});
