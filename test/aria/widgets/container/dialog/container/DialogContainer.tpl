/*
 * Copyright 2015 Amadeus s.a.s.
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
   $classpath : "test.aria.widgets.container.dialog.container.DialogContainer",
   $css : ["test.aria.widgets.container.dialog.container.DialogContainerStyle"],
   $hasScript : true
}}

    {macro main ()}
        <div style="height:10000px;padding-top:100px;padding-left:50px;padding-right:200px;">
            <div style="height:1400px;">
            </div>
            <div>
                {call dialogButton("generalDialogModal", null, true)/}
                {call dialogButton("generalDialogNonModal", null, false)/}<br>
                <input {id "bodyInput1" /}> <input {id "bodyInput2" /}>
            </div>
            <div>
                {@aria:Tab {
                    tabId: "home",
                    id: "homeTab",
                    bind: {
                        selectedTab: {
                            to: "activeTab",
                            inside: data
                        }
                    }
                }}Home{/@aria:Tab}
                {@aria:Tab {
                    tabId: "info",
                    id: "infoTab",
                    bind: {
                        selectedTab: {
                            to: "activeTab",
                            inside: data
                        }
                    }
                }}Info{/@aria:Tab}
                {@aria:Tab {
                    tabId: "details",
                    id: "detailsTab",
                    bind: {
                        selectedTab: {
                            to: "activeTab",
                            inside: data
                        }
                    }
                }}Details{/@aria:Tab}
            </div>
            <div style="border:1px solid black;">
                <div class="tabContent active" {id "home"/} tabindex="-1">
                    <p><b>Home tab</b></p>
                    <div style="background-color:green;height:1500px;width:32px;"></div>
                    <input {id "homeInput1"/}> <br>
                    <input {id "homeInput2"/}> <br>
                    {call dialogButton("homeDialogModal", "home", true)/}
                    {call dialogButton("homeDialogNonModal", "home", false)/}<br>
                    <div style="background-color:green;height:1500px;width:32px;"></div>
                </div>
                <div class="tabContent" {id "info"/}>
                    <p><b>Info tab</b></p>
                    {call dialogButton("infoDialogModal", "info", true)/}
                    {call dialogButton("infoDialogNonModal", "info", false)/}<br>
                    <input {id "infoInput1"/}> <br>
                    <input {id "infoInput2"/}> <br>
                </div>
                <div class="tabContent" {id "details"/} style="height:1500px;">
                  {call dialogButton("detailsDialogModal", "details", true)/}
                  {call dialogButton("detailsDialogNonModal", "details", false)/}<br>
                  <input {id "detailsInput1"/}> <br>
                  <input {id "detailsInput2"/}> <br>
                </div>
            </div>
        </div>
    {/macro}

    {macro dialogButton(name, containerId, modal)}
        {@aria:Button {
            label: "Toggle "+name,
            id: name + "ToggleButton",
            onclick: {
                fn: toggleDialog,
                args: name
            }
        }/}
        {@aria:Dialog {
            macro: {
                name: "dialogContent",
                args: [name]
            },
            id: name + "Dialog",
            movable: true,
            resizable: true,
            maximizable: true,
            modal: modal,
            container: containerId ? $getId(containerId) : null,
            bind: {
                center: {
                    to: name+"Center",
                    inside: data
                },
                xpos: {
                    to: name+"X",
                    inside: data
                },
                ypos: {
                    to: name+"Y",
                    inside: data
                },
                width: {
                    to: name+"Width",
                    inside: data
                },
                height: {
                    to: name+"Height",
                    inside: data
                },
                maximized: {
                    to: name+"Maximized",
                    inside: data
                },
                visible: {
                    to: name+"Visible",
                    inside: data
                }
            }
        }/}
    {/macro}

    {macro dialogContent(name)}
        This is dialog ${name}. <br>
        <input {id name + "Input1"/}> <br>
        <input {id name + "Input2"/}> <br>
    {/macro}

{/Template}
