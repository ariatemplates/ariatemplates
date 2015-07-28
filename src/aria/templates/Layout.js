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
var Aria = require("../Aria");
require("./CfgBeans");
var ariaTemplatesTemplateCtxtManager = require("./TemplateCtxtManager");
var ariaUtilsEvent = require("../utils/Event");
var ariaCoreBrowser = require("../core/Browser");
var ariaUtilsDom = require("../utils/Dom");
var ariaUtilsAriaWindow = require("../utils/AriaWindow");
var ariaCoreTimer = require("../core/Timer");
var ariaCoreJsonValidator = require("../core/JsonValidator");

(function () {
    var layout;
    var timer;
    var eventUtils;
    var __cancelID;
    var __rootDim = {
        width : {},
        height : {}
    };
    var __scrollBarsWidth;
    var __autoresizes = null;

    /**
     * If not done already, notifies AriaWindow that we are using Aria.$window and attaches the resize listener to it.
     */
    var __init = function () {
        if (__autoresizes == null) {
            __autoresizes = [];
            ariaUtilsAriaWindow.attachWindow();
            eventUtils.addListener(Aria.$window, "resize", {
                fn : __onResize
            });
            // PTR 08127833 - it updates the viewport sizes the first time a DOM element is registered as autoresizable
            __applyNewSize();
        }
    };

    /**
     * If not done already, remove the resize listener from Aria.$window and notifies AriaWindow that we are no longer
     * using Aria.$window.
     */
    var __reset = function () {
        if (__cancelID) {
            timer.cancelCallback(__cancelID);
            __cancelID = null;
        }
        if (__autoresizes != null) {
            eventUtils.removeListener(Aria.$window, "resize", {
                fn : __onResize
            });
            ariaUtilsAriaWindow.detachWindow();
            __autoresizes = null;
        }
    };

    /**
     * Check whether there listeners are registered and call either __init or __reset.
     */
    var __checkListeners = function () {
        if (__autoresizes == null && layout._listeners && layout._listeners['viewportResized']) {
            __init();
        } else if (__autoresizes != null && __autoresizes.length === 0
                && (layout._listeners == null || layout._listeners['viewportResized'] == null)) {
            __reset();
        }
    };

    var __computeSOSizeValue = function (obj) {
        var res;
        if (obj.min != null || obj.max != null) {
            res = (Aria.minSizeMode && obj.min != null ? obj.min : obj.viewport);
            if (res != null) {
                if (obj.scrollbar) {
                    res -= layout.getScrollbarsWidth();
                }
                if (obj.min != null && res < obj.min) {
                    res = obj.min;
                }
                if (obj.max != null && res > obj.max) {
                    res = obj.max;
                }
            } else if (obj.min == obj.max) {
                res = obj.min;
            }
        }
        obj.value = res;
    };

    var __onResize = function () {
        if (__cancelID) {
            timer.cancelCallback(__cancelID);
            __cancelID = null;
        }
        __cancelID = timer.addCallback({
            fn : __onResizeFinished,
            scope : layout,
            delay : 50
        });
    };

    var __applyNewSize = function () {
        var oldSize = layout.viewportSize;
        var newSize = ariaUtilsDom._getViewportSize();
        if (newSize.width != oldSize.width || newSize.height != oldSize.height) {
            layout.viewportSize = newSize;
            layout.setSOViewport(__rootDim.width, newSize.width);
            layout.setSOViewport(__rootDim.height, newSize.height);
            return true;
        }
        return false;
    };

    var __onResizeFinished = function () {
        __cancelID = null;
        if (__applyNewSize()) {
            var sz = __autoresizes.length;
            for (var i = 0; i < sz; i++) {
                var ar = __autoresizes[i];
                layout.setDivSize(ar.domElt, ar.width, ar.height);
                var tpl = ariaTemplatesTemplateCtxtManager.getFromDom(ar.domElt);
                if (tpl) {
                    var changed = false;
                    if (tpl.$setViewportWidth(__getIntSize(ar.width, "width"))) {
                        changed = true;
                    }
                    if (tpl.$setViewportHeight(__getIntSize(ar.height, "height"))) {
                        changed = true;
                    }
                    if (changed) {
                        tpl.$refresh();
                    }
                }
                ariaUtilsDom.refreshScrollbars(ar.domElt);
            }
            __applyNewSize();
            layout.$raiseEvent({
                name : "viewportResized",
                viewportNewSize : layout.viewportSize
            });
        }
    };

    var __getIntSize = function (value, sizeName) {
        if (typeof(value) == "object") {
            value = layout.getSODim(__rootDim[sizeName], value.min, value.incrementFactor, value.max);
        }
        return value;
    };

    /**
     * This class listens to changes in viewport size and raises an event for templates to refresh.
     * @singleton
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.templates.Layout",
        $singleton : true,
        $events : {
            "viewportResized" : {
                description : "Raised when the size of the viewport has changed.",
                properties : {
                    viewportNewSize : "{Object} New size of the viewport"
                }
            }
        },
        $constructor : function () {
            layout = this;
            timer = ariaCoreTimer;
            __applyNewSize();
            eventUtils = ariaUtilsEvent;
        },
        $destructor : function () {
            __reset();
            layout = null;
            timer = null;
            eventUtils = null;
        },
        $statics : {
            // ERROR MESSAGES:
            LAYOUT_INCOHERENT_MIN_MAX : "Error while setting size configuration: min (%1) > max (%2).",
            MINSIZE_UNDEFINED : "vdim or hdim cannot be used if container has no minimum size."
        },
        $prototype : {

            viewportSize : {
                width : null,
                height : null
            },
            // viewportSize: {width: ..., height: ...},

            /**
             * Raises the viewportResized event with the current viewport size.
             */
            refreshLayout : function () {
                layout.$raiseEvent({
                    name : "viewportResized",
                    viewportNewSize : layout.viewportSize
                });
            },

            $on : function () {
                this.$JsObject.$on.apply(this, arguments);
                __checkListeners();
            },

            $unregisterListeners : function () {
                this.$JsObject.$unregisterListeners.apply(this, arguments);
                __checkListeners();
            },

            $addListeners : function () {
                this.$JsObject.$addListeners.apply(this, arguments);
                __checkListeners();
            },

            $removeListeners : function () {
                this.$JsObject.$removeListeners.apply(this, arguments);
                __checkListeners();
            },

            registerAutoresize : function (domElt, width, height) {
                if (__autoresizes == null) {
                    __init();
                }
                __autoresizes.push({
                    domElt : domElt,
                    width : width,
                    height : height
                });
            },

            unregisterAutoresize : function (domElt) {
                if (__autoresizes == null) {
                    return;
                }
                var sz = __autoresizes.length;
                var newList = [];
                for (var i = 0; i < sz; i++) {
                    var e = __autoresizes[i];
                    if (e.domElt != domElt) {
                        newList.push(e);
                    }
                }
                __autoresizes = newList;
                if (newList.length === 0) {
                    __checkListeners();
                }
            },

            setRootDim : function (rootDim) {
                ariaCoreJsonValidator.check(rootDim, "aria.templates.CfgBeans.RootDimCfg");
                this.setSOSizeCfg(__rootDim.width, rootDim.width);
                this.setSOSizeCfg(__rootDim.height, rootDim.height);
            },

            realWidth : function (width) {
                return __getIntSize(width, "width");
            },

            realHeight : function (height) {
                return __getIntSize(height, "height");
            },

            setDivSize : function (domElt, width, height, style) {
                if (style == null) {
                    style = 'auto';
                }
                width = __getIntSize(width, "width");
                height = __getIntSize(height, "height");
                var domStyle = domElt.style;
                if (width) {
                    domStyle.width = width + 'px';
                }
                if (height) {
                    domStyle.height = height + 'px';
                }
                // We are not separating overflowX and overflowY here because, in Firefox, a vertical
                // scrollbar sometimes appears when using overflowX=hidden without specifying overflowY

                var overflowClass = '';
                if (width != null || height != null) {
                    if (style == 'auto') {
                        overflowClass = ' xOverflowAuto';
                    } else if (style == 'hidden') {
                        overflowClass = ' xOverflowHidden';
                    }
                }
                var clsName = domElt.className;
                if (clsName) {
                    clsName = clsName.replace(/\s*xOverflow\w+/g, '');
                    clsName += overflowClass;
                } else {
                    clsName = overflowClass;
                }
                domElt.className = clsName;
            },

            setSOSizeCfg : function (obj, cfg) {
                if (cfg.value != null) {
                    cfg.min = cfg.value;
                    cfg.max = cfg.value;
                }
                obj.min = cfg.min;
                obj.max = cfg.max;
                obj.scrollbar = cfg.scrollbar;
                if (obj.min != null && obj.max != null && obj.min > obj.max) {
                    this.$logError(this.LAYOUT_INCOHERENT_MIN_MAX, [obj.min, obj.max]);
                    obj.max = undefined;
                }
                __computeSOSizeValue(obj);
            },

            setSOViewport : function (obj, size) {
                obj.viewport = size;
                __computeSOSizeValue(obj);
            },

            getSODim : function (obj, min, coeff, max) {
                var tmin = obj.min; // template minimum size
                if (tmin == null) {
                    this.$logError(this.MINSIZE_UNDEFINED);
                    return min;
                }
                var tvp = obj.value; // template current size
                if (coeff == null) {
                    coeff = 1;
                }
                var res = parseInt(min + (tvp - tmin) * coeff, 10);
                if (max != null && res > max) {
                    res = max;
                }
                return res;
            },

            /**
             * Returns the width of scrollbars in pixels, as measured in the current browser.
             * @return {Number}
             */
            getScrollbarsMeasuredWidth : function () {
                if (__scrollBarsWidth != null) {
                    return __scrollBarsWidth;
                }
                var document = Aria.$window.document;
                var o = document.createElement("div"); // outer div
                var i = document.createElement("div"); // inner div
                o.style.overflow = "";
                o.style.position = "absolute";
                o.style.left = "-10000px";
                o.style.top = "-10000px";
                o.style.width = "500px";
                o.style.height = "500px";
                // Old solution with width 100% seems to behave correctly
                // for all browsers except IE7. Some research gives that
                // just for IE7 this method does not work when setting width 100%,
                // but works correctly setting no width
                if (!ariaCoreBrowser.isIE7) {
                    i.style.width = "100%";
                }
                i.style.height = "100%";
                document.body.appendChild(o);
                o.appendChild(i);
                __scrollBarsWidth = i.offsetWidth;
                o.style.overflow = "scroll";
                __scrollBarsWidth -= i.offsetWidth;
                document.body.removeChild(o);
                return __scrollBarsWidth;
            },

            /**
             * Returns the width of scrollbars in pixels. It uses the measured value returned by
             * getScrollbarsMeasuredWidth if it is greater than zero, and a hard-coded value of 17px otherwise.<br>
             * The need for a hard-coded value comes from Mac OS for which scrollbars cannot be measured with the
             * getScrollbarsMeasuredWidth method, because they reserve no space. They are hidden by default, but they
             * are displayed when scrolling, in which case they can hide some content, if they were not taken into
             * account in the layout.
             * @return {Number}
             */
            getScrollbarsWidth : function () {
                var value = this.getScrollbarsMeasuredWidth();
                return value > 0 ? value : 17;
            }
        }
    });

})();
