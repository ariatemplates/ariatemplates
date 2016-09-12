Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiselect.issue223.MultiSelectTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by opening the MultiSelect
         * popup.
         */
        runTemplateTest : function () {

            this.ms = this.getInputField("ms1");
            this.msDom = this.getWidgetInstance('ms1')._domElt;

            this.assertTrue(this.ms.value === "");
            this.ms.focus();

            // Wait for the field to be focused
            this.waitForWidgetFocus("ms1", function () {
                this.synEvent.type(this.ms, "AF,AC,DL,AY", {
                    fn : this._afterTyping,
                    scope : this
                });
            });
        },

        _afterTyping : function () {
            this.assertTrue(this.ms.value === "AF,AC,DL,AY");

            this.getInputField("myTextField").focus();

            // Wait for the ms field to be blured
            this.waitForWidgetFocus("myTextField", this.finishTest);

        },

        finishTest : function () {
            this.assertTrue(this.ms.value === "AF,AC,DL");
            this.end();
        }
    }
});
