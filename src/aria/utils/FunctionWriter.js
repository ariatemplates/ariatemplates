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
var ariaUtilsString = require("./String");


/**
 * Utility to build a function.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.FunctionWriter",
    /**
     * Create a function writer.
     * @param {Array} functionArguments Array of argument names for the function being built.
     */
    $constructor : function (functionArguments) {
        /**
         * Array of argument names for the function being built.
         * @type Array
         */
        this.functionArguments = functionArguments;

        /**
         * Variables defined in the function.
         * @type Array
         */
        this.variables = [];

        /**
         * Array of strings which were written in this function writer. Joining them gives the JavaScript code of the
         * function.
         * @type Array
         */
        this.out = [];

        /**
         * Counter used to create variable names.
         * @type Integer
         * @protected
         */
        this._varIndex = 0;

        /**
         * Array of currently unused variable names, created with createTempVariable then released with
         * releaseTempVariable.
         * @type Array
         * @protected
         */
        this._unusedTempVariables = [];

        /**
         * Map of currently used variable names, created with createTempVariable.
         * @type Object
         * @protected
         */
        this._usedTempVariables = {};

        /**
         * Map of shortcuts created with createShortcut.
         * @type Object
         * @protected
         */
        this._shortcuts = {};
    },
    $statics : {
        INVALID_RELEASE_TEMP_VAR : "releaseTempVariable was called with parameter %1, but this is not the name of a currently used variable created with createTempVariable.",
        INVALID_RELEASE_SHORTCUT : "releaseShortcut was called with parameter %1, but there was no previous call of createShortcut which returned that value.",

        REGULARNAME_REGEXP : /^[A-Za-z_][A-Za-z_0-9]*$/
    },
    $prototype : {
        $init : function (proto) {
            // shortcut:
            proto.stringify = ariaUtilsString.stringify;
        },

        /**
         * Adds a variable name to the list of variables declared in the function. Note that there is no check if this
         * variable is already present.
         * @param {String} varName Name of the variable to be added. It will be part of the var declaration at the
         * begining of the function.
         */
        addVariable : function (varName) {
            this.variables.push(varName);
        },

        /**
         * Creates a temporary variable, optionally writing its initialization code, and returns its name.
         * @param {String} value optional JavaScript expression containing the initial value to give to the variable.
         * @return {String} name of the created variable
         */
        createTempVariable : function (value) {
            var res;
            var unusedVariables = this._unusedTempVariables;
            if (unusedVariables.length > 0) {
                res = unusedVariables.pop();
            } else {
                this._varIndex++;
                res = "v" + this._varIndex;
                this.addVariable(res);
            }
            this._usedTempVariables[res] = true;
            if (value) {
                this.out.push(res, "=", value, ";");
            }
            return res;
        },

        /**
         * Releases a variable name created with createTempVariable, so that it can be reused in a future call to
         * createTempVariable.
         * @param {String} varName Variable name returned by createTempVariable.
         */
        releaseTempVariable : function (varName) {
            if (this._usedTempVariables.hasOwnProperty(varName)) {
                delete this._usedTempVariables[varName];
                this._unusedTempVariables.push(varName);
            } else {
                this.$logError(this.INVALID_RELEASE_TEMP_VAR, [varName]);
            }
        },

        /**
         * Returns true if the given string can be used as a variable name.
         * @param {String} expression
         * @return {Boolean}
         */
        isRegularVarName : function (expression) {
            return this.REGULARNAME_REGEXP.test(expression) && !Aria.isJsReservedWord(expression);
        },

        /**
         * If the expression is already a variable name, it is returned directly. Otherwise a new temporary variable is
         * created with the given expression as its content, and the name of the variable is returned. When the return
         * value of createShortcut is no longer needed, it should be released with releaseShortcut (whether expression
         * was returned or not).
         * @param {String} expression
         * @return {String}
         */
        createShortcut : function (expression) {
            var dontNeedShortcut = this.isRegularVarName(expression); // only a variable name
            var res = dontNeedShortcut ? expression : this.createTempVariable(expression);
            if (this._shortcuts[res] == null) {
                this._shortcuts[res] = [];
            }
            this._shortcuts[res].push(!dontNeedShortcut);
            return res;
        },

        /**
         * Release a shortcut created with createShortcut.
         * @param {String} shortcut return value from createShortcut
         */
        releaseShortcut : function (shortcut) {
            var info = this._shortcuts[shortcut];
            if (info && info.length > 0) {
                var createdShortcut = info.pop();
                if (createdShortcut) {
                    this.releaseTempVariable(shortcut);
                }
            } else {
                this.$logError(this.INVALID_RELEASE_SHORTCUT, [shortcut]);
            }
        },

        /**
         * Get the body of the function.
         * @return {String}
         */
        getCode : function () {
            var out = this.out.join('');
            this.out = [out];
            if (this.variables.length > 0) {
                out = ['var ', this.variables.join(','), ';\n', out].join('');
            }
            return out;
        },

        /**
         * Write all the given parameters at the end of the function being written.
         */
        write : function () {
            this.out.push.apply(this.out, arguments);
        },

        /**
         * Complete the process of function creation by actually creating the function.
         * @return {Function}
         */
        createFunction : function () {
            var functionArgs = this.functionArguments.slice();
            functionArgs.push(this.getCode());
            return Function.apply(Function, functionArgs);
        },

        /**
         * Returns either <code>.subProperty</code> or <code>["subProperty"]</code> depending on whether subProperty
         * is a correct variable name or not.
         * @param {String} subProperty sub-property name
         * @return {String}
         */
        getDotProperty : function (subProperty) {
            return this.isRegularVarName(subProperty) ? "." + subProperty : "[" + this.stringify(subProperty) + "]";
        },

        /**
         * Write the following code to the function: <code>if (! expression){expression={};}</code>
         * @param {String} expression
         */
        writeEnsureObjectExists : function (expression) {
            this.out.push("if (!", expression, "){", expression, "={};}");
        }
    }
});
