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

// Content of the contextual menu for templates
{Template {
    $classpath:'aria.tools.contextual.ContextualDisplay',
    $hasScript:true
}}

    {macro main()}
        {@aria:Div {
            sclass : "dropdown"
        }}
            <div style="padding:5px;">
                <table cellpadding="0" cellspacing="5">
                    <tr>
                        <td align="right">Template:</td>
                        <td><strong>${data.templateCtxt.tplClasspath}</strong></td>
                    </tr>
                    {if (data.templateCtxt.moduleCtrlPrivate)}
                        <tr>
                            <td align="right">Module Controller:</td>
                            <td><strong>${data.templateCtxt.moduleCtrlPrivate.$classpath}</strong></td>
                        </tr>
                    {/if}
                </table>
                <div style="text-align:center; padding:5px; background:#F3F3F3; border:solid 1px #DDDDDD;">
                    {@aria:Button {label:"Reload Template", onclick : "reloadTemplate"}/}
                    {if aria.templates.ModuleCtrlFactory.isModuleCtrlReloadable(data.templateCtxt.moduleCtrlPrivate)}
                        {@aria:Button {label:"Reload Module", onclick : "reloadModule"}/}
                    {/if}
                     {@aria:Button {label:"Debug Tools", onclick: "openDebug"}/}
                 </div>
            </div>

        {/@aria:Div}
    {/macro}
    

{/Template}