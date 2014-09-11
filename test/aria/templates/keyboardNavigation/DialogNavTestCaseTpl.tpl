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
    $classpath : "test.aria.templates.keyboardNavigation.DialogNavTestCaseTpl",
    $hasScript : true
}}

    {macro main()}
        <p> <a {id "toBeFocused"/} href = "javascript:void(0);" {on click { fn : clickHandler }/} > Click here </a> to open the dialog </p>
        {@aria:Dialog {
            id : "myDialog",
            title : "Dialog Sample",
            icon : "std:info",
            width : 400,
            maxHeight : 500,
            modal : true,
            visible : false,
            macro : "myContent",
            bind : {
                "visible" : {
                    inside : data,
                    to : 'dialogOpen'
                }
            }
        }/}
    {/macro}

    {macro myContent()}
        <p>Test dialog </p>
    {/macro}

{/Template}
