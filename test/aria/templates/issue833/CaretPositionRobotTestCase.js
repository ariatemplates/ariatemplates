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

/**
 * Check that the cursor is positioned correctly when the field has focus.
 * @class test.aria.widgets.form.textinput.onfocus.Issue833
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.issue833.CaretPositionRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.issue833.OnFocusTemplate",
            data : {
                action : 0
            }
        });
        this._delay = 10;
    },
    $prototype : {
        runTemplateTest : function () {
            var input = this.getInputField("nf1");
            this.synEvent.click(input, {
                fn : this.onFieldFocused,
                scope : this
            });
        },
        onFieldFocused : function () {
            var input = this.getInputField("nf1");
            this.synEvent.type(input, "abcd", {
                fn : this.onUserTyped,
                scope : this
            });

        },
        onUserTyped : function () {
            var input = this.getInputField("nf2");
            this.synEvent.click(input, {
                fn : this.onFieldBlurred,
                scope : this
            });
        },
        onFieldBlurred : function () {
            var input = this.getInputField("nf1");
            this.synEvent.click(input, {
                fn : this.addDelay,
                scope : this
            });
        },
        addDelay : function () {
            aria.core.Timer.addCallback({
                fn : this.onUserClick,
                scope : this,
                delay : 1000
            });
        },
        onUserClick : function () {
            var input = this.getInputField("nf1");
            var caretPosition = aria.utils.Caret.getPosition(input);
            this.assertTrue(caretPosition.start === 4, "The caret start position has not been set correctly, should be 4.");
            this.assertTrue(caretPosition.end === 4, "The caret end position has not been set correctly, should be 4.");
            this.notifyTemplateTestEnd();
        }
    }
});
