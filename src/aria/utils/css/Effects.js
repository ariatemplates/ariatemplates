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
        $dependencies : ["aria.utils.css.EffectsConfig"],
        $singleton : true,
        $statics : {
            __convertUnit : {
                "%" : function (value, elem, property) {
                    return round(this.__px2Percentage(value, elem, property));
                },
                "em" : function (value, elem, property) {
                    return round(this.__px2Em(value, elem, property));
                },
                "ex" : function (value, elem, property) {
                    return round(2 * this.__px2Em(value, elem, property));
                },
                "in" : function (value, elem, property) {
                    return round(this.__px2Inches(value, property));
                },
                "cm" : function (value, elem, property) {
                    return round(2.54 * this.__px2Inches(value, property));
                },
                "mm" : function (value, elem, property) {
                    return round(25.4 * this.__px2Inches(value, property));
                },
                "pt" : function (value, elem, property) {
                    return round(72 * this.__px2Inches(value, property));
                },
                "px" : function (value, elem, property) {
                    return value;
                },
                "pc" : function (value, elem, property) {
                    // 1pc = 12pt
                    return round(6 * this.__px2Inches(value, property));
                }
            },

            __easing : {
                "linear" : function (startValue, endValue, start, end, current) {
                    var sx = start, ex = end, sy = startValue, ey = endValue, x = current;
                    var y = ((ey - sy) / (ex - sx)) * (x - sx) + sy
                    return round(y);
                }
            },

            __px2Inches : function (value, property) {
                var dpi;
                switch (this.cfg.PROPERTIES[property].orientation) {
                    case this.cfg.HORIZONTAL :
                        dpi = this.dpi.x;
                        break;
                    case this.cfg.VERTICAL :
                        dpi = this.dpi.y;
                        break;
                    // if composite, then dpi = average
                    default :
                        dpi = (this.dpi.x + this.dpi.y) / 2;
                        break;
                }
                return value / dpi;
            },

            __px2Em : function (value, elem, property) {
                var el = (property == "font-size") ? elem.parentNode : elem;
                var fontSize = parseFloat(aria.utils.Dom.getStyle(el, "fontSize"));
                return value / fontSize;
            },

            __px2Percentage : function (value, elem, property) {
                var el = elem.parentNode, refer;
                // computes the height or width of the container
                refer = parseFloat(aria.utils.Dom.getStyle(el, (this.cfg.PROPERTIES[property].orientation == this.cfg.HORIZONTAL)
                        ? "width"
                        : "height"));
                return value / refer * 100;
            }

        },
        $constructor : function () {

            this.cfg = aria.utils.css.EffectsConfig;
            this.queues = {};
            this.animations = {};
            this.animCount = 0;

            // detect dpi
            var domElement = Aria.$window.document.createElement("div");
            domElement.style.cssText = "height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;";
            domElement.id = "dpiDetectionTest";
            Aria.$window.document.body.appendChild(domElement);
            this.dpi = {
                x : Aria.$window.document.getElementById('dpiDetectionTest').offsetWidth,
                y : Aria.$window.document.getElementById('dpiDetectionTest').offsetHeight
            }
            Aria.$window.document.body.removeChild(domElement);
            // end detection dpi

        },
        $destructor : function () {

        },
        $prototype : {

            /**
             * Starts the animation
             * @param {HTMLElement | String} element to be animated (or its id)
             * @param {Object} CSS properties
             * @param {Object} cfg animation configuration
             */
            animate : function (htmlElem, properties, cfg) {
                var idTiming;
                cfg = cfg || {};
                var elem = htmlElem, animInfo = {
                    props : []
                };

                if (!aria.utils.Type.isHTMLElement(htmlElem)) {
                    elem = aria.utils.Dom.getElementById(htmlElem);
                }

                animInfo.duration = cfg.duration ? parseInt(cfg.duration) : this.cfg.DEFAULT_DURATION;
                animInfo.interval = cfg.interval ? parseInt(cfg.interval) : this.cfg.DEFAULT_INTERVAL;
                if (cfg.easing != null) {
                    if (aria.utils.Type.isFunction(cfg.easing)) {
                        animInfo.easing = cfg.easing;
                    } else if (aria.utils.Type.isString(cfg.easing)) {
                        animInfo.easing = this.__easing[cfg.easing];
                    }
                }
                animInfo.easing = animInfo.easing || this.__easing[this.cfg.DEFAULT_EASING];
                animInfo.queue = (cfg.queue == true) ? this.cfg.DEFAULT_QUEUE_KEY : (cfg.queue != undefined)
                        ? this.__getQueueKey(cfg.queue)
                        : false;
                animInfo.element = elem;
                animInfo.userProperties = properties;
                animInfo.onStartAnimation = cfg.onStartAnimation;
                animInfo.onEndAnimation = cfg.onEndAnimation;
                animInfo.onEndQueue = cfg.onEndQueue;

                if (animInfo.queue) {
                    // if it is the first animation of its queue
                    if (!this.queues[animInfo.queue]) {
                        this.queues[animInfo.queue] = {
                            list : [animInfo],
                            onEndQueue : cfg.onEndQueue
                        };
                        this.$callback(cfg.onStartQueue)
                        idTiming = this._createAndLaunchAnimation(elem, animInfo);
                    } else {
                        idTiming = this._createAnimationSpot();
                        this.queues[animInfo.queue].list.push(animInfo);
                    }
                } else {
                    idTiming = this._createAndLaunchAnimation(elem, animInfo);
                }
                animInfo.idTiming = idTiming;

                return idTiming;
            },

            _createAnimationSpot : function (htmlElem, properties, cfg) {
                return (++this.animCount % 1000000000000000);
            },

            _createAndLaunchAnimation : function (elem, animInfo) {
                return this._launchAnimation(elem, animInfo, this._createAnimationSpot());
            },

            _launchAnimation : function (elem, animInfo, idTiming) {
                var PROPS = this.cfg.PROPERTIES;
                this.$callback(animInfo.onStartAnimation);
                animInfo.start = (new Date()).getTime();
                animInfo.end = animInfo.start + animInfo.duration;

                for (var prop in animInfo.userProperties) {
                    if (animInfo.userProperties.hasOwnProperty(prop)) {
                        var currentValueNum, relativeOperator, unit, valueNum, currentValue, currentUnit, value;

                        value = animInfo.userProperties[prop] + "";

                        relativeOperator = value.match(/^[\+\-]/);
                        unit = this.__getUnit(value, prop);
                        valueNum = parseFloat(value);

                        currentValue = this.__getProperty(elem, prop);
                        currentUnit = this.__getUnit(currentValue, prop);
                        currentValueNum = parseFloat(currentValue) || 0;

                        if (aria.utils.Type.isNumber(valueNum) && aria.utils.Type.isNumber(currentValueNum)
                                && (prop in PROPS && !(PROPS[prop].percentNotAdmitted && unit == "%"))) {
                            // detect if the property has multiple components (ex. margin-left, margin-right...) and
                            // explode it if different values are set
                            var explodedProps = [];
                            var explode = false;
                            if (PROPS[prop].orientation == this.cfg.COMPOSITE && PROPS[prop].subProperties != null) {
                                var tmpValue
                                for (var i = 0, l = PROPS[prop].subProperties.length; i<l; i++) {
                                    var currProp = PROPS[prop].subProperties[i];
                                    var currentCompValue = this.__getProperty(elem, currProp);
                                    var currentCompUnit = this.__getUnit(currentCompValue, currProp);
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
                            for (var i = 0, l = explodedProps.length; i<l; i++) {
                                var curValueNum = explodedProps[i].currentValueNum;
                                if (explodedProps.currentUnit != unit) {
                                    curValueNum = this.__convertUnit[unit].call(this, explodedProps[i].currentValueNum, elem, explodedProps[i].prop);
                                }
                                animInfo.props.push({
                                    prop : explodedProps[i].prop,
                                    origin : curValueNum,
                                    dest : valueNum,
                                    unit : unit
                                });
                            }
                        }
                    }
                }
                delete animInfo.userProperties;

                // start animation
                if (animInfo.props.length > 0) {
                    var id = setInterval(function (that) {
                        return function () {
                            that._interpolate.call(that, elem, animInfo);
                        }
                    }(this), animInfo.interval);
                    this.animations[idTiming] = id;
                } else {
                    console.log("WARNING: No valid property to animate");
                }

                return idTiming;
            },

            _interpolate : function (elem, animInfo) {
                var now = (new Date()).getTime(), ended = (now >= animInfo.end);

                for (var prop in animInfo.props) {
                    if (animInfo.props.hasOwnProperty(prop)) {
                        var interpolation, item = animInfo.props[prop];
                        if (ended) {
                            interpolation = item.dest;
                        } else {
                            interpolation = animInfo.easing(item.origin, item.dest, animInfo.start, animInfo.end, now);
                        }
                        this.__setProperty(animInfo.element, item.prop, interpolation, item.unit);
                    }
                }

                if (ended) {
                    this.$callback(animInfo.onEndAnimation)
                    clearInterval(this.animations[animInfo.idTiming]);
                    delete this.animations[animInfo.idTiming];
                    if (animInfo.queue) {
                        this.queues[animInfo.queue].list.shift();
                        // if it is the last animation of its queue
                        if (this.queues[animInfo.queue].list.length == 0) {
                            this.$callback(this.queues[animInfo.queue].onEndQueue)
                            delete this.queues[animInfo.queue];
                        } else {
                            var next = this.queues[animInfo.queue].list[0];
                            this._launchAnimation(elem, next, next.idTiming);
                        }
                    }
                }
            },

            __getUnit : function (value, prop) {
                // /(em|%|px|ex|cm|mm|in|pt|pc)$/
                var unitRegExp = new RegExp("(" + this.cfg.UNITS.join("|") + ")$");
                var unit = aria.utils.String.trim(value).toLowerCase().match(unitRegExp);
                if (prop == "opacity" || prop == "scrollTop" || prop == "scrollLeft") {
                    return null;
                } else
                    return unit ? unit[0] : "px";
            },

            __getQueueKey : function (name) {
                return "_" + name;
            },

            __getProperty : function (elem, prop) {
                var value;
                if (this.cfg.PROPERTIES[prop] && !this.cfg.PROPERTIES[prop].notStyleProperty) {
                    value = aria.utils.Dom.getStyle(elem, prop)
                } else {
                    value = elem[prop];
                }
                return (value == undefined) ? "" : value.toString();
            },

            __setProperty : function (elem, prop, value, unit) {
                if (this.cfg.PROPERTIES[prop] && !this.cfg.PROPERTIES[prop].notStyleProperty) {
                    if (prop == "opacity" && aria.core.Browser.isIE) {
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
