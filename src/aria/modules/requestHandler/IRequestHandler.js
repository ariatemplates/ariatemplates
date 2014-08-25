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
var Aria = require("../../Aria");


/**
 * Interface exposed from the Request Manager to the application. It is used by the request manager handler the response
 * of the request
 */
module.exports = Aria.interfaceDefinition({
    $classpath : "aria.modules.requestHandler.IRequestHandler",
    $interface : {
        /**
         * Handles the response from the server, and call the associated callback
         * @param {aria.modules.RequestBeans:SuccessResponse} successResponse
         * @param {aria.modules.RequestBeans:Request} request
         * @param {aria.core.CfgBeans:Callback} callback to call with the response
         */
        processSuccess : function (successResponse, request, callback) {},

        /**
         * Handles the response from the server, and call the associated callback
         * @param {aria.modules.RequestBeans:FailureResponse} failureResponse
         * @param {aria.modules.RequestBeans:Request} request
         * @param {aria.core.CfgBeans:Callback} callback to call when the failure is processed
         */
        processFailure : function (failureResponse, request, callback) {},

        /**
         * Prepares the request body before the request is sent out
         * @param {Object} jsonData The json data that will be sent with this request
         * @param {aria.modules.RequestBeans:RequestObject} requestObject The request object being used for this request
         * @return {String} The string which should be used as the body of the POST request
         */
        prepareRequestBody : function (jsonData, requestObject) {},

        /**
         * Serializes the data by using the serializer specified in the request or the one specified in the application
         * environment
         * @param {Object} jsonData
         * @param {aria.modules.RequestBeans:RequestObject} requestObject
         * @return {String} Stringified representation of the input data
         */
        serializeRequestData : function (jsonData, requestObject) {},

        /**
         * Expected response type. This parameter, if specified, is added on every request handled by this handler
         * @type String
         */
        expectedResponseType : {
            $type : "Object"
        },

        /**
         * Get request headers to be sent along with request.
         * @return {Object} Request Headers
         */
        getRequestHeaders : function () {}
    }
});
