Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.issue315.OpenDropDownFromButtonTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.FireDomEvent"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.issue315.OpenDropDownFromButtonTestTpl",
            data : {
                email : "" // must be an empty string && res handler must return empty array in this test
            }
        });
    },
    $prototype : {
        tearDown : function () {
            aria.core.IO.$unregisterListeners(this);
        },

        runTemplateTest : function () {
            aria.core.Log.getAppenders()[0].setLogs([]);
            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : this._openAc,
                scope : this
            });
        },

        _openAc : function (evt, args) {
            this.assertLogsEmpty();
            this.notifyTemplateTestEnd();
        }
    }
})
