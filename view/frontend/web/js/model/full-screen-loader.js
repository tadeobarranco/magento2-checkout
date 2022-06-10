/**
 * Barranco\Checkout 
 */

define([
    'jquery',
    'rjsResolver'
], function($, resolver) {
    'use strict';

    var containerId = '#my-checkout';

    return {

        /**
         * Start full page loader
         */
        startLoader: function () {
            $(containerId).trigger('processStart');
        },

        /**
         * Stop loader
         */
        stopLoader: function () {
            var $elem = $(containerId),
                stop = $elem.trigger.bind($elem, 'processStop');

            resolver(stop);
        }
    }
});
