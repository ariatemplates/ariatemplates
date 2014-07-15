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
	$classpath : "test.aria.widgets.form.widgetsfont.WidgetsFontTemplate",
	$hasScript : true
}}
	{macro main()}

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
			id:"wv4",
			width : 350,
			bind:{
				value:{
					inside:data, to:"numberFieldValue"
				}
			}
		}/}
		<br/>
		{@aria:TextField {
			label : "TextField",
			labelPos : "left",
			id:"wv5",
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
			id:"wv6",
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
			id:"wv7",
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
			id:"wv8",
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
			id:"wv9",
			labelWidth : 100,
			height : 50,
			bind:{
				value:{
					inside:this.data, to:"txtAreaValue"
				}
			}
		}/}
		<br/>
		{@aria:Select {
			label: "Select",
			labelWidth:220,
			id:"wv10",
			options: [
				{label: "Type A", value: "A"},
				{label: "Type B", value: "B"}
			]
		}/}
		<br/>
		{@aria:RadioButton {
			id:"wv11",
			label:"Radio Button"
		}/}
		<br/>
		{@aria:CheckBox {
			id:"wv12",
			label:"CheckBox"
		}/}
		<br/>
		{@aria:MultiSelect {
			activateSort: true,
			label: "MultiSelect:",
			labelWidth:150,
			fieldDisplay: "code",
			width:400,
			disabled: true,
			id:"wv13",
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
			id:"wv14",
			disabled: true,
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
			id:"wv15",
			label: "Date Picker",
			disabled: true,
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
			disabled: true,
			id:"wv16",
			width : 350,
			bind:{
				value:{
					inside:data, to:"numberFieldValue"
				}
			}
		}/}
		<br/>
		{@aria:TextField {
			label : "TextField",
			labelPos : "left",
			id:"wv17",
			disabled: true,
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
			disabled: true,
			helptext : "Enter a departure time",
			width : 250,
			id:"wv18",
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
			id:"wv19",
			disabled: true,
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
			disabled: true,
			id:"wv20",
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
			disabled: true,
			id:"wv21",
			labelWidth : 100,
			height : 50,
			bind:{
				value:{
					inside:this.data, to:"txtAreaValue"
				}
			}
		}/}
		<br/>
		{@aria:Select {
			label: "Select",
			labelWidth: 220,
			id: "wv22",
			disabled: true,
			options: [
				{label: "Type A", value: "A"},
				{label: "Type B", value: "B"}
			]
		}/}
		<br/>
		{@aria:RadioButton {
			id: "wv23",
			disabled: true,
			label: "Radio Button"
		}/}
		<br/>
		{@aria:CheckBox {
			id: "wv24",
			disabled: true,
			label: "CheckBox"
		}/}
		<br/>
		{@aria:Button {
			id: "wv25",
			label: "Button"
		}/}
		<br/>
		{@aria:Button {
			id: "wv26",
			disabled: true,
			label:  "Disabled Button"
		}/}
		<br/>
		{@aria:Tab {
			tabId : "Tab1",
			selectedTab : "Tab1"
		}}
			Tab1
		{/@aria:Tab}

		{@aria:Tab {
			tabId : "Tab2",
			disabled : true
		}}
			Tab2
		{/@aria:Tab}
		{@aria:TabPanel {
			block : true,
			id: "wv27",
			macro : "panelContent",
			margins: "0 0 0 0",
			selectedTab : "Tab1"
		}/}
		<br/>
		{@aria:MultiAutoComplete {
			label:"MultiAutoComplete",
			width:400,
			id:"wv28",
			labelWidth:180,
			expandButton:true,
			resourcesHandler: getMACHandler()
		}/}
		<br/>
		{@aria:MultiAutoComplete {
			label:"MultiAutoComplete",
			width:400,
			id:"wv29",
			disabled:true,
			labelWidth:180,
			expandButton:true,
			resourcesHandler: getMACHandler()
		}/}
		<br/>
		{@aria:Calendar {
			id:"wv30",
			numberOfUnits: 1
		}/}
		<br/>
		{@aria:Div {
		}}
			Sample div
		{/@aria:Div}

	{/macro}
	{macro panelContent()}
		<h3>A Tab 1 Non Macro content</h3>
	{/macro}
{/Template}
