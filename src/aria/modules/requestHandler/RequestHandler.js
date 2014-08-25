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
var ariaModulesRequestHandlerIRequestHandler = require("./IRequestHandler");
var ariaModulesRequestHandlerEnvironmentRequestHandler = require("./environment/RequestHandler");
var ariaUtilsJson = require("../../utils/Json");
var ariaCoreAppEnvironment = require("../../core/AppEnvironment");


/**
 * Base class for request handler, that handles HTTP errors
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.modules.requestHandler.RequestHandler",
    $implements : [ariaModulesRequestHandlerIRequestHandler],
    $statics : {
        HTTP_ERRORS_GENERAL : "An uncatalogued HTTP error was generated",
        HTTP_ERRORS_400 : "400 Bad Request: The request cannot be fulfilled due to bad syntax.",
        HTTP_ERRORS_401 : "401 Unauthorized: Similar to 403 Forbidden, but specifically for use when authentication is possible but has failed or not yet been provided.",
        HTTP_ERRORS_403 : "403 Forbidden: The request was a legal request, but the server is refusing to respond to it.",
        HTTP_ERRORS_404 : "404 Not Found: The requested resource could not be found but may be available again in the future.  Subsequent requests by the client are permissible.",
        HTTP_ERRORS_500 : "500 Internal Server Error: A generic error message, given when no more specific message is suitable."
    },
    $constructor : function () {
        /**
         * JSON serializer used to stringify the request json data before sending the request
         * @protected
         * @type aria.modules.requestHandler.environment.RequestHandler:RequestJsonSerializerCfg
         */
        this._requestJsonSerializer = ariaModulesRequestHandlerEnvironmentRequestHandler.getRequestJsonSerializerCfg();

        // Listen for environment change event
        ariaCoreAppEnvironment.$on({
            changingEnvironment : {
                fn : this.__environmentUpdated,
                scope : this
            },
            environmentChanged : {
                fn : this.__environmentUpdated,
                scope : this
            }
        });

        /**
         * Request Headers to be used
         * @type Object
         */
        this.headers = {
            "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
        };
    },
    $destructor : function () {
        this._requestJsonSerializer = null;
    },
    $prototype : {
        /**
         * Handles the response from the server, and call the associated callback
         * @param {aria.modules.RequestBeans:SuccessResponse} successResponse
         * @param {aria.modules.RequestBeans:Request} request
         * @param {aria.core.CfgBeans:Callback} callback to call with the response
         */
        processSuccess : function (successResponse, request, callback) {
            this.$callback(callback, successResponse);
        },

        /**
         * Handles the response from the server, and call the associated callback
         * @param {aria.modules.RequestBeans:FailureResponse} failureResponse
         * @param {aria.modules.RequestBeans:Request} request
         * @param {aria.core.CfgBeans:Callback} callback to call when the failure is processed
         */
        processFailure : function (failureResponse, request, callback) {

            var status = failureResponse.status;

            // resource forwarded to the callback
            var res = {
                response : {
                    responseText : failureResponse.responseText,
                    responseJSON : failureResponse.responseJSON,
                    responseXML : failureResponse.responseXML
                },
                error : true
            };

            // HTTP error
            var messageId = "HTTP_ERRORS_" + status;
            var message = this[messageId];
            if (!message) {
                message = this.HTTP_ERRORS_GENERAL;
            }

            res.errorData = {
                "messageBean" : {
                    "code" : status,
                    "localizedMessage" : message,// currently sourced from res, to be migrated to the db as a
                    // part of another sprint task.
                    "type" : "HTTPERROR"
                }
            };

            this.$callback(callback, res);
        },

        /**
         * Prepares the request body before the request is sent out
         * @param {Object} jsonData The json data that will be sent with this request
         * @param {aria.modules.RequestBeans:RequestObject} requestObject The request object being used for this request
         * @return {String} The string which should be used as the body of the POST request
         */
        prepareRequestBody : function (jsonData, requestObject) {
            // we encode POST parameters
            return this.serializeRequestData(jsonData, requestObject);
        },

        /**
         * Serializes the data by using the serializer specified in the request or the one specified in the application
         * environment
         * @param {Object} jsonData
         * @param {aria.modules.RequestBeans:RequestObject} requestObject
         * @return {String} Stringified representation of the input data
         */
        serializeRequestData : function (jsonData, requestObject) {
            var reqSerializer = requestObject ? requestObject.requestJsonSerializer : null;
            var options = reqSerializer ? reqSerializer.options : null;
            var instance = reqSerializer ? reqSerializer.instance : null;

            if (instance) {
                return ariaUtilsJson.convertToJsonString(jsonData, ariaUtilsJson.copy(options, true), instance);
            } else {
                options = options || this._requestJsonSerializer.options;
                instance = this._requestJsonSerializer.instance;

                return ariaUtilsJson.convertToJsonString(jsonData, ariaUtilsJson.copy(options, true), instance);
            }
        },

        /**
         * Returns request headers to be sent along with request
         * @return {Object} Request Headers
         */
        getRequestHeaders : function () {
            return this.headers;
        },

        /**
         * Listener for the event environmentChanged raised by any environment container
         * (aria.core.environment.Environment)
         * @private
         */
        __environmentUpdated : function () {
            this._requestJsonSerializer = ariaModulesRequestHandlerEnvironmentRequestHandler.getRequestJsonSerializerCfg();
        }
    }
});
