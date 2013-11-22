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
	"$classpath" : 'test.aria.widgets.errorTip.TemplateButtonErrorTips',
	"$hasScript" : false
}}

{var titleMessage = null /}

	{macro main()}
			<h2>Button Error Tips</h2>
			<div class="sampleDiv" >
				<div class="title">
					In this scenario clicking on the button will trigger validation failure for all empty fields, when this happens an error tool tip should display for the button.
				</div>
				<div class="sampleDiv" >
				{@aria:TextField {
					id : "textField1",
					label : "Field 1",
					bind: {
						value: {
							to: "field1",
							inside: data
						}
					}
				}/}
				</div>
				<div class="sampleDiv" >
				{@aria:Button {
					id: "submitButton1",
					label: "Submit",
					errorMessages: ["Please complete all fields before clicking submit."],
					bind: {
						error : {
							to: "error",
							inside: data
						}
					},
					onclick: {
						fn : "submit",
						scope : moduleCtrl
					}
				}/}
				</div>
			</div>
	{/macro}
{/Template}
