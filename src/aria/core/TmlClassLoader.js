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
 * ClassLoader for css files.
 * @class aria.core.TmlClassLoader
 * @extends aria.core.ClassLoader
 */
Aria.classDefinition({
    $classpath : 'aria.core.TmlClassLoader',
    $extends : 'aria.core.ClassLoader',
    $constructor : function () {
        this.$ClassLoader.constructor.apply(this, arguments);
        this._refLogicalPath += ".tml";
    },
    $statics : {
        // ERROR MESSAGES:
        TEMPLATE_EVAL_ERROR : "Error while evaluating the class generated from template macro library '%1'",
        TEMPLATE_DEBUG_EVAL_ERROR : "Error while evaluating the class generated from template macro library '%1'"
    },
    $prototype : {
        /**
         * Called when the .tml file is received.
         * @param {String} classDef Content of the .tml file
         * @param {String} logicalpath Logical path of the .tml file
         * @protected
         */
        _loadClass : function (classDef, logicalPath) {
            var __alreadyGeneratedRegExp = /^\s*Aria\.classDefinition\(/;

            if (__alreadyGeneratedRegExp.test(classDef)) {
                this.__evalGeneratedTml.call(this, {
                    classDef : classDef,
                    scope : this
                }, {
                    logicalPath : logicalPath
                });
            } else {
                Aria.load({
                    classes : ['aria.templates.TmlClassGenerator'],
                    oncomplete : {
                        fn : this.__generateTml,
                        scope : this,
                        args : {
                            classDef : classDef,
                            logicalPath : logicalPath,
                            classpath : this._refClasspath
                        }
                    }
                });
            }
        },

        /**
         * Parse the library and generate the Tree
         * @param {Object} args Library configuration, given from _loadClass
         * @private
         */
        __generateTml : function (args) {
            try {
                aria.templates.TmlClassGenerator.parseTemplate(args.classDef, false, {
                    fn : this.__evalGeneratedTml,
                    scope : this,
                    args : {
                        logicalPath : args.logicalPath
                    }
                }, {
                    "library_classpath" : args.logicalPath
                });
            } catch (ex) {
                this.$logError(this.CLASS_LOAD_ERROR, [this._refClasspath], ex);
            }
        },

        /**
         * Wrap the Tml generation in a try catch block. This generation is not done in debug mode
         * @param {Object} args Library configuration, given from _loadClass
         * @param {Object} tree Generated tree
         * @private
         */
        __fallbackGenerateTml : function (args, tree) {
            this.$logWarn(this.TEMPLATE_DEBUG_EVAL_ERROR, [this._refClasspath]);
            aria.templates.TmlClassGenerator.parseTemplateFromTree(tree, false, {
                fn : this.__evalGeneratedTml,
                scope : this,
                args : {
                    logicalPath : args.logicalPath
                }
            }, {
                "library_classpath" : args.logicalPath
            }, true);
        },

        /**
         * Evaluate the class definition built by __generateTml If the eval fails regenerate the class with some extra
         * debug capabilities
         * @param {String} generatedClass Generated class
         * @param {Object} args Library configuration, given from _loadClass
         * @private
         */
        __evalGeneratedTml : function (generatedClass, args) {
            var classDef = generatedClass.classDef;
            try {
                Aria["eval"](classDef, args.logicalPath);
                if (!this._classDefinitionCalled) {
                    this.$logError(this.MISSING_CLASS_DEFINITION, [this.getRefLogicalPath(), this._refClasspath]);
                    aria.core.ClassMgr.notifyClassLoadError(this._refClasspath);
                }
            } catch (ex) {
                if (!generatedClass.debug && Aria.debug) {
                    try {
                        this.__fallbackGenerateTml(args, generatedClass.tree);
                    } catch (exc) {
                        this.$logError(this.TEMPLATE_DEBUG_EVAL_ERROR, [this._refClasspath], exc);
                    }
                } else {
                    this.$logError(this.TEMPLATE_EVAL_ERROR, [this._refClasspath], ex);
                }
            }
        }
    }
});