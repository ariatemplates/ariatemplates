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

// TODOC
{Template {
    $classpath:'aria.tester.runner.view.popup.options.Options',
    $extends:'aria.tester.runner.view.popup.generic.Generic',
    $css : ['aria.tester.runner.view.popup.options.OptionsCSS'],
    $wlibs : {"aria" : "aria.widgets.AriaLib"},
    $hasScript:true
}}
    {macro displayPopupTitle()}
        Options
    {/macro}
    {macro displayPopupContent()}
        <ul class="optionsList">
            <li class="option">
                <h2 class="optionTitle">Coverage</h2>
                {@aria:CheckBox {
                    label : "Enable coverage (beta!)",
                    bind:{
                        value:{
                            inside:this.data.application.configuration,
                            to:"coverage"
                        }
                    }
                } /}
            </li>
        </ul>
    {/macro}
    {macro displayButtons()}
        {call displayButton("apply", this._onApplyButtonClicked)/}
        {call displayButton("cancel", this._onCancelButtonClicked)/}
    {/macro}
{/Template}
