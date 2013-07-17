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
    $classpath : 'test.aria.templates.validation.delay.PTRTemplateTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $dependencies: ['aria.core.Timer'],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.validation.delay.PTRTemplate",
            data : {
                refreshNbr : 0
            }
        });
    },
    $prototype : {
        setUp : function () {
            this._originalRefresh = aria.utils.Dom.refreshDomElt;
            aria.utils.Dom.refreshDomElt = function () {};
        },
        tearDown : function () {
            aria.utils.Dom.refreshDomElt = this._originalRefresh;
        },
        /*
         * This test checks if the input text will be changed if there is validation with delay
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("dateField"), {
                fn : this.onFieldFocused,
                scope : this
            });
        },

        onFieldFocused : function () {
            this.synEvent.type(this.getInputField("dateField"), "12", {
                fn : this.onUserDateTyped,
                scope : this
            });
        },

        onUserDateTyped: function() {
            aria.core.Timer.addCallback({
                fn: this.checkText,
                scope: this,
                delay: 1000
            });
        },

        checkText: function(){
            var val = this.getInputField("dateField").value;
            this.assertTrue(val == "12","DateField value is " + val + ". Expected result: 12");
            this.notifyTemplateTestEnd();
        }
    }
});
