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

Aria.classDefinition({
    $classpath : "test.aria.templates.ClassGeneratorTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.TplClassGenerator", "aria.templates.Template", "aria.templates.BaseTemplate",
            "aria.templates.Statements"],
    $prototype : {

        setUp : function () {
            this.debug = aria.core.environment.Environment.isDebug();
            aria.core.environment.Environment.setDebug(true);
        },

        tearDown : function () {
            aria.core.environment.Environment.setDebug(this.debug);
        },

        /**
         * Testing that wrong templates raise the right errors.
         */
        testAsyncParseTemplateErrors : function () {
            var classGen = aria.templates.TplClassGenerator;
            var statementsSingleton = aria.templates.Statements;
            var toTest = [{
                        tpl : "",
                        errors : [classGen.TEMPLATE_STATEMENT_EXPECTED]
                    }, {
                        tpl : "{Template/}{Other/}",
                        errors : [classGen.TEMPLATE_STATEMENT_EXPECTED]
                    }, {
                        tpl : "{Other/}",
                        errors : [classGen.TEMPLATE_STATEMENT_EXPECTED]
                    }, {
                        tpl : "{Template {blabla}}{/Template}",
                        errors : [classGen.ERROR_IN_TEMPLATE_PARAMETER]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{Template}{/Template}{/Template}",
                        errors : [statementsSingleton.TEMPLATE_STATEMENT_MISUSED]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{else/}{/macro}{/Template}",
                        errors : [statementsSingleton.ELSE_WITHOUT_IF]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{elseif/}{/macro}{/Template}",
                        errors : [statementsSingleton.ELSE_WITHOUT_IF]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{if true}{else/}{elseif true/}{/if}{/macro}{/Template}",
                        errors : [statementsSingleton.ELSEIF_AFTER_ELSE]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{if true}{else/}{else/}{/if}{/macro}{/Template}",
                        errors : [statementsSingleton.ELSE_ALREADY_USED]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{@wrongsyntax {}/}{/macro}{/Template}",
                        errors : [statementsSingleton.INVALID_WIDGET_SYNTAX]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{@undeclared:Button {}/}{/macro}{/Template}",
                        errors : [statementsSingleton.UNDECLARED_WIDGET_LIBRARY]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{@aria:unknownWidget {}/}{/macro}{/Template}",
                        errors : [statementsSingleton.UNKNOWN_WIDGET]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{myunknownstatement/}{/Template}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}/}",
                        errors : [classGen.EXPECTED_CONTAINER]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()/}{/Template}",
                        errors : [classGen.EXPECTED_CONTAINER]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{if true/}{/macro}{/Template}",
                        errors : [classGen.EXPECTED_CONTAINER]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{for var i=0;i<10;i++/}{/macro}{/Template}",
                        errors : [classGen.EXPECTED_CONTAINER]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{foreach i in b/}{/macro}{/Template}",
                        errors : [classGen.EXPECTED_CONTAINER]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{if true}{else}{/else}{/if}{/macro}{/Template}",
                        errors : [classGen.UNEXPECTED_CONTAINER]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{var a=0}{/var}{/macro}{/Template}",
                        errors : [classGen.UNEXPECTED_CONTAINER]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{set a=0}{/set}{/macro}{/Template}",
                        errors : [classGen.UNEXPECTED_CONTAINER]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{if true}{/if}{/Template}",
                        errors : [statementsSingleton.SHOULD_BE_IN_MACRO]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{macro insideMacro()}{/macro}{/macro}{/Template}",
                        errors : [classGen.SHOULD_BE_OUT_OF_MACRO]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro wrong macro syntax}{/macro}{/Template}",
                        errors : [classGen.INVALID_STATEMENT_SYNTAX]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{/macro}{macro main()}{/macro}{/Template}",
                        errors : [statementsSingleton.MACRO_ALREADY_DEFINED]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{separator}{/separator}{/macro}{/Template}",
                        errors : [statementsSingleton.SEPARATOR_NOT_FIRST_IN_FOREACH]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{foreach i in data.array}{set test=1/}{separator}{/separator}{/foreach}{/macro}{/Template}",
                        errors : [statementsSingleton.SEPARATOR_NOT_FIRST_IN_FOREACH]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{createView myView on data.array/}{createView myView[a] on data.array/}{/macro}{/Template}",
                        errors : [statementsSingleton.INCOMPATIBLE_CREATEVIEW]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{createView class on data.array/}{/macro}{/Template}",
                        errors : [statementsSingleton.INCORRECT_VARIABLE_NAME]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{set class=true/}{/macro}{/Template}",
                        errors : [statementsSingleton.INCORRECT_VARIABLE_NAME]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{set obj={}/}{set obj.=true/}{/macro}{/Template}",
                        errors : [classGen.INVALID_STATEMENT_SYNTAX]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{set obj={}/}{set .obj=true/}{/macro}{/Template}",
                        errors : [classGen.INVALID_STATEMENT_SYNTAX]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{set obj={}/}{set obj.class=true/}{/macro}{/Template}",
                        errors : [statementsSingleton.INCORRECT_VARIABLE_NAME]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{var class=true/}{/macro}{/Template}",
                        errors : [statementsSingleton.INCORRECT_VARIABLE_NAME]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{checkDefault class=true/}{/macro}{/Template}",
                        errors : [statementsSingleton.INCORRECT_VARIABLE_NAME]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{foreach class in data.mySet}{/foreach}{/macro}{/Template}",
                        errors : [statementsSingleton.INCORRECT_VARIABLE_NAME]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{macro main()}{foreach v badKeyWord data.mySet}{/foreach}{/macro}{/Template}",
                        errors : [statementsSingleton.INVALID_FOREACH_INKEYWORD]
                    }, {
                        tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate',$wlibs:{myWrongLib:'test.aria.core.test.ClassA'}}}{macro main()}{@myWrongLib:myWrongWidget {}/}{/macro}{/Template}",
                        errors : [statementsSingleton.INVALID_WIDGET_LIBRARY]
                    }];
            if (aria.core.JsonValidator._options.checkEnabled) {
                // missing classpath in template parameter
                toTest.push({
                    tpl : "{Template {}}{/Template}",
                    errors : [aria.core.JsonValidator.MISSING_MANDATORY, classGen.CHECK_ERROR_IN_TEMPLATE_PARAMETER]
                });
                toTest.push({
                    tpl : "{Template {classpath: 'test.aria.templates.test.MyWrongTemplate'}}{/Template}",
                    errors : [aria.core.JsonValidator.MISSING_MANDATORY, classGen.CHECK_ERROR_IN_TEMPLATE_PARAMETER,
                            aria.core.JsonValidator.UNDEFINED_PROPERTY]
                });
                toTest.push({
                    tpl : "{Template {$classpath: 'test.aria.templates.test.MyWrongTemplate',hasScript:false}}{/Template}",
                    errors : [classGen.CHECK_ERROR_IN_TEMPLATE_PARAMETER, aria.core.JsonValidator.UNDEFINED_PROPERTY]
                });
            }
            var seq = new aria.core.Sequencer();
            var sz = toTest.length;
            for (var i = 0; i < sz; i++) {
                seq.addTask({
                    name : "testAsyncParseTemplateErrors" + i,
                    fn : this._taskParseTemplateError,
                    scope : this,
                    args : toTest[i],
                    asynchronous : true
                });
            }
            seq.$on({
                scope : this,
                end : this._taskParseTemplateErrorEnd,
                taskError : this._taskParseTemplateErrorError
            });
            seq.start();
        },

        _taskParseTemplateError : function (task, args) {
            var cg = aria.templates.TplClassGenerator;
            cg.parseTemplate(args.tpl, true, {
                fn : this._parseTemplateResponse,
                scope : this,
                args : {
                    task : task,
                    errors : args.errors,
                    alreadyCalled : false
                }
            });
        },

        _parseTemplateResponse : function (res, args) {
            var task = args.task;
            var errors = args.errors;
            try {
                this.assertFalse(args.alreadyCalled, false);
                this.assertTrue(res.classDef == null);
                for (var i = errors.length - 1; i >= 0; i--) {
                    this.assertErrorInLogs(errors[i]);
                }
                this.assertLogsEmpty();
                args.alreadyCalled = true;
                task.taskMgr.notifyTaskEnd(task.id);
            } catch (e) {
                this.handleAsyncTestError(e, false);
                task.taskMgr.notifyTaskEnd(task.id, true);
            }
        },

        _taskParseTemplateErrorError : function (evt) {
            this.handleAsyncTestError(evt.exception, false);
        },

        _taskParseTemplateErrorEnd : function (evt) {
            evt.src.$dispose();
            this.notifyTestEnd("testAsyncParseTemplateErrors");
        },

        /**
         * Testing a particular correct template.
         */
        testAsyncParseTemplateOK : function () {
            aria.core.DownloadMgr.loadFile("test/aria/templates/test/TemplateOK.tpl", {
                fn : this._onReceivingTemplateOK,
                scope : this
            });
        },

        _onReceivingTemplateOK : function () {
            try {
                var dm = aria.core.DownloadMgr;
                var cg = aria.templates.TplClassGenerator;
                var tpl = dm.getFileContent("test/aria/templates/test/TemplateOK.tpl");
                cg.parseTemplate(tpl, true, {
                    fn : this._onReceivingTemplateOKGenerated,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _onReceivingTemplateOKGenerated : function (args) {
            try {
                var res = args.classDef;
                // check the syntax of the class definition
                res = res.replace("Aria.classDefinition", "return "); // do not really load the class (it would not be the
                // proper way)
                var classDef = Aria['eval'](res);
                // check class definition properties
                this.assertTrue(classDef.$classpath == "test.aria.templates.test.TemplateOK");
                this.assertTrue(classDef.$extends == "aria.templates.Template");
                this.assertTrue(typeof(classDef.$prototype.__$initTemplate) == "function");
                this.assertTrue(typeof(classDef.$prototype.macro_main) == "function");
                this.assertTrue(typeof(classDef.$prototype.macro_myMacroWithParams) == "function");
            } catch (e) {
                this.handleAsyncTestError(e);
            }
            this.notifyTestEnd("testAsyncParseTemplateOK");
        },

        /**
         * Testing runtime errors
         */
        testAsyncParseTemplateKO_Runtime : function () {

            Aria.debug = true;

            aria.core.DownloadMgr.loadFile("test/aria/templates/test/TemplateKO_Runtime.tpl", {
                fn : this._onReceivingTemplateKO_Runtime,
                scope : this
            });
        },

        _onReceivingTemplateKO_Runtime : function () {
            try {
                var dm = aria.core.DownloadMgr;
                var cg = aria.templates.TplClassGenerator;
                var tpl = dm.getFileContent("test/aria/templates/test/TemplateKO_Runtime.tpl");
                cg.parseTemplate(tpl, true, {
                    fn : this._onReceivingTemplateKO_RuntimeGenerated,
                    scope : this
                }, {}, true);
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _onReceivingTemplateKO_RuntimeGenerated : function (args) {
            try {
                var res = args.classDef;
                // check the syntax of the class definition
                res = res.replace("Aria.classDefinition", "return "); // do not really load the class (it would not be the
                // proper way)
                var classDef = Aria["eval"](res);
                var classDefProto = classDef.$prototype;
                var tplProto = aria.templates.Template.prototype;

                // hack for error reporting and writing
                classDefProto.$classpath = "test.aria.templates.test.TemplateKO_Runtime";
                classDefProto.__$processWidgetMarkup = function () {};
                classDefProto.__$write = function () {};

                // hack to get correct inherited members:
                for (var i in tplProto) {
                    // it is on purpose that we do not use tplProto.hasOwnProperty
                    if (classDefProto[i] == null) {
                        classDefProto[i] = tplProto[i];
                    }
                }

                // check class definition properties
                var output = classDefProto.macro_main();

                var baseTemplate = aria.templates.BaseTemplate;
                this.assertErrorInLogs(baseTemplate.EXCEPTION_IN_EXPRESSION);
                this.assertErrorInLogs(baseTemplate.EXCEPTION_IN_VAR_EXPRESSION);
                this.assertErrorInLogs(baseTemplate.EXCEPTION_IN_SET_EXPRESSION);
                this.assertErrorInLogs(baseTemplate.EXCEPTION_IN_CHECKDEFAULT_EXPRESSION);
                this.assertErrorInLogs(aria.templates.Template.EXCEPTION_IN_CONTROL_PARAMETERS);

            } catch (e) {
                this.handleAsyncTestError(e);
            }

            // reset debug mode
            Aria.debug = this.ariaDebug;

            this.notifyTestEnd("testAsyncParseTemplateKO_Runtime");
        }

    }
});
