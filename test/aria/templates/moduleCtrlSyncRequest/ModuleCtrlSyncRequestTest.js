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
 * Module Controller test class
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.moduleCtrlSyncRequest.ModuleCtrlSyncRequestTest",
    $extends : "aria.jsunit.ModuleCtrlTestCase",
    $dependencies : ["aria.modules.urlService.PatternURLCreationImpl", "aria.modules.requestHandler.JSONRequestHandler"],
    $constructor : function () {
        this.$ModuleCtrlTestCase.constructor.call(this);
        this.defaultTestTimeout = 5000;
        this._flagOne = false;
        this._flagTwo = false;
    },
    $prototype : {
        $controller : "test.aria.templates.moduleCtrlSyncRequest.TestModuleCtrl",

        testSyncJsonRequest : function () {
            this._mockIO();

            this.$moduleCtrlPrivate.submitJsonRequest("search", {
                from : "here"
            }, {
                fn : this._callback1,
                scope : this
            }, false);

            this.assertTrue(this._flagOne, "The request was not executed synchronously.");
            this._unmockIO();

        },

        _callback1 : function (req) {
            this._flagOne = true;
        },

        /**
         * Test that aria.core.IO.asyncRequest is called with the right parameter (async: true) at the end of the call
         * stack
         */
        testAsyncBehavior : function () {
            this._mockIO();

            this.$moduleCtrlPrivate.submitJsonRequest("search", {
                from : "here"
            }, {
                fn : this._callback2,
                scope : this
            });

            this.assertFalse(this._flagTwo, "The request was not executed asynchronously.");
            this._flagTwo = true;
        },

        _callback2 : function () {
            this.assertTrue(this._flagTwo, "The request was not executed asynchronously.");
            this._flagTwo = true;
            this.notifyTestEnd("testAsyncBehavior");
            this._unmockIO();
        },

        _mockIO : function (req) {
            var asyncRequest = this._asyncRequest = aria.core.IO.asyncRequest;
            aria.core.IO.asyncRequest = function (req) {
                req.url = Aria.rootFolderPath + "test/aria/modules/test/SampleResponse.json";
                asyncRequest.call(aria.core.IO, req);
            };
        },

        _unmockIO : function (req) {
            aria.core.IO.asyncRequest = this._asyncRequest;
        },

        _syncIORequestMock : function (req) {
            this.assertFalse(req.async, "async flag is not false as expected");
            aria.core.IO.asyncRequest = this._asyncRequest;
        }

    }
});
