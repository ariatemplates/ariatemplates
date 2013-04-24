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
 * Specialize the input classes for Text input and manage the HTML input element
 */
Aria.classDefinition({
    $classpath : "aria.widgets.form.TextInput",
    $extends : "aria.widgets.form.InputWithFrame",
    $dependencies : ["aria.utils.Function", "aria.utils.Data", "aria.utils.String",
            "aria.widgets.environment.WidgetSettings", "aria.utils.Caret"],
    $css : ["aria.widgets.form.TextInputStyle"],
    /**
     * TextInput constructor
     * @param {aria.widgets.CfgBeans.TextInputCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     * @param {aria.widgets.controller.TextDataController} controller the data controller object
     */
    $constructor : function (cfg, ctxt, lineNumber, controller) {
        // allow the skinnable class to be defined in the child class, before
        // calling this constructor
        if (!this._skinnableClass) {
            /**
             * Skinnable class to use for this widget.
             * @protected
             * @type String
             */
            this._skinnableClass = "TextInput";
        }

        this.$InputWithFrame.constructor.apply(this, arguments);

        /**
         * Minimum width in px that must be kept for the input markup.
         * @type Number
         * @protected
         * @override
         */
        this._minInputMarkupWidth = 8;

        /**
         * Default value to assign to _inputMarkupWidth if no constraint apply
         * @type Number
         * @protected
         * @override
         */
        this._defaultInputMarkupWidth = 170;

        /**
         * Tells if the field is of type text or password
         * @protected
         * @type Boolean
         */
        this._isPassword = false;

        /**
         * Tells if it is input or textarea
         * @protected
         * @type Boolean
         */

        this._isTextarea = false;

        /**
         * Internal timer ID used to calidate a keyup event.
         * @see _dom_onkeyup
         * @protected
         * @type String
         */
        this._valTimer = null;

        /**
         * Use to skip the focus or blur handling because the widgets keeps focus and is just changing things resulting
         * on a lost of focus
         * @protected
         * @type Boolean
         */
        this._keepFocus = false;

        /**
         * Use on keep focus to restaure selection. Keep selection start and end.
         * @protected
         * @type Object
         */
        this._currentCaretPosition = null;

        /**
         * Controller for this input - used for validation
         * @type aria.widgets.controllers.TextDataController
         */
        this.controller = controller;

        if (controller) {
            controller.$on({
                'onCheck' : this._reactToControllerReportEvent,
                scope : this
            });
        }

        /**
         * DOM reference of the input field.
         * @protected
         * @type HTMLElement
         */
        this._textInputField = null;

        /**
         * true if text input has focus
         * @protected
         * @type Boolean
         */
        this._hasFocus = false;

        /**
         * Custom tab index flag
         * @protected
         * @type Boolean
         */
        this._customTabIndexProvided = true;

        /**
         * Set to true when the widget should be in prefill state
         * @type Boolean
         * @protected
         */
        this._isPrefilled = false;

        /**
         * Flag for the simpleHTML skin
         * @protected
         * @type Boolean
         */
        this._simpleHTML = this._skinObj.simpleHTML;

        /**
         * Flag set to false after first focus, and set back to true after a blur. Used for the autoselect behaviour.<br />
         * This value is true when the field receives focus for the first time (user action) and false when the focus is
         * giveng programmatically by the controller
         * @type Boolean
         */
        this._firstFocus = true;

    },
    $destructor : function () {
        this._textInputField = null;

        if (this.controller) {
            this.controller.$dispose();
            this.controller = null;
        }
        this.$InputWithFrame.$destructor.call(this);
    },
    $statics : {
        // ERROR MESSAGE:
        WIDGET_VALUE_IS_WRONG_TYPE : "%1Value %2 is of incorrect type."
    },
    $prototype : {
        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         * @param {Object} def the class definition
         * @param {Object} sdef the superclass class definition
         */
        $init : function (p, def, sdef) {
            p.automaticallyBindedProperties = p.automaticallyBindedProperties.concat("prefillError");
        },

        /**
         * Get the color to be set on the text field for the current state, if the helptext is not enabled.
         * @protected
         */
        _getTextFieldColor : function () {
            if (this._simpleHTML) {
                return this._skinObj.states[this._state].color;
            }
            if (this._isIE7OrLess) {
                // As "inherit" does not work in this case in IE7, we are obliged to read the property from
                // the frame state and apply it to the text field directly
                var state = this._skinObj.states[this._state];
                return state.color || state.frame.color;
            }
            return "inherit";
        },

        /**
         * Get the text value of the input field. If available it tries to use the internal valid value, otherwise uses
         * the invalid text. If none of them is a non empty string it return the prefilled value. This method doesn't
         * handle helptext, as this value is not just text but also style.
         * @return {String}
         */
        _getText : function () {
            var cfg = this._cfg;

            // invalid text and value shouldn't be set at the same time
            var text = cfg.invalidText || "";

            if (text && cfg.value) {
                // There's both a value and an invalid text, prefer the value
                this.setProperty("invalidText", null);
                text = "";
            }

            // Validate the value in the configuration
            var res = this.checkValue({
                text : text,
                value : cfg.value,
                performCheckOnly : true
            });

            if (res.report) {
                var report = res.report;
                if (!text && report.text != null) {
                    text = '' + report.text; // String cast of valid value
                }
                report.$dispose();
            }
            if (!text) {
                text = this._getPrefilledText(cfg.prefill);
            }

            return text;
        },

        /**
         * Set a given text as value for the text input. This method handles helptext for non password fields.
         * @param {String} value Text to be set, if empty uses the value from <code>this._getText</code> or the
         * helptext
         */
        _setText : function (value) {
            if (value == null) {
                value = this._getText();
            }

            // _getText only handles valid / invalid values and prefills, not the helptext
            if (!value && !this._isPassword) {
                // We don't want to handle helptext in password fields, first remove any text
                this.getTextInputField().value = "";
                this.setHelpText(true);
            } else if (value) {
                this.setHelpText(false);
                this.getTextInputField().value = value;
            }
        },

        /**
         * Get the text value that should be prefilled in the widget. It takes a default value that could be anything
         * (like dates). For non string objects it delegates the string resolution to the controller.
         * @param {Object} value
         * @return {String}
         * @protected
         */
        _getPrefilledText : function (value) {
            if (value && this.controller && this.controller.getDisplayTextFromValue) {
                return this.controller.getDisplayTextFromValue(this._cfg.prefill);
            } else {
                return value;
            }
        },

        /**
         * Internal method to process the input block markup inside the frame
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _inputWithFrameMarkup : function (out) {
            var cfg = this._cfg, skinObj = this._skinObj, hts = this._helpTextSet, htc = this._skinObj.helpText, color = this._getTextFieldColor();
            var stringUtils = aria.utils.String;

            var inlineStyle = ['padding:', skinObj.innerPaddingTop, 'px ', skinObj.innerPaddingRight, 'px ',
                    skinObj.innerPaddingBottom, 'px ', skinObj.innerPaddingLeft, 'px;position:relative;margin:0;'];
            if (!this._simpleHTML) {
                inlineStyle.push("background-color:transparent;border-width:0px;vertical-align:top;");
            }

            // check value to set appropriate state and text
            var text = this._getText();

            if (hts) {
                // FIXME : re-activate helpText in password field in IE
                if (this._isIE7OrLess && this._isPassword) {
                    this._helpTextSet = hts = false;
                    cfg.helptext = null;
                } else {
                    color = htc.color + (htc.italics ? ";font-style:italic" : "");
                }
            }
            var type = this._isPassword && !hts ? "password" : "text";

            var inputWidth = this._frame.innerWidth - skinObj.innerPaddingLeft - skinObj.innerPaddingRight;
            if (inputWidth < 0) {
                inputWidth = 0;
            }

            var spellCheck = "";
            if (cfg.spellCheck != null) {
                // if spellCheck is specified in the config, include the
                // corresponding attribute in the HTML
                spellCheck = ' spellcheck="' + (cfg.spellCheck ? "true" : "false") + '"';
            }

            if (this._isTextarea) {
                out.write(['<textarea', Aria.testMode ? ' id="' + this._domId + '_textarea"' : '',
                        cfg.disabled ? ' disabled="disabled"' : cfg.readOnly ? ' readonly="readonly"' : '', ' type="',
                        type, '" style="', inlineStyle.join(''), 'color:', color,
                        ';overflow:auto;resize:none;height: ' + this._frame.innerHeight + 'px; width:', inputWidth,
                        'px;"', 'value=""', (cfg.maxlength > -1 ? 'maxlength="' + cfg.maxlength + '" ' : ' '),
                        (cfg.tabIndex != null ? 'tabindex="' + this._calculateTabIndex() + '" ' : ' '), spellCheck,
                        '>', stringUtils.encodeForQuotedHTMLAttribute((this._helpTextSet) ? cfg.helptext : text),
                        '</textarea>'

                ].join(''));
            } else {
                out.write(['<input class="xTextInputInput" ', Aria.testMode ? ' id="' + this._domId + '_input"' : '',
                        cfg.disabled ? ' disabled="disabled"' : cfg.readOnly ? ' readonly="readonly"' : '', ' type="',
                        type, '" style="', inlineStyle.join(''), 'color:', color, ';width:', inputWidth, 'px;"',
                        'value="', stringUtils.encodeForQuotedHTMLAttribute((this._helpTextSet) ? cfg.helptext : text),
                        '" ', (cfg.maxlength > -1 ? 'maxlength="' + cfg.maxlength + '" ' : ' '),
                        (cfg.tabIndex != null ? 'tabindex="' + this._calculateTabIndex() + '" ' : ' '), spellCheck,
                        ' _ariaInput="1"/>'
                // the _ariaInput attribute is present so that pressing
                // ENTER on this widget raises the onSubmit event of
                // the fieldset:
                ].join(''));
            }

        },

        /**
         * Internal method to override to initialize a widget (e.g. to listen to DOM events)
         * @param {HTMLElement} elt the Input markup DOM elt - never null
         * @protected
         * @override
         */
        _initInputMarkup : function (elt) {
            this.$InputWithFrame._initInputMarkup.call(this, elt);
            this._textInputField = this._frame.getChild(0);

            // FIXME: Fix applying initial state in the 'Div', remove the below
            this._reactToChange();

        },

        /**
         * Return the input text element generated by the TextInput method
         * @return {DOMElement}
         */
        getTextInputField : function () {
            if (!this._textInputField && !this._initDone) {
                // this will do the correct mapping
                this.getDom();
            }
            return this._textInputField;
        },

        /**
         * Check that the value displayed in the field is correct. If not, set the field in error and store its invalid
         * text
         * @param {Object} arg - optional arguments to control the behavior
         *
         * <pre>
         * {
         *     text: {String} (default:null) - display text,
         *     value: {Object} - internal widget value,
         *     performCheckOnly: {Boolean} - perfom only value/text check do not update th widget display,
         *     resetErrorIfOK: {Boolean} (default:true) - tells if error display must be removed if check is OK
         *         (usefull when check is done on 'strange' events like mouseover)
         * }
         * </pre>
         *
         * @return {Object}
         *
         * <pre>
         * {
         *     isValid : {Boolean} Whether the value is valid or not
         *     report : {Object} Controller's report, if any
         * }
         * </pre>
         */
        checkValue : function (arg) {
            var inputField = this.getTextInputField();
            var text = inputField ? inputField.value : "";
            var value = null;
            var performCheckOnly = false;

            if (arg) {
                text = (arg.text != null) ? arg.text : text;
                value = arg.value;
                performCheckOnly = arg.performCheckOnly;
            }

            if (!performCheckOnly && this._cfg.directOnBlurValidation) {
                // reinitialize display
                this.changeProperty("formatError", false);
            }

            var result = {
                isValid : true,
                report : null
            };

            if (!this.controller) {
                // There's no controller so we assume the value to be valid
                return result;
            }

            var hasErrors = (this._cfg.formatErrorMessages.length ? true : false);
            var report;

            if (value != null) {
                report = this.controller.checkValue(value);
            } else {
                report = this.controller.checkText(text, hasErrors);
            }

            if (!report) {
                // No report means that the controller is handling the value asynchronously, consider it as valid
                return result;
            }

            if (report.errorMessages.length) {
                if (!performCheckOnly) {
                    this.changeProperty("value", null);
                    this.changeProperty("invalidText", text);
                    if (this._cfg.directOnBlurValidation) {
                        this.changeProperty("formatErrorMessages", report.errorMessages);
                    }
                }
            } else if (this._cfg.formatError === false && aria.utils.Type.isArray(this._cfg.formatErrorMessages)
                    && this._cfg.formatErrorMessages.length) {
                this.changeProperty("invalidText", null);
                this.changeProperty("formatErrorMessages", []);
                // setting invalid text to null means we might add helptext, this prevents any value to be applied
                this.setHelpText(false);
            } else if (report.ok && !performCheckOnly) {
                this.changeProperty("invalidText", null);
                // If I get there there are no errors raised by this check, and there were no errors before, meaning the
                // value is correct, no need to remove the helptext because it won't be set
            }

            if (performCheckOnly) {
                return {
                    isValid : report.ok,
                    report : report
                };
            } else {
                this._reactToControllerReport(report, arg);
                return;
            }
        },

        /**
         * Callback for asynchronous controller reporting
         * @param {Event} event controller onCheck event
         * @protected
         */
        _reactToControllerReportEvent : function (event) {
            if (this._keepFocus || this._hasFocus) {
                this._reactToControllerReport(event.report, event.arg);
            } else if (event.report) {
                event.report.$dispose();
            }
        },

        /**
         * React to a Controller report. The widget's controller generates a report on the internal status of the
         * widget. This function reads the report and sets some properties of the widget. It also reacts to changes in
         * the internal datamodel.
         * @param {aria.widgets.controllers.reports.ControllerReport} report
         * @param {Object} arg Optional parameters
         * @protected
         */
        _reactToControllerReport : function (report, arg) {

            var hasChange = false, cfg = this._cfg;

            if (report) {

                var resetErrorIfOK = true;
                var hasFocus = this._hasFocus;
                var stopValueProp = false;
                var delayedValidation = false;
                if (arg) {
                    resetErrorIfOK = (arg.resetErrorIfOK !== false); // true by default
                    if (arg.hasFocus != null) {
                        // replace default hasFocus property
                        hasFocus = arg.hasFocus;
                    }
                    if (arg.stopValueProp) {
                        stopValueProp = arg.stopValueProp;
                    }
                    if (arg.delayedValidation) {
                        delayedValidation = arg.delayedValidation;
                    }

                }
                // if the validation originated from a validation with delay we
                // do not want to update the input text or
                // value. The value will be set to 'undefined' though when the
                // entry is incorrect
                if (!delayedValidation) {
                    var text = report.text, value = report.value;
                    if (text != null && !this._helpTextSet) { // if text was
                        // an empty string (helpTextSet is 'true') do not update
                        // the display
                        this.getTextInputField().value = text;
                        if (report.caretPosStart != null && report.caretPosEnd != null) {
                            this.setCaretPosition(report.caretPosStart, report.caretPosEnd);
                        }
                    }
                    if (typeof value != 'undefined' && !stopValueProp && !this._isPropertyEquals("value", value)) {
                        hasChange = this.setProperty("value", value);
                    }
                }

                // setProperty on value can dispose the widget
                if (this._cfg) {
                    if (report.ok) {
                        if (resetErrorIfOK && cfg.directOnBlurValidation) {
                            this.changeProperty("formatError", false);
                        }
                    } else if (report.ok === false) {
                        if (hasFocus && report.matchCorrectValueStart) {
                            // field has the focus and entry could be correct
                            if (cfg.directOnBlurValidation) {
                                this.changeProperty("formatError", false);
                            }
                        } else {
                            if (cfg.directOnBlurValidation) {
                                this.changeProperty("formatError", true);
                            }
                        }
                        // if the text is incorrect, the bound property should
                        // be set to 'undefined'
                        hasChange = this.setProperty("value", undefined);
                    }
                }

                // do this at the very end

                if (hasChange && this._cfg) {
                    // When the user modifies the field, we reset the error
                    // state until next validation:
                    this.changeProperty("error", false);
                    this.evalCallback(cfg.onchange);
                }

                report.$dispose();
            }
        },

        /**
         * Return the caret position in the TextInput textfield Note: the textfield must be focused - otherwise caret
         * doesn't exist
         * @return {Object} the caret position (start end end)
         */
        getCaretPosition : function () {
            if (!this._hasFocus) {
                return null;
            }
            var ctrl = this.getTextInputField();
            return aria.utils.Caret.getPosition(ctrl);
        },

        /**
         * Set the caret position in the field
         * @param {Number} start The starting caret position
         * @param {Number} end The ending caret position
         */
        setCaretPosition : function (start, end) {
            if (!this._hasFocus) {
                return;
            }

            var ctrl = this.getTextInputField();
            aria.utils.Caret.setPosition(ctrl, start, end);
        },

        /**
         * Compare newValue with the one stored in _cfg[propertyName] Can be overrided to have a specific comparison
         * @param {String} propertyName
         * @param {Multitype} newValue If transformation is used, this should be the widget value and not the data model
         * value
         * @private
         * @return true if values are considered as equals.
         */
        _isPropertyEquals : function (propertyName, value) {
            var oldValue = this.getProperty(propertyName);
            return oldValue === value;
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

                this.setHelpText(false);
                this.setPrefillText(false, null, true);

                var cfg = this._cfg;
                var displayText = "";

                var res = this.checkValue({
                    performCheckOnly : true,
                    value : newValue,
                    text : newValue == null ? "" : null
                });

                if (res.isValid) {
                    if (this._cfg && res.report && res.report.text != null) {
                        if (this._cfg.directOnBlurValidation) {
                            this.changeProperty("formatError", false);
                        }
                        displayText = res.report.text;
                    }

                    // Setting directly the value is safe
                    this.getTextInputField().value = displayText;
                    res.report.$dispose();
                    // Update the data model
                    if (res.report && res.report.value != newValue) {
                        var value = res.report.value;
                        if (!this._isPropertyEquals("value", value)) {
                            this.setProperty("value", value);
                        }
                    }
                } else {
                    this.$logError(this.WIDGET_VALUE_IS_WRONG_TYPE, [newValue]);
                    res.report.$dispose();
                    return;
                }

                // in case things have changed the field, try to set an helptext
                this.setHelpText(true);
                if (((aria.utils.Type.isArray(cfg.value) && aria.utils.Array.isEmpty(cfg.value)) || !cfg.value)
                        && cfg.prefill && cfg.prefill + "") {
                    this.setPrefillText(true, cfg.prefill, true);
                }

            } else if (propertyName === 'invalidText') {
                // no need to handle combinations of newValue and oldValue being: null, undefined, ''
                // this can happen when invalidText is set from the checkValue below, causing an infinite loop
                if (newValue == oldValue) {
                    return;
                }
                var res;
                // first check the old value to see if it is valid
                if (this._cfg.value) {
                    res = this.checkValue({
                        performCheckOnly : true,
                        value : this._cfg.value,
                        text : newValue == null ? "" : null
                    });
                }
                // only update the display value if the old value is not a valid value, or the old value is null
                if (!res || !res.isValid) {
                    var textField = this.getTextInputField();
                    if (textField) {
                        this._setText(newValue);
                    }
                }
                if (res && res.report) {
                    res.report.$dispose();
                }
                // resets error state when validation is switched on
                if (!newValue) {
                    this.changeProperty("formatErrorMessages", []);
                    this.changeProperty("formatError", false);
                    this.changeProperty("error", false);
                }
                // set the invalidText property and react to the change
                this.setProperty("invalidText", newValue);
                this._reactToChange();
            } else if (propertyName === 'readOnly' || propertyName === 'disabled') {
                if (newValue) {
                    // PTR 04746599: disabling the field or making it read-only
                    // is incompatible with having the field in
                    // focus:
                    this._hasFocus = false;
                }
                this._cfg[propertyName] = newValue;
                this._reactToChange();
            } else if (propertyName === 'mandatory' || propertyName === 'formatError'
                    || propertyName === 'formatErrorMessages' || propertyName === 'error'
                    || propertyName === 'errorMessages') {
                this._cfg[propertyName] = newValue;
                this._reactToChange();
            } else if (propertyName == "prefill") {
                this.setPrefillText(true, newValue, true);
            } else if (propertyName == "prefillError") {
                if (newValue) {
                    this.setPrefillText(true, "", true);
                } else if (newValue === false) {
                    this.setPrefillText(true, this._cfg.prefill, true);
                }
            } else {
                // delegate to parent class
                this.$InputWithFrame._onBoundPropertyChange.apply(this, arguments);
            }
        },

        /**
         * Internal method to set the _state property from the _cfg description
         * @protected
         */
        _setState : function () {
            if (this._cfg.disabled) {
                this._state = "disabled";
            } else if (this._cfg.readOnly) {
                this._state = "readOnly";
            } else if (this._isPrefilled) {
                this._state = "prefill";
            } else {
                if (this._cfg.mandatory) {
                    this._state = "mandatory";
                } else {
                    this._state = "normal"; // normal type by default
                }
                if (this._cfg.formatError || this._cfg.error) {
                    this._state += "Error";
                }
                // PTR 04746599: the disabledFocused state must not be reachable
                // as it does not exist
                // (the same for readOnlyFocused)
                if (this._hasFocus || this._keepFocus) {
                    this._state += "Focused";
                }
            }
        },

        /**
         * Internal method to update the state (frame)
         * @protected
         * @override
         */
        _updateState : function () {
            // PROFILING // var profilingId = this.$startMeasure("update state
            // (TextInput)");
            this.$InputWithFrame._updateState.call(this);
            var skinObj = this._skinObj;
            var inputWidth = this._frame.innerWidth - skinObj.innerPaddingLeft - skinObj.innerPaddingRight;
            if (inputWidth < 0) {
                inputWidth = 0;
            }
            this.getTextInputField().style.width = inputWidth + "px";
            if ((this._isIE7OrLess || this._simpleHTML) && !this._helpTextSet) {
                this.getTextInputField().style.color = this._getTextFieldColor();
            }
            if (!(this._cfg.formatError || this._cfg.error)) {
                // remove the error tip when there isn't any error anymore
                this._validationPopupHide();
            }
            // PROFILING // this.$stopMeasure(profilingId);
        },

        /**
         * This is called when the bindings are updated. It will update the textfield when either the error, mandatory,
         * readOnly or disabled settings change.
         * @protected
         */
        _reactToChange : function () {
            var inputElm = this.getTextInputField();
            // only react if some DOM is available
            if (inputElm) {
                this._updateState();
                // sets the readOnly disabled flags in the input according to
                // the recently changed cfg object
                inputElm.readOnly = this._cfg.readOnly;
                inputElm.disabled = this._cfg.disabled;
            }
        },

        /**
         * Internal method to handle the onkeydown event.
         * @param {DOMEvent or aria.DomEvent} e event object (on W3C browsers) or wrapper on it
         * @protected
         */
        _dom_onkeydown : function (event) {
            var enterPressed = (event.keyCode == event.KC_ENTER);
            if (enterPressed) {
                // pressing enter in a field triggers checkValue (necessary
                // especially if doing validation on the
                // onSubmit event of the fieldset, so that the data model is up
                // to date)
                this.checkValue();
            }
        },

        /**
         * Internal method to handle the onkeyup event. This is called to set the value property in the data model
         * through the setProperty method that also handles all other widgets bound to this value.
         * @protected
         */
        _dom_onkeyup : function (event) {
            if (this._cfg.validationDelay) {
                if (this._valTimer) {
                    aria.core.Timer.cancelCallback(this._valTimer);
                }

                this._valTimer = aria.core.Timer.addCallback({
                    fn : this.checkValue,
                    scope : this,
                    args : {
                        delayedValidation : true
                    },
                    delay : this._cfg.validationDelay
                });
            }
        },

        /**
         * DOM callback function called when the widget has been clicked on. The onclick handles the selection of a text
         * input widget if the autoselect property has been set to true.
         * @protected
         */
        _dom_onclick : function () {
            this._autoselect();
        },

        /**
         * DOM callback function called when the focus is put on the input. The onFocus event is available on the input
         * that sits inside a span. In this function, we change the background on the parent span node, and also the
         * second span that has the end of the input.
         * @param {aria.DomEvent} event Focus event
         * @protected
         */
        _dom_onfocus : function (event) {
            this._hasFocus = true;
            if (!this._keepFocus) {
                var cfg = this._cfg;

                if (cfg.readOnly) {
                    return;
                }

                this.setHelpText(false);
                if (this._isPrefilled) {
                    this.setPrefillText(false);

                    this.checkValue({
                        value : cfg.prefill
                    });
                }
                this.checkValue({
                    stopValueProp : true
                });

                if (this._cfg) {
                    cfg = this._cfg;
                    if (cfg.validationEvent === 'onFocus'
                            && ((cfg.formatError && cfg.formatErrorMessages.length) || (cfg.error && cfg.errorMessages.length))) {
                        this._validationPopupShow();
                    }
                }
                this._updateState();
            } else {
                // restore selection
                var caretPosition = this._currentCaretPosition;
                this._currentCaretPosition = null;
                if (caretPosition) {
                    this.setCaretPosition(caretPosition.start, caretPosition.end);
                }
            }
        },

        /**
         * DOM callback function called when the focus is taken off the input. The onBlur event is available on the
         * input that sits inside a span. In this function, we change the background on the parent span node, and also
         * the second span that has the end of the input.
         * @param {aria.DomEvent} event Blur event
         * @protected
         */
        _dom_onblur : function (event) {
            if (!this._hasFocus) {
                return;
            }
            if (!this._keepFocus) {
                var cfg = this._cfg, htc = this._skinObj.helpText;
                this._hasFocus = false;
                // reinitialize for next time (autoselect feature)
                this._firstFocus = true;
                if (cfg.readOnly) {
                    return;
                }

                this.checkValue();
                // checkvalue might trigger an onchange that disposes the widget, check again this._cfg
                cfg = this._cfg;
                if (!cfg) {
                    return;
                }

                if (cfg.prefill) {
                    this.setPrefillText(true, cfg.prefill, false);
                } else {
                    this.setHelpText(true);
                }

                if (!cfg.directOnBlurValidation) {
                    this.changeProperty("error", false);
                }
                this._updateState();

                if (cfg.formatError && cfg.validationEvent === 'onBlur') {
                    // show errortip on blur used for debug purposes
                    this._validationPopupShow();
                } else {
                    // dispose of error tip
                    this._validationPopupHide();
                    if (cfg.directOnBlurValidation) {
                        if (cfg.bind) {
                            var bind = cfg.bind.value;
                            if (bind) {
                                var dataholder = bind.inside;
                                var name = bind.to;
                                var groups = cfg.validationGroups;
                                aria.utils.Data.validateValue(dataholder, name, null, groups, 'onblur');
                                // PTR05705466: validateValue could have triggered widget dispose, need to re-check
                                // this._cfg before continuing
                                if (!this._cfg) {
                                    return;
                                }
                            }
                        }
                    }
                }

            } else {
                this._currentCaretPosition = this.getCaretPosition();
                // this._hasFocus = false must be after the call of this.getCaretPosition()
                this._hasFocus = false;
            }

        },

        /**
         * Override the $InputWithFrame._setAutomaticBindings in order to add the invalidText and the prefillError
         * property.
         * @param {aria.widgets.CfgBeans.TextInputCfg} cfg Widget configuration
         * @protected
         * @override
         */
        _setAutomaticBindings : function (cfg) {
            this.$InputWithFrame._setAutomaticBindings.call(this, cfg);
            var value = null, prefill = null, metaDataObject;
            if (cfg && cfg.bind) {
                value = cfg.bind.value;
                prefill = cfg.bind.prefill;
            }

            if (value && value.inside) {
                metaDataObject = aria.utils.Data._getMeta(value.inside, value.to, false);
                if (!cfg.bind.invalidText) {
                    cfg.bind.invalidText = {
                        "inside" : metaDataObject,
                        "to" : "invalidText"
                    };
                }
            }
            if (prefill && prefill.inside) {
                metaDataObject = aria.utils.Data._getMeta(prefill.inside, prefill.to, false);
                if (!cfg.bind.prefillError) {
                    cfg.bind.prefillError = {
                        "inside" : metaDataObject,
                        "to" : "error"
                    };
                }
            }

        },

        /**
         * Override the $InputWithFrame.__checkCfgConsistency in order to check the invalidText and restore the error
         * state if needed.
         * @protected
         * @override
         */
        _checkCfgConsistency : function () {
            this.$InputWithFrame._checkCfgConsistency.call(this);

            var cfg = this._cfg;

            if (cfg.autoselect == null) {
                // the default value for autoselect comes from the environment
                cfg.autoselect = aria.widgets.environment.WidgetSettings.getWidgetSettings().autoselect;
            }

            var value = cfg.value;
            if (cfg.invalidText) {
                // Check the field depending on the value and the existing error
                var rep = this.checkValue({
                    text : cfg.invalidText,
                    value : value,
                    performCheckOnly : true
                });
                if (!rep.isValid) {
                    if (cfg.directOnBlurValidation) {
                        this.changeProperty("error", true);
                    }
                    // Just to set the this._helpTextSet to true in this case,
                    // as the invalid text will be displayed:
                    value = cfg.invalidText;
                    this._helpTextSet = false;
                    if (rep.report) {
                        rep.report.$dispose();
                    }
                } else {
                    // for autocomplete, no report is raised. Asynchronous
                    // callback will set proper state
                    if (rep.report) {
                        this.changeProperty("error", false);
                        if (rep.report.text == null || rep.report.text === "") {
                            if (cfg.prefill && cfg.prefill + "") {
                                this._isPrefilled = true;
                            } else {
                                this._helpTextSet = cfg.helptext;
                            }
                        }
                        rep.report.$dispose();
                    }
                }
                this._setState();
            } else {
                // if the value is not set (namely it is null, undefined, an
                // empty string or an empty array) and the
                // prefill is defined
                if ((aria.utils.Type.isArray(value) && aria.utils.Array.isEmpty(value)) || (!value && value !== 0)) {
                    if (cfg.prefill && cfg.prefill + "") {
                        this._isPrefilled = true;
                    } else {
                        this._helpTextSet = cfg.helptext;
                    }
                }
                if (this._isPrefilled) {
                    this._setState();
                }
            }

        },

        /**
         * Set the helptext of the field if needed
         * @param {Boolean} enable Wheter to enable it or not
         */
        setHelpText : function (enable) {
            var cfg = this._cfg;
            // check for disposal
            if (!cfg) {
                return;
            }
            var helpText = cfg.helptext, helpTextConfig = this._skinObj.helpText;
            // stops if no helptext, or trying to disable an helptext that as
            // not been set
            if (!helpText || !this._helpTextSet && !enable || (this._hasFocus || this._keepFocus) && enable) {
                return;
            }

            var field = this.getTextInputField();

            // stops if trying to set a helptext in a field with a value
            if (field.value && enable) {
                return;
            }

            this._helpTextSet = enable;

            if (!field) {
                return;
            }

            // determine new styles and value
            var color = enable ? helpTextConfig.color : this._getTextFieldColor();
            var fontStyle = enable && helpTextConfig.italics ? "italic" : "normal";
            var value = enable ? helpText : "";

            // update styles
            var style = field.style;
            style.color = color;
            style.fontStyle = fontStyle;

            // update field value
            field.value = value;
        },

        /**
         * Set the prefill text of the field if needed
         * @param {Boolean} enable false if you want to leave the prefill state
         * @param {String|Array} value optional string (or array for the multiselect) to fill the field with
         * @param {Boolean} updateState if true a state update is triggered at the end
         */
        setPrefillText : function (enable, value, updateState) {
            var cfg = this._cfg, prefillText;
            // check for disposal
            if (!cfg) {
                return;
            }
            var field = this.getTextInputField();
            if (enable) {
                if (!field || (field.value && !this._helpTextSet && !this._isPrefilled)) {
                    return;
                }

                this.setHelpText(false);

                if (value == null) {
                    prefillText = "";
                } else {
                    prefillText = this._getPrefilledText(value);
                }
                if (cfg.prefillError) {
                    prefillText = "";
                }
                if (!prefillText) {
                    field.value = prefillText;
                    this._isPrefilled = false;
                    this.setHelpText(true);
                    this._updateState();
                } else {
                    this._isPrefilled = true;
                    // update field value
                    field.value = prefillText;
                }

            } else {
                this._isPrefilled = false;
            }
            if (updateState) {
                if (!(enable && this._state == "prefill")) {
                    this._updateState();
                }
            }
        },

        /**
         * Focus this field
         * @param {Array} idArray Path of ids on which we should give focus. Should be empty
         * @param {Boolean} fromSelf Whether the focus is coming from the widget itself. In this case we don't try to
         * autoselect
         * @return {Boolean} true if focus was possible
         * @override
         */
        focus : function (idArray, fromSelf) {
            if (this._cfg.disabled) {
                return false;
            }
            var textInputField = this.getTextInputField();
            textInputField.focus();
            // IE FIX: requires the value to be reset for the cursor to be positioned
            // and focused at the end of the textinput.value string
            textInputField.value = textInputField.value;

            if (!fromSelf) {
                this._autoselect();
            }
        },

        /**
         * If enabled, autoselect the widget text, setting the caret position to the whole input value.
         * @protected
         */
        _autoselect : function () {
            // this._cfg can be null due to the following execution chain: native focus -> native blur -> AutoComplete
            // bound value update in the data model -> bindRefreshTo section refresh
            if (this._firstFocus && this._cfg && this._cfg.autoselect) {
                // this allow to click again and put the cursor at a given position
                this._firstFocus = false;
                var field = this.getTextInputField();
                var start = 0;
                var end = (field.value.length) ? field.value.length : 0;
                if (end) {
                    this.setCaretPosition(start, end);
                }
            }
        }

    }
});
