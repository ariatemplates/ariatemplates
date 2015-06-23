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
var domUtils = require("ariatemplates/utils/Dom");
var fnUtils = require("ariatemplates/utils/Function");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.autoComplete.AutoCompleteBaseTest",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : this.myTemplate
        });
    },
    $prototype : {
        // The following 2 properties should be defined in the child classes:
        myAutoCompleteId: null,
        myAutoCompleteAccessible: false,

        // The following 3 properties can be overridden in child classes:
        myTemplate: "test.aria.widgets.wai.autoComplete.AutoCompleteTpl",
        myAutoCompleteInitialTyping: "p",
        myAutoCompleteFinalText: "Poitiers",

        getChildrenWithAttribute : function (element, attribute) {
            if (element.querySelectorAll) {
                return element.querySelectorAll("[" + attribute + "]");
            }
            // IE7 support!
            var res = [];
            var loop = function (element) {
                var children = element.childNodes;
                for (var i = 0, l = children.length; i < l; i++) {
                    var child = children[i];
                    if (child.getAttribute && child.getAttribute(attribute)) {
                        res.push(child);
                    }
                    loop(child);
                }
            };
            loop(element);
            return res;
        },

        checkAccessibilityEnabled : function (widget) {
            var inputElt = widget.getTextInputField();

            var role = inputElt.getAttribute("role");
            this.assertEquals(role, "combobox", "wrong input role value (%1)");

            var ariaAutocomplete = inputElt.getAttribute("aria-autocomplete");
            this.assertEquals(ariaAutocomplete, "list", "wrong input aria-autocomplete value (%1)");

            var ariaExpanded = inputElt.getAttribute("aria-expanded");
            this.assertTrue(ariaExpanded === "true" || ariaExpanded === "false", "wrong input aria-expanded value");
            var ariaExpandedBool = (ariaExpanded === "true");
            this.assertEquals(ariaExpandedBool, !! widget._dropdownPopup, "aria-expanded (%1) does not match the state of widget._dropdownPopup (%2)");
            var listWidget = widget.controller.getListWidget();
            this.assertEquals(ariaExpandedBool, !! listWidget, "aria-expanded (%1) does not match the state of widget.controller.getListWidget() (%2)");

            var ariaOwns = inputElt.getAttribute("aria-owns");
            var ariaOwnsElt;
            this.assertEquals(!! ariaOwns, ariaExpandedBool, "aria-owns should be present (%1) if and only if aria-expanded is true (%2)");
            var listBoxElt;
            var optionsElt = [];
            if (ariaOwns) {
                ariaOwnsElt = this.testDocument.getElementById(ariaOwns);
                this.assertTrue(ariaOwnsElt != null, "the id specified in aria-owns was not found in the document");

                if (listWidget._subTplCtxt) {
                    // the list widget may take some time to be loaded
                    var childrenWithRole = this.getChildrenWithAttribute(ariaOwnsElt, "role");
                    for (var i = 0, l = childrenWithRole.length; i < l; i++) {
                        var curChild = childrenWithRole[i];
                        var curRole = curChild.getAttribute("role");
                        this.assertTrue(curRole === "listbox" || curRole === "option");
                        if (curRole == "listbox") {
                            this.assertFalsy(listBoxElt, "several items have the listbox role");
                            listBoxElt = curChild;
                        } else if (curRole == "option") {
                            optionsElt.push(curChild);
                        }
                    }
                    this.assertEquals(listWidget._cfg.items.length, optionsElt.length, "the number of items in listWidget._cfg.items (%1) is not the same as the number of DOM element with role=option (%2)");
                    this.assertTruthy(listBoxElt, "no item has the listbox role");
                    for (var i = 0, l = optionsElt.length; i < l; i++) {
                        var curOption = optionsElt[i];
                        this.assertTrue(domUtils.isAncestor(curOption, listBoxElt), "option not inside the listbox element: " + curOption.id);
                    }
                }
            }

            var ariaActiveDescendant = inputElt.getAttribute("aria-activedescendant");
            var ariaActiveDescendantElt;
            if (ariaActiveDescendant) {
                this.assertTrue(ariaExpandedBool, "aria-activedescendant is defined but aria-expanded is false");
                ariaActiveDescendantElt = this.testDocument.getElementById(ariaActiveDescendant);
                this.assertTruthy(ariaActiveDescendantElt, "the id specified in aria-activedescendant was not found in the document");
                this.assertEquals(ariaActiveDescendantElt.getAttribute("role"), "option", "the aria-activedescendant element does not have the option role");
                this.assertTruthy(ariaOwnsElt, "aria-activedescendant is defined but aria-owns is not defined or not found");
                this.assertTrue(domUtils.isAncestor(ariaActiveDescendantElt, ariaOwnsElt), "the aria-activedescendant element is not inside the aria-owns element");
                this.assertTrue(domUtils.isAncestor(ariaActiveDescendantElt, listBoxElt), "the aria-activedescendant element is not inside the listbox element");
                var selectedIdx = listWidget._cfg.selectedIndex;
                this.assertTrue(selectedIdx > -1, "unexpected value of listWidget._cfg.selectedIdx: " + selectedIdx);
                var labelFromDom = (ariaActiveDescendantElt.textContent || ariaActiveDescendantElt.innerText).replace(/^\s*(.*?)\s*$/,"$1");
                var labelFromWidget = listWidget._cfg.items[selectedIdx].label;
                this.assertEquals(labelFromDom, labelFromWidget);
            }
        },

        waiAttributes : ["role", "aria-expanded", "aria-autocomplete", "aria-activedescendant", "aria-owns"],

        checkNoAccessibilityAttribute : function (element) {
            var waiAttributes = this.waiAttributes;
            for (var i = 0, l = waiAttributes.length ; i < l; i++) {
                var curAttribute = waiAttributes[i];
                var items = this.getChildrenWithAttribute(element, curAttribute);
                this.assertEquals(items.length, 0, "Found %1 element(s) with the " + curAttribute + " attribute");
            }
        },

        checkAccessibilityDisabled : function (widget) {
            // there should be no element with the role, aria-owns, aria-expanded, aria-activedescendant or aria-autocomplete attribute
            this.checkNoAccessibilityAttribute(widget.getDom());
            var listWidget = widget.controller.getListWidget();
            if (listWidget) {
                // check there is no role in the list widget
                this.checkNoAccessibilityAttribute(listWidget._tplWidget.getDom());
            }
        },

        initialSetup : function() {
            this.myAutoCompleteWidget = this.getWidgetInstance(this.myAutoCompleteId);
            var checkFn = this.myAutoCompleteAccessible ? this.checkAccessibilityEnabled : this.checkAccessibilityDisabled;
            this.myAutoCompleteCheckFn = fnUtils.bind(checkFn, this, this.myAutoCompleteWidget);
        },

        runTemplateTest : function () {
            this.initialSetup();
            this.myAutoCompleteCheckFn();
            this.executeScenario(this.myAutoCompleteWidget, this.myAutoCompleteCheckFn);
        },

        executeScenario : function (widget, checkFn) {
            var input = widget.getTextInputField();
            var self = this;

            var step1 = function () {
                self.synEvent.click(input, step2);
            };

            var step2 = function () {
                checkFn();
                self.synEvent.type(input, self.myAutoCompleteInitialTyping, step3);
            };

            var step3 = function () {
                self.waitFor({
                    condition: function () {
                        checkFn();
                        var listWidget = widget.controller.getListWidget();
                        return listWidget && listWidget._subTplCtxt;
                    },
                    callback: step4
                });
            };

            var step4 = function () {
                self.synEvent.type(input, "[down][down]", step5);
            };

            var step5 = function () {
                self.waitFor({
                    condition: function () {
                        checkFn();
                        return !! widget.controller.getDataModel().selectedIdx == 1;
                    },
                    callback: step6
                });
            };

            var step6 = function () {
                self.synEvent.type(input, "[enter]", step7);
            };

            var step7 = function () {
                self.waitFor({
                    condition: function () {
                        checkFn();
                        return ! widget._dropdownPopup;
                    },
                    callback: step8
                });
            };

            var step8 = function () {
                self.assertEquals(input.value, self.myAutoCompleteFinalText);
                self.notifyTemplateTestEnd();
            };

            step1();
        }

    }
});
