/**
 * Barranco\Checkout
 */

define([
    'jquery',
    'ko',
    'underscore',
    'Barranco_Checkout/js/model/full-screen-loader',
    'Barranco_Checkout/js/model/step-navigator',
    'Magento_Customer/js/model/address-list',
    'Magento_Customer/js/model/customer',
    'Magento_Ui/js/form/form',
    'mage/translate'
], function ($, ko, _, fullScreenLoader, stepNavigator, addressList, customer, Component, $t) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/shipping',
            myShippingAddressFormTemplate: 'Barranco_Checkout/shipping-address/form'
        },
        visible: ko.observable(true),
        complete: ko.observable(false),
        isFormInline: addressList().length === 0,

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
            if (this.validateShippingInformation()) {
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
        validateShippingInformation: function () {
            var loginFormSelector = 'form[data-role="my-customer-email-form"]',
                loginForm = $(loginFormSelector),
                myCustomerEmail = loginFormSelector + ' input[name="my-customer-email"]',
                valid = customer.isLoggedIn();

            if (!customer.isLoggedIn()) {
                loginForm.validation();
                valid = !!$(myCustomerEmail).valid();
            }

            if (!valid) {
                $(myCustomerEmail).focus();
                return false;
            }

            if (this.isFormInline) {
                this.source.set('params.invalid', false);
                this.source.trigger('shippingAddress.data.validate');

                if (this.source.get('params.invalid')) {
                    this.focusInvalid();
                    return false;
                }
            }

            return true;
        }
    });
});
