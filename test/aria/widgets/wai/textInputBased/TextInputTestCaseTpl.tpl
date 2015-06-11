{Template {
	$classpath : 'test.aria.widgets.wai.textInputBased.TextInputTestCaseTpl',
	$hasScript: true
}}

	{macro main()}

		{@aria:TextField {
		    id:"text1",
			label:"Textfield 1",
			labelWidth : 100,
			directOnBlurValidation:true,
			autoselect: true,
            bind: {
                value : {
                    to: 'value',
                    inside: data.text1
                },
                mandatory: {
                    to: 'mandatory',
                    inside: data.text1
                }
            }
		}/}
		<br /><br />
        {@aria:TextField {
            id:"text2",
            label:"Textfield 2",
            labelWidth : 100,
            directOnBlurValidation:true,
            autoselect: true,
            bind: {
                value : {
                    to: 'value',
                    inside: data.text2
                },
                mandatory: {
                    to: 'mandatory',
                    inside: data.text2
                }
            }
        }/}
        <br /><br />
        {@aria:Textarea {
            id:"textarea1",
            label : "TextArea 1",
            labelPos : "left",
            helptext : "Enter your first name",
            width : 280,
            labelWidth : 100,
            height : 50,
            autoselect: true,
            bind: {
                value : {
                    to: 'value',
                    inside: data.textarea1
                },
                mandatory: {
                    to: 'mandatory',
                    inside: data.textarea1
                }
            }
        }/}
        <br /><br />
        {@aria:Textarea {
            id:"textarea2",
            label : "TextArea 2",
            labelPos : "left",
            width : 280,
            labelWidth : 100,
            height : 50,
            autoselect: true,
            bind: {
                value : {
                    to: 'value',
                    inside: data.textarea2
                },
                mandatory: {
                    to: 'mandatory',
                    inside: data.textarea2
                }
            }
        }/}
        <br /><br />
        {@aria:NumberField {
            label : "Number",
            id : "number1",
            autoselect: true,
            bind: {
                value : {
                    to: 'value',
                    inside: data.number1
                },
                mandatory: {
                    to: 'mandatory',
                    inside: data.number1
                }
            }
       }/}


	{/macro}

{/Template}
