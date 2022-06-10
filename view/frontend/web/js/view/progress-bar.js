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

        initialize: function () {
            this._super();
        },

        navigateTo: function (step) {
            stepNavigator.navigateTo(step);
        }
    });
});
