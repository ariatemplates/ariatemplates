Aria.classDefinition({
    $classpath : "test.aria.widgets.form.datepicker.validation.DatePickerWithValidatorTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            moduleCtrl : {
                classpath : "test.aria.widgets.form.datepicker.validation.DatePickerCtrl"
            }
        });
    },

    $prototype : {
        runTemplateTest : function () {
            this._datePickerField = this.getInputField("datePicker");
            this.synEvent.click(this._datePickerField, {
                fn : this._afterClicking,
                scope : this
            });

        },
        _afterClicking : function () {
            this.synEvent.type(this._datePickerField, "a", {
                fn : this._afterTyping,
                scope : this
            });
        },
        _afterTyping : function () {
            var widget = this.getWidgetInstance("btn");
            this.synEvent.click(widget.getDom(), {
                fn : this._afterValidation,
                scope : this
            });
        },
        _afterValidation : function () {
            this.synEvent.click(this._datePickerField, {
                fn : this._check,
                scope : this
            });
        },
        _check : function () {
            var dom = this.getWidgetInstance("datePicker").getDom();
            var span = dom.children[0].children[0];
            this.assertTrue(span.className.indexOf("normalError") > -1, "The datepicker should have the error state");
            this.end();
        }
    }
});
