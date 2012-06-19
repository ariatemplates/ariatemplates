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
 * Transport class for Local requests. It extends from aria.core.transport.XHR and redefines some methods to work with
 * file: protocol. Being a singleton the extension is not done through $extends
 * @class aria.core.transport.Local
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.core.transport.Local",
    $singleton : true,
    $extends : "aria.core.transport.BaseXHR",
    $constructor : function () {
        this.$BaseXHR.constructor.call(this);
    },
    $prototype : {
        /**
         * Perform a request.
         * @param {String} reqId Request identifier
         * @param {String} method Request method, GET or POST
         * @param {String} uri Resource URI
         * @param {Object} callback Internal callback description
         * @param {String} postData Data to be sent in a POST request
         * @return {Object} connection object
         * @throws
         * @override
         */
        request : function (reqId, method, uri, callback, postData) {
            if (aria.core.Browser.isOpera) {
                // Opera doesn't work with file protocol but the iFrameHack seems to work
                return this._iFrameHack(reqId);
            }

            this.$BaseXHR.request.call(this, reqId, method, uri, callback, postData);
        },

        /**
         * Use an iFrame to load the content of a request. This raises a security error on most of the browsers except
         * Opera (desktop and mobile). It's ugly but it works.
         * @param {String} reqId Request identifier
         */
        _iFrameHack : function (reqId) {
            var params = this._requestParams[reqId];
            this.$assert(56, !!params);
            delete this._requestParams[reqId];

            var document = Aria.$frameworkWindow.document;
            var iFrame = document.createElement("iframe");
            iFrame.src = params.uri;
            iFrame.id = "xIFrame" + params.reqId;
            iFrame.style.cssText = "display:none";

            // Event handlers
            iFrame.onload = iFrame.onreadystatechange = function (event, isAbort) {
                if (isAbort || !iFrame.readyState || /loaded|complete/.test(iFrame.readyState)) {
                    // Memory leak
                    iFrame.onload = iFrame.onreadystatechange = null;

                    var text;
                    if (iFrame.contentDocument) {
                        text = iFrame.contentDocument.getElementsByTagName('body')[0].innerText;
                    } else if (iFrame.contentWindow) {
                        text = iFrame.contentWindow.document.getElementsByTagName('body')[0].innerText;
                    }

                    // Remove the iframe
                    if (iFrame.parentNode) {
                        document.body.removeChild(iFrame);
                    }

                    iFrame = undefined;

                    // Callback if not abort
                    aria.core.IO._handleTransactionResponse({
                        conn : {
                            status : 0,
                            responseText : text,
                            getAllResponseHeaders : function () {}
                        },
                        transaction : params.reqId
                    }, params.callback, isAbort);
                }
            };

            document.body.appendChild(iFrame);
        },

        /**
         * Get a connection object. For the local transport we prefer to get ActiveXObject because it allows to make
         * requests on IE.
         * @return {Object} connection object
         * @protected
         * @override
         */
        _getConnection : function () {
            return this._activeX() || this._standardXHR();
        }
    }
});