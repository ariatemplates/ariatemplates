/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiselect.checkFeatures.MultiSelect",
    $extends : "aria.jsunit.MultiSelectTemplateTestCase",
    $dependencies : ["aria.utils.FireDomEvent", "aria.DomEvent"],
    $constructor : function () {
        this.$MultiSelectTemplateTestCase.constructor.call(this);
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("ms1"), {
                fn : this._onMSFocused,
                scope : this
            });
        },

        _onMSFocused : function () {
            this.synEvent.type(this.getInputField("ms1"), "af, ac", {
                fn : this._onMSOpened,
                scope : this
            });
        },

        _onMSOpened : function () {
            this.getInputField("ms1").blur();
            aria.core.Timer.addCallback({
                fn : function() {
                    this.assertTrue(this.getInputField("ms1").value == "Air France,Air Canada");
                    this.toggleMultiSelectOn("ms1", this._onIconClicked);
                },
                scope : this,
                delay : 25
            });
        },

        _onIconClicked : function () {
            this.toggleMultiSelectOption("ms1", 0, this._clickedFirstCheckBox);
        },

        _clickedFirstCheckBox : function (evt, args) {
            this.assertTrue(this.getInputField("ms1").value == "Air France");
            this.toggleMultiSelectOption("ms1", 2, this._clickedThirdCheckBox);
        },

        _clickedThirdCheckBox : function () {
            this.getInputField("ms1").blur();
            this.assertTrue(this.getInputField("ms1").value == "Air France,Air New Zealand");
            // this test check that multiple disabled options are jumped
            this.toggleMultiSelectOption("ms1", 8, this._onLastOptionChecked);
        },

        _onLastOptionChecked : function () {
            var lastCheckBox = this.getCheckBox("ms1", 8).getDom();
            lastCheckBox.focus();

            var that = this;
            aria.utils.FireDomEvent.fireEvent('keydown', lastCheckBox, {
                keyCode : 38
            });
            setTimeout(function () {
                that._afterDisableJump();
            }, 200);

            // This method doesn't work any longer with ms navigation
            /*
            this.synEvent.type(lastCheckBox, "[up]", {
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : this._afterDisableJump,
                        scope : this,
                        delay : 200
                    });
                },
                scope : this
            });
            */
        },

        _afterDisableJump : function () {
            var targetCheckBox = this.getCheckBox("ms1", 2);
            this.assertTrue(targetCheckBox._hasFocus, "Could not jump over disabled items");
            // continue with next test
            this._testOnChange();
        },

        /**
         * Test onchange triggering
         */
        _testOnChange : function () {
            this.toggleMultiSelectOn("ms2", this._onIconClicked2);
        },

        _onIconClicked2 : function () {
            this.assertTrue(!this.templateCtxt.data.changed, "onchange should not be called on first opening of the multiselect");
            this.toggleMultiSelectOption("ms2", 0, this._onOptionChange);
        },

        _onOptionChange : function () {
            // now close multiselect
            this.toggleMultiSelectOff("ms2", this._onClose);
        },

        _onClose : function () {
            // test that onchange is called
            this.assertTrue(this.templateCtxt.data.changed, "onchange should be called as an item was selected");
            this.templateCtxt.data.changed = false;
            // reopen
            this.toggleMultiSelectOn("ms2", this._onReopen);

        },

        _onReopen : function () {
            // select option 2
            this.toggleMultiSelectOption("ms2", 1, this._onSecondChange);
        },

        _onSecondChange : function () {
            // unselect option 2
            this.toggleMultiSelectOption("ms2", 1, this._onUnSelect);
        },

        _onUnSelect : function () {
            // close again
            this.toggleMultiSelectOff("ms2", this._onCloseAgain);
        },

        _onCloseAgain : function () {
            // check onchange : options are the same, it should not be called
            this.assertFalse(this.templateCtxt.data.changed, "options are the same, onchange should not be called");

            // reopen again
            this.templateCtxt.data.changed = false;
            this.toggleMultiSelectOn("ms2", this._onReopenAgain);
        },

        _onReopenAgain : function () {
            this.toggleMultiSelectOption("ms2", 1, this._onThirdChange);
        },

        _onThirdChange : function () {
            var listController = this.getWidgetInstance("ms2").controller.getListWidget()._subTplModuleCtrl;
            listController.close();
            this.assertTrue(this.templateCtxt.data.changed, "options have changed before calling the close on the controller, onchange should be called");
            this.notifyTemplateTestEnd();
        }
    }
});
