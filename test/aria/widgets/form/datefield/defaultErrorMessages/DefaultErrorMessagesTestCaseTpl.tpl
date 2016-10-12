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
    $classpath : "test.aria.widgets.form.datefield.defaultErrorMessages.DefaultErrorMessagesTestCaseTpl"
}}

    {macro main()}
        {@aria:DateField {
            id: "bound",

            bind : {
                defaultErrorMessages: {
                    inside : this.data,
                    to : "defaultErrorMessages"
                }
            }
        }/}

        {@aria:DateField {
            id: "hardcoded",

            defaultErrorMessages : {
                validation : this.data.instanceHardCoded,
                minValue : this.data.instanceHardCoded,
                maxValue : this.data.instanceHardCoded
            }
        }/}
    {/macro}

{/Template}
