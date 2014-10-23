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
var ariaModulesQueuingSimpleSessionQueuing = require("./queuing/SimpleSessionQueuing");
require("./RequestBeans");
var ariaModulesUrlServiceEnvironmentUrlService = require("./urlService/environment/UrlService");
var ariaModulesRequestHandlerEnvironmentRequestHandler = require("./requestHandler/environment/RequestHandler");
var ariaUtilsType = require("../utils/Type");
var ariaCoreIO = require("../core/IO");
var ariaCoreJsonValidator = require("../core/JsonValidator");
var ariaCoreAppEnvironment = require("../core/AppEnvironment");
var ariaUtilsJson = require("../utils/Json");

/**
 * The request Manager class handles the functional requests and manage the URL transport arguments (session id, etc).
 * It also automatically extracts the framework and piggy-back data from the response so that the caller directly
 * receives its data as if it had called IO directly. Note that the URL service of the application environment must be
 * correctly specified.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.modules.RequestMgr",
    $singleton : true,
    $events : {
        "error" : {
            description : "raised when an error occured either a server-side exception or a HTTP error (404, timeout)",
            properties : {
                "requestUrl" : "URL for the request (the URL may have already been modified by some other request filters).",
                "requestObject" : "Request Object given to submitJsonRequest",
                "httpError" : "null if it is not an http error (i.e. a server side exception), otherwise contains information about http error, e.g.: { status: 404, error: 'Not found'}",
                "errorData" : "error structure to be displayed (if it's an HTTP error, it is filled by the framework client-side, or, if the error was server-side, it is the error messageBean returned in the <errors> tag)"
            }
        }
    },
    $constructor : function () {

        /**
         * Session parameters for this request manager (aria.templates.ModuleCtrl can use their own)
         * @type Object
         */
        this.session = {
            /**
             * Name of the session id parameter - if empty, we assume session id is managed through cookies
             * @type String
             */
            paramName : "jsessionid",

            /**
             * Current session id - can be empty if session is not created yet
             * @type String
             */
            id : ""
        };

        /**
         * List of global parameters added automatically to each request
         * @protected
         * @type Array
         */
        this._params = null;

        /**
         * Default action queuing mechanism
         * @type aria.modules.queuing.SimpleSessionQueuing
         */
        this.defaultActionQueuing = new ariaModulesQueuingSimpleSessionQueuing();

        /**
         * Id counter for the requests
         * @protected
         * @type Number
         */
        this._idCounter = 1;

        /**
         * Holds the Url Service Creation implementation instance
         * @protected
         * @type aria.modules.urlService.IUrlService
         */
        this._urlService = null;

        /**
         * Request handler instance attached to the request manager
         * @protected
         * @type aria.modules.requestHandler.IRequestHandler
         */
        this._requestHandler = null;

        // Listen for environment change event
        ariaCoreAppEnvironment.$on({
            changingEnvironment : {
                fn : this.__environmentUpdated,
                scope : this
            },
            environmentChanged : {
                fn : this.__environmentUpdated,
                scope : this
            }
        });
    },
    $destructor : function () {

        this._params = null;

        // dispose handlers attached to the RequestMgr
        if (this._urlService) {
            this._urlService.$dispose();
            this._urlService = null;
        }

        if (this._requestHandler) {
            this._requestHandler.$dispose();
            this._requestHandler = null;
        }

        if (this.defaultActionQueuing) {
            this.defaultActionQueuing.$dispose();
            this.defaultActionQueuing = null;
        }

    },
    $statics : {

        /**
         * "An error occured" status
         * @type Number
         */
        ERROR_STATUS : -1,

        /**
         * "The request will be executed now" status
         * @type Number
         */
        EXECUTE_STATUS : 0,

        /**
         * "The request has been queued" status
         * @type Number
         */
        QUEUE_STATUS : 1,

        /**
         * "The request has been discarded" status
         * @type Number
         */
        DISCARD_STATUS : 2,

        // ERROR MESSAGES:
        INVALID_REQUEST_OBJECT : "Provided request object does not match aria.modules.RequestBeans.RequestObject.",
        FILTER_CREATION_ERROR : "An error occured while creating a Request filter:\nclass: %1",
        INVALID_BASEURL : "The base URL defined in the RequestMgr object is empty or invalid - please check: \nurl: %1",
        MISSING_SERVICESPEC : "Provided request object must contain an actionName or a serviceSpec element",
        CALLBACK_ERROR : "An error occured in the Request manager while processing the callback function.",
        INVALID_URL : "Url for request is invalid: %1",
        DEPENDENCIES_BROKE_SYNC : "Dependencies asynchronous load broke a synchronous request: all the dependencies have to be loaded before: %1"
    },
    $prototype : {

        /**
         * Add a global request parameter that will be sent with each request, or update it if it already exists
         * @param {String} name the parameter name
         * @param {String} value the parameter value
         */
        addParam : function (name, value) {
            if (value == null) { // null or undefined
                return this.removeParam(name);
            }
            if (this._params == null) {
                this._params = [];
            }
            for (var i = 0, length = this._params.length; i < length; i++) {
                var elt = this._params[i];
                if (elt.name === name) {
                    elt.value = encodeURIComponent(value);
                    return;
                }
            }
            this._params.push({
                name : name,
                value : encodeURIComponent(value)
            });
        },

        /**
         * Get global request parameters that match the given name.
         * @param {String} name the parameter name to get
         */
        getParam : function (name) {
            if (name == null || this._params == null) {
                return null;
            }
            for (var i = 0, length = this._params.length; i < length; i++) {
                var elt = this._params[i];
                if (elt.name === name) {
                    return elt.value;
                }
            }
            return null;
        },

        /**
         * Remove global request parameters that match the given name.
         * @param {String} name the parameter name to remove. If omitted, remove all params.
         */
        removeParam : function (name) {
            if (name == null) {
                this._params = null;
            }
            if (this._params == null) {
                return;
            }
            for (var i = 0, length = this._params.length; i < length; i++) {
                var elt = this._params[i];
                if (elt.name === name) {
                    this._params.splice(i, 1);
                    length--;
                }
            }
        },

        /**
         * Submits a JSON request. <br />
         * Note: The requestObject will be called with parameters as specified in RequestBeans, The callback function
         * will be called with 2 arguments:
         * <ol>
         * <li> (aria.modules.RequestBeans:ProcessedResponse) the request result </li>
         * <li> (optional) - the args property of the cb argument</li>
         * </ol>
         * @param {aria.modules.RequestBeans:RequestObject} requestObject Information about the request
         * @param {Object} jsonData JSON object to be sent in POST request inside data value
         * @param {aria.core.CfgBeans:Callback} cb description of the callback function
         * @return {Number} Request status
         */
        submitJsonRequest : function (requestObject, jsonData, cb) {
            try {
                ariaCoreJsonValidator.normalize({
                    json : requestObject,
                    beanName : "aria.modules.RequestBeans.RequestObject"
                }, true);
            } catch (ex) {
                // The request object doesn't match the bean
                this.$logError(this.INVALID_REQUEST_OBJECT, null, requestObject);
                return this.DISCARD_STATUS;
            }

            // set default actionqueuing
            if (!requestObject.actionQueuing) {
                requestObject.actionQueuing = this.defaultActionQueuing;
            }

            // set default session
            if (!requestObject.session) {
                requestObject.session = this.session;
            }

            // set default requestHandler
            if (!requestObject.requestHandler) {
                requestObject.requestHandler = this._requestHandler;
            }

            return requestObject.actionQueuing.pushRequest(requestObject, jsonData, cb);
        },

        /**
         * Return an array of dependencies from used handlers : urlService, requestHandler
         * @param {aria.modules.RequestBeans:RequestObject} requestObject
         * @private
         * @return Array
         */
        __getHandlersDependencies : function (requestObject) {
            var dependencies = [], appEnv = ariaModulesUrlServiceEnvironmentUrlService;
            if (!requestObject.urlService && !this._urlService) {
                var urlServiceCfg = appEnv.getUrlServiceCfg();
                dependencies.push(urlServiceCfg.implementation);
            }
            if (!requestObject.requestHandler && !this._requestHandler) {
                var requestHandlerCfg = ariaModulesRequestHandlerEnvironmentRequestHandler.getRequestHandlerCfg();
                dependencies.push(requestHandlerCfg.implementation);
            }
            return dependencies;
        },

        /**
         * Send an unqueued JSON request. <br />
         * Note: The requestObject will be called with parameters as specified in RequestBeans, The callback function
         * will be called with 2 arguments:
         * <ol>
         * <li> (aria.modules.RequestBeans:ProcessedResponse) the request result </li>
         * <li> (optional) - the args property of the cb argument</li>
         * </ol>
         * @param {aria.modules.RequestBeans:RequestObject} requestObject Information about the request
         * @param {Object} jsonData JSON object to be sent in POST request inside data value
         * @param {aria.core.CfgBeans:Callback} cb description of the callback function
         * @return {Number} requestId, -1 if it fails
         */
        sendJsonRequest : function (requestObject, jsonData, cb) {
            var req = {
                requestObject : requestObject,
                jsonData : jsonData,
                data : null,
                timeout : requestObject.timeout,
                method : "POST"
            }, id = this._idCounter++;

            var dependencies = this.__getHandlersDependencies(requestObject);

            var args = {
                req : req,
                cb : cb,
                id : id,
                session : requestObject.session,
                actionQueuing : requestObject.actionQueuing,
                requestHandler : requestObject.requestHandler,
                syncFlag : false
            };
            Aria.load({
                classes : dependencies,
                oncomplete : {
                    fn : this._onDependenciesReady,
                    scope : this,
                    args : args
                }
            });

            // check if the request has been executed synchronously
            if (!args.syncFlag && requestObject.async === false) {
                this.$logError(this.DEPENDENCIES_BROKE_SYNC, [dependencies]);
            }

            return id;
        },

        /**
         * Internal callback called when dependencies are ready (URL service, request handler...)
         * @protected
         * @param {Object} req, cb, actionqueuing, session
         */
        _onDependenciesReady : function (args) {

            args.syncFlag = true;
            var req = args.req;
            // creates url for request
            var details = this.createRequestDetails(req.requestObject, args.session);
            if (!details || details.url === '') {
                return this.$logError(this.INVALID_URL, ['']);
            }
            req.url = details.url;
            if (details.method) {
                req.method = details.method;
            }

            this._callAsyncRequest(args);
        },

        /**
         * Continue request after request delay.
         * @param {Object} args contains req, cb, actionqueuing, session
         * @protected
         */
        _callAsyncRequest : function (args) {
            var req = args.req;
            var handler = args.requestHandler;
            if (handler == null) {
                handler = this.__getRequestHandler();
            }

            req.data = (req.data == null && req.method == "POST")
                    ? handler.prepareRequestBody(req.jsonData, req.requestObject)
                    : req.data;
            req.headers = handler.getRequestHeaders();
            if (req.requestObject.headers) {
                req.headers = ariaUtilsJson.copy(req.headers, false);
                ariaUtilsJson.inject(req.requestObject.headers, req.headers, false);
            }

            // call the server
            var senderObject = {
                classpath : this.$classpath,
                requestObject : req.requestObject,
                requestData : req.jsonData,

                // the following two properties can be used to communicate from the filters to the RequestMgr and bypass
                // the handler:
                responseData : null,
                responseErrorData : null
            };

            var requestObject = {
                sender : senderObject,
                url : req.url,
                async : (req.requestObject.async !== false),
                method : req.method,
                data : req.data,
                headers : req.headers,
                timeout : req.timeout,
                callback : {
                    fn : this._onresponse,
                    onerror : this._onresponse,
                    scope : this,
                    args : {
                        requestObject : req.requestObject,
                        senderObject : senderObject,
                        cb : args.cb,
                        id : args.id,
                        session : args.session,
                        actionQueuing : args.actionQueuing,
                        requestHandler : handler
                    }
                }
            };
            if (handler.expectedResponseType) {
                requestObject.expectedResponseType = handler.expectedResponseType;
            }
            ariaCoreIO.asyncRequest(requestObject);
        },

        /**
         * Internal method called when a response is received (successful or not)
         * @protected
         * @param {Object} res
         * @param {Object} args path, cb, actionqueuing, session
         */
        _onresponse : function (res, args) {
            // callback args preparation
            var requestObject = args.requestObject, actionQueuing = args.actionQueuing;
            var id = args.id, senderObject = args.senderObject;
            // var cb = args.cb, session = args.session, requestHandler = args.requestHandler

            // starts right now for next item in action queuing
            if (actionQueuing) {
                actionQueuing.handleNextRequest(id);
            }

            // updated resources
            var newRes = {
                requestUrl : res.url,
                requestObject : requestObject,
                responseXML : res.responseXML,
                responseText : res.responseText,
                responseJSON : res.responseJSON,
                status : res.status, // http status (e.g.: 404)
                error : res.error, // contains error message

                // Should we stop supporting the following properties ?
                // These properties can be set by IO filters (through the sender object) to bypass the response handler
                data : senderObject.responseData,
                errorData : senderObject.responseErrorData
            };

            args.res = newRes;

            this._processOnResponse(args);
        },

        /**
         * After delay, use handler to parse the message.
         * @param {Object} args contains path, cb, actionqueuing, session, filterRes, res and potential httpError
         * @protected
         */
        _processOnResponse : function (args) {
            // var cb = args.cb;
            var res = args.res;

            var handler = args.requestHandler;

            // http error > use process failure
            if (res.error) {
                handler.processFailure({
                    error : res.error,
                    status : res.status,
                    responseXML : res.responseXML,
                    responseText : res.responseText,
                    responseJSON : res.responseJSON
                }, {
                    url : args.res.url,
                    session : args.session,
                    requestObject : args.requestObject
                }, {
                    fn : this._callRequestCallback,
                    scope : this,
                    args : args
                });
            } else {
                handler.processSuccess({
                    responseXML : res.responseXML,
                    responseText : res.responseText,
                    responseJSON : res.responseJSON
                }, {
                    url : res.url,
                    session : args.session,
                    requestObject : args.requestObject
                }, {
                    fn : this._callRequestCallback,
                    scope : this,
                    args : args
                });
            }
        },

        /**
         * After handler processing, raise error event if needed and call the callback given when the request was issued
         * @protected
         * @param {aria.modules.RequestBeans:ProcessedResponse} res final resource for the user
         * @param {Object} args
         */
        _callRequestCallback : function (res, args) {

            var resFromFilters = args.res;

            // set final error flag
            if (resFromFilters.errorData) {
                res.error = true;
            }

            // resFromFilters as precedence over handler response
            if (resFromFilters.data) {
                res.data = resFromFilters.data;
            }

            if (resFromFilters.errorData) {
                res.errorData = resFromFilters.errorData;
            }

            if (res.error) {
                var errorEvt = {
                    name : "error",
                    requestUrl : resFromFilters.requestUrl,
                    requestObject : args.requestObject,
                    errorData : res.errorData
                };

                // add HTTP errors if any
                if (resFromFilters.error) {
                    errorEvt.httpError = {
                        error : resFromFilters.error,
                        status : resFromFilters.status
                    };
                }
                this.$raiseEvent(errorEvt);
            }

            // finish by calling the requester callback
            this.$callback(args.cb, res, this.CALLBACK_ERROR);
        },

        /**
         * Internal function used to build the request URL
         * @param {Object} requestObject the request object - see. RequestObject bean
         * @param {Object} session session corresponding to the request (paramName and id)
         * @return {String} the url
         */
        createRequestDetails : function (requestObject, session) {
            var typeUtils = ariaUtilsType;
            var urlService = requestObject.urlService;
            if (!urlService) {
                // If no service is set , it takes from app environment
                urlService = this.__getUrlService();
            }
            this.$assert(434, urlService != null);

            // If not specified the session is the one stored on this
            if (!session) {
                session = this.session;
            }

            // Replace dots by forward slashes in the moduleName passed to actual URL creator
            var moduleName = requestObject.moduleName.replace(/\./g, '\/');

            var url;
            if (typeUtils.isString(requestObject.actionName)) { // We accept also empty strings.
                // If in 'action name' mode

                /* The actionName from the request object can contain url parameters, this has to handled separately and not
                 * by the request interface. */
                var actionSplit = this.__extractActionName(requestObject.actionName);

                // Let the implementation compute the URL
                url = urlService.createActionUrl(moduleName, actionSplit.name, session.id);

            } else if (requestObject.serviceSpec) {
                /* using the 'service specification' mode. No particular URL parameters handling
                 * here, all is under UrlService responsibility */
                url = urlService.createServiceUrl(moduleName, requestObject.serviceSpec, session.id);

            } else {
                // error : one of serviceSpec or actionName must be present
                this.$logError(this.MISSING_SERVICESPEC, [url]);
                return null;
            }

            if (!url || (typeUtils.isObject(url) && !url.url)) {
                this.$logError(this.INVALID_BASEURL, [url]);
                return null;
            }
            if (typeUtils.isString(url)) {
                // if raw string returned, convert it in structured request here
                url = {
                    url : url
                };
            }

            // if not specified, assume POST method (backward-compatibility)
            if (!url.method) {
                url.method = "POST";
            }

            if (requestObject.actionName) {
                // If in 'action name' mode, add the action parameters
                url.url = this.__appendActionParameters(url.url, actionSplit.params);
            }
            // Add the global parameters
            url.url = this.__appendGlobalParams(url.url, this._params);

            return url;
        },

        /**
         * Internal function used to build the request I18N URL. This call is asynchronous as submitJsonRequest. The
         * reason is that it might have to download the urlService implementation class. The final url is added to the
         * arguments passed to the callback
         *
         * <pre>
         *     {
         *         full : // I18n url built by the implementation
         *     }
         * </pre>
         *
         * @param {String} moduleName - the name of the calling module
         * @param {String} the locale to be used
         * @param {aria.core.CfgBeans:Callback} callback Callback called when the full path is ready
         * @return {String} the url
         */
        createI18nUrl : function (moduleName, locale, callback) {
            var urlServiceCfg = ariaModulesUrlServiceEnvironmentUrlService.getUrlServiceCfg();

            Aria.load({
                classes : [urlServiceCfg.implementation],
                oncomplete : {
                    fn : this.__onI18nReady,
                    scope : this,
                    args : {
                        moduleName : moduleName,
                        locale : locale,
                        callback : callback
                    }
                }
            });
        },

        /**
         * Callback for createI18nUrl. It is called when the urlService implementation classpath is downloaded
         * @param {Object} args Arguments passed to the Aria.load
         * @private
         */
        __onI18nReady : function (args) {
            var urlService = this.__getUrlService();
            this.$assert(595, urlService != null);

            var url = urlService.createI18nUrl(args.moduleName, this.session.id, args.locale);

            // Add the global parameters
            url = this.__appendGlobalParams(url, this._params);

            // Add the url to the callback
            // Changing the callback arguments is BAD. Keeping this only for backward compatibility.
            // The right way to pass a result is by using the second parameter of $callback.
            args.callback.args = args.callback.args || {};
            args.callback.args.full = url;

            this.$callback(args.callback, url);
        },

        /**
         * Append the global parameters to a url request path. Global parameters are objects with properties name and
         * value
         * @param {String} requestPath The base requestPath
         * @param {Array} params List of parameters (added through addParam)
         * @return {String} the final requestPath
         * @private
         */
        __appendGlobalParams : function (requestPath, params) {
            if (!params || params.length === 0) {
                // Nothing to do if there are no parameters
                return requestPath;
            }

            // Flatten the array of global parameters
            var flat = [];
            for (var i = 0, len = params.length; i < len; i += 1) {
                var par = params[i];
                // The value is already encoded inside the addParam
                flat.push(par.name + '=' + par.value);
            }

            /*
             * Just in case we want to change it in the future. W3C recommends to use semi columns instead of ampersand
             * http://www.w3.org/TR/1999/REC-html401-19991224/appendix/notes.html#h-B.2.2
             */
            var parametersSeparator = "&";

            var flatString = flat.join(parametersSeparator);

            return this.__appendActionParameters(requestPath, flatString);
        },

        /**
         * Append the action parameters to a url request path. Action parameters are strings
         * @param {String} requestPath The base requestPath
         * @param {String} params String with the parameters
         * @return {String} the final requestPath
         * @private
         */
        __appendActionParameters : function (requestPath, params) {
            requestPath = requestPath || "";

            if (!params) {
                // Nothing to do if there are no parameters
                return requestPath;
            }

            var idx = requestPath.indexOf('?');
            /*
             * Just in case we want to change it in the future. W3C recommends to use semi columns instead of ampersand
             * http://www.w3.org/TR/1999/REC-html401-19991224/appendix/notes.html#h-B.2.2
             */
            var parametersSeparator = "&";

            if (idx > -1) {
                requestPath += parametersSeparator;
            } else {
                requestPath += "?";
            }

            return requestPath + params;
        },

        /**
         * Given an action name extract the request parameters after a question mark
         * @param {String} actionName Action name i.e. "action?par1=2"
         * @return {Object} properties "name" and "params"
         * @private
         */
        __extractActionName : function (actionName) {
            actionName = actionName || "";

            var idx = actionName.indexOf("?");
            var object = {
                name : "",
                params : ""
            };

            if (idx < 0) {
                object.name = actionName;
            } else {
                object = {
                    name : actionName.substring(0, idx),
                    params : actionName.substring(idx + 1)
                };
            }

            return object;
        },

        /**
         * Internal function to get an instance implementation of UrlService
         * @private
         * @return {Object} the instance
         */
        __getUrlService : function () {
            if (!this._urlService) {
                var cfg = ariaModulesUrlServiceEnvironmentUrlService.getUrlServiceCfg(), actionUrlPattern = cfg.args[0], i18nUrlPattern = cfg.args[1];
                var ClassRef = Aria.getClassRef(cfg.implementation);
                this._urlService = new (ClassRef)(actionUrlPattern, i18nUrlPattern);
            }
            return this._urlService;
        },

        /**
         * Internal function to get an instance implementation of RequestHandler
         * @private
         * @return {Object} the instance
         */
        __getRequestHandler : function () {
            if (!this._requestHandler) {
                var cfg = ariaModulesRequestHandlerEnvironmentRequestHandler.getRequestHandlerCfg();
                this._requestHandler = Aria.getClassInstance(cfg.implementation, cfg.args);
            }
            return this._requestHandler;
        },

        /**
         * Listener for the event environmentChanged raised by any environment container
         * (aria.core.environment.Environment)
         * @private
         * @param {Object} evt Event
         */
        __environmentUpdated : function (evt) {
            if (evt.name == "environmentChanged") {
                if (this._urlService) {
                    this._urlService.$dispose();
                    this._urlService = null;
                }

                if (this._requestHandler) {
                    this._requestHandler.$dispose();
                    this._requestHandler = null;
                }
                return;
            }
        }
    }
});
