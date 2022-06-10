/**
 * Barranco\Checkout
 */

define([
    'ko',
    'uiComponent',
    'Barranco_Checkout/js/model/step-navigator',
    'mage/translate',
    'underscore',
    'Barranco_Checkout/js/model/full-screen-loader'
], function(ko, Component, stepNavigator, $t, _, fullScreenLoader) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/shipping'
        },
        visible: ko.observable(true),
        complete: ko.observable(false),

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
                this.sortOrder,
                this.complete
            );
        },

        /**
         * @param {Object} step
         */
        navigate: function (step) {
            step && step.isVisible(true);
        },

        navigateToNextStep: function () {
            fullScreenLoader.startLoader();
            stepNavigator.next();
            fullScreenLoader.stopLoader();
        }
    });
});
