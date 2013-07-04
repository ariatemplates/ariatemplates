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
        this.addTests("test.aria.jsunit.ModuleCtrlTestCaseTest");
        this.addTests("test.aria.jsunit.AssertTest");
        this.addTests("test.aria.jsunit.TestCaseTest");
        this.addTests("test.aria.jsunit.ModuleControllerTestCase");
        this.addTests("test.aria.jsunit.templateTests.TemplateInIframe");
        this.addTests("test.aria.jsunit.templateTests.TemplateInIframeWithError");
        this.addTests("test.aria.jsunit.templateTests.TestCaseModuleController");
    }
});
