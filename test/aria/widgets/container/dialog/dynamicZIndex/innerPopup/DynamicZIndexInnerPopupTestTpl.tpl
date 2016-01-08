/*
 * Copyright 2016 Amadeus s.a.s.
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
   $classpath : "test.aria.widgets.container.dialog.dynamicZIndex.innerPopup.DynamicZIndexInnerPopupTestTpl",
   $extends: "test.aria.widgets.container.dialog.dynamicZIndex.DynamicZIndexTestTpl"
}}

    {macro dialogContent(name)}
        This is dialog ${name}. <br>
        {@aria:Select {
            id: name + "Input1",
            label: "Select country",
            options: [
                {
                    label: "France",
                    value: "FR"
                },
                {
                    label: "United States",
                    value: "US"
                },
                {
                    label: "United Kingdom",
                    value: "UK"
                },
                {
                    label: "Israel",
                    value: "IL"
                }
            ],
            bind: {
                value: {
                    to: name + "Input1",
                    inside: data
                }
            }
        } /}<br />
        {@aria:DatePicker {
            id: name + "Input2",
            label: "Select date"
        } /}<br />
    {/macro}

{/Template}
