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
var ariaCoreJsonValidator = require("../core/JsonValidator");
require("./FunctionWriter");


/**
 * Utility to create inheritance normalization functions.
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.InheritanceNormalization',
    $singleton : true,
    $prototype : {

        /**
         * Write inheritance normalization code to a function writer. Inheritance normalization is the process of
         * filling an object with default values coming from parent objects. If the value is not defined in the variable
         * to normalize, it is looked for in each parent until finding one which has the value. If none of them has the
         * value, the default value from the bean definition is used. The whole process is driven by the properties
         * defined in a bean.
         * @param {Object} args Contains the following properties:
         * <ul>
         * <li>writer: {aria.utils.FunctionWriter} function writer</li>
         * <li>beanName: {String} Name of the bean used to create the normalization code. Either this property or
         * beanDef must be defined.</li>
         * <li>beanDef: {Object} bean definition object used to create the normalization code. Either this property or
         * beanName must be defined.</li>
         * <li>varToNormalize: {String} name of the variable to normalize</li>
         * <li>parentVars: {Array} array of variable names which are looked for when a value is not defined in
         * varToNormalize</li>
         * <li>emptyObjectVar: {String} [optional] name of a variable containing an empty object, it is used internally
         * in the process of inheritance normalization, in case some parent variables are null</li>
         * <li>excludes: {Object|Boolean} [optional] if true, exits immediately. Otherwise, if it is an object, its
         * keys represents properties in the bean and their value as passed in the excludes property when calling
         * writeInheritanceNormalization recursively. This allows to exlude properties at any level.</li>
         * </ul>
         */
        writeInheritanceNormalization : function (args) {
            if (args.excludes === true) {
                return;
            }
            var writer = args.writer;
            var out = writer.out;
            var varToNormalize = args.varToNormalize;
            var parentVars = args.parentVars;
            var beanDef = args.beanDef || ariaCoreJsonValidator.getBean(args.beanName);
            var typeName = beanDef['aria:baseType'].typeName;
            var isObject = (typeName == "Object");

            if (isObject) {
                out.push('if (', varToNormalize, '==null) {', varToNormalize, '={};', '}');
                var excludes = args.excludes || {};
                varToNormalize = writer.createShortcut(varToNormalize);
                var parentObjectVars = [];
                var emptyObjectVar = args.emptyObjectVar;
                if (emptyObjectVar == null) {
                    emptyObjectVar = writer.createTempVariable("{}");
                }
                var orEmptyObjectVar = '||' + emptyObjectVar;
                for (var i = 0, l = parentVars.length; i < l; i++) {
                    parentObjectVars[i] = writer.createTempVariable(parentVars[i] + orEmptyObjectVar);
                }
                var properties = beanDef.$properties;
                for (var propName in properties) {
                    if (properties.hasOwnProperty(propName)) {
                        var dotPropName = writer.getDotProperty(propName);
                        var newParentVars = [];
                        for (var i = 0, l = parentObjectVars.length; i < l; i++) {
                            newParentVars[i] = parentObjectVars[i] + dotPropName;
                        }
                        this.writeInheritanceNormalization({
                            writer : writer,
                            beanDef : properties[propName],
                            varToNormalize : varToNormalize + dotPropName,
                            parentVars : newParentVars,
                            emptyObjectVar : emptyObjectVar,
                            excludes : excludes[propName]
                        });
                    }
                }
                for (var i = 0, l = parentObjectVars.length; i < l; i++) {
                    writer.releaseTempVariable(parentObjectVars[i]);
                }
                writer.releaseShortcut(varToNormalize);
            } else {
                var possibleValues = parentVars.slice();
                if ('$strDefault' in beanDef) {
                    possibleValues.push(beanDef.$strDefault);
                }
                if (possibleValues.length > 0) {
                    out.push('if (', varToNormalize, '==null) {');
                    if (possibleValues.length == 1) {
                        out.push(varToNormalize, '=', possibleValues[0], ';');
                    } else {
                        for (var i = 0, l = possibleValues.length - 1; i < l; i++) {
                            var curValue = possibleValues[i];
                            if (i > 0) {
                                out.push("} else ");
                            }
                            out.push("if (", curValue, "!=null){", varToNormalize, '=', curValue, ';');
                        }
                        out.push('} else {', varToNormalize, '=', possibleValues[possibleValues.length - 1], ';}');
                    }
                }
                out.push('}');
            }
        }
    }
});
