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

    var jsonUtils = (require("../utils/Json"));
    var typeUtils = (require("../utils/Type"));

    /**
     * The JSON Validator does two main operations:
     * <ul>
     * <li> a preprocessing operation is done when loading a bean package (BP) definition. <br />
     * During this operation, every bean definition in the package is annotated, so that it contains a reference to the
     * bean definition of its immediate super bean and its base built-in type, and bean inheritance is processed
     * (propagation of object properties of a bean to the beans which extend it). After the preprocessing of a bean, its
     * default value, if provided, is checked so that it matches the definition.</li>
     * <li> the processing is done when validating an instance of a JSON object against the bean definition it is
     * supposed to comply with. </li>
     * </ul>
     * Note: this class is tightly linked with JsonTypesCheck, to keep files with a reasonable size. Be carefull if
     * changing something: any protected method in this class (method whose name starts with one underscore) may be
     * called from JsonTypesCheck. Private methods (starting with two underscores) are not called from JsonTypesCheck.
     * @dependencies ["aria.utils.Type", "aria.utils.Json", "aria.core.JsonTypesCheck"]
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.core.JsonValidator",
        $singleton : true,

        $constructor : function () {
            /**
             * Map of bean packages whose dependencies are not yet loaded. The key in the map is the package name
             * @type Object
             * @private
             */
            this.__waitingBeans = {};

            /**
             * Map of all loaded bean packages (already preprocessed). The key in the map is the package name
             * @type Object
             * @private
             */
            this.__loadedBeans = {};

            /**
             * Map of processed beans, for direct access
             * @type Object
             * @private
             */
            this.__processedBeans = {};

            /**
             * Map of all base types. The key in the map is the short type name (e.g.: String, does not include package
             * name).
             * @type Object
             * @private
             */
            this.__baseTypes = {};

            /**
             * Options for current preprocessing and/or processing. All these options are boolean values.
             * @type Object
             * @protected
             */
            this._options = {
                /**
                 * addDefaults: When processing, if true, add default values when they are missing.
                 */
                addDefaults : true, // Be aware that this will be changed when calling check or normalize
                /**
                 * checkEnabled: When false, check is disabled, so that calls to check are ignored and normalizing do
                 * only minimal checking to add default values.
                 */
                checkEnabled : Aria.debug,
                /**
                 * checkDefaults: When preprocessing, if true, also do processing to check that default values are
                 * valid.
                 */
                checkDefaults : true,
                /**
                 * checkMultiTypes: when processing, if false, does not check validity of instances of multitypes
                 * (multitypes can be ambiguous to validate)
                 */
                checkMultiTypes : false,
                /**
                 * checkInheritance: when preprocessing, if true, when a bean inherits from another bean, its properties
                 * (if the bean's type is an object) or its content type (if the bean's type is a map or array) must
                 * inherit (either directly or through several beans) from the corresponding parent properties or
                 * content type
                 */
                checkInheritance : true,
                /**
                 * checkBeans: when true, use aria.core.BaseTypes to validate bean definitions when they are
                 * preprocessed.
                 */
                checkBeans : true,
                /**
                 * Throws errors instead of logging them
                 * @type Boolean
                 */
                throwsErrors : false
            };

            /**
             * Array of error objects. This array of errors may be sent to this.$log at the end of the processing if
             * they are not discarded (they may be discarded, for example, in the case of the MultiTypes which may fail
             * for several types before succeeding, so errors are discarded) Error objects structure:
             * @type Array
             * @protected
             *
             * <pre>
             *  {
             *    msgId: {String} the message key in the resource file
             *    msgArgs: {Array} the arguments provided with the message
             *  }
             * </pre>
             */
            this._errors = [];

            /**
             * Name of the Bean being preprocessed. Used in error reporting.
             * @protected
             * @type String
             */
            this._currentBeanName = "JSON root";

            // reference object to tag the type being computed
            this._typeBeingComputed = {
                typeName : 'typeBeingComputed'
            };

            /**
             * Fake typeRef used as a generic error typeRed
             * @protected
             * @type Object
             */
            this._typeError = {
                typeName : 'typeError'
            };

            this._typeRefError = {};
            this._typeRefError[this._MD_BUILTIN] = true;
            this._typeRefError[this._MD_BASETYPE] = this._typeError;

        },
        $destructor : function () {
            this.__waitingBeans = null;
            this.__loadedBeans = null;
        },
        $statics : {
            // ERROR MESSAGES:

            /* Pre-processing errors (errors in bean definition): */
            INVALID_TYPE_NAME : "Invalid or missing $type in %1: %2",
            INVALID_TYPE_REF : "Type %1, found in %2, is not defined in package %3",
            UNDEFINED_PREFIX : "Prefix %1, found in %2, is not defined",
            MISSING_BEANSPACKAGE : "Beans package %1, referenced in %2, was not found",
            RECURSIVE_BEAN : "Recursive bean definition in %1",
            BOTH_MANDATORY_DEFAULT : "$mandatory=true and $default should not be specified at the same time in %1",
            INHERITANCE_EXPECTED : "Type %1 should inherit from %2",
            MISSING_CONTENTTYPE : "Missing $contentType in the %1 definition in %2",
            ENUM_DUPLICATED_VALUE : "Duplicated value '%1' in enum definition %2",
            ENUM_INVALID_INHERITANCE : "Value '%1', from %2, is not present in parent enum definition %3",
            INVALID_DEFAULTVALUE : "Default value %1 in %2 is invalid: %3",
            BEANCHECK_FAILED : "Checking bean definition %1 with beans schema failed: %2",
            MISSING_ENUMVALUES : "$enumValues must be defined and non-empty in the Enum definition in %1",
            INVALID_NAME : "Invalid name for a bean: %1 in %2",
            NUMBER_INVALID_INHERITANCE : "Invalid inheritance: %1 in %2 should respect its parent range",
            NUMBER_INVALID_RANGE : "Invalid range in %1: %2-%3",

            /* Processing errors (errors in the JSON checked) */
            BEAN_NOT_FOUND : "Bean %1 was not found",
            INVALID_CONFIGURATION : "%1 configuration is not valid.",
            INVALID_TYPE_VALUE : "Invalid type: expected type %1 (from %2), found incorrect value '%3' in %4",
            INVALID_MULTITYPES_VALUE : "The value found in %1 is not valid for all the types defined in %2: %3",
            ENUM_UNKNOWN_VALUE : "Value '%1' in %2 is not in the enum definition %3",
            UNDEFINED_PROPERTY : "Property '%1', used in %2, is not defined in %3",
            MISSING_MANDATORY : "Missing mandatory attribute in %1 for definition %2",
            REGEXP_FAILED : "Value '%1' in %2 does not comply with RegExp %3 in %4",
            NUMBER_RANGE : "Number '%1' in %2 is not in the accepted range (%3=%4)",
            NOT_OF_SPECIFIED_CLASSPATH : "Invalid class instance: expected instance of class %1 (from %2), found incorrect value '%3' in %4"
        },
        $prototype : {

            // Meta-data names used to annotate beans definitions for preprocessing and processing:
            _MD_TYPENAME : Aria.FRAMEWORK_PREFIX + 'typeName', // the complete string path to the current bean
            _MD_BASETYPE : Aria.FRAMEWORK_PREFIX + 'baseType', // an object reference to one of the base types
            _MD_PARENTDEF : Aria.FRAMEWORK_PREFIX + 'parentType', // an object reference to the parent bean definition
            _MD_BUILTIN : Aria.FRAMEWORK_PREFIX + 'builtIn', // true if the bean is a base bean
            _MD_ENUMVALUESMAP : Aria.FRAMEWORK_PREFIX + 'enumValuesMap', // for a bean of type Array, a map with the
            // accepted values

            _MD_STRDEFAULT : Aria.FRAMEWORK_PREFIX + 'strDefault', // string that evaluates to default value

            _BASE_TYPES_PACKAGE : 'aria.core.JsonTypes', // the beans package which contains base types
            // (this special package does not completely respect the general grammar,
            // because base types do not have a parent type)
            _BEANS_SCHEMA_PACKAGE : 'aria.core.BaseTypes', // the beans package used to check beans during
            // preprocessing

            /**
             * Add an error to the local logs array, which may be sent later to this.$log or discarded.
             * @param {String} msgId
             * @param {Object} msgArgs
             */
            _logError : function (msgId, msgArgs) {
                this._errors.push({
                    msgId : msgId,
                    msgArgs : msgArgs
                });
            },

            /**
             * Log all errors.
             * @param {Array} array of errors
             * @param {Boolean} throwsErrors (default false)
             * @return {Boolean} True if there were no error, false otherwise.
             */
            __logAllErrors : function (errors, throwsErrors) {
                if (errors.length === 0) {
                    return true;
                }
                if (!throwsErrors) {
                    for (var i = 0; i < errors.length; i++) {
                        this.$logError(errors[i].msgId, errors[i].msgArgs);
                    }
                } else {
                    var error = new Error();
                    error.errors = errors;
                    throw error;
                }
                return false;
            },

            /**
             * Find the given type in the given bean package.
             * @param {aria.core.BaseTypes:Package} packageDef bean package
             * @param {String} typeName type name. May not contain ':'. Contains the path to the bean inside the package
             * bp.
             * @return {aria.core.BaseTypes:Bean} definition of the requested bean, or this._typeRefError if it could
             * not be found
             */
            __findTypeInBP : function (packageDef, typeName) {
                var path = {
                    '$properties' : packageDef.$beans
                };
                var typeParts = typeName.split('.');
                for (var i = 0; i < typeParts.length; i++) {
                    var elt = typeParts[i];
                    if (elt == '$contentType' && path.$contentType) {
                        // the content type of an Array or a Map can be used
                        // as a type elsewhere
                        path = path.$contentType;
                    } else if (typeof(path.$properties) == 'object' && path.$properties != null) {
                        path = path.$properties[elt];
                    } else {
                        path = null;
                    }
                    if (typeof(path) != 'object' || path == null) {
                        this._logError(this.INVALID_TYPE_REF, [typeName, this._currentBeanName, packageDef.$package]);
                        return this._typeRefError;
                    }
                }
                return path;
            },

            /**
             * Find a bean definition by its type name. It relies on the bean package currently being processed.
             * @param {String} typeName A string composed of two parts: 'namespace:value' where the namespace is
             * optional if the value refers a type defined in the package currently being processed.
             * @param {aria.core.BaseTypes:Package} packageDef reference package
             * @return {aria.core.BaseTypes:Bean} definition of the requested bean, or this._typeRefError if it could
             * not be found
             */
            __getTypeRef : function (typeName, packageDef) {
                var packageName, otherBP;
                var i = typeName.indexOf(':');
                // if no semicolumn, type is defined inside this package
                if (i == -1) {
                    packageName = packageDef.$package;
                    otherBP = packageDef;
                } else {
                    var ns = typeName.substr(0, i);
                    typeName = typeName.substr(i + 1);
                    packageName = (packageDef.$namespaces == null ? null : packageDef.$namespaces[ns]);
                    if (typeUtils.isObject(packageName)) {
                        packageName = packageName.$package;
                    }
                    if (!packageName) {
                        this._logError(this.UNDEFINED_PREFIX, [ns, this._currentBeanName]);
                        return this._typeRefError;
                    }
                }

                var fullName = packageName + "." + typeName;
                var typeRef = this.__processedBeans[fullName];
                if (typeRef) {
                    return typeRef;
                }

                if (!otherBP) {
                    otherBP = this.__loadedBeans[packageName];
                    if (!otherBP) {
                        this._logError(this.MISSING_BEANSPACKAGE, [packageName, this._currentBeanName]);
                        return this._typeRefError;
                    }
                }

                typeRef = this.__findTypeInBP(otherBP, typeName);

                // update this type name with fully qualified name
                if (typeRef != this._typeError && !typeRef[this._MD_TYPENAME]) {
                    typeRef[this._MD_TYPENAME] = fullName;
                }

                return typeRef;
            },

            /**
             * Preprocess the given bean definition (if not already done) and return its base type.
             * @param {aria.core.BaseTypes:Bean} beanDef bean to be preprocessed
             * @param {String} beanName fully qualified name for this bean
             * @param {aria.core.BaseTypes:Package} packageDef reference package
             */
            _preprocessBean : function (beanDef, beanName, packageDef) {

                // used for error reporting
                this._currentBeanName = beanName;

                var baseType = beanDef[this._MD_BASETYPE];

                // check if base type is already defined for this bean definition (already preprocessed)
                if (baseType) {
                    return baseType;
                }

                beanDef[this._MD_TYPENAME] = beanName;

                // temporary value to avoid an infinite loop in case of a recursive type definition:
                beanDef[this._MD_BASETYPE] = this._typeBeingComputed;

                var typeName = beanDef.$type;
                var typeRef = this._typeRefError;

                // check if this is valid declared type
                if (typeof(typeName) != "string" || !typeName) {
                    this._logError(this.INVALID_TYPE_NAME, [beanDef[this._MD_TYPENAME], typeName]);
                    return this._typeError;
                } else {
                    // retrieve type reference
                    typeRef = this.__getTypeRef(typeName, packageDef);
                }

                // store parent type
                beanDef[this._MD_PARENTDEF] = typeRef;
                // update typeName with fully qualified typeName
                typeName = typeRef[this._MD_TYPENAME];

                // preprocess reference type if not done yet
                baseType = this._preprocessBean(typeRef, typeName, packageDef);
                if (baseType == this._typeBeingComputed) {
                    // a recursive definition is normal for base types
                    if (packageDef.$package == this._BASE_TYPES_PACKAGE) {
                        return this._getBuiltInBaseType(beanDef);
                    }
                    // there was a recursive type definition
                    this._logError(this.RECURSIVE_BEAN, beanDef[this._MD_TYPENAME]);
                    return this._typeError;
                }

                beanDef[this._MD_BASETYPE] = baseType;

                // check this bean definition with given base type
                if (!this.__checkBean(beanDef)) {
                    beanDef[this._MD_BASETYPE] = this._typeError;
                }

                // description inheritance
                if (!beanDef.$description && !typeRef[this._MD_BUILTIN]) {
                    beanDef.$description = typeRef.$description;
                }

                var hasNoDefault = !("$default" in beanDef), hasNoMandatory = !("$mandatory" in beanDef);

                // mandatory and default value inheritance
                if (hasNoDefault && hasNoMandatory) {
                    beanDef.$mandatory = false;
                    hasNoMandatory = false;
                }
                if (hasNoMandatory) {
                    beanDef.$mandatory = typeRef.$mandatory;
                }
                if (hasNoDefault && ("$default" in typeRef) && !beanDef.$mandatory) {
                    beanDef.$default = jsonUtils.copy(typeRef.$default);
                    // Even if the child does not redefine the default value, the child default value may end up being
                    // different from the parent default value
                    // e.g. if the child defines more sub-properties with default values
                    // so it's important to compute $strDefault again for each bean, and NOT to uncomment the following
                    // WRONG shortcut:
                    // beanDef.$simpleCopyType = typeRef.$simpleCopyType;
                    // beanDef.$strDefault = typeRef.$strDefault;
                }

                var tempFastNorm = baseType && baseType.makeFastNorm && !beanDef.$fastNorm;
                if (tempFastNorm) {
                    // Prepare with empty $fastNorm and $getDefault functions because the existence of those functions
                    // can be checked during the call to baseType.preprocess.
                    // This happens especially in case the bean structure is recursive.
                    beanDef.$fastNorm = Aria.returnNull;
                    beanDef.$getDefault = Aria.returnNull;
                }

                // apply baseType preprocessing if any
                if (baseType && baseType.preprocess) {
                    baseType.preprocess(beanDef, beanName, packageDef);
                }

                // if an error occur during preprocessing, return error type
                if (beanDef[this._MD_BASETYPE] == this._typeError) {
                    return this._typeError;
                }

                if (tempFastNorm) {
                    // generate fast normalizer
                    baseType.makeFastNorm(beanDef);
                }

                // apply default configuration.
                if ("$default" in beanDef) {

                    // there cannot be default and mandatory at the same time
                    if (beanDef.$mandatory === true) {
                        this._logError(this.BOTH_MANDATORY_DEFAULT, beanDef[this._MD_TYPENAME]);
                        return this._typeError;
                    }

                    // normalize default values in needed
                    if (this._options.checkDefaults) {

                        // save error state as normalization will erase it
                        var currentErrors = this._errors;
                        this._errors = [];

                        var errors = this._processJsonValidation({
                            beanDef : beanDef,
                            json : beanDef.$default
                        });

                        // restaure errors
                        this._errors = currentErrors;

                        if (errors.length > 0) {
                            this._logError(this.INVALID_DEFAULTVALUE, [beanDef.$default, beanDef[this._MD_TYPENAME],
                                    errors]);

                            return this._typeError;
                        }
                    }

                    var defaultValue = beanDef.$default;

                    // simpleCopyType help to fasten copy of element
                    if (!("$simpleCopyType" in beanDef)) {
                        beanDef.$simpleCopyType = !defaultValue || typeUtils.isString(defaultValue)
                                || typeUtils.isNumber(defaultValue) || defaultValue === true;
                    }

                    // strDefault is a string representation of the default value, used in fast normalization
                    if (!beanDef.$strDefault) {
                        // make a string with "reversible" set to true, or null if cannot convert
                        beanDef.$strDefault = jsonUtils.convertToJsonString(defaultValue, {
                            reversible : true
                        });
                        // getDefault is only used for types providing fast normalization
                        if (beanDef.$fastNorm) {
                            beanDef.$getDefault = new Function("return " + beanDef.$strDefault + ";");
                        }
                    }
                }

                // store processed bean definition
                this.__processedBeans[beanName] = beanDef;

                return baseType;
            },

            /**
             * Main function to preprocess a bean package definition. All dependencies should have already bean loaded.
             * @param {aria.core.BaseTypes:Package} def
             */
            __preprocessBP : function (def) {

                // prepare error stack
                this._errors = [];

                var beans = def.$beans;
                for (var beanName in beans) {
                    if (!beans.hasOwnProperty(beanName) || beanName.indexOf(':') != -1) {
                        continue;
                    }
                    // check that keys for beans are valid
                    if (!Aria.checkJsVarName(beanName)) {
                        this._logError(this.INVALID_NAME, [beanName, this._currentBeanName]);
                    }
                    this._preprocessBean(beans[beanName], def.$package + "." + beanName, def);
                }

                return this._errors;
            },

            /**
             * Preprocessing function for base types of package aria.core.JsonTypes
             * @param {aria.core.BaseTypes:Bean} beanDef
             */
            _getBuiltInBaseType : function (beanDef) {
                var typeDef = this.__baseTypes[beanDef.$type];
                this.$assert(298, typeDef != null);
                beanDef[this._MD_BUILTIN] = true;
                beanDef[this._MD_BASETYPE] = typeDef;
                beanDef[this._MD_TYPENAME] = [this._BASE_TYPES_PACKAGE, typeDef.typeName].join('.');
            },

            /**
             * Add the given base type to the list of errors. It is called from JsonTypesCheck.js.
             * @param {Object} typeDef [typeDef] { typeName: {String} name of the base type preprocess(beanDef):
             * (Function) executed during preprocessing process(args): (Function) executed during processing dontSkip:
             * {Boolean} if true, preprocess and process will still be called even when check is disabled
             */
            _addBaseType : function (typeDef) {
                this.__baseTypes[typeDef.typeName] = typeDef;
                if (!(typeDef.dontSkip || this._options.checkEnabled)) {
                    typeDef.process = null;
                    typeDef.preprocess = null;
                }
            },

            /**
             * Check that the given json complies with the given bean (recursive function).
             * @param {Object} args
             *
             * <pre>
             *  {
             *    dataHolder: //, container
             *    dataName: //, name of the property in the container
             *    value: //, current value
             *    beanDef: // bean definition used to check the value
             *    path : // Path in the current object being check
             *  }
             * </pre>
             */
            _checkType : function (args) {
                var beanDef = args.beanDef;
                var baseType = beanDef[this._MD_BASETYPE];
                if (args.value == null) {
                    if (beanDef.$mandatory) {
                        this._logError(this.MISSING_MANDATORY, [args.path, beanDef[this._MD_TYPENAME]]);
                    } else if ("$default" in beanDef && this._options.addDefaults) {
                        if (beanDef.$simpleCopyType) {
                            args.value = beanDef.$default;
                        } else {
                            args.value = jsonUtils.copy(beanDef.$default);
                        }
                        args.dataHolder[args.dataName] = args.value;
                    }
                    // if there is no value originally provided, we do not check it
                    // the default value should already have been checked in preprocessing
                    return;
                }
                if (baseType.process) {
                    baseType.process(args);
                }
            },

            /**
             * Get a bean from its string reference.
             * @param {String} strType The fully qualified bean name, ex:
             * aria.widgets.calendar.CfgBeans.CalendarSettings
             * @return {aria.core.BaseTypes:Bean} The bean definition if strType is valid, or null otherwise.
             */
            _getBean : function (strType) {
                return this.__processedBeans[strType] || null;
            },

            /**
             * Process the validation of a Json object with the given bean definition.
             * @param args [args] { beanName/beanDef: beanName or beanDef json: structure to validate } Return the array
             * of errors.
             */
            _processJsonValidation : function (args) {
                var beanDef = (args.beanDef ? args.beanDef : this._getBean(args.beanName));
                if (!beanDef) {
                    this._errors = [];
                    this._logError(this.BEAN_NOT_FOUND, args.beanName);
                    return this._errors;
                }

                // default slow behaviour
                if (this._options.checkEnabled) {
                    this._errors = [];
                    // launching the validation process
                    this._checkType({
                        dataHolder : args,
                        dataName : 'json',
                        path : 'ROOT',
                        value : args.json,
                        beanDef : beanDef
                    });
                    var res = this._errors;
                    return res;
                } else {
                    if (beanDef.$fastNorm) {
                        args.json = beanDef.$fastNorm(args.json);
                    }
                    return [];
                }
            },

            /**
             * Called when preprocessing, just after having determined the type of bean. If beans check is enabled and
             * multitypes check is disabled, it checks that the bean is valid according to the corresponding schema in
             * aria.core.BaseTypes
             * @param {aria.core.BaseTypes:Bean} bean to check
             */
            __checkBean : function (beanDef) {
                if (this._options.checkBeans && (!this._options.checkMultiTypes)
                        && this.__loadedBeans[this._BEANS_SCHEMA_PACKAGE]) {
                    var baseType = beanDef[this._MD_BASETYPE];
                    if (baseType == this._typeError) {
                        return false;
                    }
                    var beanChecker = this._getBean(this._BEANS_SCHEMA_PACKAGE + '.' + baseType.typeName);
                    this.$assert(402, beanChecker != null); // every type must be defined in the schema

                    // make a copy of current errors as normalization will erase them
                    var currentErrors = this._errors;
                    var errors = this._processJsonValidation({
                        beanDef : beanChecker,
                        json : beanDef
                    });
                    // restaure errors
                    this._errors = currentErrors;

                    if (errors.length > 0) {
                        this._logError(this.BEANCHECK_FAILED, [this._currentBeanName, errors]);
                        return false;
                    }

                }
                return true;
            },

            /**
             * Load the specified beans package.
             * @param {String} bp beans package
             */
            __loadBeans : function (bp) {
                var noerrors = true;

                // bean definition will be available in the waiting beans
                var def = this.__waitingBeans[bp];
                delete this.__waitingBeans[bp];

                this.$assert(58, def);

                // validate incoming definition
                if (this._options.checkBeans && this.__loadedBeans[this._BEANS_SCHEMA_PACKAGE]) {
                    var bean = this._getBean(this._BEANS_SCHEMA_PACKAGE + '.Package');
                    this.$assert(428, bean != null);
                    noerrors = noerrors && this.__logAllErrors(this._processJsonValidation({
                        beanDef : bean,
                        json : def
                    }));
                }

                this._options.addDefaults = true;
                noerrors = noerrors && this.__logAllErrors(this.__preprocessBP(def));
                if (noerrors) {
                    this.__loadedBeans[bp] = def;
                    return def;
                } else {
                    throw new Error("Error while loading " + bp);
                }
            },

            // PUBLIC API

            /**
             * Base method used to declare beans. You should use Aria. beanDefinitions instead of this method.
             * @param {aria.core.BaseTypes:Package} beans beans package to declare
             */
            beanDefinitions : function (def) {
                var bp = def.$package; // beans package
                Aria.$classes.push({
                    $classpath : bp
                });
                this.__waitingBeans[bp] = def;
                var dep = [];

                // load missing dependencies

                // add $dependencies
                var dependencies = def.$dependencies || [];
                if (dependencies.length) {
                    dep = dep.concat(dependencies);
                }

                // add bean definition from namespaces
                for (var key in def.$namespaces) {
                    if (def.$namespaces.hasOwnProperty(key)) {
                        dep.push(def.$namespaces[key]);
                    }
                }

                return Aria.loadOldDependencies({
                    classpaths : {
                        "JS" : dep
                    },
                    oldModuleLoader : def.$oldModuleLoader,
                    complete : {
                        scope : this,
                        fn : this.__loadBeans,
                        args : [bp]
                    }
                });
            },

            /**
             * Check that the json structure complies with the given bean and add default values. All errors are logged.
             * @param {Object} args
             *
             * <pre>
             *  {
             *    json: json to check.
             *    beanName: bean to use
             *  }
             * </pre>
             *
             * @param {Boolean} throwsErrors (default false)
             * @return {Boolean} true if the json structure complies with the given bean, false otherwise
             */
            normalize : function (args, throwsErrors) {
                this._options.addDefaults = true;
                // publicly allowing the user to give the bean definition without it
                // being loaded is not supported:
                args.beanDef = null;
                return this.__logAllErrors(this._processJsonValidation(args), throwsErrors);
            },

            /**
             * Check that the json structure complies with the given bean. All errors are logged.
             * @param {Object} json json to check;
             * @param {String} bean bean to use
             * @param {Boolean} throwsErrors (default false)
             * @return {Boolean} true if the json structure complies with the given bean, false otherwise
             */
            check : function (json, beanName, throwsErrors) {
                if (!this._options.checkEnabled) {
                    return true;
                }
                this._options.addDefaults = false;
                return this.__logAllErrors(this._processJsonValidation({
                    json : json,
                    beanName : beanName
                }), throwsErrors);
            },

            /**
             * Validate a configuration object compared to its definition. All errors are logged.
             * @param {String} cfgBeanName The configuration classpath;
             * @param {Object} cfg The configuration bean to validate
             * @param {Object} errorToLog Optional json. By default, the INVALID_CONFIGURATION message is used with the
             * conrfiguration bean name.
             *
             * <pre>
             * {
             *      msg : {String} log message used with $logError,
             *      params : {Array} parameters used with $logError,
             * }
             * </pre>
             *
             * @return {Boolean} true if the configuration is valid.
             */
            validateCfg : function (cfgBeanName, cfg, errorToLog) {
                var cfgOk = false;
                try {
                    cfgOk = this.normalize({
                        json : cfg,
                        beanName : cfgBeanName
                    }, true);
                } catch (e) {
                    // aria.core.Log may not be available
                    var logs = aria.core.Log;
                    if (logs) {
                        var error, errors = e.errors;
                        for (var index = 0, l = errors.length; index < l; index++) {
                            error = errors[index];
                            error.message = logs.prepareLoggedMessage(error.msgId, error.msgArgs);
                        }

                        errorToLog = errorToLog || {
                            msg : this.INVALID_CONFIGURATION,
                            params : [cfgBeanName]
                        };
                        this.$logError(errorToLog.msg, errorToLog.params, e);
                    }
                }
                return cfgOk;
            },

            /**
             * Get a bean from its string reference.
             * @param {String} The fully qualified bean name, ex: aria.widgets.calendar.CfgBeans.CalendarSettings
             * @return {MultiTypes} The bean definition if it exists and is loaded, or null otherwise.
             */
            getBean : function (beanName) {
                return this._getBean(beanName);
            }
        }
    });
})();

(function () {
    // augment JsonValidator with base types from JsonTypesCheck
    var baseTypes = require("./JsonTypesCheck").baseTypes;
    var jv = module.exports;
    for (var i = 0, length = baseTypes.length; i < length; i++) {
        jv._addBaseType(baseTypes[i]);
    }
})();
