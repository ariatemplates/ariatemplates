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
	$classpath : "test.aria.templates.section.asContainer.TestTemplate",
	$hasScript : true,
	$macrolibs: {
		testMacroLib : "test.aria.templates.section.asContainer.TestMacro"
	}
}}

	{var viewData = {value : 0}/}

	{macro main()}
		{var firstVar = "maintemplatevar"/}
		{section {
			id : "sectionOne",
			bindRefreshTo : [{
				to : "value",
				inside : viewData
			}]
		}}
			{var secondVar = "testforlocalVar"/}
			<div id="testDiv1">${viewData.value}</div>
			<div id="testDiv2">${firstVar}</div>
			<div id="testDiv3">${getValue()}</div>
			<div id="testDiv8">${secondVar}</div>
			{section {
				id : "sectionTwo",
				bindRefreshTo : [{
					to : "value",
					inside : viewData
				}]
			}}
				{var thirdVar = getThirdVar()/}
				<div id="testDiv4">${viewData.value}</div>
				<div id="testDiv5">${firstVar}</div>
				<div id="testDiv6">${getValue()}</div>
				<div id="testDiv10">${thirdVar}</div>
				{call testMacroLib.justAMacro(viewData.value)/}
			{/section}
		{/section}

		{section "sectionThree"}
			<div>
				{@aria:Button {
					id : "buttonOne",
					label : "Trigger auto refresh",
					onclick : refreshAuto
				}/}
			</div>
			<div id="testDiv7">${viewData.value}</div>
			<div id="testDiv9">${secondVar}</div>
			<div id="testDiv11">${thirdVar}</div>
			{set thirdVar = "overriddenThirdVar"/}
			<div id="testDiv13">${thirdVar}</div>
		{/section}

		{call justAnotherMacro()/}
	{/macro}

	{macro justAnotherMacro()}
		{var secondVar = "differentValue"/}
		<div id="testDiv12">${secondVar}</div>
	{/macro}


 {/Template}