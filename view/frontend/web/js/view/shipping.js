/**
 * Barranco\Checkout
 */

define([
    'jquery',
    'ko',
    'uiRegistry',
    'underscore',
    'Barranco_Checkout/js/model/checkout-data-resolver',
    'Barranco_Checkout/js/model/full-screen-loader',
    'Barranco_Checkout/js/model/postcode-validator',
    'Barranco_Checkout/js/model/step-navigator',
    'Magento_Customer/js/model/address-list',
    'Magento_Customer/js/model/customer',
    'Magento_Ui/js/form/form',
    'mage/translate'
], function (
    $,
    ko,
    registry,
    _,
    checkoutDataResolver,
    fullScreenLoader,
    postcodeValidator,
    stepNavigator,
    addressList,
    customer,
    Component,
    $t
) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/shipping',
            myShippingAddressFormTemplate: 'Barranco_Checkout/shipping-address/form'
        },
        visible: ko.observable(true),
        complete: ko.observable(false),
        isFormInline: addressList().length === 0,
        checkTimeOut: 0,

        /**
         * @return this
         */
        initialize: function () {
            var self = this,
                shippingAddressFieldset = 'my-checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset',
                postcodeElement = 'postcode';

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

            checkoutDataResolver.resolveShippingAddress();

            registry.async(shippingAddressFieldset + '.' + postcodeElement)(function (element) {
                element.on('value', function () {
                    clearTimeout(self.checkTimeOut);
                    self.checkTimeOut = setTimeout(function () {
                        self.validatePostCode(element);
                    }, 2000);
                });
            });
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
        },

        /**
         * Postcode validation
         *
         * @return {*}
         */
        validatePostCode: function (element) {
            var country_id = $('select[name="country_id"]:visible').val(),
                validationResult,
                warnMessage;

            if (element == null || element.value() == null) {
                return true;
            }

            element.warn(null);
            validationResult = postcodeValidator.validate(element.value(), country_id);

            if (!validationResult) {
                warnMessage = $t('Provided Zip/Postal Code seems to be invalid.');

                if (postcodeValidator.validatedPostCodeExample.length) {
                    warnMessage += $t(' Example: ') + postcodeValidator.validatedPostCodeExample.join('; ') + '. ';
                }

                warnMessage += $t('If you believe it is the right one you can ignore this notice.');

                element.warn(warnMessage);
            }

            return validationResult;
        }
    });
});
