{Template {
    $classpath: "test.aria.html.issue1000.Issue1000Template",
    $wlibs: {"html": "aria.html.HtmlLibrary"}
}}
{macro main()}
    {@html:CheckBox {
        id: "checkId"
    }/}

    {@html:RadioButton {
        id: "radioId"
    }/}

    {@html:Select {
        id: "selectId"
    }/}

    {@html:TextArea{
        id: "areaId"
    }/}

    {@html:TextInput{
        id: "inputId"
    }/}
{/macro}
{/Template}
