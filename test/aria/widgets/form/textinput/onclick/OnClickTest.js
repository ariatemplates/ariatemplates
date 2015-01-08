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
    $classpath : "test.aria.widgets.form.textinput.onclick.OnClickTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.textinput.onclick.OnClickTemplate",
            data : {
                action : 0
            }
        });
        this.defaultTestTimeout = 10000;
        if (aria.core.Browser.isIE7 || aria.core.Browser.isIE8) {
            this.defaultTestTimeout = 60000;
        }
        this._delay = 200;
        this._widgetIds = ["df", "tf", "nf", "pf", "dp", "ac", "ms", "time", "sb", "mac"];
        this._currentIndex = null;
    },
    $prototype : {
        runTemplateTest : function () {
            this._currentIndex = 0;
            this._testWidget();
        },

        _testWidget : function () {
            var index = this._currentIndex;
            if (index == this._widgetIds.length) {
                this.end();
            } else {
                this.simulateUserAction(index);
            }
        },

        simulateUserAction : function (index) {
            this.synEvent.click(this.getInputField(this._widgetIds[index]), {
                fn : this.onAfterUserAction,
                scope : this
            });

        },

        onAfterUserAction : function () {
            this.waitFor({
                condition : function () {
                    return this.templateCtxt.data.action == this._currentIndex + 1;
                },
                callback : {
                    fn : this.onAfterDelay,
                    scope : this
                }
            });
        },

        onAfterDelay : function () {
            var index = this._currentIndex;
            this.assertEquals(this.templateCtxt.data.action, index + 1, "onclick listener is not called in widget with id "
                    + this._widgetIds[index]);
            this._currentIndex++;
            this._testWidget();
        }
    }
});
