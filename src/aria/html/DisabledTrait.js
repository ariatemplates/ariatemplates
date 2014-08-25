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
var ariaUtilsType = require("../utils/Type");
var ariaUtilsJson = require("../utils/Json");


/**
 * Common class for all elements supporting a disabled attribute
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.html.DisabledTrait",
    $prototype : {

        /**
         * Initialize the disabled attribute of the widget by taking into account the data model to which it might be
         * bound.
         */
        initDisabledWidgetAttribute : function () {
            var bindings = this._cfg.bind;
            var binding = bindings.disabled;
            if (binding) {
                var newValue = this._transform(binding.transform, binding.inside[binding.to], "toWidget");
                if (ariaUtilsType.isBoolean(newValue)) {
                    this._domElt.disabled = newValue;
                } else {
                    ariaUtilsJson.setValue(binding.inside, binding.to, this._domElt.disabled);
                }
            }
        },

        /**
         * Function called when a value inside 'bind' has changed. It only deals with the case in which the bound
         * property is 'disabled'
         * @param {String} name Name of the property
         * @param {Object} value Value of the changed property
         * @param {Object} oldValue Value of the property before the change happened
         */
        onDisabledBind : function (name, value, oldValue) {
            if (name === "disabled") {
                this._domElt.disabled = value;
            }
        }

    }
});
