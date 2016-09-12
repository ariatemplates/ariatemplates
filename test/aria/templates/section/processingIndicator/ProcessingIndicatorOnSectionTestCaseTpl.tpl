{Template {
	$classpath : "test.aria.templates.section.processingIndicator.ProcessingIndicatorOnSectionTpl"
}}

	{macro main()}

		{@aria:Dialog {
			macro : "dialogContent",
			bind : {
				visible : {
					to : "visible",
					inside : data
				},
				xpos : {
					to : "xpos",
					inside : data
				},
				ypos : {
					to : "ypos",
					inside : data
				}
			}
		}/}



	{/macro}

	{macro dialogContent()}
		{section {
			id : "testSectionInDialog",
			macro : "sectionContent",
			attributes: {
				style: "display: inline-block"
			}
		}/}
	{/macro}

	{macro sectionContent()}
		<div style="height: 200px;background: blue;width: 300px; display: inline-block;">Some random text</div>
	{/macro}



{/Template}