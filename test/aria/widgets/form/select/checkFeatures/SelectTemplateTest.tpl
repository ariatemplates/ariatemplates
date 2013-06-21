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
   $classpath:"test.aria.widgets.form.select.checkFeatures.SelectTemplateTest"
}}
    {macro main()}
            <h1>THIS TEST NEEDS FOCUS</h1>
            {@aria:Select {
                id: "selectWidget",
                sclass: data.sclass,
                options: data.options,
                onchange: {
                    scope: data.testCase,
                    fn: data.testCase.onChangeCallback
                },
                bind: {
                    value: {
                        to: "value",
                        inside: data
                    },
                    disabled: {
                        to: "disabled",
                        inside: data
                    },
                    mandatory: {
                        to: "mandatory",
                        inside: data
                    },
                    readOnly : {
                        to : "readOnly",
                        inside: data
                    },
                    label : {
                        to : "label",
                        inside: data
                    }
                }
            }/}
            {@aria:Button {label:"OK"}/}
    {/macro}

{/Template}