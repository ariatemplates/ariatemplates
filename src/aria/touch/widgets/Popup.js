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
var ariaTouchWidgetsPopupCSS = require("./PopupCSS.tpl.css");
require("./PopupCfgBeans");
var ariaUtilsDom = require("../../utils/Dom");
require("../../utils/Mouse");
var ariaUtilsJson = require("../../utils/Json");
var ariaWidgetLibsBindableWidget = require("../../widgetLibs/BindableWidget");
var ariaCoreJsonValidator = require("../../core/JsonValidator");


/**
 * Popup Widget.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.touch.widgets.Popup",
    $extends : ariaWidgetLibsBindableWidget,
    $css : [ariaTouchWidgetsPopupCSS],
    $statics : {
        BINDING_NEEDED : "The property '%2' from Widget %1 should be bound to a data model",
        CSS_CLASS : "touchLibPopup",
        WIDGET_CFG : "aria.touch.widgets.PopupCfgBeans.PopupCfg"
    },
    /**
     * Popup Constructor.
     * @param {aria.touch.widgets.PopupCfgBeans:PopupCfg} cfg popup configuration
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$BindableWidget.constructor.apply(this, arguments);

        this._cfgOk = ariaCoreJsonValidator.validateCfg(this.WIDGET_CFG, cfg);

        if (!this._cfgOk) {
            return;
        }

        this._registerBindings();

        /**
         * Id generated for the button DOM element of the slider.
         * @type String
         * @protected
         */
        this._domId = cfg.id ? context.$getId(cfg.id) : this._createDynamicId();

    },
    $prototype : {
        /**
         * Return the configured id of the widget, this is used by the section to register the widget's behavior
         * @return {String}
         */
        getId : function () {
            return this._cfg.id;
        },

        /**
         * Write the widget markup
         * @param {aria.templates.MarkupWriter} out Markup writer
         * @override
         */
        writeMarkup : function (out) {
            // just create an empty section to start with
            out.beginSection({
                id : "__popup_" + this._domId
            });

            out.endSection();
        },

        /**
         * Method called when the popup is not used as a container
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _widgetMarkup : function (out) {
            this._widgetMarkupBegin(out);
            this._widgetMarkupEnd(out);
        },

        /**
         * Widget markup starts here
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupBegin : function (out) {
            out.beginSection({
                id : "__popup_" + this._domId
            });
        },

        /**
         * Widget markup ends here
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupEnd : function (out) {
            out.endSection();
        },

        /**
         * Callback called when the popup's main section is refreshed
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @private
         */
        _writerCallback : function (out) {
            out.write("<div class=\"" + this.CSS_CLASS + "\">");

            if (this._cfg.contentMacro) {
                out.callMacro(this._cfg.contentMacro);
            }

            out.write("</div>");
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM.
         */
        initWidget : function () {
            this.$BindableWidget.initWidget.call(this);

            var bindings = this._cfg.bind;
            var isBound = false;

            if (bindings.visible) {
                var visible = this._transform(bindings.visible.transform, bindings.visible.inside[bindings.visible.to], "toWidget");
                if (visible === true) {
                    this.show();
                }
                isBound = true;
            }
            if (!isBound) {
                this.$logWarn(this.BINDING_NEEDED, [this.$class, "visible"]);
            }
        },

        /**
         * Internal method called when the value in the data model changed.
         * @protected
         */
        _notifyDataChange : function (bind, property) {
            if (property === "visible") {
                bind.newValue ? this.show() : this._popup.close();
            }
        },

        /**
         * Shows the popup
         */
        show : function () {
            var cfg = this._cfg;
            var refreshParams = {
                section : "__popup_" + this._domId,
                writerCallback : {
                    fn : this._writerCallback,
                    scope : this
                }
            };

            var section = this._context.getRefreshedSection(refreshParams);

            var popup = new aria.popups.Popup();
            this._popup = popup;
            popup.$on({
                "onAfterClose" : this.disposePopup,
                scope : this
            });

            // default the position to 0,0 if nothing is defined
            if (cfg.domReference === null && cfg.referenceId === null && cfg.absolutePosition === null
                    && cfg.center === false) {
                cfg.absolutePosition = {
                    top : 0,
                    left : 0
                };
            }

            var domReference = null;
            if (cfg.domReference) {
                domReference = cfg.domReference;
            } else if (cfg.referenceId) {
                domReference = ariaUtilsDom.getElementById(this._context.$getId(cfg.referenceId));
            }

            popup.open({
                section : section,
                keepSection : true,
                modal : cfg.modal,
                maskCssClass : cfg.maskCssClass,
                domReference : domReference,
                absolutePosition : cfg.absolutePosition,
                center : cfg.center,
                maximized : cfg.maximized,
                closeOnMouseClick : cfg.closeOnMouseClick,
                closeOnMouseScroll : cfg.closeOnMouseScroll,
                closeOnMouseOut : cfg.closeOnMouseOut,
                closeOnMouseOutDelay : cfg.closeOnMouseOutDelay,
                preferredPositions : cfg.preferredPositions,
                offset : cfg.offset,
                ignoreClicksOn : cfg.ignoreClicksOn,
                parentDialog : cfg.parentDialog,
                zIndexKeepOpenOrder : cfg.zIndexKeepOpenOrder,
                preferredWidth : cfg.preferredWidth,
                animateOut : cfg.animateOut,
                animateIn : cfg.animateIn
            });
        },

        /**
         * Dispose the widget's popup after the close
         */
        disposePopup : function () {
            if (this._popup) {
                this._popup.$dispose();
                this._popup = null;
            }
            this._resetVisible();
        },

        /**
         * Bidirectional binding: reset the visible property when we close the popup
         */
        _resetVisible : function () {
            var bind = this._bindingListeners.visible;
            if (bind) {
                var newValue = this._transform(bind.transform, false, "fromWidget");
                ariaUtilsJson.setValue(bind.inside, bind.to, newValue, bind.cb);
            }
        }
    }
});
