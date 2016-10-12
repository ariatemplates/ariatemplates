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
    $classpath : "test.aria.widgets.form.multiselect.emptyMultiSelect.MultiSelectRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {
        /**
         * This method is always the first entry point to a template test.
         */
        runTemplateTest : function () {
            var myMultiSelect = this.myMultiSelect = this.getWidgetInstance("myMultiSelect");
            myMultiSelect.getDom();
            var dropDownIcon = myMultiSelect._frame._icons.dropdown.domElts[0];
            this.synEvent.click(dropDownIcon, {
                fn : this._step1,
                scope : this
            });
        },

        _step1 : function () {
            this.waitFor({
                condition : function () {
                    return this.myMultiSelect._state == "normalFocused";
                },
                callback : this._step2
            });
        },

        _step2 : function () {
            var myMultiSelect = this.myMultiSelect;
            this.assertEquals(myMultiSelect._state, "normalFocused");
            this.assertEquals(myMultiSelect._frame._stateName, "normalFocused");
            this.assertTrue(/Focused/i.test(myMultiSelect._frame._frame._domElt.className));
            this.assertTrue(aria.utils.Dom.isAncestor(Aria.$window.document.activeElement, myMultiSelect._domElt));
            var myInput = this.myInput = this.getElementById("myInput");
            this.synEvent.click(myInput, {
                fn : this._step3,
                scope : this
            });
        },

        _step3 : function () {
            this.waitFor({
                condition : function () {
                    return this.myMultiSelect._state == "normal";
                },
                callback : this._step4
            });
        },

        _step4 : function () {
            var myMultiSelect = this.myMultiSelect;
            this.assertEquals(myMultiSelect._state, "normal");
            this.assertEquals(myMultiSelect._frame._stateName, "normal");
            this.assertFalse(/Focused/i.test(myMultiSelect._frame._frame._domElt.className));
            this.assertTrue(Aria.$window.document.activeElement == this.myInput);
            this.myInput = null;
            this.myMultiSelect = null;
            this.end();
        }
    }
});
