/*
 * Copyright 2014 Amadeus s.a.s.
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

/**
 * Test case to check the behavior of popups and the focus given by a user click
 * see commented asserts
 */
Aria.classDefinition({
    $classpath : "test.aria.popups.focus.FocusTestCase",
    $dependencies : ['aria.utils.Delegate'],
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            data : {
                firstName : "",
                lastName : ""
            }
        });
    },
    $prototype : {

        runTemplateTest : function () {

            this.input1 = this.getInputField("firstInput");
            this.input2 = this.getInputField("secondInput");
            this.span = this.getElementById("notFocusable");
            this.anchor = this.getElementById("anchor");

            this.synEvent.click(this.input1, {
                scope : this,
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : this.checkFirstInputFocused,
                        scope : this,
                        delay : 100
                    });
                }
            });
        },

        checkFirstInputFocused : function () {
            var focusedEl = Aria.$window.document.activeElement;
            // when a focusable element in a popup is clicked, it should take the focus
            this.assertEquals(this.input1, focusedEl, "The first input has not been focused by the click");
            this.synEvent.click(this.input2, {
                scope : this,
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : this.checkSecondInputFocused,
                        scope : this,
                        delay : 100
                    });
                }
            });
        },

        checkSecondInputFocused : function () {
            var focusedEl = Aria.$window.document.activeElement;
            // when a focusable element in a popup is clicked, it should take the focus even if the most recent popup
            // has lost the focus and has been closed
            this.assertEquals(this.input2, focusedEl, "The second input has not been focused by the click");
            this.end();
        }
    }
});
