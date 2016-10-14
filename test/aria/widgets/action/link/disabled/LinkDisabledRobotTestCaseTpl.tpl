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
	$classpath: "test.aria.widgets.action.link.disabled.LinkDisabledRobotTestCaseTpl",
	$hasScript: true
}}
	{var data = {link1Disabled : false, link2Disabled : true, clicksNumber1: 0, clicksNumber2: 0}/}
	{macro main()}
		{@aria:Link {
			label: "Some Link 1",
			id: "link1",
			bind :{
				disabled : {
					inside :data,
					to : "link1Disabled"
				}
			},
			onclick: onClickLink1
		}/}<br>

		{@aria:Link {
			label: "Some Link 2",
			id: "link2",
			sclass: "alternative",
			bind :{
				disabled : {
					inside :data,
					to : "link2Disabled"
				}
			},
			onclick: onClickLink2
		}/}<br>

		<span {id "toggleDisabled"/} {on click "onToggleDisabledClick"/} >Toggle disabled</span><br>
		<span>Number of clicks:
		{@aria:Text {
			bind: {
				text: {
					to: "clicksNumber1",
					inside: data
				}
			}
		}/},
		{@aria:Text {
			bind: {
				text: {
					to: "clicksNumber2",
					inside: data
				}
			}
		}/}
		</span><br>
		{var skinStd = aria.widgets.AriaSkinInterface.getSkinObject("Link", "std") /}
		<span {id "stdNormalColor"/} style="color:${skinStd.states.normal.color};">normal</span><br>
		<span {id "stdDisabledColor"/} style="color:${skinStd.disabledColor};">disabled</span><br>
		{var skinAlternative = aria.widgets.AriaSkinInterface.getSkinObject("Link", "alternative") /}
		<span {id "alternativeNormalColor"/} style="color:${skinAlternative.states.normal.color};">normal</span><br>
		<span {id "alternativeDisabledColor"/} style="color:${skinAlternative.disabledColor};">disabled</span><br>
	{/macro}
{/Template}
