Aria.classDefinition({
    $classpath : "test.aria.widgets.form.datepicker.DatePickerTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.widgets.form.datepicker.issue303.InfiniteLoop");
    }
});
