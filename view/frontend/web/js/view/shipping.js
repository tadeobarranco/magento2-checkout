/**
 * Barranco\Checkout
 */

define([
    'jquery',
    'ko',
    'uiRegistry',
    'underscore',
    'Barranco_Checkout/js/action/create-shipping-address',
    'Barranco_Checkout/js/action/select-shipping-address',
    'Barranco_Checkout/js/action/select-shipping-method',
    'Barranco_Checkout/js/checkout-data',
    'Barranco_Checkout/js/model/checkout-data-resolver',
    'Barranco_Checkout/js/model/full-screen-loader',
    'Barranco_Checkout/js/model/postcode-validator',
    'Barranco_Checkout/js/model/shipping-service',
    'Barranco_Checkout/js/model/step-navigator',
    'Magento_Checkout/js/model/quote',
    'Magento_Customer/js/model/address-list',
    'Magento_Customer/js/model/customer',
    'Magento_Ui/js/form/form',
    'Magento_Ui/js/modal/modal',
    'mage/translate',
    'Barranco_Checkout/js/model/shipping-rate-service'
], function (
    $,
    ko,
    registry,
    _,
    createShippingAddressAction,
    selectShippingAddressAction,
    selectShippingMethodAction,
    checkoutData,
    checkoutDataResolver,
    fullScreenLoader,
    postcodeValidator,
    shippingService,
    stepNavigator,
    quote,
    addressList,
    customer,
    Component,
    modal,
    $t
) {
    'use strict';

    var popUp = null;
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/shipping',
            myShippingAddressFormTemplate: 'Barranco_Checkout/shipping-address/form',
            myShippingMethodListTemplate: 'Barranco_Checkout/shipping-address/shipping-method-list',
            myShippingMethodItemTemplate: 'Barranco_Checkout/shipping-address/shipping-method-item',
            imports: {
                countryOptions: '${ $.parentName }.shippingAddress.shipping-address-fieldset.country_id:indexedOptions'
            }
        },
        visible: ko.observable(true),
        complete: ko.observable(false),
        isFormInline: addressList().length === 0,
        checkTimeOut: 0,
        isFormPopUpVisible: ko.observable(false),
        saveInAddressBook: 1,
        isNewAddressAdded: ko.observable(false),
        rates: shippingService.getShippingRates(),
        isShippingServiceLoading: shippingService.isLoading,
        shippingMethodErrorValidationMessage: ko.observable(false),
        isShippingMethodSelected: ko.computed(function () {
            return quote.shippingMethod() ?
                quote.shippingMethod()['carrier_code'] + '_' + quote.shippingMethod()['method_code'] :
                null;
        }),

        /**
         * @return this
         */
        initialize: function () {
            var self = this,
                shippingAddressFieldset = 'my-checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset',
                postcodeElement = 'postcode',
                isNewAddressAdded;

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

            isNewAddressAdded = addressList.some(function (address) {
                return address.getType() == 'new-customer-address';
            });

            this.isNewAddressAdded(isNewAddressAdded);

            this.isFormPopUpVisible.subscribe(function (value) {
                if (value) {
                    self.getModalContent().openModal();
                }
            });

            quote.shippingMethod.subscribe(function () {
                self.shippingMethodErrorValidationMessage(false);
            });

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
                valid = customer.isLoggedIn(),
                option = _.isObject(this.countryOptions) && this.countryOptions[quote.shippingAddress().countryId],
                messageContainer = registry.get('my-checkout.errors').messageContainer;

            if (!quote.shippingMethod()) {
                this.shippingMethodErrorValidationMessage(
                    $t('The shipping method is missing. Select the shipping method and try again.')
                );

                return false;
            }

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
            } else if (customer.isLoggedIn() &&
                       option &&
                       option['is_region_required'] &&
                       !quote.shippingAddress().region
            ) {
                messageContainer.addErrorMessage({
                    message: $t('Error in shipping address')
                });

                return false;
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
        },

        /**
         * Show address form pop up
         */
        showFormPopUp: function () {
            this.isFormPopUpVisible(true);
        },

        /**
         * @return {*}
         */
        getModalContent: function () {
            var self = this,
                buttons;

            if (!popUp) {
                buttons = this.myPopUpForm.options.buttons;

                this.myPopUpForm.options.buttons = [
                    {
                        text: buttons.save.text ? buttons.save.text : $t('Save Address'),
                        class: buttons.save.class ? buttons.save.class : 'action primary action-save-address',
                        click: self.addNewAddress.bind(self)
                    },
                    {
                        text: buttons.cancel.text ? buttons.cancel.text : $t('Cancel'),
                        class: buttons.cancel.class ? buttons.cancel.class : 'action secondary action-hide-popup',
                        click: this.hideFormPopUp.bind(this)
                    }
                ];

                this.myPopUpForm.options.closed = function () {
                    self.isFormPopUpVisible(false);
                };

                popUp = modal(this.myPopUpForm.options, $(this.myPopUpForm.element));
            }

            return popUp;
        },

        /**
         * Hide address form pop up
         */
        hideFormPopUp: function () {
            this.getModalContent().closeModal();
        },

        /**
         * Add new address to the address list component
         */
        addNewAddress: function () {
            var addressData,
                newShippingAddress;

            this.source.set('params.invalid', false);
            this.source.trigger('shippingAddress.data.validate');

            if (this.source.get('params.invalid')) {
                this.focusInvalid();
                return false;
            }

            addressData = this.source.get('shippingAddress');
            addressData['save_in_address_book'] = this.saveInAddressBook ? 1 : 0;

            newShippingAddress = createShippingAddressAction(addressData);
            selectShippingAddressAction(newShippingAddress);
            checkoutData.setSelectedShippingAddress(newShippingAddress.getKey());
            checkoutData.setNewCustomerShippingAddress($.extend(true, {}, addressData));
            this.isNewAddressAdded(true);
            this.getModalContent().closeModal();
        },

        selectShippingMethod: function (shippingMethod) {
            selectShippingMethodAction(shippingMethod);
            return true;
        }
    });
});
