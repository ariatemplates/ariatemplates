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
var Aria = require("../../Aria");
var ariaTouchWidgetsSliderCSS = require("./SliderCSS.tpl.css");
require("./SliderCfgBeans");
var ariaUtilsDom = require("../../utils/Dom");
require("../Tap");
var ariaUtilsHtml = require("../../utils/Html");
var ariaWidgetLibsBaseWidget = require("../../widgetLibs/BaseWidget");
var ariaUtilsJson = require("../../utils/Json");
var ariaCoreJsonValidator = require("../../core/JsonValidator");
var ariaUtilsDragdropDrag = require("../../utils/dragdrop/Drag");

/**
 * Touch Slider Widget.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.touch.widgets.Slider",
    $extends : ariaWidgetLibsBaseWidget,
    $css : [ariaTouchWidgetsSliderCSS],
    $statics : {
        INVALID_CONFIGURATION : "Invalid configuration for the slider!"
    },
    /**
     * Slider Constructor.
     * @param {aria.touch.widgets.SliderCfgBeans:SliderCfg} cfg slider configuration
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$BaseWidget.constructor.apply(this, arguments);

        this._cfgOk = ariaCoreJsonValidator.validateCfg("aria.touch.widgets.SliderCfgBeans.SliderCfg", cfg);
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
         * Id generated for the highlight element.
         * @type String
         * @protected
         */
        this._highlightDomId = this._domId + "_highlight";
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
         * When using the widget as switch, this is the value above which all value are converted to 1
         * @type {Float}
         * @protected
         */
        this._switchThreshold = cfg.switchThreshold != null ? Math.min(1, Math.max(0, cfg.switchThreshold)) : 0.5;

        /**
         * Label for the on side of the switch.
         * @type String
         * @protected
         */
        this._onLabel = cfg.onLabel || "ON";

        /**
         * Label for the off side of the switch.
         * @type String
         * @protected
         */
        this._offLabel = cfg.offLabel || "OFF";

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
         * Reference to the highlight DOM element of the slider.
         * @type HTMLElement
         * @protected
         */
        this._highlight = null;
        /**
         * Reference to the Container DOM element of the slider.
         * @type HTMLElement
         * @protected
         */
        this._sliderContainer = null;
        /**
         * Reference to the Width of the Thumb.
         * @type Number
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

        /**
         * ID used for delegating events
         * @type {String}
         */
        this._delegateId = null;

        var binding = this._cfg.bind ? this._cfg.bind.value : null;
        this._binding = binding;
        if (binding) {
            this._bindingCallback = {
                fn : this._notifyDataChange,
                scope : this,
                args : true
            };
            ariaUtilsJson.addListener(binding.inside, binding.to, this._bindingCallback, false);
        }
        /**
         * Drag instances associated to the thumb
         * @type {String} of aria.utils.dragdrop.Drag
         */
        this._draggable = null;
    },
    $destructor : function () {
        if (this._delegateId) {
            aria.utils.Delegate.remove(this._delegateId);
            this._delegateId = null;
        }

        if (this._bindingCallback) {
            var binding = this._binding;
            ariaUtilsJson.removeListener(binding.inside, binding.to, this._bindingCallback, false);
            this._bindingCallback = null;
        }

        if (this._draggable) {
            this._draggable.$dispose();
            this._draggable = null;
        }
        this._slider = null;
        this._highlight = null;
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

            // Only interested in gestures when there's a particular configuration
            var delegateMarkup = "", cfg = this._cfg;
            if (cfg.tapToMove || (cfg.tapToToggle && this._isSwitch)) {
                this._delegateId = aria.utils.Delegate.add({
                    fn : this.delegate,
                    scope : this
                });
                delegateMarkup = aria.utils.Delegate.getMarkup(this._delegateId);
            }

            cfg.attributes = cfg.attributes || {};
            cfg.attributes.classList = cfg.attributes.classList || [];
            cfg.attributes.classList.push("touchLibSlider");

            out.write([
                    // Div containing the widget
                    '<div ', ariaUtilsHtml.buildAttributeList(cfg.attributes), '" style="width:', this._cfg.width,
                    'px;" ', delegateMarkup, '>',
                    // Rail, thumbs move over here
                    '<span class="touchContainer" style="width:', this._cfg.width, 'px;" id="', this._parentDomId,
                    '">',
                    // slider thumb
                    '<span id="', this._domId, '" class="sliderButton" style="left:0px;"></span>'].join(""));
            if (this._isSwitch) {
                out.write([
                        // For ON state Markup
                        '<div style="left:0px;width:', this._cfg.width, 'px;" class="touchLibSwitchOn" id="',
                        this._onSwitchId, '">', this._onLabel, '</div>',
                        // For OFF state Markup
                        '<div style="left:0px;width:0px;" class="touchLibSwitchOff" id="', this._offSwitchId, '">',
                        this._offLabel, '</div>'].join(""));
            } else {
                out.write(['<span class="sliderHighLight" id="', this._highlightDomId, '"></span>'].join(""));
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
            var domUtils = ariaUtilsDom;

            this._slider = domUtils.getElementById(this._domId);
            this._highlight = domUtils.getElementById(this._highlightDomId);
            this._sliderContainer = domUtils.getElementById(this._parentDomId);
            this._sliderDimension = ariaUtilsDom.getGeometry(this._sliderContainer);
            this._sliderWidth = parseInt(domUtils.getStyle(this._slider, "width"), 10);
            this._sliderWidth += parseInt(ariaUtilsDom.getStyle(this._slider, "borderLeftWidth"), 10) || 0;
            this._sliderWidth += parseInt(ariaUtilsDom.getStyle(this._slider, "borderRightWidth"), 10) || 0;
            this._railWidth = this._cfg.width - this._sliderWidth;
            if (this._isSwitch) {
                this._onContainer = domUtils.getElementById(this._onSwitchId);
                this._offContainer = domUtils.getElementById(this._offSwitchId);
                this._updateSwitch();
            }
            this._setLeftPosition();
            this._updateDisplay();
            this._createSliderDrag();
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

        /**
         * Update the position of the on and off labels
         * @protected
         */
        _updateSwitch : function () {
            var val = this._value;
            if (val >= this._switchThreshold) {
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
            if (val !== this._value) {
                this._storeValue();
            }
        },

        /**
         * Create the Draggable element.
         * @protected
         */
        _createSliderDrag : function () {
            this._draggable = new ariaUtilsDragdropDrag(this._slider, {
                handle : this._slider,
                proxy : null,
                axis : "x",
                constrainTo : this._sliderContainer
            });
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
        },

        /**
         * Handle the beginning of a drag
         * @protected
         * @param {aria.DomEvent} evt
         */
        _onDragStart : function (evt) {
            this._initialDrag = evt.src.posX;
            this._initialSavedX = this._savedX;
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
            this._initialSavedX = null;
            if (this._isSwitch) {
                this._changeSwith();
            }
        },

        /**
         * Handle the switch on and off state after drag ends. This is needed because the end might be somewhere in the
         * middle of the slider, in case of a switch however the value can be either 0 or 1
         * @protected
         */
        _changeSwith : function () {
            this._updateSwitch();
            this._setLeftPosition();
            this._updateDisplay();
            this._storeValue(this._value);
        },

        /**
         * Store the current widget value in the bound location
         * @param {Integer} value Value of the slider
         * @protected
         */
        _storeValue : function () {
            var binding = this._binding;
            if (binding) {
                ariaUtilsJson.setValue(binding.inside, binding.to, this._value, this._bindingCallback);
            }
        },

        /**
         * Move a source element
         * @param {Object} src Source of the drag gesture
         */
        _move : function (src) {
            this._savedX = this._initialSavedX + src.posX - this._initialDrag;
            this._setValue();
            if (this._isSwitch) {
                this._switchDisplay();
            } else {
                this._updateHighlight();
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
                this._storeValue();
            } else {
                this._notifyDataChange();
            }
            return;
        },

        /**
         * Read the bound value in the data model, ensure it is defined, between 0 and 1, and assign the _value
         * property.
         * @param {Boolean} applySwitchMargins Whether or not the value should be set to either 0 or 1 when the widget
         * is used as a switch
         * @protected
         */
        _readValue : function (applySwitchMargins) {
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
            if (this._isSwitch && applySwitchMargins) {
                if (value >= this._switchThreshold) {
                    value = 1;
                } else {
                    value = 0;
                }
            }
            this._value = value;
            this._storeValue();
        },

        /**
         * Internal method called when the value in the data model changed (this method was registered with addListener
         * in the constructor of the slider).
         * @param {Object} change Description of the changed value
         * @param {Boolean} fromDataModel Whether or not the change is coming from the datamodel
         * @protected
         */
        _notifyDataChange : function (change, fromDataModel) {
            this._readValue(fromDataModel);
            this._setLeftPosition();
            this._updateDisplay();
        },

        /**
         * Update the display of the thumb
         * @protected
         */
        _updateDisplay : function () {
            if (this._slider) {
                this._slider.style.left = this._savedX + "px";
                if (this._isSwitch) {
                    this._switchDisplay();
                } else {
                    this._updateHighlight();
                }
            }
        },

        /**
         * Update the width of the highlight between the left side and the thumb.
         * @protected
         */
        _updateHighlight : function () {
            this._highlight.style.width = (this._savedX + this._sliderWidth / 2) + "px";
        },

        /**
         * Handle delegated events
         * @param {HTMLEvent} evt Browser event
         */
        delegate : function (evt) {
            if (evt.type === "tap") {
                var cfg = this._cfg;
                if (!cfg) {
                    // Widget already disposed
                    return true;
                }

                if ((cfg.tapToToggle || cfg.tapToMove) && this._isSwitch) {
                    // With this configuration, on tap we want to toggle the value
                    this._value = this._value >= this._switchThreshold ? 0 : 1;
                } else if (cfg.tapToMove) {
                    this._savedX = evt.detail.currentX - this._sliderDimension.x - this._sliderWidth / 2;
                    this._savedX = (this._savedX > this._railWidth) ? this._railWidth : this._savedX;
                    this._value = Math.max(this._savedX / this._railWidth, 0);
                }
                this._storeValue();
                this._setLeftPosition();
                this._updateDisplay();
            }
        }
    }
});
