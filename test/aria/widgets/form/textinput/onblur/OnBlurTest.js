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
    $classpath : "test.aria.widgets.form.textinput.onblur.OnBlurTest",
    $extends : "test.aria.widgets.form.textinput.onclick.OnClickTest",
    $constructor : function () {
        this.$OnClickTest.constructor.call(this);
        this.defaultTestTimeout = 40000;
        if (aria.core.Browser.isIE7 || aria.core.Browser.isIE8) {
            this.defaultTestTimeout = 120000;
        }
        this.setTestEnv({
            template : "test.aria.widgets.form.textinput.onblur.OnBlurTemplate",
            data : {
                action : 0
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.templateCtxt.$focus(this._widgetIds[0]);
            this._currentIndex = 0;
            this._testWidget();
        },

        simulateUserAction : function (index) {
            var ix = (index + 1) % this._widgetIds.length;
            this.templateCtxt.$focus(this._widgetIds[ix]);
            this.onAfterUserAction();
        }
    }
});
