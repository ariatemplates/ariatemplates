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
var ariaCoreJsonValidator = require("./JsonValidator");


(function () {
    /*
     * Note: this class is tightly linked with JsonValidator, to keep files with a reasonnable size It is normal for
     * this class to call protected methods in JsonValidator (method whose name starts with only one underscore)
     */

    // shortcuts
    var jv = ariaCoreJsonValidator;

    /**
     * Utility function which logs a bad type error.
     * @private
     * @param {Object} baseType
     * @param {Object} args
     */
    var __badTypeError = function (baseType, args) {
        jv._logError(jv.INVALID_TYPE_VALUE, [baseType.typeName, args.beanDef[jv._MD_TYPENAME], args.value, args.path]);
    };

    /**
     * Check that childType inherits from parentType and log any error.
     * @private
     */
    var __checkInheritance = function (parentType, childType) {
        if (!jv._options.checkInheritance) {
            return true;
        }
        var typeRef = childType;
        while (!typeRef[jv._MD_BUILTIN]) {
            if (parentType == typeRef) {
                return true;
            }
            typeRef = typeRef[jv._MD_PARENTDEF];
        }
        jv._logError(jv.INHERITANCE_EXPECTED, [childType[jv._MD_TYPENAME], parentType[jv._MD_TYPENAME]]);
        return false;
    };

    /**
     * Preprocess the content type of the given bean definition
     * @private
     * @param {aria.core.BaseTypes:Bean} beanDef bean to be preprocessed
     * @param {String} beanName fully qualified name for this bean
     * @param {aria.core.BaseTypes:Package} packageDef reference package
     */
    var __checkContentType = function (beanDef, beanName, packageDef) {
        var contentType = beanDef.$contentType;
        var parentContentType = null;
        var parent = beanDef[jv._MD_PARENTDEF];
        if (!parent[jv._MD_BUILTIN]) {
            parentContentType = parent.$contentType;
            if (contentType == null) {
                beanDef.$contentType = parentContentType;
                return;
            }
        } else if (contentType == null) {
            jv._logError(jv.MISSING_CONTENTTYPE, [beanDef[jv._MD_BASETYPE].typeName, beanDef[jv._MD_TYPENAME]]);
            beanDef[jv._MD_BASETYPE] = jv._typeError;
            return;
        }
        jv._preprocessBean(contentType, beanName + ".$contentType", packageDef);
        if (parentContentType != null) {
            __checkInheritance(parentContentType, contentType);
        }
    };

    /**
     * Preprocess the key type of the given bean definition
     * @private
     * @param {aria.core.BaseTypes:Bean} beanDef bean to be preprocessed
     * @param {String} beanName fully qualified name for this bean
     * @param {aria.core.BaseTypes:Package} packageDef reference package
     */
    var __checkKeyType = function (beanDef, beanName, packageDef) {
        var keyType = beanDef.$keyType;
        var parentKeyType = null;
        var parent = beanDef[jv._MD_PARENTDEF];
        if (!parent[jv._MD_BUILTIN]) {
            parentKeyType = parent.$keyType;
            if (keyType == null) {
                beanDef.$keyType = parentKeyType;
                return;
            }
        } else if (keyType == null) {
            // keyType not specified
            return;
        }
        jv._preprocessBean(keyType, beanName + ".$keyType", packageDef);
        if (parentKeyType != null) {
            __checkInheritance(parentKeyType, keyType);
        }
        // in all cases, keyType must be a sub-type of aria.core.JsonTypes.String
        if (keyType[jv._MD_BASETYPE].typeName != "String") {
            jv._logError(jv.INHERITANCE_EXPECTED, [keyType[jv._MD_TYPENAME], jv._BASE_TYPES_PACKAGE + ".String"]);
            return;
        }
    };

    /**
     * Processing function for regular expressions
     * @private
     */
    var __checkRegExp = function (args) {
        if (typeof(args.value) != 'string') {
            return __badTypeError(this, args); // this refers to the correct object (a base type)
        }
        var beanDef = args.beanDef;
        while (!beanDef[jv._MD_BUILTIN]) {
            var regexp = beanDef.$regExp;
            if (regexp != null) {
                if (!regexp.test(args.value)) {
                    return jv._logError(jv.REGEXP_FAILED, [args.value, args.path, regexp, beanDef[jv._MD_TYPENAME]]);
                }
            }
            beanDef = beanDef[jv._MD_PARENTDEF];
        }
    };

    /**
     * Common preprocessing function for floats and integers.
     * @private
     * @param {aria.core.BaseTypes:Bean} beanDef
     */
    var __numberPreprocess = function (beanDef) {
        var parent = beanDef[jv._MD_PARENTDEF];
        if (typeof(parent.$minValue) != "undefined") {
            if (typeof(beanDef.$minValue) == "undefined") {
                beanDef.$minValue = parent.$minValue;
            } else if (beanDef.$minValue < parent.$minValue) {
                jv._logError(jv.NUMBER_INVALID_INHERITANCE, ["$minValue", beanDef[jv._MD_TYPENAME]]);
            }
        }
        if (typeof(parent.$maxValue) != "undefined") {
            if (typeof(beanDef.$maxValue) == "undefined") {
                beanDef.$maxValue = parent.$maxValue;
            } else if (beanDef.$maxValue > parent.$maxValue) {
                jv._logError(jv.NUMBER_INVALID_INHERITANCE, ["$maxValue", beanDef[jv._MD_TYPENAME]]);
            }
        }
        if (typeof(beanDef.$minValue) != "undefined" && typeof(beanDef.$maxValue) != "undefined"
                && beanDef.$minValue > beanDef.$maxValue) {
            jv._logError(jv.NUMBER_INVALID_RANGE, [beanDef[jv._MD_TYPENAME], beanDef.$minValue, beanDef.$maxValue]);
        }
    };

    /**
     * Common processing function for floats and integers.
     * @private
     * @param {Object} args
     */
    var __numberProcess = function (args) {
        var v = args.value;
        var beanDef = args.beanDef;
        if (typeof(v) != 'number') {
            return __badTypeError(this, args);
        }
        if (typeof(beanDef.$minValue) != "undefined" && v < beanDef.$minValue) {
            return jv._logError(jv.NUMBER_RANGE, [args.value, args.path, "$minValue", beanDef.$minValue]);
        }
        if (typeof(beanDef.$maxValue) != "undefined" && v > beanDef.$maxValue) {
            return jv._logError(jv.NUMBER_RANGE, [args.value, args.path, "$maxValue", beanDef.$maxValue]);
        }
    };

    /**
     * Return true if the given bean has a fast normalization function.
     * @private
     * @param {aria.core.BaseTypes:Bean} beanDef
     * @return {Boolean}
     */
    var hasFastNorm = function (beanDef) {
        return beanDef[jv._MD_BASETYPE].makeFastNorm;
    };

    /**
     * List of base types. Contains object like
     * @type Array
     * @private
     *
     * <pre>
     *     {
     *         typeName : // base type name
     *      process : // processing method for value checking and normalization
     *      dontSkip : // specifies that this bean have to be preprocessed in any case
     *      preprocess : // prepocessing function, used during bean preprocessing
     *     }
     * </pre>
     */
    var baseTypes = [{
                typeName : "String",
                process : __checkRegExp
            }, {
                typeName : "Boolean",
                process : function (args) {
                    if (typeof(args.value) != 'boolean') {
                        return __badTypeError(this, args);
                    }
                }
            }, {
                typeName : "JsonProperty",
                process : function (args) {
                    if (typeof(args.value) == 'string') {
                        if (Aria.isJsReservedWord(args.value)
                                || !/^([a-zA-Z_\$][\w\$]*(:[\w\$]*)?)|(\d+)$/.test(args.value)) {
                            return __badTypeError(this, args);
                        }
                    } else if (typeof(args.value) != 'number' || parseInt(args.value, 10) != args.value) {
                        return __badTypeError(this, args);
                    }
                }
            }, {
                typeName : "FunctionRef",
                process : function (args) {
                    if (typeof(args.value) != 'function') {
                        return __badTypeError(this, args);
                    }
                }
            }, {
                typeName : "Date",
                process : function (args) {
                    if (isNaN(Date.parse(args.value))) {
                        return __badTypeError(this, args);
                    }

                }
            }, {
                typeName : "RegExp",
                process : function (args) {
                    var v = args.value;
                    // In FireFox and IE: typeof(regexp)=='object'
                    // whereas with Safari, typeof(regexp)=='function'
                    if ((typeof(v) != 'object' && typeof(v) != 'function') || v == null || v.constructor != RegExp) {
                        return __badTypeError(this, args);
                    }
                }
            }, {
                typeName : "ObjectRef",
                process : function (args) {
                    if (typeof(args.value) != 'object' || args.value == null) {
                        return __badTypeError(this, args);
                    }
                    var classpath = args.beanDef.$classpath;
                    if (classpath && !ariaUtilsType.isInstanceOf(args.value, classpath)) {
                        jv._logError(jv.NOT_OF_SPECIFIED_CLASSPATH, [classpath, args.beanDef[jv._MD_TYPENAME],
                                args.value, args.path]);
                        return;
                    }
                }
            },

            // base type with preprocessing

            {
                typeName : "Integer",
                preprocess : __numberPreprocess,
                process : function (args) {
                    if (parseInt(args.value, 10) !== args.value) {
                        return __badTypeError(this, args);
                    }
                    __numberProcess.call(this, args);
                }
            }, {
                typeName : "Float",
                preprocess : __numberPreprocess,
                process : __numberProcess
            }, {
                typeName : "Enum",
                preprocess : function (beanDef) {
                    var ev = beanDef.$enumValues;
                    var parent = beanDef[jv._MD_PARENTDEF];
                    var pmap = null;
                    if (!parent[jv._MD_BUILTIN]) {
                        pmap = parent[jv._MD_ENUMVALUESMAP];
                        if (ev == null) {
                            beanDef[jv._MD_ENUMVALUESMAP] = pmap;
                            return;
                        }
                    } else if (ev == null || ev.length === 0) {
                        ev = [];
                        jv._logError(jv.MISSING_ENUMVALUES, [beanDef[jv._MD_TYPENAME]]);
                    }
                    var map = {};
                    for (var i = 0; i < ev.length; i++) {
                        var v = ev[i];
                        if (map[v] == 1) {
                            jv._logError(jv.ENUM_DUPLICATED_VALUE, [v, beanDef[jv._MD_TYPENAME]]);
                        } else if (pmap && pmap[v] != 1) {
                            jv._logError(jv.ENUM_INVALID_INHERITANCE, [v, beanDef[jv._MD_TYPENAME],
                                    parent[jv._MD_TYPENAME]]);
                        } else {
                            map[v] = 1;
                        }
                    }
                    beanDef[jv._MD_ENUMVALUESMAP] = map;
                },
                process : function (args) {
                    if (typeof(args.value) != 'string') {
                        return __badTypeError(this, args);
                    }
                    var map = args.beanDef[jv._MD_ENUMVALUESMAP];
                    if (map[args.value] != 1) {
                        jv._logError(jv.ENUM_UNKNOWN_VALUE, [args.value, args.path, args.beanDef[jv._MD_TYPENAME]]);
                    }
                }
            }, {
                typeName : "Object",
                dontSkip : true,
                preprocess : function (beanDef, beanName, packageDef) {
                    /* this function is used for the inheritance of properties */
                    /* at this stage, the parent has already been processed */
                    var parentBean = beanDef[jv._MD_PARENTDEF];

                    // normalize properties based on parent properties
                    beanDef.$restricted = (beanDef.$restricted === false) ? false : (parentBean.$restricted !== false);
                    var parentProp = parentBean.$properties;

                    var prop = beanDef.$properties;
                    if (!prop) {
                        // reuse all properties from parent: no need to preprocess further
                        beanDef.$properties = parentProp || {};
                        return;
                    }

                    // apply parent properties on this child properties
                    for (var i in parentProp) {
                        if (!parentProp.hasOwnProperty(i) || i.indexOf(':') != -1 || i.charAt(0) == '_') {
                            continue;
                        }
                        var propDef = parentProp[i];
                        var newDef = prop[i];

                        if (!newDef) {
                            // copy inherited bean definition (no override)
                            prop[i] = propDef;
                        } else {
                            // override
                            jv._preprocessBean(newDef, beanName + ".$properties." + i, packageDef);
                            // if override ans parentDef, check inheritance
                            if (propDef) {
                                __checkInheritance(propDef, newDef);
                            }
                        }
                    }

                    // process all children of object
                    for (var key in prop) {
                        if (!prop.hasOwnProperty(key) || key.indexOf(':') != -1 || key.charAt(0) == '_') {
                            continue;
                        }
                        // check that keys for beans are valid
                        if (!Aria.checkJsVarName(key)) {
                            jv._logError(jv.INVALID_NAME, [key, jv._currentBeanName]);
                        }
                        jv._preprocessBean(prop[key], beanName + ".$properties." + key, packageDef);
                    }

                },
                process : function (args) {
                    var value = args.value, beanDef = args.beanDef;
                    if (typeof(value) != 'object' || value == null) {
                        return __badTypeError(this, args);
                    }
                    var propdef = beanDef.$properties;
                    // copying property names (ignoring meta-data):
                    var propnames = {};
                    if (jv._options.checkEnabled && beanDef.$restricted) {
                        for (var i in value) {
                            if (!value.hasOwnProperty(i) || i.indexOf(':') != -1 || i.charAt(0) == '_') {
                                continue;
                            }
                            propnames[i] = 1;
                        }
                    }
                    for (var i in propdef) {
                        if (!propdef.hasOwnProperty(i) || i.indexOf(':') != -1 || i.charAt(0) == '_') {
                            continue;
                        }
                        var subBeanDef = propdef[i];
                        delete propnames[i];
                        jv._checkType({
                            dataHolder : value,
                            dataName : i,
                            value : value[i],
                            beanDef : subBeanDef,
                            path : args.path + '["' + i + '"]'
                        });
                    }
                    if (jv._options.checkEnabled && beanDef.$restricted) {
                        for (var i in propnames) {
                            if (value.hasOwnProperty(i) && propnames[i] == 1) {
                                // properties which stay in propnames after removing all that are in propdef
                                // are invalid
                                jv._logError(jv.UNDEFINED_PROPERTY, [i, args.path, beanDef[jv._MD_TYPENAME]]);
                            }
                        }
                    }
                },
                makeFastNorm : function (beanDef) {
                    var properties = beanDef.$properties;
                    var parentBean = beanDef[jv._MD_PARENTDEF];
                    if (properties === parentBean.$properties) {
                        // shortcut: reuse parent $fastNorm bean when possible
                        beanDef.$fastNorm = parentBean.$fastNorm;
                        return;
                    }
                    var strBuffer = ["var beanProperties = this.$properties;"];
                    strBuffer.push("if (!obj) { return this.$getDefault(); }");

                    // loop over properties to generate normalizers
                    var hasProperties = false;
                    for (var propertyName in properties) {
                        if (!properties.hasOwnProperty(propertyName) || propertyName.indexOf(':') != -1
                                || propertyName.charAt(0) == '_') {
                            continue;
                        }
                        var property = properties[propertyName];
                        var strDefault = property.$strDefault;
                        if (strDefault) {
                            hasProperties = true;
                            strBuffer.push("if (obj['" + propertyName + "'] == null) { obj['" + propertyName + "'] = "
                                    + strDefault + "; }");
                            if (hasFastNorm(property)) {
                                strBuffer.push("else { beanProperties['" + propertyName + "'].$fastNorm(obj['"
                                        + propertyName + "']); }");
                            }
                        } else if (hasFastNorm(property)) {
                            hasProperties = true;
                            // PTR 04546401 : Even if they have no default values, Objects might have subproperties with
                            // default values
                            // These properties should be normalized as well
                            strBuffer.push("if (obj['" + propertyName + "'] != null) { beanProperties['" + propertyName
                                    + "'].$fastNorm(obj['" + propertyName + "']);}");
                        }
                    }
                    strBuffer.push("return obj;");

                    beanDef.$fastNorm = hasProperties ? new Function("obj", strBuffer.join("\n")) : fastNormalizers.emptyObject;
                }
            }, {
                typeName : "Array",
                dontSkip : true,
                preprocess : __checkContentType,
                process : function (args) {
                    var v = args.value;
                    if (!ariaUtilsType.isArray(v)) {
                        return __badTypeError(this, args);
                    }
                    var ct = args.beanDef.$contentType;
                    for (var i = 0; i < v.length; i++) {
                        jv._checkType({
                            dataHolder : v,
                            dataName : i,
                            value : v[i],
                            beanDef : ct,
                            path : args.path + '["' + i + '"]'
                        });
                    }
                },
                makeFastNorm : function (beanDef) {
                    beanDef.$fastNorm = hasFastNorm(beanDef.$contentType) ? fastNormalizers.array : Aria.returnArg;
                }
            }, {
                typeName : "Map",
                dontSkip : true,
                preprocess : function (beanDef, beanName, packageDef) {
                    __checkContentType(beanDef, beanName, packageDef);
                    __checkKeyType(beanDef, beanName, packageDef);
                },
                process : function (args) {
                    var v = args.value;
                    if (typeof(v) != 'object' || v == null) {
                        return __badTypeError(this, args);
                    }
                    var ct = args.beanDef.$contentType;
                    var keyType = args.beanDef.$keyType;
                    for (var i in v) {
                        if (!v.hasOwnProperty(i)) {
                            continue;
                        }
                        if (keyType) {
                            jv._checkType({
                                dataHolder : v,
                                dataName : null,
                                value : i,
                                beanDef : keyType,
                                path : args.path
                            });
                        }
                        jv._checkType({
                            dataHolder : v,
                            dataName : i,
                            value : v[i],
                            beanDef : ct,
                            path : args.path + '["' + i + '"]'
                        });
                    }
                },
                makeFastNorm : function (beanDef) {
                    beanDef.$fastNorm = hasFastNorm(beanDef.$contentType) ? fastNormalizers.map : Aria.returnArg;
                }
            }, {
                typeName : "MultiTypes",
                preprocess : function (beanDef, beanName, packageDef) {
                    /* A MultiTypes does not check inheritance */
                    var contentTypes = beanDef.$contentTypes;
                    var parent = beanDef[jv._MD_PARENTDEF];
                    if (!parent[jv._MD_BUILTIN]) {
                        if (contentTypes == null) {
                            beanDef.$contentTypes = parent.$contentTypes;
                            return;
                        }
                    }
                    if (contentTypes == null) {
                        // no content type: no check should be done in this case
                        return;
                    }
                    for (var i = 0; i < contentTypes.length; i++) {
                        jv._preprocessBean(contentTypes[i], beanName + ".$contentTypes[" + i + "]", packageDef);
                    }
                },
                process : function (args) {
                    if (!jv._options.checkMultiTypes) {
                        return;
                    }
                    var contentTypes = args.beanDef.$contentTypes;
                    if (contentTypes == null) {
                        // no content types: no check should be done in this case
                        return;
                    }
                    var saveErrors = jv._errors;
                    var errors = []; // array of {beanDef: /* one of the content types */, errors: [ /* array of
                    // errors */]}
                    for (var i = 0; i < contentTypes.length; i++) {
                        var beanDef = contentTypes[i];
                        // save current stack of error
                        jv._errors = [];
                        jv._checkType({
                            dataHolder : args.dataHolder,
                            dataName : args.dataName,
                            value : args.value,
                            beanDef : beanDef,
                            path : args.path
                        });
                        if (jv._errors.length === 0) {
                            // no error for this type, we forget about any error for other types
                            jv._errors = saveErrors;
                            return;
                        }
                        errors.push({
                            beanDef : beanDef,
                            errors : jv._errors
                        });
                    }
                    jv._errors = saveErrors;
                    jv._logError(jv.INVALID_MULTITYPES_VALUE, [args.path, args.beanDef[jv._MD_TYPENAME], errors]);
                }
            }];

    /**
     * List of fast normalizers functions used by makeFastNorm functions. These are the common functions for simple
     * beans. Having them once here reduces the memory needed to create a new Function for every bean property
     * @type Object
     * @private
     */
    var fastNormalizers = {
        emptyObject : function (obj) {
            if (!obj) {
                return this.$getDefault();
            }

            return obj;
        },

        array : function (obj) {
            if (!obj) {
                return this.$getDefault();
            }
            for (var i = 0, l = obj.length; i < l; i++) {
                this.$contentType.$fastNorm(obj[i]);
            }
            return obj;
        },

        map : function (obj) {
            if (!obj) {
                return this.$getDefault();
            }
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    this.$contentType.$fastNorm(obj[key]);
                }
            }
            return obj;
        }
    };

    /**
     * Contains the definition of base types used by the JsonValidator.
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.core.JsonTypesCheck",
        $singleton : true,
        $statics : {
            baseTypes : baseTypes,
            fastNormalizers : fastNormalizers
        },
        $prototype : {}
    });
})();
