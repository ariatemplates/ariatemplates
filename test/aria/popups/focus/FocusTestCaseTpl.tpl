/*
 * Copyright 2014 Amadeus s.a.s.
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
	$classpath : "test.aria.popups.focus.FocusTestCaseTpl",
	$hasScript : true
}}

	{macro main()}

	    {@aria:Dialog {
	        title: "Dialog Sample",
	        macro : "myMacro",
	        icon: "std:info",
	        width: 400,
	        modal: true,
	        visible: true
	    }/}

	{/macro}

	{macro myMacro()}

	    <a {id "anchor" /} {on click "anchorClick" /} style="color:blue" href="#">anchor.</a>
	    <br/>
	    <span {id "notFocusable" /}>not focusable span</span>
	    <br/>

        {@aria:TextField {
			label: "First Name:",
			id: "firstInput",
			labelWidth: 100,
			onblur: this.myMethod,
			errorMessages: data.errorMessages,
			bind: {
				value: {
					to: "firstName",
					inside: data
				}
			}
        }/}

		{@aria:TextField {
			label: "Last Name:",
			id: "secondInput",
			labelWidth: 100,
			onblur: this.myMethod,
				bind: {
				value: {
					to: "lastName",
					inside: data
				}
			}
		}/}

	{/macro}

{/Template}
