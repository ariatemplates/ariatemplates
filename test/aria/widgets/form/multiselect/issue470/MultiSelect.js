Aria.classDefinition({
    $classpath : 'test.aria.widgets.form.multiselect.issue470.MultiSelect',
    $extends : 'aria.jsunit.MultiSelectTemplateTestCase',
    $dependencies : ["aria.utils.FireDomEvent", "aria.DomEvent"],
    $constructor : function () {
        this.$MultiSelectTemplateTestCase.constructor.call(this);
    },
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by opening the MultiSelect
         * popup.
         */
        runTemplateTest : function () {
            this.toggleMultiSelectOn("ms1", this._afterDisableJump);

        },
        _afterDisableJump : function () {
            var lastCheckBox = this.getCheckBox("ms1", 5).getDom();
            var nextItem = lastCheckBox.parentNode.nextElementSibling;
            this._MSClick(nextItem, this._testOnChange, this);
        },
        _testOnChange : function () {
            this.assertTrue(this.getInputField("ms1").value !== "Iberia");
            this.toggleMultiSelectOff("ms1", this._finishTest);
        },

        _finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
