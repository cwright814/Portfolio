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
        var debug = true;

        var domParticles = $('#particles');
        var domParticle = $('#particle');
        var particles = [];
        var particleVars = [];
        var particlesHidden = true;

        // Create particles
        for (var i = 1; i <= 64; i++) {
            var temp = {
                dom: domParticle.clone(),
                x: Math.random(),
                y: Math.random(),
                z: null,
                r: null // Radius
            };
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
                    x: particle.x * window.innerWidth,
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

            var yRange = window.innerWidth / 30000;

            TweenMax.to(particle.dom, 2.5, {
                x: (particle.x + particle.z * (-0.01 + Math.random()*0.02)) * window.innerWidth,
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
        var debug = true;

        var domSkillsets = $('#skillsets');
        var domSkillsetsChildren = $('#skillsets > div');
        var skillsets = [];

        var tween = {
            center: {
                x: null,
                y: null
            },
            step: {
                radius: 10,
                delta: null
            },
            range: {
                radius: 200,
                delta: 180
            },
            duration: 0.25,
            rate: null
        };

        tween.step.delta = tween.range.delta / (tween.range.radius / tween.step.radius);
        tween.rate = tween.duration / (tween.range.radius / tween.step.radius);

        if (typeof debug !== 'undefined' && debug)
        {
            $('#skillsTip').css('display', 'none');
            $('#mySkills').css('box-shadow', '0 0 transparent');
            $('#mySkills > .inner').css('display', 'none');
            $('#skillsets > div > .inner').css('display', 'none');
        }

        // Wait for first draw else we will lose a potential scrollbar offset
        window.requestAnimationFrame(function() {
            tween.center.x = domSkillsets.innerWidth()*0.5 - window.innerWidth*0.05 - 40;
            tween.center.y = domSkillsets.innerHeight()*0.5 - window.innerWidth*0.05 - 40;

            // Create skillset objects
            domSkillsetsChildren.each(function(i) {
                var skillset = this;

                skillset = {
                    dom: skillset,
                    pos: {
                        x: tween.center.x,
                        y: tween.center.y
                    },
                    radius: 0,
                    delta: i * (360 / domSkillsetsChildren.length),
                    progress: 0,
                    step: stepSkillset,
                    finish: setSkillsetCss
                };

                skillset.step();
            });
        });

        function stepSkillset(obj) {
            /* 'this' won't work when called from TweenMax,
             * so we can take a param just in case */
            if (typeof obj !== 'object')
            {
                if (typeof this === 'object')
                    obj = this;
                else
                    return;
            }

            // Kill the animation when complete
            if (obj.progress >= tween.duration)
            {
                obj.finish();
                return;
            }

            // Step and prep
            obj.progress += tween.rate;
            obj.radius += tween.step.radius;
            obj.delta += tween.step.delta;
            obj.pos.x = tween.center.x + obj.radius * Math.cos(obj.delta.toRad());
            obj.pos.y = tween.center.y - obj.radius * Math.sin(obj.delta.toRad());

            TweenMax.to(obj.dom, tween.rate, {
                left: obj.pos.x,
                top: obj.pos.y,
                ease: Power0.easeInOut,
                onComplete: stepSkillset,
                onCompleteParams: [obj]
            });
        }

        // Revert to calc to ensure that changes to the window are updated properly
        function setSkillsetCss() {
            var offset = {
                x: Math.round(this.radius * Math.cos(this.delta.toRad()) - 40),
                y: Math.round(this.radius * Math.sin(this.delta.toRad()) - 40)
            };

            $(this.dom).css('left', 'calc(50% - 5vw + ' + offset.x + 'px)');
            $(this.dom).css('top', 'calc(50% - 5vw + ' + offset.y + 'px)');
        }
    }

    function ctrlFooter() {
        var ctrl = this;
    }
})();
