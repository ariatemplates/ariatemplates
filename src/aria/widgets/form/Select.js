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
 * Select widget allows the use of a simple HTML select element or an AT skin version. Class for both versions of Select -
 * simpleHtml and AT skin.
 */
Aria.classDefinition({
    $classpath : "aria.widgets.form.Select",
    $extends : "aria.widgets.form.DropDownInput",
    $dependencies : ["aria.widgets.form.DropDownListTrait", "aria.utils.String",
            "aria.widgets.controllers.SelectController", "aria.utils.Dom"],
    $css : ["aria.widgets.form.SelectStyle", "aria.widgets.form.list.ListStyle", "aria.widgets.container.DivStyle"],
    /**
     * @param {aria.widgets.CfgBeans:SelectCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        this.$DropDownInput.constructor.call(this, cfg, ctxt, lineNumber);

        var skinObj = this._skinObj;
        if (!skinObj.simpleHTML) {
            // the controller is needed only for the skin version
            var controller = new aria.widgets.controllers.SelectController();
            this.controller = controller;
            controller.setListOptions(cfg.options);
        } else {
            // remove any dropdown icon, has this is handled by the select
            skinObj.iconsRight = [];
        }
        this._minInputMarkupWidth = 8; // minimum width for a Select?
        this._defaultInputMarkupWidth = 170; // default input width
        this._customTabIndexProvided = true;

        /**
         * DOM reference of the select field.
         * @private
         * @type HTMLElement
         */
        this._selectField = null;

        /**
         * Whether the width of the popup can be smaller than the field, when configured to be so. If false, the
         * popupWidth property will be overridden when it is smaller than the field width
         * @type Boolean
         * @protected
         */
        this._freePopupWidth = false;

    },
    $destructor : function () {
        // the controller is disposed in DropDownInput
        this.$DropDownInput.$destructor.call(this);
        this._selectField = null;
    },
    $statics : {
        // ERROR MESSAGE:
        WIDGET_OPTIONS_INVALID_VALUE : "%1Bound value stored in the data model is not a valid option value for the select widget."
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Select",

        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         */
        $init : function (p) {
            var src = aria.widgets.form.DropDownListTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[key] = src[key];
                }
            }
        },

        /**
         * Used to check that the value for the widget when it is initialized, is set.
         */
        _checkCfgConsistency : function () {
            this.$DropDownInput._checkCfgConsistency.call(this);
            this._checkValue();
        },

        /**
         * Set the focus on the select field.
         */
        focus : function () {
            var field = this.getSelectField();
            field.focus();

        },

        /**
         * React to controller report, by displaying the text given in the report, opening/closing the popup and
         * updating the value in the data model (if specified in the report and not blocked by stopValueProp option).
         * @param {aria.widgets.controllers.reports.ControllerReport} report
         * @param {Object} arg Optional parameters
         * @protected
         */
        _reactToControllerReport : function (report, options) {
            if (report) {
                var text = report.text;
                var value = report.value;
                var stopValueProp = options ? options.stopValueProp : false;
                if (text != null) {
                    var domElt = this.getSelectField();
                    domElt.innerHTML = aria.utils.String.escapeHTML(text) + '&nbsp;';
                    // the &nbsp; at the end of the label is useful to make sure there is always something in the line
                    // so that the height does not change
                }
                var openDropdown = report.displayDropDown;
                if (typeof value != 'undefined' && stopValueProp !== true) {
                    this._updateValue(true);
                }
                if (this._cfg) {
                    if (openDropdown === true && !this._dropdownPopup) {
                        this._openDropdown();
                    } else if (openDropdown === false && this._dropdownPopup) {
                        this._closeDropdown();
                    }
                }
                report.$dispose();
            }
        },

        /**
         * Checks if the widget value is undefined (only when widget is initialised) If it is then sets the value as the
         * first value in the select options If there is already a value set then checks the value set is a valid value
         * contained in the select options If it isn't then logs an error that the widget value is different from any
         * values in the widgets options.
         */
        _checkValue : function () {
            if (!this._cfg.options.length) {
                return;
            }
            if (typeof this._cfg.value != 'undefined') {
                for (var i = 0; i < this._cfg.options.length; i++) {
                    if (this._cfg.options[i].value === this._cfg.value) {
                        return;
                    }
                }

                this.$logError(this.WIDGET_OPTIONS_INVALID_VALUE);

            } else {
                this.setProperty("value", this._cfg.options[0].value);

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
            } else {
                var state;
                if (this._cfg.mandatory) {
                    state = "mandatory";
                } else {
                    state = "normal";
                }
                if (this._cfg.formatError || this._cfg.error) {
                    state += "Error";
                }
                if (this._hasFocus || this._keepFocus) {
                    state += "Focused";
                }
                this._state = state;
            }
        },

        /**
         * Internal method to handle the blur event
         * @protected
         * @param {aria.DomEvent} event Blur event
         */
        _dom_onblur : function () {
            this._hasFocus = false;
            this._updateState();
            if (this._cfg.formatError && this._cfg.validationEvent === 'onBlur') {// show
                // errortip on blur used for debug purposes
                this._validationPopupShow();
            } else { // dispose of error tip
                this._validationPopupHide();
                if (this._cfg.directOnBlurValidation) {
                    if (this._cfg.bind) {
                        var bind = this._cfg.bind.value;
                        if (bind) {
                            var dataholder = bind.inside;
                            var name = bind.to;
                            var groups = this._cfg.validationGroups;
                            aria.utils.Data.validateValue(dataholder, name, null, groups, 'onblur');
                        }
                    }
                }
            }
            this._updateValue(true);
        },

        /**
         * Internal method to handle the focus event
         * @protected
         * @param {aria.DomEvent} event Focus event
         */
        _dom_onfocus : function () {
            this._hasFocus = true;
            if (this._cfg) {
                if (this._cfg.validationEvent === 'onFocus'
                        && ((this._cfg.formatError && this._cfg.formatErrorMessages.length) || (this._cfg.error && this._cfg.errorMessages.length))) {
                    this._validationPopupShow();
                }
            }
            this._updateState();
        },

        /**
         * Internal method to handle the mousedown event
         * @protected
         * @param {aria.DomEvent} event Mouse down event
         */
        _dom_onmousedown : function (evt) {
            var target = evt.target;
            var inputDomElt = this._getInputMarkupDomElt();
            if (this.controller && aria.utils.Dom.isAncestor(target, inputDomElt)) {
                this._toggleDropdown();
                evt.preventDefault(); // prevent the selection of the text when clicking
            }
        },

        /**
         * Internal method to handle the click event
         * @protected
         * @param {aria.DomEvent} event Click event
         */
        _dom_onclick : function () {
            this._updateValue(false);
        },

        /**
         * Internal method to handle the change event
         * @protected
         * @param {aria.DomEvent} event Change event
         */
        _dom_onchange : function () {
            this._updateValue(false);
        },

        /**
         * Internal method to handle the keypress event
         * @protected
         * @param {aria.DomEvent} event Key press event
         */
        _dom_onkeypress : function (event) {
            var domEvent = aria.DomEvent;
            if (event.keyCode === domEvent.KC_ENTER) {
                this._updateValue(false);
            }
            this.$DropDownInput._dom_onkeypress.call(this, event);
        },

        /**
         * Returns an array of html elements on which it is possible to click without closing the popup. This array is
         * passed in the popup configuration as the ignoreClicksOn property. For the select widget, it returns an array
         * containing both the dropdown icon and the input markup dom element (returned by _getInputMarkupDomElt).
         * @return {Array} array of HTML elements
         * @protected
         */
        _getPopupIgnoreClicksOnDomElts : function () {
            var res = this.$DropDownInput._getPopupIgnoreClicksOnDomElts.call(this);
            res.push(this._getInputMarkupDomElt());
            return res;
        },

        /**
         * Copies the value from the widget to the data model.
         * @param {Boolean} includeController whether to copy the value from the controller to the data model.
         * @protected
         */
        _updateValue : function (includeController) {
            var hasChanged = null;
            if (this._skinObj.simpleHTML) {
                hasChanged = this.setProperty("value", this.getSelectField().value);
            } else if (includeController) {
                var controller = this.controller;
                var dataModel = controller.getDataModel();
                hasChanged = this.setProperty("value", dataModel.value);
            }

            // PTR05634154: setProperty can dispose the widget
            // (that's why we are checking this._cfg)
            if (this._cfg) {
                if (hasChanged != null) {
                    this.changeProperty("error", false);
                    if (!(this._cfg.formatError && this._cfg.formatErrorMessages.length)
                            || (this._cfg.error && this._cfg.errorMessages.length)) {
                        this._validationPopupHide();
                    }
                    if (this._cfg.onchange) {
                        this.evalCallback(this._cfg.onchange);
                    }
                }
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
            this._selectField = this._frame.getChild(0);
        },

        /**
         * Creates the markup for the select for both the simple HTML and AT skin versions.
         * @param {aria.templates.MarkupWriter} out Markup writer
         * @protected
         */
        _inputWithFrameMarkup : function (out) {
            var cfg = this._cfg;
            var width = this._frame.innerWidth;
            var disabledOrReadonly = cfg.disabled || cfg.readOnly;
            var tabIndex = disabledOrReadonly ? '' : ' tabindex="' + this._calculateTabIndex() + '"';
            if (this._skinObj.simpleHTML) {
                var stringUtils = aria.utils.String;
                var options = cfg.options;
                var selectedValue = cfg.value;
                /*
                 * The _ariaInput attribute is present so that pressing ENTER on this widget raises the onSubmit event
                 * of the fieldset:
                 */
                var html = ['<select', Aria.testMode ? ' id="' + this._domId + '_input"' : '',
                        (width > 0) ? ' style="width: ' + width + 'px;" ' : '', tabIndex,
                        disabledOrReadonly ? ' disabled="disabled"' : '', ' _ariaInput="1">'];

                for (var i = 0, l = options.length; i < l; i++) {
                    // string cast, otherwise encoding will fail
                    var optValue = '' + options[i].value;
                    html.push('<option value="', stringUtils.encodeForQuotedHTMLAttribute(optValue), '"', optValue == selectedValue
                            ? ' selected="selected"'
                            : '', '>', stringUtils.escapeHTML(options[i].label), '</option>');
                }

                html.push('</select>');

                out.write(html.join(''));
            } else {
                var report = this.controller.checkValue(cfg.value);
                var text = report.text;
                report.$dispose();
                // The _ariaInput attribute is present so that pressing ENTER on this widget raises the onSubmit event
                // of the fieldset:
                out.write(['<span', Aria.testMode ? ' id="' + this._domId + '_input"' : '', ' class="xSelect" style="',
                        (width > 0) ? 'width:' + width + 'px;' : '', '"', tabIndex, ' _ariaInput="1">',
                        aria.utils.String.escapeHTML(text), '&nbsp;</span>'].join(''));
                // the &nbsp; at the end of the label is useful to make sure there is always something in the line so
                // that the height does not change
            }

        },

        /**
         * Internal method called when the value property that the select is bound to has changed.
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         * @protected
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName === 'value') {
                this._checkValue();// checks the value changed in the data model is a valid value from the select
                // options
                if (this.controller) {
                    var report = this.controller.checkValue(newValue);
                    this._reactToControllerReport(report, {
                        stopValueProp : true
                    });
                } else {
                    var selectField = this.getSelectField();
                    for (var i = 0; i < selectField.options.length; i++) {
                        if (selectField.options[i].value === newValue) {
                            selectField.options[i].selected = true;
                            break;
                        }
                    }
                }
            } else if (propertyName === 'mandatory') {
                this._updateState();
            } else if (propertyName === 'readOnly' || propertyName === 'disabled') {
                var selectField = this.getSelectField();
                var disabledOrReadonly = this.getProperty("disabled") || this.getProperty("readOnly");
                if (this._skinObj.simpleHTML) {
                    selectField.disabled = disabledOrReadonly ? "disabled" : "";
                }
                var tabIndex = disabledOrReadonly ? -1 : this._calculateTabIndex();
                selectField.tabIndex = tabIndex;
                this._updateState();
            } else if (propertyName === 'options') {
                if (this.controller) {
                    this.controller.setListOptions(newValue);
                    var report = this.controller.checkValue(null);
                    this._reactToControllerReport(report, {
                        stopValueProp : true
                    });
                } else {
                    // markup for the options
                    var optionsMarkup = [];
                    var stringUtils = aria.utils.String;
                    for (var i = 0, l = newValue.length; i < l; i++) {
                        // string cast, otherwise encoding will fail
                        var optValue = '' + newValue[i].value;
                        optionsMarkup.push('<option value="', stringUtils.encodeForQuotedHTMLAttribute(optValue), '">', stringUtils.escapeHTML(newValue[i].label), '</option>');
                    }

                    var selectField = this.getSelectField();
                    // update the options list
                    var optionsListString = optionsMarkup.join('');
                    if (aria.core.Browser.isIE9 || aria.core.Browser.isIE8 || aria.core.Browser.isIE7) {
                        // innerHTML replacing in IE truncates the first element and breaks the whole select...
                        selectField.innerHTML = '';
                        var helperDiv = Aria.$window.document.createElement('div');
                        helperDiv.innerHTML = '<select>' + optionsListString + '</select>';
                        for (var j = 0, options = helperDiv.children[0].children; j < options.length; j++) {
                            selectField.appendChild(options[j]);
                        }
                    } else {
                        selectField.innerHTML = optionsListString;
                    }
                }

            } else if (propertyName === 'formatError' || propertyName === 'formatErrorMessages'
                    || propertyName === 'error' || propertyName === 'errorMessages') {
                this._cfg[propertyName] = newValue;
                this._updateState();
            } else {
                this.$DropDownInput._onBoundPropertyChange.apply(this, arguments);
            }
        },

        /**
         * Returns the select element.
         * @return {HTMLElement}
         */
        getSelectField : function () {
            if (!this._selectField && !this._initDone) {
                this.getDom();
            }
            return this._selectField;
        },

        getTextInputField : function () {
            return this.getSelectField();
        }
    }
});
