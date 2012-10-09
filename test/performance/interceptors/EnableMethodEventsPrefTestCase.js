/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath : "test.performance.interceptors.EnableMethodEventsPrefTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.templateTests.tests.performance.disableInterceptorTests.MyParentTemplate",
            moduleCtrl : {
                classpath : "test.templateTests.tests.performance.disableInterceptorTests.EnableModuleEventsModuleCtrl"
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this._testDefault();
        },
        _testDefault : function () {
            this.synEvent.click(this.getInputField("startBtn"), {
                fn : this._onBtnClicked,
                scope : this
            });
        },
        _onBtnClicked : function () {
            var data = this.templateCtxt.moduleCtrl.getData("calls");
            this.assertTrue(data.callBegin == 502);
            this.assertTrue(data.calls == 502);
            this.assertTrue(data.callEnd == 502);
            this.notifyTemplateTestEnd();
        }
    }
});
