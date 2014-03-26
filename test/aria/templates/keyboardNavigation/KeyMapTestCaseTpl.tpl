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
    $classpath : "test.aria.templates.keyboardNavigation.KeyMapTestCaseTpl",
    $hasScript : false
}}

        {macro main()}


        <fieldset>
            <legend>Section 1</legend>
            {section {
                "id" : "mySection",
                "keyMap" : [{
                    key: "F3",
                    callback : {
                        fn : function () {
                            this.data.key = "F3";
                        },
                        scope : this
                    }
                },{
                    key: "A",
                    ctrl : true,
                    callback : {
                        fn : function () {
                            this.data.key = "Ctrl-A";
                        },
                        scope : this
                    }
                }],
                macro : "mySectionContent"
             }/}
        </fieldset>

    {/macro}

    {macro mySectionContent()}

            {@aria:TextField {label:"This is a textfield in section 1", block:true, labelWidth : 200, id:"tf1"}/}
                 <fieldset>
                    <legend>Section 2</legend>
                    {section {
                        "id" : "mySection2",
                        "keyMap" : [{
                            key: "*",
                            callback : function () {return false;}
                        }],
                        macro : "mySection2Content"
                     }/}
                </fieldset>
    {/macro}


    {macro mySection2Content()}
        {@aria:TextField {label:"This is a textfield in section 2", block:true, labelWidth : 200, id:"tf2"}/}
    {/macro}

{/Template}
