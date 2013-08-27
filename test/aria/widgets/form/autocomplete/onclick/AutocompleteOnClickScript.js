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
    $classpath : "test.aria.widgets.form.autocomplete.onclick.AutocompleteOnClickScript",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $constructor : function () {
        this.dateUtils = aria.utils.Date;
        this._airlinesHandler = new aria.resources.handlers.LCResourcesHandler();
        this._airlinesHandler.setSuggestions([{
                    label : 'Air France',
                    code : 'AF'
                }, {
                    label : 'Air Canada',
                    code : 'AC'
                }, {
                    label : 'Finnair',
                    code : '--'
                }, {
                    label : 'Quantas',
                    code : '--'
                }, {
                    label : 'American Airlines',
                    code : 'AA'
                }, {
                    label : 'Emirates',
                    code : '--'
                }]);
    },
    $destructor : function () {
        this._airlinesHandler.$dispose();
        this._airlinesHandler = null;
    },
    $prototype : {
        onclick : function () {
            this.data.refresh++;
            this.$refresh();
        }
    }
});