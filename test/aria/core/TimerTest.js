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
    $classpath : "test.aria.core.TimerTest",
    $extends : "aria.jsunit.TestCase",

    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.cbCancelId = null; // internal id used to track some callbacks
    },
    $destructor : function () {
        this.$TestCase.$destructor.call(this);
        this.cbCancelId = null;
    },
    $prototype : {
        /**
         * Asynchronous test used to test timer callbacks
         */
        testAsyncAddCallback : function () {
            var originalCount = aria.core.Timer._cbCount;
            aria.core.Timer.addCallback({
                fn : this._execCb1,
                scope : this,
                delay : 1,
                onerror : this.handleAsyncTestError, // to catch potential errors in the callback
                args : {
                    someArg : "CB1 ARG"
                }
            });

            this.assertTrue(aria.core.Timer._cbCount == originalCount + 1);
        },

        /**
         * Sample callback set at 1ms
         * @param {Object} args the argument object passed to addCallback()
         */
        _execCb1 : function (args) {
            this.assertTrue(args.someArg == "CB1 ARG");
            this.notifyTestEnd("testAsyncAddCallback");
        },

        /**
         * Asynchronous test to validate that callbacks can be cancelled
         */
        testAsyncCancelCallback : function () {
            this.cbCancelId = aria.core.Timer.addCallback({
                fn : this._execCb2,
                scope : this,
                delay : 5,
                onerror : this.handleAsyncTestError
            });
            aria.core.Timer.cancelCallback(this.cbCancelId);

            // second callback to validate that the previous callback has been correctly cancelled
            aria.core.Timer.addCallback({
                fn : this._execCb3,
                scope : this,
                delay : 10, // more than prevous cb
                onerror : this.handleAsyncTestError
            });
        },

        /**
         * testAsyncCancelCallback callback
         */
        _execCb2 : function () {
            // This callback should not be called
            this.fail("Cancel callback called");
            this.notifyTestEnd("testAsyncCancelCallback");
        },

        _execCb3 : function () {
            // validate that _execCb2 is properly deleted
            try {
                // loop on all callbacks to make sure none corresponds to this.cbCancelId
                var callbacks = aria.core.Timer._callbacks;
                for (var k in callbacks) {
                    // null callbacks should not exist as cleanup is done with delete statement
                    this.assertTrue(callbacks[k] != null);
                    this.assertTrue(callbacks[k].cancelId != null);
                    this.assertTrue(callbacks[k].cancelId != this.cbCancelId);
                }
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
            this.notifyTestEnd("testAsyncCancelCallback");
        },

        testAsyncCallbacksRemaining : function () {
            aria.core.Timer.addCallback({
                fn : this._execCbTest,
                scope : this,
                delay : 1
            });
        },

        _execCbTest : function (args) {
            this.assertEquals(aria.core.Timer._numberOfCallbacks, 1);
            aria.core.Timer.callbacksRemaining();
            this.assertEquals(aria.core.Timer._numberOfCallbacks, 0);
            this.notifyTestEnd("testAsyncCallbacksRemaining");
        }
    }
});
