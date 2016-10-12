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
    $classpath : "test.aria.widgets.wai.popup.errortooltip.ErrorTooltipBase",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $prototype : {
        runTemplateTest : function () {
            this.checkAttributes(false);
        },
        checkAttributes : function (waiAria) {

            var fieldIds = ["tf","ta","nf","df","time","dp","ac","ms","sb","mac"];
            var index = 0;
            var currentId = null;

            var clickOnField = function() {
                this.synEvent.click(this.getInputField(currentId), {
                    fn : checkDom,
                    scope : this
                });
            };

            var checkDom = function() {

                var widgetInstance = this.getWidgetInstance(currentId);
                this.waitFor({
                    condition : function() {
                        return widgetInstance._onValidatePopup;
                    },
                    callback : function() {
                        var div = widgetInstance._onValidatePopup._div._domElt.parentNode;
                        if (waiAria) {
                            // This has been deactivated as JAWS 16 doesn't read the alert. The role has been removed, as the error message is read with another solution
                            // this.assertEquals(div.getAttribute("role"), "alert", "The role of the error tooltip should be set to %2 instead of %1");
                        } else {
                            this.assertNull(div.getAttribute("role"), "The role of the error tooltip shouldn't be set");
                        }

                        next.call(this);
                    }
                });

            };

            var next = function() {
                var id = fieldIds[index];
                if (id) {
                    currentId = id;
                    index++;
                    clickOnField.call(this);

                } else {
                    this.end();
                }
            };

            next.call(this);

        }

    }
});
