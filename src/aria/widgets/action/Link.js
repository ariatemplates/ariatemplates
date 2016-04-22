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
var ariaUtilsString = require("../../utils/String");
var ariaWidgetsActionLinkStyle = require("./LinkStyle.tpl.css");
var ariaWidgetsActionActionWidget = require("./ActionWidget");


/**
 * Class definition for the link widget.
 * @class aria.widgets.action.Link
 * @extends aria.widgets.action.ActionWidget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.action.Link",
    $extends : ariaWidgetsActionActionWidget,
    $css : [ariaWidgetsActionLinkStyle],
    /**
     * ActionWidget constructor
     * @param {aria.widgets.CfgBeans:ActionWidgetCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$ActionWidget.constructor.apply(this, arguments);
        this._pressed = false;
        this._customTabIndexProvided = true;
        /**
         * Tells if a key down event happened before the last click event. This prevents an enter event to fire the
         * action twice.
         * @protected
         * @type Boolean
         */
        this._keyPressed = false;

    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Link",

        /**
         * Generate the internal widget markup
         * @param {aria.templates.MarkupWriter} out Markup Writer
         * @protected
         */
        _widgetMarkup : function (out) {
            var cfg = this._cfg;
            var linkClass = "xLink_" + cfg.sclass;
            if (cfg.disabled) {
                linkClass = "xLink_" + cfg.sclass + "_disabled xLink_disabled";
            }
            out.write(['<a', Aria.testMode ? ' id="' + this._domId + '_link"' : '', ' class="', linkClass,
                    '" href="javascript:(function(){})()"',
                    (cfg.tabIndex != null ? ' tabindex=' + this._calculateTabIndex() + '"' : ''), this._getAriaLabelMarkup(), '>',
                    ariaUtilsString.escapeHTML(cfg.label), '</a>'].join(''));
            cfg = null;
        },

        /**
         * Called when a new instance is initialized
         * @protected
         */
        _init : function () {
            this._focusElt = this.getDom().firstChild;
            this.$ActionWidget._init.call(this);
        },

        /**

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
         * React to delegated key down events
         * @protected
         * @param {aria.DomEvent} domEvt Event
         */
        _dom_onkeydown : function (domEvt) {
            if (domEvt.keyCode == aria.DomEvent.KC_ENTER) {
                this._keyPressed = true;

                domEvt.stopPropagation();
                return false;
            }
            return true;
        },

        /**
         * The method called when the markup is clicked
         * @param {aria.DomEvent} evt
         * @private
         */
        _dom_onclick : function (domEvent) {
            // Otherwise we will leave the application
            domEvent.preventDefault();
            if (this._keyPressed) {
                return false;
            } else {
                return this.$ActionWidget._dom_onclick.apply(this, arguments);
            }
        },

        /**
         * React to delegated key up events
         * @protected
         * @param {aria.DomEvent} domEvt Event
         */
        _dom_onkeyup : function (domEvt) {
            if (domEvt.keyCode == aria.DomEvent.KC_ENTER) {
                if (this._keyPressed) {
                    this._keyPressed = false;
                    if (!this._performAction(domEvt)) {
                        domEvt.stopPropagation();
                        return false;
                    }
                }
            }
            return true;
        },

        _dom_onblur : function (domEvent) {
            this._keyPressed = false;
        },

        /**
         * A method called when a bindable property has changed in the data model
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value. If transformation is used, refers to widget value and not data model
         * value.
         * @param {Object} oldValue the old property value. If transformation is used, refers to widget value and not
         * data model value.
         * @protected
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            this.$ActionWidget._onBoundPropertyChange.apply(this, arguments);
            if (propertyName === "disabled") {
                this._cfg[propertyName] = newValue;
                this._updateState();
            }

        },
        /**
         * Internal method to update the state of the widget
         * @protected
         */
        _updateState : function () {
            if (this._focusElt) {
                var cfg = this._cfg, linkClass = "xLink_" + cfg.sclass;
                if (cfg.disabled) {
                    linkClass = "xLink_" + cfg.sclass + "_disabled xLink_disabled";
                }
                this._focusElt.className = linkClass;
            }
        }
    }
});
