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
 * Test for the ResClassLoader class
 */
Aria.classDefinition({
    $classpath : "test.aria.core.ResClassLoaderTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.modules.RequestMgr", "aria.modules.urlService.environment.UrlService"],
    $prototype : {

        /**
         * Save parameters of the Request Manager before each test to restore them later.
         */
        setUp : function () {
            var rm = aria.modules.RequestMgr;
            this._savedSession = {
                id : rm.session.id,
                paramName : rm.session.paramName
            };
            this._savedParams = rm._params;
            rm._params = null;

            this._savedCfg = aria.modules.urlService.environment.UrlService.getUrlServiceCfg();
        },

        /**
         * Restore saved parameters of the Request Manager after each test.
         */
        tearDown : function () {
            var rm = aria.modules.RequestMgr;
            rm.session = this._savedSession;
            rm._params = this._savedParams;
            aria.core.AppEnvironment.setEnvironment({
                urlService : this._savedCfg
            }, null, true);
        },

        testAsyncBuildLogicalPath1 : function () {
            var instance = Aria.getClassInstance("aria.core.ResClassLoader");

            var callback = {
                fn : this._testAsyncLP1,
                scope : this
            };

            instance.__buildLogicalPath("ABC", "DEF", callback, "IT", true);
            instance.$dispose();
        },

        _testAsyncLP1 : function (evt, args) {
            try {
                var expected = {
                    logical : "DEF_IT.js",
                    serverResource : false,
                    full : null
                };

                this.assertTrue(aria.utils.Json.equals(args, expected));
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsyncBuildLogicalPath1");
        },

        testAsyncBuildLogicalPath2 : function () {
            var instance = Aria.getClassInstance("aria.core.ResClassLoader");

            var callback = {
                fn : this._testAsyncLP2,
                scope : this
            };

            instance.__buildLogicalPath("ABC", "DEF", callback, "IT", false);
            instance.$dispose();
        },

        _testAsyncLP2 : function (evt, args) {
            try {
                var expected = {
                    logical : "DEF_IT.js",
                    serverResource : false,
                    full : null
                };

                this.assertTrue(aria.utils.Json.equals(args, expected));
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsyncBuildLogicalPath2");
        },

        testAsyncBuildLogicalPath3 : function () {
            var instance = Aria.getClassInstance("aria.core.ResClassLoader");

            var callback = {
                fn : this._testAsyncLP3,
                scope : this
            };

            instance.__buildLogicalPath("ABC.CBA", "DEF/FED", callback, "IT", true);
            instance.$dispose();
        },

        _testAsyncLP3 : function (evt, args) {
            try {
                var expected = {
                    logical : "DEF/FED_IT.js",
                    serverResource : false,
                    full : null
                };

                this.assertTrue(aria.utils.Json.equals(args, expected));
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsyncBuildLogicalPath3");
        },

        testAsyncBuildLogicalPath4 : function () {
            var instance = Aria.getClassInstance("aria.core.ResClassLoader");

            var callback = {
                fn : this._testAsyncLP4,
                scope : this
            };

            instance.__buildLogicalPath("ABC.Res", "DEF", callback, "IT", true);
            instance.$dispose();
        },

        _testAsyncLP4 : function (evt, args) {
            try {
                var expected = {
                    logical : "DEF.js",
                    serverResource : false,
                    full : null
                };

                this.assertTrue(aria.utils.Json.equals(args, expected));
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsyncBuildLogicalPath4");
        },

        testAsyncBuildLogicalPath5 : function () {
            var instance = Aria.getClassInstance("aria.core.ResClassLoader");

            var callback = {
                fn : this._testAsyncLP5,
                scope : this
            };

            instance.__buildLogicalPath("ABC.Res", "DEF", callback, "", true);
            instance.$dispose();
        },

        _testAsyncLP5 : function (evt, args) {
            try {
                var expected = {
                    logical : "DEF.js",
                    serverResource : false,
                    full : null
                };

                this.assertTrue(aria.utils.Json.equals(args, expected));
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsyncBuildLogicalPath5");
        },

        testAsyncBuildLogicalPath6 : function () {
            this._savedCfg = aria.modules.urlService.environment.UrlService.getUrlServiceCfg();
            var rm = aria.modules.RequestMgr;
            this._savedSession = {
                id : rm.session.id,
                paramName : rm.session.paramName
            };
            this._savedParams = rm._params;
            rm._params = null;

            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.ariatemplates.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var instance = Aria.getClassInstance("aria.core.ResClassLoader");

            var callback = {
                fn : this._testAsyncLP6,
                scope : this
            };

            // This one will call the asynchronous method
            instance.__buildLogicalPath("ABC.Res", "DEF", callback, "IT", false);
            instance.$dispose();
        },

        _testAsyncLP6 : function (evt, args) {
            try {
                var expected = {
                    logical : "DEF_IT.js",
                    serverResource : true,
                    full : "http://www.ariatemplates.com:8080/xyz/ABC/sampleResId;jsessionid=?locale=IT"
                };

                this.assertTrue(aria.utils.Json.equals(args, expected));
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            var rm = aria.modules.RequestMgr;
            rm.session = this._savedSession;
            rm._params = this._savedParams;
            aria.core.AppEnvironment.setEnvironment({
                urlService : this._savedCfg
            }, null, true);

            this.notifyTestEnd("testAsyncBuildLogicalPath6");
        }
    }
});
