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
 * Transport class for Local requests. It's a XHR transport but redefines some methods to work with file:// protocol.
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.core.transport.Local",
    $singleton : true,
    $extends : "aria.core.transport.BaseXHR",
    $prototype : {
        /**
         * Perform a request.
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} request Request object
         * @param {aria.core.CfgBeans.Callback} callback
         * @throws
         */
        request : function (request, callback) {
            if (aria.core.Browser.isOpera) {
                // Opera doesn't work with file protocol but the iFrameHack seems to work
                return this._iFrameHack(request, callback);
            }

            this.$BaseXHR.request.call(this, request, callback);
        },

        /**
         * Use an iFrame to load the content of a request. This raises a security error on most of the browsers except
         * Opera (desktop and mobile). It's ugly but it works.
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} request Request object
         * @param {aria.core.CfgBeans.Callback} callback Internal callback description
         */
        _iFrameHack : function (request, callback) {

            var document = Aria.$frameworkWindow.document;
            var iFrame = document.createElement("iframe");
            iFrame.src = request.url;
            iFrame.id = "xIFrame" + request.id;
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
                    var response = {
                        status : isAbort ? 0 : 200,
                        responseText : text
                    };
                    callback.fn.call(callback.scope, isAbort, callback.args, response);
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