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
    var jsonValidator, stringUtil, typesUtil;

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
            SUGGESTION_BEAN : "aria.resources.handlers.LCResourcesHandlerBean.Suggestion",
            CONFIGURATION_BEAN : "aria.resources.handlers.LCResourcesHandlerBean.Configuration",
            INVALID_CONFIG : "Invalid handler configuration in : %1.",
            INVALD_SUGGESTION_TYPE : "Suggestions must be an array.",
            INVALID_SUGGESTIONS : "Suggestions does not match suggestion bean aria.resources.handlers.LCResourcesHandleBean.Suggestions",
            INVALID_KEYCODE : "Suggestions does not match labelKey or codeKey"
        },

        $constructor : function (cfg) {

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
             * Specifies if Label Code combination has been set in Suggestions.
             * @type Boolean
             */
            this.__islabelCode = false;
            /**
             * List of available suggestions.
             * @protected
             * @type {Array}
             */
            this._suggestions = [];
            /**
             * Specifies the default options for labelKey and codeKey.
             * @type {Object}
             */
            this._options = {
                labelKey : "label",
                codeKey : "code"
            };

            if (cfg) {
                if (!jsonValidator.check(cfg, this.CONFIGURATION_BEAN)) {
                    this.$logError(this.INVALID_CONFIG, [this.$classpath]);
                    return;
                } else {

                    this.codeExactMatch = cfg.codeExactMatch ? true : cfg.codeExactMatch;
                    this.threshold = cfg.threshold || 1;
                    this._options.labelKey = cfg.labelKey || "label";
                    this._options.codeKey = cfg.codeKey || "code";
                    this._options.sortingMethod = cfg.sortingMethod;
                    this.__islabelCode = (this._options.labelKey === "label" && this._options.codeKey === "code");
                }

            }

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
                    var newSuggestions = [], suggestionsLabel = this._options.labelKey, suggestionsCode = this._options.codeKey;
                    if (this._options.sortingMethod && typesUtil.isFunction(this._options.sortingMethod)) {
                        suggestions.sort(this._options.sortingMethod);
                    } else {
                        suggestions.sort(function (a, b) {
                            return (a[suggestionsLabel] > b[suggestionsLabel])
                                    ? 1
                                    : (a[suggestionsLabel] < b[suggestionsLabel]) ? -1 : 0;
                        });
                    }

                    for (var index = 0, l = suggestions.length; index < l; index++) {
                        var suggestion = suggestions[index], eachSuggestion = {};
                        if (this.__islabelCode && !jsonValidator.check(suggestion, this.SUGGESTION_BEAN)) {
                            return this.$logError(this.INVALID_SUGGESTIONS, null, suggestions);

                        } else if (!(suggestion.hasOwnProperty(suggestionsLabel) && suggestion.hasOwnProperty(suggestionsCode))) {
                            return this.$logError(this.INVALID_KEYCODE, null, suggestions);
                        }
                        eachSuggestion.label = suggestion[suggestionsLabel];
                        eachSuggestion.code = suggestion[suggestionsCode];
                        newSuggestions.push({
                            label : stringUtil.stripAccents(eachSuggestion.label).toLowerCase(),
                            code : stringUtil.stripAccents(eachSuggestion.code).toLowerCase(),
                            original : eachSuggestion
                        });
                    }
                    this._suggestions = newSuggestions;

                } else {
                    return this.$logError(this.INVALD_SUGGESTION_TYPE, null, suggestions);
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