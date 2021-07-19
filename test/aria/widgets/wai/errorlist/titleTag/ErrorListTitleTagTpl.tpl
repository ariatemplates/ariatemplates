{Template {
    $classpath : "test.aria.widgets.wai.errorlist.titleTag.ErrorListTitleTagTpl"
}}

    {macro main()}
        <div style="margin: 10px;">
            {@aria:ErrorList {
                margins: "10 1 10 1",
                title: "MyErrorListTitleWithFirstHeadingLevel",
                titleTag: "h1",
                titleClassName: "myErrorListH1ClassName",
                waiAria: true,
                messages: [{
                    type: "E",
                    localizedMessage: "MyError1Description"
                }]
            }/}
            {@aria:ErrorList {
                margins: "10 1 10 1",
                title: "MyErrorListTitleWithSecondHeadingLevel",
                titleTag: "h2",
                waiAria: true,
                messages: [{
                    type: "E",
                    localizedMessage: "MyError2Description"
                }]
            }/}

            {@aria:ErrorList {
                margins: "10 1 10 1",
                title: "MyErrorListTitleWithThirdHeadingLevel",
                titleTag: "h3",
                waiAria: true,
                messages: [{
                    type: "E",
                    localizedMessage: "MyError3Description"
                }]
            }/}

            {@aria:ErrorList {
                margins: "10 1 10 1",
                title: "MyErrorListTitleWithNoHTag",
                waiAria: true,
                messages: [{
                    type: "E",
                    localizedMessage: "MyError4Description"
                }]
            }/}

            <br>
            <input {id "tf"/}/>
        </div>
  {/macro}
{/Template}
