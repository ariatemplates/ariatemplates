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
    $classpath : "test.aria.widgets.form.autocomplete.paste.PasteTestCaseTplScript",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $destructor : function () {
        if (this.handler) {
            this.handler.$dispose();
        }
    },
    $prototype : {
        onchange : function () {
            this.data.onchange = true;
        },

        getHandler : function () {
            var handler = new aria.resources.handlers.LCResourcesHandler();
            handler.threshold = 1;
            handler.setSuggestions([{
                        label : "Argentina",
                        code : "ARG"
                    }, {
                        label : "Australia",
                        code : "AUS"
                    }, {
                        label : "Canada",
                        code : "CAN"
                    }, {
                        label : "England",
                        code : "ENG"
                    }, {
                        label : "Fiji",
                        code : "FJI"
                    }, {
                        label : "France",
                        code : "FRA"
                    }, {
                        label : "Georgia",
                        code : "GEO"
                    }, {
                        label : "Ireland",
                        code : "IRE"
                    }, {
                        label : "Italy",
                        code : "ITA"
                    }, {
                        label : "Japan",
                        code : "JPN"
                    }, {
                        label : "Namibia",
                        code : "NAM"
                    }, {
                        label : "New Zealand",
                        code : "NZL"
                    }, {
                        label : "Romania",
                        code : "ROM"
                    }, {
                        label : "Russia",
                        code : "RUS"
                    }, {
                        label : "Samoa",
                        code : "SAM"
                    }, {
                        label : "Scotland",
                        code : "SCO"
                    }, {
                        label : "South Africa",
                        code : "RSA"
                    }, {
                        label : "Tonga",
                        code : "TGA"
                    }, {
                        label : "USA",
                        code : "USA"
                    }, {
                        label : "Wales",
                        code : "WAL"
                    }]);

            this.handler = handler;
            return handler;
        }
    }
});
