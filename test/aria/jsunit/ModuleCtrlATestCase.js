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
 * Test case for aria.jsunit.ModuleCtrlTestCase
 */
Aria.classDefinition({
    $classpath : "test.aria.jsunit.ModuleCtrlTestCaseTest",
    $extends : "aria.jsunit.ModuleCtrlTestCase",
    $dependencies : ["test.aria.jsunit.mock.MockModule", "aria.templates.ModuleCtrlFactory", "aria.modules.requestHandler.XMLRequestHandler"],
    $constructor : function () {
        this.$ModuleCtrlTestCase.constructor.call(this);

        aria.templates.ModuleCtrlFactory.createModuleCtrl({
            classpath : "test.aria.jsunit.mock.MockModule"
        }, {
            fn : function (details) {
                this.mockMc = details.moduleCtrlPrivate;
                this.registerController(this.mockMc);
            },
            scope : this
        }, true);
    },
    $destructor : function () {
        this.mockMc.$dispose();
        this.$ModuleCtrlTestCase.$destructor.call(this);
    },
    $prototype : {

        setUp : function () {
            this.mockMc._data = {
                command : {
                    value : 'testvalue'
                },
                lastCommands : [],
                responses : []
            };

            this.mockMc.$requestHandler = new aria.modules.requestHandler.XMLRequestHandler();
        },

        tearDown : function () {
            if (this.mockMc.$requestHandler) {
                this.mockMc.$requestHandler.$dispose();
                this.mockMc.$requestHandler = null;
            }
        },

        testAssertEvent : function () {
            // creates an event
            this.mockMc.$raiseEvent("myEvent");

            // checks it was properly logged

            // Check the backward compatible implementation
            this.assertEvent("myEvent");

            // Check the valid implementation
            this.assertEventFired("myEvent");

            this.clearLogs();

            // After logs are cleaned the event should no longer appear as being fired
            this.assertEventNotFired("myEvent");
        },

        // test for callAsyncMethod: function(object,methodName,methodArgs,cb)
        // this method is actually in aria.jsunit.TestCase, but it's used mainly by classes extending
        // ModuleControllerTestCase
        testAsyncCallAsyncMethodGood : function () {
            var cb = {
                fn : this.__testCallAsyncMethodGoodCB,
                args : {},
                scope : this
            };

            this.callAsyncMethod(this.mockMc, "processCommand", ["resp1.xml"], cb);

            // this should cause an exception in __callAsyncMethodCB --> but it does not because there's a big try/catch
            // in $callback()
            // this.callAsyncMethod(this.mockMc, "processCommand", ["resp1.xml"], null);
        },

        __testCallAsyncMethodGoodCB : function (res, args) {
            this.assertLogsEmpty();
            var entry = null;
            for (var cx in this.cxLogs) {
                if (this.cxLogs[cx].ioResponse.error) {
                    this.$logError("Error in " + this.cxLogs[cx] + ": " + this.cxLogs[cx].ioResponse.error);
                }
            }

            // done checking, clear logs for next test
            this.clearLogs();
        },

        testAsyncCallAsyncMethodBad : function () {
            var cb = {
                fn : this.__testCallAsyncMethodBadCB,
                args : {},
                scope : this
            };

            // this is a non existant URL
            this.callAsyncMethod(this.mockMc, "processCommand", ["resp-404.xml"], cb);
        },

        __testCallAsyncMethodBadCB : function (res, args) {
            this.assertTrue(this.cxLogs[0].ioResponse.error != null);
            // done checking, clear logs for next test
            this.clearLogs();
        }

    }
});
