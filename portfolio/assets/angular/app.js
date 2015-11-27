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

    var smCtrl = new ScrollMagic.Controller();

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

        // ScrollMagic scenes
        var smScenes = [
            // Header tweens
            new ScrollMagic.Scene({
                    reverse: false
                })
                .setTween(
                    new TimelineMax()
                    .from(domParticles, 1.5, {css:{
                        autoAlpha: 0},
                        ease: Sine.easeOut
                    })
                    .from($('#shiftLeft'), 1.5, {css:{
                        marginLeft: -120,
                        autoAlpha: 0},
                        ease: Circ.easeOut
                    }, "-=1")
                    .from($('#shiftRight'), 1.5, {css:{
                        marginRight: -120,
                        autoAlpha: 0},
                        ease: Circ.easeOut
                    }, "-=1.5")
                )
                .addIndicators({name: "h0. base"})
                .addTo(smCtrl),
            // Particles pause/resume (for efficiency when off-screen)
            new ScrollMagic.Scene({
                    triggerElement: '#header',
                    triggerHook: 'onLeave',
                    duration: 300
                })
                .on("enter", function(e) {
                    if (e.target.controller().info("scrollDirection") == "REVERSE")
                        playParticles();
                })
                .on("leave", function(e) {
                    TweenMax.killTweensOf($(domParticles).children());
                })
                .addIndicators({name: "h1. pause"})
                .addTo(smCtrl)
        ];

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
                TweenMax.set(particle.dom, {css:{
                    x: particle.x * window.innerWidth,
                    y: particle.y * 300,
                    rotation: 0.0003}
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

            TweenMax.to(particle.dom, 2.5, {css:{
                x: (particle.x + particle.z * (-0.01 + Math.random()*0.02)) * window.innerWidth,
                y: (particle.y + particle.z * (-yRange + Math.random()*yRange*2)) * 300},
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

        var domMySkills = $('#mySkills');
        var domSkillsets = $('#skillsets');
        var domSkillsetsChildren = $('#skillsets').children();
        var skillsetRadius = $('#mySkills').width() / 2;

        // Config for skillsets tween
        var tween = {
            center: {
                x: null,
                y: null
            },
            step: {
                offset: null,
                delta: null
            },
            shift: {
                offset: 148,
                delta: 180,
                scale: -0.2
            },
            steps: 12,
            duration: 0.5,
            rate: null
        };

        // Extends the animation duration for easier tweaking
        /*if (typeof debug !== 'undefined' && debug) {
            tween.steps *= 3;
            tween.duration *= 3;
        }*/

        tween.step.offset = tween.shift.offset / tween.steps;
        tween.step.delta = tween.shift.delta / tween.steps;
        tween.rate = tween.duration / tween.steps;

        // .duration is decreased by 1/60 per second to avoid over-tweening.
        tween.duration -= 0.0167 * tween.duration;

        // ScrollMagic scenes
        var smScenes = [
            /* Initial #skills tweens
             * .on() is used here for a safe reference in onComplete: */
            new ScrollMagic.Scene({
                    triggerElement: '#skills',
                    reverse: false
                })
                .setTween(
                    TweenMax.from(domMySkills, 0.5, {css:{
                        autoAlpha: 0,
                        scale: 0.5},
                        ease: Power1.easeOut
                }))
                .on("enter", function(e) {
                    TweenMax.set(domSkillsets, {css:{
                        autoAlpha: 1},
                        delay: 0.5,
                        onComplete: smScenes[1].enabled,
                        onCompleteParams: [true]
                    });
                })
                .addIndicators({name: "c0. #mySkills"})
                .addTo(smCtrl)
                .enabled(false),
            // Skillsets tweens
            new ScrollMagic.Scene({
                    triggerElement: '#skills',
                    triggerHook: 'onEnter',
                    offset: 540,
                    reverse: false
                })
                .setTween(
                    TweenMax.from($('#skillsTip'), 1.5, {css:{
                        x: -40,
                        autoAlpha: 0},
                        ease: Sine.easeOut,
                        delay: 0.75
                }))
                .on("enter", function(e) {
                    var tl = new TimelineMax()
                    .set(domMySkills, {css:{
                        boxShadow: '0 0 0 ' + $(domMySkills).css('background-color')
                    }})
                    .to(domMySkills, tween.duration, {css:{
                        boxShadow: '0 0 16px rgb(43, 44, 38)'},
                        ease: Expo.easeIn
                    });

                    initSkillsets();
                })
                .addIndicators({name: "c1. #skillsets"})
                .addTo(smCtrl)
                .enabled(false)
        ];

        if (typeof debug !== 'undefined' && debug)
            smScenes[0].enabled(true);
        else
            // Late start of scene.c0 (will be instant when triggered after delay)
            setTimeout(function(){smScenes[0].enabled(true)}, 2000);

        $(domSkillsetsChildren).hover(function() {
            // Enter
            TweenMax.to(this, 0.5, {css:{
                scale: (1 + tween.shift.scale) * 1.25,
                boxShadow: 'inset 0 0 16px rgb(222, 218, 208)',
                zIndex: 2},
                ease: Power4.easeOut
            });
        }, function() {
            // Leave
            TweenMax.to(this, 0.5, {css:{
                scale: 1 + tween.shift.scale,
                boxShadow: 'inset 0 0 0px ' + $(this).css('background-color'),
                zIndex: 0
            }});
        });

        function initSkillsets() {
            tween.center.x = domSkillsets.innerWidth()*0.5 - skillsetRadius;
            tween.center.y = domSkillsets.innerHeight()*0.5 - skillsetRadius;

            // Tweak delta and scale as necessary
            domSkillsetsChildren.each(function(i) {
                var skillset = this;

                skillset = {
                    dom: skillset,
                    pos: {
                        x: null,
                        y: null
                    },
                    offset: 0,
                    delta: i * (360 / domSkillsetsChildren.length) - 90,
                    deltaEnd: null,
                    scale: 1.0,
                    color: $(skillset).attr('data-color'),
                    text: $(skillset).children('.inner:first-child'),
                    progress: 0,
                    init: initSkillset,
                    step: stepSkillset,
                    finish: setSkillsetCss
                };

                skillset.init();
            });
        }

        function initSkillset() {
            this.deltaEnd = this.delta + tween.shift.delta;

            TweenMax.set(this.dom, {css:{scale: this.scale}});
            TweenMax.set(this.text, {css:{autoAlpha: 0}});

            TweenMax.to(this.dom, tween.duration, {css:{
                scale: this.scale + tween.shift.scale,
                backgroundColor: this.color},
                ease: Power3.easeIn
            });

            TweenMax.to(this.text, tween.duration, {css:{
                autoAlpha: 1},
                ease: Expo.easeIn
            });

            this.step();
        }

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
            obj.offset += tween.step.offset;
            obj.delta += tween.step.delta;
            obj.pos.x = tween.center.x + obj.offset * Math.cos(obj.delta.toRad());
            obj.pos.y = tween.center.y - obj.offset * Math.sin(obj.delta.toRad());

            TweenMax.to(obj.dom, tween.rate, {css:{
                left: obj.pos.x,
                top: obj.pos.y},
                ease: Power0.easeNone,
                onComplete: stepSkillset,
                onCompleteParams: [obj]
            });
        }

        // Revert to calc to ensure that changes to the window are updated properly
        function setSkillsetCss() {
            var offset = {
                x: Math.round(tween.shift.offset * Math.cos(this.deltaEnd.toRad()) - skillsetRadius),
                y: Math.round(tween.shift.offset * Math.sin(this.deltaEnd.toRad()) + skillsetRadius),
                s: 'matrix(' + this.scale + ', 0, 0, ' + this.scale + ', 0, 0)'
            };

            $(this.dom).css('left', 'calc(50% + ' + offset.x + 'px)');
            $(this.dom).css('top', 'calc(50% - ' + offset.y + 'px)');
        }
    }

    function ctrlFooter() {
        var ctrl = this;
    }
})();
