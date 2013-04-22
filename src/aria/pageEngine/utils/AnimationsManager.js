/**
 * Utility class that manages the animations for the page transitions
 */
Aria.classDefinition({
    $classpath : 'aria.pageEngine.utils.AnimationsManager',
    $dependencies : ['aria.utils.css.Animations'],
    $constructor : function () {

        /**
         * Object for synchronization between 2 different animations
         * @type Object
         * @protected
         */
        this._syncCfg = {
            waiting : 0,
            toDispose : []
        };
    },
    $destructor : function () {
        this._syncCfg = null;
    },
    $events : {
        "animationend" : {
            description : "Notify when an animation completes"
        }
    },
    $prototype : {

        /**
         * Create the second div used for the page transition
         * @param {HTMLElement} div Div to clone
         * @return {HTMLElement} secondDiv Div created from div
         */
        createHiddenDiv : function (div) {
            var secondDiv = div.cloneNode(true);
            secondDiv.setAttribute('id', '');
            secondDiv.className = secondDiv.className + ' xanimation-element';
            secondDiv.innerHTML = "";
            div.parentNode.insertBefore(secondDiv, div.nextSibling);
            return secondDiv;
        },

        /**
         * Start the animation
         * @param {aria.utils.css.AnimationsBean.AnimationCfg} animationCfg animation configuration object
         * @param {Object} animationInfo animation name and version
         * @protected
         */
        _start : function (animationCfg, animationInfo) {
            var animate = new aria.utils.css.Animations();

            this._syncCfg.toDispose.push(animate);
            animate.$on({
                "animationend" : {
                    fn : this._animationComplete
                },
                scope : this
            });

            animationCfg.reverse = animationInfo.reverse;
            animate.start(animationInfo.name, animationCfg);
        },

        /**
         * Start the page transition
         * @param {HTMLElement} activeDiv Active div
         * @param {HTMLElement} inactiveDiv Inactive div
         * @param {aria.pageEngine.CfgBeans.PageAnimation} pageAnimationCfg page animation configuration object
         */
        startPageTransition : function (activeDiv, inactiveDiv, pageAnimationCfg) {
            if (pageAnimationCfg.animateOut && pageAnimationCfg.animateIn
                    && pageAnimationCfg.animateIn == pageAnimationCfg.animateOut) {
                var animationCfg = {
                    from : inactiveDiv,
                    to : activeDiv
                };
                this._syncCfg.waiting += 1;
                this._start(animationCfg, this._mappingAnimations(pageAnimationCfg.animateOut));
            } else {
                if (pageAnimationCfg.animateOut) {
                    var animationCfg = {
                        from : inactiveDiv
                    };
                    this._syncCfg.waiting += 1;
                    this._start(animationCfg, this._mappingAnimations(pageAnimationCfg.animateOut));
                } else {
                    if (inactiveDiv.className.indexOf("xanimation-element") === -1) {
                        inactiveDiv.className = inactiveDiv.className + " xanimation-element";
                    }
                }
                if (pageAnimationCfg.animateIn) {
                    var animationCfg = {
                        to : activeDiv
                    };
                    this._syncCfg.waiting += 1;
                    this._start(animationCfg, this._mappingAnimations(pageAnimationCfg.animateIn));
                }
            }

        },

        /**
         * Map the Page Engine page transitions to the aria.utils.css.Animations
         * @param {String} pageTransitionName Page Engine page transition name
         * @return {Object} animation name and version
         * @protected
         */
        _mappingAnimations : function (pageTransitionName) {
            var name, reverse;
            switch (pageTransitionName) {
                case "slide left" : {
                    name = "slide";
                    reverse = false;
                }
                    break;
                case "slide right" : {
                    name = "slide";
                    reverse = true;
                }
                    break;
                case "slide up" : {
                    name = "slideup";
                    reverse = false;
                }
                    break;
                case "slide down" : {
                    name = "slidedown";
                    reverse = false;
                }
                    break;
                case "fade" : {
                    name = "fade";
                    reverse = false;
                }
                    break;
                case "fade reverse" : {
                    name = "fade";
                    reverse = true;
                }
                    break;
                case "pop" : {
                    name = "pop";
                    reverse = false;
                }
                    break;
                case "pop reverse" : {
                    name = "pop";
                    reverse = true;
                }
                    break;
                case "flip" : {
                    name = "flip";
                    reverse = false;
                }
                    break;
                case "flip reverse" : {
                    name = "flip";
                    reverse = true;
                }
                    break;
            }
            return {
                name : name,
                reverse : reverse
            };
        },

        /**
         * Callback called after the animation end
         * @protected
         */
        _animationComplete : function () {
            this._syncCfg.waiting -= 1;

            if (this._syncCfg.waiting === 0) {
                var toDispose;
                for (var i = 0; i < this._syncCfg.toDispose.length; i++) {
                    toDispose = this._syncCfg.toDispose[i];
                    toDispose.$unregisterListeners();
                    toDispose.$dispose();
                }

                this.$raiseEvent("animationend");
            }
        }
    }
});
