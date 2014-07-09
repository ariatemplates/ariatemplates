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
	$classpath:'test.aria.widgets.skin.button.verticalAlign.VerticalAlign',
	$hasScript:false
}}

	{macro main()}
	    <h3>Vertical alignment test cases inside a button:</h3>
	    <p style="padding: 10px">
        {@aria:Button {
            id: "myButton",
            label : "Click Me!",
            height: 50
        }/}
        <br />
        (Weird background for atskin is normal)
        </p>

    {/macro}

{/Template}
