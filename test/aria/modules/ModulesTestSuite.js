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

        this.addTests("test.aria.modules.RequestFilterTest");
        this.addTests("test.aria.modules.RequestMgrI18nTest");
        this.addTests("test.aria.modules.RequestMgrJsonSerializerTest");
        this.addTests("test.aria.modules.RequestMgrTest");

        this.addTests("test.aria.modules.queuing.SimpleSessionQueuingTest");

        this.addTests("test.aria.modules.urlService.PatternURLCreationImplTest");
        this.addTests("test.aria.modules.urlService.URLCreationServiceTest");
        this.addTests("test.aria.modules.urlService.environment.UrlService");

        this.addTests("test.aria.modules.requestHandler.RequestHandlersTestSuite");

        this.addTests("test.aria.modules.moduleReload.ModuleReloadTestCase1");
        this.addTests("test.aria.modules.moduleReload.ModuleReloadTestCase2");
    }
});
