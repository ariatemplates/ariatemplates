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
 * Test for the RequestMgr class
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.RequestMgrI18nTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.modules.urlService.PatternURLCreationImpl", "aria.modules.RequestMgr",
            "aria.modules.urlService.environment.UrlService"],
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

        /**
         * Test the I18N URL formatting
         */
        testAsynchI18nUrl1 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            var callback = {
                fn : this.__testAsynchI18nUrl1,
                scope : this
            };

            rm.createI18nUrl(null, null, callback);
        },

        __testAsynchI18nUrl1 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz//sampleResId;jsessionid=?locale=");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl1");
        },

        testAsynchI18nUrl2 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            var callback = {
                fn : this.__testAsynchI18nUrl2,
                scope : this
            };

            rm.createI18nUrl("m1", null, callback);
        },

        __testAsynchI18nUrl2 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz/m1/sampleResId;jsessionid=?locale=");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl2");
        },

        testAsynchI18nUrl3 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            var callback = {
                fn : this.__testAsynchI18nUrl3,
                scope : this
            };

            rm.createI18nUrl("m1", "EN_GB", callback);
        },

        __testAsynchI18nUrl3 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz/m1/sampleResId;jsessionid=?locale=EN_GB");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl3");
        },

        testAsynchI18nUrl4 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            var callback = {
                fn : this.__testAsynchI18nUrl4,
                scope : this
            };

            rm.createI18nUrl(null, "EN_GB", callback);
        },

        __testAsynchI18nUrl4 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz//sampleResId;jsessionid=?locale=EN_GB");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl4");
        },

        testAsynchI18nUrl5 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            rm.session = {
                id : 'KJASD12ASDLKASD'
            };
            var callback = {
                fn : this.__testAsynchI18nUrl5,
                scope : this
            };

            rm.createI18nUrl(null, null, callback);
        },

        __testAsynchI18nUrl5 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz//sampleResId;jsessionid=KJASD12ASDLKASD?locale=");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl5");
        },

        testAsynchI18nUrl6 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            rm.session = {
                id : 'KJASD12ASDLKASD'
            };
            var callback = {
                fn : this.__testAsynchI18nUrl6,
                scope : this
            };

            rm.createI18nUrl("m1", null, callback);
        },

        __testAsynchI18nUrl6 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz/m1/sampleResId;jsessionid=KJASD12ASDLKASD?locale=");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl6");
        },

        testAsynchI18nUrl7 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            rm.session = {
                id : 'KJASD12ASDLKASD'
            };
            var callback = {
                fn : this.__testAsynchI18nUrl7,
                scope : this
            };

            rm.createI18nUrl("m1", "EN_GB", callback);
        },

        __testAsynchI18nUrl7 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz/m1/sampleResId;jsessionid=KJASD12ASDLKASD?locale=EN_GB");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl7");
        },

        testAsynchI18nUrl8 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            rm.session = {
                id : 'KJASD12ASDLKASD'
            };
            var callback = {
                fn : this.__testAsynchI18nUrl8,
                scope : this
            };

            rm.createI18nUrl(null, "EN_GB", callback);
        },

        __testAsynchI18nUrl8 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz//sampleResId;jsessionid=KJASD12ASDLKASD?locale=EN_GB");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl8");
        },

        testAsynchI18nUrl9 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            rm.addParam("p1", "v1");
            rm.session = {
                id : 'KJASD12ASDLKASD'
            };
            var callback = {
                fn : this.__testAsynchI18nUrl9,
                scope : this
            };

            rm.createI18nUrl(null, null, callback);
        },

        __testAsynchI18nUrl9 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz//sampleResId;jsessionid=KJASD12ASDLKASD?locale=&p1=v1");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl9");
        },

        testAsynchI18nUrl10 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            rm.addParam("p1", "v1");
            rm.session = {
                id : 'KJASD12ASDLKASD'
            };
            var callback = {
                fn : this.__testAsynchI18nUrl10,
                scope : this
            };

            rm.createI18nUrl("m1", null, callback);
        },

        __testAsynchI18nUrl10 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz/m1/sampleResId;jsessionid=KJASD12ASDLKASD?locale=&p1=v1");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl10");
        },

        testAsynchI18nUrl11 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            rm.addParam("p1", "v1");
            rm.session = {
                id : 'KJASD12ASDLKASD'
            };
            var callback = {
                fn : this.__testAsynchI18nUrl11,
                scope : this
            };

            rm.createI18nUrl("m1", "EN_GB", callback);
        },

        __testAsynchI18nUrl11 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz/m1/sampleResId;jsessionid=KJASD12ASDLKASD?locale=EN_GB&p1=v1");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl11");
        },

        testAsynchI18nUrl12 : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null,
                            "http://www.amadeus.com:8080/xyz/${moduleName}/sampleResId;jsessionid=${sessionId}?locale=${locale}"]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            rm.addParam("p1", "v1");
            rm.session = {
                id : 'KJASD12ASDLKASD'
            };
            var callback = {
                fn : this.__testAsynchI18nUrl12,
                scope : this
            };

            rm.createI18nUrl(null, "EN_GB", callback);
        },

        __testAsynchI18nUrl12 : function (evt, args) {
            try {
                this.assertTrue(args.full == "http://www.amadeus.com:8080/xyz//sampleResId;jsessionid=KJASD12ASDLKASD?locale=EN_GB&p1=v1");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsynchI18nUrl12");
        }
    }
});
