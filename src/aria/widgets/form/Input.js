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
 * Base class for all input widgets. Manage input data structure and properties, as well as the label support
 */
Aria.classDefinition({
    $classpath : "aria.widgets.form.Input",
    $extends : "aria.widgets.Widget",
    $dependencies : ["aria.utils.Dom", "aria.widgets.form.InputValidationHandler", "aria.utils.Data",
            "aria.utils.String", "aria.widgets.environment.WidgetSettings", "aria.core.Browser"],
    /**
     * Input constructor
     * @param {aria.widgets.CfgBeans.InputCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this._setAutomaticBindings(cfg);
        this.$Widget.constructor.apply(this, arguments);
        /**
         * 1 Minimum width in px that must be kept for the input markup To be overridden by sub-classes
         * @type Number
         * @protected
         */
        this._minInputMarkupWidth = 5;

        /**
         * Default value to assign to _inputMarkupWidth if no constraint apply
         * @type Number
         * @protected
         */
        this._defaultInputMarkupWidth = -1;

        /**
         * The amount of padding that should be put between the label and the field if the labelPos is left or right
         * @type Number
         * @protected
         */
        this._labelPadding = 2;

        /**
         * Maximum size to assign to the width of the input if the value passed is too big
         * @type Number
         * @protected
         */
        this._maxInputMarkupWidth = -1;

        /**
         * Width of the input.
         * @type Number
         * @protected
         */
        this._inputMarkupWidth = -1;

        /**
         * Label DOM element
         * @type HTMLElement
         * @protected
         */
        this._label = null;

        /**
         * Height of the label.
         * @type Number
         * @protected
         */
        this._inputMarkupHeight = -1;
    },
    $destructor : function () {
        if (this._onValidatePopup) {
            this._onValidatePopup.$dispose();
            this._onValidatePopup = null;
        }
        this._label = null;
        this.$Widget.$destructor.call(this);
    },
    $statics : {
        // ERROR MESSAGES:
        WIDGET_INPUT_NO_LABEL : "%1Label HTML Element was not found.",
        WIDGET_INPUT_TOO_MANY_LABELS : "%1More than one label HTML Element has been found."
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
            // prototype initialization function
            // we add the bindable properties to the Widget prototype
            p.bindableProperties = p.bindableProperties.concat(["label", "value", "mandatory", "readOnly", "disabled",
                    "error"]);
            p.automaticallyBindedProperties = ["formatError", "formatErrorMessages", "error", "errorMessages",
                    "requireFocus"];
        },

        /**
         * Override the Widget _init method
         * @protected
         */
        _init : function () {
            var elt = this._getInputMarkupDomElt();
            if (elt) {
                this._initInputMarkup(elt);
            }
            var lbl = this._getInputLabelMarkupDomElt();
            if (lbl) {
                this._initLabelMarkup(lbl);
            }
        },

        /**
         * Initialization function to override to initialize the input markup elements
         * @param {HTMLElement} elt the Input markup DOM elt - never null
         * @protected
         */
        _initInputMarkup : function (elt) {},

        /**
         * Initializes the label markup element
         * @param {HTMLElement} Dom element
         * @protected
         */
        _initLabelMarkup : function (elt) {
            this._label = elt;
        },

        /**
         * Internal method called when getMarkup() is called Generate the input markup: label + input-specific markup
         * @see getMarkup()
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkup : function (out) {

            var cfg = this._cfg, showLabel = (!cfg.hideLabel && !!cfg.label);
            var isIE7 = aria.core.Browser.isIE7;
            if (isIE7) {
                out.write('<span style="display: inline-block;">');
            }
            if (showLabel) {
                // process label
                if (cfg.labelPos === "left") {
                    this._inputLabelMarkup(out, 'inline-block', 'right');
                    this._inputMarkup(out);
                } else if (cfg.labelPos === "top") {
                    this._inputLabelMarkup(out, 'block', false);
                    this._inputMarkup(out);
                } else if (cfg.labelPos === "bottom") {
                    this._inputMarkup(out);
                    this._inputLabelMarkup(out, 'block', false);
                } else { // right
                    this._inputMarkup(out);
                    this._inputLabelMarkup(out, 'inline-block', 'left');
                }

            } else {
                // no label
                this._inputMarkup(out);
            }
            if (isIE7) {
                out.write('</span>');
            }
        },

        /**
         * Get the DOM elt associated to the Input Markup placeholder
         * @return {HTMLElement} the dom elt or null if not found
         * @protected
         */
        _getInputMarkupDomElt : function () {
            var cfg = this._cfg, showLabel = (!cfg.hideLabel && !!cfg.label), idx;
            if (showLabel) {
                if (cfg.labelPos === "right" || cfg.labelPos === "bottom") {
                    idx = 0;
                } else {
                    idx = 1;
                }
            } else {
                idx = 0;
            }
            var dom = this.getDom();
            if (aria.core.Browser.isIE7) {
                dom = dom ? dom.firstChild : null;
            }
            return aria.utils.Dom.getDomElementChild(dom, idx);
        },
        /**
         * Get the DOM elt associated to the Label Markup HTML element
         * @return {HTMLElement} Label element
         * @protected
         */
        _getInputLabelMarkupDomElt : function () {
            var cfg = this._cfg, showLabel = (!cfg.hideLabel && !!cfg.label);
            if (showLabel) {
                var dom = this.getDom();
                if (aria.core.Browser.isIE7) {
                    dom = dom ? dom.firstChild : null;
                }
                var elems = aria.utils.Dom.getDomElementsChildByTagName(dom, 'label');
                if (elems) {
                    if (elems.length === 0) {
                        this.$logError(this.WIDGET_INPUT_NO_LABEL, []);
                    } else if (elems.length == 1) {
                        return elems[0];
                    } else {
                        this.$logError(this.WIDGET_INPUT_TOO_MANY_LABELS, []);
                    }
                }
            }
            return null;
        },

        /**
         * Return the label element generated by the Input class
         * @return {HTMLElement}
         * @public
         */
        getLabel : function () {
            if (!this._label && !this._initDone) {
                // this will do the correct mapping
                this.getDom();
            }
            return this._label;
        },
        /**
         * Internal method to override to process the input block markup
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _inputMarkup : function (out) {},

        /**
         * Internal method used to process the label markup
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @param {aria.widgets.CfgBeans.InputCfg} cfg Widget configuration object
         * @param {String} cssDisplay type of CSS display: 'block' or 'inline-block'
         * @protected
         */
        _inputLabelMarkup : function (out, cssDisplay, margin) {
            var cfg = this._cfg;

            // PTR04951216 skinnable labels
            var cssClass = 'class="x' + this._skinnableClass + '_' + cfg.sclass + '_' + this._state + '_label"';
            var IE7Align;
            (aria.core.Browser.isIE7) ? (IE7Align = "-25%") : (IE7Align = "middle");
            out.write('<label ' + cssClass + ' style="');
            if (!aria.widgets.environment.WidgetSettings.getWidgetSettings().middleAlignment) {
                out.write('vertical-align:-1px;');
            } else {
                out.write('vertical-align:' + IE7Align + ';');
            }
            out.write('display:' + cssDisplay);
            if (margin) {
                out.write(';margin-' + margin + ':' + this._labelPadding + 'px');
            }
            if (cfg.labelWidth > -1) {
                out.write(';width:' + cfg.labelWidth + 'px');
            }
            if (cfg.labelHeight > -1) {
                out.write(';height:' + cfg.labelHeight + 'px');
            }
            out.write(';text-align:' + cfg.labelAlign + ';">');
            out.write(aria.utils.String.escapeHTML(cfg.label));

            out.write('</label>');
        },

        /**
         * Internal function called before markup generation to check the widget configuration consistency (e.g. make
         * sure that the label width is less than the widget width, etc..) When called the cfg structure has already
         * been normalized from its bean definition Note: this method must be overridden if extra-checks have to be made
         * in sub-widgets
         * @param {aria.widgets.CfgBeans.InputCfg} cfg
         * @protected
         */
        _checkCfgConsistency : function () {
            var cfg = this._cfg, ww = cfg.width, // widget width
            isTopLabel = (cfg.labelPos === "top" || cfg.labelPos === "bottom"), showLabel = (!cfg.hideLabel && !!cfg.label), lw;

            if (ww > -1) {
                // check that ww is not too small
                if (ww < this._minInputMarkupWidth) {
                    ww = this._minInputMarkupWidth;
                }
                lw = cfg.labelWidth;
                if (showLabel && lw > -1) {
                    if (isTopLabel) {
                        if (lw < ww) {
                            lw = ww; // label should take the whole width
                        } else if (lw > ww) {
                            ww = lw; // take the bigger width
                        }
                        this._inputMarkupWidth = ww;
                    } else {
                        // labelPos=="left" or "right"

                        // make sure lw+_minInputMarkupWidth<=ww
                        if (lw + this._minInputMarkupWidth > ww) {
                            // log error?
                            ww = lw + this._minInputMarkupWidth;
                            this._inputMarkupWidth = this._minInputMarkupWidth;
                        } else {
                            // this._inputMarkupWidth=ww-lw
                            this._inputMarkupWidth = ww - lw;
                        }
                    }
                    cfg.labelWidth = lw;
                } else {
                    // no label - inputMarkup takes the whole space
                    this._inputMarkupWidth = ww;
                }

                cfg.width = ww;
            }

            // set the default input markup width if no other constraint apply
            if (this._inputMarkupWidth < 0) {
                this._inputMarkupWidth = this._defaultInputMarkupWidth;
            }
            if (showLabel && !isTopLabel) {
                this._inputMarkupWidth -= this._labelPadding;
            }

            if (cfg.directOnBlurValidation == null) {
                // the default value for directOnBlurValidation comes from the
                // environment
                cfg.directOnBlurValidation = aria.widgets.environment.WidgetSettings.getWidgetSettings().directOnBlurValidation;
            }

            if (cfg.height > -1) {
                this._inputMarkupHeight = cfg.height;

                if (showLabel && isTopLabel) {
                    this._inputMarkupHeight -= cfg.labelHeight;
                }
            }
            // call back parent consistency check
            this.$Widget._checkCfgConsistency.call(this);
        },

        /**
         * Method used when a validation popup is needed for an input field
         * @protected
         */
        _validationPopupShow : function () {
            // check validation popup isn't already displayed
            if (!this._onValidatePopup) {
                this._onValidatePopup = new aria.widgets.form.InputValidationHandler(this);
            }
            this._onValidatePopup.show();
        },

        /**
         * Method used to close the validation popup of an input field
         * @protected
         */
        _validationPopupHide : function () {
            if (this._onValidatePopup) {
                this._onValidatePopup.hide();
            }
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
            if (propertyName === "requireFocus") {
                if (!newValue || !this.focus || this._cfg.disabled) {
                    // nothing to do if the focus is not required, if we have no
                    // focus method, or if
                    // the widget is disabled
                    return;
                }
                // The requireFocus binding is a special one as we change back
                // the property
                // to false as soon as a widget handles the property.
                var binding = this._cfg.bind[propertyName];
                var curValue = binding.inside[binding.to];
                // We check the actual value in the data model because there can
                // be several widgets
                // linked to the same part of the data model.
                // Only one will have the focus: the first non disabled widget
                // whose _onBoundPropertyChange is called.
                if (curValue) {
                    // the value is still true in the data model
                    // we set the focus on the input and immediately set the
                    // value back to false in the data model
                    this.focus();
                    aria.utils.Json.setValue(binding.inside, binding.to, false);
                }
            } else if (propertyName === "label") {
                this._cfg[propertyName] = newValue;
                var label = this.getLabel();
                if (label) {
                    label.innerHTML = aria.utils.String.escapeHTML(newValue);
                }
            }
            return this.$Widget._onBoundPropertyChange.apply(this, arguments);
        },

        /**
         * Apply the automatic bindings
         * @param {aria.widgets.CfgBeans.InputCfg} cfg
         * @protected
         */
        _setAutomaticBindings : function (cfg) {
            var metaDataObject, localMetaDataObject, localMetaParam;
            var toBind = this.automaticallyBindedProperties;
            var value = null;
            if (cfg) {
                if (cfg.bind) {
                    value = cfg.bind.value; // get any binding on the value
                    // property
                }
            }

            if (value && value.inside) { // only add the meta data convention
                // if a value property has been
                // bound
                metaDataObject = aria.utils.Data._getMeta(value.inside, value.to, false);
                if (!cfg.bind.error) {
                    cfg.bind.error = {
                        "inside" : metaDataObject,
                        "to" : "error"
                    };
                }
                if (!cfg.bind.errorMessages) {
                    cfg.bind.errorMessages = {
                        "inside" : metaDataObject,
                        "to" : "errorMessages"
                    };
                }
                // TODO: need a separation of each widget instances
                // formatErrorMessages,
                // currently no way to reference a widget after it has been
                // disposed.
                // Once this has been resolved then the widget instance
                // reference can be used to create special meta to
                // separate each widgets formatErrorMessages.
                if (!cfg.bind.formatErrorMessages) {
                    cfg.bind.formatErrorMessages = {
                        "inside" : metaDataObject,
                        "to" : "formatErrorMessages"
                    };
                }
                if (!cfg.bind.requireFocus) {
                    cfg.bind.requireFocus = {
                        "inside" : metaDataObject,
                        "to" : "requireFocus"
                    };
                }

                if (cfg.inputMetaData) { // check to see if the inputMetaData
                    // convention is needed, then add
                    // the meta
                    // data for the rest of the automatic bindings
                    localMetaParam = "local:" + cfg.inputMetaData;
                    localMetaDataObject = metaDataObject[localMetaParam];
                    if (localMetaDataObject == null) {
                        localMetaDataObject = {};
                        metaDataObject[localMetaParam] = localMetaDataObject;
                    }

                    for (var i = 0; i < toBind.length; i++) {
                        if (!cfg.bind[toBind[i]]) { // only add a binding if one
                            // doesn't exist
                            cfg.bind[toBind[i]] = {
                                "inside" : localMetaDataObject,
                                "to" : toBind[i]
                            };
                        }
                    }
                }
            }
        }
    }
});