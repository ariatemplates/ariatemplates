/*
 * Copyright 2016 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.popup.dialog.titleTag.DialogTitleTagTpl"
}}

    {macro main()}
        <h1>BackgroundTitle</h1>

        <a href="http://ariatemplates.com">BackgroundLink</a>

        <br><br>
        <div
            {id "showDialogButton"/}
            {on click function () { this.$json.setValue(data, "dialogVisible", true) } /}
        >Show dialog</div>

        {@aria:Dialog {
            waiAria: true,
            modal: true,
            title: "MyDialogTitle",
            macro: "dialogContent",
            width: 500,
            height: 200,
            visible: false,
            bind: {
                visible: {
                    to: "dialogVisible",
                    inside: data
                }
            }
        } /}
    {/macro}

    {macro dialogContent()}
        <a href="http://at-diff.ariatemplates.com">LinkInTheDialog</a>
    {/macro}
{/Template}
