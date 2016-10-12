/**
 * UI template test for Github Issue 440
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.selectionKey.AutoCompleteRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.selectionKey.AutoCompleteRobotTestCaseTpl",
            data : {
                ac_air_value : null
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var input = this.getInputField("acDest1");
            this.synEvent.execute([["click", input], ["type", input, "a"], ["pause", 500],
                    ["type", input, "[down][down][down][down]a"], ["pause", 100]], {
                fn : this._finishTest,
                scope : this
            });
        },

        /**
         * Finalize the test, check the widgets values are the same.
         */
        _finishTest : function () {
            var test1 = this.getInputField("acDest1");
            var test2 = this.getInputField("acDest2");
            this.assertEquals(test1.value, test2.value);
            this.assertEquals(this.templateCtxt.data.ac_air_value.label, "Air Canada");
            this.notifyTemplateTestEnd();
        }
    }
});
