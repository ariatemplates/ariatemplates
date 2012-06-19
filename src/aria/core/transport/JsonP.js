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
 * @class aria.core.transport.JsonP
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.core.transport.JsonP",
    $implements : ["aria.core.transport.ITransports"],
    $singleton : true,
    $constructor : function () {
        /**
         * Tells if the transport object is ready or requires an initialization phase
         * @type Boolean
         */
        this.isReady = true;

        /**
         * Map of ongoing request parameters
         * @type Object
         * @protected
         */
        this._requestParams = {};

        /**
         * Html Head. Script tags will be injected in here
         * @type HTMLElement
         * @protected
         */
        this._head = null; // this variable is initialized on first use rather than in the constructor so that there is
        // no error in case Aria Templates is loaded in a non-browser environment (Rhino or Node.js)
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
        init : function () {},

        /**
         * Set up the parameters for a new connection.
         * @param {String} reqId Request identifier
         * @param {String} method Request method, GET or POST
         * @param {String} uri Resource URI
         * @param {Object} callback Internal callback description
         * @param {String} postData Data to be sent in a POST request
         * @protected
         */
        _setUp : function (reqId, method, uri, callback, postData) {
            // Altough it keeps the same interface as all the other trasnports, we only care about:
            this._requestParams[reqId] = {
                reqId : reqId,
                uri : uri,
                callback : callback
            };
        },

        /**
         * Perform a request.
         * @param {String} reqId Request identifier
         * @param {String} method Request method, GET or POST
         * @param {String} uri Resource URI
         * @param {Object} callback Internal callback description
         * @param {String} postData Data to be sent in a POST request
         */
        request : function (reqId, method, uri, callback, postData) {
            this._setUp(reqId, method, uri, callback, postData);
            var params = this._requestParams[reqId];
            this.$assert(34, !!params);
            delete this._requestParams[reqId];

            var head = this._head || this._initHead();
            var insertScript = function () {
                var script = Aria.$frameworkWindow.document.createElement("script");
                script.src = params.uri;
                script.id = "xJsonP" + params.reqId;
                script.async = "async";

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

            // This makes sure the the request is asynchronous also in IE, that in some cases (local requests)
            // will block the normal execution while loading the script synchronously
            setTimeout(insertScript, 10);
        }
    }
});