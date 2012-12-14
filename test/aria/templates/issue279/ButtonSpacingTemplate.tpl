{Template {
  $classpath:'test.aria.templates.issue279.ButtonSpacingTemplate',
  $wlibs : {
		html : "aria.html.HtmlLibrary"
	}
}}

	{macro main()}

		
	<div>
		{@aria:Button {
		id: "id1",
		  label:"Enable/Disable Important Button",
		  onclick : ""
		} /}
		{@aria:Button {
		id: "id2",
		  label:"Enable/Disable Important Button",
		  onclick : ""
		} /}
	</div>	

	{/macro}

{/Template}