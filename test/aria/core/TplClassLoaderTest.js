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
 * Test case for the TplClassLoader
 */
Aria.classDefinition({
    $classpath : "test.aria.core.TplClassLoaderTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Dom", "aria.core.MultiLoader"],
    $prototype : {
        setUp : function () {
            var document = Aria.$window.document;
            this.thisDivIsInTheBody = document.createElement("div");
            this.thisDivIsInTheBody.id = "thisDivIsInTheBody";
            document.body.appendChild(this.thisDivIsInTheBody);
        },

        tearDown : function () {
            this.thisDivIsInTheBody.parentNode.removeChild(this.thisDivIsInTheBody);
        },

        testAsyncLoadTemplateErrors : function () {
            var toTest = [{
                        params : {
                            classpath : "test.aria.templates.test.TemplateOK",
                            div : "myUndefinedId"
                        },
                        errors : [aria.utils.Dom.DIV_NOT_FOUND]
                    }, {
                        params : {
                            classpath : "test.aria.templates.test.error.TemplateOkBadResources",
                            div : "thisDivIsInTheBody"
                        },
                        errors : [aria.core.MultiLoader.LOAD_ERROR]
                    }];

            var seq = new aria.core.Sequencer();
            var sz = toTest.length;
            for (var i = 0; i < sz; i++) {
                seq.addTask({
                    name : "testAsyncLoadTemplateErrors" + i,
                    fn : this._taskLoadTemplateError,
                    scope : this,
                    args : toTest[i],
                    asynchronous : true
                });
            }
            seq.start();
            seq.$on({
                scope : this,
                end : this._taskLoadTemplateErrorEnd,
                taskError : this._taskLoadTemplateErrorError
            });
        },

        _taskLoadTemplateError : function (task, args) {
            Aria.loadTemplate(args.params, {
                fn : this._loadTemplateErrorsCallback,
                scope : this,
                args : {
                    task : task,
                    errors : args.errors,
                    alreadyCalled : false
                }
            });
        },

        _loadTemplateErrorsCallback : function (res, args) {
            var task = args.task;
            var errors = args.errors;
            var terminate = false;
            try {
                this.assertFalse(args.alreadyCalled);
                args.alreadyCalled = true;
                this.assertFalse(res.success);
                var sz = errors.length;
                for (var i = 0; i < sz; i++) {
                    this.assertErrorInLogs(errors[i]);
                }
                this.assertLogsEmpty();
            } catch (e) {
                terminate = true;
                this.handleAsyncTestError(e, false);
            }

            // Yeld in order to let the framework handle all callbacks
            aria.core.Timer.addCallback({
                fn : function (args) {
                    this.notifyTaskEnd(args.id, args.terminate);
                },
                scope : task.taskMgr,
                args : {
                    id : task.id,
                    terminate : terminate
                },
                delay : 15
            });
        },

        _taskLoadTemplateErrorError : function (evt) {
            this.handleAsyncTestError(evt.exception, false);
        },

        _taskLoadTemplateErrorEnd : function (evt) {
            evt.src.$dispose();
            this.notifyTestEnd("testAsyncLoadTemplateErrors");
        },

        testAsyncDisposeTemplate : function () {
            var document = Aria.$window.document;
            var div = document.createElement('div');
            div.id = "myTplTest";
            document.body.appendChild(div);

            Aria.loadTemplate({
                div : div.id,
                classpath : "test.aria.core.test.classMgrTest.Tpl1"
            }, {
                fn : this._onTemplateLoad,
                scope : this,
                args : {}
            });
        },

        _onTemplateLoad : function () {
            var document = Aria.$window.document;
            var div = document.getElementById('myTplTest');

            this.assertNotEquals(div.firstChild, null);
            aria.core.TplClassLoader.disposeTemplate("myTplTest");
            this.assertEquals(div.firstChild, null);

            document.body.removeChild(div);
            this.notifyTestEnd('testAsyncDisposeTemplate');
        },

        testAsyncLoadTplWithScriptRes : function () {
            var document = Aria.$window.document;
            var div = document.createElement('div');
            div.id = "myTplTestWRes";
            document.body.appendChild(div);

            Aria.loadTemplate({
                div : div.id,
                classpath : "test.aria.core.test.classMgrTest.TplWRes"
            }, {
                fn : this._onScriptRes,
                scope : this
            });
        },

        _onScriptRes : function () {
            var document = Aria.$window.document;
            var div = document.getElementById('myTplTestWRes');

            this.assertTrue(div.firstChild.innerHTML == "Go to Aria Templates Documentation");

            var txt = test.aria.core.test.classMgrTest.TextOfATemplate.processTextTemplate();
            this.assertTrue(txt.indexOf("No text") != -1);

            aria.core.TplClassLoader.disposeTemplate("myTplTestWRes");
            document.body.removeChild(div);

            this.notifyTestEnd('testAsyncLoadTplWithScriptRes');
        },

        testAsyncLoadTplWithScriptError : function () {
            var document = Aria.$window.document;
            var div = document.createElement('div');
            div.id = "myTplTestWErr";
            document.body.appendChild(div);

            Aria.loadTemplate({
                div : div.id,
                classpath : "test.aria.core.test.classMgrTest.TplWErr"
            }, {
                fn : this._onScriptError,
                scope : this,
                args : {}
            });
        },

        _onScriptError : function () {
            var document = Aria.$window.document;
            var div = document.getElementById('myTplTestWErr');

            this.assertErrorInLogs(aria.core.TplClassLoader.MISSING_TPLSCRIPTDEFINITION);
            this.assertErrorInLogs(aria.templates.BaseCtxt.TEMPLATE_CONSTR_ERROR);

            aria.core.TplClassLoader.disposeTemplate("myTplTestWErr");
            document.body.removeChild(div);
            this.notifyTestEnd('testAsyncLoadTplWithScriptError');
        },

        testAddPrintOptions : function () {
            var original = "aria.core.TplClassLoader aria.core.environment.Environment";
            var classes = "aria.core.TplClassLoader aria.core.environment.Environment";
            classes = aria.core.TplClassLoader.addPrintOptions(classes, "hidden");
            this.assertTrue(classes == (original + " xPrintHide"));

            classes = "aria.core.TplClassLoader aria.core.environment.Environment";
            classes = aria.core.TplClassLoader.addPrintOptions(classes, "adaptX");
            this.assertTrue(classes == (original + " xPrintAdaptX"));

            classes = "aria.core.TplClassLoader aria.core.environment.Environment";
            classes = aria.core.TplClassLoader.addPrintOptions(classes, "adaptY");
            this.assertTrue(classes == (original + " xPrintAdaptY"));
        }
    }
});
