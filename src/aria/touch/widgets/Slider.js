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
    $classpath : "aria.touch.widgets.Slider",
    $extends : "aria.widgetLibs.BaseWidget",
    $css : ["aria.touch.widgets.SliderCSS"],
    $statics : {
        INVALID_CONFIGURATION : "Invalid configuration for the slider!"
    },
    $dependencies : ["aria.touch.widgets.SliderCfgBeans", "aria.utils.Dom", "aria.utils.Mouse"],
    /**
     * Slider Constructor.
     * @param {aria.touch.widgets.SliderCfgBeans:SliderCfg} cfg slider configuration
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$BaseWidget.constructor.apply(this, arguments);

        this._cfgOk = aria.core.JsonValidator.validateCfg("aria.touch.widgets.SliderCfgBeans.SliderCfg", cfg);
        if (!this._cfgOk) {
            return;
        }

        /**
         * Value of the widget (must be between 0 and 1)
         * @type Number
         * @protected
         */
        this._value = 0;

        this._readValue();
        /**
         * Id generated for the button DOM element of the slider.
         * @type String
         * @protected
         */
        this._domId = cfg.id ? context.$getId(cfg.id) : this._createDynamicId();
        /**
         * Id generated for the slider container element.
         * @type String
         * @protected
         */
        this._parentDomId = this._domId + "_parent";
        /**
         * Id generated for the slider switch on container element.
         * @type String
         * @protected
         */
        this._onSwitchId = this._domId + "_on";
        /**
         * Id generated for the slider switch off container element.
         * @type String
         * @protected
         */
        this._offSwitchId = this._domId + "_off";
        /**
         * Flag used for switching between switch and slider.
         * @type Boolean
         * @protected
         */
        this._isSwitch = cfg.toggleSwitch;
        /**
         * Reference to the on state DOM element of the slider.
         * @type HTMLElement
         * @protected
         */
        this._onContainer = null;
        /**
         * Reference to the off state DOM element of the slider.
         * @type HTMLElement
         * @protected
         */
        this._offContainer = null;

        /**
         * Reference to the button DOM element of the slider.
         * @type HTMLElement
         * @protected
         */
        this._slider = null;
        /**
         * Reference to the Container DOM element of the slider.
         * @type HTMLElement
         * @protected
         */
        this._sliderContainer = null;
        /**
         * Reference to the Width of the Thumb.
         * @type HTMLElement
         * @protected
         */
        this._sliderWidth = null;
        /**
         * Reference to the Dimension of the Slider.
         * @type {aria.utils.DomBeans:Geometry}
         * @protected
         */
        this._sliderDimension = null;

        /**
         * Width of the rail in which thumb travels.
         * @type {Number
         * @protected
         */
        this._railWidth = null;

        /**
         * Value of the page/clientX property of the touch event when the user started moving the slider. It is then
         * updated so that it is always the position of the touch for which there is no change of the position of the
         * slider.
         * @type Number
         * @protected
         */
        this._savedX = null;
        /**
         * Initial position of the element being dragged
         * @type {Number}
         * @protected
         */
        this._initialDrag = null;

        var binding = this._cfg.bindValue ? this._cfg.bindValue : null;
        this._binding = binding;
        if (binding) {
            this._bindingCallback = {
                fn : this._notifyDataChange,
                scope : this
            };
            aria.utils.Json.addListener(binding.inside, binding.to, this._bindingCallback, false);
        }
        /**
         * Drag instances associated to the thumb
         * @type {String} of aria.utils.dragdrop.Drag
         */
        this._draggable = null;
    },
    $destructor : function () {
        if (this._bindingCallback) {
            var binding = this._cfg.bindValue;
            aria.utils.Json.removeListener(binding.inside, binding.to, this._bindingCallback, false);
            this._bindingCallback = null;
        }

        if (this._draggable) {
            this._draggable.$dispose();
            this._draggable = null;
        }
        this._dragUtil = null;
        this._slider = null;
        this._sliderContainer = null;
        this._onContainer = null;
        this._offContainer = null;
        this._sliderDimension = null;
        this.$BaseWidget.$destructor.call(this);
    },
    $prototype : {
        /**
         * Return the configured id of the widget, this is used by the section to register the widget's behavior
         * @return {String}
         */
        getId : function () {
            return this._cfg.id;
        },

        /**
         * Return the DOM element of the widget
         * @return {HTMLElement}
         */
        getDom : function () {
            return this._sliderContainer;
        },

        /**
         * Main widget entry-point, called by the widget library. Write the markup of the slider.
         * @param {aria.templates.MarkupWriter} out
         * @public
         */
        writeMarkup : function (out) {
            if (!this._cfgOk) {
                // configuration was incorrect, do not generate any markup in this case
                this.initWidget = Aria.empty;
                return out.write(this.INVALID_CONFIGURATION);
            }
            out.write([
                    // Div containing the widget
                    '<div class="touchLibSlider" style="width:', this._cfg.width, 'px;">',
                    // Rail, thumbs move over here
                    '<span class="touchContainer" style="width:', this._cfg.width, 'px;" id="', this._parentDomId,
                    '">',
                    // slider thumb
                    '<span id="', this._domId, '" class="sliderButton" style="left:0px;"></span>'].join(""));
            if (this._isSwitch) {
                out.write([
                        // For ON state Markup
                        '<div style="left:0px;width: ', this._cfg.width, 'px;" class="touchLibSwitchOn" id="',
                        this._onSwitchId, '">ON</div>',
                        // For OFF state Markup
                        '<div style="left:0px;width:0px;" class="touchLibSwitchOff" id="', this._offSwitchId,
                        '">OFF</div>'].join(""));
            }
            out.write('</span></div>');
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM. This method calls
         * _updateDisplay if the value has changed between the time the widget is created and the time its markup is
         * inserted in the DOM.
         */
        initWidget : function () {
            this._readValue();
            var domUtils = aria.utils.Dom;

            this._slider = domUtils.getElementById(this._domId);
            this._sliderContainer = domUtils.getElementById(this._parentDomId);
            this._sliderDimension = aria.utils.Dom.getGeometry(this._sliderContainer);
            this._sliderWidth = parseInt(domUtils.getStyle(this._slider, "width"), 10);
            this._sliderWidth += parseInt(aria.utils.Dom.getStyle(this._slider, "borderLeftWidth"), 10) || 0;
            this._sliderWidth += parseInt(aria.utils.Dom.getStyle(this._slider, "borderRightWidth"), 10) || 0;
            this._railWidth = this._cfg.width - this._sliderWidth;
            if (this._isSwitch) {
                this._onContainer = domUtils.getElementById(this._onSwitchId);
                this._offContainer = domUtils.getElementById(this._offSwitchId);
                this._updateSwitch();
            }
            this._setLeftPosition();
            this._updateDisplay();
            this._loadAndCreateDraggable();
        },

        /**
         * Set the position of the button in pixels
         * @param {Number} newLeftPosition new position
         * @protected
         */
        _setLeftPosition : function () {
            var value = this._value;
            this._savedX = Math.floor(value * this._railWidth);
        },

        _updateSwitch : function () {
            var val = this._value;
            if (val >= 0.5) {
                this._onContainer.style.width = this._cfg.width + "px";
                this._onContainer.style.left = "0px";
                this._offContainer.style.width = "0px";
                this._value = 1;
            } else {
                this._offContainer.style.width = this._cfg.width + "px";
                this._offContainer.style.left = "0px";
                this._onContainer.style.width = "0px";
                this._value = 0;
            }
        },

        /**
         * Load the dependency for Drag before if not loaded yet.
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
            if (!this._cfg) {
                // In case the widget gets disposed while loading the dependencies
                return;
            }
            this._draggable = new aria.utils.dragdrop.Drag(this._slider, {
                handle : this._slider,
                proxy : null,
                axis : "x",
                constrainTo : this._sliderContainer
            });
            this._dragUtil = aria.utils.Mouse;
            this._draggable.$on({
                "dragstart" : {
                    fn : this._onDragStart,
                    scope : this
                },
                "move" : {
                    fn : this._onDragMove,
                    scope : this
                },
                "dragend" : {
                    fn : this._onDragEnd,
                    scope : this
                }
            });

            // Listen to either mouse or touch
            if (this._cfg.tapToMove) {
                this._dragUtil.$on({
                    "eventUp" : this._handleTapOnSlider,
                    scope : this
                });
            }

        },
        /**
         * Handle the beginning of a drag
         * @protected
         * @param {aria.DomEvent} evt
         */
        _onDragStart : function (evt) {
            this._initialDrag = evt.src.posX;
        },

        /**
         * Handle the move during a drag by setting the correct position of the thumb element
         * @protected
         * @param {aria.DomEvent} evt
         */
        _onDragMove : function (evt) {
            this._move(evt.src);
        },

        /**
         * Handle the mouse up or touch end during drag end by setting the correct position of the thumb element
         * @protected
         * @param {aria.DomEvent} evt
         */
        _onDragEnd : function (evt) {
            this._move(evt.src);
            this._initialDrag = null;
            if (this._isSwitch) {
                this._changeSwith();
            }
        },
        /**
         * Handle the switch on and off state after drag ends.
         * @protected
         */
        _changeSwith : function () {
            this._updateSwitch();
            this._bindVal();
            this._setLeftPosition();
            this._updateDisplay();
        },
        /**
         * Explicitly bind the value incase of swich
         * @protected
         */
        _bindVal : function () {
            var binding = this._binding;
            if (!binding) {
                return;
            }
            aria.utils.Json.setValue(binding.inside, binding.to, this._value, this._bindingCallback);
        },

        /**
         * Move a source element
         * @param {Object} src Source of the drag gesture
         */
        _move : function (src) {
            var diff = src.posX - this._initialDrag;
            this._savedX += diff;
            this._initialDrag = src.posX;
            this._setValue();
            if (this._isSwitch) {
                this._switchDisplay();
            }
        },
        /**
         * Move the On and Off state elements
         * @protected
         */
        _switchDisplay : function () {
            var dragVal = this._slider.offsetLeft;
            this._onContainer.style.width = (this._sliderWidth + dragVal) + "px";
            this._offContainer.style.left = dragVal + "px";
            this._offContainer.style.width = (this._cfg.width - dragVal) + "px";
        },

        /**
         * Set the value of the slider in the data model.
         * @param {Number} newValue new value
         * @protected
         */
        _setValue : function () {
            var pos = this._savedX, newValue = Math.max(pos / this._railWidth, 0);
            if (newValue !== this._value) {
                this._value = newValue;
                var binding = this._binding;
                if (binding) {
                    aria.utils.Json.setValue(binding.inside, binding.to, newValue);
                }
            } else {
                this._notifyDataChange();
            }
            return;
        },

        /**
         * Read the bound value in the data model, ensure it is defined, between 0 and 1, and assign the _value
         * property.
         * @protected
         */
        _readValue : function () {
            var value;
            var binding = this._binding;
            if (!binding) {
                return;
            }

            value = binding.inside[binding.to];
            if (value == null) {
                value = 0;
            }
            if (value < 0) {
                value = 0;
            }
            if (value > 1) {
                value = 1;
            }
            this._value = value;
            aria.utils.Json.setValue(binding.inside, binding.to, this._value, this._bindingCallback);

        },

        /**
         * Internal method called when the value in the data model changed (this method was registered with addListener
         * in the constructor of the slider).
         * @protected
         */
        _notifyDataChange : function () {
            this._readValue();
            this._setLeftPosition();
            this._updateDisplay();
            if (this._isSwitch) {
                this._switchDisplay();
            }
        },

        /**
         * Uses this._leftPosition to update the actual display of the slider.
         * @protected
         */
        _updateDisplay : function () {
            if (this._slider) {
                this._slider.style.left = this._savedX + "px";
            }
        },
        /**
         * Use to Handle the tap or mouseup event to set the slider's position
         * @param {Object} evt
         */
        _handleTapOnSlider : function (evt) {
            var target = (evt.originalEvent.target) ? evt.originalEvent.target : evt.originalEvent.srcElement;
            if (target.id === this._parentDomId || target.id === this._onSwitchId || target.id === this._offSwitchId) {
                this._setHandlePos(evt.posX);
            }
        },
        /**
         * To set the position of the slider thumb after tab or mouseup
         * @param {Integer} xPos the position of the event
         */
        _setHandlePos : function (xPos) {
            this._savedX = xPos - this._sliderDimension.x;
            this._savedX = (this._savedX > this._railWidth) ? this._railWidth : this._savedX;
            this._value = Math.max(this._savedX / this._railWidth, 0);
            if (this._isSwitch) {
                this._updateSwitch();
            }
            this._bindVal();
            this._setLeftPosition();
            this._updateDisplay();
        }

    }
});
