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
var ariaCoreBrowser = require("../Browser");
var ariaCoreDownloadMgr = require("../DownloadMgr");
var ariaCoreIO = require("../IO");


/**
 * Transport class for IFrame.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.transport.IFrame",
    $singleton : true,
    $statics : {
        ERROR_DURING_SUBMIT : "An error occurred while submitting the form (form.submit() raised an exception)."
    },
    $prototype : {
        /**
         * Tells if the transport object is ready or requires an initialization phase
         * @type Boolean
         */
        isReady : true,

        /**
         * Map request ids to their original requests
         * @type Object
         */
        _requests : {},

        /**
         * Initialization function. Not needed because this transport is ready at creation time
         */
        init : Aria.empty,

        /**
         * Perform a request.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request Request object
         * @param {aria.core.CfgBeans:Callback} callback Internal callback description
         */
        request : function (request, callback) {
            this._requests[request.id] = {
                request : request,
                cb : callback
            };

            // handle timeout
            ariaCoreIO.setTimeout(request.id, request.timeout, {
                fn : this.onAbort,
                scope : this,
                args : [request]
            });

            this._createIFrame(request);
            this._submitForm(request, callback);
        },

        /**
         * Creates an iFrame to load the response of the request.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request
         * @protected
         */
        _createIFrame : function (request) {
            var iFrame;
            var browser = ariaCoreBrowser;
            var document = Aria.$frameworkWindow.document;

            // Issue when using document.createElement("iframe") in IE7
            if (browser.isIE7) {
                var container = document.createElement("div");
                container.innerHTML = ['<iframe style="display:none" src="',
                        ariaCoreDownloadMgr.resolveURL("aria/core/transport/iframeSource.txt"), '" id="xIFrame',
                        request.id, '" name="xIFrame', request.id, '"></iframe>'].join('');
                document.body.appendChild(container);
                iFrame = document.getElementById("xIFrame" + request.id);
                request.iFrameContainer = container;
            } else {
                iFrame = document.createElement("iframe");
                iFrame.src = ariaCoreDownloadMgr.resolveURL("aria/core/transport/iframeSource.txt");
                iFrame.id = iFrame.name = "xIFrame" + request.id;
                iFrame.style.cssText = "display:none";
                document.body.appendChild(iFrame);
            }
            request.iFrame = iFrame;

            // Event handlers
            iFrame.onload = iFrame.onreadystatechange = this._iFrameReady;
        },

        /**
         * Updates the form to target the iframe then calls the forms submit method.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request
         * @param {Object} callback Internal callback description
         * @protected
         */
        _submitForm : function (request, callback) {
            var form = request.form;
            form.target = "xIFrame" + request.id;
            form.action = request.url;
            form.method = request.method;
            if (request.headers["Content-Type"]) {
                try {
                    // in IE 8, setting form.enctype directly does not work
                    // form.setAttribute works better (check PTR 07049566)
                    form.setAttribute("enctype", request.headers["Content-Type"]);
                } catch (ex) {
                    // This might throw an exception in IE if the content type is invalid.
                }
            }
            try {
                form.submit();
            } catch (er) {
                this.$logError(this.ERROR_DURING_SUBMIT, null, er);
                this._deleteRequest(request);
                ariaCoreIO._handleTransactionResponse({
                    conn : {
                        status : 0,
                        responseText : null,
                        getAllResponseHeaders : function () {}
                    },
                    transaction : request.id
                }, callback, true);
            }
        },

        /**
         * load and readystatechange event handler on the iFrame.
         * @param {DOMEvent} event
         */
        _iFrameReady : function (event) {
            // This method cannot use 'this' because the scope is not aria.core.transport.IFrame when this method is
            // called. It uses oSelf instead.
            var event = event || Aria.$frameworkWindow.event;
            var iFrame = event.target || event.srcElement;
            if (!iFrame.readyState || /loaded|complete/.test(iFrame.readyState)) {
                var reqId = /^xIFrame(\d+)$/.exec(iFrame.id)[1];
                // Make sure things are async
                setTimeout(function () {
                    aria.core.transport.IFrame._sendBackResult(reqId);
                }, 4);
            }
        },

        /**
         * Sends back the results of the request
         * @param {String} id Request id
         * @protected
         */
        _sendBackResult : function (id) {
            var description = this._requests[id];
            if (!description) {
                // The request was aborted
                return;
            }
            var request = description.request;
            var callback = description.cb;

            var iFrame = request.iFrame;
            var responseText, contentDocument = iFrame.contentDocument, contentWindow;

            if (contentDocument == null) {
                var contentWindow = iFrame.contentWindow;
                if (contentWindow) {
                    contentDocument = contentWindow.document;
                }
            }
            if (contentDocument) {
                var body = contentDocument.body || contentDocument.documentElement;
                if (body) {
                    // this is for content displayed as text:
                    responseText = body.textContent || body.outerText;
                }
                var xmlDoc = contentDocument.XMLDocument;
                // In IE, contentDocument contains a transformation of the document
                // see: http://www.aspnet-answers.com/microsoft/JScript/29847637/javascript-ie-xml.aspx
                if (xmlDoc) {
                    contentDocument = xmlDoc;
                }
            }

            this._deleteRequest(request);

            var response = {
                status : 200,
                responseText : responseText,
                responseXML : contentDocument
            };

            callback.fn.call(callback.scope, false, callback.args, response);
        },

        /**
         * Delete a request freing up memory
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request
         */
        _deleteRequest : function (request) {
            var iFrame = request.iFrame;
            if (iFrame) {
                var domEltToRemove = request.iFrameContainer || iFrame;
                domEltToRemove.parentNode.removeChild(domEltToRemove);
                // avoid leaks:
                request.iFrameContainer = null;
                request.iFrame = null;
                iFrame.onload = null;
                iFrame.onreadystatechange = null;
            }
            delete this._requests[request.id];
        },

        /**
         * Abort method. Called after the request timeout
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request
         * @return {Boolean} Whether the connection was aborted or not
         */
        onAbort : function (request) {
            this._deleteRequest(request);
            return true;
        }

    }
});
