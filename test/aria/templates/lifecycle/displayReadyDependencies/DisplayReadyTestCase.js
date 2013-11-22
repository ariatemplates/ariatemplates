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
    $classpath : "test.aria.templates.lifecycle.displayReadyDependencies.DisplayReadyTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["test.aria.templates.lifecycle.displayReadyDependencies.Bus", "aria.utils.Array"],
    $prototype : {
        runTemplateTest : function () {
            Aria.loadTemplate({
                classpath : "test.aria.templates.lifecycle.displayReadyDependencies.Container",
                div : "everythingStartsHere"
            }, {
                fn : this.checkInitialLoad,
                scope : this
            });
        },

        checkInitialLoad : function () {
            var messages = test.aria.templates.lifecycle.displayReadyDependencies.Bus.messages;

            this.assertEquals(messages.length, 4, "Expecting 4 events, got " + messages.length);

            this.assertTrue(aria.utils.Array.contains(messages, "displayReady Preloaded"), "Display ready of Preloaded not called");
            this.assertTrue(aria.utils.Array.contains(messages, "displayReady Container"), "Display ready of Container not called");
            this.assertTrue(aria.utils.Array.contains(messages, "viewReady Preloaded"), "View ready of Preloaded not called");
            this.assertTrue(aria.utils.Array.contains(messages, "viewReady Container"), "View ready of Container not called");

            var positionDisplayReadyContainer = aria.utils.Array.indexOf(messages, "displayReady Container");
            var positionViewReadyPreloaded = aria.utils.Array.indexOf(messages, "viewReady Preloaded");

            this.assertTrue(positionViewReadyPreloaded < positionDisplayReadyContainer, "View ready of Preloaded should be called before Display ready of Container");

            this.shutDown();
        },

        shutDown : function () {
            Aria.disposeTemplate("everythingStartsHere");

            this.end();
        }
    }
});
