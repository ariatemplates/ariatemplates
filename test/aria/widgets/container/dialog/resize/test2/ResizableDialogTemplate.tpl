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
    $classpath : "test.aria.widgets.container.dialog.resize.test2.ResizableDialogTemplate",
    $hasScript : true
}}

    {var modal = false /}

        {macro main()}

        {call movableOptions() /}

        {section {
            id : "dialogSection",
            macro : "dialogContainerMacro",
             bindRefreshTo : [{
                to : "visible",
                inside : data.firstDialog,
                recursive : false
            }]
        }/}


    {/macro}


    {macro dialogContainerMacro()}
    	{var dataModel = data["firstDialog"] /}
        {@aria:Dialog {
            id : "firstDialog",
            contentMacro : {
                name : "displayDialogContent",
				 args : ["one"]

            },
            resizable : true,
            beforeresize : {
                fn : onResizeStart,
                scope : this
            },
            resizeend : {
                fn : onResizeEnd,
                scope : this
            },
            width : 500,
            height : 250,
            bind : {
                visible : {
                    to : "visible",
                    inside : dataModel
                },
                xpos : {
                    to : "xpos",
                    inside : dataModel
                },
                ypos : {
                    to : "ypos",
                    inside : dataModel
                },
                center : {
                    to : "center",
                    inside : dataModel
                }
            }
        }/}

    {/macro}

     {macro movableOptions()}


    {/macro}


   {macro displayDialogContent()}
        {var dataModel = data["firstDialog"] /}

        {section {
            id: "testInnerMacroSection",
            macro: ""
        } /}

        <div>
       {section {
            id : "resizeText",
            macro : "resizeContentMacro",
            bindRefreshTo : [{
                to : "resizetext",
                inside : dataModel,
                recursive : false
            }]
        }/}

        </div>
        <div>
            {@aria:NumberField {
                id : "height",
                label : "height",
                bind : {
                    value : {
                        to : "height",
                        inside : dataModel
                    }
                }
            }/}
            {@aria:NumberField {
                id : "width",
                label : "width",
                bind : {
                    value : {
                        to : "width",
                        inside : dataModel
                    }
                }
            }/}
        </div>


    {/macro}

    {macro resizeContentMacro()}
        <div style="margin: 10px;color:green">${data["firstDialog"].resizetext}</div>
    {/macro}

{/Template}
