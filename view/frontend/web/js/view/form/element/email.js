/**
 * Barranco\Checkout
 */

define([
    'jquery',
    'ko',
    'uiComponent',
    'Magento_Customer/js/model/customer',
    'mage/validation'
], function($, ko, Component, customer) {
    'use strict';
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/form/element/email',
            isPasswordVisible: ko.observable(false),
            myEmailFocused: ko.observable(false),
            myEmail: ko.observable(""),
            listens: {
                myEmailFocused: 'validateEmail'
            }
        },

        isCustomerLoggedIn: customer.isLoggedIn,

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
                valid;

            loginForm.validation();

            if (isFocused === false && !!this.myEmail()) {
                valid = !!$(myCustomerEmail).valid();

                if (valid) {
                    $(myCustomerEmail).removeAttr('aria-invalid aria.describedby');
                }

                return valid;
            }

            return true;
        }
    });
});
