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
    $classpath : "test.aria.widgets.form.autocomplete.expandbutton.test4.ExpandButtonCheckRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var field = this.getInputField("ac1");
            this.synEvent.click(field, {
                fn : function () {
                    this.waitForDomEltFocus(field, this._clickAC);
                },
                scope : this
            });
        },

        _clickAC : function (id) {
            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : function () {
                    this.waitForDropDownPopup("ac1", this._afterSelect);
                },
                scope : this
            });
        },

        _afterSelect : function () {
            this.synEvent.type(null, "[down][down][enter]", {
                fn : function () {
                    this.waitFor({
                        condition: function () {
                            return !this.getWidgetDropDownPopup("ac1");
                        },
                        callback: this._checkSelectedEntry
                    });
                },
                scope : this
            });
        },

        _checkSelectedEntry : function () {
            var value = this.getInputField("ac1").value;
            this.assertTrue(value == "Finnair", "The value of the autocomplete is " + value
                    + ", but it should be Finnair");

            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : function (evt, args) {
                    this.waitForDropDownPopup("ac1", this._afterSelect2);
                },
                scope : this
            });
        },

        _afterSelect2 : function () {
            var dropdownPopup = this.getWidgetDropDownPopup("ac1");
            var selectedElt = this.getElementsByClassName(dropdownPopup, "xListSelectedItem_dropdown")[0];

            this.assertTrue(selectedElt.innerHTML.match(/<strong>Finnair<\/strong>/gi).length == 1, "The value of the selected element is "
                    + selectedElt.innerHTML + ", but it should be \n<strong>Finnair</strong>\n");

            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : function () {
                    this.waitFor({
                        condition: function () {
                            return !this.getWidgetDropDownPopup("ac1");
                        },
                        callback: this._clickAC2
                    });
                },
                scope : this
            });
        },

        _clickAC2 : function (id) {
            var field = this.getInputField("ac1");
            this.synEvent.click(field, {
                fn : function () {
                    this.waitForDomEltFocus(field, this._closeAC);
                },
                scope : this
            });
        },

        _closeAC : function () {
            this.synEvent.type(null, "[backspace][backspace][backspace][backspace][backspace][backspace][backspace]", {
                fn : function () {
                    this.waitFor({
                        condition: function () {
                            return this.getInputField("ac1").value === "";
                        },
                        callback: this._checkText
                    });
                },
                scope : this
            });
        },

        _checkText : function () {
            var value = this.getInputField("ac1").value;
            this.assertTrue(value === "", "The value of the autocomplete is " + value + ", but it should be empty");
            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : function () {
                    this.waitForDropDownPopup("ac1", this._openAC3);
                },
                scope : this
            });
        },

        _openAC3 : function () {
            var dropdownPopup = this.getWidgetInstance("ac1")._dropdownPopup;
            var selectedElt = this.getElementsByClassName(dropdownPopup.domElement, "xLISTSelectedItem_dropdown");

            this.assertTrue(selectedElt.length === 0, "There shouldn't be any highlighted element.");
            this.notifyTemplateTestEnd();
        }
    }
});
