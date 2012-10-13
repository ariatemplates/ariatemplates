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
 * Test for the XMLRequestHandler
 */
Aria.classDefinition({
    $classpath : 'test.aria.modules.requestHandler.XMLRequestHandlerTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ["aria.modules.requestHandler.XMLRequestHandler"],
    $prototype : {

        /**
         * Test the response with wrong type
         */
        testAsyncNoXML : function () {
            aria.core.IO.asyncRequest({
                url : Aria.rootFolderPath + "test/aria/modules/requestHandler/test/WrongType.html",
                callback : {
                    fn : this._onResponseNoXML,
                    scope : this
                }
            });
        },

        _onResponseNoXML : function (res, args) {
            var handler = new aria.modules.requestHandler.XMLRequestHandler();
            handler.processSuccess(res, {
                url : '',
                session : {},
                requestObject : {}
            }, {
                fn : this._onNoXMLProcessSuccess,
                scope : this,
                args : {
                    handler : handler
                }
            });

        },

        _onNoXMLProcessSuccess : function (res, args) {

            // check mime type error
            this.assertTrue(res.error);
            this.assertTrue(res.errorData.messageBean.localizedMessage == aria.modules.requestHandler.XMLRequestHandler.MIMETYPE_ERROR, "Wrong error message");
            this.assertTrue(res.errorData.messageBean.type == "TYPEERROR", "Wrong error type");

            args.handler.$dispose();

            this.notifyTestEnd("testAsyncNoXML");
        },

        /**
         * Test the response with wrong type
         */
        testAsyncXML : function () {
            aria.core.IO.asyncRequest({
                url : Aria.rootFolderPath + "test/aria/modules/requestHandler/test/XMLResponse.xml",
                callback : {
                    fn : this._onResponse,
                    scope : this
                }
            });
        },

        _onResponse : function (res, args) {
            var handler = new aria.modules.requestHandler.XMLRequestHandler();
            handler.processSuccess(res, {
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
            try {
                // raw XML is provided to the callback
                this.assertTrue(!res.error, "There should be no error");
                this.assertTrue(!!res.response && !!res.response.childNodes, "Data is not XML");
                args.handler.$dispose();

                this.notifyTestEnd("testAsyncXML");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        }
    }
});