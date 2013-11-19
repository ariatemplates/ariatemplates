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
					acceptableCharacters:/[0-9]/g
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
					acceptableCharacters:/[123]/g
				}/}
			</p>
			<p>
				{@aria:TextField {
					label:"TextField:",
					labelPos:"left",
					labelAlign:"right",
					id: "nf3",
					helptext:"Enter 1 or 2 or 3 only",
					width:100,
					block:true,
					mandatory: true,
					acceptableCharacters:/[123]/g
				}/}
			</p>

			<p>
			{@aria:NumberField {
				label:"Number Field:",
				labelPos:"left",
				labelAlign:"right",
				id: "nf4",
				width:100,
				block:true,
				acceptableCharacters:/[123]/g,
				bind:{
					value :{
						inside: data,
						to: "nf4Value"
					}
				}
			}/}
			</p>

	{/macro}

{/Template}
