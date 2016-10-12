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
 * Test for loading the contextual menu environment dynamically
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.TemplateTestCase",
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        testAsyncLocalEnvironmentNotLoaded : function () {
            var environment = Aria.getClassRef("aria.tools.contextual.environment.ContextualMenu");
            if (environment !== null) {
                Aria.dispose("aria.tools.contextual.environment.ContextualMenu");
                environment = null;
            }
            this.assertTrue(environment === null);
            Aria.load({
                classes : ["aria.tools.contextual.ContextualMenu"],
                oncomplete : {
                    fn : this._testAsyncLocalEnvironmentLoaded,
                    scope : this
                }
            });
        },

        _testAsyncLocalEnvironmentLoaded : function () {
            var contextualMenu = aria.tools.contextual.ContextualMenu;
            var environment = Aria.getClassRef("aria.tools.contextual.environment.ContextualMenu");
            this.assertTrue(aria.utils.Type.isInstanceOf(environment, "aria.core.environment.EnvironmentBase"));
            this.notifyTestEnd("testAsyncLocalEnvironmentNotLoaded");
        }
    }
});
