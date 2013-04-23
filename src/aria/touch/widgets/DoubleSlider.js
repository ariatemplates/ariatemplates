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
 * Touch Slider Widget.
 */
Aria.classDefinition({
    $classpath : 'aria.touch.widgets.DoubleSlider',
    $extends : 'aria.widgetLibs.BaseWidget',
    $css : ['aria.touch.widgets.DoubleSliderCSS'],
    $statics : {
        INVALID_CONFIGURATION : "Invalid configuration for the slider!",
        BUTTON_WIDTH : 15,
        BORDER_WIDTH : 2
    },
    $dependencies : ['aria.touch.widgets.SliderCfgBeans', 'aria.touch.DoubleSwipe'],
    /**
     * Slider Constructor.
     * @param {aria.touch.widgets.SliderCfgBeans.SliderCfg} cfg slider configuration
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$BaseWidget.constructor.apply(this, arguments);
        var normalizeArg = {
            beanName : "aria.touch.widgets.SliderCfgBeans.DoubleSliderCfg",
            json : this._cfg
        };
        try {
            this._cfgOk = aria.core.JsonValidator.normalize(normalizeArg, true);
        } catch (e) {
            this.$logError(this.INVALID_CONFIGURATION, null, e);
        }
        if (!this._cfgOk) {
            return;
        }
        /**
         * Maximum left position for the first thumb in pixels.
         * @type Number
         * @protected
         */
        this._maxLeftPositionFirst = this._cfg.width - (this.BUTTON_WIDTH * 2);
        /**
         * Maximum left position for the second thumb in pixels.
         * @type Number
         * @protected
         */
        this._maxLeftPositionSecond = this._cfg.width - (this.BUTTON_WIDTH);
        /**
         * Minimum left position for the first thumb in pixels.
         * @type Number
         * @protected
         */
        this._minLeftFirst = this.BORDER_WIDTH;
        /**
         * Minimum left position for the second thumb in pixels.
         * @type Number
         * @protected
         */
        this._minLeftSecond = this.BORDER_WIDTH + this.BUTTON_WIDTH;
        if (this._maxLeftPositionFirst < (this.BORDER_WIDTH + this.BUTTON_WIDTH)) {
            this._maxLeftPositionFirst = (this.BORDER_WIDTH + this.BUTTON_WIDTH);
        }
        if (this._maxLeftPositionSecond < (this.BORDER_WIDTH + this.BUTTON_WIDTH) * 2) {
            this._maxLeftPositionSecond = (this.BORDER_WIDTH + this.BUTTON_WIDTH) * 2;
        }

        var binding = this._cfg.bindValue;
        if (binding) {
            this._bindingCallback = {
                fn : this._notifyDataChange,
                scope : this
            };
            aria.utils.Json.addListener(binding.inside, binding.to, this._bindingCallback, false);
        }
        /**
         * Value of the widget (must be between 0 and 1)
         * @type Number
         * @protected
         */
        this._value = null;
        /**
         * To check value changed by touch or bind
         * @type String
         * @protected
         */
        this._type = "";
        this._readValue();

        /**
         * Distance in pixels between the first thumb form the slider
         * @type Number
         * @protected
         */
        this._leftPositionFirst = null;
        /**
         * Distance in pixels between the second thumb form the slider
         * @type Number
         * @protected
         */
        this._leftPositionSecond = null;

        var offSet = 0;
        for (var i = 0; i < this._value.length; i++) {
            if (i === 1) {
                offSet = this.BORDER_WIDTH + this.BUTTON_WIDTH;
                this._setLeftPosition((this._value[i] * this._maxLeftPositionSecond) + offSet, i);
            } else {
                offSet = this.BORDER_WIDTH;
                this._setLeftPosition((this._value[i] * this._maxLeftPositionFirst) + offSet, i);
            }
        }

        /**
         * Id generated for the DOM element of the slider.
         * @type String
         * @protected
         */
        this._parentDomId = this._createDynamicId();
        /**
         * Id generated for the first thumb DOM element of the slider.
         * @type String
         * @protected
         */
        this._domId = this._createDynamicId();
        /**
         * Id generated for the second thumb DOM element of the slider.
         * @type String
         * @protected
         */
        this._secondaryDomId = this._createDynamicId();

        this._sliderCls = 'sliderButton';
        /**
         * Reference to the button DOM element of the slider. It is only defined after the value of the slider is
         * changed through bindings or if the user interacts with the slider (see the _updateDisplay method).
         * @type String
         * @protected
         */
        this._domElt = null;

        /**
         * Value of the first thumb page/clientX property of the touch event when the user started moving the slider. It
         * is then updated so that it is always the position of the touch for which there is no change of the position
         * of the slider.
         * @type Number
         * @protected
         */
        this._savedX1 = null;
        /**
         * Value of the second thumb page/clientX property of the touch event when the user started moving the slider.
         * It is then updated so that it is always the position of the touch for which there is no change of the
         * position of the slider.
         * @type Number
         * @protected
         */
        this._savedX2 = null;

        /**
         * True if the value has changed between the time the widget is created and the time its markup is inserted in
         * the DOM.
         * @type Boolean
         * @protected
         */
        this._needUpdate = false;
        /**
         * Dom Reference for the first thumb of the slider
         * @type Object
         * @protected
         */
        this._firstSlider = null;
        /**
         * Dom Reference for the second thumb of the slider
         * @type Object
         * @protected
         */
        this._secondSlider = null;

        var ariaWindow = aria.utils.AriaWindow;
        ariaWindow.$on({
            "attachWindow" : this._attachBodyEvents,
            "detachWindow" : this._detachBodyEvents,
            scope : this
        });
        if (ariaWindow.isWindowUsed) {
            this._attachBodyEvents();
        }
    },
    $destructor : function () {
        this._detachBodyEvents();
        if (this._bindingCallback) {
            var binding = this._cfg.bindValue;
            aria.utils.Json.removeListener(binding.inside, binding.to, this._bindingCallback, false);
            this._bindingCallback = null;
        }
        this._domElt = null;
        this._cfgOk = null;
        this._maxLeftPosition = null;
        this._cfg = null;
        this._value = null;
        this._leftPosition = null;
        this._domId = null;
        this._savedX = null;
        this._needUpdate = null;
        this.$BaseWidget.$destructor.call(this);
    },
    $prototype : {
        /**
         * Main widget entry-point, called by the widget library. Write the markup of the slider.
         * @param {aria.templates.MarkupWriter} out
         * @public
         */
        writeMarkup : function (out) {
            if (!this._cfgOk) {
                // configuration was incorrect, do not generate any markup in this case
                return;
            }
            out.write(['<div class="touchLibSlider" style="width:', this._maxLeftPositionSecond + this.BUTTON_WIDTH,
                    'px;" >'].join(""));
            out.write(['<span class="touchContainer" style="width:', this._maxLeftPositionSecond + this.BUTTON_WIDTH,
                    'px;" id="', this._parentDomId, '"></span>'].join(""));
            var dualSlideClass = "";
            dualSlideClass = " secondPoint";
            out.write(['<span id="', this._secondaryDomId, '" class="', this._sliderCls, dualSlideClass,
                    '" style="left:', this._leftPositionSecond, 'px;">&nbsp;</span>'].join(""));
            dualSlideClass = " firstPoint";

            out.write(['<span id="', this._domId, '" class="', this._sliderCls, dualSlideClass, '" style="left:',
                    this._leftPositionFirst, 'px;">&nbsp;</span>'].join(""));
            out.write(['<span class="sliderHighLight" id="', this._parentDomId + "_hightlight", '"></span>'].join(""));
            out.write(['</div>'].join(""));
        },

        /**
         * Listen for swipestart and swipecancel.
         * @protected
         */
        _attachBodyEvents : function () {
            aria.touch.DoubleSwipe.$on({
                doubleswipestart : {
                    fn : this._dom_onswipestart,
                    scope : this
                },
                doubleswipecancel : {
                    fn : this._dom_onswipecancel,
                    scope : this
                },
                beforedoubleswipe : {
                    fn : this._dom_onbeforeswipestart,
                    scope : this
                }
            });
        },

        /**
         * Unregister all listeners for the swipe gesture.
         * @protected
         */
        _detachBodyEvents : function () {
            aria.touch.DoubleSwipe.$unregisterListeners(this);
        },
        /**
         * Used when the user first taps on the range of the slider.
         * @param {Object} evt beforedoubleswipe event
         * @protected
         */
        _dom_onbeforeswipestart : function (evt) {
            var target = (evt.originalEvent.target) ? evt.originalEvent.target : evt.originalEvent.srcElement;
            if (target.id === this._parentDomId) {
                this._sliderDimension = aria.utils.Dom.getClientGeometry(target);
                var positionX, elementHandle1PosX, elementHandle2PosX;
                positionX = evt.coordinates[0].x;
                elementHandle1PosX = aria.utils.Dom.getClientGeometry(this._firstSlider).x;
                elementHandle2PosX = aria.utils.Dom.getClientGeometry(this._secondSlider).x;

                if (positionX < this._sliderDimension.x
                        || positionX > (this._sliderDimension.x + this._sliderDimension.width)) {
                    return;
                }
                this._setHandlePosition(positionX, elementHandle1PosX, elementHandle2PosX);

            } else {
                aria.touch.DoubleSwipe.$on({
                    doubleswipemove : {
                        fn : this._dom_onswipemove,
                        scope : this
                    },
                    doubleswipeend : {
                        fn : this._dom_onswipeend,
                        scope : this
                    }
                });
                // To set the initial coordinate position
                this._savedX1 = evt.coordinates[0].x;
            }

        },
        /**
         * Used to set the thumb position after user taps on the slider
         * @param {Number} new x positon
         * @param {Number} first thumb x position
         * @param {Number} second thumb x position
         */
        _setHandlePosition : function (xpos, handle1, handle2) {

            var pos, index, borderOffset = 2, pos = xpos - this._sliderDimension.x, offset = this.BUTTON_WIDTH
                    + this.BORDER_WIDTH;
            // Case 1
            if (xpos > handle1 && xpos > handle2) {
                index = 1;
            }
            // Case 2
            if (xpos > (handle1 + offset) && xpos < handle2) {
                if (Math.abs(xpos - handle1 - offset) > Math.abs(xpos - handle2)) {
                    index = (Math.abs(xpos - handle1 - offset) > Math.abs(xpos - handle2)) ? 1 : 0;

                } else {
                    index = 0;
                }
            }
            // Case 3
            if (xpos < handle1 && xpos < handle2) {
                index = 0;
            }
            if (pos) {
                this._setLeftPosition(pos, index);
                this._updateDisplay(index);
                this._setValue(index);
            }
        },

        /**
         * Used when the user first touches the slider button.
         * @param {Object} evt doubleswipestart event
         * @protected
         */
        _dom_onswipestart : function (evt) {
            var target = [];
            for (var k = 0; k < evt.originalEvent.touches.length; k++) {
                var tar = (evt.originalEvent.touches[k].target)
                        ? evt.originalEvent.touches[k].target
                        : evt.originalEvent.touches[k].srcElement;
                target[k] = tar.id || "";
            }
            if ((target[0] === this._firstSlider.id || target[0] === this._secondSlider.id)
                    && (target[1] === this._firstSlider.id || target[1] === this._secondSlider.id)) {
                this._savedX1 = evt.primaryPoint.x;
                this._savedX2 = evt.secondaryPoint.x;
                aria.touch.DoubleSwipe.$on({
                    doubleswipemove : {
                        fn : this._dom_onswipemove,
                        scope : this
                    },
                    doubleswipeend : {
                        fn : this._dom_onswipeend,
                        scope : this
                    }
                });
            }
        },

        /**
         * Used when the user moves their fingers along the slider.
         * @param {Object} evt doubleswipemove event
         * @protected
         */
        _dom_onswipemove : function (evt) {
            var target = [];
            if (evt.originalEvent.touches) {
                for (var k = 0; k < evt.originalEvent.touches.length; k++) {
                    var tar = (evt.originalEvent.touches[k].target)
                            ? evt.originalEvent.touches[k].target
                            : evt.originalEvent.touches[k].srcElement;
                    target[k] = tar.id || "";
                }
                if ((target[0] === this._firstSlider.id || target[0] === this._secondSlider.id)
                        && (target[1] === this._firstSlider.id || target[1] === this._secondSlider.id)) {
                    var diff1 = evt.primaryPoint.x - this._savedX1;
                    this._setLeftPosition(this._leftPositionFirst + diff1, 0);
                    this._updateDisplay(0);
                    this._savedX1 = evt.primaryPoint.x;
                    this._setValue(0);
                    var diff2 = evt.secondaryPoint.x - this._savedX2;
                    this._setLeftPosition(this._leftPositionSecond + diff2, 1);
                    this._updateDisplay(1);
                    this._savedX2 = evt.secondaryPoint.x;
                    this._setValue(1);

                }

            } else {
                target.push((evt.originalEvent.target) ? evt.originalEvent.target : evt.originalEvent.srcElement);
                if (target[0].id === this._firstSlider.id || target[0].id === this._secondSlider.id) {
                    var targetThumb, leftHandle, xPosition = evt.primaryPoint.x, document = Aria.$window.document;
                    target[0].onselectstart = Aria.returnFalse;
                    document.onselectstart = Aria.returnFalse;

                    var diff = xPosition - this._savedX1;
                    if (target[0].id === this._firstSlider.id) {
                        targetThumb = 0, leftHandle = this._leftPositionFirst;
                    } else if (target[0].id === this._secondSlider.id) {
                        targetThumb = 1, leftHandle = this._leftPositionSecond;
                    }
                    if (leftHandle) {
                        this.__setSwipePosition(leftHandle + diff, targetThumb, xPosition);
                    }

                }

            }

        },

        /**
         * Used when the user stops touching the slider.
         * @param {Object} evt doubleswipeend event
         * @protected
         */
        _dom_onswipeend : function (evt) {
            this._dom_onswipecancel();
            var target = [];
            if (evt.originalEvent.touches) {
                for (var k = 0; k < evt.originalEvent.touches.length; k++) {
                    var tar = (evt.originalEvent.touches[k].target)
                            ? evt.originalEvent.touches[k].target
                            : evt.originalEvent.touches[k].srcElement;
                    target[k] = tar.id || "";
                }
                if ((target[0] === this._firstSlider.id || target[0] === this._secondSlider.id)
                        && (target[1] === this._firstSlider.id || target[1] === this._secondSlider.id)) {
                    var diff1 = evt.primaryPoint.x - this._savedX1;
                    this._setLeftPosition(this._leftPositionFirst + diff1, 0);
                    this._updateDisplay(0);
                    this._savedX1 = evt.primaryPoint.x;
                    this._setValue(0);
                    var diff2 = evt.secondaryPoint.x - this._savedX2;
                    this._setLeftPosition(this._leftPositionSecond + diff2, 1);
                    this._updateDisplay(1);
                    this._savedX2 = evt.secondaryPoint.x;
                    this._setValue(1);

                }
            } else {
                target.push((evt.originalEvent.target) ? evt.originalEvent.target : evt.originalEvent.srcElement);
                if (target[0].id === this._firstSlider.id || target[0].id === this._secondSlider.id) {
                    var targetThumb, leftHandle, xPosition = evt.primaryPoint.x, document = Aria.$window.document;
                    target[0].onselectstart = Aria.returnFalse;
                    document.onselectstart = Aria.returnFalse;

                    var diff = xPosition - this._savedX1;
                    if (target[0].id === this._firstSlider.id) {
                        targetThumb = 0, leftHandle = this._leftPositionFirst;
                    } else if (target[0].id === this._secondSlider.id) {
                        targetThumb = 1, leftHandle = this._leftPositionSecond;
                    }
                    if (leftHandle) {
                        this.__setSwipePosition(leftHandle + diff, targetThumb, xPosition);
                    }
                }
            }
        },

        /**
         * Used when the swipe was invalid.
         * @protected
         */
        _dom_onswipecancel : function () {
            this._detachBodyEvents();
            this._attachBodyEvents();
        },
        /**
         * Used when swiped or mousemoved with single handles
         * @param {Number} leftPos new left position
         * @param {Number} index index of the handle
         * @param {Number} eventPos original event x position
         */
        __setSwipePosition : function (leftPos, index, eventPos) {
            this._setLeftPosition(leftPos, index);
            this._updateDisplay(index);
            this._savedX1 = eventPos;
            this._setValue(index);
        },

        /**
         * Set the position of the button in pixels
         * @param {Number} newLeftPosition new position
         * @param {Number} index of the thumb
         * @protected
         */
        _setLeftPosition : function (newLeftPosition, index) {
            var maxLeftpos = 0, minLeftpos, min, max, offSet;
            offSet = this.BUTTON_WIDTH;
            min = this._leftPositionFirst;
            max = this._leftPositionSecond;
            if (index && index > 0) {
                maxLeftpos = this._maxLeftPositionSecond;
                minLeftpos = this._minLeftSecond;
            } else {
                maxLeftpos = this._maxLeftPositionFirst;
                minLeftpos = this._minLeftFirst;

            }
            if (newLeftPosition > maxLeftpos) {
                newLeftPosition = maxLeftpos;
            } else if (newLeftPosition < minLeftpos) {
                newLeftPosition = minLeftpos;
            }
            if (index && index > 0) {
                if ((newLeftPosition) >= (min + offSet)) {
                    this._leftPositionSecond = newLeftPosition;
                }
            } else {
                if ((newLeftPosition + offSet) <= (max)) {
                    this._leftPositionFirst = newLeftPosition;
                }
            }
        },

        /**
         * Set the value of the slider in the data model.
         * @param {Number} newValue new value
         * @protected
         */
        _setValue : function (sliderIndex) {
            var maxLeft = this._maxLeftPositionSecond, minLeft = this._minLeftSecond, tolerance = 2, buttonWidth = this.BUTTON_WIDTH
                    + this.BORDER_WIDTH, thumb2;
            thumb2 = (sliderIndex === 1);
            var left = (sliderIndex === 0) ? this._leftPositionFirst : this._leftPositionSecond;
            if (!thumb2) {
                left += buttonWidth;
            }
            if (left >= maxLeft + tolerance || left >= maxLeft - tolerance) {
                left = maxLeft;
            }
            if (left <= minLeft + tolerance || left <= minLeft - tolerance) {
                left = minLeft;
            }
            var newValue = aria.utils.Json.copy(this._value, false);
            if (left == minLeft) {
                newValue[sliderIndex] = 0;
            } else if (left == maxLeft) {
                newValue[sliderIndex] = 1;
            } else {
                newValue[sliderIndex] = (left - minLeft) / (maxLeft - minLeft);
            }
            if (newValue[sliderIndex] !== this._value[sliderIndex] && newValue[0] <= newValue[1]) {
                this._value = newValue;
                var binding = this._cfg.bindValue;
                if (binding) {
                    this._type = "touch";
                    aria.utils.Json.setValue(binding.inside, binding.to, newValue);
                }
            }
        },

        /**
         * Read the bound value in the data model, ensure it is defined, between 0 and 1, and assign the _value
         * property.
         * @protected
         */
        _readValue : function () {
            var value = this._value;
            var binding = this._cfg.bindValue;
            if (binding) {
                value = binding.inside[binding.to];
            }
            if (this._cfg.dualSlide) {
                if (aria.utils.Type.isArray(value)) {
                    for (var j = 0, len = value.length; j < len; j++) {
                        if (!value[j]) {
                            value[j] = 0;
                        }
                        if (value[j] < 0) {
                            value[j] = 0;
                        }
                        if (value[j] > 1) {
                            value[j] = 1;
                        }
                    }
                } else {
                    value = [0, 0];
                }

            }
            this._value = value;
        },

        /**
         * Internal method called when the value in the data model changed (this method was registered with addListener
         * in the constructor of the slider).
         * @protected
         */
        _notifyDataChange : function () {
            this._readValue();
            var value = this._value;
            if (aria.utils.Type.isArray(value) && this._type !== "touch") {
                var diff = (this._maxLeftPositionSecond - this._minLeftSecond), min = this._minLeftSecond, valuelen = value.length;

                for (var j = (valuelen - 1); j >= 0; j--) {
                    if (value[1] >= value[0]) {
                        var offSet = this.BUTTON_WIDTH, tolerance = 2;
                        var pos = (value[j] * diff) + min;
                        pos = pos.toFixed(0);
                        if (j === 0) {
                            pos = (pos - offSet);
                        }
                        this._setLeftPosition(parseInt(pos, 10), j);
                        this._updateDisplay(j);
                    }
                }

            }
            this._type = "";

        },

        /**
         * Uses this._leftPosition to update the actual display of the slider.
         * @param {Number} second which represents the Number of thumb
         * @protected
         */
        _updateDisplay : function (second) {
            var domElt = (second === 1) ? this._secondSlider : this._firstSlider, leftStyle, offset, hightLightEle, elementHandle1PosX, elementHandle2PosX, leftHightlight, widthHighlight;
            if (!domElt) {
                // This case may happen if the bound value changed between the time the widget is created and the time
                // its markup is inserted in the DOM
                this._needUpdate = true; // mark that it needs update (it will be updated when the widget is inserted
                // in the DOM, see the initWidget method)
                return;
            }
            leftStyle = (second) ? this._leftPositionSecond : this._leftPositionFirst;
            leftStyle += "px";
            if (domElt.style.left != leftStyle) {
                domElt.style.left = leftStyle;
            }
            offset = this.BORDER_WIDTH + this.BUTTON_WIDTH;
            hightLightEle = this.__getDomElement(this._parentDomId + "_hightlight");
            elementHandle1PosX = aria.utils.Dom.getClientGeometry(this._firstSlider).x - this._sliderDimension.x;
            elementHandle2PosX = aria.utils.Dom.getClientGeometry(this._secondSlider).x - this._sliderDimension.x;
            leftHightlight = elementHandle1PosX + offset;
            widthHighlight = (elementHandle2PosX - elementHandle1PosX) - this.BORDER_WIDTH;
            if (leftHightlight && widthHighlight > 0) {
                hightLightEle.style.left = leftHightlight + "px";
                hightLightEle.style.width = widthHighlight + "px";
            }
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM. This method calls
         * _updateDisplay if the value has changed between the time the widget is created and the time its markup is
         * inserted in the DOM.
         * @public
         */
        initWidget : function () {
            this._firstSlider = this.__getDomElement(this._domId);
            this._secondSlider = this.__getDomElement(this._secondaryDomId);
            var slider = this.__getDomElement(this._parentDomId);
            this._sliderDimension = aria.utils.Dom.getClientGeometry(slider);

            if (this._needUpdate) {
                for (var j = 0, len = this._value.length; j < len; j++) {
                    this._updateDisplay(j);
                }

            }
        },

        /**
         * Return the DOM element corresponding to the id passed.
         * @param {String} id of the element
         * @return {HTMLElement}
         * @public
         */

        __getDomElement : function (id) {
            var domEle = aria.utils.Dom.getElementById(id);
            return domEle;
        }
    }
});