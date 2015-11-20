/** Angular App Code */
(function() {
    'use strict';

    var app = angular
        .module('portfolio', [
            'ui.router'
        ]);

    app.config(cfgPortfolio);
    app.controller('ctrlHeader', ctrlHeader);
    app.controller('ctrlHome', ctrlHome);
    app.controller('ctrlFooter', ctrlFooter);

    cfgPortfolio.$inject = [
        '$stateProvider', '$urlRouterProvider'
    ];

    ctrlHeader.$inject = [
        '$timeout'
    ];

    ctrlHome.$inject = [
        '$scope', '$http', '$filter', '$timeout'
    ];

    function cfgPortfolio($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url:'/',
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: 'ctrlHeader',
                        controllerAs: 'header'
                    },
                    'content': {
                        templateUrl: 'templates/home.html',
                        controller: 'ctrlHome',
                        controllerAs: 'home'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller: 'ctrlFooter',
                        controllerAs: 'footer'
                    }
                }
            });
    }

    function ctrlHeader($timeout) {
        var timeout = $timeout;
        var ctrl = this;

        var particles = $('#particles');
        var particle = $('#particle');

        for (var i = 0; i < 20; i++)
        {
            var temp = particle.clone();
            temp.css('left', -5 + Math.random()*105 + '%');
            temp.css('top', -5 + Math.random()*105 + '%');
            particles.append(temp);
        }
        particle.remove();
        particles.children().css('display', 'inline');
    }

    function ctrlHome($scope, $http, $filter, $timeout) {
        var scope = $scope;
        var http = $http;
        var filter = $filter;
        var timeout = $timeout;
        var ctrl = this;
    }

    function ctrlFooter() {
        var ctrl = this;
    }
})();
