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
 * Test for the DomReady class
 */
Aria.classDefinition({
    $classpath : "test.aria.dom.DomReadyTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.dom.DomReady", "aria.utils.Callback"],
    $prototype : {
        testDomReady : function () {
            var dmReady = aria.dom.DomReady;
            var callback = new aria.utils.Callback({
                fn : this._internalCallback,
                scope : this
            });

            this._cbCalled = 0;
            dmReady.onReady(callback);
            this.assertTrue(dmReady.isReady === true, "DOM should be in usable state");
            this.assertTrue(this._cbCalled == 1, "The callback should have been called once.");

            this._cbCalled = 0;
            Aria.onDomReady(callback);
            this.assertTrue(dmReady.isReady === true, "DOM should be in usable state");
            this.assertTrue(this._cbCalled == 1, "The callback should have been called once.");

            callback.$dispose();
        },
        _internalCallback : function () {
            this._cbCalled++;
        }
    }
});
