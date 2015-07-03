{Template {
    $classpath : "test.aria.widgets.wai.input.passwordField.PasswordFieldTestCaseTpl",
    $hasScript : false
}}

    {macro main()}
        <div style="margin:10px;font-size:+3;font-style:bold;">This test needs focus.</div>
        <div style="margin:10px;">
            Using default accessibility and a label defined: <br>
            {@aria:PasswordField {
                id : "default - with label",
                label : "default - with label",
                labelWidth: 100,
                value: "default - with label"
            }/} <br><br>
            Using default accessibility and no label defined: <br>
            {@aria:PasswordField {
                id : "default - no label",
                labelWidth: 100,
                value: "default - no label"
            }/} <br><br>
            With accessibility enabled and a label defined but hidden: <br>
            {@aria:PasswordField {
                id : "enabled - with label hidden",
                waiAria : true,
                label : "enabled - with label hidden",
                labelWidth: 100,
                value: "enabled - with label hidden",
                hideLabel: true
            }/} <br><br>
            With accessibility enabled and a bound label defined but hidden: <br>
            {@aria:PasswordField {
                id : "enabled - with bound label hidden",
                waiAria : true,
                label : "enabled - with bound label hidden",
                labelWidth: 100,
                value: "enabled - with bound label hidden",
                hideLabel: true,
                bind: {
                  label: {
                    to: "label",
                    inside: data
                  }
                }
            }/} <br><br>
            With accessibility enabled and a label defined: <br>
            {@aria:PasswordField {
                id : "enabled - with label",
                waiAria : true,
                label : "enabled - with label",
                labelWidth: 100,
                value: "enabled - with label"
            }/} <br><br>
            With accessibility enabled and no label defined: <br>
            {@aria:PasswordField {
                id : "enabled - no label",
                waiAria : true,
                value: "enabled - no label"
            }/}<br><br>
            With accessibility disabled and a label defined: <br>
            {@aria:PasswordField {
                id : "disabled - with label",
                label : "disabled - with label",
                waiAria : false,
                value: "disabled - with label"
            }/}<br><br>
            With accessibility disabled and no label defined: <br>
            {@aria:PasswordField {
                id : "disabled - no label",
                waiAria : false,
                value: "disabled - no label"
            }/}
        </div>

    {/macro}

{/Template}
