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
 * Transport class for JSON-P requests.
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.core.transport.JsonP",
    $singleton : true,
    $constructor : function () {
        /**
         * Tells if the transport object is ready or requires an initialization phase
         * @type Boolean
         */
        this.isReady = true;

        /**
         * Html Head. Script tags will be injected in here. This variable is initialized on first use rather than in the
         * constructor so that there is no error in case Aria Templates is loaded in a non-browser environment (Rhino or
         * Node.js)
         * @type HTMLElement
         * @protected
         */
        this._head = null;
    },
    $destructor : function () {
        this._head = null;
    },
    $prototype : {

        /**
         * Initialize the reference to the element that will hold script tags to be created.
         * @return {HTMLElement}
         */
        _initHead : function () {
            var document = Aria.$frameworkWindow.document;
            this._head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            return this._head;
        },

        /**
         * Inizialization function. Not needed because this transport is ready at creation time
         */
        init : Aria.empty,

        /**
         * Perform a request.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request
         * @param {aria.core.CfgBeans:Callback} callback
         * @throws
         */
        request : function (request, callback) {
            var head = this._head || this._initHead();
            var reqId = request.id;
            var insertScript = function () {
                var script = Aria.$frameworkWindow.document.createElement("script");
                script.src = request.url;
                script.id = "xJsonP" + reqId;
                script.async = "async";
                script.type = "text/javascript";

                script.onload = script.onreadystatechange = function (event, isAbort) {
                    if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                        // Memory leak
                        script.onload = script.onreadystatechange = null;

                        // Remove the script
                        if (script.parentNode) {
                            head.removeChild(script);
                        }

                        script = undefined;
                        head = undefined;
                    }
                };

                head.appendChild(script);
            };

            // Generate a callback in this namespace
            var serverCallback = "_jsonp" + reqId;
            this[serverCallback] = function (json) {
                this._onJsonPLoad(request, callback, json);
            };
            request.url += (/\?/.test(request.url) ? "&" : "?") + request.jsonp + "=aria.core.transport.JsonP."
                    + serverCallback;
            request.evalCb = serverCallback;

            // handle abort timeout
            aria.core.IO.setTimeout(reqId, request.timeout, {
                fn : aria.core.IO.abort,
                scope : aria.core.IO,
                args : [reqId, callback]
            });

            // This makes sure the the request is asynchronous also in IE, that in some cases (local requests)
            // will block the normal execution while loading the script synchronously
            setTimeout(insertScript, 10);
        },

        /**
         * Callback of the JSON-P request.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request Request object
         * @param {aria.core.CfgBeans:Callback} callback
         * @param {Object} json Json response coming from the server
         * @protected
         */
        _onJsonPLoad : function (request, callback, json) {
            var reqId = request.id;

            delete this[request.evalCb];

            var response = {
                status : 200,
                responseJSON : json,
                responseText : ""
            };

            callback.fn.call(callback.scope, false, callback.args, response);
        }
    }
});
