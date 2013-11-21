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
 * Base class for any filter that needs to be plugged on IO.
 * @see aria.core.IOFiltersMgr.addFilter()
 */
Aria.classDefinition({
    $classpath : "aria.core.IOFilter",
    $constructor : function (args) {
        /**
         * Delay (in milliseconds) to be added to all requests, before the request is made.
         * @type Integer
         */
        this.requestDelay = args ? args.requestDelay : null;

        /**
         * Delay (in milliseconds) to be added to all requests, after the response has come back.
         * @type Integer
         */
        this.responseDelay = args ? args.responseDelay : null;
    },
    $statics : {
        // ERROR MESSAGES:
        FILTER_REQ_ERROR : "An error occured in an IO filter:\ncall stack: onRequest\nclass: %1",
        FILTER_RES_ERROR : "An error occured in an IO filter:\ncall stack: onResponse\nclass: %1"
    },
    $prototype : {
        /**
         * Method that should be overridden by sub-classes to access and perhaps change the request arguments before
         * submit.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req request object
         */
        onRequest : function (req) {
            if (this.requestDelay != null) {
                req.delay += this.requestDelay;
            }
        },

        /**
         * Method that should be overridden by sub-classes to access and perhaps change the request and response
         * arguments before the callback is called.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req request object (contains a res property containing the
         * response)
         */
        onResponse : function (req) {
            if (this.responseDelay != null) {
                req.delay += this.responseDelay;
            }
        },

        /**
         * Helper method to set a json object as the POST data in a request.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req
         * @param {Object} jsonData
         */
        setJsonPostData : function (req, jsonData) {
            var sender = req.sender;
            req.data = (sender && sender.classpath=="aria.modules.RequestMgr") ?
                    sender.requestObject.requestHandler.prepareRequestBody(jsonData, sender.requestObject) :
                    aria.utils.Json.convertToJsonString(jsonData);

        },

        /**
         * Helper method to help redirecting a request to a file
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req the filter request object
         * @param {String} filePath the file logical path - e.g. 'test/MyFile.xml'. It can be null or empty and in this
         * case the request is not redirected. It is passed to aria.core.DownloadMgr.resolveURL(filePath,true), to builf
         * the url, taking root maps into account.
         * @param {Boolean} preventTimestamp By default, a timestamp is added to the url to get this file. If this
         * parameter is true, no timestamp will be added.
         */
        redirectToFile : function (req, filePath, preventTimestamp) {
            if (filePath) {
                // change request url and method to target the requested file:
                req.url = aria.core.DownloadMgr.resolveURL(filePath, true);
                if (preventTimestamp !== true) {
                    req.url = aria.core.DownloadMgr.getURLWithTimestamp(req.url, true);
                }
                req.method = "GET";
                req.jsonp = null; // not a json-p request
            }
        },

        /**
         * First entry point of the filter when sending a request. It is marked private because it should neither be
         * overridden nor called from another class than the IOFilterMgr. This internal method simply calls onRequest.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req
         * @private
         */
        __onRequest : function (req) {
            try {
                this.onRequest(req);
            } catch (ex) {
                this.$logError(this.FILTER_REQ_ERROR, [this.$classpath], ex);
            }
        },

        /**
         * First entry point of the filter when receiving a response. It is marked private because it should neither be
         * overridden nor called from another class than the IOFilterMgr. This internal method simply calls onResponse.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req
         * @private
         */
        __onResponse : function (req) {
            try {
                this.onResponse(req);
            } catch (ex) {
                this.$logError(this.FILTER_RES_ERROR, [this.$classpath], ex);
            }
        }
    }
});