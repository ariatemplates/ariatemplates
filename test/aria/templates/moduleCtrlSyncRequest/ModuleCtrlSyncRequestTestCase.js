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
    $classpath : "test.aria.templates.moduleCtrlSyncRequest.ModuleCtrlSyncRequestTestCase",
    $extends : "aria.jsunit.ModuleCtrlTestCase",
    $dependencies : ["test.aria.modules.IoFilter"],
    $constructor : function () {
        this.$ModuleCtrlTestCase.constructor.call(this);
        this.defaultTestTimeout = 5000;
        this._flagOne = false;
        this._flagTwo = false;
    },
    $prototype : {
        $controller : "test.aria.templates.moduleCtrlSyncRequest.TestModuleCtrl",

        testSyncJsonRequest : function () {
            this._addFilter(true);
            this.$moduleCtrlPrivate.submitJsonRequest("test", {
                from : "here"
            }, {
                fn : this._callback1,
                scope : this
            }, {
                async : false
            });

            this.assertTrue(this._flagOne, "The request was not executed synchronously.");
        },

        _callback1 : function (req) {
            this._flagOne = true;
            this._removeFilter();
        },

        /**
         * Test that aria.core.IO.asyncRequest is called with the right parameter (async: true) at the end of the call
         * stack
         */
        testAsyncBehavior : function () {
            this._addFilter(true);
            this.$moduleCtrlPrivate.submitJsonRequest("test", {
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
            this._removeFilter();
            this.notifyTestEnd("testAsyncBehavior");
        },

        _addFilter : function (switchSyncAsync) {
            this._filterInstance = new test.aria.modules.IoFilter("test/aria/templates/moduleCtrlSyncRequest/test", switchSyncAsync);
            aria.core.IOFiltersMgr.addFilter(this._filterInstance);
        },

        _removeFilter : function () {
            aria.core.IOFiltersMgr.removeFilter(this._filterInstance);
        }

    }
});
