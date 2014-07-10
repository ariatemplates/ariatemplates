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
 * Test for the RequestMgr class
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.RequestMgrSyncTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.modules.urlService.PatternURLCreationImpl",
            "aria.modules.requestHandler.JSONRequestHandler", "aria.modules.RequestMgr"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.defaultTestTimeout = 5000;
        this._flagOne = false;
        this._flagTwo = false;
    },
    $prototype : {

        mockIO : function () {
            var oldAsyncRequest = this._oldAsyncRequest = aria.core.IO.asyncRequest;
            aria.core.IO.asyncRequest = function (req) {
                req.url = Aria.rootFolderPath + "test/aria/modules/test/SampleResponse.json";
                oldAsyncRequest.call(aria.core.IO, req);
            };
            // aria.modules.RequestMgr.defaultActionQueuing._sessionQueues = [];
        },

        unmockIO : function () {
            aria.core.IO.asyncRequest = this._oldAsyncRequest;
        },

        /**
         * Test that aria.core.IO.asyncRequest is called with the right parameter (async: false) at the end of the call
         * stack
         */
        testSyncBehavior : function () {
            this.mockIO();
            aria.modules.RequestMgr.submitJsonRequest({
                moduleName : "xxx",
                actionName : "yyy",
                // set async flag
                async : false
            }, {
                reqData : 123
            }, {
                fn : this._cbOne,
                scope : this
            });
            this.assertTrue(this._flagOne, "The request was not executed synchronously.");
            this.unmockIO();

        },

        _cbOne : function (res) {
            this._flagOne = true;
        },

        /**
         * Test that aria.core.IO.asyncRequest is called with the right parameter (async: true) at the end of the call
         * stack
         */
        testAsyncBehavior : function () {
            this.mockIO();
            aria.modules.RequestMgr.submitJsonRequest({
                moduleName : "xxx",
                actionName : "yyy"
                // do not set async flag: default=true
            }, {
                reqData : 456
            }, {
                fn : this._cbTwo,
                scope : this
            });
            this.assertFalse(this._flagTwo, "The request was not executed asynchronously.");
            this._flagTwo = true;
        },

        _cbTwo : function () {
            this.assertTrue(this._flagTwo, "The request was not executed asynchronously.");
            this._flagTwo = true;
            this.notifyTestEnd("testAsyncBehavior");
            this.unmockIO();
        }
    }
});
