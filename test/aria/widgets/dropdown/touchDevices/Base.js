/*
 * Copyright 2014 Amadeus s.a.s.
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
var Aria = require("ariatemplates/Aria");
var ariaUtilsDevice = require("ariatemplates/utils/Device");
var ariaUtilsDom = require("ariatemplates/utils/Dom");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.dropdown.touchDevices.Base",
    $extends : require("ariatemplates/jsunit/RobotTestCase"),
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        // This test is split in several test cases to allow the execution to be parallelized
        // Each part is run based on the naming convention of the class
        var match = /^(.*(Popup|Input))(Desktop|Touch)Test$/.exec(this.$class);
        if (!match) {
            throw new Error("Invalid test name: " + this.$class);
        }
        this.touch = (match[3] == "Touch");
        this.executeCase = this["case" + match[1]];
        if (!this.executeCase) {
            throw new Error("Invalid case: " + match[1]);
        }

        this.setTestEnv({
            template : "test.aria.widgets.dropdown.touchDevices.DropDownWidgetsTpl"
        });
    },
    $prototype : {
        setUp : function () {
            this.savedIsTouch = ariaUtilsDevice.isTouch;
            ariaUtilsDevice.isTouch = this.touch ? Aria.returnTrue : Aria.returnFalse;
        },

        tearDown : function () {
            ariaUtilsDevice.isTouch = this.savedIsTouch;
        },

        runTemplateTest : function () {
            this.executeCase({
                fn : this.end,
                scope : this
            });
        },

        caseDatePickerPopup : function (cb) {
            this.checkSelectLikeWidgetClickInPopup("myDatePicker", "xCalendar_dropdown_day", cb);
        },

        caseDatePickerInput : function (cb) {
            this.checkSelectLikeWidgetClickOnInput("myDatePicker", "xCalendar_dropdown_day", cb);
        },

        caseAutoCompleteNoExpButPopup : function (cb) {
            var self = this;
            var widget = self.getWidgetInstance("myAutoCompleteWithoutExpandButton");

            function step0 () {
                self.typeInWidget(widget, step1);
            }

            function step1 () {
                self.waitForPopupAndClickInPopup(widget, "xListItem_dropdown", step2);
            }

            function step2 () {
                self.waitForNoPopupAndCheckFocus(widget, cb);
            }

            step0();
        },

        caseAutoCompleteNoExpButInput : function (cb) {
            var self = this;
            var widget = self.getWidgetInstance("myAutoCompleteWithoutExpandButton");

            function step0 () {
                self.typeInWidget(widget, step1);
            }

            function step1 () {
                self.waitForPopupClickOnInputAndCheckFocus(widget, "xListItem_dropdown", cb);
            }

            step0();
        },

        typeInWidget : function (widget, cb) {
            this.synEvent.execute([["click", widget.getDom()], ["type", null, "t"]], cb);
        },

        caseAutoCompleteExpButPopup : function (cb) {
            this.checkSelectLikeWidgetClickInPopup("myAutoCompleteWithExpandButton", "xListItem_dropdown", cb);
        },

        caseAutoCompleteExpButInput : function (cb) {
            this.checkSelectLikeWidgetClickOnInput("myAutoCompleteWithExpandButton", "xListItem_dropdown", cb);
        },

        caseSelectBoxPopup : function (cb) {
            this.checkSelectLikeWidgetClickInPopup("mySelectBox", "xListItem_dropdown", cb);
        },

        caseSelectBoxInput : function (cb) {
            this.checkSelectLikeWidgetClickOnInput("mySelectBox", "xListItem_dropdown", cb);
        },

        caseMultiSelectPopup : function (cb) {
            var self = this;
            var widget = self.getWidgetInstance("myMultiSelect");

            function step0 () {
                self.clickOnWidgetIcon(widget, step1);
            }

            function step1 () {
                self.waitForPopupAndClickInPopup(widget, "xICNcheckBoxes", step2);
            }

            function step2 () {
                self.clickOnWidgetIcon(widget, step3);
            }

            function step3 () {
                self.waitForNoPopupAndCheckFocus(widget, cb);
            }

            step0();
        },

        caseMultiSelectInput : function (cb) {
            this.checkSelectLikeWidgetClickOnInput("myMultiSelect", "xICNcheckBoxes", cb);
        },

        checkSelectLikeWidgetClickInPopup : function (id, idInPopup, cb) {
            var self = this;
            var widget = self.getWidgetInstance(id);

            function step0 () {
                self.clickOnWidgetIcon(widget, step1);
            }

            function step1 () {
                self.waitForPopupAndClickInPopup(widget, idInPopup, step2);
            }

            function step2 () {
                self.waitForNoPopupAndCheckFocus(widget, cb);
            }

            step0();
        },

        checkSelectLikeWidgetClickOnInput : function (id, idInPopup, cb) {
            var self = this;
            var widget = self.getWidgetInstance(id);

            function step0 () {
                self.clickOnWidgetIcon(widget, step1);
            }

            function step1 () {
                self.waitForPopupClickOnInputAndCheckFocus(widget, idInPopup, cb);
            }

            step0();
        },

        clickOnWidgetIcon : function (widget, cb) {
            var icon = ariaUtilsDom.getElementsByClassName(widget.getDom(), "xICNdropdown")[0];
            this.synEvent.click(icon, cb);
        },

        waitForPopup : function (widget, idInPopup, cb) {
            this.waitFor({
                condition : function () {
                    var popup = widget._dropdownPopup;
                    return popup && ariaUtilsDom.getElementsByClassName(popup.domElement, idInPopup).length > 0;
                },
                callback : cb
            });
        },

        waitForPopupAndClickInPopup : function (widget, idInPopup, cb) {
            this.waitForPopup(widget, idInPopup, function () {
                var elements = ariaUtilsDom.getElementsByClassName(widget._dropdownPopup.domElement, idInPopup);
                this.synEvent.click(elements[0], cb);
            });
        },

        waitForPopupClickOnInputAndCheckFocus : function (widget, idInPopup, cb) {
            var self = this;

            function step0 () {
                self.waitForPopup(widget, idInPopup, function () {
                    self.synEvent.click(widget.getDom(), step1);
                });
            }

            function step1 () {
                self.waitFor({
                    condition : function () {
                        return !widget._dropdownPopup;
                    },
                    callback : function () {
                        self.checkFocusOnInput(widget);
                        self.$callback(cb);
                    }
                });
            }

            step0();
        },

        waitForNoPopupAndCheckFocus : function (widget, cb) {
            var self = this;

            function step0 () {
                self.waitFor({
                    condition : function () {
                        return !widget._dropdownPopup;
                    },
                    callback : function () {
                        self.checkFocus(widget);
                        self.synEvent.click(widget.getDom(), step1);
                    }
                });
            }

            function step1 () {
                self.checkFocusOnInput(widget);
                self.$callback(cb);
            }

            step0();
        },

        checkFocusOnInput : function (widget) {
            // check that the focused element is now the input
            var activeElement = this.testWindow.document.activeElement;
            this.assertEquals(activeElement.tagName.toLowerCase(), "input", "After clicking on the " + widget.$class
                    + " widget, the focus should be on the input.");
        },

        checkFocus : function (widget) {
            this.touch ? this.checkFocusTouch(widget) : this.checkFocusDesktop(widget);
        },

        checkFocusDesktop : function (widget) {
            // the active element after selecting something in the popup on desktops
            // must be the text field in the widget
            var activeElement = this.testWindow.document.activeElement;
            this.assertTrue(ariaUtilsDom.isAncestor(activeElement, widget.getDom()), "Widget " + widget.$class
                    + " should be focused");
            this.assertEquals(activeElement.tagName.toLowerCase(), "input", "The input in widget " + widget.$class
                    + " should be focused");
        },

        checkFocusTouch : function (widget) {
            // the active element after selecting something in the popup on touch devices
            // must not be the text field in the widget
            var activeElement = this.testWindow.document.activeElement;
            this.assertTrue(ariaUtilsDom.isAncestor(activeElement, widget.getDom()), "Widget " + widget.$class
                    + " should be focused");
            this.assertNotEquals(activeElement.tagName.toLowerCase(), "input", "After selecting a value on touch devices, the focus in widget "
                    + widget.$class + " should not be on the input element (to prevent the keyboard from appearing)");
        }

    }
});
