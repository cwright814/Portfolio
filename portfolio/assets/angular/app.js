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

        var domParticles = $('#particles');
        var domParticle = $('#particle');
        var particles = [];
        var particleVars = [];

        // Creating particles
        for (var i = 0; i < 40; i++) {
            var temp = domParticle.clone();
            var x = -5 + Math.random()*105;
            var y = -5 + Math.random()*105;
            var z, r;

            if (i < 25) {
                z = 1;
                r = 8;
            }
            else if (i >= 25 && i < 35) {
                z = 2;
                r = 24;
            }
            else {
                z = 3;
                r = 48;
            }

            temp.css('left', x + '%');
            temp.css('top', y + '%');
            temp.css('z-index', z);
            temp.css('width', r*2);
            temp.css('height', r*2);
            temp.css('background', 'radial-gradient(' +
                    'circle ' + r + 'px,' +
                    'rgba(56, 76, 102, 0.75) 0%,' +
                    'rgba(56, 76, 102, 0) 100%' +
                ')'
            );

            domParticles.append(temp);
            particles.push(temp);
            particleVars.push([]);
            particleVars[i].push(x);
            particleVars[i].push(y);
            particleVars[i].push(z);
        }
        domParticle.remove();

        // Begin particle animation
        $.each(particles, function(i, particle) {
            var x = particleVars[i][0];
            var y = particleVars[i][1];
            var z = particleVars[i][2];
            particle.css('display', 'inline');
            updateParticle(particle, x, y, z, Math.random()*2.5);
        });

        // Update particle animation
        function updateParticle(particle, x, y, z, delay) {
            TweenMax.to(particle, 2.5, {
                left: x + z * (-1.5 + Math.random()*3) + '%',
                top: y + z * (-1.5 + Math.random()*3) + '%',
                delay: delay,
                ease: Sine.easeInOut,
                onComplete: updateParticle,
                onCompleteParams: [particle, x, y, z, 0]
            });
        }
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
