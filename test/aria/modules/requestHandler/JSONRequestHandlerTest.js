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
 * Test for the JSONRequestHandler
 */
Aria.classDefinition({
    $classpath : 'test.aria.modules.requestHandler.JSONRequestHandlerTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ["aria.modules.requestHandler.JSONRequestHandler"],
    $prototype : {

        /**
         * Test a valid responseText
         */
        testAsyncJsonResponse : function () {
            var handler = new aria.modules.requestHandler.JSONRequestHandler();
            handler.processSuccess({
                responseText : "{mockTxtData:true}"
            }, {}, {
                fn : this._onJsonResponseProcessSuccess,
                scope : this,
                args : handler
            });
        },

        _onJsonResponseProcessSuccess : function (res, handler) {

            // check mime type error
            this.assertTrue(!res.error, "There should be no error");
            this.assertTrue(res.response.mockTxtData, "Missing mock data");

            handler.$dispose();

            this.notifyTestEnd("testAsyncJsonResponse");
        },

        /**
         * Test a responseText with error
         */
        testAsyncJsonResponseError : function () {
            var handler = new aria.modules.requestHandler.JSONRequestHandler();
            handler.processSuccess({
                responseText : "{mockTxtData:true"
            }, {}, {
                fn : this._onJsonResponseProcessSuccessError,
                scope : this,
                args : handler
            });
        },

        _onJsonResponseProcessSuccessError : function (res, handler) {

            // check mime type error
            this.assertTrue(res.error, "Missing error");
            this.assertTrue(res.errorData.messageBean.localizedMessage == aria.modules.requestHandler.JSONRequestHandler.PARSING_ERROR, "Wrong error message");
            this.assertTrue(res.errorData.messageBean.type == "PARSINGERROR", "Wrong error type");
            this.assertErrorInLogs(aria.modules.requestHandler.JSONRequestHandler.PARSING_ERROR, "Missing parsing error in logs");

            handler.$dispose();

            this.notifyTestEnd("testAsyncJsonResponseError");
        },

        /**
         * Test with parsed JSON
         */
        testAsyncJsonResponseJSON : function () {
            var handler = new aria.modules.requestHandler.JSONRequestHandler();
            handler.processSuccess({
                responseText : "{mockTxtData:true}",
                responseJSON : {
                    mockJsonData : true
                }
            }, {}, {
                fn : this._onJsonResponseProcessSuccessJSON,
                scope : this,
                args : handler
            });
        },

        _onJsonResponseProcessSuccessJSON : function (res, handler) {

            // check mime type error
            this.assertTrue(!res.error, "There should be no error");
            this.assertTrue(!!res.response.mockJsonData, "Missing mock data");
            this.assertTrue(!res.response.mockTxtData, "Text should not have been used");

            handler.$dispose();

            this.notifyTestEnd("testAsyncJsonResponseJSON");
        },

        /**
         * Test that each instance gets independant headers
         */
        testEachInstanceGetsIndependantHeaders : function () {
            var i1 = new aria.modules.requestHandler.JSONRequestHandler();
            i1.getRequestHeaders()['foo'] = 'bar1';

            var i2 = new aria.modules.requestHandler.JSONRequestHandler();
            i2.getRequestHeaders()['foo'] = 'bar2';

            this.assertEquals(i1.getRequestHeaders()['foo'], 'bar1');
            this.assertEquals(i2.getRequestHeaders()['foo'], 'bar2');

            i1.$dispose();
            i2.$dispose();		
        }
    }
});
