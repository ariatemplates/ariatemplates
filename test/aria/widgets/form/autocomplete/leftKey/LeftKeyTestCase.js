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
    $classpath : "test.aria.widgets.form.autocomplete.leftKey.LeftKeyTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
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
         * Field should have focus, next trigger suggestions.
         */
        onAcFocused : function () {
            this.synEvent.type(this.getInputField("acDest"), "lond", {
                fn : this.onDelay,
                scope : this
            });
        },

        /**
         * Need to add a delay to allow the list to open with the returned suggestions.
         */
        onDelay : function () {
            aria.core.Timer.addCallback({
                fn : this.onAcLeft,
                scope : this,
                delay : 1000
            });
        },

        /**
         * Trigger the left arrow key using syn events to check for a change in the field value.
         */
        onAcLeft : function () {
            this.synEvent.type(this.getInputField("acDest"), "[left]", {
                fn : this.finishTest,
                scope : this
            });
        },

        /**
         * Finalize the test, check the widgets value hasn't been updated when the left key was triggered.
         */
        finishTest : function () {
            var test = this.getInputField("acDest");
            this.assertTrue(test.value === 'lond');
            this.notifyTemplateTestEnd();
        }
    }
});
