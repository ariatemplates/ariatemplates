{Template {
	$classpath:'test.aria.widgets.form.numberfield.issue391.NumberfieldTpl'
}}

	{macro main()}
		<br /><br /><br />
		<br /><br /><br />
			<p>
				{@aria:NumberField {
					label:"Number Field:",
					labelPos:"left",
					labelAlign:"right",
					id: "nf1",
					helptext:"Enter a number",
					width:100,
					block:true,
					mandatory: true,
					entryPattern:/[0-9]/g,
					errorMessages:["Please type in a number"]
				}/}
			</p>
			<p>
				{@aria:NumberField {
					label:"Number Field:",
					labelPos:"left",
					labelAlign:"right",
					id: "nf2",
					helptext:"Enter a number",
					width:100,
					block:true,
					mandatory: true,
					entryPattern:/[123]/g,
					errorMessages:["Please type in a number"]
				}/}
			</p>


	{/macro}

{/Template}