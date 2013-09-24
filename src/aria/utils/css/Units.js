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

    Aria.classDefinition({
        $classpath : "aria.utils.css.Units",
        $dependencies : ["aria.utils.String", "aria.utils.css.PropertiesConfig"],
        $singleton : true,
        $statics : {
            __convertFromPixels : {
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

            __convertToPixels : {
                "%" : function (value, elem, property) {
                    return round(this.__percentage2Px(value, elem, property));
                },
                "em" : function (value, elem, property) {
                    return round(this.__em2Px(value, elem, property));
                },
                "ex" : function (value, elem, property) {
                    return round(0.5 * this.__em2Px(value, elem, property));
                },
                "in" : function (value, elem, property) {
                    return round(this.__inches2Px(value, property));
                },
                "cm" : function (value, elem, property) {
                    return round(this.__inches2Px(value, property) / 2.54);
                },
                "mm" : function (value, elem, property) {
                    return round(this.__inches2Px(value, property) / 25.4);
                },
                "pt" : function (value, elem, property) {
                    return round(this.__inches2Px(value, property) / 72);
                },
                "px" : function (value, elem, property) {
                    return value;
                },
                "pc" : function (value, elem, property) {
                    // 1pc = 12pt
                    return round(this.__inches2Px(value, property) / 6);
                }
            },

            __getDpi : function (property) {
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
                return dpi;
            },

            __px2Inches : function (value, property) {
                return value / this.__getDpi(property);
            },

            __inches2Px : function (value, property) {
                return value * this.__getDpi(property);
            },

            __px2Em : function (value, elem, property) {
                var el = (property == "fontSize") ? elem.parentNode : elem;
                var fontSize = this.__getFontSizeInPixels(elem);
                return value / fontSize;
            },

            __em2Px : function (value, elem, property) {
                var el = (property == "fontSize") ? elem.parentNode : elem;
                var fontSize = this.__getFontSizeInPixels(elem);
                return value * fontSize;
            },

            __px2Percentage : function (value, elem, property) {
                var el = elem.parentNode, refer;
                // computes the height or width of the container
                refer = parseFloat(this.getDomWidthOrHeightForOldIE(el, (this.cfg.PROPERTIES[property].orientation == this.cfg.HORIZONTAL)
                        ? "width"
                        : "height"));
                return value / refer * 100;
            },

            __percentage2Px : function (value, elem, property) {
                var el = elem.parentNode, refer;
                // computes the height or width of the container
                refer = parseFloat(this.getDomWidthOrHeightForOldIE(el, (this.cfg.PROPERTIES[property].orientation == this.cfg.HORIZONTAL)
                        ? "width"
                        : "height"));
                return value * refer * 100;
            }

        },
        $constructor : function () {

            this.cfg = aria.utils.css.PropertiesConfig;

            // detect dpi
            var domElement = Aria.$window.document.createElement("div");
            domElement.style.cssText = "height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;";
            domElement.id = "dpiDetectionTest";
            Aria.$window.document.body.appendChild(domElement);
            this.dpi = {
                x : Aria.$window.document.getElementById('dpiDetectionTest').offsetWidth,
                y : Aria.$window.document.getElementById('dpiDetectionTest').offsetHeight
            };
            Aria.$window.document.body.removeChild(domElement);
            // end detection dpi

        },
        $prototype : {

            /**
             * Converts the value of a given CSS property of a given HTML element from any CSS units into pixels
             * @param {String} valueWithUnit valid CSS value with unit e.g. "12pt", "1em", "10px"
             * @param {HTMLElement} elem Needed if <code>valueWithUnit</code> is in "em" or "%", can be null
             * otherwise.
             * @param {String} property camelCased CSS property name
             * @return {Number} value in pixels
             */
            convertToPixels : function (valueWithUnit, elem, property) {
                var unit = this.getUnit(valueWithUnit, property);
                var value = parseFloat(valueWithUnit, 10);
                return this.__convertToPixels[unit].call(this, value, elem, property);
            },

            /**
             * Converts the value of a given CSS property of a given HTML element from pixels into chosen CSS unit.
             * @param {String} newUnit e.g. "pt", "em"
             * @param {Number} valueInPixels
             * @param {HTMLElement} elem Needed if <code>newUnit</code> is in "em" or "%", can be null otherwise.
             * @param {String} property camelCased CSS property name
             * @return {Number} value in units provided via <code>newUnit</code>
             */
            convertFromPixels : function (newUnit, valueInPixels, elem, property) {
                return this.__convertFromPixels[newUnit].call(this, valueInPixels, elem, property);
            },

            /**
             * Helper function needed for IE to calculate border size in pixels, since <code>element.currentStyle</code>
             * may return non-numeric or non-pixel values for borders.
             * @param {HTMLElement} element The DOM element on which to retrieve a CSS property
             * @param {String} which either "Left", "Right", "Top" or "Bottom" (case is important)
             * @return {Number} border width in pixels
             */
            __getBorderWidth : function (element, which) {
                var style = element.currentStyle;
                var isIE7 = aria.core.Browser.isIE7;
                var propName = "border" + which + "Width";

                var hasBorder = (style["border" + which + "Style"] != "none");
                if (!hasBorder) {
                    return 0;
                }

                var border = style[propName];
                if (border == "thin") {
                    border = isIE7 ? 2 : 1;
                } else if (border == "medium") {
                    border = isIE7 ? 4 : 3;
                } else if (border == "thick") {
                    border = isIE7 ? 6 : 5;
                }

                // if unitless, will be treated as pixels
                return this.convertToPixels(String(border), element, propName);
            },

            /**
             * Helper function needed for IE to calculate padding in pixels, since <code>element.currentStyle</code>
             * may return non-pixel value.
             * @param {HTMLElement} element The DOM element on which to retrieve a CSS property
             * @param {String} which either "Left", "Right", "Top" or "Bottom" (case is important)
             * @return {Number} padding in pixels
             */
            __getPadding : function (element, which) {
                var cs = element.currentStyle;
                var propName = "padding" + which;
                return this.convertToPixels(cs[propName], element, propName);
            },

            /**
             * Helper function needed for em <-> px computations in IE.
             * @param {HTMLElement} element The DOM element on which to retrieve font-size
             * @return {Number} font-size in pixels
             */
            __getFontSizeInPixels : function (element) {
                // In IE we may get non-pixel value, need to convert it. Special case for input in em's to avoid
                // infinite recursion.
                var property = "fontSize";
                var sizeWithUnit = this.__getStyleSimplified(element, property);
                var inEms = sizeWithUnit.match("(.*)em$");
                if (inEms) {
                    // if font-size is in ems, then multiply by 16 to convert to pixels
                    return parseFloat(inEms[1]) * 16;
                }
                return this.convertToPixels(sizeWithUnit, element, property);
            },

            /**
             * Retrieve the computed style for a given CSS property ("width" or "height") on a given DOM element. This
             * part of a aria.utils.Dom.getStyle function was moved here to avoid circular dependencies.
             * @param {HTMLElement} element The DOM element on which to retrieve a CSS property
             * @param {String} property The CSS property to retrieve
             * @see aria.utils.Dom.getStyle
             */
            getDomWidthOrHeightForOldIE : function (element, property) {
                // In IE, element.currentStyle.width might be empty; element.offsetWidth is not;
                // moreover, if maxWidth is present and lower than width, we would get the incorrect value.
                // Same applies to height.
                // Sadly, if borders or paddings were given in other units than pixels, IE returns unchanged values
                // in contrary to W3C browsers which normalize that to pixels in getComputedStyle. However,
                // `offsetWidth` is always unit-less, which means pixels.

                var cs = element.currentStyle;
                var left = "Left", right = "Right", top = "Top", bottom = "Bottom";
                if (property == "width") {
                    var padLeft = this.__getPadding(element, left);
                    var padRight = this.__getPadding(element, right);
                    var borderLeft = this.__getBorderWidth(element, left);
                    var borderRight = this.__getBorderWidth(element, right);
                    return (element.offsetWidth - padLeft - padRight - borderLeft - borderRight) + "px";
                } else if (property == "height") {
                    var padTop = this.__getPadding(element, top);
                    var padBottom = this.__getPadding(element, bottom);
                    var borderTop = this.__getBorderWidth(element, top);
                    var borderBottom = this.__getBorderWidth(element, bottom);
                    return (element.offsetHeight - padTop - padBottom - borderTop - borderBottom) + "px";
                }
            },

            /**
             * Function created to not have circular dependency on aria.utils.Dom. To be used to retrieve the style for
             * properties which do not need any special treatment.
             */
            __getStyleSimplified : function (element, property) {
                var browser = aria.core.Browser;
                var isIE8orLess = browser.isIE8 || browser.isIE7 || browser.isIE6;
                if (isIE8orLess) {
                    return element.currentStyle[property] || element.style[property];
                } else {
                    return Aria.$window.getComputedStyle(element, "")[property] || element.style[property];
                }
            },

            /**
             * Helper method to extract CSS unit type information, given a property name and a value with units.
             * @param {String} value valid CSS value with unit e.g. "10px", "1em", or unit-less.
             * @param {String} prop CSS propery name (camelCased)
             * @return {String|null} unit e.g. "px", "em", "pt"; null for unit-less property names; defaults to "px" if
             * input value is without a unit (for property names for which this makes sense)
             */
            getUnit : function (value, prop) {
                // ""+value to accept numbers and not throw an exception, just in case
                // /(em|%|px|ex|cm|mm|in|pt|pc)$/
                var unitRegExp = new RegExp("(" + this.cfg.UNITS.join("|") + ")$");
                var unit = aria.utils.String.trim("" + value).toLowerCase().match(unitRegExp);
                if (prop == "opacity" || prop == "scrollTop" || prop == "scrollLeft") {
                    return null;
                } else
                    return unit ? unit[0] : "px";
            }

        }
    });
})();
