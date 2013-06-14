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
    $classpath : "test.aria.widgets.container.dialog.movable.test3.MovableDialogTemplateThree",
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
            movable : true,
            ondragstart : {
                fn : onDragStart,
                scope : this,
				 args : "firstDialog"
            },
            ondragend : {
                fn : onDragEnd,
                scope : this,
				 args : "firstDialog"
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
        <div>
            {@aria:Button {
            	id:'clickSimulator',
                label : "click Me"

            }/}
        </div>

    {/macro}


   {macro displayDialogContent()}
        {var dataModel = data["firstDialog"] /}

        {section {
            id: "testInnerMacroSection",
            macro: ""
        } /}

        <div>

        {@aria:Button {
            label: "refresh inner section",
            id: "refreshInnerSection",
           onclick : {fn : refreshInnerSection}

               }/}
        </div>
        <div>
            {@aria:NumberField {
                id : "xpos",
                label : "xpos",
                bind : {
                    value : {
                        to : "xpos",
                        inside : dataModel
                    }
                }
            }/}
            {@aria:NumberField {
                id : "ypos",
                label : "ypos",
                bind : {
                    value : {
                        to : "ypos",
                        inside : dataModel
                    }
                }
            }/}
        </div>


    {/macro}

{/Template}