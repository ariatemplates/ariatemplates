{Template {
	$classpath:'test.aria.templates.generatedId.TemplateWithOutSectionId'
}}

    {macro main()}
        {section {
            type: "div",
            bindRefreshTo: [{
                to : "sectionrefresh",
                inside : data
            }],
            bindProcessingTo: {
                to : "processingIndicator",
                inside : data
            },
            attributes : {
                classList : ["section"]
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