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
    $classpath : "test.aria.widgets.form.autocomplete.errorhandling.AutoComplete2",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.errorhandling.AutoCompleteTpl"
        });
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field.
         * Initially give the field focus.
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("acDest"), {
                fn : this.onAcFocused,
                scope : this
            });
        },

        /**
         * Field should have focus, next trigger an exact match.
         */
        onAcFocused : function () {
            this.synEvent.type(this.getInputField("acDest"), "m", {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            return !!this.getWidgetDropDownPopup("acDest");
                        },
                        callback : function () {
                            this.clickOutside();
                        }
                    });
                },
                scope : this
            });
        },

        /**
         * Check that clicking outside with a wrong value and dropdown open keep the value in the textfield with an
         * error
         */
        clickOutside : function () {
            this.synEvent.click(Aria.$window.document.body, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            return !this.getWidgetDropDownPopup("acDest");
                        },
                        callback : function () {
                            this.checkTextAndState();
                        }
                    });
                },
                scope : this
            });
        },

        /**
         * Check that clicking outside with a wrong value and dropdown open keep the value in the textfield with an
         * error
         */
        checkTextAndState : function () {
            var acWidget = this.getWidgetInstance("acDest");
            this.assertEquals(acWidget._state, "normalError", "The field should have the %2 state instead of %1");

            var input = this.getInputField("acDest");
            this.assertEquals(input.value, "m", "The input value should be equal to '%2' instead of '%1'");

            this.notifyTemplateTestEnd();
        }
    }
});
