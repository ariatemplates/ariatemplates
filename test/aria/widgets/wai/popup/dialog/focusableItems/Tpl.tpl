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
    $classpath : "test.aria.widgets.wai.popup.dialog.focusableItems.Tpl",
    $hasScript : true
}}

    {macro main()}
        <div style="margin: 10px;">
            {foreach dlg in data.dialogs}
                {separator}<br><br>{/separator}
                {@aria:Button {
                    id: "button" + dlg_index,
                    label: "Show dialog " + dlg_index + " (" + dlg.title + ")",
                    onclick: {
                        fn: openDialog,
                        args: dlg
                    }
                }/}
                {@aria:Dialog dlg/}
            {/foreach}
        </div>
    {/macro}

    {macro dialogContent()}
        <p>This is the content of my dialog!</p>
        {@aria:Button {
            label: "Do nothing"
        }/}
    {/macro}

{/Template}
