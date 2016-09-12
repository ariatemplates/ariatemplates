/*
 * Copyright 2015 Amadeus s.a.s.
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
var ariaUtilsDom = require("ariatemplates/utils/Dom");
var ariaUtilsString = require("ariatemplates/utils/String");

var isAccessibilityAttribute = function (attributeName) {
    return (attributeName === "role") || (attributeName.substr(0, 5) === "aria-");
};

var findAccessibilityAttributes = function (domElt, recursive, array) {
    var results = array || [];
    var attributes = domElt.attributes;
    if (attributes) {
        for (var i = attributes.length - 1; i >= 0; i--) {
            var attribute = attributes[i];
            if (isAccessibilityAttribute(attribute.name)) {
                results.push({
                    name: attribute.name,
                    value: attribute.value,
                    ownerElement: domElt
                });
            }
        }
    }
    if (recursive && domElt.childNodes) {
        var childNodes = domElt.childNodes;
        for (var i = 0, l = childNodes.length; i < l; i++) {
            findAccessibilityAttributes(childNodes[i], true, results);
        }
    }
    return results;
};


var findAttribute = function  (attributes, name, value) {
    var result = [];
    for (var i = 0, l = attributes.length; i < l; i++) {
        var curAttribute = attributes[i];
        if (curAttribute.name === name && curAttribute.value === value) {
            result.push(curAttribute);
        }
    }
    return result;
};

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.datePicker.DatePickerTest",
    $extends : require("ariatemplates/jsunit/RobotTestCase"),
    $prototype: {
        runTemplateTest : function () {
            var tpl = this.templateCtxt._tpl;
            tpl.$json.setValue(tpl.data, "dpWaiDisabledValue", new Date(2012, 11, 12));
            tpl.$json.setValue(tpl.data, "dpWaiEnabledValue", new Date(2012, 11, 12));

            function checkNoAttribute (attributes) {
                this.assertEquals(attributes.length, 0);
            }

            function step0() {
                this.runScenario("dpWaiDisabled", {
                    beforeOpen: checkNoAttribute,
                    afterOpen: checkNoAttribute,
                    afterDownKey: checkNoAttribute,
                    afterEnterKey: checkNoAttribute
                }, step1);
            }

            function step1() {
                this.runScenario("dpWaiEnabled", {
                    beforeOpen: function (attributes, widgetInstance) {
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-haspopup"), "true");
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-expanded"), "false");
                        this.assertTrue(! this.getExpandButton("dpWaiEnabled").getAttribute("aria-owns"));
                    },
                    afterOpen: function (attributes, widgetInstance) {
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-haspopup"), "true");
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-expanded"), "true");
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-owns"), widgetInstance.controller.getCalendar().getDom().id);
                        this.assertSelectedAttributeHasLabel(attributes, "Wednesday 12 December 2012");
                        this.assertEquals(this.testDocument.activeElement.getAttribute("aria-label").indexOf("Calendar table. Use arrow keys to navigate and space to validate."), 0);
                    },
                    afterDownKey: function (attributes, widgetInstance) {
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-haspopup"), "true");
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-expanded"), "true");
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-owns"), widgetInstance.controller.getCalendar().getDom().id);
                        this.assertSelectedAttributeHasLabel(attributes, "Wednesday 19 December 2012");
                        this.assertEquals(this.testDocument.activeElement.getAttribute("aria-label"), "Calendar table. Use arrow keys to navigate and space to validate.");
                    },
                    afterEnterKey: function (attributes, widgetInstance) {
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-haspopup"), "true");
                        this.assertEquals(this.getExpandButton("dpWaiEnabled").getAttribute("aria-expanded"), "false");
                        this.assertTrue(! this.getExpandButton("dpWaiEnabled").getAttribute("aria-owns"));
                    }
                }, this.end);
            }

            step0.call(this);
        },

        runScenario : function (datePickerId, checkFns, cb) {
            var widgetInstance = this.getWidgetInstance(datePickerId);
            function step0() {
                checkFns.beforeOpen.call(this, this.getWidgetAccessibilityAttributes(datePickerId), widgetInstance);
                this.synEvent.click(this.getExpandButton(datePickerId), {
                    scope: this,
                    fn: function () {
                        this.waitForDropDownPopup(datePickerId, step1);
                    }
                });
            }

            function step1() {
                checkFns.afterOpen.call(this, this.getWidgetAccessibilityAttributes(datePickerId), widgetInstance);
                this.synEvent.type(null, "[down]", {
                    scope: this,
                    fn : function () {
                        this.waitFor({
                            condition: function () {
                                return widgetInstance.controller.getDataModel().calendarValue.getDate() == 19;
                            },
                            callback: step2
                        });
                    }
                });
            }

            function step2() {
                checkFns.afterDownKey.call(this, this.getWidgetAccessibilityAttributes(datePickerId), widgetInstance);
                this.synEvent.type(null, "[enter]", {
                    scope: this,
                    fn : function () {
                        this.waitFor({
                            condition: function () {
                                return !this.getWidgetDropDownPopup(datePickerId);
                            },
                            callback: step3
                        });
                    }
                });
            }

            function step3() {
                checkFns.afterEnterKey.call(this, this.getWidgetAccessibilityAttributes(datePickerId), widgetInstance);
                this.assertEquals(widgetInstance.getTextInputField().value, "19/12/12");
                var dateInModel = widgetInstance._cfg.bind.value.inside[widgetInstance._cfg.bind.value.to];
                this.assertEquals(dateInModel.getDate(), 19);
                this.assertEquals(dateInModel.getMonth(), 11);
                this.assertEquals(dateInModel.getFullYear(), 2012);
                this.$callback(cb);
            }

            step0.call(this);
        },

        assertSelectedAttributeHasLabel: function (attributes, expectedLabel) {
            var selected = findAttribute(attributes, "aria-selected", "true");
            this.assertEquals(selected.length, 1);
            this.assertEquals(selected[0].ownerElement.getAttribute("aria-label"), expectedLabel);
            var focusedElement = this.testDocument.activeElement;
            var activeDescendant = focusedElement.getAttribute("aria-activedescendant");
            if (activeDescendant) {
                focusedElement = ariaUtilsDom.getElementById(activeDescendant) || focusedElement;
            }
            this.assertTrue(ariaUtilsString.endsWith(focusedElement.getAttribute("aria-label"), expectedLabel));
        },

        getWidgetAccessibilityAttributes : function (id) {
            var results = [];
            var widgetInstance = this.getWidgetInstance(id);
            findAccessibilityAttributes(widgetInstance.getDom(), true, results);
            var popup = widgetInstance._dropdownPopup;
            if (popup) {
                findAccessibilityAttributes(popup.domElement, true, results);
            }
            return results;
        }
    }
});
