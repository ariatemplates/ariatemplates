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
var ariaWidgetsIcon = require("../Icon");
var ariaDomEvent = require("../../DomEvent");
var ariaUtilsString = require("../../utils/String");
var ariaWidgetsFormCheckBoxStyle = require("./CheckBoxStyle.tpl.css");
var ariaWidgetsFormInput = require("./Input");
var ariaCoreBrowser = require("../../core/Browser");

/**
 * CheckBox widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.CheckBox",
    $extends : ariaWidgetsFormInput,
    $css : [ariaWidgetsFormCheckBoxStyle],
    /**
     * CheckBox constructor
     * @param {aria.widgets.CfgBeans:CheckBoxCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        this.$Input.constructor.apply(this, arguments);
        this._setSkinObj(this._skinnableClass);
        this._setInputType();
        this._setIconPrefix();
        this._setState();
        if (!this._skinObj.simpleHTML) {
            /**
             * Instance of the Icon widget used by this widget.
             * @type aria.widgets.Icon
             * @protected
             */
            this._icon = new ariaWidgetsIcon({
                icon : this._getIconName(this._state),
                verticalAlign : cfg.verticalAlign
            }, ctxt, lineNumber);

            this._icon.extraAttributes = (this._cfg.waiAria) ? "role='presentation'" : "";
        }

        /**
         * True if the widget is currently focues.
         * @type Boolean
         * @protected
         */
        this._hasFocus = false;

    },
    $destructor : function () {
        if (this._icon) {
            this._icon.$dispose();
            this._icon = null;
        }
        this.$Input.$destructor.call(this);
    },
    $prototype : {

        // Tab index is set directly on the input
        _customTabIndexProvided : true,

         /**
         * Skinnable class to use for this widget.
         * @type String
         * @protected
         */
        _skinnableClass : "CheckBox",

        /**
         * Give focus to the widget
         */
        focus : function () {
            this._focus();
        },

        /**
         * Return whether the checkbox is currently checked.
         * @return {Boolean} true if checked
         * @protected
         */
        _isChecked : function () {
            return this.getProperty("value");
        },

        /**
         * Returns true if it is needed to use the work-around for a bug in IE 11 with screen readers.
         * @param {Boolean} true if the work-around is needed
         */
        _needWaiWorkaroundMarkup : function () {
            var cfg = this._cfg;
            return ariaCoreBrowser.isIE11 && cfg.waiAria && cfg.disabled && this._isChecked() && cfg._inputType === "checkbox";
        },

        /**
         * Internal method to override to process the input block markup
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _inputMarkup : function (out) {
            if (!this._skinObj.simpleHTML) {
                this._icon.writeMarkup(out);
            }
            out.write(this._getInputsMarkup());
        },

        /**
         * Returns the markup of one or two input elements (depending on what is needed)
         * representing the current state of the widget.
         * @return {String}
         */
        _getInputsMarkup : function () {
            this._hasWaiWorkaroundMarkup = this._needWaiWorkaroundMarkup();
            this._hasTwoInputs = false;
            if (this._skinObj.simpleHTML) {
                if (this._hasWaiWorkaroundMarkup) {
                    this._hasTwoInputs = true;
                    return this._getInputMarkup(true, false) + this._getInputMarkup(false, true);
                } else {
                    return this._getInputMarkup(true, true);
                }
            } else {
                return this._getInputMarkup(true, false);
            }
        },

        /**
         * Returns the markup of an input element representing the current state of the widget.
         * @param {Boolean} hasIds Whether the input should have a name and ids (if configured so).
         * @param {Boolean} visible Whether the input should be visible (or have the xSROnly class)
         * @return {String}
         */
        _getInputMarkup : function (hasIds, visible) {
            var cfg = this._cfg;
            var waiAria = cfg.waiAria;
            var markup = ['<input type="', cfg._inputType, '"', ' value="', cfg.value, '"'];
            var checked = this._isChecked();
            if (checked) {
                markup.push(' checked');
            }
            markup.push(visible ? ' style="display:inline-block"' : ' class="xSROnly"');
            if (hasIds) {
                var inputName = this._inputName;
                if (inputName) {
                    markup.push(' name="', inputName, '"');
                }
                if (Aria.testMode || waiAria) {
                    markup.push(' id="' + this._domId + '_input"');
                }
                if (waiAria) {
                    markup.push(this._getAriaLabelMarkup());
                }
            } else if (waiAria) {
                markup.push(' aria-hidden="true"');
            }
            if (cfg.disabled) {
                if (visible || !this._hasWaiWorkaroundMarkup) {
                    markup.push(' disabled');
                } else /* if (!visible && this._hasWaiWorkaroundMarkup) */ {
                    // This is the work-around: using aria-disabled and omitting the disabled attribute
                    markup.push(' aria-disabled="true"');
                    // to prevent the widget from being focusable by tab, we use tabindex="-1":
                    markup.push(' tabindex="-1"');
                }
            } else {
                markup.push(' tabindex="', this._calculateTabIndex(), '"');
            }
            markup.push('/>');
            return markup.join('');
        },

        /**
         * Internal method used to process the label markup
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @param {String} cssDisplay type of CSS display: 'block' or 'inline-block'
         * @param {String} margin direction of the margin: [top | left | right | bottom]
         * @protected
         */
        _inputLabelMarkup : function (out, cssDisplay, margin) {
            var cfg = this._cfg;
            var labelId = (this._labelId) ? 'id="' + this._labelId + '" ' : '';
            var iconInfo = this._icon ? this._icon.getCurrentIconInfo() : null, lineHeight, color;
            if (iconInfo != null) {
                lineHeight = iconInfo.height;
            }
            if (this._skinObj.states[this._state] != null) {
                color = this._skinObj.states[this._state].color;
            }

            out.write('<span style="');

            if (this._skinObj.simpleHTML && cssDisplay != "block") {
                out.write("padding-bottom: 7px;");
            }

            if (lineHeight && ariaCoreBrowser.isOldIE) {
                out.write('line-height:' + (lineHeight - 2) + 'px;');
            }

            if (margin) {
                out.write('margin-' + margin + ':' + this._labelPadding + 'px;');
            }
            if (cfg.labelWidth > -1) {
                out.write('width:' + cfg.labelWidth + 'px;');
            }

            out.write('text-align:' + cfg.labelAlign + ';display:' + cssDisplay + ';');
            var cssClass = 'class="x' + this._skinnableClass + '_' + cfg.sclass + '_' + this._state + '_label"';
            out.write('vertical-align:middle;"><label ' + labelId + cssClass);
            if (color) {
                out.write(' style="color:' + color + ';"');
            }
            if (cfg.waiAria) {
                out.write(' for="' + this._domId + '_input"');
            }
            out.write(this._getAriaLabelHiddenMarkup());
            out.write('>');
            out.write(ariaUtilsString.escapeHTML(cfg.label));

            out.write('</label></span>');
        },

        /**
         * Internal method to override to initialize a widget (e.g. to listen to DOM events)
         * @param {HTMLElement} elt the Input markup DOM elt - never null
         */
        _initInputMarkup : function (elt) {
            this._initializeFocusableElement();
            this._label = null;
            var labels = this.getDom().getElementsByTagName("label");
            if (labels.length > 0) {
                this._label = labels[0];
                labels = null;
            }
        },

        /**
         * Initializes the this._focusableElement property to the DOM element that will handle focus.
         */
        _initializeFocusableElement : function () {
            this._focusableElement = this.getDom().getElementsByTagName("input")[0];
        },

        /**
         * Gets a labelled element.
         */
        _getLabelledElement : function () {
            return this._getFocusableElement();
        },

        /**
         * Gets the DOM element that handles the focus
         */
        _getFocusableElement : function () {
            if (!this._focusableElement) {
                this._initializeFocusableElement();
            }
            return this._focusableElement;
        },

        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         * @protected
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName === 'value') {
                this._cfg.value = newValue;
                this._setState();
                this._updateDomForState();
            } else if (propertyName === 'disabled') {
                this._cfg.disabled = newValue;
                var checkField = this._getFocusableElement();
                var tabIndex = this._calculateTabIndex();
                checkField.tabIndex = tabIndex;
                this._setState();
                this._updateDomForState();
                this._initInputMarkup();
            } else {
                // delegate to parent class
                this.$Input._onBoundPropertyChange.apply(this, arguments);
            }
        },

        /**
         * Calculates the real tab index from configuration parameters given to the widget. Only valid to call if
         * baseTabIndex and tabIndex are correctly set, otherwise method will return -1.
         * @protected
         * @return {Number}
         */
        _calculateTabIndex : function () {
            return this.getProperty("disabled") || this.getProperty("readOnly") ?
                    -1 :
                    this.$Input._calculateTabIndex.call(this);
        },

        /**
         * Private method to get the icon name based on the _cfg description
         * @protected
         */
        _getIconName : function (state) {
            var cfg = this._cfg;
            return cfg._iconSet + ":" + cfg._iconPrefix + state;
        },

        /**
         * Internal method to set the _state property from the _cfg and current value
         * @protected
         */
        _setState : function () {
            var cfg = this._cfg;
            this._state = this._hasFocus ? "focused" : "normal";

            if (cfg.disabled) {
                this._state = "disabled";
            }

            if (this._isChecked()) {
                this._state += "Selected";
            }
        },

        /**
         * Internal method to change the state of the checkbox
         * @protected
         */
        _updateDomForState : function () {

            var newState = this._state;

            if (this._icon) {
                this._icon.changeIcon(this._getIconName(newState));
            }

            var inpEl = this._getFocusableElement();
            if (inpEl != null) {
                var hasWaiWorkaroundMarkup = this._hasWaiWorkaroundMarkup;
                var needWaiWorkaroundMarkup = this._needWaiWorkaroundMarkup();
                if (hasWaiWorkaroundMarkup || needWaiWorkaroundMarkup) {
                    // Jaws has some issues with disabled check boxes
                    // (cf test.aria.widgets.wai.input.checkbox.CheckboxDisabledJawsTestCase)
                    if (this._hasTwoInputs) {
                        aria.utils.Dom.removeElement(inpEl.nextSibling);
                    }
                    var markup = this._getInputsMarkup();
                    aria.utils.Dom.insertAdjacentHTML(inpEl, "afterEnd", markup);
                    aria.utils.Dom.removeElement(inpEl);
                    this._initializeFocusableElement();
                    inpEl = this._getFocusableElement();
                } else {
                    var disabled = this.getProperty("disabled");
                    var selected = this._isChecked();
                    inpEl.checked = selected;
                    inpEl.value = selected ? "true" : "false";
                    inpEl.disabled = disabled;
                }
            }

            if (this._label != null) {
                try {
                    // This call throws an exception when the color is 'inherit'
                    // and the browser or the browser mode is IE7
                    this._label.style.color = this._skinObj.states[newState].color;
                } catch (ex) {
                    this._label.style.color = "";
                }
            }

        },

        /**
         * Internal method to set the _inputType property from the _cfg description
         * @protected
         */
        _setInputType : function () {
            this._cfg._inputType = "checkbox";
        },

        /**
         * A private method to set this objects skin object
         * @param {String} widgetName Name of the widget
         * @protected
         */
        _setSkinObj : function (widgetName) {
            this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject(widgetName, this._cfg.sclass);
        },

        /**
         * Internal method to set the _iconPrefix property from the _cfg description
         * @protected
         */
        _setIconPrefix : function () {
            this._cfg._iconSet = this._skinObj.iconset;
            this._cfg._iconPrefix = this._skinObj.iconprefix;
        },

        /**
         * Focuses the element representing the focus for this widget
         * @protected
         */
        _focus : function () {
            try {
                this._getFocusableElement().focus();
            } catch (ex) {
                // FIXME: fix for IE7, investigate why it may fail
            }
        },

        /**
         * Toggles the value of the checkbox and updates states, DOM etc. Typically called when user performs action
         * that toggles the value
         * @protected
         */
        _toggleValue : function () {
            var newValue = !this.getProperty("value");
            this._cfg.value = newValue;
            this.setProperty("value", newValue);
            // setProperty on value might destroy the widget
            if (this._cfg) {
                this._setState();
                this._updateDomForState();
                var changeCallback = this._cfg.onchange;
                if (changeCallback) {
                    this.evalCallback(changeCallback);
                }
            }
        },

        /**
         * Internal method to handle the click event
         * @param {aria.DomEvent} event Click
         * @protected
         */
        _dom_onclick : function (event) {
            this._toggleValue();
            if (!this._hasFocus) {
                this._focus();
            }
            if (event.target.tagName.toLowerCase() != "input") {
                event.preventDefault(true);
            }
        },

        /**
         * Internal method to handle the mousedown event
         * @param {aria.DomEvent} event Mouse Down
         * @protected
         */
        _dom_onmousedown : function (event) {
            if (!this._hasFocus) {
                this._focus();
            }
            event.preventDefault(true);
        },

        /**
         * Internal method to handle the mouseup event
         * @param {aria.DomEvent} event Mouse Up
         * @protected
         */
        _dom_onmouseup : function (event) {
            event.preventDefault(true);
        },

        /**
         * Internal method to handle the focus event
         * @param {aria.DomEvent} event Focus
         * @protected
         */
        _dom_onfocus : function (event) {
            this._hasFocus = true;
            this._setState();
            this._updateDomForState();
        },

        /**
         * Internal method to handle the blur event
         * @param {aria.DomEvent} event Blur
         * @protected
         */
        _dom_onblur : function (event) {
            this._hasFocus = false;
            this._setState();
            this._updateDomForState();

        },

        /**
         * Internal method to handle the keydown event
         * @param {aria.DomEvent} event Key Down
         * @protected
         */
        _dom_onkeydown : function (event) {
            if (event.keyCode == ariaDomEvent.KC_SPACE) {
                this._toggleValue();
                event.preventDefault(true);
            }
        },

         /**
         * Internal method to handle the keyup event
         * @param {aria.DomEvent} event Key Up
         * @protected
         */
        _dom_onkeyup : function (event) {
            if (event.keyCode == ariaDomEvent.KC_SPACE) {
                event.preventDefault(true);
            }
        },

        /**
         * Delegate an incoming event
         * @param {aria.DomEvent} evt
         * @return {Boolean} event bubbles ?
         * @override
         */
        delegate : function (evt) {
            if (this._cfg.disabled) {
                // When the checkbox is disabled without the disabled attribute,
                // it is necessary to prevent the default action when clicking
                // on the checkbox and when the change event happens:
                if (evt.type === "click" || evt.type === "change") {
                    evt.preventDefault();
                }
            } else {
                return this.$Input.delegate.apply(this, arguments);
            }
        }
   }
});
