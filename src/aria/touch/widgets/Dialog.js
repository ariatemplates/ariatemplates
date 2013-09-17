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
/* Backward Compatibility starts here*/
Aria.classDefinition({
    $classpath : "aria.touch.widgets.Dialog",
    $extends : "aria.touch.widgets.Popup",
    $css : ["aria.touch.widgets.DialogCSS"],
    $statics : {
        CSS_CLASS : "touchLibDialog",
        WIDGET_CFG : "aria.touch.widgets.DialogCfgBeans.DialogCfg"
    },
    $dependencies : ["aria.touch.widgets.DialogCfgBeans"],
    /**
     * Dialog Constructor.
     * @param {aria.touch.widgets.DialogCfgBeans.DialogCfg} cfg dialog configuration
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$Popup.constructor.apply(this, arguments);
        this.$logWarn("aria.touch.widgets.Dialog has been deprecated, please use aria.touch.widgets.Popup");
    },
    $prototype : {
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
                    this.$logWarn("isVisible has been deprecated, please use visible instead");
                    this.show();
                }
                isBound = true;
            }

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
            if (property === "visible" || property === "isVisible") {
                bind.newValue ? this.show() : this._popup.close();
            }
        },

        /**
         * Bidirectional binding: reset the visible property when we close the popup
         */
        _resetVisible : function () {
            var bind = this._bindingListeners.visible;
            if (bind) {
                var newValue = this._transform(bind.transform, false, "fromWidget");
                aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);
            }

            var bindDeprecated = this._bindingListeners.isVisible;
            if (bindDeprecated) {
                var newValue = this._transform(bindDeprecated.transform, false, "fromWidget");
                aria.utils.Json.setValue(bindDeprecated.inside, bindDeprecated.to, newValue, bindDeprecated.cb);
            }
        }
    }
});
/* Backward Compatibility ends here*/
