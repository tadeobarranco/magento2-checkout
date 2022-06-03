/**
 * Barranco\Checkout
 */

define([
    'ko',
    'uiComponent',
    'Barranco_Checkout/js/model/step-navigator',
    'mage/translate',
    'underscore'
], function(ko, Component, stepNavigator, $t, _) {
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

            stepNavigator.registerStep(
                'shipping',
                '',
                $t('Shipping'),
                this.visible,
                _.bind(this.navigate, this),
                this.sortOrder
            );
        },

        /**
         * @param {Object} step
         */
        navigate: function (step) {
            step && step.isVisible(true);
        }
    });
});
