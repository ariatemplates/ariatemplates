/*
 * Copyright 2012 Amadeus s.a.s.
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

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.input.radiobutton.RadioButtonGroupTestCase",
    $extends : require("ariatemplates/jsunit/RobotTestCase"),
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.wai.input.radiobutton.RadioButtonGroupTestCaseTpl",
            data : this.myData
        });
    },
    $prototype : {
         myData : {
            sclass : "std",
            checkedValue: ""
        },

        isChecked : function(radio) {
            return radio.getDom().getElementsByTagName("input")[0].checked;
        },

        checkTabindex : function() {

            var radios = this.radios;
            var selectedValue = this.myData.checkedValue;
            for(var i = 0, ii = radios.length; i < ii; i++) {
                var radio = radios[i];
                var dom = radio._getFocusableElement();
                var input = dom.tagName.toLowerCase() == "input" ? dom : dom.getElementsByTagName("input")[0];
                this.assertEquals(
                    dom.getAttribute("tabIndex"),
                    input.checked || !selectedValue ? "0" : "-1",
                    "The tabindex of the checkbox " + i + " should be set to %2 instead of %1"
                );
            }

        },

        runTemplateTest : function () {
            this.radios = [
                this.getWidgetInstance("radioA"),
                this.getWidgetInstance("radioB"),
                this.getWidgetInstance("radioC")
            ];

            this.checkTabindex();

            var input = this.getInputField("tf1");
            input.focus();

            this.waitForWidgetFocus("tf1", function () {
                this.synEvent.click(input, {
                    fn : this.tabFirst,
                    scope : this
                });
            });

        },
        tabFirst : function() {
            var radios = this.radios;
            this.synEvent.type(aria.utils.Delegate.getFocus(), "[tab]", {
                scope: this,
                fn: function() {
                    this.assertTrue(this.isChecked(radios[0]), "The first checkbox should be checked");
                    this.checkTabindex();
                    this.goLeft();
                }
            });
        },
        goLeft : function() {
            var radios = this.radios;
            this.synEvent.type(aria.utils.Delegate.getFocus(), "[left]", {
                scope: this,
                fn: function() {
                    this.assertTrue(this.isChecked(radios[2]), "The third checkbox should be checked");
                    this.checkTabindex();
                    this.goRight();
                }
            });
        },
        goRight : function() {
            var radios = this.radios;
            this.synEvent.type(aria.utils.Delegate.getFocus(), "[right]", {
                scope: this,
                fn: function() {
                    this.assertTrue(this.isChecked(radios[0]), "The first checkbox should be checked again");
                    this.checkTabindex();
                    this.goRightAgain();
                }
            });
        },
        goRightAgain : function() {
            var radios = this.radios;
            this.synEvent.type(aria.utils.Delegate.getFocus(), "[right]", {
                scope: this,
                fn: function() {
                    this.assertTrue(this.isChecked(radios[1]), "The second checkbox should be checked");
                    this.checkTabindex();
                    this.tabLast();
                }
            });
        },
        tabLast : function() {
            var radios = this.radios;
            this.synEvent.type(aria.utils.Delegate.getFocus(), "[tab]", {
                scope: this,
                fn: function() {
                    this.assertTrue(this.isChecked(radios[1]), "The second checkbox should remain checked");
                    this.checkTabindex();
                    this.tabBack();
                }
            });
        },
        tabBack : function() {
            var radios = this.radios;
            this.synEvent.type(aria.utils.Delegate.getFocus(), "[<shift>][tab][>shift<]", {
                scope: this,
                fn: function() {
                    this.assertTrue(this.isChecked(radios[1]), "The second checkbox should remain checked when tabbed back");
                    this.assertEquals(radios[1]._getFocusableElement(), aria.utils.Delegate.getFocus(), "The focus should be on the second checkbox");
                    this.checkTabindex();
                    this.end();
                }
            });
        }
  }
});
