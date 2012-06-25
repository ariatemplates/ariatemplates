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

    // shortcuts
    var jsonValidator;
    var stringUtil;
    var typesUtil;

    /**
     * Resources handler for LABEL-CODE suggestions. This handler is to be fed and used with user defined entries.<br />
     * Suggestion must match the bean defined in this.SUGGESTION_BEAN
     */
    Aria.classDefinition({
        $classpath : "aria.resources.handlers.LCResourcesHandler",
        $implements : ["aria.resources.handlers.IResourcesHandler"],
        $dependencies : ["aria.utils.String", "aria.resources.handlers.LCResourcesHandlerBean"],
        $statics : {
            /**
             * Suggestion bean that validates a given suggestion
             * @type String
             */
            SUGGESTION_BEAN : "aria.resources.handlers.LCResourcesHandlerBean.Suggestion"
        },

        $constructor : function () {

            /**
             * Minimum number of letter to return suggestions
             * @type {Number}
             */
            this.threshold = 1;

            /**
             * Specifies of code has to be matched exactly to return the suggestion or if only the beginning is enough
             * @type Boolean
             */
            this.codeExactMatch = true;

            /**
             * List of available suggestions.
             * @protected
             * @type {Array}
             */
            this._suggestions = [];

        },
        $destructor : function () {
            this._suggestions = null;
        },
        $onload : function () {
            jsonValidator = aria.core.JsonValidator;
            stringUtil = aria.utils.String;
            typesUtil = aria.utils.Type;
        },
        $onunload : function () {
            jsonValidator = null;
            stringUtil = null;
            typesUtil = null;
        },
        $prototype : {

            /**
             * Call the callback with an array of suggestions in its arguments. Suggestions that are exact match are
             * marked with parameter exactMatch set to true.
             * @param {String} textEntry Search string
             * @param {aria.core.CfgBeans.Callback} callback Called when suggestions are ready
             */
            getSuggestions : function (textEntry, callback) {

                if (typesUtil.isString(textEntry) && textEntry.length >= this.threshold) {
                    textEntry = stringUtil.stripAccents(textEntry).toLowerCase();
                    var codeSuggestions = [], labelSuggestions = [], nbSuggestions = this._suggestions.length, textEntryLength = textEntry.length;
                    var returnedSuggestion, index, suggestion;
                    for (index = 0; index < nbSuggestions; index++) {
                        suggestion = this._suggestions[index];
                        if (suggestion.code === textEntry) {
                            suggestion.original.exactMatch = true;
                            codeSuggestions.unshift(suggestion.original);
                        } else if (suggestion.code.substring(0, textEntryLength) === textEntry && !this.codeExactMatch) {
                            codeSuggestions.push(suggestion.original);
                            suggestion.original.exactMatch = false;
                        } else {
                            if (suggestion.label.substring(0, textEntryLength) === textEntry) {
                                var exactMatch = suggestion.label === textEntry;
                                suggestion.original.exactMatch = exactMatch;
                                if (exactMatch) {
                                    labelSuggestions.unshift(suggestion.original);
                                } else {
                                    labelSuggestions.push(suggestion.original);
                                }
                            }
                        }
                    }

                    var suggestions = codeSuggestions.concat(labelSuggestions);
                    this.$callback(callback, suggestions);
                } else {
                    this.$callback(callback, null);
                }
            },

            /**
             * Returns the classpath of the default template for this resourceHandler
             * @return {String}
             */
            getDefaultTemplate : function () {
                return 'aria.widgets.form.list.templates.LCTemplate';
            },

            /**
             * Set the list of available suggestion
             * @param {Array} suggestions list of suggestion objects
             */
            setSuggestions : function (suggestions) {

                if (typesUtil.isArray(suggestions)) {
                    var newSuggestions = [];
                    for (var index = 0, l = suggestions.length; index < l; index++) {
                        var suggestion = suggestions[index];
                        if (!jsonValidator.check(suggestion, 'aria.resources.handlers.LCResourcesHandlerBean.Suggestion')) {
                            return this.$logError('Suggestions does not match suggestion bean aria.resources.handlers.LCResourcesHandleBean.Suggestions', null, suggestions);
                        }
                        newSuggestions.push({
                            label : stringUtil.stripAccents(suggestion.label).toLowerCase(),
                            code : stringUtil.stripAccents(suggestion.code).toLowerCase(),
                            original : suggestion
                        });
                    }
                    // sort suggestions
                    newSuggestions.sort(function (a, b) {
                        return (a.label < b.label) ? 1 : (a.label > b.label) ? -1 : 0;
                    });

                    this._suggestions = newSuggestions;
                } else {
                    return this.$logError('Suggestions must be an array.', null, suggestions);
                }

            },

            /**
             * Set the minimum number of letter required to have suggestions proposed
             * @param {Integer} nbOfLetters
             */
            setThreshold : function (nbOfLetters) {
                this.threshold = nbOfLetters;
            },

            /**
             * Provide a label for given suggestion
             * @param {Object} suggestion
             * @return {String}
             */
            suggestionToLabel : function (suggestion) {
                return suggestion.label;
            },

            /**
             * Call the callback with all possible suggestions.
             * @param {aria.core.CfgBeans.Callback} callback
             */
            getAllSuggestions : function (callback) {
                var originalSuggestions = this._suggestions;
                var nbSuggestions = originalSuggestions.length;
                var returnedSuggestions = [];
                var suggestion;
                for (var index = 0; index < nbSuggestions; index++) {
                    suggestion = originalSuggestions[index];
                    returnedSuggestions.push(suggestion.original);
                }
                this.$callback(callback, returnedSuggestions);
            }

        }
    });
})();