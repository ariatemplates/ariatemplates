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

    Aria.classDefinition({
        $classpath : "atplugins.lightWidgets.datefield.DateField",
        $extends : "atplugins.lightWidgets.textinput.TextInputWithOnChange",
        $dependencies : ["aria.utils.Date", "atplugins.lightWidgets.datefield.DateFieldCfgBeans"],
        $constructor : function (cfg, context, line) {
            this.$cfgBean = "atplugins.lightWidgets.datefield.DateFieldCfgBeans.Properties";
            /**
             * Shortcut for date utility
             * @type aria.utils.Date
             * @private
             */
            this._dateUtil = aria.utils.Date;
            this.$TextInputWithOnChange.constructor.call(this, cfg, context, line);
        },
        $destructor : function () {
            this._dateUtil = null;
            this.$TextInputWithOnChange.$destructor.call(this);
        },
        $prototype : {

            /**
             * Transforms a value from the widget value to the corresponding datamodel value using the specified
             * transform.
             * @protected
             * @param {aria.widgetLibs.CommonBeans.TransformRef} transform Transformation function. Can be undefined if
             * no transformation is to be used or a classpath.
             * @param {Object|Boolean|String|Number} value The widget value to be transformed.
             * @param {String} direction Whether the transform is "fromWidget" or "toWidget
             * @return {Object|Boolean|String|Number} The transformed value. If no transformation is specified, returns
             * the same value as passed in the value parameter.
             */
            _transform : function (transform, value, direction) {
                var transformedValue = null;
                if (direction == "fromWidget") {
                    transformedValue = this._dateUtil.interpret(value);
                    if (transformedValue) {
                        if (this._isValidDate(transformedValue)) {
                            this.onbind("value", this._dateUtil.format(transformedValue, this._cfg.pattern), value);
                        } else {
                            transformedValue = null;
                        }
                    }
                    return this.$TextInputWithOnChange._transform.call(this, transform, transformedValue, direction);
                } else {
                    if (!value || !this._isValidDate(value)) {
                        return "";
                    }
                    transformedValue = this.$TextInputWithOnChange._transform.call(this, transform, value, direction);
                    return this._dateUtil.format(value, this._cfg.pattern);
                }
            },

            /**
             * Date to validate with respect to minValue and maxValue
             * @param {Date} date
             * @private
             */
            _isValidDate : function (date) {
                var cfg = this._cfg;
                if (cfg.minValue && this._dateUtil.compare(date, cfg.minValue) < 0) {
                    return false;
                }
                if (cfg.maxValue && this._dateUtil.compare(date, cfg.maxValue) > 0) {
                    return false;
                }
                return true;
            },

            /**
             * Validate the text contained in the field and put it into the data model
             */
            applyTextToData : function () {
                var bind = this._bindingListeners.value;
                var text = this._hasPlaceholder ? "" : this._domElt.value;
                var newValue = this._transform(bind.transform, text, "fromWidget");
                aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);
            }

        }
    });
})();