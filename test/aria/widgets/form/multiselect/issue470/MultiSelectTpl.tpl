{Template {
	$classpath:'test.aria.widgets.form.multiselect.issue470.MultiSelectTpl',
	$hasScript:true
}}

	{var content = {value : []}/}

	{macro main()}			
		<h1>This test needs focus</h1>		
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
		{@aria:MultiSelect {
			activateSort: true,
			label: "My Multi-select:",
			labelWidth:150,
			width:400,
			fieldDisplay: "label",
			id:"ms1",
			fieldSeparator:',',
			valueOrderedByClick: true,
			maxOptions:7,
			numberOfRows:3,
			displayOptions : {
				flowOrientation:'horizontal',				
				tableMode:true,
				listDisplay: "label"		
			},
			items:testItems,		
			bind:{
				value : {
					to : 'value',
					inside : content
				}
			}
		}/}					
	{/macro}

{/Template}
