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
require("../../utils/Function");
var ariaUtilsDom = require("../../utils/Dom");
var ariaTemplatesDomEventWrapper = require("../../templates/DomEventWrapper");
var ariaWidgetsWidgetTrait = require("../WidgetTrait");
var ariaWidgetsWidget = require("../Widget");


/**
 * @class aria.widgets.action.ActionWidget Base class for all action widgets such as buttons, icon buttons and links.
 * This class will handle the onclick action.
 * @extends aria.widget.Widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.action.ActionWidget",
    $extends : ariaWidgetsWidget,
    /**
     * ActionWidget constructor
     * @param {aria.widgets.CfgBeans:ActionWidgetCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber line number in current template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$Widget.constructor.apply(this, arguments);

        /**
         * TODOC
         * @protected
         * @type HTMLElement
         */
        this._actingDom = null;
    },
    $destructor : function () {
        if (this._onValidatePopup) {
            this._onValidatePopup.$dispose();
            this._onValidatePopup = null;
        }
        if (this._actingDom) {
            this._actingDom = null;
        }

        this.$Widget.$destructor.call(this);
    },
    $prototype : {
        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         */
        $init : function (p) {
            var src = ariaWidgetsWidgetTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[key] = src[key];
                }
            }
        },

        /**
         * Called when a new instance is initialized
         * @protected
         */
        _init : function () {

            var actingDom = ariaUtilsDom.getDomElementChild(this.getDom(), 0);
            if (actingDom) {
                this._actingDom = actingDom;
                this._initActionWidget(actingDom);
            }
            actingDom = null;
        },

        /**
         * A method available to inheriting classes to be called at the end of the instance _init method
         * @param {HTMLElement} actingDom
         * @private
         */
        _initActionWidget : function (actingDom) {},

        /**
         * The method called when the markup is clicked
         * @param {aria.DomEvent} domEvent
         * @method
         * @private
         */
        _dom_onclick : function (domEvent) {
            this._performAction(domEvent);
        },

        /**
         * Performs the action associated with the widget. Normally called for example when clicked or a key is pressed
         */
        _performAction : function (domEvent) {
            var cfg = this._cfg;
            if (cfg) {
                var domEvtWrapper;
                if (domEvent) {
                    domEvtWrapper = new ariaTemplatesDomEventWrapper(domEvent);
                }
                var returnValue = this.evalCallback(cfg.onclick, domEvtWrapper);
                if (domEvtWrapper) {
                    domEvtWrapper.$dispose();
                }
                if (cfg.error && cfg.errorMessages.length) {
                    this._validationPopupShow();
                } else {
                    this._validationPopupHide();
                }
                return returnValue;
            }
            return true;
        },

        /**
         * Focus the Element
         */
        focus : function () {
            if (!this._focusElt) {
                this.getDom();
            }
            this._focusElt.focus();
        }
    }
});
