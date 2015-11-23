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
        for (var i = 1; i <= 64; i++) {
            var temp     = new Object();
                temp.dom = domParticle.clone();
                temp.x   = Math.random();
                temp.y   = Math.random();
                temp.z   = null;
                temp.r   = null; // Radius
            var o; // Opacity

            if (i <= 38) {
                temp.z = 1;
                temp.r = 8;
                o      = 0.2;
            }
            else if (i > 38 && i <= 54) {
                temp.z = 2;
                temp.r = 24;
                o      = 0.4;
            }
            else if (i > 54 && i <= 62) {
                temp.z = 3;
                temp.r = 64;
                o      = 0.65;
            }
            else {
                temp.z = 5; // Skips 4 for exaggerated movement
                temp.r = 160;
                o      = 1;
            }

            temp.dom.css('z-index', temp.z);
            temp.dom.css('opacity', o);
            temp.dom.css('width', temp.r*2);
            temp.dom.css('height', temp.r*2);
            temp.dom.css('left', -temp.r);
            temp.dom.css('top', -temp.r);
            temp.dom.css('background', 'radial-gradient(' +
                     'circle ' + temp.r + 'px,' +
                     'rgba(56, 76, 102, 0.75) 0%,' +
                     'rgba(56, 76, 102, 0) 100%)'
            );

            domParticles.append(temp.dom);
            particles.push(temp);
        }

        domParticle.remove(); // Remove template particle
        playParticles(); // Start particles animation on page load

        // Begin particles animation (disabled during debug)
        function playParticles() {
            if (typeof debug !== 'undefined' && debug)
                return;

            $.each(particles, function(i, particle) {
                /* Initialize particle to its {x, y}
                 * Rotation is applied to force sub-pixel animation */
                TweenMax.to(particle.dom, 0, {
                    x: particle.x * domParticles.width(),
                    y: particle.y * 300,
                    rotation: 0.0003
                });

                updateParticle(particle, Math.random()*2.5);

                if (particlesHidden)
                    particle.dom.css('display', 'inline');
            });

            if (particlesHidden)
                particlesHidden = false;
        }

        // Update particle animation
        function updateParticle(particle, delay) {
            if (typeof delay === 'undefined')
                delay = Math.random()*0.15;

            var yRange = domParticles.width() / 30000;

            TweenMax.to(particle.dom, 2.5, {
                x: (particle.x + particle.z * (-0.01 + Math.random()*0.02)) * domParticles.width(),
                y: (particle.y + particle.z * (-yRange + Math.random()*yRange*2)) * 300,
                delay: delay,
                ease: Power1.easeInOut,
                onComplete: updateParticle,
                onCompleteParams: [particle]
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
