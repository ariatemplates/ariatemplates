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
   $classpath:'test.aria.templates.events.eventpropagation.EventPropagation'
}}
    {macro main()}

        <div id="outter" style="border:solid red 1px; padding:10px;margin:10px" {on click {fn:function() { data.outter += 1;} }/}>
             <div id="inner" style="border:solid green 1px; padding:10px;" {on click {fn:function(evt) { data.inner += 1; if (data.scenario == 1) { evt.stopPropagation();} else if (data.scenario == 2) {return false;} } }/}>
                 CONTENT
             </div>
        </div>

    {/macro}

{/Template}