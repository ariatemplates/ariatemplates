{Template {
    $classpath:'test.aria.widgets.wai.multiselect.readOnlyTextField.ReadOnlyTextFieldTpl'
}}

    {macro main()}
        <div style="margin: 10px;">
            <input {id "tf"/}> <br>
            {@aria:MultiSelect {
                id :"happyMS",
                waiAria: true,
                waiLabelHidden: true,
                waiDescribedBy: "happyMSDescription",
                iconTooltip: "Press space to open the list of check boxes",
                readOnlyTextField: true,
                label : "What do you need to be happy?",
                labelWidth : 200,
                width: 650,
                displayOptions : {
                    listDisplay : "label"
                },
                items : [
                    {label : "God", value : "God"},
                    {label : "Love", value : "Love"},
                    {label : "Forgiveness", value : "Forgiveness"},
                    {label : "Hope", value : "Hope"},
                    {label : "A spouse", value : "spouse"},
                    {label : "Good friends", value : "goodfriends"},
                    {label : "Food", value : "Food"},
                    {label : "Clothing", value : "Clothing"},
                    {label : "Shelter", value : "Shelter"},
                    {label : "A good job", value : "goodjob"},
                    {label : "A car", value : "car"},
                    {label : "A good computer", value : "goodcomputer"},
                    {label : "A smartphone", value: "smartphone"},
                    {label : "JavaScript", value : "Javascript"},
                    {label : "A good browser", value: "goodbrowser"},
                    {label : "Aria Templates", value : "ariatemplates"}
                ]
            }/}
        </div>
        <span id="happyMSDescription" style="display:none;">Press down then space to open the list of check boxes.</div>
    {/macro}

{/Template}
