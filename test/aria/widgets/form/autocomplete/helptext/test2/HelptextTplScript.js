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

Aria.tplScriptDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.helptext.test2.HelptextTplScript",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $destructor : function () {
        this.handler.$dispose();
    },
    $prototype : {
        getHandler : function () {
            if (!this.handler) {
                var handler = new aria.resources.handlers.LCResourcesHandler();
                handler.setSuggestions([{
                            label : "england",
                            code : "en"
                        }, {
                            label : "france",
                            code : "fr"
                        }]);
                var dataModel = this.data;

                handler.getSuggestions = function (textEntry, cb) {
                    dataModel.getSuggestionsCalled = true;
                    this.$callback(cb);
                };
                this.handler = handler;

            }

            return this.handler;
        }
    }
});