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

(function () {

    var typeUtils = (require("../utils/Type"));
    var __mergeEvents = Aria.__mergeEvents;
    var __clsMgr = (require("./ClassMgr"));
    var __cpt = -1; // last used number to store the key inside the interface
    var __getNextCpt = function () {
        __cpt++;
        return __cpt;
    };

    /**
     * Generate a key that does not exist in the given object.
     * @param {Object} instances Object for which a non-existent key must be generated.
     * @return {String|Number} key which does not exist in instances.
     * @private
     */
    var __generateKey = function (instances) {
        var r = 10000000 * Math.random(); // todo: could be replaced with algo generating keys with numbers and
        // letters
        var key = '' + (r | r); // r|r = equivalent to Math.floor - but faster in old browsers
        while (instances[key]) {
            key += 'x';
        }
        return key;
    };

    /**
     * Map of accepted types for interface members.
     * @type Object
     * @private
     */
    var __acceptedMemberTypes = {
        // When changing a type here, remember to also change aria.core.CfgBeans.ItfMemberXXXCfg
        "Function" : 1,
        "Object" : 1,
        "Interface" : 1
    };

    /**
     * Contains the definition for a function defined in the interface by: function(){}
     * @type Object
     * @private
     */
    var __simpleFunctionDefinition = {
        $type : "Function"
    };

    /**
     * Contains the definition for an array defined in the interface by: []
     * @type Object
     * @private
     */
    var __simpleArrayDefinition = {
        $type : "Object"
    };

    /**
     * Normalize interface member definition in the interface.
     * @param {String|Function|Object|Array} Interface member definition.
     * @return {Object} json object containing at least the $type property.
     * @private
     */
    var __normalizeMember = function (def, classpath, member) {
        var res;
        if (typeUtils.isFunction(def)) {
            // should already be normalized:
            return __simpleFunctionDefinition;
        } else if (typeUtils.isString(def)) {
            res = {
                $type : def
            };
        } else if (typeUtils.isArray(def)) {
            return __simpleArrayDefinition;
        } else if (typeUtils.isObject(def)) {
            res = def;
        } else {
            return null;
        }
        var memberType = res.$type;
        if (!__acceptedMemberTypes[memberType]) {
            // the error is logged later
            return null;
        }
        if (!(require("./JsonValidator")).normalize({
            json : res,
            beanName : "aria.core.CfgBeans.ItfMember" + memberType + "Cfg"
        })) {
            return null;
        }
        return res;
    };

    /**
     * Simple 1 level copy of a map.
     * @param {Object}
     * @return {Object}
     */
    var __copyMap = function (src) {
        var res = {};
        for (var k in src) {
            if (src.hasOwnProperty(k)) {
                res[k] = src[k];
            }
        }
        return res;
    };

    /**
     * Prototype inherited by all interface wrappers.
     * @private
     */
    var __superInterfacePrototype = {
        // To be automatically overriden in sub-interfaces:
        $interface : function () {},
        $destructor : function () {},

        // Event handling functions are implemented (overriden in sub-interfaces) only if events are declared in the
        // interface. Otherwise, calling one of these methods is simply ignored.
        $addListeners : function () {},
        $removeListeners : function () {},
        $unregisterListeners : function () {},
        $on : function () {},

        // Function to automatically show the classpath of the interface (useful when debugging with Firebug):
        toString : function () {
            return "[" + this.$classpath + "]";
        }
    };

    /**
     * Base constructor for interface wrappers.
     * @private
     */
    var __superInterfaceConstructor = function () {};
    __superInterfaceConstructor.prototype = __superInterfacePrototype;

    /*
     * Test whether the __proto__ property is supported, and depending on the result, choose the right implementation of
     * interface wrapper links.
     */
    var __testProtoParent = {
        protoProperty : true
    };
    var __testProtoChild = {};
    __testProtoChild.__proto__ = __testProtoParent;
    var __linkItfWrappers = (__testProtoChild.protoProperty) ? function (pointFrom, pointTo) {
        // pointFrom becomes transparent: set its prototype to be pointTo and remove all properties
        pointFrom.__proto__ = pointTo;
        for (var i in pointFrom) {
            if (pointFrom.hasOwnProperty(i)) {
                delete pointFrom[i];
            }
        }
    } : function (pointFrom, pointTo) {
        // browser does not have __proto__
        // we manually have to implement the same
        var pointFromLinkItfWrappers = pointFrom.__$linkItfWrappers;
        if (pointFromLinkItfWrappers && pointFrom.hasOwnProperty("__$linkItfWrappers")) {
            for (var i = 0, l = pointFromLinkItfWrappers.length; i < l; i++) {
                // make each object directly point to the last object
                __linkItfWrappers.call(this, pointFromLinkItfWrappers[i], pointTo);
            }
        }

        // copy the whole object
        for (var i in pointFrom) {
            if (pointFrom.hasOwnProperty(i)) {
                delete pointFrom[i];
            }
            // if the property is still there (inherited from the parent), override it to be equal to the
            // corresponding property in pointTo:
            if (i in pointFrom) {
                // it is on purpose that there is no hasOwnProperty here, we want to copy
                // the whole prototype
                pointFrom[i] = pointTo[i];
            }
        }
        for (var i in pointTo) {
            // it is on purpose that there is no hasOwnProperty here, we want to copy
            // the whole prototype
            pointFrom[i] = pointTo[i];
        }

        delete pointFrom.__$linkItfWrappers;

        // save inside pointTo that pointFrom is a link to it
        if (!pointTo.hasOwnProperty("__$linkItfWrappers")) {
            pointTo.__$linkItfWrappers = [pointFrom];
        } else {
            pointTo.__$linkItfWrappers.push(pointFrom);
        }
    };
    __testProtoParent = null;
    __testProtoChild = null;

    /**
     * Singleton in charge of interface-related operations. It contains internal methods of the framework which should
     * not be called directly by the application developer.
     * @private
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.core.Interfaces",
        $singleton : true,
        $statics : {
            // ERROR MESSAGES:
            INVALID_INTERFACE_MEMBER : "The '%1' interface has a '%2' member, which does not respect the constraints on interface member names. This member will be ignored.",
            INVALID_INTERFACE_MEMBER_DEF : "Invalid definition for the '%2' member on the '%1' interface. This member will be ignored.",
            BASE_INTERFACE_UNDEFINED : "Super interface for %1 is undefined (%2)",
            WRONG_BASE_INTERFACE : "Super interface for %1 is not properly defined: base interfaces (%2) must be defined through Aria.interfaceDefinition.",
            METHOD_NOT_IMPLEMENTED : "Class '%1' has no implementation of method '%2', required by interface '%3'.",
            WRONG_INTERFACE : "Interface '%1' declared in the $implements section of class '%2' was not properly defined through Aria.interfaceDefinition."
        },
        $prototype : {
            /**
             * Utility function which generates a key that does not exist in the given object.
             * @param {Object} instances Object for which a non-existent key must be generated.
             * @return {String|Number} key which does not exist in instances.
             */
            generateKey : __generateKey,

            /**
             * Links an object to an interface wrapper. Transform the pointFrom object so that calling methods on it is
             * equivalent to calling methods on pointTo. Note that it is possible to call linkItfWrappers in chain, and
             * links are preserved, for example:
             *
             * <pre>
             * linkItfWrappers(objA, objB); // this changes objA to be like objB
             * linkItfWrappers(objB, objC); // this changes both objB and objA so that they are like objC
             * linkItfWrappers(objC, objD); // this changes objC, objB and objA so that they are like objD
             * </pre>
             *
             * It is implemented by changing the __proto__ property on browsers that support it. Otherwise, it is
             * implemented by copying the prototype and keeping a link on the pointFrom object in pointTo.
             * @param {Object} pointFrom object that will be modified to look like pointTo
             * @param {Object} pointTo interface wrapper
             */
            linkItfWrappers : __linkItfWrappers,

            /**
             * Load an interface after its dependencies have been loaded. This method is intended to be called only from
             * Aria.interfaceDefinition. Use Aria.interfaceDefinition to declare an interface.
             * @param {Object} def definition of the interface
             */
            loadInterface : function (def) {
                var classpath = def.$classpath;
                // Initialize the prototype
                var proto; // prototype being created
                var superInterface = null;
                if (def.$extends) {
                    // the prototype must be created from the super interface
                    superInterface = Aria.getClassRef(def.$extends);
                    if (!superInterface) {
                        this.$logError(this.BASE_INTERFACE_UNDEFINED, [classpath, def.$extends]);
                        __clsMgr.notifyClassLoadError(classpath);
                        return;
                    }
                    var parentCstr = superInterface ? superInterface.interfaceDefinition : null;
                    parentCstr = parentCstr ? parentCstr.$noargConstructor : null;
                    if (!parentCstr) {
                        this.$logError(this.WRONG_BASE_INTERFACE, [classpath, def.$extends]);
                        __clsMgr.notifyClassLoadError(classpath);
                        return;
                    }
                    proto = new parentCstr();
                    proto.$interfaces = __copyMap(superInterface.prototype.$interfaces);
                } else {
                    proto = new __superInterfaceConstructor();
                    proto.$interfaces = {};
                }
                proto.$classpath = classpath; // classpath of the interface
                var keyProperty = "__iid" + __getNextCpt();
                // Look into the members of the interface, and divide them into functions or properties
                var itf = def.$interface;
                var methods = []; // builds the string containing the methods of the interface
                var initProperties = []; // builds the string to initialize properties of the interface (objects and
                // arrays)
                var deleteProperties = []; // builds the string to delete properties of the interface (in $destructor)
                for (var member in itf) {
                    if (itf.hasOwnProperty(member)) {
                        if (!Aria.checkJsVarName(member) || __superInterfacePrototype[member]) {
                            this.$logError(this.INVALID_INTERFACE_MEMBER, [classpath, member]);
                            // remove and ignore that member:
                            itf[member] = null;
                            delete itf[member];
                            continue;
                        }
                        var memberValue = __normalizeMember.call(this, itf[member], classpath, member);
                        itf[member] = memberValue;
                        if (memberValue != null) {
                            if (memberValue.$type == "Function") {
                                var asyncParam = memberValue.$callbackParam;
                                if (asyncParam == null) {
                                    asyncParam = "null";
                                }
                                methods.push("p.", member, "=function(){\nreturn i[this.", keyProperty, "].$call('", classpath, "','", member, "',arguments,", asyncParam, ");\n}\n");
                            } else if (memberValue.$type == "Interface") {
                                initProperties.push("this.", member, "=obj.", member, "?obj.", member, ".$interface('", memberValue.$classpath, "'):null;\n");
                                deleteProperties.push("this.", member, "=null;\n");
                            } else if (memberValue.$type == "Object") {
                                initProperties.push("this.", member, "=obj.", member, ";\n");
                                deleteProperties.push("this.", member, "=null;\n");
                            }
                        } else {
                            this.$logError(this.INVALID_INTERFACE_MEMBER_DEF, [classpath, member]);
                            delete itf[member];
                        }
                    }
                }
                // management of events
                // events in the prototype of the interface
                proto.$events = {};
                var parentEvents = false;
                if (superInterface) {
                    parentEvents = __mergeEvents(proto.$events, superInterface.prototype.$events, classpath);
                } else {
                    methods.push("p.$interface=function(a){\nreturn aria.core.Interfaces.getInterface(i[this.", keyProperty, "],a,this);\n};\n");
                }
                if (__mergeEvents(proto.$events, def.$events, classpath) && !parentEvents) {
                    // The parent interface has no event but this interface has events!
                    // We have to add special wrappers for event handling
                    methods.push("p.$addListeners=function(a){\nreturn i[this.", keyProperty, "].$addListeners(a,this);\n};\n");
                    methods.push("p.$onOnce=function(a){\nreturn i[this.", keyProperty, "].$onOnce(a,this);\n};\n");
                    methods.push("p.$removeListeners=function(a){\nreturn i[this.", keyProperty, "].$removeListeners(a,this);\n};\n");
                    methods.push("p.$unregisterListeners=function(a){\nreturn i[this.", keyProperty, "].$unregisterListeners(a,this);\n};\n");
                    methods.push("p.$on=p.$addListeners;\n");
                }
                methods.push("p.$destructor=function(){\n", deleteProperties.join(''), "i[this.", keyProperty, "]=null;\ndelete i[this.", keyProperty, "];\nthis.", keyProperty, "=null;\n", superInterface
                        ? "e.prototype.$destructor.call(this);\n" /* call super interface at the end of the destructor */
                        : "", "};\n");
                var out = [];
                var evalContext = {
                    g : __generateKey,
                    p : proto, // prototype
                    c : null, // constructor (will be set by the evaluated code)
                    e : superInterface
                };
                Aria.nspace(classpath, true);
                out.push("var i={};\nvar evalContext=arguments[2];\nvar g=evalContext.g;\nvar p=evalContext.p;\nvar e=evalContext.e;\nevalContext.c=function(obj){\n", (superInterface
                        ? 'e.call(this,obj);\n'
                        : ''), 'var k=g(i);\ni[k]=obj;\nthis.', keyProperty, '=k;\n', initProperties.join(''), '};\n', methods.join(''), 'Aria.$global.', classpath, '=evalContext.c;\n', 'p=null;\nevalContext=null;\n');
                out = out.join('');
                // alert(out);
                Aria["eval"](out, classpath.replace(/\./g, "/") + "-wrapper.js", evalContext);
                var constructor = evalContext.c;
                proto.$interfaces[classpath] = constructor;
                constructor.prototype = proto;
                constructor.interfaceDefinition = def;
                constructor.superInterface = superInterface;
                def.$noargConstructor = new Function();
                def.$noargConstructor.prototype = proto;
                Aria.$classes.push(constructor);
                __clsMgr.notifyClassLoad(classpath);
            },

            /**
             * This method is intended to be called only from Aria.loadClass for each interface declared in $implements.
             * @param {String} interfaceClasspath Classpath of the interface to apply to the class definition. This
             * interface must already be completely loaded.
             * @param {Object} classPrototype Prototype of the class being loaded.
             * @return {Boolean} false if a fatal error occured, true otherwise
             */
            applyInterface : function (interfaceClasspath, classPrototype) {
                var interfaces = classPrototype.$interfaces;
                if (interfaces && interfaces[interfaceClasspath]) {
                    // the interface was already applied
                    return true;
                }
                var itf = Aria.getClassRef(interfaceClasspath);
                if (!itf.interfaceDefinition) {
                    this.$logError(this.WRONG_INTERFACE, [interfaceClasspath, classPrototype.$classpath]);
                    return false;
                }
                if (itf.superInterface) {
                    // apply the parent interface before this interface
                    if (!this.applyInterface(itf.interfaceDefinition.$extends, classPrototype)) {
                        return false;
                    }
                    // by calling this function, interfaces may have changed, update the variable:
                    interfaces = classPrototype.$interfaces;
                }
                if (!classPrototype.hasOwnProperty("$interfaces")) {
                    // copies the parent map of interfaces before adding this one
                    interfaces = __copyMap(interfaces);
                    classPrototype.$interfaces = interfaces;
                }
                // set on the prototype that the interface is supported:
                interfaces[interfaceClasspath] = itf;
                // copies the events:
                __mergeEvents(classPrototype.$events, itf.interfaceDefinition.$events, classPrototype.$classpath);
                // check that methods of the interface are correctly implemented in the class prototype:
                var itfMembers = itf.interfaceDefinition.$interface;
                for (var member in itfMembers) {
                    if (itfMembers.hasOwnProperty(member) && itfMembers[member].$type == "Function"
                            && !typeUtils.isFunction(classPrototype[member])) {
                        this.$logError(this.METHOD_NOT_IMPLEMENTED, [classPrototype.$classpath, member,
                                interfaceClasspath]);
                        return false;
                    }
                }
                return true;
            },

            /**
             * This method is intended to be called only from $interface (either in aria.core.JsObject or in interface
             * wrappers) Use the $interface method instead of this method. This method retrieves a wrapper object on the
             * given object which only contains the methods and properties defined in the interface.
             * @param {aria.core.JsObject} object Object on which an interface wrapper should be returned.
             * @param {String|Function} itf Classpath of the interface, or constructor of the interface whose wrapper is
             * requested.
             * @param {Object} object Interface wrapper from which the $interface method is called, or null if the
             * method is called from the whole object.
             * @return {Object} interface wrapper on the given object or null if an error occurred. In this case, the
             * error is logged. Especially an error can occur if the object does not support the interface.
             */
            getInterface : function (object, itf, itfWrapper) {
                var classpath;
                var itfConstructor;
                if (typeUtils.isFunction(itf)) {
                    // interface given by its constructor
                    itfConstructor = itf;
                    classpath = itf.interfaceDefinition.$classpath;
                } else if (typeUtils.isString(itf)) {
                    // interface given by its classpath (constructor retrieved later if needed)
                    classpath = itf;
                }
                var interfaces = object.__$interfaces;
                var res;
                // first check if the interface is supported by the interface wrapper, if any:
                if (itfWrapper != null && !itfWrapper.$interfaces[classpath]) {
                    this.$logError(this.INTERFACE_NOT_SUPPORTED, [classpath, itfWrapper.$classpath]);
                    return null;
                }
                // first check if an instance of the interface already exists
                if (interfaces) {
                    res = interfaces[classpath];
                    if (res) {
                        return res;
                    }
                }
                // check if the interface is supported:
                if (!object.$interfaces[classpath]) {
                    this.$logError(this.INTERFACE_NOT_SUPPORTED, [classpath, object.$classpath]);
                    return null;
                }
                if (!itfConstructor) {
                    itfConstructor = Aria.getClassRef(classpath);
                    if (!itfConstructor) {
                        // error is already logged in Aria.getClassRef
                        return null;
                    }
                }
                if (!interfaces) {
                    interfaces = {};
                    object.__$interfaces = interfaces;
                }
                res = new itfConstructor(object);
                interfaces[classpath] = res;
                return res;
            },

            /**
             * This method is intended to be called only from aria.core.JsObject.$dispose. It disposes all the interface
             * wrapper instances created on the given object through getInterface.
             * @param {aria.core.JsObject} object object whose interfaces must be disposed of.
             */
            disposeInterfaces : function (object) {
                // dispose all the interfaces of the given object
                var interfaces = object.__$interfaces;
                if (!interfaces) {
                    // no interface to destroy
                    return;
                }
                for (var i in interfaces) {
                    if (interfaces.hasOwnProperty(i) && interfaces[i].$destructor) {
                        interfaces[i].$destructor();
                        interfaces[i] = null;
                    }
                }
                object.__$interfaces = null;
            }
        }
    });
})();
