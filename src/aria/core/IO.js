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
var Aria = require("../Aria");
var ariaUtilsType = require("../utils/Type");
var ariaUtilsJson = require("../utils/Json");

/**
 * Connection manager class. Provides a way to make requests for different URI (file, XHR, XDR) and keeps a list of all
 * pending requests.
 * @singleton
 * @dependencies ["aria.utils.Type", "aria.utils.Json", "aria.utils.json.JsonSerializer", "aria.core.Timer",
 * "aria.utils.Array", "aria.utils.String"]
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.IO",
    $singleton : true,
    $events : {
        "request" : {
            description : "raised when a request is sent to the server",
            properties : {
                req : "{aria.core.CfgBeans.IOAsyncRequestCfg} Request object."
            }
        },
        "response" : {
            description : "raised when a request process is done (can be an error)",
            properties : {
                req : "{aria.core.CfgBeans.IOAsyncRequestCfg} Request object."
            }
        },
        "startEvent" : {
            description : "raised when an XDR transaction starts",
            properties : {
                o : "{Object} The connection object"
            }
        },
        "abortEvent" : {
            description : "Raised when an XDR transaction is aborted (after a timeout)",
            properties : {
                o : "[DEPRECATED]{Object} The connection object",
                req : "{aria.core.CfgBeans.IOAsyncRequestCfg} Request object that is being aborted."
            }
        }
    },
    $statics : {
        /**
         * Status code for communication errors.
         * @type Number
         */
        COMM_CODE : 0,

        /**
         * Status code for aborted requests.
         * @type Number
         */
        ABORT_CODE : -1,

        /**
         * Response text for aborted requests.
         * @type String
         */
        ABORT_ERROR : "transaction aborted",

        /**
         * Response text for timed-out requests.
         * @type String
         */
        TIMEOUT_ERROR : "timeout expired",

        // ERROR MESSAGES:
        MISSING_IO_CALLBACK : "Missing callback in IO call - Please check\nurl: %1",
        IO_CALLBACK_ERROR : "Error in IO callback handling on url: %1",
        IO_REQUEST_FAILED : "Invalid Request: \nurl: %1\nerror: %2",
        JSON_PARSING_ERROR : "Response text could not be evaluated as JSON.\nurl: %1\nresponse: %2",
        MISSING_FORM : "Missing form id or form object in asyncFormSubmit call - Please check the bean: aria.core.CfgBeans.IOAsyncRequestCfg."
    },
    $constructor : function () {
        /**
         * Map of pending requests. It maps an unique request ID to a request object (@see aria.core.IO.request)
         * @type Object
         */
        this.pendingRequests = {};

        /**
         * Number of requests. ID generator
         * @type Number
         */
        this.nbRequests = 0;

        /**
         * Number of successful requests
         * @type Number
         */
        this.nbOKResponses = 0;

        /**
         * Number of failed requests.
         * @type Number
         */
        this.nbKOResponses = 0;

        /**
         * Amount of traffic in the uplink direction. Measured as the number of characters of the POST request
         * @type Number
         */
        this.trafficUp = 0;

        /**
         * Amount of traffic in the downlink direction. Measured as the number of characters of the response text. Sum
         * of success and failures.
         * @type Number
         */
        this.trafficDown = 0;

        /**
         * Default XHR timeout in ms
         * @type Number
         */
        this.defaultTimeout = 60000;

        /**
         * Regular expression to extract the URI scheme from the URI.
         * @type RegExp
         * @protected
         */
        this._uriScheme = /^([\w\+\.\-]+:)(?:\/\/)?(.*)/;

        /**
         * Regular expression to extract the URI scheme that should be handled as a local request
         * @type RegExp
         * @protected
         */
        this._uriLocal = /^(?:file):$/;

        /**
         * Map of headers sent with every request.
         * @type Object
         */
        this.headers = {
            "X-Requested-With" : "XMLHttpRequest"
        };

        /**
         * Map of additional headers sent with each POST and PUT request (in addition to the ones in this.headers).
         * @type Object
         */
        this.postHeaders = {
            "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
        };

        /**
         * Map each request to the polling timeout added while handling the ready state.
         * @type Object
         * @protected
         */
        this._poll = {};

        /**
         * Map each request to the abort timeout added while handling the ready state.
         * @type Object
         * @protected
         */
        this._timeOut = {};

        /**
         * Contains the transport to be used for same domain requests.
         * @type String class name and path.
         * @private
         */
        this.__sameDomain = "aria.core.transport.XHR";

        /**
         * Contains the transport to be used for cross domain requests.
         * @type String class name and path.
         * @private
         */
        this.__crossDomain = "aria.core.transport.XDR";

        /**
         * Contains the transport to be used for JsonP requests.
         * @type String class name and path.
         * @private
         */
        this.__jsonp = "aria.core.transport.JsonP";

        /**
         * Contains the transport to be used for local file requests.
         * @type String class name and path.
         * @private
         */
        this.__local = "aria.core.transport.Local";

        /**
         * Contains the transport to be used for IFrame requests.
         * @type String class name and path.
         * @private
         */
        this.__iframe = "aria.core.transport.IFrame";

        /**
         * Default Json serializer used to serialize response texts into json
         * @type aria.utils.json.JsonSerializer
         * @private
         */
        this.__serializer = new (require("../utils/json/JsonSerializer"))();
    },

    $destructor : function () {
        // Clear any pending timeout
        var timeout;
        for (timeout in this._poll) {
            if (this._poll.hasOwnProperty(timeout)) {
                clearInterval(this._poll[timeout]);
            }
        }
        for (timeout in this._timeOut) {
            if (this._timeOut.hasOwnProperty(timeout)) {
                clearInterval(this._timeOut[timeout]);
            }
        }
        if (this.__serializer) {
            this.__serializer.$dispose();
            this.__serializer = null;
        }

        this._poll = null;
        this._timeOut = null;
    },
    $prototype : {
        /**
         * Perform an asynchronous request to the server.<br>
         * The callback is always called in an asynchronous way (even in case of errors).<br>
         * <br>
         * <strong>Note: in order to have non-null `responseJSON`/`responseXML` node in the response, you have to
         * explicitly set expectedResponseType: 'json'/'xml' respectively in your request config.</strong>
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req the request description
         *
         * <pre>
         * [req] {
         *    url: 'myfile.txt',            // absolute or relative URL
         *    async: 'true',                // asynchronous or synchronous behavior (use it with care: sync requests can freeze the UI)
         *    expectedResponseType: 'json'  // 'json', 'xml' or 'text' (default). Tells the framework to try to parse the server response accordingly
         *    method: 'POST',               // POST, PUT, DELETE, OPTIONS, HEAD, TRACE, OPTIONS, CONNECT, PATCH or GET (default)
         *    data: '',                     // {String} null by default
         *    headers: {                    // map of HTTP headers for this requests; you may override the defaults and add custom headers.
         *     'X-Requested-With' : 'XMLHttpRequest', // auto-injected for all requests
         *     'Content-Type': 'application/json'     // for POST/PUT requests defaults to 'application/x-www-form-urlencoded; charset=UTF-8', otherwise not injected
         *    },                            // See aria.core.IO.headers and aria.core.IO.postHeaders
         *    timeout: 1000,                // {Integer} timeout in ms; default: aria.core.IO.defaultTimeout (60000)
         *    callback: {
         *      fn: obj.method,             // mandatory
         *      scope: obj,                 // mandatory
         *      onerror: obj2.method2       // callback error handler - optional
         *      onerrorScope: obj2          // optional
         *      args: {x:123}               // optional - default: null
         *    }
         * }
         * When a response is received, the callback function is called with the following arguments:
         * <code>
         * callback(response, callbackArgs)
         * </code>
         * where the structure of `response` is described in aria.core.CfgBeans.IOAsyncRequestResponseCfg
         * [response] {
         *    url: '',
         *    status: '',
         *    responseText: '',
         *    responseXML: xmlObj,          // not always available, see note above
         *    responseJSON: JSON Object,    // not always available, see note above
         *    error: ''
         * }
         * [callbackArgs] == args object in the req object
         * </pre>
         *
         * @return {Integer} a request id
         */
        asyncRequest : function (req) {
            this.__normalizeRequest(req);
            // Don't validate the bean to avoid having a dependency on aria.core.JsonValidator

            this.pendingRequests[req.id] = req;

            // IOFiltersMgr is not a mandatory feature, if it's not there, let's just go to the next phase
            if (aria.core.IOFiltersMgr) {
                aria.core.IOFiltersMgr.callFiltersOnRequest(req, {
                    fn : this._afterRequestFilters,
                    scope : this,
                    args : req
                });
            } else {
                this._afterRequestFilters(null, req);
            }

            return req.id;
        },

        /**
         * Make a pseudo asynchronous form submission. The form is submitted through an iframe, that is set as the
         * target of the form. When calling this method, the form is actually submitted, so that the response is added
         * in the body of the iframe. This mechanism is a common workaround that avoids the full refresh of the current
         * page, as everything happens in the iframe.<br>
         * <br>
         * BEWARE: this method may fail in certain browsers depending on the Content-Type of the response. For example,
         * if the Content-Type of the response is "application/json", some browsers will not output its content inside
         * the body, or will prompt you to save or open the file. XML responses are generally accepted. In these
         * specific cases, bear in mind that it is possible to serialize a form using method
         * aria.utils.Html.serializeForm and use the extracted string as the data of a standard ajax request
         * (aria.core.IO.asyncRequest). This will not be possible if some of the elements of your form are not
         * serializable.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request Request description<br>
         * <br>
         * See the documentation of `asyncRequest` method regarding the structure and options of request and response.<br>
         * On top of that, the `request` object can contain `form` or `formId`.<br>
         * If `request.url` and `request.method` are not set, they're taken from the form's `action` and `method`
         * attributes respectively.
         *
         * <pre>
         * [request] {
         *    form: HTMLElement       // a reference to the HTML &lt;form&gt; element
         *    formId: 'myForm',       // HTML ID of the form that is to be submitted
         * }
         * </pre>
         *
         * @return {Integer} Request identifier
         */
        asyncFormSubmit : function (request) {
            var form;
            if (ariaUtilsType.isHTMLElement(request.form)) {
                form = request.form;
            } else if (ariaUtilsType.isString(request.formId)) {
                form = Aria.$window.document.getElementById(request.formId);
            }

            if (!form) {
                this.$logError(this.MISSING_FORM);
                return request.callback.onerror.call(request.callback.scope, request);
            }

            if (!request.url) {
                request.url = form.action;
            }

            if (!request.method) {
                request.method = form.method;
            }

            if (form.enctype && !request.headers) {
                request.headers = {
                    "Content-Type" : form.enctype
                };
            } else if (form.enctype && request.headers && !request.headers["Content-Type"]) {
                request.headers["Content-Type"] = form.enctype;
            }

            request.form = form;
            request.formId = form.id;
            return this.asyncRequest(request);
        },

        /**
         * Continue the request started in asyncRequest, after request filters have been called.
         * @param {Object} unused Unused parameter
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req request (may have been modified by filters)
         * @private
         */
        _afterRequestFilters : function (unused, req) {
            this.$raiseEvent({
                name : "request",
                req : req
            });

            req.beginDownload = (new Date()).getTime();

            // as postData can possibly be changed by filters, we compute the requestSize only after filters have been
            // called:
            req.requestSize = ((req.method == "POST" || req.method == "PUT") && req.data) ? req.data.length : 0;

            // PROFILING // req.profilingId = this.$startMeasure(req.url);

            try {
                this._prepareTransport(req);
            } catch (ex) {
                // There was an error in this method - let's create a callback to notify
                // the caller in the same way as for other errors
                (require("./Timer")).addCallback({
                    fn : this._handleResponse,
                    scope : this,
                    delay : 10,
                    args : {
                        isInternalError : true,
                        reqId : req.id,
                        errDescription : ex.description || ex.message || (ex.name + ex.number)
                    }
                });
            }

            return req.id;
        },

        /**
         * Normalize the Request object adding default values and additional parameters like a unique ID
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req Request object as the input parameter of asyncRequest
         * @private
         */
        __normalizeRequest : function (req) {
            // increment before assigning to avoid setting request id 0 (which does not work well with abort)
            this.nbRequests++;
            req.id = this.nbRequests;

            var reqMethods = ["GET", "POST", "PUT", "DELETE", "HEAD", "TRACE", "OPTIONS", "CONNECT", "PATCH", "COPY",
                    "PROPFIND", "MKCOL", "PROPPATCH", "MOVE", "LOCK", "UNLOCK", "BIND", "UNBIND", "REBIND"];
            // Assign a request timeout in order of importance:
            // # req.timeout - User specified timeout
            // # req.callback.timeout - Timeout of the callback function (might be set by filters)
            // # this.defaultTimeout - Default IO timeout
            if (req.timeout == null) {
                req.timeout = (req.callback == null || req.callback.timeout == null)
                        ? this.defaultTimeout
                        : req.callback.timeout;
            }

            if (!req.method) {
                req.method = "GET";
            } else {
                req.method = req.method.toUpperCase();
            }

            if (!(require("../utils/Array")).contains(reqMethods, req.method)) {
                return this.$logWarn("The request method %1 is invalid", [req.method]);
            }

            var headers = {};
            // First take the default IO headers
            for (var key in this.headers) {
                if (this.headers.hasOwnProperty(key)) {
                    headers[key] = this.headers[key];
                }
            }
            // Then add POST/PUT-specific headers
            if (req.method === "POST" || req.method === "PUT") {
                for (var key in this.postHeaders) {
                    if (this.postHeaders.hasOwnProperty(key)) {
                        headers[key] = this.postHeaders[key];
                    }
                }
            }
            // Then the headers from the request object
            for (var key in req.headers) {
                if (req.headers.hasOwnProperty(key)) {
                    headers[key] = req.headers[key];
                }
            }

            req.headers = headers;
        },

        /**
         * Prepare the transport class before going on with the request (make sure it is loaded, through Aria.load).
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request Request object
         * @private
         */
        _prepareTransport : function (request) {
            var transport;
            if (request.jsonp) {
                transport = this.__jsonp;
            } else if (ariaUtilsType.isHTMLElement(request.form)) {
                transport = this.__iframe;
            } else {
                transport = this._getTransport(request.url, Aria.$frameworkWindow
                        ? Aria.$frameworkWindow.location
                        : null);
            }

            var instance = Aria.getClassRef(transport);
            var args = {
                req : request,
                transport : {
                    classpath : transport,
                    instance : instance
                }
            };

            if (!instance) {
                Aria.load({
                    classes : [transport],
                    oncomplete : {
                        fn : this._asyncRequest,
                        args : args,
                        scope : this
                    }
                });
            } else {
                this._asyncRequest(args);
            }
        },

        /**
         * Get the correct transport for the uri. It uses the Location argument to distinguish between XHR and XDR
         * @param {String} uri URI of the request
         * @param {Object} location Location object as in window.location or null if not run in a browser
         *
         * <pre>
         * {
         *    protocol: the protocol of the URL
         *    host: the hostname and port number
         * }
         * </pre>
         *
         * @return {String} Transport class classpath
         * @protected
         */
        _getTransport : function (uri, location) {
            var uriCheck = this._uriScheme.exec(uri.toLowerCase());

            if (uriCheck && location) {
                var scheme = uriCheck[1], authority = uriCheck[2];

                if (this._uriLocal.test(scheme)) {
                    return this.__local;
                } else if (scheme != location.protocol || (authority.indexOf(location.host) !== 0)) {
                    // Having different protocol or host we must use XDR
                    return this.__crossDomain;
                }
            }

            // For any other request go for XHR
            return this.__sameDomain;
        },

        /**
         * Initiates an asynchronous request via the chosen transport.
         * @protected
         * @param {Object} arg Object containing the properties:
         *
         * <pre>
         *      req (aria.core.CfgBeans:IOAsyncRequestCfg) Request object,
         *      transport {Object} containing 'classpath' and 'instance'
         * </pre>
         */
        _asyncRequest : function (arg) {
            var request = arg.req;
            var reqId = request.id;
            // var method = request.method;
            var transport = arg.transport.instance || Aria.getClassRef(arg.transport.classpath);

            var transportCallback = {
                fn : this._handleResponse,
                scope : this,
                args : request
            };

            if (!transport.isReady) {
                // Wait for it to be ready
                return transport.init(reqId, transportCallback);
            }

            // Here we're going to make a request
            this.trafficUp += request.requestSize;

            transport.request(request, transportCallback);
        },

        /**
         * Handle a transport response. This is the callback function passed to a transport request
         * @param {Boolean|Object} error Whether there was an error or not
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request
         * @param {aria.core.CfgBeans:IOAsyncRequestResponseCfg} response
         */
        _handleResponse : function (error, request, response) {
            if (!response) {
                response = {};
            }

            if (!request && error) {
                request = this.pendingRequests[error.reqId];
            }

            this.clearTimeout(request.id);
            this._normalizeResponse(error, request, response);

            // Extra info for the request object
            request.res = response;
            request.endDownload = (new Date()).getTime();
            request.downloadTime = request.endDownload - request.beginDownload;
            request.responseSize = response.responseText.length;

            this.trafficDown += request.responseSize;

            this.$raiseEvent({
                name : "response",
                req : request
            });

            delete this.pendingRequests[request.id];

            if (aria.core.IOFiltersMgr) {
                aria.core.IOFiltersMgr.callFiltersOnResponse(request, {
                    fn : this._afterResponseFilters,
                    scope : this,
                    args : request
                });
            } else {
                this._afterResponseFilters(null, request);
            }
        },

        /**
         * Normalize the Response object adding error messages (if any) and converting the response in the expected
         * format
         * @param {Boolean} error Whether there was an error or not
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request
         * @param {aria.core.CfgBeans:IOAsyncRequestResponseCfg} response
         */
        _normalizeResponse : function (error, request, response) {
            response.reqId = request.id;
            response.url = request.url;

            var expectedResponseType = request.expectedResponseType;

            if (error) {
                this.nbKOResponses++;

                if (!response.responseText) {
                    response.responseText = "";
                }

                if (response.responseText && expectedResponseType === "json") {
                    try {
                        response.responseJSON = this.__serializer.parse(response.responseText);
                    } catch (ex) {
                        this.$logWarn(this.JSON_PARSING_ERROR, [request.url, response.responseText]);
                    }
                }

                if (!response.error) {
                    response.error = error === true ? error.statusText || "error" : error.errDescription;
                }

            } else {
                this.nbOKResponses++;

                if (expectedResponseType) {
                    this._jsonTextConverter(response, expectedResponseType);
                }

                response.error = null;
            }
        },

        /**
         * Continue to process a response, after response filters have been called.
         * @param {Object} unused Unused parameter
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req request (may have been modified by filters)
         * @private
         */
        _afterResponseFilters : function (unused, req) {
            var res = req.res, cb = req.callback;
            if (!cb) {
                this.$logError(this.MISSING_IO_CALLBACK, [res.url]);
            } else if (res.error != null) {
                // an error occured
                // call the error callback
                if (cb.onerror == null) {
                    // Generic IO error mgt
                    this.$logError(this.IO_REQUEST_FAILED, [res.url, res.error]);
                } else {
                    var scope = cb.onerrorScope;
                    if (!scope) {
                        scope = cb.scope;
                    }
                    try {
                        cb.onerror.call(scope, res, cb.args);
                    } catch (ex) {
                        this.$logError(this.IO_CALLBACK_ERROR, [res.url], ex);
                    }
                }
            } else {

                // check the response type to adapt it to the request
                if (req.expectedResponseType) {

                    this._jsonTextConverter(res, req.expectedResponseType);
                }

                cb.fn.call(cb.scope, res, cb.args);
            }
            req = cb = null;
        },

        /**
         * Updates the transport to be used for same domain, cross domain, and jsonp requests. Currently transports must
         * be singletons.
         * @param {Object} transports class name and path
         *
         * <pre>
         * aria.core.IO.updateTransports({
         *     'sameDomain' : 'myApplication.transports.SameDomainCustomTransport',
         *     'crossDomain' : 'myApplication.transports.CrossDomainCustomTransport',
         *     'jsonp' : 'myApplication.transports.JsonP',
         *     'local' : 'myApplication.transports.Local',
         *     'iframe' : 'myApplication.transports.IFrame'
         * });
         * </pre>
         *
         * @public
         */
        updateTransports : function (transports) {
            if (transports.sameDomain) {
                this.__sameDomain = transports.sameDomain;
            }

            if (transports.crossDomain) {
                this.__crossDomain = transports.crossDomain;
            }

            if (transports.jsonp) {
                this.__jsonp = transports.jsonp;
            }

            if (transports.local) {
                this.__local = transports.local;
            }

            if (transports.iframe) {
                this.__iframe = transports.iframe;
            }
        },

        /**
         * Gets the class name and path of the current transports used for same domain, cross domain, jsonp, and local
         * requests.
         * @return {Object}
         * @public
         */
        getTransports : function () {
            return {
                "sameDomain" : this.__sameDomain,
                "crossDomain" : this.__crossDomain,
                "jsonp" : this.__jsonp,
                "local" : this.__local,
                "iframe" : this.__iframe
            };
        },

        /**
         * Set a timeout for a given request. If not canceled this method calls the abort function and the callback
         * after 'timeout' milliseconds
         * @param {Number} id Request id
         * @param {Number} timeout Timer in milliseconds
         * @param {aria.core.CfgBeans:Callback} callback Should be already normalized
         */
        setTimeout : function (id, timeout, callback) {
            if (timeout > 0) {
                this._timeOut[id] = setTimeout(function () {
                    // You won't believe this, but sometimes IE forgets to remove the timeout even if
                    // we explicitely called a clearTimeout. Double check that the timeout is valid
                    if ((module.exports)._timeOut[id]) {
                        (module.exports).abort({
                            redId : id,
                            getStatus : callback
                        }, null, true);
                    }
                }, timeout);
            }
        },

        /**
         * Clear a request timeout. It removes the poll timeout as well
         * @param {Number} id Request id
         */
        clearTimeout : function (id) {
            clearInterval(this._poll[id]);
            delete this._poll[id];
            clearTimeout(this._timeOut[id]);
            delete this._timeOut[id];
        },

        /**
         * Method to terminate a transaction, if it has not reached readyState 4.
         * @param {Object|String} xhrObject The connection object returned by asyncRequest or the Request identifier.
         * @param {Object} callback User-defined callback object.
         * @param {String} isTimeout boolean to indicate if abort resulted from a callback timeout.
         * @return {Boolean}
         */
        abort : function (xhrObject, callback, isTimeout) {
            if (!xhrObject) {
                return false;
            }

            var transaction = xhrObject.redId || xhrObject;
            var request = this.pendingRequests[transaction];

            this.clearTimeout(transaction);

            var abortStatus = false;
            if (xhrObject.getStatus) {
                var statusCallback = xhrObject.getStatus;
                abortStatus = statusCallback.fn.apply(statusCallback.scope, statusCallback.args);
            }

            if (request) {
                abortStatus = true;

                if (xhrObject === transaction) {
                    xhrObject = {
                        transaction : transaction
                    };
                } else {
                    xhrObject.transaction = transaction;
                }
            }

            if (abortStatus === true) {
                // Fire global custom event -- abortEvent
                this.$raiseEvent({
                    name : "abortEvent",
                    o : xhrObject,
                    req : request
                });

                var response = {
                    transaction : request.id,
                    req : request,
                    status : isTimeout ? this.COMM_CODE : this.ABORT_CODE,
                    statusText : isTimeout ? this.TIMEOUT_ERROR : this.ABORT_ERROR
                };

                this._handleResponse(true, request, response);
            }

            return abortStatus;
        },

        /**
         * Make a JSON-P request.
         * @param {aria.core.CfgBeans:IOAsyncRequestCfg} request Request description
         *
         * <pre>
         * [request] {
         *    url: &quot;myfile.txt&quot;,  // absolute or relative URL
         *    timeout: 1000,    // {Integer} timeout in ms - default: defaultTimeout
         *    jsonp: &quot;callback&quot;,  // Name of the parameters that specifies the callback to be executed, default callback
         *    callback: {
         *      fn: obj.method,     // mandatory
         *      scope: obj,         // mandatory
         *      onerror: obj2.method2 // callback error handler - optional - default: Timer error log
         *      onerrorScope: obj2    // optional - default: Timer or scope if onError is provided
         *      args: {x:123}       // optional - default: null
         *    }
         * }
         * Url generated will be:
         * [request.url]?[request.jsonp]=[request.callback]
         * When a response is received, the callback function is called with the following arguments:
         * callback(response, callbackArgs)
         * where:
         * [response] { // the structure of response is described in aria.core.CfgBeans.IOAsyncRequestResponseCfg
         *    url: &quot;&quot;,
         *    status: &quot;&quot;,
         *    responseText: &quot;&quot;,
         *    responseXML: null,
         *    responseJSON: JSON Object,
         *    error: &quot;&quot; // error description
         * }
         * and callbackArgs == args object in the request callback object
         * </pre>
         *
         * @return {Integer} Request identifier
         */
        jsonp : function (request) {
            if (!request.jsonp) {
                request.jsonp = "callback";
            }
            if (!request.expectedResponseType) {
                request.expectedResponseType = "json";
            }
            return this.asyncRequest(request);
        },

        /**
         * Convert the response text into Json or response Json into text
         * @param {aria.core.CfgBeans:IOAsyncRequestResponseCfg} response Response object
         * @param {String} expectedResponseType The expected response type
         * @protected
         */
        _jsonTextConverter : function (response, expectedResponseType) {
            if (expectedResponseType == "text") {
                if (!response.responseText && response.responseJSON != null) {
                    // convert JSON to text
                    if (ariaUtilsType.isString(response.responseJSON)) {
                        // this case is important for JSON-P services which return a simple string
                        // we simply use that string as text
                        // (could be useful to load templates through JSON-P, for example)
                        response.responseText = response.responseJSON;
                    } else {
                        // really convert the JSON structure to a string
                        response.responseText = ariaUtilsJson.convertToJsonString(response.responseJSON);
                    }
                }
            } else if (expectedResponseType == "json") {
                if (response.responseJSON == null && response.responseText != null) {
                    // convert text to JSON
                    var errorMsg = (require("../utils/String")).substitute(this.JSON_PARSING_ERROR, [response.url,
                            response.responseText]);
                    response.responseJSON = ariaUtilsJson.load(response.responseText, this, errorMsg);
                }
            }

        },

        /**
         * Reiusse a pending request. A request might need to be reissued because the transport was not ready (it's the
         * case of XDR).
         * @param {String} reqId ID of the pending request.
         */
        reissue : function (reqId) {
            var req = this.pendingRequests[reqId];

            if (req) {
                delete this.pendingRequests[reqId];
                return this.asyncRequest(req);
            }
        }

    }
});
