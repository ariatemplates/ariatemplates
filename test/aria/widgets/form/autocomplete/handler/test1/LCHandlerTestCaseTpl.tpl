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

{Template {
    $classpath:'test.aria.widgets.form.autocomplete.handler.test1.LCHandlerTestCaseTpl',
    $hasScript : true
}}

    {macro main()}

        <p>To Test the LCHandler improvements.</p>

        {@aria:AutoComplete {
            id : "ac1",
            helptext : "IATA City",
            freeText : false,
            autoFill : false,
            resourcesHandler : getAirLinesHandler("city"),
            bind : {
                  "value" : {
                     inside : data,
                      to : 'city'
                }
            }
        }/}
        </br>
        {@aria:AutoComplete {
            id : "ac2",
            helptext : "Airline",
            freeText : false,
            autoFill : false,
            resourcesHandler : getAirLinesHandler(),
            bind : {
                  "value" : {
                     inside : data,
                      to : 'airline'
                }
            }
        }/}



    {/macro}

{/Template}
