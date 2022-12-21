define([
    'jquery',
], function($) {
    'use strict';
    
    return {
        method: 'rest',
        storeCode: window.checkoutConfig.storeCode,
        version: 'V1',
        serviceUrl: ':method/:storeCode/:version',

        /**
         * Create URL
         *
         * @param {String} url
         * @param {Object} params
         * @return {String}}
         */
        createUrl: function (url, params) {
            var url = this.serviceUrl + url;

            return this.bindParams(url, params);
        },

        /**
         * Manage params
         *
         * @param {String} url
         * @param {Object} params
         * @return {*}
         */
        bindParams: function (url, params) {
            var urlSplited;

            params.method = this.method;
            params.storeCode = this.storeCode;
            params.version = this.version;

            urlSplited = url.split('/');
            urlSplited = urlSplited.filter(Boolean);

            $.each(urlSplited, function (key, value) {
                value = value.replace(':', '');

                if (params[value] != undefined) {
                    urlSplited[key] = params[value];
                }
            });

            return urlSplited.join('/');
        }
    }
});
