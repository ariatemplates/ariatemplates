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
 * Module Controller. Base class for all module controllers.
 * @class aria.templates.ModuleCtrl
 * @extends aria.core.JsObject
 */
Aria.classDefinition({
    $classpath : 'aria.templates.ModuleCtrl',
    $extends : 'aria.templates.PublicWrapper',
    $implements : ["aria.templates.IModuleCtrl"],
    $dependencies : ['aria.utils.Json', 'aria.utils.Type', 'aria.templates.ModuleCtrlFactory',
            'aria.templates.RefreshManager', 'aria.modules.RequestMgr'],
    $constructor : function () {
        this.$PublicWrapper.constructor.call(this);

        /**
         * data model root
         * @protected
         * @type Object
         */
        this._data = {};

        /**
         * Name of the bean that validates this._data
         * @protected
         * @type String
         */
        this._dataBeanName = null;

        /**
         * List of sub-modules (their public interfaces only, does not include custom modules) Note that some items in
         * this list may be undefined in case there were errors while loading sub-modules.
         * @protected
         * @type Array
         */
        this._smList = null;

        /**
         * Resource set for the module
         * @private
         * @type Object
         */
        this.__resources = null;

        /**
         * session corresponding to this module
         * @protected
         * @type Object
         */
        this._session = null;

        /**
         * Handler to use with this module.
         * @implement aria.modules.requestHandler.IRequestHandler
         */
        this.$requestHandler = null;

        /**
         * Object containing the instance and the options for the JSON serializer used in the requests issued by the
         * module
         * @public
         * @type aria.modules.requestHandler.environment.RequestHandlerCfgBeans:RequestJsonSerializerCfg
         */
        this.$requestJsonSerializer = null;

        /* Backward compatability code starts */
        if (this._enableMethodEvents == null) {
            this.$logWarn(this.DEPRECATED_METHOD_EVENTS);
            this._enableMethodEvents = true;
        }
        /* Backward compatability code ends */

        /**
         * The enableMethodEvents is set to true to enable method events (methodCallBegin, methodCallEnd,
         * methodCallback), it is currently defaults to true for backward compatibility and will default to false in a
         * future release.
         * @protected
         * @type Boolean
         */
        this._enableMethodEvents = (this._enableMethodEvents !== true) ? false : this._enableMethodEvents;

        if (this._enableMethodEvents) {
            // Add the interceptor to send generic events
            this.$addInterceptor(this.$publicInterfaceName, {
                fn : this._interceptPublicInterface,
                scope : this
            });
        }

        // listen to subModules
    },
    $destructor : function () {
        this.$raiseEvent({
            name : "beforeDispose",
            reloadingObject : this.__$reloadingObject
        });
        // remove the interceptor added in the constructor
        if (this._enableMethodEvents) {
            this.$removeInterceptors(this.$publicInterfaceName, this, this._interceptPublicInterface);
        }
        this._smLoads = null;
        this._data = null;
        this._resources = null;
        this._smList = null; // sub-modules are disposed in the ModuleCtrlFactory below:
        aria.templates.ModuleCtrlFactory.__notifyModuleCtrlDisposed(this);
        this.$PublicWrapper.$destructor.call(this);
        this.$requestJsonSerializer = null;
    },
    $statics : {
        // ERROR MESSAGES
        INIT_CALLBACK_ERROR : "An error occured while processing a Module init callback in class %1",
        DATA_CONTENT_INVALID : "Content of datamodel does not match databean:\nbean name: %1,\nmodule class: %2",
        DEPRECATED_METHOD_EVENTS : "Generic method events (methodCallBegin, methodCallEnd, methodCallback) will be turned off by default in a future release. If the application relies on those events please set the enableMethodEvents variable to true. To already benefit from performance improvements by disabling them, you can set this variable to false."

    },
    $prototype : {
        /**
         * True if default is to be used, false is no flow controller is needed, and flow controller classpath if a
         * specific classpath has to be used.
         * @type Boolean|String
         */
        $hasFlowCtrl : false,

        /**
         * Classpath of the interface to be used as the public interface of this module controller.
         * @type String
         */
        $publicInterfaceName : "aria.templates.IModuleCtrl",

        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         * @param {Object} def the class definition
         * @param {Object} sdef the superclass class definition
         */
        $init : function (p, def, sdef) {
            p.json = aria.utils.Json; // shortcut
        },

        /**
         * Module initialization method - shall be overridden by sub-classes Note: this method is asynchronous (cf.
         * callback argument)
         * @param {Object} initArgs init argument - actual type is defined by the sub-class
         * @param {aria.core.CfgBeans:Callback} callback the callback description
         */
        init : function (args, cb) {
            // default implementation
            this.$callback(cb, true, this.INIT_CALLBACK_ERROR);
        },

        /**
         * Callback method called each time a method from the public interface is called. It raises the methodCallBegin,
         * methodCallEnd and methodCallback events.
         * @param {Object} info Interceptor info.
         */
        _interceptPublicInterface : function (info) {
            if (info.step == "CallBegin" && !aria.templates.ModuleCtrl.prototype[info.method]) {
                aria.templates.RefreshManager.stop();
            }
            var evt = {
                name : "method" + info.step, /*
                * info.step contains either CallBegin, CallEnd or Callback
                */
                method : info.method
            };
            this.$raiseEvent(evt);

            if (info.step == "CallEnd" && !aria.templates.ModuleCtrl.prototype[info.method]) {
                aria.templates.RefreshManager.resume();
            }
        },

        /**
         * Submit a JSON Request
         * @see aria.modules.RequestMgr.
         * @param {String|Object} targetService, either :
         * <ul>
         * <li> the action path - e.g. 'search' or 'search?x=y'. This path will be automatically concatenated to the
         * module path determined from the class package </li>
         * <li> a 'service specification' structure, understood by the UrlService implementation</li>
         * </ul>
         * @param {Object} jsonData - the data to post to the server
         * @param {aria.core.CfgBeans:Callback} cb the callback
         */
        submitJsonRequest : function (targetService, jsonData, cb) {
            var typeUtils = aria.utils.Type;
            // change cb as an object if a string or a function is passed as a
            // callback
            if (typeUtils.isString(cb) || typeUtils.isFunction(cb)) {
                var ncb = {
                    fn : cb,
                    scope : this
                };
                cb = ncb;
            } else if (typeUtils.isObject(cb) && cb.scope == null) {
                cb.scope = this; // default scope = this
            }

            var wrapCB = {
                fn : this._submitJsonRequestCB,
                scope : this,
                args : {
                    cb : cb
                }
            };
            // Request object constructed with all necessary properties
            var requestObject = {
                moduleName : this.$package,
                session : this._session,
                actionQueuing : null,
                requestHandler : this.$requestHandler,
                urlService : this.$urlService,
                requestJsonSerializer : this.$requestJsonSerializer
            };

            if (typeUtils.isString(targetService)) {
                requestObject.actionName = targetService;
            } else {
                requestObject.serviceSpec = targetService;
            }

            aria.modules.RequestMgr.submitJsonRequest(requestObject, jsonData, wrapCB);
        },

        /**
         * This internal function allows us to wrap the callback argument to submitJsonRequest()
         * @protected
         * @param {Object} res
         * @param {Object} args See this.submitJsonRequest()
         */
        _submitJsonRequestCB : function (res, args) {
            aria.templates.RefreshManager.stop();
            this.$callback(args.cb, res);
            aria.templates.RefreshManager.resume();
        },

        /**
         * Internal callback called anytime a sub-module event is triggered Must be overridden by sub-classes in order
         * to catch sub-module events
         * @param {Object} evt the event object (depends on the submodule event)
         * @param {Object} args some helpful info - e.g. args.smRef (sub-module reference)
         */
        onSubModuleEvent : function (evt, args) {
            // override me!
        },

        /**
         * Internal callback called anytime a "beforeDispose" sub-module event is triggered.
         * @param {Object} evt the event object
         * @param {Object} args some helpful info - e.g. args.smRef (sub-module reference)
         * @protected
         */
        _onSubModuleBeforeDisposeEvent : function (evt, args) {
            var smList = this._smList;
            if (smList) {
                // smList can be null if the module is in the process of being disposed
                for (var i = 0, l = smList.length; i < l; i++) {
                    if (smList[i] == evt.src) {
                        aria.utils.Array.removeAt(smList, i);
                        if (evt.reloadingObject) {
                            evt.reloadingObject.$onOnce({
                                "objectLoaded" : {
                                    scope : this,
                                    fn : this.__onSubModuleReloaded
                                }
                            });
                        }
                        break;
                    }
                }
            }
        },

        /**
         * Internal callback called when a sub-module reload is finished.
         * @param {Object} evt the event object. Contains an object property containing the reloaded module controller
         * (its public interface).
         * @private
         */
        __onSubModuleReloaded : function (evt) {
            if (this._smList) {
                this._smList.push(evt.object);
            }
        },

        /**
         * Asynchrously load, create, initialize and reference sub-modules in the module controller and its data model
         * @param {Array} smList Array of module definition (of type aria.templates.CfgBeans.SubModuleDefinition)
         * @param {aria.core.CfgBeans:Callback} cb
         */
        loadSubModules : function (smList, cb) {
            // sub-module creation is now entirely managed in ModuleCtrlFactory
            // simple shortcut for aria.templates.ModuleCtrlFactory.loadSubModules
            aria.templates.ModuleCtrlFactory.__loadSubModules(this, smList, {
                fn : this.__onLoadSubModulesComplete,
                scope : this,
                args : cb
            });
        },

        /**
         * Internal callback method called when all sub-modules requested in loadSubModules have been loaded.
         * @param {Array} res array of the sub-module public interfaces
         * @param {aria.core.CfgBeans:Callback} cb callback to be called at the end of this method
         * @private
         */
        __onLoadSubModulesComplete : function (res, cb) {
            var subModules = res.subModules;
            if (subModules && subModules.length > 0) {
                if (!this._smList) {
                    this._smList = [];
                }
                this._smList = this._smList.concat(res.subModules);
            }
            this.$callback(cb, res);
        },

        /**
         * Dispose a sub-module.
         * @param {aria.templates.IModuleCtrl} subModuleRef reference to the sub-module to dispose.
         */
        disposeSubModule : function (subModuleRef) {
            aria.templates.ModuleCtrlFactory.__disposeSubModule(this, subModuleRef);
        },

        /**
         * MPI method available on all modules in order to retrieve the module data model
         * @return {Object} the module data model
         */
        getData : function () {
            return this._data;
        },

        /**
         * Set the data in the dataModel
         * @param {Object} data the new Data to set
         * @param {Boolean} merge If true, existing value in this._data will not be overriden
         */
        setData : function (data, merge) {
            this.json.inject(data, this._data, merge);
            if (this._dataBeanName) {
                if (!aria.core.JsonValidator.normalize({
                    json : this._data,
                    beanName : this._dataBeanName
                })) {
                    this.$logError(this.DATA_CONTENT_INVALID, [this._dataBeanName, this.$classpath]);
                }
            }
        },

        /**
         * MPI method available on all modules in order to retrieve the module resource set
         * @return {Object} The module resource set
         */
        getResourceSet : function () {
            if (!this.__resources) {
                if (this.$resources) {
                    this.__resources = {};

                    for (var itm in this.$resources) {
                        if (this.$resources[itm].hasOwnProperty('provider')) {
                            // it's a resource provider: it's in the prototype
                            this.__resources[itm] = this[itm];
                        } else {
                            this.__resources[itm] = (Aria.getClassRef(this.$resources[itm]));
                        }
                    }
                } else {
                    // TODO: Log no resources error
                    return undefined;
                }
            }

            return this.__resources;
        },

        /**
         * MPI method available on all modules in order to retrieve a sub-module data controller
         * @param {Object} dataToFind data object which may correspond to the root of a sub-module data controller
         * @return {Object} the sub-module data controller public interface whose root data model is dataToFind, or
         * this.$publicInterface() if no sub-module have dataToFind as root data model
         */
        getSubModuleCtrl : function (dataToFind) {
            if (this._smList) {
                var sz = this._smList.length;
                for (var i = 0; i < sz; i++) {
                    var subModule = this._smList[i];
                    if (subModule && dataToFind == subModule.getData()) {
                        return subModule;
                    }
                }
            }
            return this.$publicInterface();
        },

        /**
         * MPI method available on all modules in order to register a listener to receive events from this module
         * controller
         * @param {Object} lsn listener to register. Note that JsObject.$callback is not used for performance and error
         * reporting reasons, so that only the form
         *
         * <pre>
         *     {
         *         fn : // {Function},
         *         scope : //{Object},
         *         args : // anything
         *  }
         * </pre>
         *
         * is supported for this callback.
         */
        registerListener : function (lsn) {
            var pw = this.$publicInterface();
            this.$on({
                '*' : lsn
            }, pw);
        },

        /**
         * MPI method available on all modules in order to unregister a listener on this object so that it no longer
         * receives events from this module controller. Note that the lsn object is modified.
         * @param {Object} tpl Scope of the listeners to unregister
         */
        unregisterListeners : function (scope) {
            var pw = this.$publicInterface();
            this.$unregisterListeners(scope, pw);
        },

        /**
         * Set this module and submodules session
         * @param {Object} session object containing paramName and id, the session id
         */
        setSession : function (session) {
            this._session = session;
            if (this._smList) {
                var sz = this._smList.length;
                for (var i = 0; i < sz; i++) {
                    var subModule = this._smList[i];
                    if (subModule) {
                        subModule.setSession(session);
                    }
                }
            }
        }
    }
});
