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

{Template {
    $classpath : "test.aria.widgets.form.issue411.Autocomplete",
    $width : { min : 500 },
    $hasScript: true
} }

    {macro main ( )}
        {@aria:AutoComplete {
            width : 200,
            id : "ac",
            resourcesHandler : getAirLinesHandler(),
            block : true,
            expandButton : true,
            popupWidth : 500,
            popupOpen : true,
            bind: {
                popupOpen : {
                    to : "popupopenAC",
                    inside : data
                }
            }
        }/}

        {@aria:AutoComplete {
            width : 200,
            id : "ac1",
            resourcesHandler : getAirLinesHandler(),
            block : true,
            popupWidth : 500,
            popupOpen : true,
            bind: {
                popupOpen : {
                    to : "popupopenAC1",
                    inside : data
                }
            }
        }/}

    {/macro}

{/Template}
