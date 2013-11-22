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
    $classpath : "test.aria.modules.test.MockRequestHandler",
    $implements : ["aria.modules.requestHandler.IRequestHandler"],
    $dependencies : ['aria.core.JsonValidator'],
    $extends : "aria.modules.requestHandler.RequestHandler",
    $constructor : function (test) {
        this.$RequestHandler.constructor.call(this);
        this.test = test;
    },
    $prototype : {
        /**
         * Handles the response from the server, and call the associated callback
         * @param {aria.modules.RequestBeans.SuccessResponse} successResponse
         * @param {aria.modules.RequestBeans.Request} request
         * @param {aria.core.JsObject.Callback} callback to call with the response
         */
        processSuccess : function (successResponse, request, callback) {
            try {
                aria.core.JsonValidator.normalize({
                    json : successResponse,
                    beanName : "aria.modules.RequestBeans.SuccessResponse"
                }, true);

                aria.core.JsonValidator.normalize({
                    json : request,
                    beanName : "aria.modules.RequestBeans.Request"
                }, true);

                this.$callback(callback, {
                    response : {
                        mockData : true
                    }
                });
            } catch (e) {
                this.test.handleAsyncTestError(e);
            }
        },

        /**
         * Handles the response from the server, and call the associated callback
         * @param {aria.modules.RequestBeans.FailureResponse} failureResponse
         * @param {aria.modules.RequestBeans.Request} request
         * @param {aria.core.JsObject.Callback} callback to call when the failure is processed
         */
        processFailure : function (failureResponse, request, callback) {
            try {
                aria.core.JsonValidator.normalize({
                    json : failureResponse,
                    beanName : "aria.modules.RequestBeans.FailureResponse"
                }, true);

                aria.core.JsonValidator.normalize({
                    json : request,
                    beanName : "aria.modules.RequestBeans.Request"
                }, true);

                this.$callback(callback, {
                    response : null,
                    error : true,
                    errorData : {
                        mockErrorData : true
                    }
                });
            } catch (e) {
                this.test.handleAsyncTestError(e);
            }
        }
    }
});
