{Template {
	$classpath : 'test.aria.widgets.verticalAlign.VerticalAlignTestCaseTpl',
	$css:['test.aria.widgets.verticalAlign.VerticalAlignCss'],
	$hasScript : true
}}

	{macro main()}

		<div class="line"><div class="rule"></div>
			{var selectBoxData={
				selectedValue : "FR",
				countries : [{
					value : "FR",
					label : "France"
				}, {
					value : "CH",
					label : "Switzerland"
				},{
					value : "UK",
					label : "United Kingdom"
				},{
					value : "US",
					label : "United States"
				},{
					value : "ES",
					label : "Spain"
				},{
					value : "PL",
					label : "Poland"
				},{
					value : "SE",
					label : "Sweden"
				},{
					value : "USA",
					label : "United States of America"
				}]
			}/}
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield "
			}/}
			{@aria:Select {
				id: "mySelect1",
				label: "Select ",
				options: selectBoxData.countries
			}/}
		</div><br />
		<div class="line"><div class="rule"></div>
			{var testItems = [
					{value:'AF', label:'Air France', disabled:false},
					{value:'AC', label:'Air Canada', disabled:false},
					{value:'NZ', label:'Air New Zealand', disabled:false},
					{value:'DL', label:'Delta Airlines', disabled:false},
	           		{value:'AY', label:'Finnair', disabled:false},
					{value:'IB', label:'Iberia', disabled:true},
					{value:'LH', label:'Lufthansa', disabled:false},
					{value:'MX', label:'Mexicana', disabled:false},
					{value:'QF', label:'Quantas', disabled:false}
				]/}
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield "
			}/}
			{@aria:MultiSelect {
				activateSort: true,
				label: "Multiselect:",
				fieldDisplay: "code",
				fieldSeparator:',',
				valueOrderedByClick: true,
				numberOfRows:4,
				displayOptions : {
					flowOrientation:'horizontal',
					listDisplay: "both",
					displayFooter : true
				},
				items:testItems
			}/}
		</div><br />
		<div class="line"><div class="rule"></div>
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield "
			}/}
			{@aria:AutoComplete {
				id: "acDest",
				label:"Autocomplete: ",
				resourcesHandler:getAirLinesHandler(),
				helptext:"airport"
			}/}
		</div><br />
		<div class="line"><div class="rule"></div>
			{@aria:Link {
				label: "This is a link"
			}/}
			{@aria:TextField {
				label:"Email address",
				labelAlign:"left",
				helptext:"Textfield "
			}/}
			{@aria:Link {
				label: "This is a link"
			}/}
		</div><br />
		<div class="line"><div class="rule" style="top: 13px;"></div>
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield "
			}/}
			{@aria:Button {label:"Button"} /}
		</div><br />
		<div class="line"><div class="rule" style="top: 11px;"></div>
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield "
			}/}
			{@aria:Gauge {
					minValue: -100,
					currentValue: 20,
					gaugeWidth: 200,
					label: "Gauge "
			}/}
		</div><br />
		<div class="line"><div class="rule"></div>
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield "
			}/}
			{@aria:DateField {
				label:"DateField: ",
				labelPos:"left",
				labelAlign:"right",
				helptext:"Enter date 1"
			}/}
		</div><br />
		<div class="line"><div class="rule"></div>
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield "
			}/}
			{@aria:DatePicker {
				label: "DatePicker: "
			}/}
		</div><br />
		<div class="line"><div class="rule" style="top: 11px;"></div>
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield "
			}/}
			{@aria:CheckBox {
					label: "Checkbox 1 "
			}/}
			{@aria:CheckBox {
					label: "Checkbox 2 "
			}/}
		</div><br />
		<div class="line"><div class="rule" style="top: 11px;"></div>
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield: "
			}/}
			{@aria:RadioButton {
				label: "RadioButton a: ",
				keyValue: "a",
				bind:{
				  	"value":{inside: data, to: 'group1'}
				},
				labelPos: "left"
			}/}
			{@aria:RadioButton {
				label: "RadioButton b: ",
  				keyValue: "b",
				bind:{
				  	"value":{inside: data, to: 'group1'}
				},
				labelPos: "left"
			}/}

			{@aria:RadioButton {
				label: "RadioButton c: ",
				keyValue: "c",
				bind:{
				  	"value":{inside: data, to: 'group1'}
				},
				labelPos: "left"
			}/}
		</div><br />
		<div class="line"><div class="rule" style="top: 11px;"></div>
			{@aria:TextField {
				label:"email address",
				labelPos:"top",
				helptext:"Textfield: "
			}/}
			{@aria:RadioButton {
				label: "RadioButton a: ",
				keyValue: "a",
				bind:{
				  	"value":{inside: data, to: 'group1'}
				},
				verticalAlign: "bottom",
				labelPos: "left"
			}/}
			{@aria:RadioButton {
				label: "RadioButton b: ",
  				keyValue: "b",
				bind:{
				  	"value":{inside: data, to: 'group1'}
				},
				verticalAlign: "bottom",
				labelPos: "left"
			}/}

			{@aria:RadioButton {
				label: "RadioButton c: ",
				keyValue: "c",
				bind:{
				  	"value":{inside: data, to: 'group1'}
				},
				verticalAlign: "bottom",
				labelPos: "left"
			}/}
		</div><br />

		<div class="line"><div class="rule" style="top: 47px;"></div>
			{@aria:TextField {
				label:"email address",
				labelAlign:"left",
				helptext:"Textfield: "
			}/}
			{@aria:List {
				items:[{value:0, label:'OptionA'}, {value:1, label:'OptionB'}, {value:2, label:'OptionC'}, {value:3, label:'OptionD'}, {value:4, label:'OptionE'}],
				minWidth:100
			}/}
		</div>

		<textarea id="snapshotId" style="width: 100%;height: 200px;"></textarea>

	{/macro}

{/Template}
