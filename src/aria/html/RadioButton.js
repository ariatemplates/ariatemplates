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
        var bind = this._bindingListeners.selectedValue;
        var newValue = this._transform(bind.transform, this._cfg.value, "fromWidget");
        aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);
    }

    /**
     * RadioButton widget. Bindable widget providing bi-directional bind of 'selectedValue'.
     */
    Aria.classDefinition({
        $classpath : "aria.html.RadioButton",
        $extends : "aria.html.Element",
        $dependencies : ["aria.html.beans.RadioButtonCfg"],
        $statics : {
            INVALID_USAGE : "Widget %1 can only be used as a %2.",
            BINDING_NEEDED : "the property 'selectedValue' from Widget %1 should be bound to a data model"
        },
        $constructor : function (cfg, context, line) {
            this.$cfgBean = this.$cfgBean || "aria.html.beans.RadioButtonCfg.Properties";

            cfg.tagName = "input";
            cfg.attributes = cfg.attributes || {};
            cfg.attributes.type = "radio";
            cfg.on = cfg.on || {};

            this._chainListener(cfg.on, 'click', {
                fn : bidirectionalClickBinding,
                scope : this
            });

            this.$Element.constructor.call(this, cfg, context, line);
        },
        $prototype : {
            /**
             * TextInput can only be used as self closing tags. Calling this function raises an error.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupBegin : function (out) {
                this.$logError(this.INVALID_USAGE, [this.$class, "container"]);
            },

            /**
             * TextInput can only be used as self closing tags. Calling this function does not rais an error though
             * because it was already logged by writeMarkupBegin.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupEnd : Aria.empty,

            /**
             * Initialization method called after the markup of the widget has been inserted in the DOM.
             */
            initWidget : function () {
                this.$Element.initWidget.call(this);

                var bindings = this._cfg.bind;
                var binding = bindings.selectedValue;
                if (binding) {
                    var newValue = this._transform(binding.transform, binding.inside[binding.to], "toWidget");
                    this._domElt.checked = (newValue === this._cfg.value);
                } else {
                    this.$logWarn(this.BINDING_NEEDED, [this.$class]);
                }
            },

            /**
             * Function called when a value inside 'bind' has changed.
             * @param {String} name Name of the property
             * @param {Object} value Value of the changed property
             * @param {Object} oldValue Value of the property before the change happened
             */
            onbind : function (name, value, oldValue) {
                if (name === "selectedValue") {
                    this._domElt.checked = (value === this._cfg.value);
                }
            }
        }
    });
})();
