{Template {
    $classpath:'test.aria.templates.issue279.ButtonSpacingTemplate'
}}

    {macro main()}
        <div>
            {@aria:Button {
                id: "id1",
                label:"Button 1",
                onclick : ""
            } /}
            {@aria:Button {
                id: "id2",
                label:"Button 2",
                onclick : ""
            } /}
        </div>
    {/macro}

{/Template}