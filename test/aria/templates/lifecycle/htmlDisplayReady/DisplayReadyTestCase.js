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
    $classpath : "test.aria.templates.lifecycle.htmlDisplayReady.DisplayReadyTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "test.aria.templates.lifecycle.htmlDisplayReady.Bus",
            "aria.utils.Array"],
    $statics : {
        nextStep : null,

        displayReadFromTemplate : function () {
            // Doing it in a callback to let class loaders complete their job
            aria.core.Timer.addCallback(this.nextStep);
        }
    },
    $prototype : {
        runTemplateTest : function () {
            Aria.loadTemplate({
                classpath : "test.aria.templates.lifecycle.htmlDisplayReady.Container",
                div : "everythingStartsHere"
            });

            test.aria.templates.lifecycle.htmlDisplayReady.DisplayReadyTestCase.nextStep = {
                fn : this.checkDisplayReady,
                scope : this,
                delay : 100
            };
        },

        checkDisplayReady : function () {
            try {
                var dom = aria.utils.Dom.getElementById("divInsideHtmlTemplate");
                this.assertTrue(!!dom, "Dom elements from html templates should be in the DOM");

                var messages = test.aria.templates.lifecycle.htmlDisplayReady.Bus.messages;
                this.assertTrue(aria.utils.Array.contains(messages, "view"), "ViewReady was not called");
                this.assertTrue(aria.utils.Array.contains(messages, "display"), "DisplayReady was not called");
            } catch (ex) {}

            this.shutDown();
        },

        shutDown : function () {
            Aria.disposeTemplate("everythingStartsHere");

            this.end();
        }
    }
});
