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
    var basePackage = "atplugins.lightWidgets";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    function onfocus () {
        this._storedValue = this._hasPlaceholder ? "" : this._domElt.value;
    }

    function onblur () {
        var currentValue = this._hasPlaceholder ? "" : this._domElt.value;
        if (this._storedValue != currentValue) {
            this.$callback(this._changeListener, currentValue);
        }
    }

    Aria.classDefinition({
        $classpath : "atplugins.lightWidgets.textinput.TextInputWithOnChange",
        $extends : "aria.html.TextInput",
        $dependencies : ["aria.utils.Date"],
        $constructor : function (cfg, context, line) {
            this._storedValue = null;

            cfg.on = cfg.on || {};
            var changeListener = cfg.on.change;
            if (changeListener) {
                delete cfg.on.change;
                this._changeListener = this.$normCallback.call(context._tpl, changeListener);
                this._chainListener(cfg.on, "focus", {
                    fn : onfocus,
                    scope : this
                });
                this._chainListener(cfg.on, "blur", {
                    fn : onblur,
                    scope : this
                }, true);

            }
            this.$TextInput.constructor.call(this, cfg, context, line);
        },
        $destructor : function () {
            this._changeListener = null;
            this.$TextInput.$destructor.call(this);
        },
        $prototype : {

            /**
             * @return HTMLElement
             */
            getDom : function () {
                return this._domElt;
            },

            /**
             * calls the onchange callbacks that have been registered and resets the stored value son that it is not
             * called again after a blur
             */
            callChangeListener : function () {
                var currentValue = this._hasPlaceholder ? "" : this._domElt.value;
                if (this._storedValue != currentValue) {
                    this.$callback(this._changeListener, currentValue);
                }
                this._storedValue = currentValue;
            }
        }
    });

})();