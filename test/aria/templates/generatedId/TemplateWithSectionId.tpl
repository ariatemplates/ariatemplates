{Template {
	$classpath:'test.aria.templates.generatedId.TemplateWithSectionId'
}}

    {macro main()}
		{section {
			id: "toto+",
			type: "div",
			bindRefreshTo: [{
				to : "sectionrefresh",
				inside : data
			}],
            attributes : {
                classList : ["section", "toto"]
            },
			macro: "sectionContent"
		}/}

		<div {id "bibi+"/} class="bibi">
		 "bibi+", out of section
		</div>

		<span {id "toto+"/} class="toto">
		    "toto+", out of section
		</span>

	{/macro}

	{macro sectionContent()}
        <div class="button">
            {@aria:Button {
                id:"bibi+",
                label:"bibi+, inside macro"
            }/}
        </div>

		<div {id "toto+"/} class="toto">
		    "toto+", inside macro
		</div>

		{if data.firstTime}
			<div {id "toto+"/} class="toto">
                "toto+", inside macro, only first time
			</div>
		{/if}
		<div {id "tototo"/} class="tototo">
		    "tototo", inside macro
		</div>
	{/macro}

{/Template}