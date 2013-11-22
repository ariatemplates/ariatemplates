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
    $classpath : "test.aria.templates.lifecycle.displayReady.DisplayReadyTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["test.aria.templates.lifecycle.displayReady.Bus", "aria.utils.Array"],
    $prototype : {
        runTemplateTest : function () {
            Aria.loadTemplate({
                classpath : "test.aria.templates.lifecycle.displayReady.Container",
                div : "everythingStartsHere"
            }, {
                fn : this.checkInitialLoad,
                scope : this
            });
        },

        checkInitialLoad : function () {
            try {
                var messages = test.aria.templates.lifecycle.displayReady.Bus.messages;

                // Load template only loads the classes, but display ready might not be triggered yet
                this.assertFalse(aria.utils.Array.contains(messages, "displayReady Container"), "Display ready of Container called too early");
                this.assertTrue(aria.utils.Array.contains(messages, "viewReady Container"), "View ready of Container was not called");

                aria.core.Timer.addCallback({
                    fn : this.checkOrder,
                    scope : this,
                    delay : 1000
                });
            } catch (ex) {
                this.shutDown();
            }
        },

        checkOrder : function () {
            try {
                var messages = test.aria.templates.lifecycle.displayReady.Bus.messages;

                this.assertTrue(aria.utils.Array.contains(messages, "displayReady Pending"), "Display ready of Pending not called");
                this.assertTrue(aria.utils.Array.contains(messages, "displayReady Container"), "Display ready of Container not called");
                this.assertEquals(messages.length, 6, "Expecting 6 events, got " + messages.length);
                // maybe we should wait a bit longer

                var positionDisplayReadyContainer = aria.utils.Array.indexOf(messages, "displayReady Container");
                var positionViewReadyPending = aria.utils.Array.indexOf(messages, "viewReady Pending");

                this.assertTrue(positionViewReadyPending < positionDisplayReadyContainer, "View ready of Pending should be called before Display ready of Container");

                var widget = this.getWidgetInstance("preloaded");
                this.assertFalse(widget.isDiffered, "Once everything is done, widget shouldn't be differed");
            } catch (ex) {}

            this.shutDown();
        },

        shutDown : function () {
            Aria.disposeTemplate("everythingStartsHere");

            this.end();
        }
    }
});
