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
    $classpath : "test.aria.widgets.dropdown.fixedWidth.Widgets",
    $hasScript : true,
    $width : { min : 500 },
    $dependencies : [ "aria.resources.handlers.LCResourcesHandler" ] } }

    {macro main ( )}

        {@aria:AutoComplete {
            width : 200,
            id : "ac500",
            resourcesHandler : this.citiesHandler,
            block: true,
            popupWidth : 500 }/}
        {@aria:AutoComplete {
            width : 200,
            id : "ac100",
            block: true,
            resourcesHandler : this.citiesHandler,
            popupWidth : 100 }/}



        {@aria:MultiSelect {
            id : "ms500",
            width : 200,
            block: true,
            items : data.options,
            popupWidth : 500 }/}
        {@aria:MultiSelect {
            id : "ms100",
            width : 200,
            block: true,
            items : data.options,
            popupWidth : 100 }/}



        {@aria:SelectBox {
            id: "sb500",
            width: 200,
            block: true,
            options : data.options,
            popupWidth : 500 }/}
        {@aria:SelectBox {
            id: "sb100",
            width: 200,
            block: true,
            options : data.options,
            popupWidth : 100 }/}
    {/macro}

{/Template}