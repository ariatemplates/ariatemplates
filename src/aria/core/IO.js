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
 * Connection manager class. Provides a way to make requests for different URI (file, XHR, XDR) and keeps a list of all
 * pending requests.
 * @class aria.core.IO
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.core.IO",
    $singleton : true,
    $events : {
        "request" : {
            description : "raised when a request is sent to the server",
            properties : {
                req : "{Object} the request object. It is the parameter of asyncRequest, completed with the following properties:\nid: {Integer} the id of the request; the first request after Aria is loaded has id 0, and then ids are given sequentially\nrequestSize: {Integer} the size of the message in bytes (currently the size of the POST data, 0 for GET requests)"
            }
        },
        "response" : {
            description : "raised when a request process is done (can be an error)",
            properties : {
                req : "{Object} the request object. It is the same object as the one received in the request event, completed with the following properties:\nresponseSize:{Integer} the size of the response in bytes\n\nbeginDownload:{Integer} the time at which the download started\nendDownload:{Integer} the time at which the download ended\ndownloadTime:{Integer} the download duration in ms (= endDownload-beginDownload)\nres: {Object} the response object given to the asyncRequest callback method (with url, status, error and responseText properties)"
            }
        },
        "startEvent" : {
            description : "raised when an XDR transaction starts",
            properties : {
                o : "{Object} The connection object"
            }
        },
        "abortEvent" : {
            description : "raised when an XDR transaction is aborted (after a timeout)",
            properties : {
                o : "{Object} The connection object"
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
         * Response text for communication errors.
         * @type String
         */
        COMM_ERROR : "communication failure",

        /**
         * Status code for aborted requests.
         * @type Number
         */
        ABORT_CODE : -1,

        /**
         * Response text for aborted requests.
         * @type Number
         */
        ABORT_ERROR : "transaction aborted",

        // ERROR MESSAGES:
        MISSING_IO_CALLBACK : "Missing callback in IO call - Please check\nurl: %1",
        IO_CALLBACK_ERROR : "Error in IO callback handling on url: %1",
        IO_REQUEST_FAILED : "Invalid Request: \nurl: %1\nerror: %2",
        JSON_PARSING_ERROR : "Response text could not be evaluated as JSON.",
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
         * Identify any request as Ajax through the header X-Requested-With.
         * @type Boolean
         */
        this.useXHRHeader = true;

        /**
         * Default value for X-Requested-With header
         * @type String
         */
        this.defaultXHRHeader = "XMLHttpRequest";

        /**
         * Map of headers sent with evey request.
         * @type Object
         * @protected
         */
        this._defaultHeaders = {};

        /**
         * Tells if there are default headers.
         * @type Boolean
         * @protected
         */
        this._hasDefaultHeaders = false;

        /**
         * Map of request specific headers. It is emptied after every request
         * @type Object
         * @protected
         */
        this._httpHeaders = {};

        /**
         * Tells if there are request specific headers.
         * @type Boolean
         * @protected
         */
        this._hasHTTPHeaders = false;

        /**
         * Set the header "Content-type" to a default value in case of POST requests (@see defaultPostHeader)
         * @type Boolean
         */
        /* Backward Compatibility begins here */
        this.useDefaultPostHeader = true;

        /**
         * Default value for header "Content-type". Used only for POST requests
         * @type String
         */
        this.defaultPostHeader = 'application/x-www-form-urlencoded; charset=UTF-8';
        /* Backward Compatibility ends here */
        /**
         * Set the header "Content-type" to a default value (@see defaultContentTypeHeader)
         * @type Boolean
         */
        this.useDefaultContentTypeHeader = true;

        /**
         * Default value for header "Content-type".
         * @type String
         */
        this.defaultContentTypeHeader = 'application/x-www-form-urlencoded; charset=UTF-8';
        /**
         * Polling interval for the handle ready state in milliseconds.
         * @type Number
         * @protected
         */
        this._pollingInterval = 50;

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

        this._poll = null;
        this._timeOut = null;
    },
    $prototype : {
        /**
         * Perform an asynchronous request to the server <br />
         * Note: callback is always called in an asynchronous way (even in case of errors)
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} req the request description
         *
         * <pre>
         * [req] {
         *    url: 'myfile.txt',     // absolute or relative URL
         *    method: 'POST',        // POST, PUT, DELETE, OPTIONS, HEAD, TRACE, OPTIONS, CONNECT, PATCH or GET (default)
         *    data: '',          // {String} null by default, for POST requests postData can also be used instead of data
         *    contentTypeHeader:'',  //  {String} application/x-www-form-urlencoded; charset=UTF-8 by default
         *    timeout: 1000,     // {Integer} timeout in ms - default: defaultTimeout
         *    callback: {
         *      fn: obj.method,        // mandatory
         *      scope: obj,            // mandatory
         *      onerror: obj2.method2  // callback error handler - optional
         *      onerrorScope: obj2     // optional
         *      args: {x:123}          // optional - default: null
         *    }
         * }
         * When a response is received, the callback function is called with the following arguments:
         *
         * <code>
         * cb(asyncRes, cbArgs)
         * </code>
         * where:
         * the structure of asyncRes is described in aria.core.CfgBeans.IOAsyncRequestResponseCfg
         * [asyncRes] {
         *    url: '',
         *    status: '',
         *    responseText: '',
         *    responseXML: xmlObj,
         *    responseJSON: JSON Object,
         *    error: ''
         * }
         * and cbArgs == args object in the req object
         * </pre>
         *
         * @return {Integer} a request id
         */
        asyncRequest : function (req) {
            this.__normalizeRequest(req);

            // In non debug mode, the check doesn't do anything anyway, so we want to avoid having
            // to depend on aria.core.JsonValidator here
            // if (Aria.debug) {
            // aria.core.JsonValidator.check(req, "aria.core.CfgBeans.IOAsyncRequestCfg");
            // }

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
         * Make a pseudo asynchronous form submission.
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} request Request description
         *
         * <pre>
         * [request] {
         *    formId: &quot;callback&quot;,  // ID of the form that is to be submitted
         *    form: //the html form element
         *    url:&quot;myfile.txt&quot;, // absolute or relative URL
         *    method: &quot;POST&quot;,   // POST or GET (default)
         *    timeout: 1000,    // {Integer} timeout in ms - default: defaultTimeout
         *    callback: {
         *      fn: obj.method,     // mandatory
         *      scope: obj,         // mandatory
         *      onerror: obj2.method2 // callback error handler - optional - default: Timer error log
         *      onerrorScope: obj2    // optional - default: Timer or scope if onError is provided
         *      args: {x:123}       // optional - default: null
         *    }
         * }
         * When a response is received, the callback function is called with the following arguments:
         * callback(response, callbackArgs)
         * where:
         * [response] { // the structure of response is described in aria.core.CfgBeans.IOAsyncRequestResponseCfg
         *    url: &quot;&quot;,
         *    status: &quot;&quot;,
         *    responseText: &quot;&quot;,
         *    responseXML: XML Object,
         *    error: &quot;&quot; // error description
         * }
         * and callbackArgs == args object in the request callback object
         * </pre>
         *
         * @return {Integer} Request identifier
         */
        asyncFormSubmit : function (request) {
            var isFormId = (aria.utils.Type.isString(request.formId)) ? request.formId : false;
            var isForm = aria.utils.Type.isHTMLElement(request.form);
            var form;

            if (!isFormId && !isForm) {
                this.$logError(this.MISSING_FORM);
                return request.callback.onerror.call(request.callback.scope, request);
            }
            if (isForm) {
                form = request.form;
            } else {
                // TODO: find a solution because we cannot use aria.utils.Dom.getElementById because Dom cannot be a
                // dependency of IO
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

            request.form = form;
            request.formId = form.id;
            return this.asyncRequest(request);
        },

        /**
         * Continue the request started in asyncRequest, after request filters have been called.
         * @param {Object} unused Unused parameter
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} req request (may have been modified by filters)
         * @private
         */
        _afterRequestFilters : function (unused, req) {
            var reqId = req.id;

            this.$raiseEvent({
                name : 'request',
                req : req
            });

            req.beginDownload = (new Date()).getTime();
            // as postData can possibly be changed by filters, we compute the requestSize only after filters have been
            // called:
            /* Backward Compatibility begins here */
            if (req.method == "POST" && req.postData) {
                req.requestSize = req.postData.length;
            }
            /* Backward Compatibility ends here */
            else {
                req.requestSize = ((req.method == "POST" || req.method == "PUT") && req.data) ? req.data.length : 0;
            }

            // PROFILING // req.profilingId = this.$startMeasure(req.url);

            try {
                var cb = {
                    success : this._onsuccess,
                    failure : this._onfailure,
                    timeout : req.timeout,
                    reqId : req.id,
                    scope : this
                };

                this._prepareTransport({
                    req : req,
                    cb : cb,
                    uri : req.url
                });
            } catch (ex) {
                // There was an error in this method - let's create a callback to notify
                // the caller in the same way as for other errors
                aria.core.Timer.addCallback({
                    fn : this._onfailure,
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
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} req Request object as the input parameter of asyncRequest
         * @private
         */
        __normalizeRequest : function (req) {
            this.nbRequests++; // increment before assigning to avoid setting request id 0 (which does not work well
            // with the abort function)
            req.id = this.nbRequests;
            var reqMethods = ["GET", "POST", "PUT", "DELETE", "HEAD", "TRACE", "OPTIONS", "CONNECT", "PATCH"];
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

            if (aria.utils.Array.indexOf(reqMethods, req.method) === -1) {
                return this.$logWarn("The request method %1 is invalid", [req.method]);
            }
            /* Backward Compatibility begins here */
            if (req.method == "POST" && req.postHeader) {
                req.contentTypeHeader = req.postHeader
            }

            if (req.method == "POST" && req.postHeader == null && this.useDefaultPostHeader) {
                req.contentTypeHeader = this.defaultPostHeader;
            }
            /* Backward Compatibility ends here */
            if ((req.method == "PUT" || req.method == "POST") && req.contentTypeHeader == null
                    && this.useDefaultContentTypeHeader) {
                req.contentTypeHeader = this.defaultContentTypeHeader;
            }
        },

        /**
         * Prepare the transport class before going on with the request (make sure it is loaded, through Aria.load).
         * @param {Object} arg object containing the following properties: req (aria.core.CfgBeans.IOAsyncRequestCfg),
         * cb (aria.core.JsObject.Callback) and uri (String)
         */
        _prepareTransport : function (arg) {
            var request = arg.req;
            var reqId = request.id;
            var transport;
            if (request.jsonp) {
                arg.transportCP = this.__jsonp;

                // Generate a callback in this namespace
                request.evalCb = "_jsonp" + reqId;
                this[request.evalCb] = function (json) {
                    this._onJsonPLoad(reqId, json);
                };
                arg.uri += (/\?/.test(arg.uri) ? "&" : "?") + request.jsonp + "=aria.core.IO." + request.evalCb;

                // handle timeout
                // TODO: this code could be moved to JsonP.js
                this._timeOut[reqId] = setTimeout(function () {
                    // Abort this request
                    aria.core.IO.abort(reqId, arg.cb, true);
                }, request.timeout);

            } else if (aria.utils.Type.isHTMLElement(request.form)) {
                arg.transportCP = this.__iframe;
                // handle timeout
                this._timeOut[reqId] = setTimeout(function () {
                    // Abort this request
                    aria.core.IO.abort({
                        reqId : reqId,
                        conn : {
                            status : -1
                        }
                    }, arg.cb, true);
                }, request.timeout);
            } else {
                arg.transportCP = this._getTransport(arg.uri, Aria.$frameworkWindow
                        ? Aria.$frameworkWindow.location
                        : null);
            }
            arg.transportInstance = Aria.getClassRef(arg.transportCP);
            if (arg.transportInstance == null) {
                Aria.load({
                    classes : [arg.transportCP],
                    oncomplete : {
                        fn : this._asyncRequest,
                        args : arg,
                        scope : this
                    }
                });
            } else {
                this._asyncRequest(arg);
            }
        },

        /**
         * Initiates an asynchronous request via the XHR object.
         * @protected
         * @param {Object} arg object containing the following properties: req (aria.core.CfgBeans.IOAsyncRequestCfg),
         * cb (aria.core.JsObject.Callback), uri (String), transportCP (String), transportInstance (Object, may be null)
         */
        _asyncRequest : function (arg) {
            var request = arg.req;
            var callback = arg.cb;
            var reqId = request.id;
            var method = request.method;
            var transport = arg.transportInstance || Aria.getClassRef(arg.transportCP);
            var transportWrapper = transport.$interface("aria.core.transport.ITransports");

            if (!transport.isReady) {
                // Wait for it to be ready
                return transportWrapper.init(reqId);
            }

            // Here we're going to make a request
            this.trafficUp += request.requestSize;

            // Each transaction contains the custom header
            // "X-Requested-With: XMLHttpRequest" to identify the requests origin.
            if (this.useXHRHeader) {
                if (!this._defaultHeaders["X-Requested-With"]) {
                    this._initHeader("X-Requested-With", this.defaultXHRHeader, true);
                }
            }

            if (method === "POST" || method === "PUT") {
                this._initHeader('Content-Type', request.contentTypeHeader);
            }

            transportWrapper.request(reqId, method, arg.uri, callback, request.postData || request.data, request.form);
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
                    // TODO can't we use CORS?
                    return this.__crossDomain;
                }
            }

            // For any other request go for XHR
            return this.__sameDomain;
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
        },

        /**
         * Used to remove any timeouts that remain for a transaction.
         * @param {Number} tId the request id to remove the timeout for.
         * @protected
         */
        _removeTimeOut : function (tId) {
            clearInterval(this._poll[tId]);
            clearTimeout(this._timeOut[tId]);
            delete this._poll[tId];
            delete this._timeOut[tId];
        },

        /**
         * Internal callback called when a response is successfully received
         * @param {Object} connection The connection object
         * @protected
         */
        _onsuccess : function (connection) {
            var req = this.pendingRequests[connection.reqId];
            this.$assert(658, !!req);
            delete this.pendingRequests[connection.reqId];
            this._removeTimeOut(connection.reqId);

            var res = {
                url : req.url,
                status : connection.status,
                responseText : connection.responseText || "",
                responseXML : connection.responseXML,
                responseJSON : connection.responseJSON,
                error : null
                // error description
            };

            req.res = res;
            req.endDownload = (new Date()).getTime();
            // PROFILING // this.$stopMeasure(req.profilingId);
            req.downloadTime = req.endDownload - req.beginDownload;
            req.responseSize = res.responseText.length;
            this.trafficDown += req.responseSize;
            this.nbOKResponses++;
            this.$raiseEvent({
                name : 'response',
                req : req
            });

            if (aria.core.IOFiltersMgr) {
                aria.core.IOFiltersMgr.callFiltersOnResponse(req, {
                    fn : this._afterResponseFilters,
                    scope : this,
                    args : req
                });
            } else {
                this._afterResponseFilters(null, req);
            }
        },

        /**
         * Continue to process a response, after response filters have been called.
         * @param {Object} unused Unused parameter
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} req request (may have been modified by filters)
         * @private
         */
        _afterResponseFilters : function (unused, req) {
            var res = req.res, cb = req.callback;
            if (!cb) {
                this.$logError(this.MISSING_IO_CALLBACK, [res.url]);
            } else if (res.error != null) {
                // an error occured

                // make sure properties are consistent with the error state:
                res.responseText = "";
                res.responseXML = null;
                res.responseJSON = null;

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
                    if (req.expectedResponseType == "text") {
                        if (!res.responseText && res.responseJSON != null) {
                            // convert JSON to text
                            if (aria.utils.Type.isString(res.responseJSON)) {
                                // this case is important for JSON-P services which return a simple string
                                // we simply use that string as text
                                // (could be useful to load templates through JSON-P, for example)
                                res.responseText = res.responseJSON;
                            } else {
                                // really convert the JSON structure to a string
                                res.responseText = aria.utils.Json.convertToJsonString(res.responseJSON);
                            }
                        }
                    } else if (req.expectedResponseType == "json") {
                        if (res.responseJSON == null && res.responseText != null) {
                            // convert text to JSON
                            res.responseJSON = aria.utils.Json.load(res.responseText, this, this.JSON_PARSING_ERROR);
                        }
                    }
                }

                cb.fn.call(cb.scope, res, cb.args);
            }
            req = cb = null;
        },

        /**
         * Internal callback called in case of errors
         * @param {Res or timerCallbackArgs} o
         * @protected
         */
        _onfailure : function (xhrObject) {
            var req = this.pendingRequests[xhrObject.reqId];
            this.$assert(539, !!req);
            delete this.pendingRequests[req.id];
            this._removeTimeOut(req.id);

            var res = {
                url : req.url,
                status : "",
                responseText : "",
                responseXML : null,
                responseJSON : null,
                error : "" // error description
            };
            var args = null, cb = null;
            if (xhrObject.isInternalError) {
                res.error = xhrObject.errDescription;
            } else {
                res.status = xhrObject.status;
                res.error = xhrObject.statusText;
            }
            req.res = res;
            req.endDownload = (new Date()).getTime();
            // PROFILING // this.$stopMeasure(req.profilingId);
            req.downloadTime = req.endDownload - req.beginDownload;
            req.responseSize = (xhrObject.responseText ? xhrObject.responseText.length : 0); // we use the
            // response text for the size info when it is present
            this.trafficDown += req.responseSize;
            this.nbKOResponses++;
            this.$raiseEvent({
                name : 'response',
                req : req
            });

            if (aria.core.IOFiltersMgr) {
                aria.core.IOFiltersMgr.callFiltersOnResponse(req, {
                    fn : this._afterResponseFilters,
                    scope : this,
                    args : req
                });
            } else {
                this._afterResponseFilters(null, req);
            }
        },

        /**
         * Initializes the custom HTTP headers for the each transaction.
         * @param {string} label The HTTP header label
         * @param {string} value The HTTP header value
         * @param {string} isDefault Determines if the specific header is a default header automatically sent with each
         * transaction.
         * @protected
         */
        _initHeader : function (label, value, isDefault) {
            var headerObj = (isDefault) ? this._defaultHeaders : this._httpHeaders;

            headerObj[label] = value;
            if (isDefault) {
                this._hasDefaultHeaders = true;
            } else {
                this._hasHTTPHeaders = true;
            }
        },

        /**
         * Set the HTTP headers for each transaction.
         * @param {object} xhrObject The connection object for the transaction.
         */
        setHeaders : function (xhrObject) {
            var property;
            if (this._hasDefaultHeaders) {
                for (property in this._defaultHeaders) {
                    if (this._defaultHeaders.hasOwnProperty(property)) {
                        xhrObject.setRequestHeader(property, this._defaultHeaders[property]);
                    }
                }
            }

            if (this._hasHTTPHeaders) {
                for (property in this._httpHeaders) {
                    if (this._httpHeaders.hasOwnProperty(property)) {
                        xhrObject.setRequestHeader(property, this._httpHeaders[property]);
                    }
                }

                this._httpHeaders = {};
                this._hasHTTPHeaders = false;
            }
        },

        /**
         * If a transaction is lost due to dropped or closed connections, the failure callback will be fired and this
         * specific condition can be identified by a status property value of 0. If an abort was successful, the status
         * property will report a value of -1.
         * @param {number} tId The Transaction Id
         * @param {boolean} isAbort Determines if the exception case is caused by a transaction abort
         */
        createExceptionObject : function (tId, isAbort, httpStatus) {
            var obj = {
                tId : tId
            };

            if (isAbort) {
                obj.status = this.ABORT_CODE;
                obj.statusText = this.ABORT_ERROR;
            } else {
                obj.status = httpStatus || this.COMM_CODE;
                obj.statusText = this.COMM_ERROR;
            }

            return obj;
        },

        /**
         * Updates the transport to be used for same domain, cross domain, and jsonp requests. Currently transports must
         * be singletons.
         * @param {Object} transports class name and path
         *
         * <pre>
         * aria.core.IO.updateTransport({
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
         * Attempts to interpret the server response and determine whether the transaction was successful, or if an
         * error or exception was encountered.
         * @private
         * @param {Object} xhrObject The connection object
         * @param {Object} callback The user-defined callback object
         * @param {Boolean} isAbort Determines if the transaction was terminated via abort().
         */
        _handleTransactionResponse : function (xhrObject, callback, isAbort) {
            var httpStatus, responseObject, connectionStatus;
            var xdrS = xhrObject.response && xhrObject.response.statusText === 'xdr:success';
            var xdrF = xhrObject.response && xhrObject.response.statusText === 'xdr:failure';
            if (xhrObject.xdr && isAbort) {
                xdrF = true; // set the flag for xdr failure
                isAbort = false; // reset isAbort
            }
            try {
                connectionStatus = xhrObject.conn.status;

                if (xdrS || connectionStatus) {
                    // XDR requests will not have HTTP status defined. The
                    // statusText property will define the response status
                    // set by the Flash transport.
                    httpStatus = connectionStatus || 200;
                } else if (xdrF && !isAbort) {
                    // Set XDR transaction failure to a status of 0, which
                    // resolves as an HTTP failure, instead of an exception.
                    httpStatus = 0;
                } else if (!connectionStatus && xhrObject.conn.responseText) {
                    // Local requests done with ActiveX have undefined state
                    // consider it successfull if it has a response text
                    httpStatus = 200;
                } else if (connectionStatus == 1223) {
                    // Sometimes IE returns 1223 instead of 204
                    httpStatus = 204;
                } else {
                    httpStatus = 13030;
                }
            } catch (e) {

                // 13030 is a custom code to indicate the condition -- in Mozilla/FF --
                // when the XHR object's status and statusText properties are
                // unavailable, and a query attempt throws an exception.
                httpStatus = 13030;
            }

            if (!isAbort && httpStatus >= 200 && httpStatus < 300) {
                responseObject = xhrObject.xdr
                        ? xhrObject.response
                        : this._createResponseObject(xhrObject, callback, httpStatus);
                if (callback && callback.success) {
                    if (!callback.scope) {
                        callback.success(responseObject);
                    } else {
                        // If a scope property is defined, the callback will be fired from
                        // the context of the object.
                        callback.success.apply(callback.scope, [responseObject]);
                    }
                }
            } else {
                // switch (httpStatus) {
                // The following cases are wininet.dll error codes that may be encountered.
                // case 12002 : // Server timeout
                // case 12029 : // 12029 to 12031 correspond to dropped connections.
                // case 12030 :
                // case 12031 :
                // case 12152 : // Connection closed by server.
                // case 13030 : // See above comments for variable status.
                // XDR transactions will not resolve to this case, since the
                // response object is already built in the xdr response. */
                responseObject = this.createExceptionObject(xhrObject.transaction, isAbort, httpStatus);
                responseObject.reqId = callback.reqId;
                if (callback && callback.failure) {
                    if (!callback.scope) {
                        callback.failure(responseObject);
                    } else {
                        callback.failure.apply(callback.scope, [responseObject]);
                    }
                }
            }

            this._releaseObject(xhrObject);
            responseObject = null;
        },

        /**
         * Evaluates the server response, creates and returns the results via its properties. Success and failure cases
         * will differ in the response object's property values.
         * @protected
         * @param {object} xhrObject The connection object
         * @param {callback} callback the callback, that contains the request id
         * @param {Number} status Connection status normalized
         * @return {object}
         */
        _createResponseObject : function (xhrObject, callback, status) {
            var obj = {}, headerObj = {}, i, headerStr, header, delimitPos;

            headerStr = xhrObject.conn.getAllResponseHeaders();

            if (headerStr) {
                header = headerStr.split('\n');
                for (i = 0; i < header.length; i++) {
                    delimitPos = header[i].indexOf(':');
                    if (delimitPos != -1) {
                        headerObj[header[i].substring(0, delimitPos)] = this._trim(header[i].substring(delimitPos + 2));
                    }
                }
            }

            obj.transaction = xhrObject.transaction;
            obj.status = status;
            // Normalize IE's statusText to "No Content" instead of "Unknown".
            obj.statusText = (xhrObject.conn.status == 1223) ? "No Content" : xhrObject.conn.statusText;
            obj.getResponseHeader = headerObj;
            obj.getAllResponseHeaders = headerStr;
            obj.responseText = xhrObject.conn.responseText;
            obj.responseXML = xhrObject.conn.responseXML;

            if (callback) {
                obj.reqId = callback.reqId;
            }

            return obj;
        },

        /**
         * Remove the XHR instance reference and the connection object after the transaction is completed.
         * @protected
         * @param {object} xhrObject The connection object
         */
        _releaseObject : function (xhrObject) {
            if (xhrObject && xhrObject.conn) {
                xhrObject.conn = null;
                xhrObject = null;
            }
        },

        /**
         * Trim a String (remove trailing and leading white spaces)
         * @param {String} string
         * @return {String}
         * @protected
         */
        _trim : function (string) {
            return string.replace(/^\s+|\s+$/g, '');
        },

        /**
         * Method to terminate a transaction, if it has not reached readyState 4.
         * @param {Object or String} xhrObject The connection object returned by asyncRequest or the Request identifier.
         * @param {Object} callback User-defined callback object.
         * @param {String} isTimeout boolean to indicate if abort resulted from a callback timeout.
         * @return {Boolean}
         */
        abort : function (xhrObject, callback, isTimeout) {
            var abortStatus = false;

            if (!xhrObject) {
                return abortStatus;
            }

            var transaction;
            if (xhrObject.conn) {
                if (xhrObject.xhr) {
                    abortStatus = true;

                    transaction = xhrObject.transaction;
                    if (this.__isCallInProgress(xhrObject)) {
                        // Issue abort request
                        xhrObject.conn.abort();
                    } // else the request completed but after the abort timeout (it happens in IE)

                    clearInterval(this._poll[transaction]);
                    delete this._poll[transaction];
                }
            } else {
                abortStatus = true;
                transaction = xhrObject;
                xhrObject = {
                    transaction : transaction
                };
            }

            if (isTimeout) {
                clearTimeout(this._timeOut[transaction]);
                delete this._timeOut[transaction];
            }

            if (abortStatus === true) {
                // Fire global custom event -- abortEvent
                this.$raiseEvent({
                    name : 'abortEvent',
                    o : xhrObject
                });

                this._handleTransactionResponse(xhrObject, callback, true);
            }

            return abortStatus;
        },

        /**
         * Determines if the transaction is still being processed.
         * @param {object} xhrObject The connection object returned by asyncRequest
         * @return {boolean}
         * @private
         */
        __isCallInProgress : function (xhrObject) {
            xhrObject = xhrObject || {};
            // if the XHR object assigned to the transaction has not been dereferenced,
            // then check its readyState status. Otherwise, return false.
            if (xhrObject.xhr && xhrObject.conn) {
                return xhrObject.conn.readyState !== 4 && xhrObject.conn.readyState !== 0;
            } else if (xhrObject && xhrObject.conn) {
                return xhrObject.conn.__isCallInProgress(xhrObject.tId);
            } else {
                return false;
            }
        },

        /**
         * Make a JSON-P request.
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} request Request description
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
         * Callback of the JSON-P request. It is wrapped by a function inside {@see jsonp}
         * @param {String} reqId request identifier
         * @param {Object} json Json response coming from the server
         * @protected
         */
        _onJsonPLoad : function (reqId, json) {
            var request = this.pendingRequests[reqId];
            this.$assert(992, !!request);
            this._removeTimeOut(reqId);
            delete this[request.evalCb];
            this._onsuccess({
                reqId : reqId,
                status : 200,
                responseJSON : json
            });
        }
    }
});