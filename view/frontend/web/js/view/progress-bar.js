/**
 * Barranco\Checkout
 */

define([
    'uiComponent',
    'Barranco_Checkout/js/model/step-navigator'
], function(Component, stepNavigator) {
    'use strict';

    var steps = stepNavigator.steps;
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/progress-bar'
        },
        steps: steps,

        /** @inheritdoc */
        initialize: function () {
            this._super();
        },

        /**
         * Control step visibility
         *
         * @param {Object} step
         */
        navigateTo: function (step) {
            stepNavigator.navigateTo(step);
        },

        /**
         * Control how steps should be sorted
         *
         * @param {Object} left
         * @param {Object} right
         */
        sortItems: function (left, right) {
            return stepNavigator.sortItems(left, right);
        }
    });
});
