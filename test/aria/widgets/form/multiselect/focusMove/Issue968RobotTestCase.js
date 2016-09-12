Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiselect.focusMove.Issue968RobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $prototype : {

        _waitOpenDropdown : function (cb) {
            return function () {
                this.waitFor({
                    condition : function () {
                        return this.getElementsByClassName(Aria.$window.document.body, "xWidget xICNcheckBoxes").length !== 0;
                    },
                    callback : cb
                });
            };
        },

        _waitFocusAndOpenDropdown : function (input, cb) {
            return function () {
                aria.core.Timer.addCallback({
                    fn : function () {
                        this.synEvent.type(input, "[down]", {
                            fn : this._waitOpenDropdown(cb),
                            scope : this
                        });
                    },
                    scope : this,
                    delay : 25
                });
            };
        },

        runTemplateTest : function () {
            this.ms1 = this.getInputField("ms1");
            this.ms2 = this.getInputField("ms2");
            this.synEvent.click(this.ms1, {
                fn : this._waitFocusAndOpenDropdown(null, this._verifyFirstDropdown),
                scope : this
            });
        },

        _verifyFirstDropdown : function () {
            var firstOption = this._getFirstOption();
            this.assertEquals("AC", firstOption, "The first option of the opened dropdown is %2 instead of %1");

            this.synEvent.click(this.ms2, {
                fn : this._waitFocusAndOpenDropdown(null, this._verifySecondDropdown),
                scope : this
            });
        },

        _verifySecondDropdown : function () {
            var firstOption = this._getFirstOption();
            this.assertEquals("IB", firstOption, "The first option of the opened dropdown is %2 instead of %1");

            this.synEvent.click(this.ms1, {
                fn : this._waitFocusAndOpenDropdown(null, this._verifyAgainFirstDropdown),
                scope : this
            });
        },

        _verifyAgainFirstDropdown : function () {
            var firstOption = this._getFirstOption();
            this.assertEquals("AC", firstOption, "The first option of the opened dropdown is %2 instead of %1");
            this.end();
        },

        _getFirstOption : function () {
            var firstCheckbox = this.getElementsByClassName(Aria.$window.document.body, "xWidget xICNcheckBoxes")[0];
            var firstItem = firstCheckbox.parentNode;
            return firstItem.getElementsByTagName("label")[0].innerHTML;
        }

    }
});
