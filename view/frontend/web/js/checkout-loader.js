/**
 * Barranco\Checkout
 */
define([
    'rjsResolver',
], function(resolver) {
    'use strict';

    /**
     * Hide loader by removing it from DOM
     *
     * @param {HTMLElement} $loader 
     */
    function hideLoader($loader) {
        $loader.parentNode.removeChild($loader);
    }
    
    /**
     * Bind hideLoader and wait until resolver is done
     *
     * @param {Object} config 
     * @param {HTMLElement} $loader 
     */
    function init(config, $loader) {
        resolver(hideLoader.bind(null, $loader));
    }

    return init;
});
