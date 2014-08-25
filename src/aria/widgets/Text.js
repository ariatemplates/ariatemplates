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
var Aria = require("../Aria");
var ariaUtilsEllipsis = require("../utils/Ellipsis");
require("../DomEvent");
var ariaUtilsDom = require("../utils/Dom");
var ariaUtilsString = require("../utils/String");
var ariaWidgetsWidget = require("./Widget");
var ariaUtilsType = require("../utils/Type");


/**
 * The Text Widget
 * @class aria.widgets.Text Class definition for the Text widget.
 * @extends aria.widgets.Widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.Text",
    $extends : ariaWidgetsWidget,
    /**
     * Text constructor
     * @param {aria.widgets.CfgBeans:Text} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Widget.constructor.apply(this, arguments);

        if (ariaUtilsType.isString(cfg.ellipsis)) {
            this._activateEllipsis = true;
            this._directInit = true;
        }

        this._defaultMargin = 0;
    },
    $destructor : function () {

        this.textContent = null;

        if (this._ellipsis) {
            this._ellipsis.$dispose();
            this._ellipsis = null;
        }

        this._hasMouseOver = null;
        this._hasFocus = null;

        this.$Widget.$destructor.call(this);
    },
    $prototype : {
        /**
         * @protected
         * @type Boolean
         */
        _activateEllipsis : false,

        /**
         * Status flag to check if the widget currently has mouseover
         * @protected
         * @type Boolean
         */
        _hasMouseOver : false,

        /**
         * Status flag to check if the widget currently has the focus
         * @protected
         * @type Boolean
         */
        _hasFocus : false,

        /**
         * Generate the internal widget markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _widgetMarkup : function (out) {
            var textContent = this._cfg.text;
            // String cast
            if (textContent !== null) {
                textContent = '' + textContent;
            } else {
                textContent = '';
            }
            this.textContent = textContent;
            out.write('<span class="createdEllipisElement">' + ariaUtilsString.escapeHTML(this.textContent)
                    + "</span>");
        },

        /**
         * Called when a new instance is initialized
         * @protected
         */
        _init : function () {
            if (this._activateEllipsis === true) {
                this.__ellipseText(this._cfg.text);
            }
        },

        /**
         * Check if the width of text is too long and if so, ellipse it
         * @param {String} textContent the text to be ellipsed
         * @private
         */
        __ellipseText : function (textContent) {
            // String cast
            if (textContent !== null) {
                textContent = '' + textContent;
            } else {
                textContent = '';
            }
            var dom = this.getDom();
            if (dom) {
                var stringUtils = ariaUtilsString;
                this.textContent = textContent;

                dom.style.display = "inline-block";
                dom.style.overflow = "hidden";
                dom.style.whiteSpace = "nowrap";
                dom.style.verticalAlign = "top";

                var textWidth, ellipsisElement = ariaUtilsDom.getDomElementChild(dom, 0);
                if (!ellipsisElement) {
                    dom.innerHTML = '<span class="createdEllipisElement">' + stringUtils.escapeHTML(this.textContent)
                            + '</span>';
                    ellipsisElement = ariaUtilsDom.getDomElementChild(dom, 0);
                }
                if (this._cfg.width > 0) {
                    textWidth = this._cfg.width;
                    dom.style.width = this._cfg.width + "px";

                    this._ellipsis = new ariaUtilsEllipsis(ellipsisElement, textWidth, this._cfg.ellipsisLocation, this._cfg.ellipsis, this._context, this._cfg.ellipsisEndStyle);

                    if (!this._ellipsis.ellipsesNeeded) {
                        // No ellipsis was done so remove the <span> and put the full text into the text widget itself
                        dom.removeChild(ellipsisElement);
                        dom.innerHTML = stringUtils.escapeHTML(textContent);
                    }
                }

            }

        },
        /**
         * Internal method called when one of the model properties that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            var dom = this.getDom();
            if (propertyName == 'text' && newValue !== null) {
                if (this._activateEllipsis) {
                    dom.innerHTML = "";
                    this.__ellipseText(newValue);
                } else {
                    // String cast
                    newValue = '' + newValue;
                    dom.getElementsByTagName("span")[0].innerHTML = ariaUtilsString.escapeHTML(newValue);
                    this.textContent = newValue;
                }
            }
        },

        /**
         * Internal method to handle the mouse over event
         * @protected
         * @param {aria.DomEvent} event
         */
        _dom_onmouseover : function (event) {
            this.$Widget._dom_onmouseover.call(this, event);
            if (this._ellipsis && this._ellipsis.ellipsesNeeded) {
                this._hasMouseOver = true;
                this._ellipsis.displayFullText({
                    left : 0,
                    top : 0
                });
            }
        },

        /**
         * The method called when the mouse leaves the widget
         * @param {aria.DomEvent} event
         * @protected
         */
        _dom_onmouseout : function (event) {
            this.$Widget._dom_onmouseout.call(this, event);
            if (this._ellipsis && this._ellipsis.ellipsesNeeded) {
                if (this._hasFocus === false && this._hasMouseOver === true) {
                    this._hasMouseOver = false;
                    this._ellipsis._hideFullText(event.relatedTarget);
                }
            }
        }

    }
});
