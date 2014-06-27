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
	$classpath : "test.aria.widgets.form.labelClick.FocusTestTemplate",
	$hasScript : true
}}
	{macro main()}
		{@aria:MultiSelect {
			activateSort: true,
			label: "MultiSelect:",
			labelWidth:150,
			fieldDisplay: "code",
			width:400,
			id:"w1",
			items:[{value:'AF', label:'Air France', disabled:false},
			{value:'AC', label:'Air Canada', disabled:false},
			{value:'NZ', label:'Air New Zealand', disabled:false}]
		}/}
		{@aria:MultiSelect {
			activateSort: true,
			label: "MultiSelect:",
			labelWidth:150,
			fieldDisplay: "code",
			width:400,
			id:"wv1",
			items:[{value:'AF', label:'Air France', disabled:false},
			{value:'AC', label:'Air Canada', disabled:false},
			{value:'NZ', label:'Air New Zealand', disabled:false}],
			bind:{
				value:{
					inside:data, to:"multiSelectValue"
				}
			}
		}/}
		<br/>
		{@aria:DateField {
			label : "DateField",
			labelPos : "left",
			id:"w2",
			labelAlign : "right",
			helptext : "Enter date 1",
			width : 450
		}/}
		{@aria:DateField {
			label : "DateField",
			labelPos : "left",
			id:"wv2",
			labelAlign : "right",
			helptext : "Enter date 1",
			width : 450,
			bind:{
				value:{
					inside:data, to:"dateFieldValue"
				}
			}
		}/}
		<br/>
		{@aria:DatePicker {
			label: "Date Picker",
			id:"w3"
		}/}
		 {@aria:DatePicker {
			id:"wv3",
			label: "Date Picker",
			bind:{
				value:{
					inside:data, to:"dateFieldValue"
				}
			}
		}/}
		<br/>
		{@aria:NumberField {
			label : "NumberField",
			labelPos : "left",
			labelWidth : 100,
			width : 350,
			id:"w4"
		}/}
		{@aria:NumberField {
			label : "NumberField",
			labelPos : "left",
			labelWidth : 100,
			id:"wv4",
			width : 350,
			bind:{
				value:{
					inside:data, to:"numberFieldValue"
				}
			}
		}/}
		<br/>
		{@aria:PasswordField {
			label : "PasswordField",
			id:"w5"
		}/}
		{@aria:PasswordField {
			label : "PasswordField",
			id:"wv5",
			bind:{
				value:{
					inside:data, to:"passwordFieldValue"
				}
			}
		}/}
		<br/>
		{@aria:TextField {
			label : "TextField",
			labelPos : "left",
			id:"w6",
			helptext : "Enter your first name",
			width : 280,
			labelWidth : 100
		}/}
		{@aria:TextField {
			label : "TextField",
			labelPos : "left",
			id:"wv6",
			helptext : "Enter your first name",
			width : 280,
			labelWidth : 100,
			bind:{
				value:{
					inside:this.data, to:"txtFieldValue"
				}
			}
		 }/}
		 <br/>
		 {@aria:TimeField {
			label : "TimeField",
			labelPos : "left",
			labelAlign : "right",
			helptext : "Enter a departure time",
			width : 250,
			id:"w7"
		}/}
		{@aria:TimeField {
			label : "TimeField",
			labelPos : "left",
			labelAlign : "right",
			helptext : "Enter a departure time",
			width : 250,
			id:"wv7",
			pattern:"h:m",
			bind:{
				value:{
					inside:this.data, to:"timeFieldValue"
				}
			}
		}/}
		<br/>
		{@aria:SelectBox {
			label: "SelectBox",
			labelWidth:220,
			id:"w8",
			options: [
				{label: "Type A", value: "A"},
				{label: "Type B", value: "B"}
			]
		}/}
		{@aria:SelectBox {
			label: "SelectBox",
			labelWidth:220,
			id:"wv8",
			options: [
				{label: "Type A", value: "A"},
				{label: "Type B", value: "B"}
			],
			bind:{
				value:{
					inside:this.data, to:"selectBoxValue"
				}
			}
		}/}
		<br/>
		{@aria:AutoComplete {
			label : "AutoComplete",
			labelWidth: 170,
			resourcesHandler : getAutoCompleteHandler(3),
			id:"w9"
		}/}
		{@aria:AutoComplete {
		label : "AutoComplete",
			labelWidth: 170,
			resourcesHandler : getAutoCompleteHandler(3),
			id:"wv9",
			bind:{
				value:{
					inside:this.data, to:"autoCompleteValue"
				}
			}
		}/}
		<br/>
		{@aria:Textarea {
			label : "TextArea",
			labelPos : "left",
			helptext : "Enter your first name",
			width : 280,
			labelWidth : 100,
			height : 50,
			id:"w10"
		}/}
		{@aria:Textarea {
			label : "TextArea",
			labelPos : "left",
			helptext : "Enter your first name",
			width : 280,
			id:"wv10",
			labelWidth : 100,
			height : 50,
			bind:{
				value:{
					inside:this.data, to:"txtAreaValue"
				}
			}
		}/}
		<br/>
		{@aria:MultiAutoComplete {
			label:"MultiAutoComplete",
			width:400,
			id:"w11",
			labelWidth:180,
			expandButton:true,
			resourcesHandler: getMACHandler()
		}/}
		<br/>
		{@aria:Select {
			label: "Select",
			labelWidth:220,
			id:"w12",
			options: [
				{label: "Type A", value: "A"},
				{label: "Type B", value: "B"}
			]
		}/}
	{/macro}
{/Template}
