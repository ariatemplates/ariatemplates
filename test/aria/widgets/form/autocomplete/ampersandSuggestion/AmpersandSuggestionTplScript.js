/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.autocomplete.ampersandSuggestion.AmpersandSuggestionTplScript",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $destructor : function () {
        if (this.resHandler) {
            this.resHandler.$dispose();
        }
    },
    $prototype : {
        getResHandler : function () {
            if (!this.resHandler) {
                this.resHandler = new aria.resources.handlers.LCResourcesHandler();
                this.resHandler.setSuggestions([
                    {
                        label : "R&D-BA-BA",
                        code : "R&D-BA-BA"
                    }, {
                        label : "R&D-CAC",
                        code : "R&D-CAC"
                    }, {
                        label : "R&D-AFW",
                        code : "R&D-AFW"
                    }, {
                        label : "R*D-BA-BA",
                        code : "R*D-BA-BA"
                    }, {
                        label : "R*D-CAC",
                        code : "R*D-CAC"
                    }, {
                        label : "R*D-AFW",
                        code : "R*D-AFW"
                    }
                ]);
            }
            return this.resHandler;
        }
    }
});
