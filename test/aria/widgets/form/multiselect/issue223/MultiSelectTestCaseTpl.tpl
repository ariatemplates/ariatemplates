{Template {
	$classpath:'test.aria.widgets.form.multiselect.issue223.MultiSelectTpl',
	$hasScript:false
}}

	{var content = {value : [""]}/}

	{macro main()}
		<h1>This test needs focus</h1>
		{var testItems = [
				{value:'AF', label:'AF', disabled:false},
				{value:'AC', label:'AC', disabled:false},
				{value:'NZ', label:'NZ', disabled:false},
				{value:'DL', label:'DL', disabled:false},
           		{value:'AY', label:'AY', disabled:false},
				{value:'IB', label:'IB', disabled:true},
				{value:'LH', label:'LH', disabled:false},
				{value:'MX', label:'MX', disabled:false},
				{value:'QF', label:'QF', disabled:false}
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
			maxOptions:3,
			items:testItems,
			bind:{
				value : {
					to : 'value',
					inside : content
				}
			}
		}/}

		{@aria:TextField {
			id : "myTextField",
			margins : "10 20 10 10"
		} /}
	{/macro}

{/Template}
