Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiselect.issue223.MultiSelect",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by opening the MultiSelect
         * popup.
         */
        runTemplateTest : function () {
            this.assertTrue(this.getInputField("ms1").value === "");
            this.getInputField("ms1").focus();
            this.synEvent.type(this.getInputField("ms1"), "AF,AC,DL,AY", {
                fn : this._afterTyping,
                scope : this
            });

        },

        _afterTyping : function () {
            this.assertTrue(this.getInputField("ms1").value === "AF,AC,DL,AY");
            aria.core.Timer.addCallback({
                fn : this.finishTest,
                scope : this,
                delay : 100
            });

        },

        finishTest : function () {
            this.getInputField("myTextField").focus();
            this.assertTrue(this.getInputField("ms1").value === "AF,AC,DL");
            this.end();
        }
    }
});
