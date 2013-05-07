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
    $classpath : "test.aria.templates.css.inheritance.Inherit"
}}

{macro main()}
This template includes a widget that inherits some \$css templates. The test should load the dependencies
and unload them correctly.

<br/>
SelectBox inherits TextInput that inherits Icon

{section {
    id : "widget",
    bindRefreshTo : [{
        inside : data,
        to : "step"
    }]
}}
    Current Step: ${data.step}

    {if data.step === 0}
        {@aria:SelectBox {
            options:[{label: "A", value: "A"},{label: "B", value: "B"}],
            label:"I'm a selectbox",
            bind : {
                value : {
                    inside : data,
                    to : "selectboxValue"
                }
            }
        }/}
    {/if}


    <a id="next" {on click {
        fn : function () {
            this.$json.setValue(data, "step", (data.step + 1) % 3);
        },
        scope : this
    }/}>Next step</a>
{/section}
{/macro}

{/Template}
