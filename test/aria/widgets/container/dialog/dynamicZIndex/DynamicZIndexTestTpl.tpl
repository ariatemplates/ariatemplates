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
   $classpath : "test.aria.widgets.container.dialog.dynamicZIndex.DynamicZIndexTestTpl",
   $hasScript : true
}}

    {macro main ()}
        {call dialogButton("modalDialog1", null, true)/}<br>
        {call dialogButton("nonModalDialog1", null, false)/}<br>
        {call dialogButton("nonModalDialog2", null, false)/}<br>
        {call dialogButton("nonModalDialog3", null, false)/}<br>
        {call dialogButton("container1modalDialog1", "container1", true)/}<br>
        {call dialogButton("container1nonModalDialog1", "container1", false)/}<br>
        {call dialogButton("container1nonModalDialog2", "container1", false)/}<br>
        {call dialogButton("container1nonModalDialog3", "container1", false)/}<br>
        {call dialogButton("container2modalDialog1", "container2", true)/}<br>
        {call dialogButton("container2nonModalDialog1", "container2", false)/}<br>
        {call dialogButton("container2nonModalDialog2", "container2", false)/}<br>
        {call dialogButton("container2nonModalDialog3", "container2", false)/}<br>
        <div style="text-align: right;">
            <input {id "input1"/}>
        </div>
        <div {id "container1" /} style="width:500px;height:300px;border:1px solid black;margin:2px;position:relative;display:inline-block;vertical-align:middle;">
        </div>
        <div {id "container2" /} style="width:500px;height:300px;border:1px solid black;margin:2px;position:relative;display:inline-block;vertical-align:middle;">
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
            resizable: false,
            maximizable: false,
            modal: modal,
            closable: false,
            title: name,
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
