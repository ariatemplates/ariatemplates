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
 * Test case for the class manager.
 * @class test.aria.core.ClassMgrTest
 */
Aria.classDefinition({
    $classpath : 'test.aria.core.ClassMgrTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.templates.Template', 'test.aria.core.test.classMgrTest.Class1',
            'test.aria.core.test.classMgrTest.UnloadFilter'],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $destructor : function () {
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {

        testAsyncMissingJS : function () {
            this._checkAriaLoadError({
                classes : ["test.aria.core.test.ClassWhichDoesNotExist"]
            }, "testAsyncMissingJS", aria.core.ClassLoader.CLASS_LOAD_FAILURE);
        },

        testAsyncMissingTPL : function () {
            this._checkAriaLoadError({
                templates : ["test.aria.core.test.TemplateWhichDoesNotExist"]
            }, "testAsyncMissingTPL", aria.core.ClassLoader.CLASS_LOAD_FAILURE);
        },

        testAsyncJSClassWrongClasspath : function () {
            this._checkAriaLoadError({
                classes : ["test.aria.core.test.JSWrongClasspath"]
            }, "testAsyncJSClassWrongClasspath", aria.core.ClassLoader.MISSING_CLASS_DEFINITION);
        },

        testAsyncTPLClassWrongClasspath : function () {
            this._checkAriaLoadError({
                templates : ["test.aria.core.test.TPLWrongClasspath"]
            }, "testAsyncTPLClassWrongClasspath", aria.core.ClassLoader.MISSING_CLASS_DEFINITION);
        },

        /**
         * Test that a circular dependency raises an error
         */
        testAsyncCircularDependency : function () {
            this._checkAriaLoadError({
                classes : ['test.aria.core.test.CircularClassA']
            }, "testAsyncCircularDependency", aria.core.ClassMgr.CIRCULAR_DEPENDENCY);
        },

        /**
         * Check that a class file containing a wrong classpath raises the right error. (this is not really a unit test,
         * as it involves several components: MultiLoader, ClassMgr, ClassLoader)
         */
        _checkAriaLoadError : function (param, testName, errorID) {
            param.oncomplete = {
                scope : this,
                fn : this._onAriaLoadComplete
            };
            param.onerror = {
                scope : this,
                fn : this._onAriaLoadError,
                args : {
                    testName : testName,
                    errorID : errorID
                }
            }
            Aria.load(param);
        },

        _onAriaLoadComplete : function () {
            try {
                this.fail("_onAriaLoadComplete called");
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        _onAriaLoadError : function (args) {
            try {
                this.assertErrorInLogs(args.errorID);
                if (args.testName == "testAsyncCircularDependency") {
                    // When there is a circular dependency, the corresponding loader is known not to be disposed
                    // properly. Let's dispose it manually:
                    var loader = aria.core.ClassMgr.getClassLoader("test.aria.core.test.CircularClassF");
                    loader.$dispose();
                }
                this.notifyTestEnd(args.testName);
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        /**
         * Test unloadClass method
         */
        testAsyncUnloadClass : function () {
            var original = new test.aria.core.test.classMgrTest.Class1();
            this.assertTrue(original.a === 1, "Original value is wrong");
            original.$dispose();

            var filter = new test.aria.core.test.classMgrTest.UnloadFilter();
            aria.core.IOFiltersMgr.addFilter(filter);
            aria.core.ClassMgr.unloadClass("test.aria.core.test.classMgrTest.Class1");
            Aria.load({
                classes : ['test.aria.core.test.classMgrTest.Class1'],
                oncomplete : {
                    fn : this._afterUnload,
                    scope : this,
                    args : filter
                }
            })
        },

        _afterUnload : function (filter) {
            try {
                var modified = new test.aria.core.test.classMgrTest.Class1();
                this.assertTrue(modified.a === 2, "Replaced class has wrong value");
                modified.$dispose();
                aria.core.IOFiltersMgr.removeFilter(filter);
                filter.$dispose();
                this.notifyTestEnd('testAsyncUnloadClass');
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        testAsyncLoadClassDuplicate : function () {
            var nbCalls = 0;
            // make sure the class is first unloaded:
            aria.core.ClassMgr.unloadClass('test.aria.core.test.ClassA');
            // then try to load it, and repeat the same classpath twice when calling Aria.load:
            Aria.load({
                classes : ['test.aria.core.test.ClassA', 'test.aria.core.test.ClassA'],
                oncomplete : {
                    fn : function () {
                        this.assertTrue(nbCalls == 0, "oncomplete was called several times");
                        nbCalls++;
                        aria.core.Timer.addCallback({
                            fn : function () {
                                this.notifyTestEnd('testAsyncLoadClassDuplicates');
                            },
                            scope : this,
                            delay : 300
                        });
                    },
                    scope : this
                }
            });
        }

    }
});