/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.container.dialog.resize.noRefresh.ResizableDialogTemplate"
}}

    {macro main()}
        {@aria:Dialog {
            id : "myDialog",
            macro : "displayDialogContent",
            resizable : true,
            movable : true,
            maximizable : true,
            title: "My dialog",
            scrollBarY: false,
            bind : {
                visible : {
                    to : "visible",
                    inside : data
                },
                xpos : {
                    to : "xpos",
                    inside : data
                },
                ypos : {
                    to : "ypos",
                    inside : data
                },
                width : {
                    to : "width",
                    inside : data
                },
                height : {
                    to : "height",
                    inside : data
                },
                center : {
                    to : "center",
                    inside : data
                }
            }
        }/}

    {/macro}


    {macro displayDialogContent()}
        {section {
            id: "mySection",
            macro: "mySectionContent"
        }/}
    {/macro}

    {macro mySectionContent()}
        <div style="position:relative;width:100%;height:100%;">
            {@aria:Button {
                label: "Refresh this section",
                margins: "5 5 5 0",
                onclick: {
                    fn: this.$refresh,
                    resIndex: -1,
                    apply: true,
                    args: [{
                        section: "mySection"
                    }],
                    scope: this
                }
            }/}
            {@aria:NumberField {
                tooltip: "X",
                width: 50,
                bind: {
                    value: {
                        to: "xpos",
                        inside: data
                    }
                }
            }/}
            {@aria:NumberField {
                tooltip: "Y",
                width: 50,
                bind: {
                    value: {
                        to: "ypos",
                        inside: data
                    }
                }
            }/}
            {@aria:NumberField {
                tooltip: "Width",
                width: 50,
                bind: {
                    value: {
                        to: "width",
                        inside: data
                    }
                }
            }/}
            {@aria:NumberField {
                tooltip: "Height",
                width: 50,
                bind: {
                    value: {
                        to: "height",
                        inside: data
                    }
                }
            }/}
            {@aria:CheckBox {
                tooltip: "Center",
                bind: {
                    value: {
                        to: "center",
                        inside: data
                    }
                }
            }/}
            <div style="position:absolute;left:1px;top:33px;bottom:3px;right:7px;">
                <iframe
                    {id "myIframe"/}
                    src="${aria.core.DownloadMgr.resolveURL(this.$package.replace(/\./g, "/") + "/page1.html")}"
                    style="width:100%;height:100%;border: 1px solid blue;"
                ></iframe>
            </div>
        </div>
    {/macro}

{/Template}
