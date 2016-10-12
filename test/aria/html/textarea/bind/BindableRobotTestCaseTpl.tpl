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
    $classpath : "test.aria.html.textarea.bind.BindableRobotTestCaseTpl",
    $wlibs : {
        html : "aria.html.HtmlLibrary"
    },
    $hasScript : true
}}

{macro main()}

<div id="justToGetTheCorrectDom">

{@html:TextArea {
    on : {
        type : "typing",
        blur : {
            fn : "somethingOnBlur"
        }
    },
    bind : {
        value : {
            inside : data,
            to : "value",
            transform : {
                fromWidget : function (value) {
                    return value.toUpperCase();
                },
                toWidget : function (value) {
                    return value.toLowerCase();
                }
            }
        }
    }
}/}

</div>

<div id="outsideDiv">&nbsp;</div>

{/macro}
{/Template}
