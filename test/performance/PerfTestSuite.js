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
/**
 * Test suite regrouping all tests related to memory / performances issues.<br />
 * These tests are more integration than unit
 */
Aria.classDefinition({
    $classpath : "test.performance.PerfTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.performance.interceptors.EnableMethodEventsPrefTestCase");
        this.addTests("test.performance.interceptors.DisableMethodEventsPrefTestCase");
        this.addTests("test.performance.subTemplateLoop.PerfTestCase");
        this.addTests("test.performance.leakOnRefresh.TemplateRefreshTestCase");
        this.addTests("test.performance.tabbar.ChangeState");
    }
});
