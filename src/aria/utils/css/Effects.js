(function() {
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

/**
 * Utilities for CSS3 animations Add CSS animations. To add a new animation you need to create a new instance of
 * aria.utils.css.Animations and call the method start passing:
 *
 * <pre>
 * - the animation name (that can be slide, slideup, slidedown, fade, pop, flip)
 * - a configuration object that describes the animation:
 *      cfg {
 *          from : {HTMLElement} that will animate out [optional],
 *          to : {HTMLElement} that will animate in [optional],
 *          reverse : {Boolean} true to activate the reverse transition, default false [optional],
 *          type : {Number} 1 for normal transitions, 2 to activate hardware acceleration, 3 for 3D transitions, default is 1 [optional],
 *          hiddenClass : {String} className for to the element that will animate out and to remove from the element animate in [optional]
 *      }
 * </pre>
 */

function round(value){
    return Math.round(value * 100)/100;
}

Aria.classDefinition({
    $classpath : "aria.utils.css.Effects",
    $dependencies : ["aria.utils.css.EffectsConfig"],
    $singleton : true,
    $statics : {
        __convertUnit : {
            "%" : function(value, elem, property){
                return round(this.__px2Percentage(value, elem, property));
            },
            "em" : function(value, elem, property){
                return round(this.__px2Em(value, elem, property));
            },
            "ex" : function(value, elem, property){
                return round(2 * this.__px2Em(value, elem, property));
            },
            "in" : function(value, elem, property){
                return round(this.__px2Inches(value, property));
            },
            "cm" : function(value, elem, property){
                return round(2.54 * this.__px2Inches(value, property));
            },
            "mm" : function(value, elem, property){
                return round(25.4 * this.__px2Inches(value, property));
            },
            "pt" : function(value, elem, property){
                return round(72 * this.__px2Inches(value, property));
            },
            "px" : function(value, elem, property){
                return value;
            },
            "pc" : function(value, elem, property){
                // 1pc = 12pt
                return round(6 * this.__px2Inches(value, property));
            }
        },

        __easing : {
            "linear" : function(startValue, endValue, start, end, current){
                var sx = start, ex = end, sy = startValue, ey = endValue, x = current;
                var y = ((ey-sy)/(ex-sx)) * (x-sx) + sy
                return round(y);
            },
            "swing" : function(startValue, endValue, start, end, current){
                // TODO: implement and change name
                return;
            }
        },

        __px2Inches : function (value, property){
            //TODO: CHECK use dpi.x and dpi.y
            var dpi;
            switch(this.cfg.PROPERTIES[property].orientation){
                case this.cfg.HORIZONTAL:
                dpi = this.dpi.x;
                break;
                case this.cfg.VERTICAL:
                dpi = this.dpi.y;
                break;
                // if composite, then dpi = average
                default:
                dpi = (this.dpi.x + this.dpi.y)/2;
                break;
            }
            return value/dpi;
        },

        __px2Em : function (value, elem, property){
            var el = (property == "font-size")? elem.parentNode : elem;
            var fontSize = parseFloat(aria.utils.Dom.getStyle(el, "fontSize"));
            return value / fontSize;
        },

        __px2Percentage : function (value, elem, property){
            var el = elem.parentNode, refer;
            // computes the height or width of the container
            refer = parseFloat(aria.utils.Dom.getStyle(el, (this.cfg.PROPERTIES[property].orientation == this.cfg.HORIZONTAL)? "width" : "height"));
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
         * Starts the effect
         * @param {HTMLElement | aria.templates.DomElementWrapper} element to be animated
         * @param {Object} CSS properties
         * @param {Object} cfg animation configuration
         */
        animate : function (htmlElem, properties, cfg) {
            var idTiming,
                that = this,
                PROPS = this.cfg.PROPERTIES;
            cfg = cfg || {};
            var elem = htmlElem,
                animInfo = {
                    props : []
                };


            function createAnimationSpot(){
                return (++this.animCount % 1000000000000000);
            }

            function createAndLaunchAnimation (animInfo, interval){
                var that = this;
                return launchAnimation.call(that, animInfo, createAnimationSpot.call(that));
            }

            function launchAnimation (animInfo, idTiming){
                var that = this;
                animInfo.start = new Date();
                animInfo.end = (new Date(animInfo.start)).setMilliseconds(animInfo.start.getMilliseconds() + animInfo.duration);
                animInfo.start = animInfo.start.getTime();

                for(var prop in animInfo.userProperties){
                    var currentValueNum, relativeOperator, unit, valueNum, currentValue, currentUnit, value;

                    value = animInfo.userProperties[prop] + "";

                    relativeOperator = value.match(/^[\+\-]/);
                    unit = this.__getUnit(value, prop);
                    valueNum = parseFloat(value);

                    // element é DomElementWrapper, ma dev'essere HTMLElement
                    currentValue = aria.utils.Dom.getStyle(elem, prop);
                    currentUnit = this.__getUnit(currentValue, prop);
                    currentValueNum = parseFloat(currentValue) || 0;


                    if(aria.utils.Type.isNumber(valueNum) && aria.utils.Type.isNumber(currentValueNum)){
                        if(currentUnit == unit){
                            animInfo.props.push({
                               prop : prop,
                               origin : currentValueNum,
                               dest : valueNum,
                               unit : unit
                            });
                        }
                        else{
                            if(prop in PROPS && !(PROPS[prop].percentNotAdmitted && unit == "%")){
                                var explodedProps;
                                if(PROPS[prop].orientation == this.cfg.COMPOSITE){
                                    explodedProps = [];
                                    for(var i in PROPS[prop].subProperties){
                                        currentValue = aria.utils.Dom.getStyle(elem, PROPS[prop].subProperties[i]);
                                        currentValueNum = parseFloat(currentValue) || 0;
                                        explodedProps.push({
                                            prop: PROPS[prop].subProperties[i],
                                            currentValueNum: currentValueNum
                                        });
                                    }
                                }
                                else {
                                    explodedProps = [{
                                        prop: prop,
                                        currentValueNum: currentValueNum
                                    }];
                                }
                                for (var i in explodedProps){
                                    var curValueNum = this.__convertUnit[unit].call(this, explodedProps[i].currentValueNum, elem, explodedProps[i].prop);
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
                }
                delete animInfo.userProperties;

                // start animation
                if(animInfo.props.length > 0){
                    console.log("animInfo::", animInfo);
                    var id = setInterval(function(){interpolate.call(that, animInfo)}, animInfo.interval);
                    this.animations[idTiming] = id;
                }
                else{
                    console.log("WARNING: No valid property to animate");
                }



                return idTiming;
            }

            function interpolate(animInfo){
                var now = (new Date()).getTime(), ended = false, that = this;
                //console.log("interpolate::", now);

                if(now >= animInfo.end){
                    ended = true;
                    console.log("END animation::", animInfo);
                    clearInterval(this.animations[animInfo.idTiming]);
                    delete this.animations[animInfo.idTiming];
                    if(animInfo.queue){
                        this.queues[animInfo.queue].shift();
                        if(this.queues[animInfo.queue].length == 0){
                            delete this.queues[animInfo.queue];
                        }
                        else{
                            var next = this.queues[animInfo.queue][0];
                            launchAnimation.call(that, next, next.idTiming);
                        }
                    }
                }

                for(var prop in animInfo.props){
                    var interpolation, item = animInfo.props[prop];
                    if(ended){
                        interpolation = item.dest;
                    }
                    else{
                        interpolation = that.__easing[animInfo.easing](item.origin, item.dest, animInfo.start, animInfo.end, now);
                    }
                    this.__setProperty(animInfo.element, item.prop, interpolation, item.unit);

                }
            }

            if(!aria.utils.Type.isHTMLElement(htmlElem)){
                elem = new aria.utils.Dom.getElementById(htmlElem);
            }

            animInfo.duration = cfg.duration? parseInt(cfg.duration) : this.cfg.DEFAULT_DURATION;
            animInfo.interval = cfg.interval? parseInt(cfg.interval) : this.cfg.DEFAULT_INTERVAL;
            animInfo.easing = cfg.easing || this.cfg.DEFAULT_EASING;
            animInfo.queue = (cfg.queue == true)? this.cfg.DEFAULT_QUEUE_KEY : (cfg.queue != undefined)? this.__getQueueKey(cfg.queue) : false;
            animInfo.element = elem;
            animInfo.userProperties = properties;

            if(animInfo.queue){
                if(!this.queues[animInfo.queue]){
                    this.queues[animInfo.queue] = [animInfo];
                    idTiming = createAndLaunchAnimation.call(that, animInfo);
                }
                else{
                    idTiming = createAnimationSpot.call(that);
                    this.queues[animInfo.queue].push(animInfo);
                }
            }
            else{
                idTiming = createAndLaunchAnimation.call(that, animInfo);
            }
            animInfo.idTiming = idTiming;

            return idTiming;
        },

        stopAnimation : function (idTiming){
            //TODO: remove from queue, clearInterval
        },

        __getUnit : function (value, prop){
//              var unit = aria.utils.String.trim(value).toLowerCase().match(/(em|%|px|ex|cm|mm|in|pt|pc)$/);
//              /(em|%|px|ex|cm|mm|in|pt|pc)$/
              var unitRegExp = new RegExp("(" + this.cfg.UNITS.join("|") + ")$");
              var unit = aria.utils.String.trim(value).toLowerCase().match(unitRegExp);
              return unit ? unit[0] : (prop=="opacity"? null : "px");
        },

        __getQueueKey : function (name){
            return "_" + name;
        },


        __setProperty : function (elem, prop, value, unit){
              if(elem.style[prop] != undefined) {
                  elem.style[prop] = value + unit;
              }
              else{
                  if(prop == "opacity"){
                      elem.style["filter"] = "alpha(opacity = " + value*100 + ")";
                  }
              }
        }



    }
});
})();
