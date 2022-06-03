define([
    'ko'
], function(ko) {
    'use strict';
    
    var steps = ko.observableArray();

    return {
        steps: steps,

        registerStep: function (code, alias, title, isVisible, navigate, sortOrder) {
            steps.push({
                code: code,
                alias: alias != null ? alias : code,
                title: title,
                isVisible: isVisible,
                navigate: navigate,
                sortOrder: sortOrder
            });
        }
    }
});