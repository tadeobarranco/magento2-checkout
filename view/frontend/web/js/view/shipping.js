/**
 * Barranco\Checkout
 */

define([
    'ko',
    'uiComponent',
], function(ko, Component) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/shipping'
        },
        visible: ko.observable(true),

        /**
         * @return this
         */
        initialize: function () {
            this._super();
        }
    });
});
