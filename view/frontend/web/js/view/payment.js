/**
 * Barranco\Checkout
 */

define([
    'uiComponent',
    'ko',
    'Barranco_Checkout/js/model/step-navigator',
    'mage/translate',
    'underscore'
], function(Component, ko, stepNavigator, $t, _) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/payment'
        },
        isVisible: ko.observable(false),

        initialize: function () {
            this._super();

            stepNavigator.registerStep(
                'payment',
                '',
                $t('Review & Payments'),
                this.visible,
                _.bind(this.navigate, this),
                this.sortOrder
            );
        },

        navigate: function () {
            this.isVisible(false);
        }
    });
});
