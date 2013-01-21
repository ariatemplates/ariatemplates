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
	$classpath:'test.aria.templates.sectionTest.SectionXTpl',
	$hasScript: true
}}

	{macro main()}
		<div class="myContainer">
		{section {
			id : "sectionx",
			macro : "sectionxMacro",
			attributes : data.mySectionAttributes,
			type : "SPAN",
			bind : {
				attributes : {
						inside : data,
						to : "mySectionAttributes"
				}
			}
		} /}
		<br/>
		{@aria:TextField {
			helptext : "Change title attribute",
			block : true,
			bind : {
				"value" : {
					inside : data.mySectionAttributes,
					to : "title"
				}
			}
		} /}
		<br/><br/>
		{@aria:Button {
			id : "1",
			label : "Change All Section attributes",
			onclick : "changeAllSectionAttributes"
		} /}
		<br/><br/>
		{@aria:Button {
			id : "2",
			label : "Change Individual section attribute",
			onclick : "changeIndividualSectionAttribute"
		} /}
		</div>
	{/macro}

	{macro sectionxMacro()}
		This section contains a title attribute, the title attribute can be changed by entering a new value in the text field and then clicking the refresh button.  To see the changes to the title attribute mouse over this section.
		<br/>
	{/macro}

{/Template}
