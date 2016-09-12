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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.selectbox.emptyOption.EmptyOptionRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json"],
    $prototype : {
        runTemplateTest : function () {
            this._step1();
        },

        _step1 : function () {
            this.assertEquals(this.templateCtxt._tpl.onChangeCalled, 0);
            this.assertEquals(this.templateCtxt._tpl.data.value, "empty");
            this.synEvent.click(this.getExpandButton("happySelectBox"), {
                fn : this._step2,
                scope : this
            });
        },

        _step2 : function () {
            this.waitFor({
                callback: this._step3,
                condition: function () {
                    var popupElt = this.getWidgetDropDownPopup("happySelectBox");
                    return popupElt && popupElt.getElementsByTagName("a").length > 0;
                }
            });
        },

        _step3 : function () {
            // clicking on the expand button should not change the value in the data model
            this.assertEquals(this.templateCtxt._tpl.onChangeCalled, 0);
            this.assertEquals(this.templateCtxt._tpl.data.value, "empty");

            var popupElt = this.getWidgetDropDownPopup("happySelectBox");
            var yesElt = popupElt.getElementsByTagName("a")[2];
            // check that yesElt corresponds to the expected element:
            this.assertTrue(/Yes/.test(yesElt.innerHTML));

            this.synEvent.click(yesElt, {
                fn : this._step4,
                scope : this
            });
        },

        _step4 : function () {
            this.waitFor({
                callback: this._step5,
                condition: function () {
                    return !this.getWidgetDropDownPopup("happySelectBox");
                }
            });
        },

        _step5 : function () {
            this.assertEquals(this.templateCtxt._tpl.onChangeCalled, 1);
            this.assertEquals(this.templateCtxt._tpl.data.value, "yes");

            // as there was a refresh in the onchange callback, our happy selectbox
            // is no longer focused

            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "value", "empty");
            this.synEvent.click(this.getInputField("happySelectBox"), {
                fn : this._step6,
                scope : this
            });
        },

        _step6 : function () {
            this.waitForWidgetFocus("happySelectBox", this._step7);
        },

        _step7 : function () {
            // clicking inside the selectbox should not change its value
            this.assertEquals(this.templateCtxt._tpl.onChangeCalled, 1);
            this.assertEquals(this.templateCtxt._tpl.data.value, "empty");
            this.synEvent.click(this.getElementById("clickOutsideDiv"), {
                fn : this._step8,
                scope : this
            });
        },

        _step8 : function () {
            this.waitForWidgetBlur("happySelectBox", this._step9);
        },

        _step9 : function () {
            // clicking outside the selectbox should not change its value
            this.assertEquals(this.templateCtxt._tpl.onChangeCalled, 1);
            this.assertEquals(this.templateCtxt._tpl.data.value, "empty");
            this.end();
        }

    }
});
