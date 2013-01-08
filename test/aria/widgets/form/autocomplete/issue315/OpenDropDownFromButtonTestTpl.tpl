{Template {
   $classpath : "test.aria.widgets.form.autocomplete.issue315.OpenDropDownFromButtonTestTpl"
}}

  {macro main()}
    {section {
        id : "foo",
        macro: "acMacro",
        bindRefreshTo : [{
        inside : this.data, // bindRefreshTo here and bind in AC refer to the same data model entry in this edge case
        to : "email"
        }]
   }/}
  {/macro}

  {macro acMacro()}
    {@aria:AutoComplete {
        id : "ac1",
        label : "Autoselect",
        expandButton : true,
        autoselect : true,
        resourcesHandler : "test.aria.widgets.form.autocomplete.issue315.Handler",
        bind: {
          value: {
            inside: this.data,
            to: "email"
          }
        }
    }/}
  {/macro}

{/Template}
