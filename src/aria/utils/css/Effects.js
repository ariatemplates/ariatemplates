/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {

    var acceptedOperations = {
        "+=" : function (a, b) {
            return a + b;
        },
        "-=" : function (a, b) {
            return a - b;
        }
    };

    function round (value) {
        return Math.round(value * 100) / 100;
    }

    /**
     * Utilities for HTML object animations. To add a new animation you need to call the
     * aria.utils.css.Effects.animate() method passing:
     *
     * <pre>
     * - the HTML element or its ID
     * - an object containing the style (and some non-style) properties to be animated with their values. e.g. {height : 40, width: &quot;90em&quot;, opacity: 0.4}
     * - [optional] a configuration object that contains some additional animation information:
     *      cfg {
     *          duration : {Number} the animation duration in milliseconds [optional],
     *          interval : {Number} the interval between an animation interpolation and the following one [optional],
     *          easing : {String|Function} the interpolation function used to compute the animated property value for each iteration [optional],
     *          queue : {Boolean|String} true to put the animation into the global animations queue, a user defined id, to add the animation to the queue represented by that string. Default is false (the animation will begin immediately)[optional],
     *          onStartAnimation : {Function} callback function fired when an animation starts [optional],
     *          onEndAnimation : {Function} callback function fired when an animation ends [optional]
     *          onStartQueue : {Function} callback function fired when an animations queue starts [optional]
     *          onEndQueue : {Function} callback function fired when an animations queue ends [optional]
     *      }
     * </pre>
     */
    Aria.classDefinition({
        $classpath : "aria.utils.css.Effects",
        $dependencies : ["aria.utils.css.Units", "aria.utils.css.Colors", "aria.utils.css.PropertiesConfig"],
        $singleton : true,
        $statics : {
            // animation interval in ms
            DEFAULT_INTERVAL : 20,
            DEFAULT_DURATION : 1000,
            DEFAULT_EASING : "linear",
            DEFAULT_QUEUE_KEY : "default",
            NO_PROPERTY_TO_ANIMATE : "No valid property to animate.",
            INVALID_HTML_ELEMENT : "No valid HTML element to animate.",

            _easing : {
                "linear" : function (x) {
                    return x;
                },
                "ease-in-out" : function (x) {
                    // 0 < curveCutPoint < infinity
                    var curveCutPoint = 3;
                    return (Math.atan(2 * curveCutPoint * x - curveCutPoint) + Math.atan(curveCutPoint))
                            / (2 * Math.atan(curveCutPoint));
                },
                "ease-out" : function (x) {
                    // 0 < curveCutPoint < infinity
                    var curveCutPoint = 3;
                    return Math.atan(curveCutPoint * x) / Math.atan(curveCutPoint);
                },
                "ease-in" : function (x) {
                    // 0 < curveCutPoint < PI/2
                    var curveCutPoint = 1.3;
                    return Math.tan(curveCutPoint * x) / Math.tan(curveCutPoint);
                }
            },

            _computeInterpolation : function (easing, item, start, end, current) {
                var sx = start, ex = end, sy = item.origin, ey = item.dest, x = current;
                var animProgress = (x - sx) / (ex - sx);
                if (ey instanceof Array) {
                    var interp = [];
                    for (var i = 0, l = ey.length; i < l; i++) {
                        interp.push(this._computeSingleInterpolation(sy[i], ey[i], animProgress, easing, item.isColor));
                    }
                    return interp;
                } else {
                    return this._computeSingleInterpolation(sy, ey, animProgress, easing, item.isColor);
                }
            },

            _computeSingleInterpolation : function (sy, ey, animProgress, easing, notDecimal) {
                var range = ey - sy;
                var y = sy + easing(animProgress) * range;
                return (notDecimal ? Math.round(y) : round(y));
            }

        },
        $constructor : function () {

            this.cfg = aria.utils.css.PropertiesConfig;
            this.unitUtil = aria.utils.css.Units;
            this.colorUtil = aria.utils.css.Colors;
            this.queues = {};
            this.animations = {};
            this.animCount = 0;

        },
        $prototype : {

            /**
             * Starts the animation
             * @param {HTMLElement|String} element to be animated (or its id)
             * @param {Object} CSS properties
             * @param {Object} cfg animation configuration
             * @return {String} animation ID
             */
            animate : function (htmlElem, properties, cfg) {
                var animId;
                cfg = cfg || {};
                var elem = this._getHTMLElement(htmlElem), animInfo = {
                    props : []
                };
                if (elem == null) {
                    this.$logWarn(this.INVALID_HTML_ELEMENT);
                    return null;
                }
                animInfo.duration = cfg.duration ? parseInt(cfg.duration, 10) : this.DEFAULT_DURATION;
                animInfo.interval = cfg.interval ? parseInt(cfg.interval, 10) : this.DEFAULT_INTERVAL;
                if (cfg.easing != null) {
                    if (aria.utils.Type.isFunction(cfg.easing)) {
                        animInfo.easing = cfg.easing;
                    } else if (aria.utils.Type.isString(cfg.easing)) {
                        animInfo.easing = this._easing[cfg.easing];
                    }
                }
                animInfo.easing = animInfo.easing || this._easing[this.DEFAULT_EASING];
                animInfo.queue = (cfg.queue === true) ? this.DEFAULT_QUEUE_KEY : (cfg.queue != null)
                        ? this._getQueueKey(cfg.queue)
                        : false;
                animInfo.element = elem;
                animInfo.userProperties = properties;
                animInfo.onStartAnimation = cfg.onStartAnimation;
                animInfo.onEndAnimation = cfg.onEndAnimation;
                animInfo.onEndQueue = cfg.onEndQueue;
                animInfo.hide = cfg.hide;

                if (animInfo.queue) {
                    // if it is the first animation of its queue
                    if (!this.queues[animInfo.queue]) {
                        this.queues[animInfo.queue] = {
                            list : [animInfo],
                            onEndQueue : cfg.onEndQueue
                        };
                        this.$callback(cfg.onStartQueue);
                        animId = this._createAndLaunchAnimation(animInfo);
                    } else {
                        animId = this._createAnimationSpot();
                        this.queues[animInfo.queue].list.push(animInfo);
                    }
                } else {
                    animId = this._createAndLaunchAnimation(animInfo);
                }
                animInfo.animId = animId;
                this.animations[animId] = animInfo;

                return animId;
            },

            /**
             * Stops the animation and skips to the next animation (if in a queue)
             * @param {String} animation identifier
             * @return {Boolean} true if the related animation exists, otherwise false
             */
            skipAnimation : function (animId) {
                var animInfo = this.animations[animId];
                if (animInfo) {
                    if (animInfo.isRunning) {
                        this._finalizeAnimation(this.animations[animId], true);
                    } else {
                        delete this.animations[animId];
                        if (animInfo.queue) {
                            var queueOrder = aria.utils.Array.indexOf(this.queues[animInfo.queue].list, animInfo);
                            this.queues[animInfo.queue].list.splice(queueOrder, 1);
                        }
                    }
                    return true;
                }
                return false;
            },

            /**
             * Stops the execution of a queue and delete all its animations
             * @param {String} queue identifier
             * @return {Boolean} true if the related queue exists and is not empty, otherwise false
             */
            skipQueue : function (queueId) {
                var id = queueId;
                if (queueId == null) {
                    id = this.DEFAULT_QUEUE_KEY;
                }
                var queue = this.queues[id];
                if (queue && queue.list.length > 0) {
                    var curAnimInfo = queue.list.shift();
                    for (var i = 1, l = queue.list.length; i < l; i++) {
                        var animInfo = queue.list[i];
                        delete this.animations[animInfo.animId];
                    }
                    this.skipAnimation(curAnimInfo.animId);
                    delete this.queues[id];
                    return true;
                }
                return false;
            },

            /**
             * Pauses the animation until it is resumed by resumeAnimation() or resumeQueue()
             * @param {String} animation identifier
             * @return {Boolean} true if the related animation exists, otherwise false
             */
            pauseAnimation : function (animId) {
                var animInfo = this.animations[animId];
                if (animInfo) {
                    clearInterval(animInfo.timingId);
                    animInfo.isRunning = false;
                    animInfo.pauseTime = (new Date()).getTime();
                    return true;
                }
                return false;
            },

            /**
             * Pauses the queue until it is resumed by resumeAnimation() or resumeQueue()
             * @param {String} queue identifier
             * @return {Boolean} true if the related queue exists and is not empty, otherwise false
             */
            pauseQueue : function (idQueue) {
                var id = idQueue;
                if (idQueue == null) {
                    id = this.DEFAULT_QUEUE_KEY;
                }
                var queue = this.queues[id];
                if (queue && queue.list.length > 0) {
                    this.pauseAnimation(queue.list[0].animId);
                    return true;
                }
                return false;
            },

            /**
             * Resumes a paused animation (and its queue)
             * @param {String} animation identifier
             * @return {Boolean} true if the related animation exists, otherwise false
             */
            resumeAnimation : function (animId) {
                var animInfo = this.animations[animId];
                if (animInfo && !animInfo.isRunning) {
                    var offset = (new Date()).getTime() - animInfo.pauseTime;
                    animInfo.start += offset;
                    animInfo.end += offset;
                    animInfo.isRunning = true;
                    var id = setInterval(function (that) {
                        return function () {
                            that._interpolate.call(that, animInfo);
                        };
                    }(this), animInfo.interval);
                    animInfo.timingId = id;
                    return true;
                }
                return false;
            },

            /**
             * Resumes a paused queue
             * @param {String} queue identifier
             * @return {Boolean} true if the related queue exists and is not empty, otherwise false
             */
            resumeQueue : function (idQueue) {
                var id = idQueue;
                if (idQueue == null) {
                    id = this.DEFAULT_QUEUE_KEY;
                }
                var queue = this.queues[id];
                if (queue && queue.list.length > 0 && !queue.list[0].isRunning) {
                    // if first animation in queue has been paused (and not skipped afterwards)
                    if (queue.list[0].pauseTime != null) {
                        this.resumeAnimation(queue.list[0].animId);
                    } else { // if the paused animation has been skipped
                        this._launchAnimation(queue.list[0], queue.list[0].animId);
                    }
                    return true;
                }
                return false;
            },

            /**
             * Shows a hidden HTML element. <br>
             * It shows an element animating the properties listed in properties parameter, or animating the opacity (if
             * properties parameter is empty)
             * @param {HTMLElement|String} element to be animated (or its id)
             * @param {Array} CSS properties list; values can be: "height","width","opacity"
             * @param {Object} cfg animation configuration
             * @return {String} animation ID
             */
            show : function (htmlElem, properties, cfg) {
                var elem = this._getHTMLElement(htmlElem), endProps = {};
                var props = (properties == null) ? [] : aria.utils.Array.clone(properties);
                if (elem == null) {
                    this.$logWarn(this.INVALID_HTML_ELEMENT);
                    return null;
                }
                if (aria.utils.Dom.getStyle(elem, "display") != "none") {
                    this.$logWarn(this.INVALID_HTML_ELEMENT);
                    return null;
                }

                var oldValues = elem.ATEffects || {};
                var display = oldValues.display;
                delete oldValues.display;

                if (props && props.length > 0) {
                    for (var prop in oldValues) {
                        var ix = aria.utils.Array.indexOf(props, prop);
                        if (ix != -1) {
                            endProps[prop] = oldValues[prop].fullValue;
                            props.splice(ix, 0);
                        } else {
                            this._setProperty(elem, {
                                prop : prop,
                                unit : oldValues[prop].unit
                            }, oldValues[prop].value);
                        }
                    }
                    for (var i = 0, l = props.length; i < l; i++) {
                        endProps[props[i]] = this._getProperty(elem, props[i]);
                        this._setProperty(elem, {
                            prop : props[i]
                        }, 0);
                    }
                } else {
                    endProps.opacity = (oldValues.opacity)? oldValues.opacity.fullValue : 1;
                }

                elem.style.display = display || "block";

                return this.animate(elem, endProps, cfg);
            },

            /**
             * Hides an HTML element. <br>
             * it hides an element animating the properties listed in properties parameter, or animating the opacity (if
             * properties parameter is empty)
             * @param {HTMLElement|String} element to be animated (or its id)
             * @param {Array} CSS properties list; values can be: "height","width","opacity"
             * @param {Object} cfg animation configuration
             * @return {String} animation ID
             */
            hide : function (htmlElem, properties, cfg) {
                var cfgWrap = (cfg == null) ? {} : aria.utils.Json.copy(cfg, false);
                var elem = this._getHTMLElement(htmlElem), startProps = {}, endProps = {};
                if (elem == null) {
                    this.$logWarn(this.INVALID_HTML_ELEMENT);
                    return null;
                }

                if (properties) {
                    for (var i = 0, l = properties.length; i < l; i++) {
                        if (aria.utils.Array.indexOf(["height", "width", "opacity"], properties[i]) != -1) {
                            // startProps[properties[i]] = aria.utils.Dom.getStyle(elem, properties[i]);

                            var currentValue = this._getProperty(elem, properties[i]);
                            startProps[properties[i]] = {
                                value : parseFloat(currentValue) || 0,
                                unit : this._getUnit(currentValue, properties[i]),
                                fullValue : currentValue
                            };
                            endProps[properties[i]] = 0;
                        }
                    }
                }
                if (aria.utils.Object.isEmpty(startProps)) {
                    var opacity = aria.utils.Dom.getStyle(elem, "opacity");
                    startProps.opacity = {
                        value : opacity,
                        fullValue : opacity
                    };
                    endProps.opacity = 0;
                }
                startProps.display = aria.utils.Dom.getStyle(elem, "display");
                elem.ATEffects = startProps;

                cfgWrap.hide = true;

                return this.animate(elem, endProps, cfgWrap);
            },

            /**
             * Hides or shows an HTML element. <br>
             * it hides (if displayed) or shows (if hidden) an element animating the properties listed in properties
             * parameter, or animating the opacity (if properties parameter is empty)
             * @param {HTMLElement|String} element to be animated (or its id)
             * @param {Array} CSS properties list; values can be: "height","width","opacity"
             * @param {Object} cfg animation configuration
             * @return {String} animation ID
             */
            toggle : function (htmlElem, properties, cfg) {
                var elem = this._getHTMLElement(htmlElem);
                if (elem == null) {
                    this.$logWarn(this.INVALID_HTML_ELEMENT);
                    return null;
                }
                if (aria.utils.Dom.getStyle(elem, "display") == "none") {
                    return this.show(elem, properties, cfg);
                } else {
                    return this.hide(elem, properties, cfg);
                }
            },

            _getHTMLElement : function (htmlElem) {
                if (!aria.utils.Type.isHTMLElement(htmlElem)) {
                    return aria.utils.Dom.getElementById(htmlElem);
                }
                return htmlElem;
            },

            _createAnimationSpot : function (htmlElem, properties, cfg) {
                return (++this.animCount % 1000000000000000);
            },

            _createAndLaunchAnimation : function (animInfo) {
                return this._launchAnimation(animInfo, this._createAnimationSpot());
            },

            _launchAnimation : function (animInfo, animId) {
                var elem = animInfo.element;
                var PROPS = this.cfg.PROPERTIES;
                this.$callback(animInfo.onStartAnimation);
                animInfo.start = (new Date()).getTime();
                animInfo.end = animInfo.start + animInfo.duration;

                for (var prop in animInfo.userProperties) {
                    if (animInfo.userProperties.hasOwnProperty(prop)) {
                        var isColor = PROPS[prop] && PROPS[prop].isColor;
                        var currentValueNum, relativeOperator, unit, valueNum, currentValue, currentUnit, value;

                        value = animInfo.userProperties[prop] + "";

                        if (relativeOperator = value.match(/^[\+\-]=/)) {
                            value = value.replace(relativeOperator[0], "");
                        }

                        if (isColor) {
                            var color = this._getProperty(elem, prop);
                            currentValueNum = (color == "transparent")
                                    ? [255, 255, 255]
                                    : this.colorUtil.getRGBComponents(color);
                            valueNum = this.colorUtil.getRGBComponents(value);
                        } else {
                            unit = this._getUnit(value, prop);
                            valueNum = parseFloat(value);
                            currentValue = this._getProperty(elem, prop);
                            currentUnit = this._getUnit(currentValue, prop);
                            currentValueNum = parseFloat(currentValue) || 0;
                        }

                        var propIsValid = (prop in PROPS && !(PROPS[prop].percentNotAdmitted && unit == "%"));

                        if (isColor
                                || (aria.utils.Type.isNumber(valueNum) && aria.utils.Type.isNumber(currentValueNum) && propIsValid)) {
                            // detect if the property has multiple components (ex. margin-left, margin-right...) and
                            // explode it if different values are set
                            var explodedProps = [];
                            var explode = false;
                            if (PROPS[prop].orientation == this.cfg.COMPOSITE && PROPS[prop].subProperties != null) {
                                var tmpValue;
                                for (var i = 0, l = PROPS[prop].subProperties.length; i < l; i++) {
                                    var currProp = PROPS[prop].subProperties[i];
                                    var currentCompValue = this._getProperty(elem, currProp);
                                    var currentCompUnit = this._getUnit(currentCompValue, currProp);
                                    var currentCompValueNum = parseFloat(currentCompValue) || 0;
                                    explodedProps.push({
                                        prop : currProp,
                                        currentValueNum : currentCompValueNum,
                                        currentUnit : currentCompUnit
                                    });
                                    if (i > 0 && currentCompValue != tmpValue) {
                                        explode = true;
                                    }
                                    tmpValue = currentCompValue;
                                }
                            }
                            if (!explode) {
                                explodedProps = [{
                                            prop : prop,
                                            currentValueNum : currentValueNum,
                                            currentUnit : currentUnit
                                        }];
                            }

                            // convert current unit in final animation unit and push each property animation in a stack
                            for (var i = 0, l = explodedProps.length; i < l; i++) {
                                var curValueNum = explodedProps[i].currentValueNum;
                                if (explodedProps[i].currentUnit != unit) {
                                    curValueNum = this.unitUtil.convertFromPixels(unit, explodedProps[i].currentValueNum, elem, explodedProps[i].prop);
                                }
                                if (relativeOperator) {
                                    valueNum = acceptedOperations[relativeOperator[0]](curValueNum, valueNum);
                                }
                                animInfo.props.push({
                                    prop : explodedProps[i].prop,
                                    origin : curValueNum,
                                    dest : valueNum,
                                    unit : unit,
                                    isColor : isColor
                                });
                                if (explodedProps[i].prop == "backgroundPositionY"
                                        && animInfo.backgroundComplementaryValueX == null) {
                                    animInfo.backgroundComplementaryValueX = (this._getProperty(elem, "backgroundPositionX") || "0px");
                                } else if (explodedProps[i].prop == "backgroundPositionX"
                                        && animInfo.backgroundComplementaryValueY == null) {
                                    animInfo.backgroundComplementaryValueY = (this._getProperty(elem, "backgroundPositionY") || "0px");
                                }
                            }
                        }
                    }
                }
                delete animInfo.userProperties;

                // start animation
                if (animInfo.props.length > 0) {
                    animInfo.isRunning = true;
                    var id = setInterval(function (that) {
                        return function () {
                            that._interpolate.call(that, animInfo);
                        };
                    }(this), animInfo.interval);
                    animInfo.timingId = id;
                    // this.animations[animId] = animInfo;
                } else {
                    this.$logWarn(this.NO_PROPERTY_TO_ANIMATE);
                }

                return animId;
            },

            _interpolate : function (animInfo) {
                // check isRunning ONLY FOR IE7: the clearInterval does not work properly (the function is triggered one
                // more time after the clearInterval)
                if (animInfo.isRunning) {
                    var now = (new Date()).getTime(), ended = (now >= animInfo.end), bgPositionAnim = {};

                    for (var i = 0, l = animInfo.props.length; i < l; i++) {
                        var interpolation, item = animInfo.props[i];
                        if (ended) {
                            interpolation = item.dest;
                        } else {
                            interpolation = this._computeInterpolation(animInfo.easing, item, animInfo.start, animInfo.end, now);
                        }
                        if (item.prop == "backgroundPositionX" || item.prop == "backgroundPositionY") {
                            bgPositionAnim[item.prop] = {
                                val : interpolation,
                                unit : item.unit
                            };
                        } else {
                            this._setProperty(animInfo.element, item, interpolation);
                        }
                    }
                    if (bgPositionAnim["backgroundPositionX"] || bgPositionAnim["backgroundPositionY"]) {
                        var bgPosition = [(bgPositionAnim["backgroundPositionX"]
                                ? (bgPositionAnim["backgroundPositionX"].val + bgPositionAnim["backgroundPositionX"].unit)
                                : animInfo.backgroundComplementaryValueX)];
                        bgPosition.push(" ");
                        bgPosition.push(bgPositionAnim["backgroundPositionY"]
                                ? (bgPositionAnim["backgroundPositionY"].val + bgPositionAnim["backgroundPositionY"].unit)
                                : animInfo.backgroundComplementaryValueY);
                        animInfo.element.style["backgroundPosition"] = bgPosition.join("");
                    }

                    if (ended) {
                        this._finalizeAnimation(animInfo);
                    }
                }
            },

            _finalizeAnimation : function (animInfo, stopAnimation) {
                animInfo.hide && (animInfo.element.style.display = "none");
                !stopAnimation && this.$callback(animInfo.onEndAnimation);
                clearInterval(animInfo.timingId);
                animInfo.isRunning = false;
                delete this.animations[animInfo.animId];
                if (animInfo.queue) {
                    this.queues[animInfo.queue].list.shift();
                    // if it is the last animation of its queue
                    if (this.queues[animInfo.queue].list.length === 0) {
                        this.$callback(this.queues[animInfo.queue].onEndQueue);
                        delete this.queues[animInfo.queue];
                    } else {
                        var next = this.queues[animInfo.queue].list[0];
                        this._launchAnimation(next, next.animId);
                    }
                }
            },

            _getUnit : function (value, prop) {
                // /(em|%|px|ex|cm|mm|in|pt|pc)$/
                var unitRegExp = new RegExp("(" + this.cfg.UNITS.join("|") + ")$");
                var unit = aria.utils.String.trim(value).toLowerCase().match(unitRegExp);
                if (prop == "opacity" || prop == "scrollTop" || prop == "scrollLeft") {
                    return null;
                } else
                    return unit ? unit[0] : "px";
            },

            _getQueueKey : function (name) {
                return "_" + name;
            },

            _getProperty : function (elem, prop) {
                var value;
                if (this.cfg.PROPERTIES[prop] && !this.cfg.PROPERTIES[prop].notStyleProperty) {
                    value = aria.utils.Dom.getStyle(elem, prop);
                } else {
                    value = elem[prop];
                }
                return (value == null) ? "" : value.toString();
            },

            _setProperty : function (elem, item, value) {
                var prop = item.prop, browser = aria.core.Browser, unit = item.unit || "";
                if (item.isColor) {
                    elem.style[prop] = this.colorUtil.getRGBNotationFromRGBComponents(value);
                } else if (this.cfg.PROPERTIES[prop] && !this.cfg.PROPERTIES[prop].notStyleProperty) {
                    if (prop == "opacity" && (browser.isIE6 || browser.isIE7 || browser.isIE8)) {
                        elem.style["filter"] = "alpha(opacity = " + value * 100 + ")";
                    } else {
                        elem.style[prop] = value + unit;
                    }
                } else {
                    elem[prop] = value;
                }
            }

        }
    });
})();
