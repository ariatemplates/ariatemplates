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
    $classpath : "test.aria.widgets.form.radiobutton.checkBind.test2.RadioButtonTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            value : 0,
            otherValue : 1
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.radiobutton.checkBind.test2.RadioButton",
            data : this.data
        });
    },
    $prototype : {

        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("rb1"), {
                fn : this._afterFirstClick,
                scope : this
            });
        },

        _afterFirstClick : function () {
            this.assertTrue(this.data.value === "v1", "Value should be v1");
            this.synEvent.type(this.getInputField("rb1").previousSibling, "[right]", {
                fn : this._afterFirstKey,
                scope : this
            });
        },

        _afterFirstKey : function () {
            this.assertTrue(this.data.value === "v2", "Value should be v2");
            this.synEvent.type(this.getInputField("rb2").previousSibling, "[right]", {
                fn : this._afterSecondKey,
                scope : this
            });
        },

        _afterSecondKey : function () {
            // v3 should be skipped, as it's bind to a different value
            this.assertTrue(this.data.value === "v4", "Value should be v4");
            this.synEvent.type(this.getInputField("rb4").previousSibling, "[left]", {
                fn : this._afterThirdKey,
                scope : this
            });
        },

        _afterThirdKey : function () {
            // v3 should be skipped, as it's bind to a different value
            this.assertTrue(this.data.value === "v2", "Value should be back to v2");
            aria.core.Timer.addCallback({
                fn : this._finishHim,
                scope : this,
                delay : 100
            });
        },

        _finishHim : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
