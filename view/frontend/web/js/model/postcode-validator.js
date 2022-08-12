/**
 * Barranco\Checkout
 */

define([
    'mageUtils',
], function(utils) {
    'use strict';

    return {
        validatedPostCodeExample: [],

        /**
         * Validate postCode matches patterns
         *
         * @param {*} postCode
         * @param {*} countryId
         * @return {Boolean}
         */
        validate: function (postCode, countryId) {
            var patterns = window.checkoutConfig.postCodes[countryId],
                pattern,
                regex;

            if (!utils.isEmpty(postCode) && !utils.isEmpty(patterns)) {
                for (pattern in patterns) {
                    if (patterns.hasOwnProperty(pattern)) {
                        this.validatedPostCodeExample.push(patterns[pattern].example);
                        regex = new RegExp(patterns[pattern].pattern);

                        if (regex.test(postCode)) {
                            return true;
                        }
                    }
                }

                return false;
            }

            return false;
        }
    }
});