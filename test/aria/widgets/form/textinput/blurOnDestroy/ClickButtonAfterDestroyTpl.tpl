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
	$classpath : "test.aria.widgets.form.textinput.blurOnDestroy.ClickButtonAfterDestroyTpl",
	$hasScript : true
}}

	{macro main()}

		<table>
			{repeater {
				id : "testRep",
				content : data.rep,
				loopType: "array",
				type : "tbody",
				childSections : {
					id : "childSec",
					macro : "singleEntry",
					type : "tr"
				}
			}/}
		</table>
		<table>
			<tr>
				<td width = "50%" align="left">
					<table {id "addMoreLink"/}>
						<tr><td></td><td></td></tr>
					</table>
				</td>
				<td width = "50%" align="right">
					{@aria:Button {
						label : "find",
						id : "testButton",
						onclick : function () {
							$json.setValue(data, "clicks", data.clicks + 1);
						},
						margins : "10 0 0 100"
					}/}
				</td>
				<td></td>
			</tr>
		</table>
	{/macro}

	{macro singleEntry (args)}
		<td style="width:10%"></td>
		<td style="width:45%">
			<div id="div${args.index}">
				{@aria:TextField {
					id : "tf" + args.index,
					helptext : "whatever",
					labelPos : "left",
					width : 300,
					requireFocus : true,
					onchange : {
						fn : "_onChange",
						scope : this,
						args : []
					},
					bind : {
						value : {
							to : "val",
							inside : args.item
						}
					}

				}/}
			</div>
		</td>
		<td style="width:5%">&nbsp;&nbsp;&nbsp;&nbsp;</td>
		<td style="width:30%">
			<div id="divSelect${args.index}"></div>
		</td>
		<td style="width:10%"></td>
	{/macro}

{/Template}