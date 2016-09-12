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
    $classpath : 'test.aria.templates.TxtClassGeneratorTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.templates.TxtClassGenerator', 'aria.templates.Statements'],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
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
            var classGen = aria.templates.TxtClassGenerator;
            var undefinedPropertyError = aria.core.JsonValidator.UNDEFINED_PROPERTY;
            var statementsSingleton = aria.templates.Statements;
            var toTest = [{
                        tpl : "",
                        errors : [classGen.TEMPLATE_STATEMENT_EXPECTED]
                    }, {
                        tpl : "{TextTemplate/}{Other/}",
                        errors : [classGen.TEMPLATE_STATEMENT_EXPECTED]
                    }, {
                        tpl : "{Other/}",
                        errors : [classGen.TEMPLATE_STATEMENT_EXPECTED]
                    }, {
                        tpl : "{TextTemplate {blabla}}{/TextTemplate}",
                        errors : [classGen.ERROR_IN_TEMPLATE_PARAMETER]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{TextTemplate}{/TextTemplate}{/TextTemplate}",
                        errors : [statementsSingleton.TEMPLATE_STATEMENT_MISUSED]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{Template}{/Template}{/TextTemplate}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{Library}{/Library}{/TextTemplate}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{CSSTemplate}{/CSSTemplate}{/TextTemplate}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{id 'bla'/}{/TextTemplate}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{on /}{/TextTemplate}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{section {macro : 'aaa'}/}{/TextTemplate}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{createView/}{/TextTemplate}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{@aria:Template/}{/TextTemplate}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate'}}{@aria:NumberField/}{/TextTemplate}",
                        errors : [classGen.UNKNOWN_STATEMENT]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate',$css:['bla']}}{macro main()}{/macro}{/TextTemplate}",
                        errors : [undefinedPropertyError, classGen.CHECK_ERROR_IN_TEMPLATE_PARAMETER]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate',$wlibs:{}}}{macro main()}{/macro}{/TextTemplate}",
                        errors : [undefinedPropertyError, classGen.CHECK_ERROR_IN_TEMPLATE_PARAMETER]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate',$macrolibs:{}}}{macro main()}{/macro}{/TextTemplate}",
                        errors : [undefinedPropertyError, classGen.CHECK_ERROR_IN_TEMPLATE_PARAMETER]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate',$templates:[]}}{macro main()}{/macro}{/TextTemplate}",
                        errors : [undefinedPropertyError, classGen.CHECK_ERROR_IN_TEMPLATE_PARAMETER]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate',$width:{}}}{macro main()}{/macro}{/TextTemplate}",
                        errors : [undefinedPropertyError, classGen.CHECK_ERROR_IN_TEMPLATE_PARAMETER]
                    }, {
                        tpl : "{TextTemplate {$classpath: 'test.aria.templates.test.MyWrongTemplate',$height:{}}}{macro main()}{/macro}{/TextTemplate}",
                        errors : [undefinedPropertyError, classGen.CHECK_ERROR_IN_TEMPLATE_PARAMETER]
                    }];

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
            var cg = aria.templates.TxtClassGenerator;
            cg.parseTemplate(args.tpl, {
                allDependencies: true
            }, {
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
                // this.assertTrue(args.alreadyCalled == false);
                // this.assertTrue(res.classDef == null);
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
        }

    }
});
