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

    ctrlHome.$inject = [
        '$scope', '$http', '$filter', '$timeout', '$interval'
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

    function ctrlHeader() {
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
            new ScrollMagic
                .Scene({
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
            new ScrollMagic
                .Scene({
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

    function ctrlHome($scope, $http, $filter, $timeout, $interval) {
        var scope = $scope;
        var http = $http;
        var filter = $filter;
        var timeout = $timeout;
        var interval = $interval;
        var ctrl = this;
        var debug = true;

        var skillsets = {
            dom: {
                section: $('#skills'),
                slantLeft: $('#slantLeft'),
                slantRight: $('#slantRight'),
                tip: $('#skillsTip'),
                parent: $('#mySkills'),
                wrapper: $('#skillsets'),
                children: $('#skillsets').children()
            },
            objects: [],
            timeline: new TimelineMax({paused: true}),
            state: null,
            radius: $('#mySkills').width() / 2,
            init: initSkillsets,
            build: buildSkillsets,
            play: playSkillsets,
            complete: completeSkillsets
        };

        // Config for skillsets tween
        var tween = {
            step: {
                offset: null,
                delta: null
            },
            shift: {
                offset: 148,
                delta: 180,
                scale: -0.2
            },
            steps: 90,
            duration: 1.5,
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

        // ScrollMagic scenes
        var smScenes = [
            /* Initial #skills tweens
             * .on() is used here for a safe reference in onComplete: */
            new ScrollMagic
                .Scene({
                    triggerElement: '#skills',
                    reverse: false
                })
                .setTween(
                    TweenMax.from(skillsets.dom.parent, 0.5, {css:{
                        autoAlpha: 0,
                        scale: 0.5},
                        ease: Power1.easeOut
                }))
                .on("enter", function(e) {
                    TweenMax.set(skillsets.dom.wrapper, {css:{
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
            new ScrollMagic
                .Scene({
                    triggerElement: '#skills',
                    triggerHook: 'onEnter',
                    offset: 540,
                    reverse: false
                })
                .setTween(
                    TweenMax.from(skillsets.dom.tip, 1.5, {css:{
                        x: -40,
                        autoAlpha: 0},
                        ease: Sine.easeOut,
                        delay: 0.75
                }))
                .on("enter", function(e) {
                    skillsets.build();
                    skillsets.play({ease: Power4.easeOut});
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

        // Skillsets onHover actions
        skillsets.dom.children.hover(function() {
            // Enter
            if (skillsets.state == 'radial')
            {
                TweenMax.to(this, 0.5, {css:{
                    scale: (1 + tween.shift.scale) * 1.25,
                    boxShadow: 'inset 0 0 16px rgb(222, 218, 208)',
                    zIndex: 2},
                    ease: Power4.easeOut
                });
            }
        }, function() {
            // Leave
            if (skillsets.state == 'radial')
            {
                TweenMax.to(this, 0.5, {css:{
                    scale: 1 + tween.shift.scale,
                    boxShadow: 'inset 0 0 0px ' + $(this).css('background-color'),
                    zIndex: 0
                }});
            }
        });

        // Skillsets onClick actions
        skillsets.dom.children.click(function() {
            if (skillsets.state == 'radial')
            {
                skillsets.state = null;

                TweenMax.set(this, {css:{zIndex: 2}});
                TweenMax.to(this, 1.3125, {css:{
                    top: 'calc(0% + 0px)',
                    left: 'calc(5% + 40px)',
                    scale: 1.5,
                    boxShadow: 'inset 0 0 0px ' + $(this).css('background-color')},
                    ease: Power1.easeOut
                });
                TweenMax.to(skillsets.dom.section, 1.5, {css:{
                    backgroundColor: $(this).css('background-color')
                }});
                TweenMax.to(skillsets.dom.tip, 0.5625, {css:{
                    x: -40,
                    autoAlpha: 0},
                    ease: Sine.easeIn,
                });
                TweenMax.to(skillsets.dom.children.not(this), 0.375, {css:{
                    left: 'calc(50% + -86px)',
                    top: 'calc(50% - 86px)',
                    scale: 0.25,
                    autoAlpha: 0},
                    ease: Circ.easeIn
                });
                TweenMax.to(skillsets.dom.parent, 0.75, {css:{
                    scale: 0.5,
                    autoAlpha: 0},
                    ease: Expo.easeIn
                });
                TweenMax.to(skillsets.dom.slantLeft, 1.5, {css:{
                    width: '0%'},
                    ease: Power1.easeInOut
                });
                TweenMax.to(skillsets.dom.slantRight, 1.5, {css:{
                    left: '10%',
                    width: 'calc(90% + 172px)'},
                    ease: Power1.easeInOut
                });
            }
        });

        // Delayed init for your browser's convenience
        $(document).ready(function() {
            skillsets.init();
        });

        /* Creates skillsets.objects[]; can be done preemptively
         * Tweak delta and scale as necessary */
        function initSkillsets() {
            if (typeof this !== 'object')
                return console.log('initSkillsets() cannot be called directly.');
            else
                var that = this;

            // If skillset objects already exist, wipe them out
            if (this.objects.length)
                this.objects.length = 0;

            that.dom.children.each(function(i) {
                that.objects.push({
                    dom: this,
                    pos: {
                        x: null,
                        y: null
                    },
                    offset: 0,
                    delta: i * 360 / that.dom.children.length - 90,
                    deltaEnd: null,
                    scale: 1.0,
                    color: $(this).attr('data-color'),
                    text: $(this).children('.inner:first-child'),
                    progress: 0
                });
            });
        }

        // Preps skillset objects and builds Timeline
        function buildSkillsets() {
            if (typeof this !== 'object')
                return console.log('buildSkillsets() cannot be called directly.');
            else if (!this.objects.length)
                return console.log('.init() must be called before .build().');
            else
                var that = this;

            // If a Timeline already exists, wipe it out
            if (that.timeline.getChildren().length)
                that.timeline.clear();

            // Perform pre-init
            $.each(that.objects, function(i, object) {
                object.deltaEnd = (object.delta + tween.shift.delta).toRad();
                that.timeline.set(object.dom, {css:{
                    boxShadow: 'transparent',
                    zIndex: 0
                }});
            });

            // Build Timeline for radial tween
            for (var step = 1; step <= tween.steps; step++)
            {
                $.each(that.objects, function(i, object) {
                    object.offset += tween.step.offset;
                    object.delta += tween.step.delta;
                    object.pos.x = object.offset * Math.cos(object.delta.toRad()) - that.radius;
                    object.pos.y = object.offset * Math.sin(object.delta.toRad()) + that.radius;

                    that.timeline.to(object.dom, tween.rate, {css:{
                        left: 'calc(50% + ' + object.pos.x + 'px)',
                        top: 'calc(50% - ' + object.pos.y + 'px)'},
                        ease: Power0.easeNone
                    }, '-=' + tween.rate * (i == 0 ? '0' : '1'));
                });
            }

            // Perform post-init
            that.timeline.fromTo(that.dom.parent, tween.duration,
                {css:{boxShadow: '0 0 0 ' + that.dom.parent.css('background-color')}},
                {css:{boxShadow: '0 0 16px rgb(43, 44, 38)'},
                ease: Sine.easeIn
            }, '-=' + tween.duration);

            $.each(that.objects, function(i, object) {
                that.timeline
                    .fromTo(object.dom, tween.duration,
                        {css:{
                            scale: object.scale,
                            backgroundColor: that.dom.parent.css('background-color')}},
                        {css:{
                            scale: object.scale + tween.shift.scale,
                            backgroundColor: object.color},
                        ease: Power3.easeIn
                    }, '-=' + tween.duration)

                    .from(object.text, tween.duration, {css:{
                        autoAlpha: 0},
                        ease: Expo.easeIn
                    }, '-=' + tween.duration);
            });
        }

        // Convenience function for encapsulation (remembers passed params)
        function playSkillsets(params) {
            if (typeof this !== 'object')
                return console.log('playSkillsets() cannot be called directly.');
            else if (!this.objects.length)
                return console.log('.init() and .build() must be called before .play().');
            else if (!this.timeline.getChildren().length)
                return console.log('.build() must be called before .play().');
            else if (angular.isObject(params) || !angular.isObject(this.timeline.params))
            {
                params.onComplete = this.complete;
                params.onCompleteParams = [this];
                this.timeline.params = params;
                return this.timeline.restart().tweenTo(tween.duration, params);
            }
            else
                return this.timeline.restart().tweenTo(tween.duration, this.timeline.params);
        }

        // onComplete logic for the radial
        function completeSkillsets(that) {
            if (typeof this !== 'object')
                return console.log('completeSkillsets() cannot be called directly.');
            else
            {
                if (typeof this.dom !== 'object')
                {
                    if (typeof that !== 'object' || typeof that.dom !== 'object')
                    {
                        return console.log(
                            'completeSkillsets() was incorrectly called from `onComplete:`.\n' +
                            'You must pass a reference: `onCompleteParams: [skillsets]`.'
                        );
                    }
                }
                else
                    var that = this;
            }

            // Assigning a state here for interactions
            that.state = 'radial';

            // Set the final left/top to remove decimals
            $.each(that.objects, function(i, object) {
                var offset = {
                    x: Math.round(tween.shift.offset * Math.cos(this.deltaEnd) - that.radius),
                    y: Math.round(tween.shift.offset * Math.sin(this.deltaEnd) + that.radius)
                };

                TweenMax.set(this.dom, {css:{
                    left: 'calc(50% + ' + offset.x + 'px)',
                    top: 'calc(50% - ' + offset.y + 'px)'
                }});
            });
        }
    }

    function ctrlFooter() {
        var ctrl = this;
    }
})();
