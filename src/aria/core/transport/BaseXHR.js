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
 * Transport class for XHR requests.
 * @class aria.core.transport.XHR
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.core.transport.BaseXHR",
    $implements : ["aria.core.transport.ITransports"],
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
    },
    $prototype : {
        /**
         * Initialization function. Not needed because this transport is ready at creation time
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
            this._requestParams[reqId] = {
                reqId : reqId,
                method : method,
                uri : uri,
                callback : callback,
                postData : postData
            };
        },

        /**
         * Perform a request.
         * @param {String} reqId Request identifier
         * @param {String} method Request method, GET or POST
         * @param {String} uri Resource URI
         * @param {Object} callback Internal callback description
         * @param {String} postData Data to be sent in a POST request
         * @return {Object} connection object
         * @throws
         */
        request : function (reqId, method, uri, callback, postData) {
            this._setUp(reqId, method, uri, callback, postData);
            var params = this._requestParams[reqId];
            this.$assert(55, !!params);
            delete this._requestParams[reqId];

            var ariaIO = aria.core.IO, connection = this._getConnection();

            connection.open(params.method, params.uri, true);

            // Initialize all default and custom HTTP headers,
            ariaIO.setHeaders(connection);

            this._handleReadyState({
                conn : connection,
                transaction : params.reqId,
                xhr : true
            }, params.callback);

            // This might throw an error, propagate it and let the IO know that there was an exception
            connection.send(params.postData || null);

            return connection;
        },

        /**
         * Get a connection object.
         * @return {Object} connection object
         * @protected
         */
        _getConnection : function () {
            return this._standardXHR() || this._activeX();
        },

        /**
         * Get a standard XMLHttpRequest connection object
         * @return {XMLHttpRequest} connection object
         * @protected
         */
        _standardXHR : function () {
            try {
                var XMLHttpRequest = Aria.$global.XMLHttpRequest;
                return new XMLHttpRequest();
            } catch (e) {}
        },

        /**
         * Get an ActiveXObject connection object
         * @return {ActiveXObject} connection object
         * @protected
         */
        _activeX : function () {
            try {
                var ActiveXObject = Aria.$global.ActiveXObject;
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        },

        /**
         * A timer that polls the XHR object's readyState property during a transaction, instead of binding a callback
         * to the onreadystatechange event. Upon readyState 4, handleTransactionResponse will process the response, and
         * the timer will be cleared.
         * @protected
         * @param {object} xhrObject The connection object
         * @param {callback} callback The user-defined callback object
         */
        _handleReadyState : function (xhrObject, callback) {
            var ariaIO = aria.core.IO;

            // Timer for aborting the request after a timeout
            if (callback && callback.timeout) {
                ariaIO._timeOut[xhrObject.transaction] = setTimeout(function () {
                    var tId = xhrObject.transaction;

                    // You won't believe this, but sometimes IE forgets to remove the timeout even if
                    // we explicitely called a clearTimeout. Double check that the timeout is valid
                    if (ariaIO._timeOut[tId]) {
                        ariaIO.abort(xhrObject, callback, true);
                    }
                }, callback.timeout);
            }

            // Interval for processing the response from the server
            ariaIO._poll[xhrObject.transaction] = setInterval(function () {
                if (xhrObject.conn && xhrObject.conn.readyState === 4) {
                    var tId = xhrObject.transaction;

                    clearInterval(ariaIO._poll[tId]);
                    clearTimeout(ariaIO._timeOut[tId]);

                    delete ariaIO._poll[tId];
                    delete ariaIO._timeOut[tId];

                    ariaIO._handleTransactionResponse(xhrObject, callback);
                }
            }, ariaIO._pollingInterval);
        }
    }
});