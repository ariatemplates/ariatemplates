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
 * The class generator is used to generate the class corresponding to a template. This class uses the tree from the
 * template parser, and generates a string containing the corresponding class definition. This is an abstract class and
 * is extended by the more specific classes aria.templates.TplClassGenerator and aria.templates.CSSClassGenerator
 */
Aria.classDefinition({
    $classpath : "aria.templates.ClassGenerator",
    $dependencies : ["aria.templates.ClassWriter", "aria.templates.TreeBeans", "aria.templates.CfgBeans",
            "aria.templates.Statements", "aria.templates.Modifiers"],
    $singleton : false,
    $constructor : function () {
        /**
         * Parser. It convert the text to a tree representation.
         * @type aria.templates.Parser
         * @protected
         */
        this._parser = null;

        /**
         * Super class to be used for templates with no parent.
         * @type String
         * @protected
         */
        this._superClass = null;

        /**
         * Class loader type to load templates of the same type (used for parent templates).
         * @type String
         * @protected
         */
        this._classType = null;

        /**
         * Expected root statement name.
         * @type String
         * @protected
         */
        this._rootStatement = null;

        /**
         * Template parameter bean.
         * @type String
         * @protected
         */
        this._templateParamBean = null;

        /**
         * Map of statements. It is loaded by one of the descendant class
         * @type Object
         */
        this.STATEMENTS = {};

        /**
         * Map of all statements allowed
         * @type Object
         */
        this.ALLSTATEMENTS = aria.templates.Statements.ALLSTATEMENTS;

        // Automatically load general statements:
        this._loadStatements(["#ROOT#", "#TEXT#", "#CDATA#", "#EXPRESSION#", "if", "elseif", "else", "for", "foreach",
                "separator", "var", "set", "checkDefault", "macro", "call", "memo"]);

        /**
         * Track the debug state, used to insert extra statement to track runtime exceptions in debug mode
         * @protected
         * @type Boolean
         */
        this._isDebug = aria.core.environment.Environment.isDebug();
        aria.core.environment.Environment.$on({
            "debugChanged" : function () {
                this._isDebug = aria.core.environment.Environment.isDebug();
            },
            scope : this
        });
    },
    $statics : {
        // ERROR MESSAGES:
        TEMPLATE_STATEMENT_EXPECTED : "Template error: please check that the whole template is enclosed in a '%1' statement.",
        ERROR_IN_TEMPLATE_PARAMETER : "Template error, while evaluating the parameter of the '%1' statement.",
        CHECK_ERROR_IN_TEMPLATE_PARAMETER : "Template error: the parameter of the '%1' statement does not respect the bean definition.",
        UNKNOWN_STATEMENT : "line %2: Template error: unknown statement '%1'.",
        EXPECTED_CONTAINER : "line %2: Template error: statement '%1' must be used as a container.",
        UNEXPECTED_CONTAINER : "line %2: Template error: statement '%1' cannot be used as a container.",
        SHOULD_BE_OUT_OF_MACRO : "line %2: Template error: statement '%1' cannot be used in a macro.",
        INVALID_STATEMENT_SYNTAX : "line %3: Template error: invalid parameter for statement '%1'; it should respect the regular expression %2."
    },
    $prototype : {
        /**
         * Parse the given template, and send the generated class definition to the callback function. The first
         * parameter given to the callback function is: { classDef: {String} if null, errors occured during parsing or
         * class generation; otherwise contains the generated class }
         * @param {String} template the template
         * @param {Boolean} allDeps If true, all dependencies should be included in the generated class. Otherwise only
         * put classes which are not currently loaded in the $dependencies section.
         * @param {aria.core.CfgBeans:Callback} callback the callback description
         * @param {Object} context - passes template context information to improve debugging
         * @param {Boolean} debug debug mode
         */
        parseTemplate : function (template, allDeps, callback, context, debug) {
            var tree = this._parser.parseTemplate(template, context, this.STATEMENTS);
            if (tree == null) {
                this.$callback(callback, {
                    classDef : null
                });
                return;
            }
            this.__buildClass(tree, allDeps, callback, context, debug);
        },

        /**
         * Parse a debug template from the tree
         * @param {aria.templates.TreeBeans:Root} tree tree returned by the parser.
         * @param {Boolean} allDeps If true, all dependencies should be included in the generated class. Otherwise only
         * put classes which are not currently loaded in the $dependencies section.
         * @param {aria.core.CfgBeans:Callback} callback callback the callback description
         * @param {Object} context - passes template context information to improve debugging
         * @param {Boolean} debug debug mode
         */
        parseTemplateFromTree : function (tree, allDeps, callback, context, debug) {
            this.__buildClass(tree, allDeps, callback, context, debug);
        },

        /**
         * Load the list of statements that are allowed for this class generator. The list is specified by the
         * descendant class aria.templates.TplClassGenerator and aria.templates.CSSClassGenerator
         * @param {Array} statements List of statements name
         * @protected
         */
        _loadStatements : function (statements) {
            for (var i = 0, len = statements.length; i < len; i += 1) {
                var statement = statements[i];
                this.STATEMENTS[statement] = this.ALLSTATEMENTS[statement];
            }
        },

        /**
         * Get the list of statements loaded for this ClassGenerator
         * @return {Object}
         */
        getStatements : function () {
            return this.STATEMENTS;
        },

        /**
         * Build the template class from the tree given by the parser.
         * @private
         * @param {aria.templates.TreeBeans:Root} tree tree returned by the parser.
         * @param {Boolean} allDeps If true, all dependencies should be included in the generated class. Otherwise only
         * put classes which are not currently loaded in the $dependencies section.
         * @param {aria.core.CfgBeans:Callback} callback the callback description
         * @param {Object} errorContext
         * @param {Boolean} debug generate debug template (expression wrap in try-catch)
         * @return {String} the generated class definition or null it there were errors.
         */
        __buildClass : function (tree, allDeps, callback, errorContext, debug) {
            aria.core.JsonValidator.check(tree, "aria.templates.TreeBeans.Root");
            var out = new aria.templates.ClassWriter({
                fn : this.__processStatement,
                scope : this
            }, {
                fn : this.__logError,
                scope : this
            });

            out.errorContext = errorContext;
            out.allDependencies = allDeps;
            out.callback = callback;
            out.tree = tree;
            out.debug = (debug === true);
            this._processRootStatement(out, tree);
            if (out.errors) {
                out.$dispose();
                this.$callback(callback, {
                    classDef : null
                });
            }
        },

        /**
         * Process the root statement of the template.
         * @param {aria.templates.ClassWriter} out
         * @param {aria.templates.TreeBeans:Statement} tree
         * @protected
         */
        _processRootStatement : function (out, tree) {
            var rootStatement = tree.content[0];
            if (tree.content.length != 1 || (rootStatement.name != this._rootStatement)) {
                return out.logError(tree, this.TEMPLATE_STATEMENT_EXPECTED, [this._rootStatement]);
            }
            if (rootStatement.content == null) {
                return out.logError(rootStatement, this.EXPECTED_CONTAINER, [this._rootStatement]);
            }
            var param;
            try {
                // The parameter should be a JSON object
                // TODO: think about error management and call aria.utils.Json.load(...)
                // calling JsonUtils.load because it includes a sandbox
                param = eval("(" + rootStatement.paramBlock + ")");
            } catch (e) {
                return out.logError(rootStatement, this.ERROR_IN_TEMPLATE_PARAMETER, [this._rootStatement], e);
            }

            if (!aria.core.JsonValidator.normalize({
                json : param,
                beanName : this._templateParamBean
            })) {
                return out.logError(rootStatement, this.CHECK_ERROR_IN_TEMPLATE_PARAMETER, [this._rootStatement]);
            }
            out.templateParam = param;

            this._processTemplateContent({
                out : out,
                statement : rootStatement
            });
        },

        /**
         * This method is called for each statement to produce an output in the class definition. It propagates the call
         * to the correct process function in this.STATEMENTS, or logs errors, if the statement is unknown, or misused.
         * @private
         * @param {aria.templates.ClassWriter} out
         * @param {aria.templates.TreeBeans:Statement} statement
         */
        __processStatement : function (out, statement) {
            var statname = statement.name;
            if (statname.charAt(0) == '@') {
                statname = '@';
            }

            var handler = this.STATEMENTS[statname];
            if (handler == null) {
                out.logError(statement, this.UNKNOWN_STATEMENT, [statname]);
            } else if (handler.container === true && statement.content === undefined) {
                out.logError(statement, this.EXPECTED_CONTAINER, [statname]);
            } else if (handler.container === false && statement.content !== undefined) {
                out.logError(statement, this.UNEXPECTED_CONTAINER, [statname]);
            } else if (handler.inMacro !== undefined && out.isOutputReady() !== handler.inMacro) {
                if (handler.inMacro) {
                    out.logError(statement, aria.templates.Statements.SHOULD_BE_IN_MACRO, [statname]);
                } else {
                    out.logError(statement, this.SHOULD_BE_OUT_OF_MACRO, [statname]);
                }
            } else {
                if (handler.paramRegexp) {
                    var res = handler.paramRegexp.exec(statement.paramBlock);
                    if (res == null) {
                        out.logError(statement, this.INVALID_STATEMENT_SYNTAX, [statname, handler.paramRegexp]);
                    } else {
                        if (this._isDebug) {
                            out.trackLine(statement.lineNumber);
                        }
                        handler.process(out, statement, res);
                    }
                } else {
                    if (this._isDebug) {
                        out.trackLine(statement.lineNumber);
                    }
                    handler.process(out, statement, this);
                }
            }
        },

        /**
         * Log the given error.
         * @private
         * @param {aria.templates.TreeBeans:Statement} statement Statement in the template tree from which the error is
         * being raised. It will be transformed into the corresponding line number in the source template and added at
         * the end of otherParams.
         * @param {String} msgId error id, used to find the error message
         * @param {Array} msgArgs parameters of the error message
         * @param {Object} errorContext
         */
        __logError : function (statement, msgId, msgArgs, errorContext) {
            if (msgArgs == null) {
                msgArgs = [];
            }
            msgArgs.push(statement.lineNumber);
            this.$logError(msgId, msgArgs, errorContext);
        },

        /**
         * Create the required blocks in the class writer.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _createBlocks : function (out) {
            out.newBlock("classDefinition", 0);
            out.newBlock("prototype", 2);
            out.newBlock("globalVars", 5);
            out.newBlock("initTemplate", 3);
            out.newBlock("classInit", 3);
        },

        /**
         * Write to the current block of the class writer the begining of the class definition.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _writeClassDefHeaders : function (out) {
            var tplParam = out.templateParam;
            out.writeln("Aria.classDefinition({");
            out.increaseIndent();
            out.writeln("$classpath: ", out.stringify(tplParam.$classpath), ",");
            if (out.parentClasspath) {
                out.writeln("$extends: ", out.stringify(out.parentClasspath), ",");
            }
            if (out.parentClassType != "JS") {
                out.writeln("$extendsType: ", out.stringify(out.parentClassType), ",");
            }
        },

        /**
         * Extract the class name from the classpath (part after last '.').
         * @param {String} classpath
         * @return {String}
         * @protected
         */
        _getClassName : function (classpath) {
            var parts = classpath.split('.');
            return parts[parts.length - 1];
        },

        /**
         * Set the out.parentClasspath, out.parentClassName and out.parentClassType from the values available in
         * out.templateParam.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _processInheritance : function (out) {
            var tplParam = out.templateParam;
            // normal inheritance processing: set out.parentClasspath, out.parentClassName and out.parentClassType
            if (tplParam.$extends) {
                out.parentClasspath = tplParam.$extends;
                out.parentClassType = this._classType;
            } else {
                out.parentClasspath = this._superClass;
            }
            if (out.parentClasspath) {
                out.parentClassName = this._getClassName(out.parentClasspath);
            }
        },

        /**
         * Set the out.scriptClasspath, out.scriptClassName from the values available in out.templateParam.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _processScript : function (out) {
            var tplParam = out.templateParam;
            if (tplParam.$hasScript) {
                out.scriptClasspath = tplParam.$classpath + "Script";
                out.scriptClassName = this._getClassName(out.scriptClasspath);
                out.addDependency(out.scriptClasspath);
            }
        },

        /**
         * Write to the current block of the class writer the constructor of the class definition. The body of the
         * method contains a call to the parent constructor and a call to the script constructor.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _writeConstructor : function (out) {
            out.writeln("$constructor: function() { ");
            out.increaseIndent();
            var parentClassName = out.parentClassName;
            if (parentClassName) {
                out.writeln("this.$", parentClassName, ".constructor.call(this);");
            }
            var scriptClassName = out.scriptClassName;
            if (scriptClassName) {
                out.writeln("this.$", scriptClassName, ".constructor.call(this);");
            }
            out.decreaseIndent();
            out.writeln("},");
        },

        /**
         * Write to the current block of the class writer the destructor of the class definition. The body of the method
         * contains a call to the script destructor and a call to the parent destructor.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _writeDestructor : function (out) {
            out.writeln("$destructor: function() {");
            out.increaseIndent();
            var scriptClassName = out.scriptClassName;
            if (scriptClassName) {
                out.writeln("this.$", scriptClassName, ".$destructor.call(this);");
            }
            var parentClassName = out.parentClassName;
            if (parentClassName) {
                out.writeln("this.$", parentClassName, ".$destructor.call(this);");
            }
            out.decreaseIndent();
            out.writeln("},");
        },

        /**
         * Write to the current block of the class writer the dependencies of the template, including JS classes,
         * resources, templates, css, macrolibs and text templates.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _writeDependencies : function (out) {
            var tplParam = out.templateParam;
            var json = aria.utils.Json;
            out.writeln(out.getDependencies());
            if (tplParam.$res) {
                out.writeln("$resources: ", json.convertToJsonString(tplParam.$res), ",");
            }
            if (tplParam.$templates) {
                out.writeln("$templates: ", json.convertToJsonString(tplParam.$templates), ",");
            }
            if (tplParam.$css) {
                out.writeln("$css: ", json.convertToJsonString(tplParam.$css), ",");
            }
            if (tplParam.$macrolibs) {
                var macrolibsArray = aria.utils.Array.extractValuesFromMap(tplParam.$macrolibs);
                if (macrolibsArray.length > 0) {
                    out.writeln("$macrolibs: ", json.convertToJsonString(macrolibsArray), ",");
                }
            }
            if (tplParam.$csslibs) {
                var csslibsArray = aria.utils.Array.extractValuesFromMap(tplParam.$csslibs);
                if (csslibsArray.length > 0) {
                    out.writeln("$csslibs: ", json.convertToJsonString(csslibsArray), ",");
                }
            }
            if (tplParam.$texts) {
                out.writeln("$texts: ", json.convertToJsonString(tplParam.$texts), ",");
            }

        },

        /**
         * Write to the current block of the class writer some code to handle inheritance of a map (e.g.: macrolibs).
         * This code is intended to be put in the $init method. The map is merged with the parent map: any property not
         * defined in the map is inherited from the parent.
         * @param {aria.templates.ClassWriter} out markup writer.
         * @param {String} name Name of the value in the class prototype
         * @param {Object} map Map at this level.
         * @param {String} defaultValue default value
         * @protected
         */
        _writeMapInheritance : function (out, name, map, defaultValue) {
            if (out.parentClassType == this._classType) {
                // merge maps at class loading time, as there is a parent template:
                if (map) {
                    var newMap = out.newVarName();
                    // create the map of the child (which is now a different object, and we can change it)
                    out.writeln("var ", newMap, " = {};");
                    // get parent macrolibs:
                    out.writeln("Aria.copyObject(proto.", name, ",", newMap, ");");
                    // add or change child's own macrolibs:
                    out.writeln("Aria.copyObject(", aria.utils.Json.convertToJsonString(map), ",", newMap, ");");
                    out.writeln("proto.", name, " = ", newMap, ";");
                }
            } else {
                var mapStr = map ? aria.utils.Json.convertToJsonString(map) : defaultValue;
                out.writeln("proto.", name, " = ", mapStr, ";");
            }
        },

        /**
         * Write to the current block of the class writer some code to handle inheritance of a value. This code is
         * intended to be put in the $init method.
         * @param {aria.templates.ClassWriter} out markup writer.
         * @param {String} name Name of the value in the class prototype
         * @param {Object} value Value to set for the property. If null, the value will be inherited from parent, or the
         * default value will be used if there is no parent.
         * @param {String} defaultValue default value
         * @protected
         */
        _writeValueInheritance : function (out, name, value, defaultValue) {
            if (out.parentClassType == this._classType) {
                // override value at class loading time, as there is a parent template:
                if (value != null) {
                    out.writeln("proto.", name, " = ", aria.utils.Json.convertToJsonString(value), ";");
                }
            } else {
                var valueStr = value != null ? aria.utils.Json.convertToJsonString(value) : defaultValue;
                out.writeln("proto.", name, " = ", valueStr, ";");
            }
        },

        /**
         * Write to the current block of the class writer the $init method which is used to import the script prototype.
         * This is only done if out.scriptClasspath is defined (no $init method is written if no script is defined).
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _writeClassInit : function (out) {
            var scriptClasspath = out.scriptClasspath;
            if (scriptClasspath) {
                // this is the new way of including template scripts
                out.enterBlock("classInit");
                out.addDependencies(["aria.core.TplClassLoader"]);
                out.writeln("aria.core.TplClassLoader._importScriptPrototype(" + scriptClasspath + ",proto)");
                out.leaveBlock();
            }
            var classInit = out.getBlockContent("classInit");
            if (classInit.length > 0) {
                out.writeln("$init: function(proto) {");
                out.increaseIndent();
                out.write(classInit);
                out.decreaseIndent();
                out.writeln("},");
            }
        },

        /**
         * Write to the current block of the class writer the __$initTemplate method which is used to do some
         * initialization in the template (global variables...). This method writes both the initTemplate and globalVars
         * block of the class writer.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _writeInitTemplate : function (out) {
            out.writeln("__$initTemplate: function() {");
            out.increaseIndent();
            if (out.parentClassType == this._classType) {
                // call the parent __$initTemplate only in case of template inheritance
                out.writeln("if (! this.$", out.parentClassName, ".__$initTemplate.call(this)) { return false; }");
            }
            out.write(out.getBlockContent("initTemplate"));
            var gv = out.getBlockContent("globalVars");
            if (gv.length > 0) {
                out.writeln("try {");
                out.increaseIndent();
                out.writeln("with (this) {");
                out.increaseIndent();
                out.write(gv);
                out.decreaseIndent();
                out.writeln("}"); // end with
                out.decreaseIndent();
                out.writeln("} catch (_ex) {");
                out.increaseIndent();
                out.writeln("this.$logError(this.EXCEPTION_IN_VARINIT,[this.$classpath],_ex);");
                out.writeln("return false;");
                out.decreaseIndent();
                out.writeln("}");
            }
            out.writeln("return true;");
            out.decreaseIndent();
            out.writeln("}");
        },

        /**
         * Write to the current block of the class writer the end of the class definition, including the prototype block
         * of the class writer.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _writeClassDefEnd : function (out) {
            out.writeln("$prototype: {");
            out.increaseIndent();
            out.write(out.getBlockContent("prototype"));
            out.decreaseIndent();
            out.writeln("}");
            out.decreaseIndent();
            out.writeln("})");
            out.leaveBlock();
        },

        /**
         * Process template content. This method is called from _processRootStatement.
         * @param {Object} Process template content properties (contains out and statement objects).
         * @protected
         */
        _processTemplateContent : function (arg) {
            var out = arg.out;
            var tplParam = out.templateParam;
            var statement = arg.statement;

            // Add dependencies specified explicitly in the template declaration
            out.addDependencies(tplParam.$dependencies);

            this._createBlocks(out);
            this._processInheritance(out);
            this._processScript(out);

            out.enterBlock("classDefinition");
            this._writeClassDefHeaders(out);
            this._writeConstructor(out);
            this._writeDestructor(out);
            out.leaveBlock();

            // main part of the processing (process the whole template):
            out.processContent(statement.content);

            if (out.errors) {
                out.$dispose();
                this.$callback(out.callback, {
                    classDef : null
                });
                // in case of synchronous call, the following line prevents a second call of the callback
                // to report the error
                out.errors = false;
                return;
            }

            out.enterBlock("prototype");
            this._writeClassInit(out);
            this._writeInitTemplate(out);
            out.leaveBlock();

            out.enterBlock("classDefinition");
            this._writeDependencies(out);
            this._writeClassDefEnd(out);
            out.leaveBlock();

            var res = null;
            res = out.getBlockContent("classDefinition");
            out.$dispose();
            this.$callback(out.callback, {
                classDef : res,
                tree : out.tree,
                debug : out.debug
            });
        }
    }
});
