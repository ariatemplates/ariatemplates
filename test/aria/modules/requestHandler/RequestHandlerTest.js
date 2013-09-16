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
 * Test for the RequestHandler
 */
Aria.classDefinition({
    $classpath : 'test.aria.modules.requestHandler.RequestHandlerTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ["aria.modules.requestHandler.RequestHandler", "aria.modules.RequestBeans"],
    $prototype : {

        /**
         * Test the default response success
         */
        testAsyncProcessSuccess : function () {
            var handler = new aria.modules.requestHandler.RequestHandler();
            handler.processSuccess({}, {
                url : '',
                session : {},
                requestObject : {}
            }, {
                fn : this._onProcessSuccess,
                scope : this,
                args : {
                    handler : handler
                }
            });

        },

        _onProcessSuccess : function (res, args) {
            // finishing the test is enough : callback was called
            args.handler.$dispose();
            this.notifyTestEnd("testAsyncProcessSuccess");
        },

        /**
         * Test the default response failure
         */
        testAsyncProcessFailure : function () {
            var handler = new aria.modules.requestHandler.RequestHandler();
            handler.processFailure({
                status : "404",
                error : "framework error"
            }, {
                url : '',
                session : {},
                requestObject : {}
            }, {
                fn : this._onProcessFailure,
                scope : this,
                args : {
                    handler : handler
                }
            });

        },

        _onProcessFailure : function (res, args) {

            // check that error is properly forwarded, with appropriate type
            this.assertTrue(res.error, "Missing error");
            this.assertTrue(res.errorData.messageBean.code == "404", "Missing error code");
            this.assertTrue(res.errorData.messageBean.type == "HTTPERROR", "Wrong type for error");
            this.assertTrue(res.errorData.messageBean.localizedMessage == aria.modules.requestHandler.RequestHandler.HTTP_ERRORS_404, "Wrong localised message");

            args.handler.$dispose();
            this.notifyTestEnd("testAsyncProcessFailure");
        },

        /**
         * Test for the serialization of the jsonData within the request handler.
         */
        testprepareRequestBody : function () {
            var handler = new aria.modules.requestHandler.RequestHandler();
            var jsonData = {
                "count" : 18,
                "value" : "Cycling News"
            };
            var body = handler.prepareRequestBody(jsonData, {});
            this.assertTrue(body === "{\"count\":18,\"value\":\"Cycling%20News\"}");
            handler.$dispose();
        },

        /**
         * Test to configure post data header.
         */
        testConfigurePostHeader : function () {
            var handler = new aria.modules.requestHandler.RequestHandler();
            var request = {
                moduleName : "test",
                actionName : "testConfigurePostHeader",
                postHeader : "text/plain",
                requestHandler : handler
            };
            var valid = aria.core.JsonValidator.normalize({
                json : request,
                beanName : "aria.modules.RequestBeans.RequestObject"
            }, true);
            this.assertTrue(valid);
            this.assertTrue(request.postHeader === "text/plain");
            handler.$dispose();
        },

        /**
         * Test that each instance gets independant headers
         */
        testEachInstanceGetsIndependantHeaders : function () {
            var i1 = new aria.modules.requestHandler.RequestHandler();
            i1.getRequestHeaders()['foo'] = 'bar1';

            var i2 = new aria.modules.requestHandler.RequestHandler();
            i2.getRequestHeaders()['foo'] = 'bar2';

            this.assertEquals(i1.getRequestHeaders()['foo'], 'bar1');
            this.assertEquals(i2.getRequestHeaders()['foo'], 'bar2');

            i1.$dispose();
            i2.$dispose();
        }
    }
});
