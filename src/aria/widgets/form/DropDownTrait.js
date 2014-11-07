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
var ariaPopupsPopup = require("../../popups/Popup");
var ariaUtilsJson = require("../../utils/Json");


/**
 * Class whose prototype is intended to be imported for all widgets that use a drop-down popup
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.DropDownTrait",
    $constructor : function () {
        // The purpose of this class is to provide a prototype to be imported, not to be created directly.
        this.$assert(14, false);
    },
    $prototype : {
        /**
         * Internal method called when the dropdown must be open
         * @protected
         */
        _openDropdown : function () {

            if (this._dropdownPopup) {
                return;
            }
            if (this._cfg.disabled || this._cfg.readOnly) {
                return;
            }
            // PROFILING // this.$logTimestamp("begin to open dropdown");
            // create the section
            var section = this._context.createSection({
                fn : this._renderDropdownContent,
                scope : this
            });

            var popup = new ariaPopupsPopup();
            this._dropdownPopup = popup;

            var onDescription = {
                "onAfterOpen" : this._afterDropdownOpen,
                "onAfterClose" : this._afterDropdownClose,
                "onMouseClickClose" : this._dropDownMouseClickClose,
                scope : this
            };

            if (this._beforeDropdownClose) {
                onDescription["onBeforeClose"] = this._beforeDropdownClose;
            }
            popup.$on(onDescription);
            aria.templates.Layout.$on({
                "viewportResized" : this._onViewportResized,
                scope : this
            });
            popup.open({
                section : section,
                domReference : this._getInputMarkupDomElt(),
                preferredPositions : [{
                            reference : "bottom left",
                            popup : "top left"
                        }, {
                            reference : "top left",
                            popup : "bottom left"
                        }],
                offset : {
                    top : this._skinObj.offsetTop,
                    left : this._getPopupLeftOffset()
                },
                closeOnMouseClick : true,
                closeOnMouseScroll : true,
                ignoreClicksOn : this._getPopupIgnoreClicksOnDomElts(),
                preferredWidth : this._getPopupWidth()
            });
        },

        /**
         * Internal method to handle the left offset of the popup
         * @protected
         * @return {Integer} Left offset
         */
        _getPopupLeftOffset : function () {
            return 0;
        },

        /**
         * Raised when the viewport is resized. Needed to fix the position of the popup after the resize.
         * @param {Object} evt
         */
        _onViewportResized : function (evt) {
            this._closeDropdown();
            this._openDropdown();
        },

        /**
         * Handle events raised by the frame
         * @protected
         * @param {Object} evt
         */
        _frame_events : function (evt) {
            if (evt.name == "iconMouseDown" && evt.iconName == "dropdown" && !this._cfg.disabled) {
                if (this._hasFocus) {
                    this._keepFocus = true;
                }
            } else if (evt.name == "iconClick" && evt.iconName == "dropdown" && !this._cfg.disabled) {
                this._toggleDropdown();
            }
        },

        /**
         * Internal method called when the popup should be either closed or opened depending on the state of the
         * controller and whether it is currently opened or closed. In any case, keep the focus on the field. Called by
         * the widget button for example. To be overridden.
         * @protected
         */
        _toggleDropdown : function () {},

        /**
         * Returns an array of html elements on which it is possible to click without closing the popup. This array is
         * passed in the popup configuration as the ignoreClicksOn property. This method can be overridden if needed.
         * Default implementation returns the dropdown icon only (if present).
         * @return {Array} array of HTML elements
         * @protected
         */
        _getPopupIgnoreClicksOnDomElts : function () {
            return this._frame && this._frame.getIcon ? [this._frame.getIcon("dropdown")] : null;
        },

        /**
         * Callback for the event onAfterOpen raised by the popup.
         * @protected
         */
        _afterDropdownOpen : function () {
            this._setPopupOpenProperty(true);
            // when the popup is clicked, keep the focus on the right element:
            this._keepFocus = true;
            this.focus(null, true);
        },

        /**
         * Callback for the event onAfterClose raised by the popup.
         * @protected
         */
        _afterDropdownClose : function () {
            this._setPopupOpenProperty(false);
            this._dropdownPopup.$dispose();
            this._dropdownPopup = null;
            aria.templates.Layout.$unregisterListeners(this);
            this.focus(null, true);
            this._keepFocus = false;
        },

        /**
         * Callback for the event onMouseClickClose raised by the popup. <br>
         * fix for PTR07394450: method used to fix IE bug (a click in a text input does not trigger the blur event on
         * the previously selected multiselect input, so that the activeElement does not change properly)
         * @protected
         */
        _dropDownMouseClickClose : function (evt) {
            var domEvent = evt.domEvent;
            if (!aria.utils.Dom.isAncestor(domEvent.target, this._domElt)) {
                domEvent.preventDefault(true);
            }
        },

        /**
         * Internal method called when the popup must be closed
         * @protected
         */
        _closeDropdown : function () {
            if (!this._dropdownPopup) {
                return;
            }
            this._dropdownPopup.close();

        },

        /**
         * Internal function to override to render the content of the dropdown div
         * @protected
         * @param {aria.templates.MarkupWriter} out Markup writer which should receive the content of the popup.
         * @param {Object} arg Optional parameters
         */
        _renderDropdownContent : function (out) {},

        /**
         * Refresh content of the popup
         * @protected
         */
        _refreshPopup : function () {
            this._dropdownPopup.refresh();
        },

        /**
         * Handle key event on keydown or keypress
         * @protected
         * @param {Object|aria.DomEvent} event object containing keyboard event information (at least charCode and
         * keyCode properties). This object may be or may not be an instance of aria.DomEvent.
         */
        _handleKey : function (event) {},

        /**
         * Internal method to handle the keydown event
         * @protected
         * @param {aria.DomEvent} event
         */
        _dom_onkeydown : function (event) {
            if (event.isSpecialKey) {
                this._handleKey(event);
            }
        },

        /**
         * Internal method to handle the keypress event
         * @protected
         * @param {aria.DomEvent} event
         */
        _dom_onkeypress : function (event) {
            if (!event.isSpecialKey) {
                this._handleKey(event);
            }
        },

        /**
         * Get the preferred width for the dropdown popup. This value is part of the widget configuration. If bigger
         * than 0 the width of the popup will be fixed and won't be computed automatically.
         * @protected
         */
        _getPopupWidth : function () {
            return this._cfg.popupWidth || -1;
        },
        /**
         * Set the property "popupOpen" in the widget configuration and in the data model to which it is n=bound
         * @param {Boolean} value
         * @protected
         */
        _setPopupOpenProperty : function (value) {
            var cfg = this._cfg;
            cfg.popupOpen = value;
            if (cfg.bind && cfg.bind.popupOpen) {
                var binding = cfg.bind.popupOpen;
                ariaUtilsJson.setValue(binding.inside, binding.to, value);
            }
        }
    }
});
