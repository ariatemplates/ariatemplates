/*
 * Copyright 2016 Amadeus s.a.s.
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
    $classpath : "test.aria.resources.handlers.LCResourcesHandlerTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $prototype : {
        createHandler: function () {
            var handler = new aria.resources.handlers.LCResourcesHandler({
                labelKey: "label",
                codeKey: "code",
                sortingMethod: function (a, b) {
                    // sort by label
                    return (a.label < b.label) ? -1 : (a.label > b.label) ? 1 : 0;
                }
            });
            handler.setSuggestions([
                {
                    label : "Amsterdam",
                    code : "NL"
                }, {
                    label : "Antwerp",
                    code : "BE"
                }, {
                    label : "Athens",
                    code : "GR"
                }, {
                    label : "Atlanta",
                    code : "US"
                }, {
                    label : "Barcelona",
                    code : "ES"
                }, {
                    label : "Berlin",
                    code : "DE"
                }, {
                    label : "Beijing",
                    code : "CN"
                }, {
                    label : "Helsinki",
                    code : "FI"
                }, {
                    label : "Jerusalem",
                    code : "IL"
                }, {
                    label : "Paris",
                    code : "FR"
                }, {
                    label : "Rome",
                    code : "IT"
                }
            ]);
            return handler;
        },

        setUp: function () {
            this.handler = this.createHandler();
        },

        tearDown: function () {
            this.handler.$dispose();
            this.handler = null;
        },

        checkSuggestions: function (entry, expectedSuggestions, cb) {
            this.handler.getSuggestions(entry, {
                fn: this._checkSuggestionsCallback,
                scope: this,
                args: {
                    cb: cb,
                    expectedSuggestions: expectedSuggestions
                }
            });
        },

        _checkSuggestionsCallback: function (response, args) {
            var suggestionObjects = response || [];
            var suggestions = [];
            for (var i = 0, l = suggestionObjects.length; i < l; i++) {
                suggestions.push(suggestionObjects[i].code);
            }
            this.assertJsonEquals(suggestions, args.expectedSuggestions);
            this.$callback(args.cb);
        },

        testAsyncWithCodeMatch: function () {
            this.checkSuggestions("be", ["BE", "CN", "DE"], this.notifyTestEnd);
        },

        testAsyncWithoutCodeMatch: function () {
            this.handler.codeMatch = false;
            this.checkSuggestions("be", ["CN", "DE"], this.notifyTestEnd);
        }

    }

});
