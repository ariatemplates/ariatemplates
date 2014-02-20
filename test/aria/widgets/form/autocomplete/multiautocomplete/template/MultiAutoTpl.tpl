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
    $classpath:"test.aria.widgets.form.autocomplete.multiautocomplete.template.MultiAutoTpl",
    $hasScript:true
}}




	{macro main()}

		 <h2>AutoComplete with Multi Options</h2>
		 <br />
		{@aria:MultiAutoComplete{
			label:"Choose your city: ",
			id:"MultiAutoId",
			labelPos:"left",
			labelAlign:"right",
			width:400,
			block:false,
			labelWidth:180,
			maxOptions: data.maxOptions || 8,
			freeText: (data.freeText !== false),
			resourcesHandler: getAirLinesHandler(),
			bind:{
			  	"value" : {
			  		inside : data,
			  		to : 'ac_airline_values'
		  		}
			},
			spellCheck: false
		}/}
		 <br />
		 <input {id "justToFocusOut"/}>
	{/macro}

{/Template}
