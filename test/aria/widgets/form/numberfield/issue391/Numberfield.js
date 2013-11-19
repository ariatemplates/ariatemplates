Aria.classDefinition({
    $classpath : "test.aria.widgets.form.numberfield.issue391.Numberfield",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.FireDomEvent", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.numberfield.issue391.NumberfieldTpl",
            data : {
                nf4Value : 123123
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {

            this.synEvent.click(this.getInputField("nf1"), {
                fn : this._onFieldFocusedNf1,
                scope : this
            });

        },
        _onFieldFocusedNf1 : function () {
            this.synEvent.type(this.getInputField("nf1"), "w345wdfd678t", {
                fn : this._afterTypingNf1,
                scope : this
            });
        },

        _afterTypingNf1 : function (evt, args) {

            aria.core.Timer.addCallback({
                fn : this._finishTestNf1,
                scope : this,
                delay : 100
            });

        },
        _finishTestNf1 : function () {
            var nf1Value = this.getInputField("nf1").value;
            this.assertEquals(nf1Value, "345678", "Entered values(0 to 9) does not match the entrty pattern");
            this.synEvent.click(this.getInputField("nf2"), {
                fn : this._onFieldFocusedNf2,
                scope : this
            });

        },
        _onFieldFocusedNf2 : function () {
            this.synEvent.type(this.getInputField("nf2"), "345wdfdsfd567", {
                fn : this._afterTypingNf2,
                scope : this
            });
        },

        _afterTypingNf2 : function (evt, args) {

            aria.core.Timer.addCallback({
                fn : this._finishTestNf2,
                scope : this,
                delay : 100
            });

        },
        _finishTestNf2 : function () {
            var nf2Value = this.getInputField("nf2").value;
            this.assertEquals(nf2Value, "3", "Entered values(1 to 3) does not match the entrty pattern");

            aria.core.Timer.addCallback({
                fn : this._checkWrongBindings,
                scope : this,
                delay : 100
            });

        },

        _checkWrongBindings : function () {
            var nf4Value = this.getInputField("nf4").value;
            this.assertEquals(nf4Value, "123123", " values does not match the acceptable chars before change");

            // change the model to a no-acceptable value
            aria.utils.Json.setValue(this.templateCtxt.data, "nf4Value", 4444);
            // check the warning
            this.assertErrorInLogs(aria.widgets.form.TextInput.WRONG_BOUND_VALUE);

            // value should not be changed
            this.assertEquals(nf4Value, "123123", " values does not match the acceptable chars after change");

            this.notifyTemplateTestEnd();
        }
    }
});
