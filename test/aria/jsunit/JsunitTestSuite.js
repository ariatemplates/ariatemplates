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
    $classpath : "test.aria.jsunit.JsunitTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.jsunit.load.LoadTestSuite");
        this.addTests("test.aria.jsunit.ModuleCtrlATestCase");
        this.addTests("test.aria.jsunit.AssertTestCase");
        this.addTests("test.aria.jsunit.ATestCase");
        this.addTests("test.aria.jsunit.ModuleControllerTestCase");
        this.addTests("test.aria.jsunit.templateTests.TemplateInIframeTestCase");
        this.addTests("test.aria.jsunit.templateTests.TemplateInIframeWithErrorTestCase");
        this.addTests("test.aria.jsunit.templateTests.ModuleControllerTestCase");
    }
});
