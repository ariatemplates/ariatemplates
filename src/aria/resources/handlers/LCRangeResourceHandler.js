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
require("./LCRangeResourceHandlerBean");
var ariaUtilsString = require("../../utils/String");
var ariaResourcesHandlersLCResourcesHandler = require("./LCResourcesHandler");
var ariaUtilsType = require("../../utils/Type");

(function () {

    // shortcuts
    var stringUtil, typesUtil;

    /**
     * Resources handler for LABEL-CODE suggestions. This handler is to be fed and used with user defined entries.<br />
     * Suggestion must match the bean defined in this.SUGGESTION_BEAN
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.resources.handlers.LCRangeResourceHandler",
        $extends : ariaResourcesHandlersLCResourcesHandler,
        $statics : {
            /**
             * Suggestion bean that validates a given suggestion
             * @type String
             */
            CONFIGURATION_BEAN : "aria.resources.handlers.LCRangeResourceHandlerBean.Configuration"

        },
        $constructor : function (cfg) {
            this.$LCResourcesHandler.constructor.call(this, cfg);
            if (cfg) {
                this.allowRangeValues = cfg.allowRangeValues || false;
            }

        },
        $onload : function () {
            stringUtil = ariaUtilsString;
            typesUtil = ariaUtilsType;
        },
        $onunload : function () {
            stringUtil = null;
            typesUtil = null;
        },
        $prototype : {
            rangePattern : {
                pattern1 : /^[a-z]{1}\d+-\d*$/,
                pattern2 : /^[a-z]{1}\d+,\d*/
            },

            /**
             * Call the callback with an array of suggestions in its arguments. Suggestions that are exact match are
             * marked with parameter exactMatch set to true.
             * @param {String} textEntry Search string
             * @param {aria.core.CfgBeans:Callback} callback Called when suggestions are ready
             */
            getSuggestions : function (textEntry, callback) {
                if (!typesUtil.isString(textEntry) || textEntry.length < this.threshold) {
                    this.$callback(callback, null);
                    return;
                }
                var textEntry = stringUtil.stripAccents(textEntry).toLowerCase(), rangePattern = this.rangePattern;
                if (this.allowRangeValues) {
                    var rangeV = [], firstLetter = textEntry.substring(0, 1);
                    if (rangePattern.pattern1.test(textEntry)) {
                        if (textEntry.charAt(textEntry.length - 1) === "-") {
                            var value = textEntry.substring(1, 2);
                            rangeV = [value];
                        } else {
                            var valArray =  textEntry.substring(1).split("-");
                            for (var l = valArray[0]; l <= valArray[1]; l++) {
                                rangeV.push(l);
                            }
                        }
                    }
                    if (rangePattern.pattern2.test(textEntry)) {
                        rangeV = textEntry.substring(1).split(",");
                    }
                    if (!rangeV.length > 0) {
                        this.__getSuggestion(textEntry, callback);
                        return;
                    }
                    var results = {
                        suggestions : [],
                        multipleValues : rangeV.length > 1
                    };
                    for (var k = 0, len = rangeV.length; k < len; k++) {
                        var searchEntry = firstLetter + rangeV[k];
                        this.$LCResourcesHandler.getSuggestions.call(this, searchEntry, {
                            fn : this.__appendSuggestions,
                            scope : this,
                            args : results
                        });
                    }
                    this.$callback(callback, results);
                } else {
                    this.__getSuggestion(textEntry, callback);
                }

            },
            /**
             * Internal method to call LCResourcesHandler
             * @param {String} textEntry Search string
             * @param {aria.core.CfgBeans:Callback} callback Called when suggestions are ready
             * @private
             */
            __getSuggestion : function (textEntry, callback) {

                this.$LCResourcesHandler.getSuggestions.call(this, textEntry, callback);

            },
            /**
             * Internal method to append the suggestions.
             * @private
             */
            __appendSuggestions : function (suggestions, results) {
                if (suggestions) {
                    results.suggestions = results.suggestions.concat(suggestions);
                }
            },
            /**
             * Returns the classpath of the default template for this resourceHandler
             * @return {String}
             */
            getExpandoTemplate : function () {
                return 'aria.widgets.form.templates.TemplateMultiAuto';
            }

        }
    });
})();
