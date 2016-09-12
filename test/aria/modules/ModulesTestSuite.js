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
 * Test suite regrouping all tests of the aria.modules namespace
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.ModulesTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.modules.RequestFilterTestCase");
        this.addTests("test.aria.modules.RequestMgrI18nTestCase");
        this.addTests("test.aria.modules.RequestMgrJsonSerializerTestCase");
        this.addTests("test.aria.modules.RequestMgrTestCase");
        this.addTests("test.aria.modules.requestMgrSyncTest.SyncTestCase");
        this.addTests("test.aria.modules.RequestMgrSyncErrorTestCase");

        this.addTests("test.aria.modules.queuing.SimpleSessionQueuingTestCase");

        this.addTests("test.aria.modules.urlService.PatternURLCreationImplTestCase");
        this.addTests("test.aria.modules.urlService.URLCreationServiceTestCase");
        this.addTests("test.aria.modules.urlService.environment.UrlServiceTestCase");

        this.addTests("test.aria.modules.requestHandler.RequestHandlersTestSuite");

        this.addTests("test.aria.modules.moduleReload.ModuleReload1TestCase");
        this.addTests("test.aria.modules.moduleReload.ModuleReload2TestCase");

        this.addTests("test.aria.modules.ModuleSubmitJsonRequestTestCase");
    }
});
