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
var ariaWidgetsFormDropDownTrait = require("./DropDownTrait");
var ariaWidgetsFormTextInput = require("./TextInput");
var ariaCoreBrowser = require("../../core/Browser");
var ariaCoreTimer = require("../../core/Timer");
var ariaUtilsDevice = require("../../utils/Device");

/**
 * Base class for all text input widgets that use a drop-down popup
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.DropDownTextInput",
    $extends : ariaWidgetsFormTextInput,
    /**
     * DropDownInput constructor
     * @param {aria.widgets.CfgBeans:DropDownTextInputCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     * @param {aria.widgets.form.Textcontroller} controller the data controller object
     */
    $constructor : function (cfg, ctxt, lineNumber, controller) {
        this.$TextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);
    },
    $destructor : function () {
        this._closeDropdown();
        this._touchFocusSpan = null;
        this.$TextInput.$destructor.call(this);
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "DropDownInput",

        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         */
        $init : function (p) {
            var src = ariaWidgetsFormDropDownTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // import methods from DropDownTrait which are not already on this object (this avoids copying
                    // $classpath and $destructor)
                    p[key] = src[key];
                }
            }
        },

        /**
         * Internal method called when the popup should be either closed or opened depending on the state of the
         * controller and whether it is currently opened or closed. In any case, keep the focus on the field. Called by
         * the widget button for example.
         * @protected
         */
        _toggleDropdown : function () {
            // toggleDropdown should not make the virtual keyboard appear on touch devices
            this._updateFocusNoKeyboard();
            if (!this._hasFocus) {
                this.focus(null, true);
            }

            var report = this.controller.toggleDropdown(this.getTextInputField().value, this._dropdownPopup != null);
            this._reactToControllerReport(report, {
                hasFocus : true
            });

            this.focus(null, true);
        },

        /**
         * Handle key event on keydown or keypress. This function is asynchronous for special keys
         * @protected
         * @param {Object|aria.DomEvent} event object containing keyboard event information (at least charCode and
         * keyCode properties). This object may be or may not be an instance of aria.DomEvent.
         */
        _handleKey : function (event) {
            // PROFILING // var profilingId = this.$startMeasure("handle key " + String.fromCharCode(event.charCode)
            // PROFILING // + " (" + event.charCode + ")");
            if (this.controller) {
                if (!event.ctrlKey && !event.altKey) {
                    // we ignore CTRL+ / ALT+ key presses
                    this._checkKeyStroke(event);
                } else {
                    // alt or ctrl keys are pressed
                    // we check that copy/paste content is correct
                    ariaCoreTimer.addCallback({
                        fn : this._checkKeyStroke,
                        scope : this,
                        args : event,
                        delay : 4
                    });
                }
            }
            // PROFILING // this.$stopMeasure(profilingId);
        },

        /**
         * Handle key event on keydown or keypress. Synchronous function
         * @see _handleKey
         * @protected
         * @param {Object|aria.DomEvent} event object containing keyboard event information (at least charCode and
         * keyCode properties). This object may be or may not be an instance of aria.DomEvent.
         */
        _checkKeyStroke : function (event) {
            var controller = this.controller;
            var cp = this.getCaretPosition();
            if (cp) {
                var report = controller.checkKeyStroke(event.charCode, event.keyCode, this.getTextInputField().value, cp.start, cp.end, event);
                // event may not always be a DomEvent object, that's why we check for the existence of
                // preventDefault on it
                if (report && report.cancelKeyStroke && event.preventDefault) {
                    event.preventDefault(true);
                }
                this._reactToControllerReport(report, {
                    hasFocus : true
                });
            }
        },

        /**
         * Internal method to handle the keydown event on the Text Input
         * @protected
         * @param {aria.DomEvent} event KeyDown event
         */
        _dom_onkeydown : function (event) {
            this.$DropDownTrait._dom_onkeydown.call(this, event);
            if (!event.hasStopPropagation) {
                // PTR 05348117: for the DatePicker (and also the AutoComplete and any text-based widget), it is
                // important to call checkValue to put the data in the data model when pressing ENTER. (That's what is
                // done in $TextInput._dom_onkeydown). Otherwise, the old value of the field may be submitted.
                this.$TextInput._dom_onkeydown.call(this, event);
            }
        },

        /**
         * Internal method to handle the keyup event. It is needed because in some cases the keypress event is not
         * raised
         * @protected
         * @param {aria.DomEvent} event
         */
        _dom_onkeyup : function (event) {
            var browser = ariaCoreBrowser;
            if (browser.isAndroid && browser.isChrome && !event.isSpecialKey && event.keyCode == 229) {
                event.charCode = 0;
                this._handleKey(event);
            }
            this.$TextInput._dom_onkeydown.call(this, event);
        },

        /**
         * Override $TextInput._reactToControllerReport
         * @protected
         * @param {aria.widgets.controllers.reports.DropDownControllerReport} report
         * @param {Object} arg Optional parameters
         */
        _reactToControllerReport : function (report, arg) {
            // a null report means callback was asynchronous
            // PROFILING // var profilingId = this.$startMeasure("react to controller report (DropDownTextInput)");
            if (report) {
                var openDropdown = report.displayDropDown;
                var repositionDropDown = report.repositionDropDown;
                this.$TextInput._reactToControllerReport.call(this, report, arg);
                // check that widget has not been disposed
                if (this._cfg) {
                    if (openDropdown === true && !this._dropdownPopup) {
                        this._openDropdown();
                    } else if (openDropdown === false && this._dropdownPopup) {
                        this._closeDropdown();
                    } else if (repositionDropDown && this._dropdownPopup) {
                        this._closeDropdown();
                        this._openDropdown();
                    }
                }
            }
            // PROFILING // this.$stopMeasure(profilingId);
        },
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName == "popupOpen") {
                this._toggleDropdown();
            } else {
                this.$TextInput._onBoundPropertyChange.apply(this, arguments);
            }
        },
        /**
         * Initialization method called by the delegate engine when the DOM is loaded
         */
        initWidget : function () {
            this.$TextInput.initWidget.call(this);
            if (this._cfg.popupOpen) {
                this._toggleDropdown();
            }
        },

        /**
         * Cf the documentation of this method in the parent class.
         * @override
         */
        setCaretPosition : function () {
            this._updateFocusNoKeyboard();
            if (!this._focusNoKeyboard) {
                this.$TextInput.setCaretPosition.apply(this, arguments);
            }
        },

        /**
         * On touch devices, this method checks the currently focused element and defines this._focusNoKeyboard
         * accordingly. On desktop devices, this method does nothing.
         */
        _updateFocusNoKeyboard : ariaUtilsDevice.isTouch() ? function () {
            var activeElement = Aria.$window.document.activeElement;
            this._focusNoKeyboard = (activeElement != this.getTextInputField());
        } : Aria.empty,

        /**
         * This method focuses the widget without making the virtual keyboard appear on touch devices.
         */
        _focusTouchFocusSpan : function () {
            var touchFocusSpan = this._touchFocusSpan;
            if (!touchFocusSpan) {
                touchFocusSpan = this._touchFocusSpan = Aria.$window.document.createElement("span");
                touchFocusSpan.setAttribute("tabIndex", "-1");
                var widgetDomElt = this.getDom();
                widgetDomElt.appendChild(touchFocusSpan);
            }
            touchFocusSpan.focus();
        },

        /**
         * Cf the documentation of this method in the parent class.
         * @override
         */
        focus : function (idArray, fromSelf) {
            if (!fromSelf || this._cfg.disabled || !this._focusNoKeyboard) {
                return this.$TextInput.focus.call(this, idArray, fromSelf);
            } else {
                this._focusTouchFocusSpan();
            }
        }
    }
});
