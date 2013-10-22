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
 * Test for aria.templates.TemplateManager
 */
Aria.classDefinition({
    $classpath : 'test.aria.templates.TemplateManagerTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['test.aria.templates.test.UnloadFilter'],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.defaultTestTimeout = 10000;
    },
    $prototype : {

        setUp : function () {
            var document = Aria.$window.document;
            var div = document.createElement('div');
            div.style.cssText = "position:absolute;top:0;left:0;margin:10px;font-size:60px;"
                    + "color:#a94867;width:600px;height:400px;";
            document.body.appendChild(div);
            this.testDiv = div;
        },
        tearDown : function () {
            var document = Aria.$window.document;
            document.body.removeChild(this.testDiv);
            this.testDiv = null;
        },

        /**
         * Test unloadTemplate
         */
        testAsyncReload : function () {
            Aria.loadTemplate({
                div : this.testDiv,
                classpath : "test.aria.templates.test.UnloadTplOrigin",
                // do this to be sure it does not fail
                reload : true
            }, {
                fn : this._onTemplateLoad,
                scope : this,
                args : {}
            });
        },

        _onTemplateLoad : function (dummy, args) {
            try {
                var document = Aria.$window.document;
                var marker = document.getElementById('unload_test_42');
                this.assertTrue(!!marker, "Missing marker from origin template");
                this.assertTrue(marker.innerHTML == 'The cake is a lie', "Wrong content for origin template");
                this.assertTrue(marker.clientWidth == 100, "Wrong CSS used");

                // add a filter to target a new template
                var filter = new test.aria.templates.test.UnloadFilter();
                aria.core.IOFiltersMgr.addFilter(filter);
                args.filter = filter;

                // this will result in a template with an error being loaded
                filter.goError = true;

                // add a callback to ensure to everything from previous call is properly cleaned (get out of all
                // callbacks, raise final events, ...)
                aria.core.Timer.addCallback({
                    fn : function () {
                        // clean first template
                        Aria.disposeTemplate(this.testDiv);
                        Aria.loadTemplate({
                            div : this.testDiv,
                            classpath : "test.aria.templates.test.UnloadTplOrigin",
                            // this will call the unloadTemplate
                            reload : true
                        });

                        // if an error happens, callback will not be called ... bouh
                        aria.core.Timer.addCallback({
                            fn : this._onTemplateLoadError,
                            scope : this,
                            args : args,
                            delay : 2000
                        });
                    },
                    scope : this,
                    delay : 100
                });
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

        },

        _onTemplateLoadError : function (args) {
            try {
                var document = Aria.$window.document;
                // first template should not be here
                var marker = document.getElementById('unload_testChanged_42');
                this.assertTrue(!marker, "Origin template should have been removed");

                // and there should be some errors in the logs
                this.assertErrorInLogs(aria.core.MultiLoader.LOAD_ERROR, "Missing error 1");
                this.assertErrorInLogs(aria.templates.Parser.MISSING_CLOSINGBRACES, "Missing error 2");

                // ok, this time redirect to the good template
                args.filter.goError = false;

                // add a callback to ensure to everything from previous call is properly cleaned
                aria.core.Timer.addCallback({
                    fn : function () {
                        // clean first template
                        Aria.disposeTemplate(this.testDiv);
                        Aria.loadTemplate({
                            div : this.testDiv,
                            classpath : "test.aria.templates.test.UnloadTplOrigin",
                            // this will call the unloadTemplate
                            reload : true
                        }, {
                            fn : this._onTemplateLoadBis,
                            scope : this,
                            args : args
                        });
                    },
                    scope : this,
                    delay : 100
                });
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        },

        _onTemplateLoadBis : function (dummy, args) {
            try {
                var document = Aria.$window.document;
                var filter = args.filter;

                var marker = document.getElementById('unload_testChanged_42');
                this.assertTrue(!!marker, "Missing marker from changed template");
                this.assertTrue(marker.innerHTML == 'The cake is a cake', "Wrong content for changed template");
                this.assertTrue(marker.clientWidth == 500, "Wrong CSS used for changed template");

                marker = document.getElementById('unload_test_42');
                this.assertTrue(!marker, "Unexpected marker from first template");

                aria.core.IOFiltersMgr.removeFilter(filter);
                filter.$dispose();

                // clean last template
                Aria.disposeTemplate(this.testDiv);

                this.notifyTestEnd("testAsyncReload");

            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        }
    }
});
