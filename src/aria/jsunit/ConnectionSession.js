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
 * Class representing a connection object for server requests.
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.ConnectionSession",
    $constructor : function (conf) {
        this.requestUrl = ""
        /**
         * Request
         * @type {aria.core.CfgBeans.IOAsyncRequestCfg}
         */
        this.ioRequest = null;
        /**
         * Response
         * @type {aria.core.CfgBeans.IOAsyncRequestResponseCfg}
         */
        this.ioResponse = null;

        if (conf.ioRequest) {
            this.setIORequest(conf.ioRequest);
        }
    },
    $destructor : function () {
        this.ioRequest = null;
        this.ioResponse = null;
    },
    $prototype : {
        /**
         * Set the ioRequest property of this connection session object.
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} request
         */
        setIORequest : function (request) {
            this.ioRequest = request;
            this.requestUrl = request.url;
        },

        /**
         * Notify this connection session object that the response has come back from the server, and set the ioResponse
         * property of this connection session object (the value is taken from the res property of the request).
         */
        setIOResponse : function () {
            this.ioResponse = this.ioRequest.res;
            this.requestUrl = this.ioRequest.url;
        },

        /**
         * Get the request Url.
         * @return {String}
         */
        getRequestUrl : function () {
            return this.requestUrl;
        }
    }
});