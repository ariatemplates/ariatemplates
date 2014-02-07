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
            aria.core.Timer.addCallback({
                fn : function() {
                    this.synEvent.type(this.getInputField("ms1"), "AF,AC,DL,AY", {
                        fn : this._afterTyping,
                        scope : this
                    });
                },
                scope : this,
                delay : 25
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
            aria.core.Timer.addCallback({
                fn : function() {
                    this.assertTrue(this.getInputField("ms1").value === "AF,AC,DL");
                    this.end();
                },
                scope : this,
                delay : 25
            });
        }
    }
});
