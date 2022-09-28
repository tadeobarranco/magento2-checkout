/**
 * Barranco\Checkout
 */

define([
    'ko',
    'mageUtils',
    'uiComponent',
    'uiLayout',
    'underscore',
    'Magento_Customer/js/model/address-list'
], function(ko, utils, Component, layout, _, customerAddressList) {
    'use strict';

    var defaultRendererTemplate = {
        parent: '${ $.$data.parentName }',
        name: '${ $.$data.name }',
        component: 'Barranco_Checkout/js/view/shipping-address/address-renderer/default',
        provider: 'checkoutProvider'
    };
    
    return Component.extend({
        defaults: {
            template: 'Barranco_Checkout/shipping-address/list',
            visible: customerAddressList().length > 0
        },

        /** @inheritdoc */
        initialize: function () {
            this._super();

            _.each(customerAddressList(), this.createRendererComponent, this);

            customerAddressList.subscribe(function (addresses) {

                var newAddress = _.find(addresses, function(address) {
                    return address.status === 'added';
                });

                this.createRendererComponent(newAddress.value, newAddress.index);

            }, this, 'arrayChange');

            return this;
        },

        /**
         * Render each address as an element of the layout
         *
         * @param {Object} address
         * @param {*} index
         */
        createRendererComponent: function (address, index) {
            var  templateData, rendererComponent;

            templateData = {
                parentName: this.name,
                name: index
            };

            rendererComponent = utils.template(defaultRendererTemplate, templateData);

            utils.extend(rendererComponent, {
                address: ko.observable(address)
            });

            layout([rendererComponent]);
        }
    });
});
