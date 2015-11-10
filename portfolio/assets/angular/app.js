/** Angular App Code */
(function() {
    'use strict';

    angular
        .module('portfolio')
        .controller('portfolioController', portfolioController);

    portfolioController.$inject = [
        '$scope', '$http', '$filter', '$timeout'
    ];

    function portfolioController($scope, $http, $filter, $timeout) {
        var scope = $scope;
        var http = $http;
        var filter = $filter;
        var timeout = $timeout;
        var ctrl = this;
    }]);
})();
