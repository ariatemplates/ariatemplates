{Template {
	$classpath:'test.aria.templates.sectionTest.SectionXTpl',
	$hasScript: true
}}

	{macro main()}
		<div class="myContainer">
		{section {
			id : "sectionx",
			macro : "sectionxMacro",
			attributes : data.mySectionAttributes,
			type : "SPAN",
			bind : {
				attributes : {
						inside : data,
						to : "mySectionAttributes"
				}
			}
		} /}
		<br/>
		{@aria:TextField {
			helptext : "Change title attribute",
			block : true,
			bind : {
				"value" : {
					inside : data.mySectionAttributes,
					to : "title"
				}
			}
		} /}
		<br/><br/>
		{@aria:Button {
			id : "1",
			label : "Change All Section attributes",
			onclick : "changeAllSectionAttributes"
		} /}
		<br/><br/>
		{@aria:Button {
			id : "2",
			label : "Change Individual section attribute",
			onclick : "changeIndividualSectionAttribute"
		} /}
		</div>
	{/macro}

	{macro sectionxMacro()}
		This section contains a title attribute, the title attribute can be changed by entering a new value in the text field and then clicking the refresh button.  To see the changes to the title attribute mouse over this section.
		<br/>
	{/macro}

{/Template}
