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
    $classpath: "test.aria.templates.popup.focus.DialogTemplate",
    $hasScript: true
}}

    {macro main ()}
        {@aria:Dialog {
            title: "myDialog",
            width: 500,
            height: 500,
            modal: true,
            center: true,
            contentMacro: "myDialogMacro",
            bind:{
                  "visible": {
                      inside: data.dialog,
                      to: 'visible'
                  }
            }
        }}
        {/@aria:Dialog}


    {/macro}


    {macro myDialogMacro()}


        {@aria:Template {
                defaultTemplate: "test.aria.templates.popup.focus.SubTemplateThree",
                data: data
        }/}
        {@aria:Template {
                defaultTemplate: "test.aria.templates.popup.focus.SubTemplateOne",
                data: data
        }/}
        {@aria:Template {
                defaultTemplate: "test.aria.templates.popup.focus.SubTemplateTwo",
                data: data
        }/}
        {@aria:Button {
            label: "Close",
            onclick: "closeDialog"
        } /}

    {/macro}


{/Template}