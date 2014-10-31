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
    $classpath : "test.aria.widgets.form.autocomplete.ampersand.AutoCompleteTplScript",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $constructor : function () {},
    $destructor : function () {
        if (this.locationsHandler) {
            this.locationsHandler.$dispose();
        }
    },
    $prototype : {
        /**
         * Returns a resource handler using the FW LCResourcesHandler
         * @return {LCResourcesHandler} Resource handler for autocomplete
         */
        getLocationsHandler : function () {
            if (!this.locationsHandler) {
                this.locationsHandler = new aria.resources.handlers.LCResourcesHandler();
                this.locationsHandler.suggestionToLabel = function (suggestion) {
                    return suggestion.iata;
                };
            }
            return this.locationsHandler;
        }
    }
});
