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
    $classpath:'aria.tester.runner.view.popup.generic.Generic',
    $wlibs : {"aria" : "aria.widgets.AriaLib"},
    $hasScript:true
}}
    {macro main()}
        <div class="mask"></div>
        <div class="popup">
            <h1 class="title">{call displayPopupTitle()/}</h1>
            <div class="separator"></div>
            <div class="content">
                {call displayPopupContent()/}
            </div>
            <div class="separator"></div>
            <div class= "buttonContainer">
                {call displayButtons()/}
            </div>
        </div>
    {/macro}

    {macro displayButton(label, callback)}
        <div class="popupButton ${label}"
            {on click {
                fn : callback,
                scope : this
            }/}
        >
            ${getLabelWithShortcut(label)|escapeForHTML:false}
        </div>
    {/macro}
{/Template}
