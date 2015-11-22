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
        //var debug = true;

        var domParticles = $('#particles');
        var domParticle = $('#particle');
        var particles = [];
        var particleVars = [];
        var particlesHidden = true;

        // Create particles
        for (var i = 0; i < 41; i++) {
            var temp = domParticle.clone();
            var x = Math.random();
            var y = Math.random();
            var z, r, o;

            if (i < 25) {
                z = 1;
                r = 8;
                o = 0.2;
            }
            else if (i >= 25 && i < 35) {
                z = 2;
                r = 24;
                o = 0.4;
            }
            else if (i >= 35 && i < 40) {
                z = 3;
                r = 64;
                o = 0.65;
            }
            else {
                z = 5; // Skips 4 for exaggerated movement
                r = 160;
                o = 1;
            }

            temp.css('z-index', z);
            temp.css('opacity', o);
            temp.css('width', r*2);
            temp.css('height', r*2);
            temp.css('background', 'radial-gradient(' +
                     'circle ' + r + 'px,' +
                     'rgba(56, 76, 102, 0.75) 0%,' +
                     'rgba(56, 76, 102, 0) 100%)'
            );

            domParticles.append(temp);
            particles.push(temp);
            particleVars.push([]);
            particleVars[i].push(x);
            particleVars[i].push(y);
            particleVars[i].push(z);
        }

        domParticle.remove(); // Remove template particle
        playParticles(); // Start particles animation on page load

        // Begin particles animation (disabled during debug)
        function playParticles() {
            if (typeof debug !== 'undefined' && debug)
                return;

            for (var i = 0; i < particles.length; i++) {
                var particle = particles[i];
                var x = particleVars[i][0];
                var y = particleVars[i][1];
                var z = particleVars[i][2];

                // Snap particle to its {x, y}
                // Rotation is applied to force sub-pixel animation
                TweenMax.to(particle, 0, {
                    x: x * domParticles.width(),
                    y: y * (300 - z*30),
                    rotation: 0.0003
                });

                updateParticle(particle, x, y, z, Math.random()*2.5);

                if (particlesHidden)
                    particle.css('display', 'inline');
            }

            if (particlesHidden)
                particlesHidden = false;
        }

        // Update particle animation
        function updateParticle(particle, x, y, z, delay) {
            if (typeof delay === 'undefined')
                delay = 0;

            TweenMax.to(particle, 2.5, {
                x: (x + z * (-0.015 + Math.random()*0.03)) * domParticles.width(),
                y: (y + z * (-0.015 + Math.random()*0.03)) * (300 - z*30),
                delay: delay,
                ease: Power1.easeInOut,
                onComplete: updateParticle,
                onCompleteParams: [particle, x, y, z, Math.random()*0.15]
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
