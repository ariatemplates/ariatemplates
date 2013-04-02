/**
 * UI template test for Github Issue 440
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.selectionKey.AutoComplete",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.selectionKey.AutoCompleteTpl",
            data : {
                ac_air_value : null
            }
        });
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var field = this.getInputField("acDest1");
            field.focus();
            this._downArrow();
        },
        _downArrow : function () {
            this.synEvent.type(this.getInputField("acDest1"), "a", {
                fn : this._addDelay,
                scope : this
            });
        },
        _addDelay : function () {
            aria.core.Timer.addCallback({
                fn : this._checkSelected,
                scope : this,
                delay : 1000
            });
        },
        _checkSelected : function () {
            this.synEvent.type(this.getInputField("acDest1"), "[down][down][down][a]", {
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
            this.assertTrue(test1.value === test2.value);
            this.assertTrue(this.templateCtxt.data.ac_air_value.label === "Air Canada");
            this.notifyTemplateTestEnd();
        }
    }
});
