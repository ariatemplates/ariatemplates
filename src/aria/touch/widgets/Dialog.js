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
 * Dialog Widget.
 */
Aria.classDefinition({
    $classpath : "aria.touch.widgets.Dialog",
    $extends : "aria.widgetLibs.BindableWidget",
    $css : ["aria.touch.widgets.DialogCSS"],
    $statics : {
        BINDING_NEEDED : "The property '%2' from Widget %1 should be bound to a data model"
    },
    $dependencies : ["aria.touch.widgets.DialogCfgBeans", "aria.utils.Dom", "aria.utils.Mouse"],
    /**
     * Dialog Constructor.
     * @param {aria.touch.widgets.DialogCfgBeans.DialogCfg} cfg dialog configuration
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$BindableWidget.constructor.apply(this, arguments);

        this._cfgOk = aria.core.JsonValidator.validateCfg("aria.touch.widgets.DialogCfgBeans.DialogCfg", cfg);

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

    $destructor : function () {
        this.$BindableWidget.$destructor.call(this);
    },

    $prototype : {
        /**
         * Return the configured id of the widget, this is used by the section to register the widget's behavior
         * @return {String}
         */
        getId : function () {
            return this._cfg.id;
        },

        writeMarkup : function (out) {
            // just create an empty section to start with
            out.beginSection({
                id : "__dialog_" + this._domId
            });

            out.endSection();
        },

        /**
         * Callback called when the dialog's main section is refreshed
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @private
         */
        _writerCallback : function (out) {

            out.beginSection({
                id : "__dialog_" + this._domId
            });

            out.write("<div class=\"touchLibDialog\">");

            if (this._cfg.contentMacro) {
                out.callMacro(this._cfg.contentMacro);
            }

            out.write("</div>");
            out.endSection();
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM.
         */
        initWidget : function () {
            this.$BindableWidget.initWidget.call(this);

            var bindings = this._cfg.bind;
            var isBound = false;

            if (bindings.isVisible) {
                var isVisible = this._transform(bindings.isVisible.transform, bindings.isVisible.inside[bindings.isVisible.to], "toWidget");
                if (isVisible === true) {
                    this.show();
                }
                isBound = true;
            }
            if (!isBound) {
                this.$logWarn(this.BINDING_NEEDED, [this.$class, "isVisible"]);
            }
        },
        /**
         * Internal method called when the value in the data model changed.
         * @protected
         */
        _notifyDataChange : function (bind, property) {
            if (property === "isVisible" && bind.newValue) {
                this.show();
            } else {
                this._popup.close();
            }
        },

        /**
         * shows the popup
         */
        show : function () {
            var cfg = this._cfg;
            var refreshParams = {
                filterSection : "__dialog_" + this._domId,
                writerCallback : {
                    fn : this._writerCallback,
                    scope : this
                }
            };

            var section = this._context.getRefreshedSection(refreshParams);

            var popup = new aria.popups.Popup();
            this._popup = popup;
            popup.$on({
                "onAfterClose" : this.dispose,
                scope : this
            });

            // default the position to 0,0 if nothing is defined
            if (cfg.domReference === null && cfg.absolutePosition === null && cfg.center === false) {
                cfg.absolutePosition = {
                    top : 0,
                    left : 0
                };
            }

            popup.open({
                section : section,
                keepSection : true,
                modal : cfg.modal,
                maskCssClass : cfg.maskCssClass,
                domReference : cfg.domReference,
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
                preferredWidth : cfg.preferredWidth,
                animateOut : cfg.animateOut,
                animateIn : cfg.animateIn
            });

        },

        /**
         * Dispose the dialog
         */
        dispose : function () {
            if (this._popup) {
                this._popup.$dispose();
                this._popup = null;
            }
            this._resetVisible();
        },

        /**
         * bidirectional binding: reset the visible property when we close the popup
         */
        _resetVisible : function () {
            var bind = this._bindingListeners.isVisible;
            if (bind) {
                var newValue = this._transform(bind.transform, false, "fromWidget");
                aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);
            }
        }

    }
});
