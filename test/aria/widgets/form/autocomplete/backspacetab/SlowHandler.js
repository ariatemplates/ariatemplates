/*
 * Copyright 2013 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.backspacetab.SlowHandler",
    $dependencies : ["aria.resources.handlers.LCResourcesHandlerBean"],
    $statics : {
        SUGGESTION_BEAN : "aria.resources.handlers.LCResourcesHandlerBean.Suggestion"
    },
    $constructor : function () {
        /**
         * Timer that controls the suggestions from the fake server
         * @type String
         */
        this._suggestionTimer = null;
    },
    $prototype : {
        /**
         * Call the callback with an array of suggestions in its arguments. Suggestions that are exact match are marked
         * with parameter exactMatch set to true.
         * @param {String} textEntry
         * @param {Function} callback
         */
        getSuggestions : function (textEntry, callback) {
            // Simply wait one second before givin back some suggestions
            if (this._suggestionTimer) {
                aria.core.Timer.cancelCallback(this._suggestionTimer);
            }

            this._suggestionTimer = aria.core.Timer.addCallback({
                fn : this._fakeSuggestions,
                scope : this,
                delay : 1000,
                args : callback
            });
        },

        _fakeSuggestions : function (callback) {
            this.$callback(callback, [{
                        label : "No matter what you type",
                        code : "matter"
                    }, {
                        label : "You always get the same results",
                        code : "always"
                    }, {
                        label : "After a time delay",
                        code : "time"
                    }]);
        },

        getDefaultTemplate : function () {
            return "test.aria.widgets.form.autocomplete.backspacetab.SlowHandlerTemplate";
        },

        suggestionToLabel : function (suggestion) {
            return suggestion.label;
        }
    }
});
