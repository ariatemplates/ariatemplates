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
    $classpath:"test.aria.widgets.container.dialog.modalMaskSize.DialogModalMaskSize",
    $dependencies:["aria.utils.Json","aria.utils.Dom"]
}}

    {macro main()}
        {@aria:Button {
            label: "Refresh",
            onclick: {
                fn: this.$refresh,
                scope: this,
                resIndex: -1
            }
        } /}
        {@aria:Dialog {
            modal: true,
            movable: true,
            maximizable: true,
            resizable: true,
            macro: "dialogContent",
            bind: {
                xpos: {
                    inside: data,
                    to: "x"
                },
                ypos: {
                    inside: data,
                    to: "y"
                },
                width: {
                    to: "width",
                    inside: data
                },
                height: {
                    to: "height",
                    inside: data
                },
                center: {
                    to: "center",
                    inside: data
                },
                visible: {
                    to: "visible",
                    inside: data
                }
            }
        }/}
        {@aria:CheckBox {
            label: "Dialog visible",
            bind: {
                value: {
                    to: "visible",
                    inside: data
                }
            }
        } /}
        <div style="width: 100px; height: 2000px; background-color:blue;"></div>
        <input {id "myInput"/}>
        {@aria:CheckBox {
            label: "Dialog visible",
            bind: {
                value: {
                    to: "visible",
                    inside: data
                }
            }
        } /}
    {/macro}

    {macro dialogContent()}
        <input><br>
        {@aria:CheckBox {
            label: "Center dialog",
            bind: {
                value: {
                    to: "center",
                    inside: data
                }
            }
        } /}<br>
        {@aria:NumberField {
            label: "x",
            bind: {
                value: {
                    to: "x",
                    inside: data
                }
            }
        } /}<br>
        {@aria:NumberField {
            label: "y",
            bind: {
                value: {
                    to: "y",
                    inside: data
                }
            }
        } /}<br>
        {@aria:NumberField {
            label: "width",
            bind: {
                value: {
                    to: "width",
                    inside: data
                }
            }
        } /}<br>
        {@aria:NumberField {
            label: "height",
            bind: {
                value: {
                    to: "height",
                    inside: data
                }
            }
        } /}<br>
        {@aria:NumberField {
            label: "boxWidth",
            bind: {
                value: {
                    to: "boxWidth",
                    inside: data
                }
            }
        } /}<br>
        {@aria:NumberField {
            label: "boxHeight",
            bind: {
                value: {
                    to: "boxHeight",
                    inside: data
                }
            }
        } /}<br>
        {@aria:Button {
            label: "Show input",
            onclick: {
                scope: this,
                fn: function () {
                    document.getElementById(this.$getId("myInput")).scrollIntoView(true);
                }
            }
        } /}<br>
        {section {
            macro: "resizableBox",
            bindRefreshTo: [{
                to: "boxWidth",
                inside: data,
                recursive: false
            },{
                to: "boxHeight",
                inside: data,
                recursive: false
            }]
        } /}
    {/macro}

    {macro resizableBox()}
        <div style="width:${data.boxWidth}px;height:${data.boxHeight}px;background-color:red;"></div>
    {/macro}

{/Template}
