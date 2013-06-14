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
   $classpath:'test.aria.widgets.container.dialog.keymap.DialogTestCaseTpl'
}}
    {macro main()}
        {@aria:TextField {
          id : "tf1"
        } /}
        {@aria:Dialog {
            contentMacro: "dialogContent",
            visible : true,
            modal : true,
            bind: {
                visible: {
                    to: "dialogVisible",
                    inside: data
                }
            }
        }/}


    {/macro}

    {macro dialogContent()}
        {@aria:TextField {
          id : "tf2"
        } /}
        {section {
          id : "testSection",
          macro : "mySectionMacro",
          keyMap : [{
                key : 39,
                callback : function () {
                        data.sectionCallback = (!data.sectionCallback)
                                ? 1
                                : data.sectionCallback + 1;
                    }
            }]
        } /}
    {/macro}


    {macro mySectionMacro ()}
        {@aria:TextField {
          id : "tf3"
        } /}
    {/macro}

{/Template}