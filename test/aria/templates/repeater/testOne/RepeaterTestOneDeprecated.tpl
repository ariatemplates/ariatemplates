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
/* BACKWARD-COMPATIBILITY-BEGIN (cssclass) */
// This file should be deleted when removing backward compatibility on cssClass
{Template {
    $classpath:"test.aria.templates.repeater.testOne.RepeaterTestOneDeprecated",
    $hasScript:true,
    $extends: "test.aria.templates.repeater.testOne.RepeaterTestOne"
}}

    {macro main()}
        <table>
        {repeater {
            loopType: "array",
            content: data.myArray,
            type: "TBODY",
            cssClass : "container",
            childSections : {
                    id: "myChildSection",
                    macro: "myMacro",
                    type: "TR",
                    cssClass: myCSSFunction
            }
        }/}
        </table>
    {/macro}

{/Template}
/* BACKWARD-COMPATIBILITY-END (cssclass) */