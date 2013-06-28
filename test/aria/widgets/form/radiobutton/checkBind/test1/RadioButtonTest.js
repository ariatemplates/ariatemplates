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
    $classpath : "test.aria.widgets.form.radiobutton.checkBind.test1.RadioButtonTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {};
        this.setTestEnv({
            template : "test.aria.widgets.form.radiobutton.checkBind.test1.RadioButton",
            data : this.data
        });
    },
    $prototype : {

        runTemplateTest : function () {
            this.synEvent.click(this.getWidgetInstance("rb1").getDom(), {
                fn : this._afterFirstClick,
                scope : this
            });
        },

        _afterFirstClick : function () {
            this.assertTrue(this.data.value === "v1", "Value should be v1");
            this.synEvent.type(this.getWidgetInstance("rb1").getDom(), "[down]", {
                fn : this._afterFirstKey,
                scope : this
            });
        },

        _afterFirstKey : function () {
            this.assertTrue(this.data.value === "v2", "Value should be v2");
            this.synEvent.type(this.getWidgetInstance("rb2").getDom(), "[up]", {
                fn : this._afterSecondKey,
                scope : this
            });
        },

        _afterSecondKey : function () {
            this.assertTrue(this.data.value === "v1", "Value should be v1");
            aria.core.Timer.addCallback({
                fn : this._finish,
                scope : this,
                delay : 100
            });
        },

        _finish : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
