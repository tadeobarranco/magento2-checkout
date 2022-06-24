/**
 * Barranco\Checkout
 */

define([
    'jquery',
    'ko',
    'Magento_Ui/js/form/form',
    'Barranco_Checkout/js/model/step-navigator',
    'mage/translate',
    'underscore',
    'Barranco_Checkout/js/model/full-screen-loader',
    'Magento_Customer/js/model/customer'
], function($, ko, Component, stepNavigator, $t, _, fullScreenLoader, customer) {
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

        /**
         * Move foward to the next step
         */
        navigateToNextStep: function () {
            if (this.validateEmail()) {
                fullScreenLoader.startLoader();
                stepNavigator.next();
                fullScreenLoader.stopLoader();
            }
        },

        /**
         * Validate customer email
         *
         * @return {Boolean}
         */
        validateEmail: function () {
            var loginFormSelector = 'form[data-role="my-customer-email-form"]',
                loginForm = $(loginFormSelector),
                myCustomerEmail = loginFormSelector + ' input[name="my-customer-email"]',
                valid;

            if (!customer.isLoggedIn()) {
                loginForm.validation();
                valid = !!$(myCustomerEmail).valid();
            }

            if (!valid) {
                $(myCustomerEmail).focus();
                return false;
            }

            return true;
        }
    });
});
