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
    $classpath : "test.aria.widgets.form.select.checkFeatures.SelectTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : {
        testAsyncStartTemplateTest : function () {
            // do nothing in this method
            this.notifyTestEnd("testAsyncStartTemplateTest");
        },

        runTemplateTest : function () {
            // do nothing in this method
        },

        testAsyncSimpleHTMLVersion : function () {
            this.runSelectTests({
                sclass : "simple"
            });
        },

        testAsyncSkinVersion : function () {
            this.runSelectTests({
                sclass : "std"
            });
        },

        runSelectTests : function (cfg) {
            var data = {
                disabled : false,
                readOnly : false,
                mandatory : false,
                value : "C",
                label : "Select an option:",
                sclass : cfg.sclass,
                options : [{
                            value : "A",
                            label : "OptA"
                        }, {
                            value : "B",
                            label : "OptB"
                        }, {
                            value : "C",
                            label : 'Option "C"'
                        }, {
                            value : "D",
                            label : "'D'"
                        }, {
                            value : "E",
                            // test special characters: < and >
                            label : "<option e>"
                        }],
                testCase : this
            };
            this.data = data;
            this.setTestEnv({
                template : "test.aria.widgets.form.select.checkFeatures.SelectTemplateTest",
                data : data
            });
            this.runTemplateTest = this._testStep1;
            this.$TemplateTestCase.testAsyncStartTemplateTest.call(this);
        },

        _getSelectWidget : function () {
            return this.getWidgetInstance("selectWidget");
        },

        _getSelectField : function () {
            return this._getSelectWidget().getSelectField();
        },

        _testStep1 : function () {
            try {
                // check that option C is displayed and present in the data model:
                this._checkDisplayContent('Option "C"');
                this._checkValue("C");
                var elt = this._getSelectField();
                elt.focus();
                this.synEvent.type(elt, "[down][down]", {
                    fn : this._testStep2,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep2 : function () {
            try {
                var selectField = this._getSelectField();
                this._checkDisplayContent('<option e>');
                // check that even if the display content is e, the value in the data model is still C
                // until we press tab
                this._checkValue("C");
                this.synEvent.type(selectField, "[tab]", {
                    fn : this._testStep3,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep3 : function () {
            try {
                // now that tab was pressed, E becomes the current value
                this._checkOnChangeCalled();
                this._checkDisplayContent('<option e>');
                this._checkValue("E");

                // changing the value directly through bindings:
                aria.utils.Json.setValue(this.data, "value", "A");
                this._checkDisplayContent('OptA');
                this._checkValue("A");
                // onchange must not be called for changes coming from the data model
                this._checkOnChangeNotCalled();

                // disable the widget, and try changing selected value on it:
                aria.utils.Json.setValue(this.data, "disabled", true);
                this._checkCannotBeChanged({
                    fn : this._testStep4,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep4 : function () {
            try {
                // re-enable the widget, and set it read-only and try changing selected value on it:
                aria.utils.Json.setValue(this.data, "disabled", false);
                aria.utils.Json.setValue(this.data, "readOnly", true);
                this._checkCannotBeChanged({
                    fn : this._testStep5,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep5 : function () {
            try {
                aria.utils.Json.setValue(this.data, "readOnly", false);
                // test that the mandatory state does not cause any bug:
                aria.utils.Json.setValue(this.data, "mandatory", true);
                aria.utils.Json.setValue(this.data, "mandatory", false);
                // change the label:
                aria.utils.Json.setValue(this.data, "label", "New label");
                var labelDomElt = this._getSelectWidget().getLabel();
                var labelText = labelDomElt.innerText || labelDomElt.textContent;
                this.assertTrue(labelText == "New label");
                if (this.data.sclass != "simple") {
                    Aria.$window.scroll(0, 0);
                    // can only test the dropdown with the skin version
                    this.synEvent.click(this._getSelectField(), {
                        fn : this._testStep6,
                        scope : this
                    });
                } else {
                    this.notifyTemplateTestEnd();
                }
            } catch (e) {
                this.handleAsyncTestError(e);
            }

        },

        _testStep6 : function () {
            try {
                Aria.$window.scroll(0, 0);
                // wait for the popup to be displayed
                aria.core.Timer.addCallback({
                    fn : this._testStep7,
                    scope : this,
                    delay : 1000
                });

            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep7 : function () {
            try {
                Aria.$window.scroll(0, 0);
                // check the popup is displayed, get the link to OptB, and move the mouse to this value
                var optB = this._getPopupLink("OptB");
                var selectWidget = this._getSelectField();
                // FIXME: change made during AT-1.0-36 release (PTR 04677501) because the mouse move would fail without
                // setting the body scrollTop to zero
                if (aria.core.Browser.isSafari) {
                    Aria.$window.document.body.scrollTop = 0;
                }
                this.synEvent.move({
                    from : {
                        clientX : 0,
                        clientY : 0
                    },
                    to : optB
                }, selectWidget, {
                    fn : this._testStep8,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep8 : function () {
            try {
                // check the display text is still the same, and then press enter to have optB selected (as it is the
                // option under the mouse pointer):
                this._checkDisplayContent('OptA');
                this._checkValue("A");
                this.synEvent.type(this._getSelectField(), "[enter]", {
                    fn : this._testStep9,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep9 : function () {
            try {
                this._checkNoPopup();
                this._checkDisplayContent('OptB');
                this._checkValue("B");
                this._checkOnChangeCalled();
                // now let's try selecting an option by clicking:
                this.synEvent.click(this._getSelectField(), {
                    fn : this._testStep10,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep10 : function () {
            try {
                var optC = this._getPopupLink('Option "C"');
                // now let's try selecting an option by clicking:
                this.synEvent.click(optC, {
                    fn : this._testStep11,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep11 : function () {
            try {
                this._checkNoPopup();
                this._checkDisplayContent('Option "C"');
                this._checkValue("C");
                this._checkOnChangeCalled();
                this.synEvent.click(this._getSelectField(), {
                    fn : this._testStep12,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep12 : function () {
            try {
                this._checkDisplayContent('Option "C"');
                this._checkValue("C");
                this.synEvent.type(this._getSelectField(), "OptB[enter]", {
                    fn : this._testStep13,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _testStep13 : function () {
            try {
                this._checkDisplayContent('OptB');
                this._checkValue("B");
                this._checkOnChangeCalled();
                this.notifyTemplateTestEnd();
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _checkValue : function (value) {
            this.assertTrue(this.data.value == value, "Unexpected value. Expected: " + value + " Found: "
                    + this.data.value);
        },

        /**
         * Check that the select widget is in readonly or disabled state (it cannot be changed through user input).
         * Before calling this method, the select widget should contain value A.
         * @param {} cb
         */
        _checkCannotBeChanged : function (cb) {
            var selectField = this._getSelectField();
            var tagName = selectField.tagName.toUpperCase();
            this._checkDisplayContent('OptA');
            this._checkValue("A");
            if (tagName == "SELECT") {
                // synthetic library does not check whether items are disabled before changing them, so we cannot test
                // by sending keys that there is no change. We only check the select item is disabled and call then the
                // callback
                this.assertTrue(selectField.disabled, "Select widget should be disabled.");
                this.$callback(cb);
            } else {
                // send keys to our widget, and check it does not change the value, nor open the popup
                this.synEvent.type(this._getSelectField(), "[down][enter]", {
                    fn : this._checkCannotBeChangedCb1,
                    scope : this,
                    args : cb
                });
            }
        },

        _checkCannotBeChangedCb1 : function (res, cb) {
            try {
                this._checkDisplayContent('OptA');
                this._checkValue("A");
                this._checkNoPopup();
                this._checkOnChangeNotCalled();
                this.synEvent.click(this._getSelectField(), {
                    fn : this._checkCannotBeChangedCb2,
                    scope : this,
                    args : cb
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _checkCannotBeChangedCb2 : function (res, cb) {
            try {
                this._checkDisplayContent('OptA');
                this._checkValue("A");
                this._checkNoPopup();
                this._checkOnChangeNotCalled();
                this.$callback(cb);
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _checkDisplayContent : function (label) {
            var selectField = this._getSelectField();
            var tagName = selectField.tagName.toUpperCase();
            var displayContent;
            if (tagName == "SELECT") {
                var selectedIdx = selectField.selectedIndex;
                var opt = selectField.options[selectedIdx];
                displayContent = opt.innerText || opt.textContent;
            } else if (tagName == "SPAN") {
                var displayContentWithSpace = selectField.innerText || selectField.textContent;
                var space = displayContentWithSpace.charAt(displayContentWithSpace.length - 1);
                // non breaking space (IE converts it into a normal space)
                // the following assert is only to be sure it is fine to remove the last character when comparing with
                // the expected value
                this.assertTrue(space == '\u00A0' || space == " ", "Expected space at the end.");
                displayContent = displayContentWithSpace.substr(0, displayContentWithSpace.length - 1);
            } else {
                this.fail("Unexpected tag type for the select field: " + tagName);
            }
            this.assertTrue(displayContent == label, "Unexpected label in the select widget. Expected: " + label
                    + " Found: " + displayContent);
        },

        _getPopupLink : function (label) {
            var selectWidget = this._getSelectWidget();
            var popup = selectWidget._dropdownPopup;
            this.assertTrue(popup != null, "Popup is missing.");
            var popupDomElement = popup.domElement;
            var links = popupDomElement.getElementsByTagName("a");
            for (var i = 0, l = links.length; i < l; i++) {
                var linkNode = links[i];
                var linkText = linkNode.innerText || linkNode.textContent;
                if (linkText.indexOf(label) != -1) {
                    return linkNode;
                }
            }
            this.fail("Could not find option in the popup: " + label);
        },

        onChangeCallback : function () {
            this.assertTrue(this._onChangeCalled !== true, "onChange called twice");
            this._onChangeCalled = true;
        },

        _checkOnChangeCalled : function () {
            this.assertTrue(this._onChangeCalled === true, "onChange should have been called!");
            this._onChangeCalled = false;
        },

        _checkOnChangeNotCalled : function () {
            this.assertTrue(this._onChangeCalled !== true, "onChange should not have been called!");
        },

        _checkNoPopup : function () {
            var widget = this._getSelectWidget();
            this.assertTrue(widget._dropdownPopup == null, "No popup should be displayed.");
        }

    }
});
