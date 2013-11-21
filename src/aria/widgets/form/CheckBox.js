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
 * CheckBox widget
 */
Aria.classDefinition({
    $classpath : "aria.widgets.form.CheckBox",
    $extends : "aria.widgets.form.Input",
    $dependencies : ["aria.widgets.Icon", "aria.utils.Function", "aria.DomEvent", "aria.utils.String"],
    $css : ["aria.widgets.form.CheckBoxStyle"],
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
            this._icon = new aria.widgets.Icon({
                icon : this._getIconName(this._state)
            }, ctxt, lineNumber);
        }

        /**
         * True if the widget is currently focues.
         * @type Boolean
         * @protected
         */
        this._hasFocus = false;

        /**
         * True if the widget is currently pressed by the mouse.
         * @protected
         * @type Boolean
         */
        this._mousePressed = false;

    },
    $destructor : function () {
        if (this._icon) {
            this._icon.$dispose();
            this._icon = null;
        }
        this.$Input.$destructor.call(this);
    },
    $prototype : {
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
         * Check that the widget configuration is correct.
         * @override
         * @protected
         */
        _checkCfgConsistency : function () {
            // for the simpleHTML case, tab index is set directly on the input
            this._customTabIndexProvided = this._skinObj.simpleHTML;
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
         * Internal method to override to process the input block markup
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _inputMarkup : function (out) {
            var cfg = this._cfg;
            var name = this._inputName ? ' name="' + this._inputName + '"' : "";

            if (this._skinObj.simpleHTML) {

                // tab index is needed for simple markup (not set on container span, otherwise double focus occurs)
                var tabIndex = this._cfg.tabIndex;
                tabIndex = !cfg.disabled ? 'tabindex="' + this._calculateTabIndex() + '" ' : "";

                out.write(['<input style="display:inline-block"', cfg.disabled ? ' disabled' : '',
                        this._isChecked() ? ' checked' : '', ' type="', cfg._inputType, '"', name, ' value="',
                        cfg.value.toString(), '" ' + tabIndex + '/>'].join(''));
            } else {
                this._icon.writeMarkup(out);
                out.write(['<input', Aria.testMode ? ' id="' + this._domId + '_input"' : '', ' style="display:none"',
                        cfg.disabled ? ' disabled' : '', this._isChecked() ? ' checked' : '', ' type="',
                        cfg._inputType, '"', name, ' value="', cfg.value.toString(), '"/>'].join(''));
            }
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

            var iconInfo = this._icon ? this._icon.getCurrentIconInfo() : null, lineHeight, color;
            if (iconInfo != null) {
                lineHeight = iconInfo.height;
            }
            if (this._skinObj.states[this._state] != null) {
                color = this._skinObj.states[this._state].color;
            }

            out.write('<span style="');

            if (this._skinObj.simpleHTML && cssDisplay != "block") {
                out.write("padding-bottom: 7px;display:inline-block;");
            }

            if (lineHeight && aria.core.Browser.isOldIE) {
                out.write('line-height:' + (lineHeight - 2) + 'px;');
            }
            var cssClass = 'class="x' + this._skinnableClass + '_' + cfg.sclass + '_' + this._state + '_label"';
            out.write('vertical-align:middle;"><label ' + cssClass + ' style="display:' + cssDisplay);

            if (margin) {
                out.write(';margin-' + margin + ':' + this._labelPadding + 'px');
            }
            if (cfg.labelWidth > -1) {
                out.write(';width:' + cfg.labelWidth + 'px');
            }
            if (color) {
                out.write(';color:' + color);
            }
            out.write(';text-align:' + cfg.labelAlign + ';">');
            out.write(aria.utils.String.escapeHTML(cfg.label));

            out.write('</label></span>');
        },

        /**
         * Internal method to override to initialize a widget (e.g. to listen to DOM events)
         * @param {HTMLElement} elt the Input markup DOM elt - never null
         */
        _initInputMarkup : function (elt) {
            this._initializeFocusableElement();
            this._getFocusableElement();
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
            this._focusableElement = this.getDom();
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
                var checkField = this.getDom();
                var disabledOrReadonly = this.getProperty("disabled") || this.getProperty("readOnly");
                var tabIndex = disabledOrReadonly ? -1 : this._calculateTabIndex();
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

            var inpEl = this.getDom().getElementsByTagName("input")[0];

            if (inpEl != null) {
                // "normal", "normalSelected", "focused", "focusedSelected", "disabled", "disabledSelected",
                // "readonly",
                // "readonlySelected"
                var selected = this._isChecked();
                inpEl.checked = selected;
                inpEl.value = selected ? "true" : "false";
                inpEl.disabled = this.getProperty("disabled");
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
            // with simple HTML markup, we only use the checkbox for its visual appearance and prevent
            // its default behavior (we manage it ourselves)
            event.preventDefault(true);
        },

        /**
         * Internal method to handle the mouseout event
         * @param {aria.DomEvent} event Mouse Out
         * @protected
         */
        _dom_onmouseout : function (event) {
            this._mousePressed = false;
        },

        /**
         * Internal method to handle the mousedown event
         * @param {aria.DomEvent} event Mouse Down
         * @protected
         */
        _dom_onmousedown : function (event) {

            this._mousePressed = true;

            // Has to be done since onfocus on spans does not bubble
            if (!this._hasFocus) {
                this._focus();
            }

            // prevent selection of surrounding span
            event.preventDefault(true);
        },

        /**
         * Internal method to handle the mouseup event
         * @param {aria.DomEvent} event Mouse Up
         * @protected
         */
        _dom_onmouseup : function (event) {
            // filters right click
            // PTR 04746599: introducing _mousePressed to have the same behavior in all browsers
            // when selecting text in a text field and releasing the mouse over the check box
            if (this._mousePressed) {
                this._mousePressed = false;
                this._toggleValue();
                if (!this._hasFocus) {
                    this._focus();
                }
            }
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
            if (event.keyCode == aria.DomEvent.KC_SPACE) {
                this._toggleValue();
                event.preventDefault(true);
            }
        }
    }
});
