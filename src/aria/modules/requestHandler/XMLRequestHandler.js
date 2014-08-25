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


/**
 * Base class for XML request handler, that handles wrong MIME types
 * @class aria.modules.test.XMLRequestHandler
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.modules.requestHandler.XMLRequestHandler",
    $extends : ariaModulesRequestHandlerRequestHandler,
    $implements : [ariaModulesRequestHandlerIRequestHandler],
    $statics : {
        MIMETYPE_ERROR : "Response type is badly configured, it should have returned a xml response."
    },
    $prototype : {
        /**
         * Handles the response from the server, and call the associated callback
         * @param {aria.modules.RequestBeans:SuccessResponse} successResponse
         * @param {aria.modules.RequestBeans:Request} request
         * @param {aria.core.CfgBeans:Callback} callback to call with the response
         */
        processSuccess : function (successResponse, request, callback) {
            var res;
            if (!successResponse.responseXML
                    || (successResponse.responseXML && !successResponse.responseXML.documentElement)) {
                res = {
                    response : null,
                    error : true,
                    errorData : {
                        "messageBean" : {
                            "localizedMessage" : this.MIMETYPE_ERROR,
                            "type" : "TYPEERROR"
                        }
                    }
                };
            } else {
                res = this.processXMLDocument(successResponse.responseXML.documentElement, request);
            }
            this.$callback(callback, res);
        },

        /**
         * Process the XML document for this response
         * @param {Object} xmlDocument document element from response
         * @param {aria.modules.RequestBeans:Request} request
         * @return {Object} processed data
         */
        processXMLDocument : function (xmlDocument, request) {
            return {
                response : xmlDocument
            };
        }
    }
});
