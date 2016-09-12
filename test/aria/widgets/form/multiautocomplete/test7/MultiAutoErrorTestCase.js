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
    $classpath : "test.aria.widgets.form.multiautocomplete.test7.MultiAutoErrorTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            ac_airline_values : []
        };

        // setTestEnv has to be invoked before runTemplateTest fires
        this.setTestEnv({
            template : "test.aria.widgets.form.multiautocomplete.test7.MultiAutoErrorTestCaseTpl",
            data : this.data
        });

    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {

            this.synEvent.click(this.getInputField("MultiAutoId"), {
                fn : this.typeSomething,
                scope : this
            });
        },

        typeSomething : function (evt, callback) {
            // give it the time to open a drop down
            this.synEvent.type(this.getInputField("MultiAutoId"), "az", {
                fn : this._waitForType,
                scope : this,
                args : this._assertErrorState
            });
        },
        _waitForType : function () {
            var acWidget = this.getWidgetInstance("MultiAutoId");
            this.waitFor({
                condition : function () {
                    return (acWidget._state == "normalErrorFocused");
                },
                callback : {
                    fn : this._assertErrorState,
                    scope : this
                }
            });
        },
        _assertErrorState : function () {
            // test that the field is in error state
            var acWidget = this.getWidgetInstance("MultiAutoId");
            this.assertTrue(!!acWidget._onValidatePopup);
            this.notifyTemplateTestEnd();
        }
    }
});
