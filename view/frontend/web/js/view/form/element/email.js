/**
 * Barranco\Checkout
 */

define([
    'jquery',
    'ko',
    'uiComponent',
    'Barranco_Checkout/js/model/full-screen-loader',
    'Magento_Customer/js/action/check-email-availability',
    'Magento_Customer/js/action/login',
    'Magento_Customer/js/model/customer',
    'mage/validation'
], function($, ko, Component, fullScreenLoader, checkEmailAvailabilityAction, loginAction, customer) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/form/element/email',
            isPasswordVisible: ko.observable(false),
            myEmailFocused: ko.observable(false),
            myEmail: ko.observable(""),
            isLoading: ko.observable(false),
            listens: {
                myEmailFocused: 'validateEmail',
                myEmail: 'emailHasChanged'
            }
        },

        isCustomerLoggedIn: customer.isLoggedIn,
        isMyCustomerEmailComplete: null,
        checkTimeOut: 0,

        /**
         * @inheritdoc
         */
        initialize: function () {
            this._super();
        },

        /**
         * Validate email on focus
         *
         * @param {Boolean} isFocused
         */
        validateEmail: function (isFocused) {
            var loginFormSelector = 'form[data-role="my-customer-email-form"]',
                loginForm = $(loginFormSelector),
                myCustomerEmail = loginFormSelector + ' input[name="my-customer-email"]',
                valid,
                validator;

            loginForm.validation();

            if (isFocused === false && !!this.myEmail()) {
                valid = !!$(myCustomerEmail).valid();

                if (valid) {
                    $(myCustomerEmail).removeAttr('aria-invalid aria.describedby');
                }

                return valid;
            }

            if (loginForm.is(':visible')) {
                validator = loginForm.validate();

                return validator.check(myCustomerEmail);
            }

            return true;
        },

        /**
         * Callback for 'myEmail' on change
         */
        emailHasChanged: function () {
            var self = this;

            clearTimeout(this.checkTimeOut);

            this.checkTimeOut = setTimeout(function () {
                if (self.validateEmail()) {
                    self.checkEmailAvailability();
                } else {
                    self.isPasswordVisible(false);
                }
            }, 2000);

        },

        /**
         * Check if customer email exists
         */
        checkEmailAvailability: function () {

            this.isMyCustomerEmailComplete = $.Deferred();
            this.isLoading(true);
            checkEmailAvailabilityAction(this.isMyCustomerEmailComplete, this.myEmail());

            $.when(this.isMyCustomerEmailComplete).done(function () {
                this.isPasswordVisible(false);
            }.bind(this)).fail(function () {
                this.isPasswordVisible(true);
            }.bind(this)).always(function () {
                this.isLoading(false);
            }.bind(this));

        },

        /**
         * Log in action
         *
         * @param {HTMLElement} loginForm
         */
        login: function (loginForm) {
            var loginData = {},
                formLoginData = $(loginForm).serializeArray(),
                mapFormData = {
                    "my-customer-email": "username",
                    "my-customer-password": "password",
                    "context": "context"
                };

            formLoginData.forEach(function (input) {
                loginData[mapFormData[input.name]] = input.value;
            });

            $(loginForm).validation();

            if (this.isPasswordVisible() && $(loginForm).validation('isValid')) {
                fullScreenLoader.startLoader();
                loginAction(loginData).always(function () {
                    fullScreenLoader.stopLoader();
                });
            }
        }
    });
});
