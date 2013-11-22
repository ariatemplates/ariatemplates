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

/**
 * The purpose of this class is to show how to use the spelling mistake underline state in the auto-complete. It does a
 * very basic spell check (with a list of common spelling mistakes).
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.spellcheck.SpellCheckHandler",
    $extends : "aria.resources.handlers.LCResourcesHandler",
    $constructor : function () {
        this.$LCResourcesHandler.constructor.call(this);
        this.handler = new aria.resources.handlers.LCResourcesHandler();
        this.handler.setSuggestions([{
            label : "Paris",
            code : "PAR"
        }, {
            label : "Rio de Janeiro",
            code : "RIO"
        }, {
            label : "Milan",
            code : "MXP"
        }]);
    },
    $destructor : function () {
        this.handler.$dispose();
        this.handler = null;
        this.$LCResourcesHandler.$destructor.call(this);
    },
    $statics : {
        COMMON_SPELLINGMISTAKES : {
            "parr" : "PAR",
            "parri" : "Paris",
            "parris" : "Paris",
            "pparis" : "Paris",
            "paaris" : "Paris",
            "lonn" : "LON",
            "lonndon" : "London"
        }
    },
    $prototype : {

        /**
         * Call the callback with an array of suggestions in its arguments. Suggestions that are exact match are marked
         * with parameter exactMatch set to true.
         * @param {String} textEntry
         * @param {Function} callback
         */
        getSuggestions : function (textEntry, callback) {
            var spellingMistake = this.COMMON_SPELLINGMISTAKES[textEntry.toLowerCase()];

            this.handler.getSuggestions.call(this.handler, spellingMistake != null ? spellingMistake : textEntry, {
                scope : this,
                fn : this._addSpellingMistakeParamCallback,
                args : {
                    callback : callback,
                    spellingMistake : spellingMistake != null
                }
            });
        },

        /**
         * Post-process answers from the AIR resources handler to set the spelling mistake property.
         * @param {Object|Array} res
         * @param {Object} args
         */
        _addSpellingMistakeParamCallback : function (res, args) {
            if (args.spellingMistake && res) {
                var suggestions;
                if ("suggestions" in res) {
                    suggestions = suggestions;
                } else {
                    suggestions = res;
                    res = {
                        suggestions : suggestions
                    };
                }
                // this triggers the error state of the autocomplete:
                res.error = true;

                // normally, when reaching this point, suggestions should never be null (unless resources are not
                // available...)
                if (suggestions && suggestions.length >= 1) {
                    // write on the first suggestion that there was a spelling mistake:
                    suggestions[0]['view:spellingSuggestion'] = true;
                    for (var i = 0, l = suggestions.length; i < l; i++) {
                        // set the exactMatch property to false (as there was a spelling mistake)
                        suggestions[i].exactMatch = false;
                    }
                }
            }
            this.$callback(args.callback, res);
        },

        getDefaultTemplate : function () {
            return "test.aria.widgets.form.autocomplete.spellcheck.SpellCheckAIRList";
        }
    }
});
