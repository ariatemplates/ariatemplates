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
	$classpath : "app.SampleTemplate",
	$hasScript : true
}}

	{macro main()}

		<div style="padding:10px;">
			<h1>The following widgets are available in this library</h1>
			<div>Two different skins are available in this sample.</div>
			<div>
				Select one
				<select {on change changeSkin/}>
					<option value="std" {if data.skin=="std"}selected{/if}>std</option>
					<option value="marker" {if data.skin=="marker"}selected{/if}>marker</option>
				</select>
			</div>
			{section {
				id : "wlist",
				bindRefreshTo : [{
					to : "skin",
					inside : data
				}],
				macro : "widgetList"
			}/}
		</div>

	{/macro}

	{macro widgetList()}
		<h2>Text input with on change listener</h2>
		<div>
			{@light:TextInput{
				id : "textInput",
				bind : {
					value : {
						to : "textInput",
						inside : data
					}
				},
				attributes : {
					classList : [data.skin]
				},
				on : {
					change : onTextInputChange
				},
				placeholder : "Type here",
				autoselect : true
			}/}
		</div>

		<h2>Autocomplete</h2>
		<div>
			{@light:AutoComplete {
				id : "ac",
				resourcesHandler : "app.SampleResourcesHandler",
				suggestionsTemplate: "atplugins.lightWidgets.autocomplete.AutocompleteTemplate",
				bind : {
					value : {
						to : "airline",
						inside : data
					}
				},
				placeholder : "Airline",
				sclass : data.skin,
				preselect : "always",
				autoselect : true
			}/}
		</div>

		<h2>Date field</h2>
		<div>
			{@light:DateField {
				id : "datefield",
				bind : {
					value : {
						to : "date",
						inside : data
					}
				},
				placeholder : "Select a date",
				attributes : {
					classList : [data.skin]
				}
			}/}
		</div>

		<h2>Date picker</h2>
		<div>
			{@light:DatePicker {
				id : "datepicker",
				bind : {
					value : {
						to : "date",
						inside : data
					}
				},
				dateField : {
					placeholder : "Select a date"
				},
				sclass : data.skin
			}/}
		</div>

		<h2>Calendar</h2>
		<div class="${data.skin}dpCalendarContainer" style="display: inline-block;">
			{@light:Calendar {
				id : "calendar",
				bind : {
					value : {
						to : "date",
						inside : data
					}
				},
				sclass : data.skin
			}/}
		</div>
	{/macro}

{/Template}