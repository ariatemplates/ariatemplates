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
var ariaModulesRequestHandlerRequestHandler = require("./RequestHandler");
var ariaUtilsJson = require("../../utils/Json");


/**
 * JSON handler, that handles JSON as well as a JavaScript object retrieved in responseJSON
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.modules.requestHandler.JSONRequestHandler",
    $extends : ariaModulesRequestHandlerRequestHandler,
    $implements : [ariaModulesRequestHandlerIRequestHandler],
    $statics : {
        PARSING_ERROR : "Response text could not be evaluated as JSON."
    },
    $constructor : function () {
        this.$RequestHandler.constructor.call(this);

        /**
         * Request Headers to be used
         * @type Object
         */
        this.headers = {
            "Content-Type" : "application/json"
        };
    },
    $prototype : {
        /**
         * Expect JSON as response type
         * @type String
         */
        expectedResponseType : "json",

        /**
         * Handles the response from the server, and call the associated callback
         * @param {aria.modules.RequestBeans:SuccessResponse} successResponse
         * @param {aria.modules.RequestBeans:Request} request
         * @param {aria.core.CfgBeans:Callback} callback to call with the response
         */
        processSuccess : function (successResponse, request, callback) {
            var res = {};
            if (successResponse.responseJSON) {
                res.response = successResponse.responseJSON;
            } else if (successResponse.responseText) {
                res.response = ariaUtilsJson.load(successResponse.responseText, this, this.PARSING_ERROR);
                if (!res.response) {
                    res.error = true;
                }
                if (res.error) {
                    res.errorData = {
                        "messageBean" : {
                            "localizedMessage" : this.PARSING_ERROR,
                            "type" : "PARSINGERROR"
                        }
                    };
                }
            } else {
                // no data : no error
                res.response = null;
            }
            this.$callback(callback, res);
        }
    }
});
