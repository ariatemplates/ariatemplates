/*
 * Copyright 2014 Amadeus s.a.s.
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
 * Test for the "force reload class" feature, which reloads the methods on the prototype of a given class, and the
 * constructors and destructors of that class. The feature is meant to be used primarily for developer's debugging
 * workflow - to have the possibility to hot-reload the class instead of doing full application refresh and having to
 * repeat the whole flow etc.<br>
 * <br>
 * The main entry point is the "forceReload" method which gets as an input an Array<String> of the classpaths to be
 * reloaded.<br>
 * <br>
 * Note: dynamic change of $extends is impossible in IE < 11, hence the test fails there (to make it work, comment out
 * the line with $extends in Foo|BarClassTweaked.js)
 */
Aria.classDefinition({
    $classpath : "test.aria.tools.debug.ForceReloadClassTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.IOFiltersMgr", "aria.tools.debug.ReloadClassUtil",
            "test.aria.tools.debug.testFiles.RedirectToTweakedFilter"],
    $constructor : function () {
        /**
         * The classes to be used for this test
         */
        this.classesUnderTestCP = ["test.aria.tools.debug.testFiles.FooClass",
                "test.aria.tools.debug.testFiles.BarClass"];

        /**
         * IOFilter which for the sake of the test redirects requests from `FooClass` to `FooClassTweaked`, to simulate
         * the reload of a file
         */
        this.redirectFilter = new test.aria.tools.debug.testFiles.RedirectToTweakedFilter();

        /**
         * An array which will hold arrays instances of the classes under tests (we create instances right at the
         * beginning, reload them, and verify their prototypes were altered). The keys of this array are
         * String-classpaths.
         */
        this.oldInstances = {};

        /**
         * Used to notify about test end (to simplify things, instead of passing the test name continuously)
         */
        this.currentTestName = null;

        /**
         * Whether the current browser supports __proto__
         */
        this.supportsProto = aria.tools.debug.ReloadClassUtil.supportsProto;
        this.$TestCase.constructor.call(this);
    },
    $destructor : function () {

        this.redirectFilter.$dispose();
        this.redirectFilter = null;
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {
        tearDown : function () {
            for (var cp in this.oldInstances) {
                for (var j = 0; j < this.oldInstances[cp].length; j++) {
                    this.oldInstances[cp][j].$dispose();
                }
            }
            this.oldInstances = {};
        },

        testAsyncForceReloadMemCheckYes : function () {
            this.currentTestName = "testAsyncForceReloadMemCheckYes";
            this._startForceReloadTest(true);
        },
        testAsyncForceReloadMemCheckNo : function () {
            this.currentTestName = "testAsyncForceReloadMemCheckNo";
            this._startForceReloadTest(false);
        },

        /**
         * Load the class and assert it's in the original state
         */
        _startForceReloadTest : function (memCheckMode) {
            Aria.memCheckMode = memCheckMode;
            Aria.load({
                classes : this.classesUnderTestCP,
                oncomplete : {
                    fn : this._afterClassesLoaded,
                    scope : this
                }
            });
        },

        /**
         * Force reload the class (use IOFilter to simulate file change) and assert the prototype has been altered
         */
        _afterClassesLoaded : function () {
            // first, create instances of the class for later testing
            for (var i = 0; i < this.classesUnderTestCP.length; i++) {
                var cp = this.classesUnderTestCP[i];
                var classRef = Aria.getClassRef(cp);
                this.oldInstances[cp] = this.oldInstances[cp] || [];
                this.oldInstances[cp].push(new classRef(42));
            }

            this._makeAllAssertionsOriginal();

            aria.core.IOFiltersMgr.addFilter(this.redirectFilter);
            aria.tools.debug.ReloadClassUtil.forceReload(this.classesUnderTestCP, {
                fn : this._testForceReload,
                scope : this
            });
        },

        /**
         * Check the reload was successful. Load once again the original file to assure more than one reload will work
         */
        _testForceReload : function () {
            this._makeAllAssertionsTweaked();

            aria.core.IOFiltersMgr.removeFilter(this.redirectFilter);
            aria.tools.debug.ReloadClassUtil.forceReload(this.classesUnderTestCP, {
                fn : this._verifySecondReload,
                scope : this
            });
        },

        /**
         * Check that the second reload was successful too
         */
        _verifySecondReload : function () {
            this._makeAllAssertionsOriginal();

            this.notifyTestEnd(this.currentTestName);
        },

        /**
         * Assertions based on FooClass.js
         */
        _makeAllAssertionsOriginal : function () {
            for (var i = 0; i < this.classesUnderTestCP.length; i++) {
                var cp = this.classesUnderTestCP[i];
                var originalClassRef = Aria.getClassRef(cp);
                var originalClassRealProto = originalClassRef.prototype;

                // check that prototype methods/vars and statics were replaced properly
                this._makeAssertionsOriginal(originalClassRealProto);
                this._makeAssertionsOriginalInheritance(originalClassRealProto);
                this._makeAssertionsOriginalStatic(originalClassRef);

                // check that constructor was replaced properly
                var newInstance = new originalClassRef(42);
                this.assertEquals(newInstance._tweakedConstructorParam, undefined);
                this.assertEquals(newInstance._originalConstructorParam, 42);
                this.oldInstances[cp].push(newInstance);

                // check that all the instances created so far have their prototypes updated too
                for (var j = 0; j < this.oldInstances[cp].length; j++) {
                    this._makeAssertionsOriginal(this.oldInstances[cp][j]);
                }
            }
        },

        _makeAssertionsOriginal : function (obj) {
            this.assertEquals(obj.method1(), "original");
            this.assertEquals(obj.method5, undefined);
            this.assertEquals(obj.method2(), "original");
            this.assertEquals(obj.protoVariable1, "original");
            this._makeAssertionsOriginalStatic(obj);
        },
        _makeAssertionsOriginalStatic : function (obj) {
            this.assertEquals(obj.STATIC1, "original");
            this.assertEquals(obj.STATIC5, undefined);
            this.assertEquals(obj.STATIC2, "original");
        },
        _makeAssertionsOriginalInheritance : function (obj) {
            if (this.supportsProto) {
                this.assertEquals(obj.methodFromQuux, undefined);
                this.assertEquals(obj.STATIC_FROM_QUUX, undefined);
            }
        },

        /**
         * Assertions based on FooClassTweaked.js
         */
        _makeAllAssertionsTweaked : function () {
            for (var i = 0; i < this.classesUnderTestCP.length; i++) {
                var cp = this.classesUnderTestCP[i];
                var originalClassRef = Aria.getClassRef(cp);
                var originalClassRealProto = originalClassRef.prototype;

                // check that prototype methods/vars and statics were replaced properly
                this._makeAssertionsTweaked(originalClassRealProto);
                // check also inheritance on prototype level
                this._makeAssertionsTweakedInheritance(originalClassRealProto);
                // the constructor also exposes statics
                this._makeAssertionsTweakedStatic(originalClassRef);

                // check that constructor was replaced properly
                var newInstance = new originalClassRef(42);
                this.assertEquals(newInstance._tweakedConstructorParam, 42);
                this.assertEquals(newInstance._originalConstructorParam, undefined);
                this.oldInstances[cp].push(newInstance);

                // check that all the instances created so far have their prototypes updated too
                for (var j = 0; j < this.oldInstances[cp].length; j++) {
                    this._makeAssertionsTweaked(this.oldInstances[cp][j]);
                    this._makeAssertionsTweakedInheritance(this.oldInstances[cp][j]);
                }
            }
        },

        _makeAssertionsTweaked : function (obj) {
            this.assertEquals(obj.method1(), "tweaked");
            this.assertEquals(obj.method5(), "tweaked");
            this.assertEquals(obj.method2, undefined);
            this.assertEquals(obj.protoVariable1, "tweaked");
            this._makeAssertionsTweakedStatic(obj);
        },
        _makeAssertionsTweakedStatic : function (obj) {
            this.assertEquals(obj.STATIC1, "tweaked");
            this.assertEquals(obj.STATIC5, "tweaked");
            this.assertEquals(obj.STATIC2, undefined);
        },
        _makeAssertionsTweakedInheritance : function (obj) {
            if (this.supportsProto) {
                this.assertEquals(obj.methodFromQuux(), "quux");
                this.assertEquals(obj.STATIC_FROM_QUUX, "quux");
            }
        }

    }
});
