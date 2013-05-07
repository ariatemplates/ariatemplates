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
    $classpath : "test.aria.tools.contextualMenu.popup.PopupTestTpl"
}}

    {macro main()}
        <div {id "divOutsideDialog"/}>Here is a div outside of the dialog.</div>
        {@aria:Dialog {
            contentMacro : "dialogMacro",
            width : 200,
            height : 300,
            modal : true,
            bind : {
                visible : {
                    to: "dialogVisible",
                    inside: data
                }
            }
        }}
        {/@aria:Dialog}
    {/macro}

    {macro dialogMacro()}
        <div {id "divInsideDialog"/}>Here is a div inside the dialog.</div>
    {/macro}

{/Template}
