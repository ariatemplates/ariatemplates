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

{Template {
    $classpath : "test.aria.templates.events.delegate.DelegateTemplate",
    $css : ["test.aria.templates.events.delegate.DelegateCSS"],
    $hasScript : true
}}

{macro main()}
    Test a mouseenter from the top
    <div data-name="right container" class="container blue"  {on mouseenter "logEvent"/} {on mouseleave "logEvent"/}>
        <div data-name="right child" class="child" id="internalChild">
            Move the mouse
        </div>
        over here, but coming from the top. The event target will be the child, we want to have the parent as the target.
    </div>

    // Make some room at the bottom so that the mouse has enough space to move
    <br /><br /><br /><br />

    // make sure right click is not catched
    <div id='clickTest' style="background:#ff6600; height:40px; margin:150px" {on click logEvent/}>
    </div>
{/macro}
{/Template}
