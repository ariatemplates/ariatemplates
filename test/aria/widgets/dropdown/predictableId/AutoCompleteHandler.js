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
    $classpath : "test.aria.widgets.dropdown.predictableId.AutoCompleteHandler",
    $implements : ["aria.resources.handlers.IResourcesHandler"],
    $prototype : {
        getSuggestions : function (search, cb) {
            this.$callback(cb, []);
        },

        getDefaultTemplate : function () {
            return "aria.widgets.form.list.templates.LCTemplate";
        },

        suggestionToLabel : function (suggestion) {
            return suggestion.label;
        },

        getAllSuggestions : function (cb) {
            this.$callback(cb, [{
                        label : "First",
                        code : "One"
                    }, {
                        label : "Second",
                        code : "Two"
                    }, {
                        label : "Third",
                        code : "Three"
                    }, {
                        label : "Fourth",
                        code : "Four"
                    }]);
        }
    }
});
