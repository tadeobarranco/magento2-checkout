define([
    'ko'
], function(ko) {
    'use strict';
    
    var steps = ko.observableArray();

    return {
        steps: steps,

        /**
         * Register step
         *
         * @param {String} code
         * @param {} alias
         * @param {*} title
         * @param {Function} isVisible
         * @param {*} navigate
         * @param {*} sortOrder
         * @param {function} isComplete
         */
        registerStep: function (code, alias, title, isVisible, navigate, sortOrder, isComplete) {
            steps.push({
                code: code,
                alias: alias != null ? alias : code,
                title: title,
                isVisible: isVisible,
                navigate: navigate,
                sortOrder: sortOrder,
                isComplete: isComplete
            });
        },

        /**
         * Move to next step
         */
        next: function () {
            var activeIndex = 0;

            steps().sort(this.sortItems).forEach(function (element, index) {
                if (element.isVisible()) {
                    activeIndex = index;
                }
            });

            if (steps().length > activeIndex + 1) {
                steps()[activeIndex].isVisible(false);
                steps()[activeIndex].isComplete(true);
                steps()[activeIndex + 1].isVisible(true);
            }
        },

        /**
         * Step visibility at navigation
         *
         * @param {*} step
         */
        navigateTo: function(step) {

            if (step.code === 'payment') {
                return;
            }

            steps().sort(this.sortItems).forEach(function (element) {
                if (element.code === step.code) {
                    element.isVisible(true);
                } else {
                    element.isVisible(false);
                }
            });
        },

        /**
         * Control how steps should be sorted
         *
         * @param {Object} left
         * @param {Object} right
         */
        sortItems: function (left, right) {
            return left.sortOrder > right.sortOrder ? 1 : -1;
        }
    }
});