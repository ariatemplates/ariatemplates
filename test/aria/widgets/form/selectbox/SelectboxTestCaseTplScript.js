Aria.tplScriptDefinition({
    $classpath: 'test.aria.widgets.form.selectbox.SelectboxTestCaseTplScript',
    $constructor: function() {},
    $prototype: {
        getOptions: function() {
            var opts = [];
            for (var i = 0; i < 10; i++) {
                opts.push({
                    value: i,
                    label: 'option ' + i
                });
            }
            return opts;
        }
    }
});
