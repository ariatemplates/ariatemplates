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

    var disposeTag = Aria.FRAMEWORK_PREFIX + 'isDisposed';

    /**
     * Private method to remove interceptors.
     * @param {Object} allInterceptors obj.__$interceptors
     * @param {String} name [mandatory] name interface name
     * @param {Object} scope [optional] if specified, only interceptors with that scope will be removed
     * @param {Function} fn [optional] if specified, only interceptors with that function will be removed
     */
    var __removeInterceptorCallback = function (allInterceptors, name, scope, fn) {
        for (var i in allInterceptors[name]) {
            if (allInterceptors[name].hasOwnProperty(i)) {
                __removeCallback(allInterceptors[name], i, scope, fn);
            }
        }
    };

    /**
     * Private method used to remove callbacks from a map of callbacks associated to a given scope and function
     * @param {Object} callbacksMap map of callbacks, which can be currently: obj._listeners
     * @param {String} name [mandatory] name in the map, may be the event name (if callbacksMap == _listeners)
     * @param {Object} scope [optional] if specified, only callbacks with that scope will be removed
     * @param {Function} fn [optional] if specified, only callbacks with that function will be removed
     * @param {Object} src [optional] if the method is called from an interface wrapper, must be the reference of the
     * interface wrapper. It is used to restrict the callbacks which can be removed from the map.
     * @param {Boolean} firstOnly. if true, remove only first occurence.
     * @private
     */
    var __removeCallback = function (callbacksMap, name, scope, fn, src, firstOnly) {
        if (callbacksMap == null) {
            return; // nothing to remove
        }

        var arr = callbacksMap[name];

        if (arr) {
            var length = arr.length, removeThis = false, cb;
            for (var i = 0; i < length; i++) {
                cb = arr[i];

                // determine if callback should be removed, start with
                // removeThis = true and then set to false if
                // conditions are not met

                // check the interface from which we remove the listener
                removeThis = (!src || cb.src == src)
                        // scope does not match
                        && (!scope || scope == cb.scope)
                        // fn does not match
                        && (!fn || fn == cb.fn);

                if (removeThis) {
                    // mark the callback as being removed, so that it can either
                    // still be called (in case of CallEnd in
                    // interceptors, if CallBegin has been called) or not called
                    // at all (in other cases)
                    cb.removed = true;
                    arr.splice(i, 1);
                    if (firstOnly) {
                        break;
                    } else {
                        i--;
                        length--;
                    }
                }
            }
            if (arr.length === 0) {
                // no listener anymore for this event/interface
                callbacksMap[name] = null;
                delete callbacksMap[name];
            }
        }
    };

    /**
     * Interceptor dispatch function.
     * @param {Object} interc interceptor instance
     * @param {Object} info interceptor parameters
     */
    var __callInterceptorMethod = function (info) {
        var methodName = aria.utils.String.capitalize(info.method);
        var fctRef = this["on" + methodName + info.step];
        if (fctRef) {
            return fctRef.call(this, info);
        }
        fctRef = this["on" + info.method + info.step];
        if (fctRef) {
            return fctRef.call(this, info);
        }
    };

    /**
     * Recursive method to call wrappers. This method should be called with "this" refering to the object whose method
     * is called.
     */
    var __callWrapper = function (args, commonInfo, interceptorIndex) {
        if (interceptorIndex >= commonInfo.nbInterceptors) {
            // end of recursion: call the real method:
            return this[commonInfo.method].apply(this, args);
        }
        var interc = commonInfo.interceptors[interceptorIndex];
        if (interc.removed) {
            // interceptor was removed in the mean time, skip it.
            return __callWrapper.call(this, info.args, commonInfo, interceptorIndex + 1);
        }
        var info = {
            step : "CallBegin",
            method : commonInfo.method,
            args : args,
            cancelDefault : false,
            returnValue : null
        };
        var asyncCbParam = commonInfo.asyncCbParam;
        if (asyncCbParam != null) {
            var callback = {
                fn : __callbackWrapper,
                scope : this,
                args : {
                    info : info,
                    interc : interc,
                    // save previous callback:
                    origCb : args[asyncCbParam]
                }
            };
            args[asyncCbParam] = callback;
            if (args.length <= asyncCbParam) {
                // We do this check and set the length property because the
                // "args" object comes
                // from the JavaScript arguments object, which is not a real
                // array so that the
                // length property is not updated automatically by the previous
                // assignation: args[asyncCbParam] = callback;
                args.length = asyncCbParam + 1;
            }
            info.callback = callback;
        }
        this.$callback(interc, info);
        if (!info.cancelDefault) {
            // call next wrapper or real method:
            try {
                info.returnValue = __callWrapper.call(this, info.args, commonInfo, interceptorIndex + 1);
            } catch (e) {
                info.exception = e;
            }
            info.step = "CallEnd";
            delete info.cancelDefault; // no longer useful in CallEnd
            // call the interceptor, even if it was removed in the mean time (so
            // that CallEnd is always called when
            // CallBegin has been called):
            this.$callback(interc, info);
            if ("exception" in info) {
                throw info.exception;
            }
        }
        return info.returnValue;
    };

    /**
     * Callback wrapper.
     */
    var __callbackWrapper = function (res, args) {
        var interc = args.interc;
        if (interc.removed) {
            // the interceptor was removed in the mean time, call the original callback directly
            return this.$callback(args.origCb, res);
        }
        var info = args.info;
        info.step = "Callback";
        info.callback = args.origCb;
        info.callbackResult = res;
        info.cancelDefault = false;
        info.returnValue = null;
        this.$callback(interc, info);
        if (info.cancelDefault) {
            return info.returnValue;
        }
        return this.$callback(args.origCb, info.callbackResult);
    };

    /**
     * Determines if a method has been intercepted: the interceptor contains on[methodName]CallBegin,
     * on[methodName]Callback, on[methodName]CallEnd.
     * @param {String} methodName the method name that could be intercepted.
     * @param {Object} interceptor contains an intercepting method for the methodName.
     * @return {Boolean} true if method has been intercepted
     */
    var __hasBeenIntercepted = function (methodName, interceptor) {
        var capitalizedMethodName = "on" + aria.utils.String.capitalize(methodName);
        if ((interceptor[capitalizedMethodName + "CallBegin"] || interceptor[capitalizedMethodName + "Callback"] || interceptor[capitalizedMethodName
                + "CallEnd"])
                || (interceptor["on" + methodName + "CallBegin"] || interceptor["on" + methodName + "Callback"] || interceptor["on"
                        + methodName + "CallEnd"])) {
            return true;
        }
        return false;
    };

    /**
     * Adds an interceptor to all methods.
     * @param {Object} interfaceMethods all methods for the interface
     * @param {aria.core.CfgBeans:Callback} interceptor a callback which will receive notifications
     * @return {Object} interceptedMethods
     */
    var __interceptCallback = function (interfaceMethods, interceptor, allInterceptors) {
        var interceptedMethods = allInterceptors || {};
        // for a callback, intercept all methods of an interface
        for (var i in interfaceMethods) {
            if (interfaceMethods.hasOwnProperty(i)) {
                (interceptedMethods[i] || (interceptedMethods[i] = [])).push(interceptor);
            }
        }
        return interceptedMethods;
    };

    /**
     * Targets specific methods to be intercepted.
     * @param {Object} interfaceMethods all methods for the interface
     * @param {Object} interceptor an object/class which will receive notifications
     * @return {Object} interceptedMethods
     */
    var __interceptObject = function (interfaceMethods, interceptor, allInterceptors) {
        var interceptedMethods = allInterceptors || {};
        // for a class object, intercept specific methods
        for (var m in interfaceMethods) {
            if (interfaceMethods.hasOwnProperty(m) && __hasBeenIntercepted(m, interceptor)) {
                (interceptedMethods[m] || (interceptedMethods[m] = [])).push({
                    fn : __callInterceptorMethod,
                    scope : interceptor
                });
            }
        }
        return interceptedMethods;
    };

    /**
     * Base class from which derive all JS classes defined through Aria.classDefinition()
     */
    Aria.classDefinition({
        $classpath : "aria.core.JsObject",
        // JsObject is an exception regarding $constructor and $destructor:
        // it is not necessary to call these methods when extending JsObject
        $constructor : function () {},
        $destructor : function () {
            // tag this instance as disposed.
            this[disposeTag] = true;
        },
        $statics : {
            // ERROR MESSAGES:
            UNDECLARED_EVENT : "undeclared event name: %1",
            MISSING_SCOPE : "scope property is mandatory when adding or removing a listener (event: %1)",
            INTERFACE_NOT_SUPPORTED : "The '%1' interface is not supported on this object (of type '%2').",
            ASSERT_FAILURE : "Assert #%1 failed in %2",
            CALLBACK_ERROR : "An error occurred while processing a callback function: \ncalling class: %1\ncalled class: %2"
        },
        $prototype : {
            /**
             * Prototype init method called at prototype creation time Allows to store class-level objects that are
             * shared by all instances
             * @param {Object} p the prototype object being built
             * @param {Object} def the class definition
             * @param {Object} sdef the superclass class definition
             */
            $init : function (p, def, sdef) {
                p.$on = p.$addListeners; // shortcut
            },

            /**
             * Check that a statement is true - if not an error is raised sample: this.@assert(12,myvar=='XYZ')
             * @param {Integer} id unique id that must be created and passed by the developer to easily track the assert
             * in case of failure
             * @param {Boolean} value value to assert - if not true an error is raised note: doesn't need to be a
             * boolean - as for an if() statement: e.g. this.$assert(1,{}) will return true
             * @return {Boolean} true if assert is OK
             */
            $assert : function (id, value) {
                if (value) {
                    return true;
                }
                this.$logError(this.ASSERT_FAILURE, [id, this.$classpath]);
                return false;
            },

            /**
             * Method to call on any object prior to deletion
             */
            $dispose : function () {
                this.$destructor(); // call $destructor
                // TODO - cleanup object
                if (this._listeners) {
                    this._listeners = null;
                    delete this._listeners;
                }
                if (this.__$interceptors) {
                    this.__$interceptors = null;
                    delete this.__$interceptors;
                }
                if (this.__$interfaces) {
                    aria.core.Interfaces.disposeInterfaces(this);
                }
            },

            /**
             * If profiling util is loaded, save the current timestamp associated to the given message in the
             * Aria.profilingData array. The classpath of this class will also be included in the record.
             * @param {String} message associated to the timestamp
             */
            $logTimestamp : Aria.empty,

            /**
             * Starts a time measure. Returns the id used to stop the measure.
             * @param {String} msg
             * @return {Number} profilingId
             */
            $startMeasure : Aria.empty,

            /**
             * Stops a time measure. If the id is not specified, stop the last measure with this classpath.
             * @param {String} classpath
             * @param {String} id
             */
            $stopMeasure : Aria.empty,

            /**
             * Log a debug message to the logger
             * @param {String} msg the message text
             * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
             * @param {Object} obj An optional object to be inspected in the logged message
             */
            $logDebug : function (msg, msgArgs, obj) {
                // replaced by the true logging function when aria.core.Log is loaded
                return "";
            },

            /**
             * Log an info message to the logger
             * @param {String} msg the message text
             * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
             * @param {Object} obj An optional object to be inspected in the logged message
             */
            $logInfo : function (msg, msgArgs, obj) {
                // replaced by the true logging function when aria.core.Log is loaded
                return "";
            },

            /**
             * Log a warning message to the logger
             * @param {String} msg the message text
             * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
             * @param {Object} obj An optional object to be inspected in the logged message
             */
            $logWarn : function (msg, msgArgs, obj) {
                // replaced by the true logging function when aria.core.Log is loaded
                return "";
            },

            /**
             * Log an error message to the logger
             * @param {String} msg the message text
             * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
             * @param {Object} err The actual JS error object that was created or an object to be inspected in the
             * logged message
             */
            $logError : function (msg, msgArgs, err) {
                // replaced by the true logging function when
                // aria.core.Log is loaded
                // If it's not replaced because the log is never
                // downloaded, at least there will be errors in the
                // console.
                if (Aria.$global.console) {
                    if (typeof msgArgs === "string")
                        msgArgs = [msgArgs];
                    Aria.$global.console.error(msg.replace(/%[0-9]+/g, function (token) {
                        return msgArgs[parseInt(token.substring(1), 10) - 1];
                    }), err);
                }
                return "";
            },

            /**
             * Generic method allowing to call-back a caller in asynchronous processes
             * @param {aria.core.CfgBeans:Callback} cb callback description
             * @param {MultiTypes} res first result argument to pass to cb.fn (second argument will be cb.args)
             * @param {String} errorId error raised if an exception occurs in the callback
             * @return {MultiTypes} the value returned by the callback, or undefined if the callback could not be
             * called.
             */
            $callback : function (cb, res, errorId) {
                try {
                    if (!cb) {
                        return; // callback is sometimes not used
                    }

                    if (cb.$Callback) {
                        return cb.call(res);
                    }

                    // perf optimisation : duplicated code on purpose
                    var scope = cb.scope, callback;
                    scope = scope ? scope : this;
                    if (!cb.fn) {
                        callback = cb;
                    } else {
                        callback = cb.fn;
                    }

                    if (typeof(callback) == 'string') {
                        callback = scope[callback];
                    }

                    var args = (cb.apply === true && cb.args && Object.prototype.toString.apply(cb.args) === "[object Array]")
                            ? cb.args.slice()
                            : [cb.args];
                    var resIndex = (cb.resIndex === undefined) ? 0 : cb.resIndex;

                    if (resIndex > -1) {
                        args.splice(resIndex, 0, res);
                    }

                    return Function.prototype.apply.call(callback, scope, args);
                } catch (ex) {
                    this.$logError(errorId || this.CALLBACK_ERROR, [this.$classpath, (scope) ? scope.$classpath : ""], ex);
                }
            },

            /**
             * Gets a proper signature callback from description given in argument
             * @param {Object|String} cn callback signature
             * @return {Object} callback object with fn and scope
             */
            $normCallback : function (cb) {
                var scope = cb.scope, callback;
                scope = scope ? scope : this;
                if (!cb.fn) {
                    callback = cb;
                } else {
                    callback = cb.fn;
                }

                if (typeof(callback) == 'string') {
                    callback = scope[callback];
                }
                return {
                    fn : callback,
                    scope : scope,
                    args : cb.args,
                    resIndex : cb.resIndex,
                    apply : cb.apply
                };
            },

            /**
             * Display all internal values in a message box (debug and test purpose - usefull on low-end browsers)
             */
            $alert : function () {
                var msg = [], tp;
                msg.push('## ' + this.$classpath + ' ## ');
                for (var k in this) {
                    if (this.hasOwnProperty(k)) {
                        tp = typeof(this[k]);
                        if (tp == 'object' || tp == 'function')
                            msg.push(k += ':[' + tp + ']');
                        else if (tp == 'string')
                            msg.push(k += ':"' + this[k] + '"');
                        else
                            msg.push(k += ':' + this[k]);
                    }
                }
                Aria.$window.alert(msg.join('\n'));
                msg = null;
            },

            /**
             * toString override to ease debugging
             */
            toString : function () {
                return "[" + this.$classpath + "]";
            },

            /**
             * Returns a wrapper containing only the methods of the given interface.
             * @param {String|Function} itf Classpath of the interface or reference to the interface constructor.
             */
            $interface : function (itf) {
                return aria.core.Interfaces.getInterface(this, itf);
            },

            /**
             * Add an interceptor callback on an interface specified by its classpath.
             * @param {String} itf [mandatory] interface which will be intercepted
             * @param {Object|aria.core.CfgBeans:Callback} interceptor either a callback or an object/class which will
             * receive notifications
             */
            $addInterceptor : function (itf, interceptor) {
                // get the interface constructor:
                var itfCstr = this.$interfaces[itf];
                if (!itfCstr) {
                    this.$logError(this.INTERFACE_NOT_SUPPORTED, [itf, this.$classpath]);
                    return;
                }
                var allInterceptors = this.__$interceptors;
                if (allInterceptors == null) {
                    allInterceptors = {};
                    this.__$interceptors = allInterceptors;
                }
                var interceptMethods = (aria.utils.Type.isCallback(interceptor))
                        ? __interceptCallback
                        : __interceptObject;

                var itfs = itfCstr.prototype.$interfaces;
                for (var i in itfs) {
                    if (itfs.hasOwnProperty(i)) {
                        var interceptedMethods = interceptMethods(itfs[i].interfaceDefinition.$interface, interceptor, allInterceptors[i]);
                        allInterceptors[i] = interceptedMethods;
                    }
                }
            },

            /**
             * Remove interceptor callbacks or interceptor objects on an interface.
             * @param {String} itf [mandatory] interface which is intercepted
             * @param {Object} scope [optional] scope of the callbacks/objects to remove
             * @param {Function} fn [optional] function in the callbacks to remove
             */
            $removeInterceptors : function (itf, scope, fn) {
                var itfCstr = this.$interfaces[itf];
                var allInterceptors = this.__$interceptors;
                if (!itfCstr || !allInterceptors) {
                    return;
                }
                var itfs = itfCstr.prototype.$interfaces;
                // also remove the interceptor on all base interfaces of the interface
                for (var i in itfs) {
                    if (itfs.hasOwnProperty(i)) {
                        __removeInterceptorCallback(allInterceptors, i, scope, fn);
                    }
                }
            },

            /**
             * Call a method from this class, taking into account any registered interceptor.
             * @param {String} interfaceName Classpath of the interface in which the method is declared (directly). The
             * actual interface from which this method is called maybe an interface which extends this one.
             * @param {String} methodName Method name.
             * @param {Array} args Array of parameters to send to the method.
             * @param {Number} asyncCbParam [optional] if the method is asynchronous, must contain the index in args of
             * the callback parameter. Should be null if the method is not asynchronous.
             */
            $call : function (interfaceName, methodName, args, asyncCbParam) {
                var interceptors;
                if (this.__$interceptors == null || this.__$interceptors[interfaceName] == null
                        || (interceptors = this.__$interceptors[interfaceName][methodName]) == null) {
                    // no interceptor for that interface: call the method directly:
                    return this[methodName].apply(this, args);
                }
                return __callWrapper.call(this, args, {
                    interceptors : interceptors,
                    nbInterceptors : interceptors.length,
                    method : methodName,
                    asyncCbParam : asyncCbParam
                }, 0);
            },

            /**
             * Adds a listener to the current object
             * @param {Object} lstCfg list of events that are listen to. For each event a config object with the
             * following arguments should be provided:<br/>
             *
             * <pre>
             * fn: {Function} [mandatory] callback function
             * scope: {Object} [mandatory] object on wich the callback will be called
             * args: {Object} [optional] argument object that will be passed to the callback as 2nd argument (1st argument is the event object)
             *      Note: as a shortcut, the function only can be provided (in this case, the scope property has to be used - as in the example below for the 'error' event
             *      Note: if a scope property is defined in the map, it will be used as default for all events. A '*' event name can also be used to listen to all events.
             * </pre>
             *
             * @example
             * Sample call:
             * <pre>
             * <code>
             * o.$addListeners({
             *     'start' : {
             *         fn : this.onStart
             *     },
             *     'end' : {
             *         fn : this.onEnd,
             *         args : {
             *             description : &quot;Sample Callback Argument&quot;
             *         }
             *     },
             *     'error' : this.onError,
             *     scope : this
             * })
             * </code>
             * </pre>
             */
            $addListeners : function (lstCfg, itfWrap) {

                var defaultScope = (lstCfg.scope) ? lstCfg.scope : null;
                var src = itfWrap ? itfWrap : this;
                var lsn;
                for (var evt in lstCfg) {
                    if (!lstCfg.hasOwnProperty(evt)) {
                        continue;
                    }
                    lsn = lstCfg[evt];
                    if (evt == 'scope') {
                        continue;
                    }
                    // The comparison with null below is important, as
                    // an empty string is a valid event description.
                    if (evt != '*' && src.$events[evt] == null) {
                        // invalid event
                        this.$logError(this.UNDECLARED_EVENT, evt, src.$classpath);
                        continue;
                    }
                    if (lsn.$Callback) {
                        lsn = {
                            fn : function (evt, cb) {
                                cb.call(evt);
                            },
                            scope : this,
                            args : lsn
                        };
                    } else if (!lsn.fn) {
                        // shortcut as in 'error' sample
                        if (!defaultScope) {
                            this.$logError(this.MISSING_SCOPE, evt);
                            continue;
                        }
                        lsn = {
                            fn : lsn,
                            scope : defaultScope,
                            once : lstCfg[evt].listenOnce
                            // we keep track of listeners which are meant to be called just once
                        };
                    } else {
                        // make a copy of lsn before changing it
                        lsn = {
                            fn : lsn.fn,
                            scope : lsn.scope,
                            args : lsn.args,
                            once : lstCfg[evt].listenOnce,
                            apply : lsn.apply,
                            resIndex : lsn.resIndex
                            // we keep track of listeners which are meant to be called just once
                        };
                        // lsn is an object as in 'start' or 'end' samples set default scope
                        if (!lsn.scope) {
                            lsn.scope = defaultScope;
                        }
                        if (!lsn.scope) {
                            this.$logError(this.MISSING_SCOPE, evt);
                            continue;
                        }
                    }

                    // add listener to _listeners
                    if (this._listeners == null) {
                        this._listeners = {};
                        this._listeners[evt] = [];
                    } else {
                        if (this._listeners[evt] == null) {
                            this._listeners[evt] = [];
                        }
                    }
                    // keep the interface under which the listener was registered:
                    lsn.src = src;
                    this._listeners[evt].push(lsn);
                }
                defaultScope = lsn = evt = null;
            },

            /**
             * Remove a listener from the listener list
             * @param {Object} lstCfg list of events to disconnect - same as for addListener(), except that scope is
             * mandatory Note: if fn is not provided, all listeners associated to the scope will be removed
             * @param {Object} itfWrap
             */
            $removeListeners : function (lstCfg, itfWrap) {
                if (this._listeners == null) {
                    return;
                }
                var defaultScope = (lstCfg.scope) ? lstCfg.scope : null;
                var lsn;
                for (var evt in lstCfg) {
                    if (!lstCfg.hasOwnProperty(evt)) {
                        continue;
                    }
                    if (evt == 'scope') {
                        continue;
                    }
                    if (this._listeners[evt]) {
                        var lsnRm = lstCfg[evt];
                        if (typeof(lsnRm) == 'function') {
                            if (defaultScope == null) {
                                this.$logError(this.MISSING_SCOPE, evt);
                                continue;
                            }
                            __removeCallback(this._listeners, evt, defaultScope, lsnRm, itfWrap);
                        } else {
                            if (lsnRm.scope == null) {
                                lsnRm.scope = defaultScope;
                            }
                            if (lsnRm.scope == null) {
                                this.$logError(this.MISSING_SCOPE, evt);
                                continue;
                            }
                            __removeCallback(this._listeners, evt, lsnRm.scope, lsnRm.fn, itfWrap, lsnRm.firstOnly);
                        }

                    }
                }
                defaultScope = lsn = lsnRm = null;
            },

            /**
             * Remove all listeners associated to a given scope - if no scope is provided all listeneres will be removed
             * @param {Object} scope the scope of the listeners to remove
             * @param {Object} itfWrap
             */
            $unregisterListeners : function (scope, itfWrap) {
                if (this._listeners == null) {
                    return;
                }
                // We must check itfWrap == null, so that it is not possible to unregister all the events of an object
                // from its interface, if they have not been registered through that interface
                if (scope == null && itfWrap == null) {
                    // remove all events
                    for (var evt in this._listeners) {
                        if (!this._listeners.hasOwnProperty(evt)) {
                            continue;
                        }
                        this._listeners[evt] = null; // remove array
                        delete this._listeners[evt];
                    }
                } else {
                    // note that here, scope can be null (if itfWrap != null) we need to filter all events in this case
                    for (var evt in this._listeners) {
                        if (!this._listeners.hasOwnProperty(evt)) {
                            continue;
                        }
                        __removeCallback(this._listeners, evt, scope, null, itfWrap);
                    }
                }
                evt = null;
            },

            /**
             * Adds a listener to an event, and removes it right after the event has been raised. Please refer to
             * $addListeners() for parameters description
             * @param {Object} lstCfg
             * @param {Object} itfWrap
             */
            $onOnce : function (lstCfg, itfWrap) {
                for (var evt in lstCfg) {
                    if (lstCfg.hasOwnProperty(evt)) {
                        lstCfg[evt].listenOnce = true;
                    }
                }
                this.$addListeners(lstCfg, itfWrap);
            },

            /**
             * Internal method used by sub-classes to raise an event to the object listeners. The event object that will
             * be passed to the listener function will have the following structure:
             *
             * <pre>
             * {
             *      name: evtName,
             *      src: observableObject[someArg1:'xx', ...]
             * }
             * </pre>
             *
             * NOTE: All properties except name and src are specific to the event.
             * @param {String|Object} evtDesc The event description.
             * <p>
             * If provided as a String - evtDesc is the name of the event as specified by the object in
             * <code>$events</code>
             * </p>
             * <p>
             * If provided as a Map - evtDesc is expected to have a name property (for the event name) - all other
             * properties will be considered as event arguments
             * </p>
             * Sample calls:
             *
             * <pre>
             * this.$raiseEvent('load');
             * this.$raiseEvent({
             *     name : 'load',
             *     someProperty : 123
             * });
             * </pre>
             */
            $raiseEvent : function (evtDesc) {
                if (this._listeners == null) {
                    return;
                }
                var nm = '', hasArgs = false;
                if (typeof(evtDesc) == 'string') {
                    nm = evtDesc;
                } else {
                    nm = evtDesc.name;
                    hasArgs = true;
                }
                // The comparison with null below is important, as an empty string is a valid event description.
                if (nm == null || this.$events[nm] == null) {
                    this.$logError(this.UNDECLARED_EVENT, [nm, this.$classpath]);
                } else {
                    // loop on evtName + '*'
                    var evtNames = [nm, '*'], evt = null;
                    var listeners = this._listeners;
                    for (var idx = 0; idx < 2; idx++) {
                        // warning this can be disposed during this call as some events (like 'complete') may be caught
                        // for this purpose also make a copy because a callback could modify this list
                        var lsnList = listeners[evtNames[idx]];
                        if (lsnList) {
                            if (!evt) {
                                // create the event object if we have an event description object, we use it directly to
                                // be able to pass back parameters to the function which called $raiseEvent
                                evt = (hasArgs ? evtDesc : {});
                                evt.name = nm;
                                // the src property of the event is now set differently for each listener, because when
                                // interfaces have events, we do not want the event object to be used to access the
                                // whole object instead of only the interface
                            }
                            // also make a copy because a callback could modify this list
                            lsnList = lsnList.slice(0);

                            var sz = lsnList.length, lsn, src;
                            for (var i = 0; sz > i; i++) {
                                // call listener
                                lsn = lsnList[i];
                                src = lsn.src;
                                // Check lsn.removed because it is possible that the listener is removed while
                                // $raiseEvent is running.
                                // In this case, lsnList still contains the listener, but __removeListeners sets lsn.src
                                // to null
                                // Also check that the event is in src.$events in case idx == 1 because when registering
                                // a listener on '*' from an interface wrapper, the listener must only be called for
                                // events of the interface (not for all the events of the object).
                                // The comparison with null below is important, as an empty string is a valid event
                                // description.
                                if (!lsn.removed && (idx === 0 || src.$events[nm] != null)) {
                                    // update the source of the event (useful if registering an event from an interface)
                                    evt.src = src;

                                    if (lsn.once) {
                                        delete lsn.once;
                                        var rmvCfg = {};
                                        rmvCfg[evt.name] = lsn;

                                        // we must remove the listener before calling it (otherwise there can be
                                        // infinite loops in the framework...)
                                        this.$removeListeners(rmvCfg);
                                    }
                                    this.$callback(lsn, evt);
                                }
                            }
                            // set src to null so that storing the evt object does not grant access to the whole object
                            evt.src = null;
                        }
                    }
                    listeners = lsnList = sz = null;
                }
            }
        }
    });
})();
