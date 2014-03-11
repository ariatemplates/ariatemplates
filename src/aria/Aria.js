/* global Aria:true */
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

// Do not remove @class and @singleton annotations, they're required for Aria singleton to appear in API docs.
/**
 * Global Aria object defining the base methods to manage objects, logs and file dependencies.
 * @class Aria
 * @singleton
 */
(function () {

    // If Aria object does not exist, create it
    if (typeof Aria == 'undefined') {
        Aria = {};
    }

    // Will be updated at the build time. This is a magic string, keep in sync with build file.
    Aria.version = 'ARIA-SNAPSHOT';

    // start timestamp
    Aria._start = (new Date()).getTime();

    /**
     * Global object, root of all classpaths. It is defined even when Aria Templates is run in a non-browser environment
     * (for example: Node.js or Rhino).
     * @type Object
     */
    Aria.$global = (function () {
        return this;
    })();

    if (!Aria.$frameworkWindow && Aria.$global.window) {

        /**
         * Window object where the framework is loaded. It is defined only when Aria Templates is run in a browser (as
         * opposed to Aria.$global). It has to be equal to window and not to window.window because the two objects are
         * not equal in IE
         * @type Object
         */

        Aria.$frameworkWindow = Aria.$global;
    }

    /**
     * Window object where templates should be displayed and user interaction should be done. This variable can be set
     * directly before loading the framework (through <code>Aria = {$window: ...};</code>). However, once the
     * framework is loaded, it must be changed only through <code>aria.utils.AriaWindow.setWindow</code>.
     * @type Object
     */
    Aria.$window = Aria.$window || Aria.$frameworkWindow;

    /**
     * List of Js reserved words used to check namespace (some browsers do not accept these words in JSON keys)
     * @type Map
     * @private
     */
    var __JS_RESERVED_WORDS = {
        "_abstract" : 1,
        "_boolean" : 1,
        "_break" : 1,
        "_byte" : 1,
        "_case" : 1,
        "_catch" : 1,
        "_char" : 1,
        "_class" : 1,
        "_const" : 1,
        "_continue" : 1,
        "_debugger" : 1,
        "_default" : 1,
        "_delete" : 1,
        "_do" : 1,
        "_double" : 1,
        "_else" : 1,
        "_enum" : 1,
        "_export" : 1,
        "_extends" : 1,
        "_false" : 1,
        "_final" : 1,
        "_finally" : 1,
        "_float" : 1,
        "_for" : 1,
        "_function" : 1,
        "_goto" : 1,
        "_if" : 1,
        "_implements" : 1,
        "_import" : 1,
        "_in" : 1,
        "_instanceof" : 1,
        "_int" : 1,
        "_interface" : 1,
        "_long" : 1,
        "_native" : 1,
        "_new" : 1,
        "_null" : 1,
        "_package" : 1,
        "_private" : 1,
        "_protected" : 1,
        "_public" : 1,
        "_return" : 1,
        "_short" : 1,
        "_static" : 1,
        "_super" : 1,
        "_switch" : 1,
        "_synchronized" : 1,
        "_this" : 1,
        "_throw" : 1,
        "_throws" : 1,
        "_transient" : 1,
        "_true" : 1,
        "_try" : 1,
        "_typeof" : 1,
        "_var" : 1,
        "_void" : 1,
        "_volatile" : 1,
        "_while" : 1,
        "_with" : 1,
        "_constructor" : 1, // Addition to ECMA list
        "_prototype" : 1
        // Addition to ECMA list
    };

    // ERROR MESSAGES:
    Aria.NULL_CLASSPATH = "$classpath argument (or both $class and $package arguments) is mandatory and must be a string.";
    Aria.INVALID_NAMESPACE = "Invalid namespace: %1";
    Aria.INVALID_DEFCLASSPATH = "Invalid definition classpath: %1";
    Aria.INVALID_CLASSNAME_FORMAT = "%2Invalid class name : '%1'. Class name must be a string and start with a capital case.";
    Aria.INVALID_CLASSNAME_RESERVED = "%2Invalid class name: '%1'. Class name must be a string cannot be a reserved word.";
    Aria.INVALID_PACKAGENAME_FORMAT = "%2Invalid package name : '%1'. Package name must be a string must start with a small case.";
    Aria.INVALID_PACKAGENAME_RESERVED = "%2Invalid package name: '%1'. Package name must be a string cannot be a reserved word.";
    Aria.INSTANCE_OF_UNKNOWN_CLASS = "Cannot create instance of class '%1'";
    Aria.DUPLICATE_CLASSNAME = "class names in a class hierarchy must be different: %1";
    Aria.WRONG_BASE_CLASS = "super class for %1 is not properly defined: base classes (%2) must be defined through Aria.classDefinition()";
    Aria.BASE_CLASS_UNDEFINED = "super class for %1 is undefined (%2)";
    Aria.INCOHERENT_CLASSPATH = "$class or $package is incoherent with $classpath";
    Aria.INVALID_INTERFACES = "Invalid interface definition in Class %1";
    // for constructors or destructors
    Aria.PARENT_NOTCALLED = "Error: the %1 of %2 was not called in %3.";
    // for constructors or destructors
    Aria.WRONGPARENT_CALLED = "Error: the %1 of %2 was called instead of %3 in %4.";
    Aria.REDECLARED_EVENT = "Redeclared event name: %1 in %2";
    Aria.INVALID_EXTENDSTYPE = "Invalid $extendsType property for class %1.";
    Aria.TEXT_TEMPLATE_HANDLE_CONFLICT = "Template error: can't load text template '%1' defined in '%2'. A macro, a library, a resource, a variable or another text template has already been declared with the same name.";
    Aria.RESOURCES_HANDLE_CONFLICT = "Template error: can't load resources '%1' defined in '%2'. A macro, a library, a text template, a variable or another resource has already been declared with the same name.";
    Aria.CANNOT_EXTEND_SINGLETON = "Class %1 cannot extend singleton class %2";
    Aria.FUNCTION_PROTOTYPE_RETURN_NULL = "Prototype function of %1 cannot returns null";
    Aria.TPLSCRIPT_INSTANTIATED_DIRECTLY = "Template scripts can not be instantiated directly";

    Aria.$classpath = "Aria";
    /**
     * Log a debug message to the logger
     * @param {String} msg the message text
     * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
     * @param {Object} obj An optional object to be inspected in the logged message
     */
    Aria.$logDebug = function () {
        // replaced by the true logging function when aria.core.Log is loaded
    };

    /**
     * Log an info message to the logger
     * @param {String} msg the message text
     * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
     * @param {Object} obj An optional object to be inspected in the logged message
     */
    Aria.$logInfo = function () {
        // replaced by the true logging function when aria.core.Log is loaded
    };

    /**
     * Log a warning message to the logger
     * @param {String} msg the message text
     * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
     * @param {Object} obj An optional object to be inspected in the logged message
     */
    Aria.$logWarn = function () {
        // replaced by the true logging function when aria.core.Log is loaded
    };

    /**
     * Log an error message to the logger
     * @param {String} msg the message text
     * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
     * @param {Object} err The actual JS error object that was created or an object to be inspected in the logged
     * message
     */
    Aria.$logError = function () {
        // replaced by the true logging function when aria.core.Log is loaded
    };

    /**
     * Classpath validation method
     * @param {String} path class path to validate - e.g. 'aria.jsunit.TestSuite'
     * @param {String} context additional context information
     * @return {Boolean} true if class path is OK
     */
    var __checkClasspath = function (path, context) {
        if (!path || typeof(path) != 'string') {
            Aria.$logError(Aria.NULL_CLASSPATH);
            return false;
        }
        var classpathParts = path.split('.'), nbParts = classpathParts.length;
        for (var index = 0; index < nbParts - 1; index++) {
            if (!__checkPackageName(classpathParts[index], context)) {
                return false;
            }
        }
        if (!__checkClassName(classpathParts[nbParts - 1], context)) {
            return false;
        }
        return true;
    };

    /**
     * Class name validation method
     * @param {String} className class name to validate - e.g. 'TestSuite'
     * @param {String} context additional context information
     * @return {Boolean} true if class path is OK
     */
    var __checkClassName = function (className, context) {
        context = context || '';
        if (!className || !className.match(/^[_A-Z]\w*$/)) {
            Aria.$logError(Aria.INVALID_CLASSNAME_FORMAT, [className, context]);
            return false;
        }
        if (Aria.isJsReservedWord(className)) {
            Aria.$logError(Aria.INVALID_CLASSNAME_RESERVED, [className, context]);
            return false;
        }
        return true;
    };

    /**
     * Package name validation method
     * @param {String} packageName package name to validate - e.g. 'TestSuite'
     * @param {String} context additional context information
     * @return {Boolean} true if class path is OK
     */
    var __checkPackageName = function (packageName, context) {
        context = context || '';
        if (!packageName) {
            Aria.$logError(Aria.INVALID_PACKAGENAME_FORMAT, [packageName, context]);
            return false;
        }
        if (Aria.isJsReservedWord(packageName)) {
            Aria.$logError(Aria.INVALID_PACKAGENAME_RESERVED, [packageName, context]);
            return false;
        }
        if (!packageName.match(/^[a-z]\w*$/)) {
            Aria.$logInfo(Aria.INVALID_PACKAGENAME_FORMAT, [packageName, context]);
        }
        return true;
    };

    /**
     * Shortcut to the class manager
     * @private
     * @type aria.core.ClassMgr
     */
    var __clsMgr = null; // TODO: delete on dispose

    /**
     * Number of object creations (used only when Aria.memCheckMode==true).
     * @private
     * @type Number
     */
    var __nbConstructions = 0;

    /**
     * Number of object destructions (used only when Aria.memCheckMode==true).
     * @private
     * @type Number
     */
    var __nbDestructions = 0;

    /**
     * List of objects that were created but not disposed (used only when Aria.memCheckMode==true).
     * @private
     * @type Object
     */
    var __objects = {};

    /**
     * Temporary cache of classes which have declared providers which have not have been loaded yet.
     * @private
     * @type Object
     */
    var __classMemo = {};

    /**
     * TODOC
     * @type Array
     */
    var syncProviders = [];

    /**
     * Wrapper function for constructors or destructors on an object. It is used only when Aria.memCheckMode==true. When
     * the constructor or destructor of an object is called, this function is called, and this function calls the
     * corresponding constructor or destructor in the object definition and check that it calls its parent constructor
     * or destructor.
     * @private
     * @param {Object} object
     * @param {Object} definition object definition whose constructor should be called
     * @param {Object} superclass superclass
     * @param {String} fn May be "$constructor" or "$destructor".
     * @param {Array} params Array of parameters to be given to the $constructor; should be empty when fn=="$destructor"
     * return true if it was the first call
     */
    var __checkInheritanceCalls = function (obj, def, superclass, fn, params) {
        var newcall = (!obj["aria:nextCall"]);
        if (!newcall && obj["aria:nextCall"] != def.$classpath) {
            Aria.$logError(Aria.WRONGPARENT_CALLED, [fn, def.$classpath, obj["aria:nextCall"], obj.$classpath]);
        }
        obj["aria:nextCall"] = (superclass ? superclass.classDefinition.$classpath : null);
        if (def[fn]) {
            def[fn].apply(obj, params);
        } else if (superclass && fn == "$destructor") {
            // no destructor: must call the parent destructor, by default
            superclass.prototype.$destructor.apply(obj, params);
        }
        if (obj["aria:nextCall"] && obj["aria:nextCall"] != "aria.core.JsObject") {
            Aria.$logError(Aria.PARENT_NOTCALLED, [fn, obj["aria:nextCall"], def.$classpath]);
        }
        if (newcall) {
            obj["aria:nextCall"] = undefined;
        }
        return newcall;
    };

    /**
     * Returns the constructor of the given class definition. When Aria.memCheckMode==true, it returns a wrapper.
     * Otherwise, it directly returns the $constructor defined in the class definition.
     * @private
     * @param {Object} def
     * @param {Object} superclass
     */
    var __createConstructor = function (def, superclass) {
        if (!Aria.memCheckMode) {
            return def.$constructor;
        }
        return function () {
            try {
                if (!this['aria:objnumber']) {
                    __nbConstructions++;
                    this['aria:objnumber'] = __nbConstructions;
                    __objects[__nbConstructions] = this;
                }
                // check that parent constructors are correctly called
                __checkInheritanceCalls(this, def, superclass, "$constructor", arguments);
            } catch (e) {
                // if an exception occurs while creating the object,
                // we do not need to call dispose on it and we don't want to decrease the counter
                // more than once (in case the exception is in a grandchild constructor)
                if (this['aria:objnumber']) {
                    __nbDestructions++;
                    __objects[this['aria:objnumber']] = null;
                    delete __objects[this['aria:objnumber']];
                    this['aria:objnumber'] = null;
                }
                throw e;
            }
        };
    };

    /**
     * Returns the destructor of the given class definition. When Aria.memCheckMode==true, it returns a wrapper.
     * Otherwise, it directly returns the $destructor defined in the class definition.
     * @private
     * @param {Object} def
     * @param {Object} superclass
     */
    var __createDestructor = function (def, superclass) {
        if (!Aria.memCheckMode) {
            return def.$destructor;
        }
        return function () {
            // check that parent destructors are correctly called
            if (__checkInheritanceCalls(this, def, superclass, "$destructor", arguments)) {
                // Erase everything in the object, so that it is possible
                // to see when it is no longer used
                /*
                 * for (var i in this) { this[i] = null; }
                 */
            }
            if (this['aria:objnumber']) {
                __nbDestructions++;
                __objects[this['aria:objnumber']] = null;
                delete __objects[this['aria:objnumber']];
                this['aria:objnumber'] = null;
            }
        };
    };

    /**
     * TODOC
     * @private
     */
    var __setRootDim = function (dim) {
        aria.templates.Layout.setRootDim(dim);
    };

    /**
     * TODOC
     * @private
     */
    var __classLoadError = function (classPath, errorID, errorArgs) {
        if (errorID) {
            Aria.$logError(errorID, errorArgs);
        }
        if (__clsMgr) {
            __clsMgr.notifyClassLoadError(classPath);
        }
    };

    /**
     * Copies the content of mergeFrom into mergeTo. mergeFrom and mergeTo are maps of event definitions. If an event
     * declared in mergeFrom already exists in mergeTo, the error is logged and the event is not overriden.
     * @name Aria.__mergeEvents
     * @private
     * @method
     * @param {Object} mergeTo Destrination object (map of events).
     * @param {Object} mergeFrom Source object (map of events).
     * @param {String} Classpath of the object to which events are copied. Used in case of error.
     * @return {Boolean} false if mergeFrom is empty. True otherwise.
     */
    var __mergeEvents = function (mergeTo, mergeFrom, classpathTo) {
        var hasEvents = false;
        for (var k in mergeFrom) {
            if (mergeFrom.hasOwnProperty(k)) {
                if (!hasEvents) {
                    hasEvents = true;
                }
                // The comparison with null below is important, as an empty string is a valid event description.
                if (mergeTo[k] != null) {
                    Aria.$logError(Aria.REDECLARED_EVENT, [k, classpathTo]);
                } else {
                    mergeTo[k] = mergeFrom[k];
                }
            }
        }
        return hasEvents;
    };

    // Make that function available for aria.core.Interfaces. Is not intended for the use by application developers.
    Aria.__mergeEvents = __mergeEvents;
    /**
     * When minSizeMode=true, templates and widgets use their minimum size, to help defining correct sizes for $hdim and
     * $vdim.
     * @type Boolean
     * @name Aria.minSizeMode
     */
    Aria.minSizeMode = Aria.minSizeMode === true;

    /**
     * Debug mode indicator
     * @name Aria.debug
     * @type Boolean
     */
    Aria.debug = Aria.debug === true;

    /**
     * If true, profiling is enabled, and profile data is added to Aria.profilingData.
     * @name Aria.enableProfiling
     * @type Boolean
     */
    Aria.enableProfiling = Aria.enableProfiling === true;

    /**
     * The memCheckMode variable enables or disables the check of the match between creation and destruction of objects,
     * so that there is no memory leak.
     * @type Boolean
     * @name Aria.memCheckMode
     */
    Aria.memCheckMode = Aria.memCheckMode === true;

    /**
     * The domain variable has to be set only when you explicitly set the value of document.domain. It is needed by
     * classes using iframes (like aria.utils.HashManager) in order to overcome the limitations imposed by IE6/7 on the
     * access of the iframe contents. It is desirable to set it at the very beginning, even before loading the bootstrap
     * file of the framework.
     * @type String
     * @name Aria.domain
     */
    Aria.domain = Aria.domain || null;

    /**
     * Prefix used for all parameters added in objects by the framework for internal requirements
     * @type String
     * @name Aria.FRAMEWORK_PREFIX
     */
    Aria.FRAMEWORK_PREFIX = Aria.FRAMEWORK_PREFIX || "aria:";

    /**
     * Relative path for the aria resources location
     * @type String
     * @name Aria.FRAMEWORK_RESOURCES
     */
    Aria.FRAMEWORK_RESOURCES = Aria.FRAMEWORK_RESOURCES || "aria/resources/";

    /**
     * List of all class definitions that have been defined through Aria.classDefinition Some definitions may not
     * published though - cf. loadClass and class override (unit tests)
     * @private
     * @type Map
     * @see loadClass()
     * @name Aria.$classDefinitions
     */
    Aria.$classDefinitions = {};

    /**
     * List of all classes in the order of their loading
     * @type Array
     * @name Aria.$classes
     */
    Aria.$classes = [];

    /**
     * Access for undisposed objects from within test cases.
     * @type Object
     * @name Aria.__undisposedObjects
     * @private
     */
    Aria.__undisposedObjects = __objects;

    /**
     * Activate the test mode in order to generate specific ids inside the widgets.
     */
    Aria.activateTestMode = function () {
        Aria.testMode = true;
        var rootTemplates = Aria.rootTemplates;
        if (rootTemplates) {
            for (var i = 0, l = rootTemplates.length; i < l; i++) {
                var rootTemplate = rootTemplates[i];
                rootTemplate.$refresh();
            }
        }
    };

    /**
     * Unload Aria cleanly, so that there is no memory leak. In memCheckMode, for debug purposes, return an object with
     * information about not properly disposed objects.
     * @param {String|Object} classpath optional parameters to dispose only a target classpath
     */
    Aria.dispose = function (classpathOrRef) {
        if (classpathOrRef) {
            var classpath;
            var classRef;
            var def;
            if (typeof classpathOrRef == "string") {
                classpath = classpathOrRef;
                classRef = Aria.getClassRef(classpath);
                if (!classRef) {
                    return;
                }
                def = classRef.classDefinition || classRef.interfaceDefinition;
                if (!def) {
                    return;
                }
            } else {
                classRef = classpathOrRef;
                def = classRef.classDefinition || classRef.interfaceDefinition;
                if (!def) {
                    return;
                }
                classpath = def.$classpath;
                if (!classpath) {
                    return;
                }
            }
            // remove from object
            var parent = classpath.split('.');
            var child = parent[parent.length - 1];
            parent.splice(parent.length - 1, 1);
            parent = Aria.nspace(parent.join("."));

            // check if the class is the same as the one loaded at the specified classpath
            // before removing it
            if (classRef == parent[child]) {
                if (def.$singleton) {
                    classRef.$dispose();
                }
                if (def.$onunload) {
                    def.$onunload.call(def.$noargConstructor.prototype, classRef);
                }
                // Remove resources providers instances
                var defResources = def.$resources;
                var p = def.$singleton ? classRef : classRef.prototype;
                if (defResources) {
                    for (var k in defResources) {
                        if (defResources.hasOwnProperty(k) && (defResources[k].provider != null)) {
                            p[k].$dispose();
                            p[k] = null;
                        }
                    }
                }

                delete parent[child];

                // clean Aria object
                delete this.$classDefinitions[classpath];
                for (var i = 0, className; className = this.$classes[i]; i++) {
                    if (className == classRef) {
                        this.$classes.splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            // disposing and/or unloading classes:
            var classes = Aria.$classes.slice(0);
            for (var i = classes.length - 1; i >= 0; i--) {
                var elt = classes[i];
                Aria.dispose(elt);
            }
            classes = null;
            var memcheck = Aria.memCheckMode;
            Aria = null;
            // aria = null; // must not be done, as we still need to be able to log errors through
            // aria.core.Log.error
            // delete window.Aria; // not supported under IE
            if (memcheck) {
                return {
                    nbConstructions : __nbConstructions,
                    nbDestructions : __nbDestructions,
                    nbNotDisposed : __nbConstructions - __nbDestructions,
                    notDisposed : __objects
                };
            }
        }
    };

    /**
     * Make sure the JavaScript namespace object exists and create it if necessary. Does not check for syntax.
     * @param {String} nspace the namespace string - e.g. 'abc.x.y.z'
     * @param {Boolean} createIfNull [optional, default: true] if false, the namespace is not created if it does not
     * exist (in this case the function returns null)
     * @param {Object} parent [optional, default: Aria.$global] parent object in which to search for the namespace
     * @return {Object}
     */
    Aria.nspace = function (nspace, createIfNull, parent) {
        // normalize parent
        if (parent == null) {
            parent = Aria.$global;
        }

        // normalize createIfNull
        createIfNull = createIfNull !== false;

        // edge case
        if (nspace === "") {
            return parent;
        }

        if (!nspace || typeof(nspace) != 'string') {
            Aria.$logError(Aria.INVALID_NAMESPACE, [nspace]);
            return null;
        }

        var parts = nspace.split('.'), nbParts = parts.length, current;
        for (var i = 0; i < nbParts; i++) {
            current = parts[i];
            if (!current || Aria.isJsReservedWord(current)) {
                Aria.$logError(Aria.INVALID_NAMESPACE, [nspace]);
                return null;
            }
            if (!parent[current]) {
                if (!createIfNull) {
                    return null;
                }
                parent[current] = {};
            }
            parent = parent[current];
        }
        return parent;
    };

    /**
     * Internal cache for getClassRef method
     * @see Aria.getClassRef()
     */
    var _getClassRefCache = {};
    /**
     * Return a reference to the class given by its name.
     * @param {String} className the string - e.g. 'abc.x.y.z.ClassName'
     * @return {Object}
     */
    Aria.getClassRef = function (className) {
        return _getClassRefCache[className] || (_getClassRefCache[className] = Aria.nspace(className, false));
    };

    /**
     * Clean the internal cache of Aria.getClassRef
     * @param {String} className the string - e.g. 'abc.x.y.z.ClassName'. If false cleans the whole cache
     */
    Aria.cleanGetClassRefCache = function (className) {
        if (!className) {
            _getClassRefCache = {};
        } else {
            delete _getClassRefCache[className];
        }
    };

    /**
     * Return an instance of the given class, initialized with the parameter given as argument
     * @param {String} className the string - e.g. 'abc.x.y.z'
     * @param {Array} args, optional arguments given as an object to the constructor
     * @return {Object}
     */
    Aria.getClassInstance = function (className, args) {
        var ClassRef = Aria.getClassRef(className);
        if (ClassRef) {
            return new ClassRef(args);
        } else {
            Aria.$logError(Aria.INSTANCE_OF_UNKNOWN_CLASS, [className]);
        }
    };

    /**
     * Tell if a string is a reserved JavaScript keyword
     * @param {String} str the string to check
     * @return {Boolean} true if s is a javascript reserved keyword
     */
    Aria.isJsReservedWord = function (str) {
        if (__JS_RESERVED_WORDS["_" + str]) {
            return true;
        }
        return false;
    };

    /**
     * Tell is a string is acceptable as a JavaScript variable name (must not start with some specific chars and must
     * not be a reserved keyword)
     * @param {String} s the string to check
     * @return {Boolean} true if s is a valid variable name
     */
    Aria.checkJsVarName = function (str) {
        if (!str.match(/^[a-zA-Z_\$][\w\$]*$/)) {
            return false;
        }
        if (Aria.isJsReservedWord(str)) {
            return false;
        }
        return true;
    };

    /**
     * Base methods used to declare template scripts
     * @param {aria.templates.CfgBeans:TplScriptDefinitionCfg} def The definition object describing the class.
     * Definition is the same as for classDefinition, excluding 'extends'
     */
    Aria.tplScriptDefinition = function (def) {
        // WRITING WITH BRACKETS ON PURPOSE (for documentation)
        Aria['classDefinition']({
            $classpath : def.$classpath,
            $dependencies : def.$dependencies,
            $resources : def.$resources,
            $statics : def.$statics,
            $texts : def.$texts,
            $prototype : def.$prototype,
            $onload : function (constructor) {
                constructor.tplScriptDefinition = def;
            },
            $constructor : function () {
                // This is to prevent direct instantiation of template scripts.
                // Yet it is still possible do define $constructor and $destructor on template scripts, as they will be
                // imported later on in TplClassLoader._importScriptPrototype()
                this.$logError(Aria.TPLSCRIPT_INSTANTIATED_DIRECTLY);
            }
        });
    };

    /**
     * Base methods used to declare classes
     * @param {aria.core.CfgBeans:ClassDefinitionCfg} def def The definition object describing the class - must have the
     * following properties: All objects create through this method will automatically have the following properties:
     *
     * <pre>
     * {
     *     $CLASSNAME // reference to the class prototype (useful for subclasses)
     *     $destructor // destructor method
     *     $classpath // fully qualified classpath
     *     $class // class name (i.e. last part of the class path)
     * }
     * </pre>
     */
    Aria.classDefinition = function (def) {

        if (!def) {
            return Aria.$logError(Aria.NULL_CLASSPATH);
        }

        // There are two ways to define the classpath: either by $classpath
        // or by both $class and $package
        // if both ways are used, check that they define the same classpath
        var defClasspath = def.$classpath, defClassname = def.$class, defPackage = def.$package, defExtends = def.$extends;
        // check if classpath is correct
        if (!defClasspath && !(defClassname != null && defPackage != null)) {
            return Aria.$logError(Aria.NULL_CLASSPATH);
        }

        var clsNs;
        var clsName;
        var clsPath;
        if (defClasspath) {
            clsPath = defClasspath;
            var idx = clsPath.lastIndexOf('.');
            if (idx > -1) {
                clsNs = clsPath.slice(0, idx);
                clsName = clsPath.slice(idx + 1);
            } else {
                clsNs = '';
                clsName = clsPath;
            }
            if ((defClassname && defClassname != clsName) || (defPackage && defPackage != clsNs)) {
                return Aria.$logError(Aria.INCOHERENT_CLASSPATH);
            }

            def.$class = clsName;
            def.$package = clsNs;
        } else {
            clsName = defClassname;
            clsNs = def.$package;
            clsPath = clsNs + '.' + clsName;
            def.$classpath = clsPath;
        }
        if (!__checkClasspath(clsPath, "classDefinition: ")) {
            return;
        }

        // initialize class definition: create $events, $noargConstructor,
        // $destructor... variables
        if (!def.$events) {
            def.$events = {}; // to make sure it is always defined
        }
        def.$noargConstructor = new Function();

        // check superclass: if none, we use aria.core.JsObject
        if (!defExtends || defExtends.match(/^\s*$/)) {
            if (clsPath != 'aria.core.JsObject') {
                defExtends = def.$extends = 'aria.core.JsObject';
            }
        }

        if (!def.$constructor) {
            def.$constructor = new Function(def.$extends + ".prototype.constructor.apply(this, arguments);");
            // return Aria.$logError("10007_MISSING_CONSTRUCTOR", [clsPath]);
        }

        // register definition - note that previous definition will be
        // overridden
        this.$classDefinitions[clsPath] = def;

        // check dependencies
        var doLoad = true;
        if (__clsMgr) {
            // load missing dependencies - js classes and resource files
            var dpMap = {
                'TPL' : def.$templates,
                'CSS' : def.$css,
                'TML' : def.$macrolibs,
                'CML' : def.$csslibs
            };
            var rs = [];
            var dp = def.$dependencies || [];

            // add implemented interfaces to dependencies map
            if (def.$implements && def.$implements.length > 0) {
                dp = dp.concat(def.$implements);
            }

            // add resources file to dependencies map
            if (aria.utils.Type.isObject(def.$resources)) {
                for (var itm in def.$resources) {
                    if (def.$resources.hasOwnProperty(itm)) {
                        if (def.$resources[itm].hasOwnProperty("provider")) {
                            // it's a resource provider
                            dp.push(def.$resources[itm].provider);
                        } else {
                            // it's a resource
                            rs.push(def.$resources[itm]);
                        }
                    }
                }
            }
            // add text template files to dependencies map
            if (aria.utils.Type.isObject(def.$texts)) {
                dpMap.TXT = aria.utils.Array.extractValuesFromMap(def.$texts);
            }

            dpMap.RES = rs;
            dpMap.JS = dp;

            if (defExtends != 'aria.core.JsObject') {
                var extendsType = def.$extendsType || "JS";
                if (extendsType !== "JS" && extendsType !== "TPL" && extendsType !== "TML" && extendsType !== "CSS"
                        && extendsType !== "CML" && extendsType !== "TXT") {
                    return Aria.$logError(Aria.INVALID_EXTENDSTYPE, [clsName]);
                }
                if (dpMap[extendsType]) {
                    dpMap[extendsType].push(defExtends);
                } else {
                    dpMap[extendsType] = [defExtends];
                }
            }

            // always use the class manager (even if there is no dependency) to notify the loader that the
            // classDefinition was called
            doLoad = __clsMgr.loadClassDependencies(clsPath, dpMap, {
                fn : Aria.loadClass,
                scope : Aria,
                args : clsPath
            });
        }

        // load definition
        if (doLoad) {
            this.loadClass(clsPath, clsPath);
        }
    };

    /**
     * Base method used to declare interfaces.
     * @param {Object} def Interface definition. The interface definition can contain the following properties:
     *
     * <pre>
     * {
     *     $extends // {String} contain the classpath of the interface this interface inherits from,
     *     $events // {Object} contain event definitions, same syntax as for classDefinition,
     *     $interface // {Object} map of empty methods and properties to be included in the interface
     * }
     * </pre>
     */
    Aria.interfaceDefinition = function (def) {
        // TODO: add some checks on the parameter
        var clsPath = def.$classpath;
        if (!__checkClasspath(clsPath, "interfaceDefinition")) {
            return;
        }
        if (def.$events == null) {
            def.$events = {}; // to make sure it is always defined
        }
        var doLoad = true;
        if (__clsMgr) {
            // always use the class manager (even if there is no dependency) to notify the loader that the
            // interfaceDefinition was called
            doLoad = __clsMgr.loadClassDependencies(clsPath, {
                "JS" : def.$extends ? [def.$extends] : []
            }, {
                fn : aria.core.Interfaces.loadInterface,
                scope : aria.core.Interfaces,
                args : def
            });
        }
        // load definition if no dependency is missing
        if (doLoad) {
            aria.core.Interfaces.loadInterface(def);
        }
    };

    /**
     * Copy members of object src into dst.
     * @param {Object} src
     * @param {Object} dst
     */
    Aria.copyObject = function (src, dst) {
        for (var k in src) {
            if (src.hasOwnProperty(k)) {
                dst[k] = src[k];
            }
        }
    };

    var navigator = Aria.$global.navigator;

    /**
     * @private There is a IE only check in the loadClass function aria.core.Browser is not available at this stage, so
     * we have to manually check for IE here. The logic is used is however the same as in aria.core.Browser
     */
    var __temporaryIsIE = navigator ? navigator.userAgent.toLowerCase().indexOf("msie") != -1 : false;

    /**
     * Load a class definition and expose it on a public path. These 2 paths may be different to support class
     * overloading (for unit testing for intance).<br/> Note: this method is automatically called by classDefinition() -
     * with the 2 same arguments in this case
     * @param {String} definitionClassPath the internal classpath associated to the class definition - e.g.
     * 'mypkg.MyClass2'
     * @param {String} publicClassPath the public class path to give to this definition - e.g. 'mypkg.MyClass'
     */
    Aria.loadClass = function (definitionClassPath, publicClassPath) {

        if (!publicClassPath) {
            publicClassPath = definitionClassPath;
        }
        if (!__checkClasspath(publicClassPath, "loadClass")) {
            return;
        }

        // retrieve definition
        var def = this.$classDefinitions[definitionClassPath];
        if (!def) {
            return Aria.$logError(Aria.INVALID_DEFCLASSPATH, [definitionClassPath]);
        }

        var defPrototype = def.$prototype, defStatics = def.$statics, defEvents = def.$events, defBeans = def.$beans, defResources = def.$resources, defTexts = def.$texts;
        var defImplements = def.$implements;

        // Create public ns
        var clsNs = '';
        var clsName = publicClassPath;
        var idx = publicClassPath.lastIndexOf('.');
        if (idx > -1) {
            clsNs = publicClassPath.slice(0, idx);
            clsName = publicClassPath.slice(idx + 1);
        }

        // get namespace object
        var ns = Aria.nspace(clsNs);

        // manage inheritance
        var superclass = null;
        if (def.$extends) {
            if (!__checkClasspath(def.$extends, "parentClass")) {
                return __classLoadError(def.$classpath);
            }
            superclass = Aria.getClassRef(def.$extends);

            if (!superclass) {
                return __classLoadError(def.$classpath, Aria.BASE_CLASS_UNDEFINED, [def.$classpath, def.$extends]);
            } else {
                // check that superclass has been properly loaded
                if (!superclass.classDefinition) {
                    return __classLoadError(def.$classpath, Aria.WRONG_BASE_CLASS, [def.$classpath, def.$extends]);
                }
                // check that superclass is not singleton
                if (superclass.classDefinition.$singleton) {
                    return __classLoadError(def.$classpath, Aria.CANNOT_EXTEND_SINGLETON, [def.$classpath, def.$extends]);
                }

            }
        }

        // define class prototype
        var p; // new prototype
        if (superclass) {
            p = new superclass.classDefinition.$noargConstructor();
            // won't work, something else needs to be provided
            // p.$super = superclass.prototype;
        } else {
            p = {};
        }

        p.$classpath = def.$classpath;
        p.$class = def.$class;
        p.$package = def.$package;
        var parentResources = {};
        if (p.$resources) {
            parentResources = p.$resources;
            p.$resources = {};
            Aria.copyObject(parentResources, p.$resources);
            Aria.copyObject(defResources, p.$resources);
        } else {
            p.$resources = def.$resources;
        }
        var parentTexts = {};
        if (p.$texts) {
            parentTexts = p.$texts;
            p.$texts = {};
            Aria.copyObject(parentTexts, p.$texts);
            Aria.copyObject(defTexts, p.$texts);
        } else {
            p.$texts = def.$texts;
        }

        // css templates
        if (def.$css) {
            p.$css = def.$css;
        }
        if (defPrototype) {
            if (typeof defPrototype === "function") {
                defPrototype = defPrototype.apply({});
                if (!defPrototype) {
                    Aria.$logError(Aria.FUNCTION_PROTOTYPE_RETURN_NULL, [publicClassPath]);
                    defPrototype = {};
                }
                Aria.copyObject(defPrototype, def.$prototype);
            }
            for (var k in defPrototype) {
                if (defPrototype.hasOwnProperty(k) && k != '$init') {
                    if (typeof defPrototype[k] === "function") {
                        // enable naming of anonymous functions in the stack trace in Firebug and Safari
                        defPrototype[k].displayName = "#" + k;
                    }
                    // TODO: check method names?
                    p[k] = defPrototype[k];
                }
            }
            // Internet Explorer fix only for toString and valueOf properties
            // cannot use aria.core.Browser at this stage,
            // __temporaryIsIE is defined right before loadClass and is only accessible inside the closure
            if (__temporaryIsIE) {
                if (defPrototype.hasOwnProperty("toString")) {
                    p.toString = defPrototype.toString;
                }
                if (defPrototype.hasOwnProperty("valueOf")) {
                    p.valueOf = defPrototype.valueOf;
                }
            }
        }

        // store providers in a special variable
        var defProviders = {};

        // if resources (and/or providers) were defined for a class add them to the prototype
        if (defResources) {
            for (var k in defResources) {
                if (defResources.hasOwnProperty(k)) {
                    if (p[k] && !parentResources[k]) {
                        Aria.$logError(Aria.RESOURCES_HANDLE_CONFLICT, [k, publicClassPath]);
                    } else {
                        if (defResources[k].provider != null) {
                            // it's a provider
                            defProviders[k] = defResources[k];

                            p[k] = Aria.getClassInstance(defResources[k].provider);
                            p[k].getData = (function (original) {
                                return function () { // ok if providers are not singletons
                                    return original.__getData(clsName);
                                };
                            })(p[k]);

                            p[k].__refName = k;
                        } else {
                            // it's a resource
                            p[k] = Aria.getClassRef(defResources[k]);
                        }
                    }
                }
            }
        }
        /*
         * if text templates were defined for a class add them to the prototype make sure that the handle provided does
         * not already exist. If it refers to a parent text template, tghen we still want to override it
         */
        if (defTexts) {
            for (var k in defTexts) {
                if (defTexts.hasOwnProperty(k)) {
                    if (p[k] && !parentTexts[k]) {
                        Aria.$logError(Aria.TEXT_TEMPLATE_HANDLE_CONFLICT, [k, publicClassPath]);
                    } else {
                        p[k] = Aria.getClassRef(defTexts[k]);
                    }
                }
            }
        }

        if (defStatics) {
            // publish statics on the prototype so that they are available
            // as object properties
            Aria.copyObject(defStatics, p);
        }
        if (defBeans) {
            // FIXME: WHAT TO DO ? WHAT. TO. DO !!
        }

        // Inclusion of events:
        // 1: the events of the super class (including those from its interfaces and its superclass)
        // 2: the events from the interfaces of the current class (added through applyInterface)
        // 3: the events of the current class (in the class definition)
        // In this second step, there is a check that an interface is not applied twice
        // Events cannot be redefined. If they are, an error is raised.

        p.$events = {};
        if (superclass) {
            __mergeEvents(p.$events, superclass.prototype.$events, p.$classpath);
        }
        if (defImplements) {
            if (aria.utils.Type.isArray(defImplements)) {
                for (var k = 0, l = defImplements.length; k < l; k++) {
                    if (!aria.core.Interfaces.applyInterface(defImplements[k], p)) {
                        // the error has already been logged from applyInterface
                        return __clsMgr.notifyClassLoadError(p.$classpath); // notify that class load failed
                    }
                }
            } else {
                __classLoadError(def.$classpath, Aria.INVALID_INTERFACES, [def.$classpath]);
            }
        }
        if (!p.$interfaces) {
            p.$interfaces = {};
        }
        __mergeEvents(p.$events, defEvents, p.$classpath);

        var dstrctr = __createDestructor(def, superclass);
        if (dstrctr) {
            // only create the destructor if needed
            p.$destructor = dstrctr;
        }

        // create ref to current prototype (usefull for subclasses)
        var protoRef = '$' + def.$class;
        // if base class ref already exists, log error
        if (p[protoRef] != null) {
            return __classLoadError(def.$classpath, Aria.DUPLICATE_CLASSNAME, def.$class);
        } else {
            p[protoRef] = p;
        }

        var cnstrctr = __createConstructor(def, superclass);

        cnstrctr.prototype = p;
        if (superclass) {
            cnstrctr.superclass = superclass.prototype;
        }
        p.$constructor = p.constructor = cnstrctr;
        def.$noargConstructor.prototype = p;

        // expose class constructor through public ns
        if (def.$singleton) {
            ns[clsName] = new cnstrctr();
        } else {
            if (defStatics) {
                // publish statics reference on the contstructor
                // note: already the case for singleton as statics are also
                // available in the prototype
                Aria.copyObject(defStatics, cnstrctr);
            }
            ns[clsName] = cnstrctr;
        }

        ns[clsName].classDefinition = def;
        Aria.$classes.push(ns[clsName]);

        // check if we need to initialize providers synchronously
        for (var k in defProviders) {
            if (defProviders.hasOwnProperty(k)) {
                var provider = defProviders[k];
                // set handlers and resources, if defined.

                if (provider.hasOwnProperty("handler")) {
                    p[k].setHandler(provider.handler);
                }
                if (provider.hasOwnProperty("resources")) {
                    p[k].setResources(provider.resources);
                }

                // fetch data
                if (provider.hasOwnProperty("onLoad")) {
                    p[k].fetchData({
                        fn : provider.onLoad,
                        scope : p
                    }, clsName); // we pass the name of the "caller class" i.e. the one with the provider declaration

                    // asynchronous load
                } else {
                    // synchronous load
                    syncProviders.push({
                        ref : k,
                        prot : p[k]
                    });
                }
            }
        }

        // remember this class so we can initialized when all providers have been loaded
        __classMemo[clsName] = {
            def : def,
            p : p,
            ns : ns
        };

        this.loadSyncProviders(clsName);
    };

    Aria.loadSyncProviders = function (caller) {
        if (syncProviders.length > 0) {
            // load next provider
            var nextProvider = syncProviders.pop();
            nextProvider.prot.fetchData({
                fn : this.loadSyncProviders,
                scope : this,
                args : {
                    calledback : true
                }
            }, caller);
        } else {
            // all providers have been loaded : init class

            // retrieve temporarily stored information
            var clsName = caller;
            var def = __classMemo[clsName].def;
            var p = __classMemo[clsName].p;
            var ns = __classMemo[clsName].ns;

            var defPrototype = def.$prototype;

            // if prototype init exist
            if (defPrototype && defPrototype.$init) {
                defPrototype.$init(p, def);
            }

            if (def.$onload) {
                // call the onload method
                // TODO: try/catch
                def.$onload.call(p, ns[clsName]);
            }

            // notify class manager
            if (__clsMgr) {
                __clsMgr.notifyClassLoad(def.$classpath);
            } else if (def.$classpath == 'aria.core.ClassMgr') {
                // we just loaded the class manager
                __clsMgr = aria.core.ClassMgr;
            }

            __classMemo[clsName] = null; // class succesfully loaded: clear the memo
        }
    };

    /**
     * Dynamically load some dependencies and calls the callback function when ready (Shortcut to
     * aria.core.MultiLoader.load) Note: this method may be synchronous if all dependencies are already in cache
     * @param {Object} desc the description of the files to load and the callback [loadDesc]
     *
     * <pre>
     * {
     *      classes : {Array} list of JS classpaths to be loaded
     *      templates : {Array} list of TPL classpaths to be loaded
     *      resources : {Array} list of RES classpaths to be loaded
     *      css : {Array} list of TPL.CSS classpaths to be loaded
     *      tml : {Array} list of TML classpaths to be loaded
     *      cml : {Array} list of CML classpaths to be loaded
     *      txt : {Array} list of TXT classpaths to be loaded
     *      oncomplete : {
     *          fn : {Function} the callback function - may be called synchronously if all dependencies are already available
     *          scope : {Object} [optional] scope object (i.e. 'this') to associate to fn - if not provided, the Aria object will be used
     *          args: {Object} [optional] callback arguments (passed back as argument when the callback is called)
     *      },
     *      onerror : {
     *          fn : {Function} the callback function called in case of load error
     *          scope : {Object} [optional] scope object
     *          args: {Object} [optional] callback arguments
     *          override: {Boolean} [optional] used to disable error warnings
     *      }
     * }
     * </pre>
     *
     * If there is no need to specify the <code>scope</code> and <code>args</code>, the callbacks can be passed
     * directly as functions: e.g. <code>oncomplete: function () {...}</code> instead of
     * <code>oncomplete: {fn: function () {...}}</code>
     */
    Aria.load = function (desc) {
        var ml = new aria.core.MultiLoader(desc);
        ml.load();
    };

    /**
     * Base method used to declare beans.
     * @param {aria.core.BaseTypes:BeansDefinition} beans Beans to declare
     */
    Aria.beanDefinitions = function (beans) {
        aria.core.JsonValidator.beanDefinitions(beans);
    };

    /**
     * Set root dimensions.
     * @param {aria.core.Beans:RootDimCfg} rootDim
     */
    Aria.setRootDim = function (rootDim) {
        Aria.load({
            classes : ['aria.templates.Layout'],
            oncomplete : {
                fn : __setRootDim,
                args : rootDim
            }
        });
    };

    /**
     * Load a template in a div. If a customized template has been defined for the given classpath, the substitute will
     * be loaded instead.
     * @param {aria.templates.CfgBeans:LoadTemplateCfg} cfg configuration object
     * @param {aria.core.CfgBeans:Callback} callback which will be called when the template is loaded or if there is an
     * error. The first parameter of the callback is a JSON object with the following properties: { success : {Boolean}
     * true if the template was displayed, false otherwise } Note that the callback is called when the template is
     * loaded, but sub-templates may still be waiting to be loaded (showing a loading indicator). Note that
     * success==true means that the template was displayed, but there may be errors inside some widgets or
     * sub-templates.
     */
    Aria.loadTemplate = function (cfg, cb) {
        aria.core.TplClassLoader.loadTemplate(cfg, cb);
    };

    /**
     * Unload a template loaded with Aria.loadTemplate.
     * @param {aria.templates.CfgBeans:Div} div The div given to Aria.loadTemplate.
     */
    Aria.disposeTemplate = function (div) {
        return aria.core.TplClassLoader.disposeTemplate(div);
    };

    /**
     * Load a resource definition.
     */
    Aria.resourcesDefinition = function (res) {
        var resClassRef = Aria.getClassRef(res.$classpath);

        // if resource class has been already instantiated do json injection only
        if (resClassRef) {
            // inject resources for new locale
            var proto = resClassRef.classDefinition.$prototype;
            aria.utils.Json.inject(res.$resources, proto, true);
            // injecting in $prototype is not sufficient because simple values
            // are not updated on the singleton instance. That's why we are doing the
            // following loop:
            for (var i in proto) {
                if (proto.hasOwnProperty(i)) {
                    resClassRef[i] = proto[i];
                }
            }
            // store info about resource files (per locale) loaded
            // aria.core.ResMgr.addResFile(resClassRef.$classpath);
            if (__clsMgr) {
                __clsMgr.notifyClassLoad(res.$classpath);
            }
        } else {
            // WRITING WITH BRACKETS ON PURPOSE (for documentation)
            Aria['classDefinition']({
                $classpath : res.$classpath,
                $singleton : true,
                $constructor : function () {},
                $prototype : res.$resources
            });
        }
    };

    /**
     * Copy globals corresponding to all loaded classes.
     * @param {Object} object on which all globals corresponding to loaded classes will be copied.
     */
    Aria.copyGlobals = function (object) {
        object.Aria = Aria;
        var global = Aria.$global;
        var classes = Aria.$classes;
        for (var i = 0, l = classes.length; i < l; i++) {
            var classRef = classes[i];
            if (classRef) {
                var classpath = classRef.$classpath;
                if (!classpath) {
                    var classDef = classRef.classDefinition || classRef.interfaceDefinition;
                    if (classDef) {
                        classpath = classDef.$classpath;
                    }
                }
                if (classpath) {
                    var dotPosition = classpath.indexOf(".");
                    var startName = dotPosition > -1 ? classpath.substring(0, dotPosition) : classpath;
                    object[startName] = global[startName];
                }
            }
        }
    };

    /**
     * This method executes the callback once the DOM is in ready state.
     * @param {aria.core.CfgBeans:Callback} cb a callback function
     */
    Aria.onDomReady = function (cb) {
        aria.dom.DomReady.onReady(cb);
    };

    if (Aria.$frameworkWindow) {
        if (Aria.rootFolderPath == null) { // Aria.rootFolderPath can be an empty string; it is a correct value.

            // Finding Aria.rootFolderPath
            var me, scripts, myUrl;

            // First we retrieve the url of Aria.js (me) in the page.
            // As browsers ensure that all file are executed in the good order, at this stage the script tag that loaded
            // me can only be the last script tag of this page.
            scripts = Aria.$frameworkWindow.document.getElementsByTagName("script");
            me = scripts[scripts.length - 1];
            scripts = null;
            myUrl = me.src; // In all the browsers it's an absolute path, in IE6,7 is relative

            // rootFolderPath is just the folder above the folder of Aria.js
            var removeJsFile = myUrl.replace(/aria\/[^\/]*$/, ""); // when it is not packaged
            if (removeJsFile == myUrl) {
                removeJsFile = removeJsFile.substring(0, removeJsFile.lastIndexOf("/")) + "/";
            }

            // When the path is relative, this can become empty, take the current location
            if (!removeJsFile) {
                var currentLocation = Aria.$frameworkWindow.location;
                removeJsFile = currentLocation.protocol + "//" + currentLocation.host + "/";
                var pathname = currentLocation.pathname;
                // remove everything after the last / on pathname
                pathname = pathname.match(/[\/\w\.\-]+\//gi);
                if (pathname) {
                    pathname = pathname[0];
                } else {
                    pathname = "";
                }
                removeJsFile += pathname;

            }

            /**
             * Path from the current page to the Aria.js script Possible values could be "" or "../" or "../xyz"
             * @name Aria.rootFolderPath
             * @type String
             */
            Aria.rootFolderPath = removeJsFile;

        }

        if (Aria.rootFolderPath == "/") { // this will happen with IE (04204517)
            var currentURL = Aria.$frameworkWindow.location;
            Aria.rootFolderPath = currentURL.protocol + "//" + currentURL.host + "/";
        }
    }

    /**
     * Empty function. To be used whenever an empty function is needed in order to avoid closures
     * @type Function
     */
    Aria.empty = function () {};

    /**
     * Return true. To be used in order to avoid closures
     * @type Function
     */
    Aria.returnTrue = function () {
        return true;
    };

    /**
     * Return false. To be used in order to avoid closures
     * @type Function
     */
    Aria.returnFalse = function () {
        return false;
    };

    /**
     * Return null. To be used in order to avoid closures
     * @type Function
     */
    Aria.returnNull = function () {
        return null;
    };

    /**
     * Private variable to support sourceURL statement. Evaluates to "@" in old Firefoxes and "#" in other browsers.
     * @type String
     */
    Aria.__sourceUrlPrefix = (function () {
        // Versions of Firebug available for Firefox <= 22 support only @ syntax
        // New versions of Chrome, Safari, and Firebugs for Firefox 23+ support # syntax
        // Also let's use # in IE though it doesn't do anything as of IE11, but at least it doesn't create issues like
        // //@ does in old versions of IE
        var matchesFx = navigator ? navigator.userAgent.match(/Firefox\/(\d+)/) : false;
        if (matchesFx && +matchesFx[1] <= 22) {
            return "@";
        }
        return "#";
    })();

})();

/**
 * Call eval and enable better debugging support with source URL. There is a bug in firebug which prevents the source
 * code loaded by an eval which comes from code loaded by an eval to be shown properly (with comments and correct
 * indentation). Aria.js is not loaded through an eval, so that there is no problem here.
 * @param {String} srcJS string to be evaluated
 * @param {String} srcURL path to the file containing the string (useful when debugging)
 * @param {Object} evalContext An object to be available from the javascript code being evaluated. The object is named
 * evalContext.
 */
Aria["eval"] = function (srcJS, srcURL, evalContext) {
    // PTR 05051375: this eval method must be put outside of the closure because, in packaged mode, variables in the
    // closure are renamed and it is possible that loading a file through eval changes the value of those variables
    // resulting in very strange JS exceptions

    // changed by assignment inside the eval
    if (srcURL) {
        // To have better debugging support:
        srcJS = [srcJS, '\n//', Aria.__sourceUrlPrefix, ' sourceURL=', Aria.rootFolderPath, srcURL, '\n'].join('');
    }
    return eval(srcJS);
};
