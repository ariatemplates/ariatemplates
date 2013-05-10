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
    $dependencies : ["aria.touch.widgets.SliderCfgBeans", "aria.utils.Dom", "aria.utils.Type", "aria.utils.Mouse",
            "aria.utils.Touch", "aria.utils.Device"],
    /**
     * Slider Constructor.
     * @param {aria.touch.widgets.SliderCfgBeans.SliderCfg} cfg slider configuration
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$BaseWidget.constructor.apply(this, arguments);
        try {
            this._cfgOk = aria.core.JsonValidator.validateCfg("aria.touch.widgets.SliderCfgBeans.SliderCfg", cfg);
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
        this._maxLeftFirstHandle = this._cfg.width - ((this.BUTTON_WIDTH + this.BORDER_WIDTH) * 2);
        /**
         * Maximum left position for the second thumb in pixels.
         * @type Number
         * @protected
         */
        this._maxLeftSecondHandle = this._cfg.width - (this.BUTTON_WIDTH + this.BORDER_WIDTH);
        /**
         * Minimum left position for the first thumb in pixels.
         * @type Number
         * @protected
         */
        this._minLeftFirstHandle = 0;
        /**
         * Minimum left position for the second thumb in pixels.
         * @type Number
         * @protected
         */
        this._minLeftSecondHandle = this.BUTTON_WIDTH;

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
        this._readValue();

        /**
         * Distance in pixels between the first thumb form the slider
         * @type Number
         * @protected
         */
        this._leftPosFirstHandle = 0;
        /**
         * Distance in pixels between the second thumb form the slider
         * @type Number
         * @protected
         */
        this._leftPosSecondHandle = 0;
        /**
         * Left Position of the slider widget
         * @type Number
         * @protected
         */
        this._leftPos = 0;
        /**
         * Geometry of the parent slider element
         * @type Number
         * @protected
         */
        this._sliderDimension = null;
        /**
         * Value of the first thumb page/clientX property of the touch/mouse event when the user started moving the
         * slider. It is then updated so that it is always the position of the touch/mouse for which there is no change
         * of the position of the slider.
         * @type Number
         * @protected
         */
        this._savedX1 = 0;
        /**
         * Value of the second thumb page/clientX property of the touch/mouse event when the user started moving the
         * slider. It is then updated so that it is always the position of the touch/mouse for which there is no change
         * of the position of the slider.
         * @type Number
         * @protected
         */
        this._savedX2 = 0;

        var offSet = 0;
        for (var i = (this._value.length - 1); i >= 0; i--) {
            if (i === 1) {
                offSet = this.BUTTON_WIDTH;
                this._setLeftPosition((this._value[i] * this._maxLeftSecondHandle) + offSet, i);

            } else {
                offSet = 0;
                this._setLeftPosition((this._value[i] * this._maxLeftFirstHandle) + offSet, i);

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

        this._handleArray = [];

        this._draggble = [];

        this._dragUtil = (aria.utils.Device.isTouch) ? aria.utils.Touch : aria.utils.Mouse;

    },
    $destructor : function () {

        if (this._bindingCallback) {
            var binding = this._cfg.bindValue;
            aria.utils.Json.removeListener(binding.inside, binding.to, this._bindingCallback, false);
            this._bindingCallback = null;
        }
        for (var i = 0, len = this._handleArray.length; i < len; i++) {

            if (this._draggble[i]) {
                this._draggble[i].$dispose();
                this._draggble[i] = null;
            }
        }
        this._firstSlider = null;
        this._secondSlider = null;
        this._domElt = null;
        this._dragUtil = null;
        this._sliderDimension = null;
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
            out.write(['<div class="touchLibSlider" style="width:', this._maxLeftSecondHandle + this.BUTTON_WIDTH,
                    'px;" >'].join(""));
            out.write(['<span class="touchContainer" style="width:', this._maxLeftSecondHandle + this.BUTTON_WIDTH,
                    'px;" id="', this._parentDomId, '">'].join(""));
            var dualSlideClass = "";
            dualSlideClass = " secondPoint";
            out.write(['<span id="', this._secondaryDomId, '" class="', this._sliderCls, dualSlideClass,
                    '" style="left:', this._savedX2, 'px;">&nbsp;</span>'].join(""));
            dualSlideClass = " firstPoint";

            out.write(['<span id="', this._domId, '" class="', this._sliderCls, dualSlideClass, '" style="left:',
                    this._savedX1, 'px;">&nbsp;</span>'].join(""));
            out.write(['<span class="sliderHighLight" id="', this._parentDomId + "_hightlight", '"></span>'].join(""));
            out.write(['</span></div>'].join(""));
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
            if (aria.utils.Type.isArray(value)) {
                for (var j = 0, len = value.length; j < len; j++) {
                    if (!value[j]) {
                        value[j] = 0;
                    }
                    if (value[j] > 1 || value[j] < 0) {
                        return;
                    }
                }
            } else {
                value = [0, 0];
            }

            this._value = value;
        },
        /**
         * load the dependency for Drag before if not loaded yet.
         * @protected
         */
        _loadAndCreateDraggable : function () {
            if (aria.utils.dragdrop && aria.utils.dragdrop.Drag) {
                this._createSliderDrag();
            } else {
                Aria.load({
                    classes : ["aria.utils.dragdrop.Drag"],
                    oncomplete : {
                        fn : this._createSliderDrag,
                        scope : this
                    }
                });
            }
        },
        /**
         * Create the Draggable element.
         * @protected
         */
        _createSliderDrag : function () {
            for (var i = 0, len = this._handleArray.length; i < len; i++) {
                this._draggble[i] = new aria.utils.dragdrop.Drag(this._handleArray[i], {
                    handle : this._handleArray[i],
                    proxy : null,
                    axis : "x",
                    constrainTo : this._parentDomId
                });
                this._draggble[i].$on({
                    "move" : {
                        fn : this._onDragMove,
                        scope : this
                    },

                    "dragend" : {
                        fn : this._onDragEnd,
                        scope : this
                    }
                });

            }
            // Listen to either mouse or touch
            this._dragUtil.$on({
                "eventUp" : this._handleClickOnSlider,
                scope : this
            });
        },
        /**
         * Handle the mouse move or touch move during a drag by setting the correct position of the thumb element
         * @protected
         * @param {aria.DomEvent} evt
         */
        _onDragMove : function (evt) {
            this._leftPosFirstHandle = aria.utils.Dom.getClientGeometry(this._firstSlider).x;
            this._leftPosSecondHandle = aria.utils.Dom.getClientGeometry(this._secondSlider).x;
            var offSet = this.BUTTON_WIDTH + this.BORDER_WIDTH, index = 0;
            if (evt.src.id === this._firstSlider.id) {
                index = 0;
                if ((this._leftPosFirstHandle + offSet) >= this._leftPosSecondHandle) {
                    this._leftPosFirstHandle = this._leftPosSecondHandle - offSet;
                }
            } else if (evt.src.id === this._secondSlider.id) {
                index = 1;
                if ((this._leftPosSecondHandle - offSet) <= this._leftPosFirstHandle) {
                    this._leftPosSecondHandle = this._leftPosFirstHandle + offSet;
                }
            }
            this._savedX1 = this._leftPosFirstHandle - this._leftPos;
            this._savedX2 = this._leftPosSecondHandle - this._leftPos;
            this._updateDisplay(index);
            this.isDragged = true;
            this._setValue(index);

        },
        /**
         * Handle the mouse up or touch end during drag end by setting the correct position of the thumb element
         * @protected
         * @param {aria.DomEvent} evt
         */
        _onDragEnd : function (evt) {
            this._leftPosFirstHandle = aria.utils.Dom.getClientGeometry(this._firstSlider).x;
            this._leftPosSecondHandle = aria.utils.Dom.getClientGeometry(this._secondSlider).x;
            var index = 0;
            if (evt.src.id === this._firstSlider.id) {
                index = 0;
            } else if (evt.src.id === this._secondSlider.id) {
                index = 1;
            }
            this._savedX1 = this._leftPosFirstHandle - this._leftPos;
            this._savedX2 = this._leftPosSecondHandle - this._leftPos;
            this._updateDisplay(index);
            this.isDragged = true;
            this._setValue(index);
        },
        /**
         * Use to Update the position of the thumbs of the slider depending on the index.
         * @param {Number} Index which represents the thumb to be updated
         * @protected
         */
        _updateDisplay : function (second) {
            var leftStyle, domElt, offSet = this.BUTTON_WIDTH + this.BORDER_WIDTH, index;
            this._leftPos = this._sliderDimension.x + this.BORDER_WIDTH;
            if (second === 1) {
                leftStyle = this._savedX2;
                domElt = this._secondSlider;
                index = 1;
            } else {
                leftStyle = this._savedX1;
                domElt = this._firstSlider;
                index = 0;
            }
            leftStyle += "px";
            if (domElt.style.left != leftStyle) {
                domElt.style.left = leftStyle;
            }
            var hightLightEle = this.__getDomElement(this._parentDomId + "_hightlight"), leftHightlight = this._savedX1
                    + offSet, widthHighlight = (this._savedX2 - this._savedX1) - offSet;
            if (leftHightlight && widthHighlight > 0) {
                hightLightEle.style.left = leftHightlight + "px";
                hightLightEle.style.width = widthHighlight + "px";
            }

        },

        /**
         * Internal method called when the value in the data model changed (this method was registered with addListener
         * in the constructor of the slider).
         * @protected
         */
        _notifyDataChange : function () {
            this._readValue();
            var value = this._value;
            if (aria.utils.Type.isArray(value)) {
                var diff = (this._maxLeftSecondHandle - this._minLeftSecondHandle), min = this._minLeftSecondHandle, valuelen = value.length;

                for (var j = (valuelen - 1); j >= 0; j--) {
                    if (value[1] >= value[0]) {
                        var offSet = this.BUTTON_WIDTH, tolerance = 2;
                        var pos = (value[j] * diff) + min;
                        pos = pos.toFixed(0);
                        if (j === 0) {
                            pos = (pos - offSet);
                        }
                        if (!this.isDragged) {
                            this._setLeftPosition(parseInt(pos, 10), j);
                            this._updateDisplay(j);
                        }

                    }
                }
                this.isDragged = false;
            }
        },

        /**
         * Set the value of the slider in the data model.
         * @param {Number} newValue new value
         * @protected
         */
        _setValue : function (sliderIndex) {
            var maxLeft = this._maxLeftSecondHandle, minLeft = this._minLeftSecondHandle, tolerance = 4, buttonWidth = this.BUTTON_WIDTH
                    + this.BORDER_WIDTH, thumb2;
            thumb2 = (sliderIndex == 1);
            var left = (sliderIndex === 1) ? this._savedX2 : this._savedX1;
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
                    aria.utils.Json.setValue(binding.inside, binding.to, newValue);
                }
            }
        },

        /**
         * Set the position of the button in pixels
         * @param {Number} newLeftPosition new position
         * @param {Number} index of the thumb
         * @protected
         */
        _setLeftPosition : function (newLeftPosition, index) {
            var maxLeftpos = 0, minLeftpos = 0, min, max, offSet;
            newLeftPosition = parseInt(newLeftPosition.toFixed(0), 10);
            offSet = this.BUTTON_WIDTH;
            min = this._savedX1;
            max = this._savedX2;

            if (index && index > 0) {
                maxLeftpos = this._maxLeftSecondHandle;
                minLeftpos = this._minLeftSecondHandle;
            } else {
                maxLeftpos = this._maxLeftFirstHandle;
                minLeftpos = this._minLeftFirstHandle;

            }
            if (newLeftPosition > maxLeftpos) {
                newLeftPosition = maxLeftpos;
            } else if (newLeftPosition < minLeftpos) {
                newLeftPosition = minLeftpos;
            }
            if (index && index > 0) {
                if ((newLeftPosition) >= (min + offSet)) {
                    this._savedX2 = newLeftPosition;
                }
            } else {
                if ((newLeftPosition + offSet) <= (max)) {
                    this._savedX1 = newLeftPosition;
                }
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
            this._handleArray.push(this._firstSlider);
            this._secondSlider = this.__getDomElement(this._secondaryDomId);
            this._handleArray.push(this._secondSlider);
            this._domElt = this.__getDomElement(this._parentDomId);
            this._sliderDimension = aria.utils.Dom.getClientGeometry(this._domElt);
            this._loadAndCreateDraggable();
            for (var j = 0, len = this._value.length; j < len; j++) {
                this._updateDisplay(j);
            }
        },

        /**
         * Return the DOM element corresponding to the id passed.
         * @param {String} id of the element
         * @return {HTMLElement}
         * @private
         */
        __getDomElement : function (id) {
            var domEle = aria.utils.Dom.getElementById(id);
            return domEle;
        },
        /**
         * To Handle the click or tap on widget
         * @param {aria.DomEvent} event
         * @protected
         */
        _handleClickOnSlider : function (evt) {
            var target = (evt.originalEvent.target) ? evt.originalEvent.target : evt.originalEvent.srcElement;
            if (target.id === this._parentDomId || target.id === this._parentDomId + "_hightlight") {
                this._setHandlePos(evt.posX);
            }
        },
        /**
         * Used to set the thumb position after user taps/clicks on the slider
         * @param {Number} new x positon
         * @protected
         */
        _setHandlePos : function (xPos) {
            var pos, index, pos = xPos - this._leftPos, offset = this.BUTTON_WIDTH + this.BORDER_WIDTH, handle1 = this._savedX1, handle2 = this._savedX2;
            // Case 1
            if (pos > handle1 && pos > handle2) {
                index = 1;
            }
            // Case 2
            if (pos > (handle1 + offset) && pos < handle2) {
                if (Math.abs(pos - handle1 - offset) > Math.abs(pos - handle2)) {
                    index = (Math.abs(pos - handle1 - offset) > Math.abs(pos - handle2)) ? 1 : 0;

                } else {
                    index = 0;
                }
            }
            // Case 3
            if (pos < handle1 && pos < handle2) {
                index = 0;
            }
            if (index === 1) {
                pos -= offset;
            }
            if (pos) {
                this._setLeftPosition(pos, index);
                this._updateDisplay(index);
                this._setValue(index);
            }
        }

    }
});