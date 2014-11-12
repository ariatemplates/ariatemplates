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
    $classpath : "test.aria.widgets.form.fullWidth.errorLog.ErrorLogTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.ClassList", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.fullWidth.errorLog.ErrorLogTemplate"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this._testWidgetsStyle,
                scope : this,
                delay : 50
            });
        },

        _testWidgetsStyle : function () {
            this.assertErrorInLogs(aria.widgets.form.InputWithFrame.FULL_WIDTH_NOT_SUPPORTED, 2);
            this.end();
        }
    }
});
