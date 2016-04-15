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
var ariaUtilsDom = require("../../utils/Dom");
var ariaUtilsData = require("../../utils/Data");
var ariaUtilsString = require("../../utils/String");
var ariaWidgetsEnvironmentWidgetSettings = require("../environment/WidgetSettings");
var ariaCoreBrowser = require("../../core/Browser");
var ariaWidgetsWidgetTrait = require("../WidgetTrait");
var ariaWidgetsWidget = require("../Widget");
var ariaUtilsJson = require("../../utils/Json");

/**
 * Base class for all input widgets. Manage input data structure and properties, as well as the label support
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.Input",
    $extends : ariaWidgetsWidget,
    /**
     * Input constructor
     * @param {aria.widgets.CfgBeans:InputCfg} cfg the widget configuration
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
         * LabelId
         * @type String
         */
        this._labelId = (this._cfg.waiAria && !this._cfg.hideLabel) ? this._createDynamicId() : null;

        /**
         * Flag for input that has to be displayed in full width
         * @type Boolean
         * @protected
         */
        this._fullWidth = false;

        /**
         * Height of the label.
         * @type Number
         * @protected
         */
        this._inputMarkupHeight = -1;

        /**
         * @type Boolean
         * @private
         */
        this._isIE7OrLess = ariaCoreBrowser.isOldIE && ariaCoreBrowser.majorVersion < 8;
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
            var src = ariaWidgetsWidgetTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[key] = src[key];
                }
            }
            // we add the bindable properties to the Widget prototype
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
         * Gets a labelled element, should be overwritten by the child classes.
         */
        _getLabelledElement : function () {
            // overwrite from the child classes
        },

        /**
         * Returns the markup for the aria-label related attributes on a DOM element if accessibility is enabled.
         * @protected
         */
        _getAriaLabelMarkup : function () {
            var markup = [];
            if (this._cfg.waiAria) {
              if (this._cfg.waiLabel) {markup.push(' aria-label="' + ariaUtilsString.encodeForQuotedHTMLAttribute(this._cfg.waiLabel) + '" ');}
              if (this._cfg.waiLabelledBy) {markup.push(' aria-labelledby="' + ariaUtilsString.encodeForQuotedHTMLAttribute(this._cfg.waiLabelledBy) + '" ');}
              if (this._cfg.waiDescribedBy) {markup.push(' aria-describedby="' + ariaUtilsString.encodeForQuotedHTMLAttribute(this._cfg.waiDescribedBy) + '" ');}
            }
            return markup.join('');
        },

        /**
         * Returns the markup for the aria-hidden attribute on a DOM element if accessibility is enabled.
         * @protected
         */
        _getAriaLabelHiddenMarkup : function () {
            if (this._cfg.waiAria && this._cfg.waiLabelHidden) {
              return ' aria-hidden="true"';
            }
            return '';
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

            if (this._isIE7OrLess) {
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
                    if (this._fullWidth) {
                        this._inputLabelMarkup(out, 'inline-block', 'left');
                        this._inputMarkup(out);
                    } else {
                        this._inputMarkup(out);
                        this._inputLabelMarkup(out, 'inline-block', 'left');
                    }
                }

            } else {
                // no label
                this._inputMarkup(out);
            }
            if (this._isIE7OrLess) {
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
                idx = ((cfg.labelPos === "right" && !this._fullWidth) || cfg.labelPos === "bottom") ? 0 : 1;
            } else {
                idx = 0;
            }
            var dom = this.getDom();
            if (this._isIE7OrLess) {
                dom = dom ? dom.firstChild : null;
            }
            return ariaUtilsDom.getDomElementChild(dom, idx);
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
                if (this._isIE7OrLess) {
                    dom = dom ? dom.firstChild : null;
                }
                var elems = ariaUtilsDom.getDomElementsChildByTagName(dom, 'label');
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
         * @param {aria.widgets.CfgBeans:InputCfg} cfg Widget configuration object
         * @param {String} cssDisplay type of CSS display: 'block' or 'inline-block'
         * @protected
         */
        _inputLabelMarkup : function (out, cssDisplay, margin) {
            var cfg = this._cfg;
            var labelId = (this._labelId) ? 'id="' + this._labelId + '" ' : '';

            // PTR04951216 skinnable labels
            var cssClass = 'class="x' + this._skinnableClass + '_' + cfg.sclass + '_' + this._state + '_label'
                    + this._getFloatingLabelClass() + '"';
            var IE7Align = ariaCoreBrowser.isIE7 ? "-25%" : (cfg.verticalAlign) ? cfg.verticalAlign : "middle";
            out.write('<label ' + labelId + cssClass + ' style="');
            if (!ariaWidgetsEnvironmentWidgetSettings.getWidgetSettings().middleAlignment) {
                out.write('vertical-align:-1px;');
            } else {
                out.write('vertical-align:' + IE7Align + ';');
            }
            if (ariaCoreBrowser.isIE7 && cssDisplay === "inline-block") {
                out.write('display:inline;zoom:1');
            } else {
                out.write('display:' + cssDisplay);
            }
            if (margin) {
                out.write(';margin-' + margin + ':' + this._labelPadding + 'px');
            }
            if (cfg.labelWidth > -1) {
                out.write(';width:' + cfg.labelWidth + 'px');
            }
            if (cfg.labelHeight > -1) {
                out.write(';height:' + cfg.labelHeight + 'px');
            }
            out.write(';text-align:' + cfg.labelAlign + ';"');
            out.write(this._getAriaLabelHiddenMarkup());
            out.write('>');
            out.write(ariaUtilsString.escapeHTML(cfg.label));

            out.write('</label>');
        },

        /**
         * Internal method used to compute when the input needs a css class in order to make the label float.
         * @return {String}
         * @protected
         */
        _getFloatingLabelClass : function () {
            var cfg = this._cfg;

            if (this._fullWidth) {
                if (cfg.labelPos === "right") {
                    return " xFloatLabelRight";
                } else if (cfg.labelPos === "left") {
                    return " xFloatLabelLeft";
                }
            }
            return "";
        },

        /**
         * Updates the CSS class of the label to match the current state of the widget.
         */
        _updateLabelState : function () {
            var label = this.getLabel();
            if (label) {
                label.className = 'x' + this._skinnableClass + '_' + this._cfg.sclass + '_' + this._state + '_label'
                        + this._getFloatingLabelClass();
            }
        },

        /**
         * Internal function called before markup generation to check the widget configuration consistency (e.g. make
         * sure that the label width is less than the widget width, etc..) When called the cfg structure has already
         * been normalized from its bean definition Note: this method must be overridden if extra-checks have to be made
         * in sub-widgets
         * @param {aria.widgets.CfgBeans:InputCfg} cfg
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
                cfg.directOnBlurValidation = ariaWidgetsEnvironmentWidgetSettings.getWidgetSettings().directOnBlurValidation;
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
                    ariaUtilsJson.setValue(binding.inside, binding.to, false);
                }
            } else if (propertyName === "label") {
                this._cfg[propertyName] = newValue;
                var label = this.getLabel();
                if (label) {
                    label.innerHTML = ariaUtilsString.escapeHTML(newValue);
                }
            }
            return this.$Widget._onBoundPropertyChange.apply(this, arguments);
        },

        /**
         * Apply the automatic bindings
         * @param {aria.widgets.CfgBeans:InputCfg|aria.widgets.CfgBeans:ActionWidgetCfg} cfg
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
                metaDataObject = ariaUtilsData._getMeta(value.inside, value.to, false);
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
