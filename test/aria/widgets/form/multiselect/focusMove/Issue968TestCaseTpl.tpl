{Template {
    $classpath:'test.aria.widgets.form.multiselect.focusMove.Issue968TestCaseTpl',
    $hasScript:false
}}

    {macro main()}
        <h1>This test needs focus</h1>
        {var testItems1 = [
                {value:'AF', label:'AF', disabled:false},
                {value:'AC', label:'AC', disabled:false},
                {value:'NZ', label:'NZ', disabled:false},
                {value:'DL', label:'DL', disabled:false},
                {value:'AY', label:'AY', disabled:false}
            ]/}

        {var testItems2 = [
                {value:'IB', label:'IB', disabled:true},
                {value:'LH', label:'LH', disabled:false},
                {value:'MX', label:'MX', disabled:false},
                {value:'QF', label:'QF', disabled:false}
            ]/}

        {@aria:MultiSelect {
            activateSort: true,
            label: "My Multi-select 1:",
            labelWidth:150,
            width:400,
            fieldDisplay: "label",
            id:"ms1",
            fieldSeparator:',',
            valueOrderedByClick: true,
            maxOptions:3,
            items:testItems1
        }/}

        {@aria:MultiSelect {
            activateSort: true,
            label: "My Multi-select 2:",
            labelWidth:150,
            width:400,
            fieldDisplay: "label",
            id:"ms2",
            fieldSeparator:',',
            valueOrderedByClick: true,
            maxOptions:3,
            items:testItems2
        }/}

    {/macro}

{/Template}
