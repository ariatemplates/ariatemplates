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
    $classpath : "test.aria.modules.requestMgrSyncTest.SyncTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.modules.RequestMgr", "test.aria.modules.IoFilter"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.defaultTestTimeout = 5000;
        this._flagOne = false;
        this._flagTwo = false;
    },
    $prototype : {

        /**
         * Test that aria.core.IO.asyncRequest is called with the right parameter (async: false) at the end of the call
         * stack
         */
        testSyncBehavior : function () {
            this._addFilter(true);
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

        },

        _cbOne : function (res) {
            this._flagOne = true;
            this._removeFilter();
        },

        /**
         * Test that aria.core.IO.asyncRequest is called with the right parameter (async: true) at the end of the call
         * stack
         */
        testAsyncBehavior : function () {
            this._addFilter(true);
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
            this._removeFilter();
            this.notifyTestEnd("testAsyncBehavior");
        },

        _addFilter : function (switchSyncAsync) {
            this._filterInstance = new test.aria.modules.IoFilter("xxx/yyy", switchSyncAsync);
            aria.core.IOFiltersMgr.addFilter(this._filterInstance);
        },

        _removeFilter : function () {
            aria.core.IOFiltersMgr.removeFilter(this._filterInstance);
        }

    }
});
