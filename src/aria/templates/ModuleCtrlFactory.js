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

(function () {

    var MODULECTRL_ID_PROPERTY = "__$moduleCtrlId";

    // Shortcuts to Aria Templates singletons:
    var typeUtils; // aria.utils.Type
    var appEnv; // aria.core.environment.Environment

    /**
     * Map of all module controller private information. The key in the map is the id of the module controller (stored
     * in the __$moduleCtrlId property of both the whole module controller and its public interface). The value in the
     * map (modulePrivateInfo) is an object containing:
     * <ul>
     * <li>moduleCtrl: public interface of the module controller</li>
     * <li>moduleCtrlPrivate: module controller whole object</li>
     * <li>flowCtrl: public interface of the flow controller</li>
     * <li>flowCtrlPrivate: flow controller whole object</li>
     * <li>subModules: array of all sub-modules of the module (both standard and custom sub-modules). Contains the
     * whole object (and not the interface)</li>
     * <li>subModuleInfos: if the module is a sub-module, this object is non-null and contains the following
     * properties: parentModule (reference to the parent information inside modulesPrivateInfo), customModule (boolean)
     * and subModuleDesc (refpath, initArgs)</li>
     * </ul>
     * @type {Object}
     * @private
     */
    var modulesPrivateInfo = {};

    /**
     * A key generator
     * @private
     * @type Function
     */
    var generateKey = aria.core.Interfaces.generateKey;

    /**
     * Error callback method called if there is a failure while loading the module controller class, or the flow
     * controller class. It is also called if there is an exception in the module controller creation process.
     * @param {Object} args
     * @param {Object} ex exception
     * @private
     */
    var loadModuleError = function (args, ex) {
        if (ex) {
            this.$logError(this.EXCEPTION_CREATING_MODULECTRL, [args.desc.classpath], ex);
        }
        this.$callback(args.cb, {
            error : true
        });
    };

    /**
     * Create a new object, with the given object as its prototype.
     * @param {Object} object object to be the prototype of the new object
     * @return {Object}
     * @private
     */
    var prototypeCopyObject = function (object) {
        var Constr = new Function();
        Constr.prototype = object;
        return new Constr();
    };

    // define here some methods for JSLint.
    var createInstanceAndCheckFlow, createFlowCtrlAndCustomModules, attachListenersAndInit, callFinalCallback, loadSubModules;

    /**
     * Load a module controller. First check if module is available.
     * @param {Object} args loadModuleCtrl state information, which initially contains, or is progressively filled to
     * contain:
     * <ul>
     * <li>desc (aria.templates.CfgBeans.InitModuleCtrl) description</li>
     * <li>cb (aria.core.JsObject.Callback) callback called when module controller creation is finished</li>
     * <li>skipInit (Boolean) whether the init method of the module controller will be called</li>
     * <li>registerListeners (Object) listeners to register on the module controller public interface before calling
     * its init method</li>
     * <li>session (Object) session to set on the module controller before calling the init method</li>
     * <li>recursionCheck (Object) map containing module controller classpaths already loaded in a single call to
     * createModuleCtrl, used to avoid infinite recursion</li>
     * <li>moduleCtrlConstr (Function) constructor of the module controller</li>
     * <li>flowCtrlClasspath (String) flow controller classpath (if any)</li>
     * <li>flowCtrlConstr (Function) constructor of the flow controller (if any)</li>
     * <li>res (Object) object which will be sent to the callback as a result of module controller creation</li>
     * <li>subModuleInfos (Object) if createModuleCtrl is used to load a sub-module, this object contains information
     * about the sub-module (parentModule, customModule and subModuleDesc properties)</li>
     * </ul>
     * @private
     */
    var createModuleCtrl = function (args) {
        var moduleCtrlConstr = Aria.getClassRef(args.desc.classpath);
        if (!moduleCtrlConstr) {
            // try to load the module controller
            Aria.load({
                classes : [args.desc.classpath],
                oncomplete : {
                    args : args,
                    scope : this,
                    fn : createInstanceAndCheckFlow
                },
                onerror : {
                    args : args,
                    scope : this,
                    fn : loadModuleError
                }
            });
        } else {
            args.moduleCtrlConstr = moduleCtrlConstr;
            createInstanceAndCheckFlow.call(this, args);
        }
    };

    /**
     * Creates the module instance, retrieve the flow controller classpath and check if it is available.
     * @param {Object} args loadModuleCtrl state information (see createModuleCtrl for more information)
     * @private
     */
    var createInstanceAndCheckFlow = function (args) {
        try {
            var moduleClasspath = args.desc.classpath;
            var moduleCtrlConstr = args.moduleCtrlConstr;
            if (!moduleCtrlConstr) {
                moduleCtrlConstr = Aria.getClassRef(moduleClasspath);
                args.moduleCtrlConstr = moduleCtrlConstr;
            }

            // Check that the module controller inherits from aria.templates.ModuleCtrl
            if (!(moduleCtrlConstr && typeUtils.isInstanceOf(moduleCtrlConstr.prototype, "aria.templates.ModuleCtrl"))) {
                this.$logError(this.INVALID_MODULE_CTRL, [moduleClasspath]);
                return loadModuleError.call(this, args);
            }

            // creates module instance
            var moduleCtrlPrivate = new args.moduleCtrlConstr(args.desc.constructorArgs);
            args.moduleCtrlPrivate = moduleCtrlPrivate;

            // check if a flow is needed
            if (moduleCtrlPrivate.$hasFlowCtrl) {
                var flowCtrlClasspath = moduleCtrlPrivate.$hasFlowCtrl, flowCtrlConstr;
                // if set to true, use naming convention
                if (flowCtrlClasspath === true) {
                    flowCtrlClasspath = moduleClasspath + "Flow";
                }
                // get customized classpath
                flowCtrlClasspath = appEnv.getFlowCP(flowCtrlClasspath);

                args.flowCtrlClasspath = flowCtrlClasspath;
                flowCtrlConstr = Aria.getClassRef(flowCtrlClasspath);

                if (flowCtrlConstr) {
                    args.flowCtrlConstr = flowCtrlConstr;
                    createFlowCtrlAndCustomModules.call(this, args);
                } else {
                    Aria.load({
                        classes : [flowCtrlClasspath],
                        oncomplete : {
                            args : args,
                            scope : this,
                            fn : createFlowCtrlAndCustomModules
                        },
                        onerror : {
                            args : args,
                            scope : this,
                            fn : loadModuleError
                        }
                    });
                }
            } else {
                createFlowCtrlAndCustomModules.call(this, args);
            }
        } catch (ex) {
            return loadModuleError.call(this, args, ex);
        }
    };

    /**
     * Create flow controller, add it as an interceptor on the module controller, store module informations and load
     * custom sub-modules
     * @param {Object} args loadModuleCtrl state information (see createModuleCtrl for more information)
     * @private
     */
    var createFlowCtrlAndCustomModules = function (args) {
        try {

            var moduleCtrlPrivate = args.moduleCtrlPrivate;
            var moduleCtrl = moduleCtrlPrivate.$publicInterface();

            // create flow if any
            var flowCtrlPrivate, flowCtrl;
            if (args.flowCtrlClasspath) {
                if (!args.flowCtrlConstr) {
                    args.flowCtrlConstr = Aria.getClassRef(args.flowCtrlClasspath);
                }
                // Check that the flow controller inherits from aria.templates.FlowCtrl
                if (!(args.flowCtrlConstr && typeUtils.isInstanceOf(args.flowCtrlConstr.prototype, "aria.templates.FlowCtrl"))) {
                    this.$logError(this.INVALID_FLOW_CTRL, [args.flowCtrlClasspath]);
                    return loadModuleError.call(this, args);
                }

                flowCtrlPrivate = new args.flowCtrlConstr();
                flowCtrlPrivate.setModuleCtrl(moduleCtrl);
                moduleCtrlPrivate.$addInterceptor(moduleCtrlPrivate.$publicInterfaceName, {
                    fn : flowCtrlPrivate.interceptModuleCtrl,
                    scope : flowCtrlPrivate
                });
                flowCtrl = flowCtrlPrivate.$publicInterface();
            }

            // Store information about the new module controller and its flow
            var key = generateKey(modulesPrivateInfo);
            var moduleInfo = {
                moduleCtrlPrivate : moduleCtrlPrivate,
                moduleCtrl : moduleCtrl,
                flowCtrlPrivate : flowCtrlPrivate,
                flowCtrl : flowCtrl,
                subModuleInfos : args.subModuleInfos
            };
            modulesPrivateInfo[key] = moduleInfo;
            // store the key both on the module controller public interface and on the instance
            moduleCtrl[MODULECTRL_ID_PROPERTY] = key;
            moduleCtrlPrivate[MODULECTRL_ID_PROPERTY] = key;

            // creates creation report
            args.res = {
                error : false,
                moduleCtrlPrivate : moduleCtrlPrivate,
                moduleCtrl : moduleCtrl
            };

            // load custom sub modules attached to this module controller
            var customModules = appEnv.getCustomModules(args.desc.classpath);
            if (customModules.length > 0) {
                var recursionCheck = args.recursionCheck;
                if (recursionCheck) {
                    recursionCheck = prototypeCopyObject(recursionCheck);
                } else {
                    recursionCheck = {};
                }
                recursionCheck[args.desc.classpath] = 1;
                loadSubModules.call(this, moduleInfo, customModules, {
                    fn : attachListenersAndInit,
                    scope : this,
                    args : args
                }, true /* custom modules */, recursionCheck /* custom module recursion check */);
            } else {
                attachListenersAndInit.call(this, null, args);
            }
        } catch (ex) {
            return loadModuleError.call(this, args, ex);
        }
    };

    /**
     * Attach listener on the newly created module and call init if needed, otherwise finished with calling the creation
     * callback
     * @param {Object} unused unused parameter
     * @param {Object} args loadModuleCtrl state information (see createModuleCtrl for more information)
     * @private
     */
    var attachListenersAndInit = function (unused, args) {
        try {
            var registerListeners = args.registerListeners;
            if (registerListeners) {
                args.res.moduleCtrl.$on(registerListeners);
            }
            if (args.session) {
                args.res.moduleCtrl.setSession(args.session);
            }
            if (args.skipInit) {
                this.$callback(args.cb, args.res);
            } else {
                var initArgs = args.desc.initArgs;
                if (!initArgs) {
                    initArgs = {};
                }
                args.res.moduleCtrl.init(initArgs, {
                    fn : callFinalCallback,
                    args : args,
                    scope : this
                });
            }
        } catch (ex) {
            return loadModuleError.call(this, args, ex);
        }
    };

    /**
     * After init, call the creation callback.
     * @param {Object} unused unused parameter
     * @param {Object} args loadModuleCtrl state information (see createModuleCtrl for more information)
     * @private
     */
    var callFinalCallback = function (unused, args) {
        this.$callback(args.cb, args.res);
    };

    /**
     * Return module private information linked to the module controller passed as a parameter.
     * @param {Object} moduleCtrl module controller public interface wrapper or whole object
     * @private
     */
    var getModulePrivateInfo = function (moduleCtrl) {
        var k = moduleCtrl[MODULECTRL_ID_PROPERTY];
        var res = modulesPrivateInfo[k];
        if (!res) {
            // we should log the error: a module controller either already disposed or not created through
            // the module controller manager is being used
            aria.templates.ModuleCtrlFactory.$logError(aria.templates.ModuleCtrlFactory.MODULECTRL_BYPASSED_FACTORY, [moduleCtrl.$classpath]);
            return null;
        }
        return res;
    };
    var getModulePrivateInfoMethodRes = getModulePrivateInfo;

    /**
     * Return module private information linked to the module controller passed as a parameter. The parameter is checked
     * to be the module controller whole object (and not only the public interface).
     * @param {Object} moduleCtrlPrivate module controller whole object
     * @private
     */
    var getModulePrivateInfoWithCheck = function (moduleCtrlPrivate, functionName) {
        var res = getModulePrivateInfo(moduleCtrlPrivate);
        if (!res) {
            return null;
        }
        if (res.moduleCtrlPrivate != moduleCtrlPrivate) {
            // notifyModuleCtrlDisposed must only be called with the private module controller
            aria.templates.ModuleCtrlFactory.$logError(aria.templates.ModuleCtrlFactory.EXPECTING_MODULECTRL_PRIVATE, [
                    functionName, moduleCtrlPrivate.$classpath]);
            return null;
        }
        return res;
    };

    /**
     * Helper for putSubModuleAtRefPath. Check the path and create it in the targetObject if it does not exist, and put
     * the element at this path.
     * @private
     * @param {Object} targetObject
     * @param {Object} element
     * @param {Array} pathArray The path decomposed in an array : for 'a.b.c' , will be ['a','b','c']
     * @param {Number} arrayIndex If specified, put the element in an array at the specified path
     * @return {Boolean} true if element already exists
     */
    var putElementAtRefPath = function (targetObject, element, pathArray, arrayIndex) {
        // if refpath contains multiple intermediate objects, let's create them
        var size = pathArray.length, name;
        for (var i = 0; i < size - 1; i++) {
            name = pathArray[i];
            if (targetObject[name] == null) {
                targetObject[name] = {};
            }
            targetObject = targetObject[name];
        }
        name = pathArray[size - 1];

        // reference the module public interface in through the refpath
        var alreadyExists = false;
        if (arrayIndex != null) {
            // element is to be stored in an Array
            if (targetObject[name] == null) {
                targetObject[name] = [];
            }
            targetObject = targetObject[name];
            if (targetObject[arrayIndex]) {
                alreadyExists = true;
            }
            targetObject[arrayIndex] = element;
        } else {
            // direct reference (= no Array)

            if (targetObject[name]) {
                alreadyExists = true;
            }
            targetObject[name] = element;
        }
        return alreadyExists;
    };

    /**
     * Put a sub-module at the correct place in the parent, using the refpath and arrayIndex properties.
     * @param {Object} parentModule parent module private information (modulePrivateInfo)
     * @param {aria.templates.CfgBeans.SubModuleDefinition} subModuleDesc description of the sub-module
     * @param {Object} subModuleCtrl public interface of the sub-module, or null if the module should be removed from
     * refPath
     * @param {Boolean} customModule whether the sub-module is a custom module
     * @private
     */
    var putSubModuleAtRefPath = function (parentModule, subModuleDesc, subModuleCtrl, customModule) {
        var ref = subModuleDesc.refpath;
        var parentPrivate = parentModule.moduleCtrlPrivate;
        var parentData = parentModule.moduleCtrl.getData();
        var parentPublic = parentModule.moduleCtrl; // parents
        var subModuleCtrlData = subModuleCtrl ? subModuleCtrl.getData() : null;
        var refArr;
        if (customModule) {
            // special handling of customModules:
            // - do not split the path
            refArr = [ref];
            // - do not add a reference in moduleCtrlPrivate (the module doesn't know its custom sub-modules)
            parentPrivate = null;
        } else {
            refArr = ref.split('.');
            // get the reference container and check that the module is not
            // already present
            if (ref.charAt(0) == '_') {
                // private module
                // do not add a reference in the public interface or in the data model
                parentData = null;
                parentPublic = null;
            }
        }

        var alreadyExists = false;

        if (parentPrivate) {
            alreadyExists = putElementAtRefPath(parentPrivate, subModuleCtrl, refArr, subModuleDesc.arrayIndex)
                    || alreadyExists;
        }

        if (parentData) {
            alreadyExists = putElementAtRefPath(parentData, subModuleCtrlData, refArr, subModuleDesc.arrayIndex)
                    || alreadyExists;
        }

        if (parentPublic) {
            alreadyExists = putElementAtRefPath(parentPublic, subModuleCtrl, refArr, subModuleDesc.arrayIndex)
                    || alreadyExists;
        }

        if (subModuleCtrl != null && alreadyExists) {
            this.$logError(this.SUBMODULE_REFPATH_ALREADY_USED, [ref, subModuleDesc.classpath,
                    parentModule.moduleCtrlPrivate.$classpath]);
        }
    };

    /**
     * Callback function called when a sub-module has been loaded.
     * @param {Object} subModule
     * @param {Object} args
     * @private
     */
    var subModuleLoaded = function (subModule, args) {
        var common = args.common;
        var subModuleDesc = args.subModuleDesc;
        var subModuleCtrl = subModule.moduleCtrl;
        common.res.subModules[args.subModuleIdx] = subModuleCtrl;
        common.alreadyLoaded++;
        /* there may be an error while loading the sub-module */
        if (subModuleCtrl) {
            var parentModule = common.parentModule;
            var parentSubModules = parentModule.subModules;
            putSubModuleAtRefPath.call(this, parentModule, subModuleDesc, subModuleCtrl, common.customModules);
            if (!parentSubModules) {
                parentModule.subModules = [subModule.moduleCtrlPrivate];
            } else {
                parentSubModules.push(subModule.moduleCtrlPrivate);
            }
        } else {
            var error = args.error || this.SM_CREATION_FAILED;
            common.res.errors++;
            this.$logError(error, [subModuleDesc.refpath, subModuleDesc.classpath,
                    common.parentModule.moduleCtrlPrivate.$classpath]);
        }
        if (common.alreadyLoaded >= common.toBeLoaded) {
            // all sub-modules were loaded successfully, call the callback
            this.$callback(common.cb, common.res);
        }
    };

    /**
     * Method used to load sub-modules.
     * @param {Object} parentModuleInfo parent module private information
     * @param {Array} subModulesDescArray array of sub-modules to be loaded
     * @param {aria.core.JsObject.Callback} cb callback to call when sub-modules are all loaded
     * @param {Boolean} whether sub-modules are custom modules (or standard ones)
     * @param {Object} recursionCheck object in which keys are classpaths. If it is requested to load as a sub-module
     * one of these classpaths, loading this sub-module will fail.
     * @private
     */
    var loadSubModules = function (parentModuleInfo, subModulesDescArray, cb, customModules, recursionCheck) {
        var subModulesDescArrayLength = subModulesDescArray.length;
        if (subModulesDescArrayLength == 0) {
            this.$callback(cb, {
                subModules : [],
                errors : 0
            }); // nothing to do !
            return;
        }
        var moduleCtrlPrivate = parentModuleInfo.moduleCtrlPrivate;
        var args = {
            cb : cb,
            res : {
                // array of sub-modules which were successfully loaded (keep the same indexes as the
                // subModulesDescArray parameter, so that this array contains undefined items for sub-modules which
                // could not be loaded):
                subModules : [],
                // number of sub-modules which could not be loaded:
                errors : 0
            },
            parentModule : parentModuleInfo,
            alreadyLoaded : 0,
            toBeLoaded : subModulesDescArrayLength,
            customModules : customModules
        };
        var subRecursionCheck = null;
        for (var i = 0; i < subModulesDescArrayLength; i++) {
            var subModuleDesc = subModulesDescArray[i];
            var error = false;
            if (customModules && typeUtils.isString(subModuleDesc)) {
                subModuleDesc = {
                    classpath : subModuleDesc,
                    refpath : "custom:" + subModuleDesc
                };
            }
            var classpath = subModuleDesc.classpath;
            if (!aria.core.JsonValidator.check(subModuleDesc, "aria.templates.CfgBeans.SubModuleDefinition")) {
                error = this.INVALID_SM_DEF;
            } else if (customModules && subModuleDesc.refpath.substring(0, 7) != "custom:") {
                error = this.INVALID_CUSTOM_MODULE_REFPATH;
            } else if (recursionCheck && recursionCheck[classpath]) {
                error = this.CUSTOM_MODULES_INFINITE_RECURSION;
            }
            if (error) {
                subModuleLoaded.call(this, {}, {
                    error : error,
                    subModuleIdx : i,
                    subModuleDesc : subModuleDesc,
                    common : args
                });
                continue;
            }
            createModuleCtrl.call(this, {
                recursionCheck : recursionCheck,
                subModuleInfos : {
                    parentModule : parentModuleInfo,
                    customModule : customModules,
                    subModuleDesc : subModuleDesc
                },
                registerListeners : customModules ? null : {
                    "*" : {
                        fn : moduleCtrlPrivate.onSubModuleEvent,
                        scope : moduleCtrlPrivate,
                        args : {
                            smRef : subModuleDesc.refpath
                        }
                    },
                    "beforeDispose" : {
                        fn : moduleCtrlPrivate._onSubModuleBeforeDisposeEvent,
                        scope : moduleCtrlPrivate,
                        args : {
                            smRef : subModuleDesc.refpath
                        }
                    }
                },
                desc : {
                    classpath : classpath,
                    initArgs : subModuleDesc.initArgs,
                    constructorArgs : subModuleDesc.constructorArgs
                },
                // PTR 04583019, 04583019 : forward session (before the init method of the sub-module is called)
                session : parentModuleInfo.moduleCtrlPrivate._session,
                cb : {
                    fn : subModuleLoaded,
                    scope : this,
                    args : {
                        subModuleIdx : i,
                        subModuleDesc : subModuleDesc,
                        common : args
                    }
                }
            });
        }
    };

    /**
     * Callback for module reload (called at the end of loadSubModules).
     * @param {Object} result of sub-module load. Contains a subModules array.
     * @paran {Object} args object containing objectLoading, oldModuleCtrl, oldFlowCtrl and callback
     */
    var reloadModuleCtrlCb = function (res, args) {
        var objectLoading = args.objectLoading;
        var newModuleCtrl = res.subModules[0];
        if (newModuleCtrl) {
            // no error while reloading
            // link the old interface wrapper the new one
            var itfUtils = aria.core.Interfaces;
            itfUtils.linkItfWrappers(args.oldModuleCtrl, newModuleCtrl);

            // do the same for the flow:
            if (args.oldFlowCtrl) {
                var privateInfos = getModulePrivateInfo(newModuleCtrl);
                var newFlowCtrl = privateInfos.flowCtrl;
                if (newFlowCtrl) {
                    itfUtils.linkItfWrappers(args.oldFlowCtrl, newFlowCtrl);
                }
            }
        }
        objectLoading.notifyObjectLoaded(newModuleCtrl);
        objectLoading.$dispose();
        this.$callback(args.callback);
    };

    /**
     * This singleton class manages the initialization and destruction of module controllers and their associated flow
     * controller. Every module controller creation or destruction should pass through this class.
     * @class aria.templates.ModuleCtrlFactory
     */
    Aria.classDefinition({
        $classpath : 'aria.templates.ModuleCtrlFactory',
        $dependencies : ['aria.templates.CfgBeans', 'aria.templates.ObjectLoading',
                'aria.core.environment.Customizations'],
        $singleton : true,
        $constructor : function () {
            typeUtils = aria.utils.Type;
            appEnv = aria.core.environment.Customizations;
        },
        $destructor : function () {
            typeUtils = null;
            appEnv = null;
        },
        $statics : {
            // ERROR MESSAGES:
            INVALID_SM_DEF : "Sub-module load failure: invalid module definition:\nreference: %1,\nclasspath: %2,\nparent class: %3",
            INVALID_CUSTOM_MODULE_REFPATH : "Error : invalid custom module refpath.\nrefpath: %1\nmodule class: %2\nparent class: %3",
            CUSTOM_MODULES_INFINITE_RECURSION : "Error: custom modules infinite recursion detected.\nrefpath: %1\nmodule class: %2\nparent class: %3",
            SM_CREATION_FAILED : "Sub-module creation failed:\nmodule name: %1,\nmodule class: %2\nparent class: %3",
            MODULECTRL_BYPASSED_FACTORY : "Error : module controller is already disposed or was not created using the module controller factory.\nmodule class: %1.",
            INVALID_MODULE_CTRL : "Error: %1 is not a module controller.",
            INVALID_FLOW_CTRL : "Error: %1 is not a flow controller.",
            EXPECTING_MODULECTRL_PRIVATE : "Error: %1 expected the whole module controller and only an interface was provided.\nmodule class: %2",
            EXCEPTION_CREATING_MODULECTRL : "Error: an exception occurred during the process of module controller creation.\nmodule class: %1",
            SUBMODULE_REFPATH_ALREADY_USED : "Sub-module refpath is already used (the existing path was replaced).\nrefpath: %1\nmodule class: %2\nparent class: %3",
            EXCEPTION_SUBMODULE_DISPOSE : "An exception occurred while disposing a sub-module.\nparent module class: %1\nchild module class: %2",
            RELOAD_ONLY_FOR_SUBMODULES : "The module reload feature is only available for sub-modules, and not for root modules.\nmodule class: %1",
            DISPOSE_NOT_SUBMODULE : "Error: disposeSubModule was called with a parameter which is not a sub-module of the current module.\nparent module class: %1\nclass of the parameter: %2"

        },
        $prototype : {
            /**
             * Create a module controller and its corresponding flow controller according to its description object and
             * send in the callback an object. The callback may be called synchronously if the initialization can be
             * done synchronously.
             * @param {aria.templates.CfgBeans.InitModuleCtrl} desc Module controller description
             * @param {aria.core.JsObject.Callback} cb Callback, which will be called with a json object containing the
             * following properties
             * <ul>
             * <li><code>error</code>: (Boolean) if true, there was an error during module controller creation and
             * the error was logged. In this case, the other properties are not defined. Note that if a custom
             * sub-module of this module failed to be loaded, this is not considered as an error in the load of this
             * module (error = false).</li>
             * <li><code>moduleCtrl</code>: the module controller public interface</li>
             * <li><code>moduleCtrlPrivate</code>: the module controller whole object (should only be used for
             * debugging purposes and for the call of the $dispose method)</li>
             * </ul>
             * @param {Boolean} skipInit if true, the init method is not called on the module controller (allows the
             * caller to call it itself, possibly adding itself as a listener before calling the init method)
             */
            createModuleCtrl : function (desc, cb, skipInit) {
                var args = {
                    desc : desc,
                    cb : cb,
                    skipInit : skipInit
                };
                createModuleCtrl.call(this, args);
            },

            /**
             * Dispose a sub-module. This method is intended to be called from
             * <code>aria.templates.ModuleCtrl.disposeSubModule</code> only. Please use that method and not this one
             * if you need to dispose a sub-module.
             * @param {aria.templates.ModuleCtrl} parentModuleCtrlPrivate parent module whole object (not the public
             * interface)
             * @param {aria.templates.IModuleCtrl} childModulePublic public interface of the child module to be disposed
             * @private
             */
            __disposeSubModule : function (parentModuleCtrlPrivate, childModulePublic) {
                var res = getModulePrivateInfo(childModulePublic);
                if (!res) {
                    return;
                }
                var subModuleInfos = res.subModuleInfos;
                if (!subModuleInfos || subModuleInfos.parentModule.moduleCtrlPrivate != parentModuleCtrlPrivate) {
                    this.$logError(this.DISPOSE_NOT_SUBMODULE, [parentModuleCtrlPrivate.$classpath,
                            res.moduleCtrlPrivate.$classpath]);
                    return;
                }
                res.moduleCtrlPrivate.$dispose();
            },

            /**
             * This method should only be called from aria.templates.ModuleCtrl to load sub-modules.
             * @param {aria.templates.ModuleCtrl} moduleCtrlPrivate module controller instance to which child modules
             * should be attached
             * @param {Array} array of type aria.templates.CfgBeans.SubModuleDefinition, giving information about which
             * modules are to be loaded and how.
             * @param {aria.core.JsObject.Callback} cb callback to be called when the load is complete (may have failed,
             * though)
             * @private
             */
            __loadSubModules : function (moduleCtrlPrivate, subModulesArray, cb) {
                var res = getModulePrivateInfoWithCheck(moduleCtrlPrivate, "loadSubModules");
                if (!res) {
                    return this.$callback(cb, {
                        error : true
                    });
                }
                loadSubModules.call(this, res, subModulesArray, cb, false /* these are not custom modules */);
            },

            /**
             * This method should only be called from aria.templates.TemplateCtxt. It returns a link to the
             * getModulePrivateInfo function in the closure, to give access to private information when given a module
             * controller public interface (private information include: the whole module controller object, its flow
             * controller, ...). This method can only be called once, after which it always returns null.
             * @private
             */
            __getModulePrivateInfoMethod : function () {
                var res = getModulePrivateInfoMethodRes;
                getModulePrivateInfoMethodRes = null;
                return res;
            },

            /**
             * Return true if the argument passed is a module controller whole object instance that is reloadable, false
             * otherwise.
             * @param {aria.templates.ModuleCtrl} moduleCtrlPrivate module controller whole object instance.
             * @return {Boolean}
             */
            isModuleCtrlReloadable : function (moduleCtrlPrivate) {
                if (moduleCtrlPrivate == null) {
                    return false;
                }
                var k = moduleCtrlPrivate[MODULECTRL_ID_PROPERTY];
                var res = modulesPrivateInfo[k];
                if (!res) {
                    return false;
                }
                if (res.moduleCtrlPrivate != moduleCtrlPrivate) {
                    return false;
                }
                var subModuleInfos = res.subModuleInfos;
                return (subModuleInfos != null);
            },

            /**
             * Reload a module controller. A module can be dynamically reloaded only if it is a sub-module. To check if
             * a module controller is reloadable, you can use isModuleReloadable.
             * @param {aria.templates.ModuleCtrl} moduleCtrlPrivate module controller instance which is to be reloaded
             * @param {aria.core.JsObject.Callback} cb callback
             */
            reloadModuleCtrl : function (moduleCtrlPrivate, cb) {
                var res = getModulePrivateInfoWithCheck(moduleCtrlPrivate, "reloadModuleCtrl");
                if (!res) {
                    // error is already logged
                    return;
                }
                var subModuleInfos = res.subModuleInfos;
                if (subModuleInfos == null) {
                    this.$logError(this.RELOAD_ONLY_FOR_SUBMODULES, [moduleCtrlPrivate.$classpath]);
                    return;
                }
                var parentModule = subModuleInfos.parentModule;
                this.$assert(668, parentModule != null);

                var oldModuleCtrl = res.moduleCtrl;
                var oldFlowCtrl = res.flowCtrl;
                var classMgr = aria.core.ClassMgr;
                var toBeUnloaded = [moduleCtrlPrivate.$classpath, moduleCtrlPrivate.$publicInterfaceName];
                var flowCtrlPrivate = res.flowCtrlPrivate;
                if (flowCtrlPrivate) {
                    toBeUnloaded[2] = flowCtrlPrivate.$classpath;
                    toBeUnloaded[3] = flowCtrlPrivate.$publicInterfaceName;
                }
                var objectLoading = new aria.templates.ObjectLoading();
                moduleCtrlPrivate.__$reloadingObject = objectLoading;
                moduleCtrlPrivate.$dispose();
                for (var i = 0, l = toBeUnloaded.length; i < l; i++) {
                    classMgr.unloadClass(toBeUnloaded[i], true);
                }
                loadSubModules.call(this, parentModule, [subModuleInfos.subModuleDesc], {
                    fn : reloadModuleCtrlCb,
                    scope : this,
                    args : {
                        objectLoading : objectLoading,
                        oldModuleCtrl : oldModuleCtrl,
                        oldFlowCtrl : oldFlowCtrl,
                        callback : cb
                    }
                }, subModuleInfos.customModule);
            },

            /**
             * This method should only be called from aria.templates.ModuleCtrl when a module controller is disposed, so
             * that its sub-modules and flow can be disposed as well.
             * @param {aria.templates.ModuleCtrl} moduleCtrlPrivate module controller instance which is being disposed
             * @private
             */
            __notifyModuleCtrlDisposed : function (moduleCtrlPrivate) {
                var k = moduleCtrlPrivate[MODULECTRL_ID_PROPERTY];
                var res = getModulePrivateInfoWithCheck(moduleCtrlPrivate, "notifyModuleCtrlDisposed");
                if (!res) {
                    // error is already logged
                    return;
                }
                res.isDisposing = true;
                var subModuleInfos = res.subModuleInfos;
                var parentModule = subModuleInfos ? subModuleInfos.parentModule : null;
                if (parentModule && !parentModule.isDisposing) {
                    // This module is a sub-module and its parent module is not being disposed

                    // remove the module from parent array of sub-modules
                    aria.utils.Array.remove(parentModule.subModules, moduleCtrlPrivate);
                    // remove module controller from refpath:
                    putSubModuleAtRefPath.call(this, parentModule, subModuleInfos.subModuleDesc, null, subModuleInfos.customModule);
                }
                // dispose sub-modules (including custom modules):
                var subModules = res.subModules;
                if (subModules) {
                    for (var i = subModules.length - 1; i >= 0; i--) {
                        try {
                            subModules[i].$dispose();
                        } catch (ex) {
                            // an error when disposing a sub-module must never prevent the parent module to be disposed
                            // (especially if the child module is a custom module)
                            this.$logError(this.EXCEPTION_SUBMODULE_DISPOSE, [moduleCtrlPrivate.$classpath,
                                    subModules[i].$classpath], ex);
                        }
                    }
                    res.subModules = null;
                }
                modulesPrivateInfo[k] = null;
                delete modulesPrivateInfo[k];
                if (res.flowCtrlPrivate) {
                    res.flowCtrlPrivate.$dispose();
                    res.flowCtrlPrivate = null;
                    res.flowCtrl = null;
                }
                res.moduleCtrl = null;
                res.moduleCtrlPrivate = null;
                res.subModuleInfos = null;
            }
        }
    });
})();