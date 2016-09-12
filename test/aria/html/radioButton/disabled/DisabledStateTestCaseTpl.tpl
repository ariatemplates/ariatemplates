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
    $classpath : "test.aria.html.radioButton.disabled.DisabledStateTestCaseTpl",
    $wlibs : {
        html : "aria.html.HtmlLibrary"
    }
}}

    {macro main()}


        {@html:RadioButton {
            id : "rba",
            value : "a",
            bind : {
                selectedValue : {
                    inside : data,
                    to : "selectedValue"
                },
                disabled : {
                    inside : data,
                    to : "disabled"
                }
            }
        }/}

        {@html:RadioButton {
            id : "rbb",
            value : "b",
            bind : {
                selectedValue : {
                    inside : data,
                    to : "selectedValue"
                },
                disabled : {
                    inside : data,
                    to : "disabled"
                }
            }
        }/}
    {/macro}

{/Template}
