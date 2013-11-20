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

(function () {
    /**
     * Being a BindableWidget we already have one direction binding of checked (from the datamodel to the widget). This
     * function is the callback for implementing the other bind, from the widget to the datamodel. The checked property
     * is set in the datamodel on click.
     * @param {aria.DomEvent} event click event
     * @private
     */
    function bidirectionalClickBinding (event) {
        var bind = this._bindingListeners.checked;
        var newValue = this._transform(bind.transform, event.target.getProperty('checked'), "fromWidget");
        aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);
    }

    /**
     * CheckBox widget. Bindable widget providing bi-directional bind of 'checked'.
     */
    Aria.classDefinition({
        $classpath : "aria.html.CheckBox",
        $extends : "aria.html.InputElement",
        $dependencies : ["aria.html.beans.CheckBoxCfg"],
        /**
         * Create an instance of the widget.
         * @param {aria.html.beans.CheckBoxCfg:Properties} cfg widget configuration, which is the parameter given in the
         * template
         * @param {aria.templates.TemplateCtxt} context template context
         * @param {Number} lineNumber line number in the template
         */
        $constructor : function (cfg, context, line) {
            cfg.on = cfg.on || {};
            this._chainListener(cfg.on, 'click', {
                fn : bidirectionalClickBinding,
                scope : this
            });

            this.$InputElement.constructor.call(this, cfg, context, line, "checkbox");
        },
        $prototype : {
            /**
             * Classpath of the configuration bean for this widget.
             */
            $cfgBean : "aria.html.beans.CheckBoxCfg.Properties",

            /**
             * Initialization method called after the markup of the widget has been inserted in the DOM.
             */
            initWidget : function () {
                this.$InputElement.initWidget.call(this);

                var bindings = this._cfg.bind;
                if (bindings.checked) {
                    var newValue = this._transform(bindings.checked.transform, bindings.checked.inside[bindings.checked.to], "toWidget");
                    if (newValue != null) {
                        this._domElt.checked = newValue;
                    }
                } else {
                    this.$logWarn(this.BINDING_NEEDED, [this.$class, "checked"]);
                }
            },

            /**
             * Function called when a value inside 'bind' has changed.
             * @param {String} name Name of the property
             * @param {Object} value Value of the changed property
             * @param {Object} oldValue Value of the property before the change happened
             */
            onbind : function (name, value, oldValue) {
                this.$InputElement.onbind.apply(this, arguments);
                if (name === "checked") {
                    this._domElt.checked = value;
                }
            }

        }
    });
})();
