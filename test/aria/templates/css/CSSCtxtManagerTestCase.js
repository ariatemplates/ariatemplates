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
    $classpath : "test.aria.templates.css.CSSCtxtManagerTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.CSSCtxtManager"],
    $prototype : {

        setUp : function () {
            aria.core.environment.Environment.setDebug(true);

            this._previousContexts = aria.templates.CSSCtxtManager._contexts;
            aria.templates.CSSCtxtManager._contexts = {};
        },

        tearDown : function () {
            aria.templates.CSSCtxtManager._contexts = this._previousContexts;
            this._previousContexts = null;
        },

        /**
         * Testing the Context retrieving
         */
        testContexts : function () {
            var cm = aria.templates.CSSCtxtManager;
            var contexts = cm._contexts;
            var expected = {};
            var got = {};

            var totalCalls = 0;

            // Override the context generation to return a simple object
            var mockCSSCtxt = function () {
                totalCalls += 1;
            };
            mockCSSCtxt.prototype.$dispose = function () {};
            mockCSSCtxt.prototype.initTemplate = function (cp) {
                this.classpath = cp.classpath;
            };
            this.overrideClass("aria.templates.CSSCtxt", mockCSSCtxt);

            // Generate a new context
            got = cm.getContext("a");
            expected.a = {
                classpath : "a"
            };
            this.assertTrue(aria.utils.Json.equals(contexts, expected));
            this.assertTrue(aria.utils.Json.equals(got, expected.a));

            // Get again the same context
            got = cm.getContext("a");
            this.assertTrue(aria.utils.Json.equals(contexts, expected));
            this.assertTrue(aria.utils.Json.equals(got, expected.a));

            // Get a new context
            got = cm.getContext("b");
            expected.b = {
                classpath : "b"
            };
            this.assertTrue(aria.utils.Json.equals(contexts, expected));
            this.assertTrue(aria.utils.Json.equals(got, expected.b));

            // Get again the same context
            got = cm.getContext("a");
            this.assertTrue(aria.utils.Json.equals(contexts, expected));
            this.assertTrue(aria.utils.Json.equals(got, expected.a));

            got = cm.getContext("b");
            this.assertTrue(aria.utils.Json.equals(contexts, expected));
            this.assertTrue(aria.utils.Json.equals(got, expected.b));

            // At the end I should've called the contructor only twice
            this.assertEquals(totalCalls, 2);

            cm.disposeContext("a");
            cm.disposeContext("b");
        },

        testReset : function () {
            var cm = aria.templates.CSSCtxtManager;
            // Reset the CSSCtxtManager to check that there are no error
            cm.reset();

            var destructed = {};
            var totalCalls = 0;

            // Override the context generation to return a simple object
            var mockCSSCtxt = function () {
                totalCalls += 1;
            };
            mockCSSCtxt.prototype.$dispose = function () {
                destructed[this.classpath] = destructed[this.classpath] ? destructed[this.classpath] += 1 : 1;
            };
            mockCSSCtxt.prototype.initTemplate = function (cp) {
                this.classpath = cp.classpath;
            };
            this.overrideClass("aria.templates.CSSCtxt", mockCSSCtxt);

            // Generate some new contextes
            cm.getContext("a");
            cm.getContext("b");
            cm.getContext("c");

            // Reset
            cm.reset();

            this.assertEquals(totalCalls, 3, "Context were not created correctly");
            this.assertEquals(destructed["a"], 1, "Context A undisposed correctly");
            this.assertEquals(destructed["b"], 1, "Context A undisposed correctly");
            this.assertEquals(destructed["c"], 1, "Context A undisposed correctly");
        }
    }
});
