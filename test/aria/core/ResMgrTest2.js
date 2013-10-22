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
var Aria = require("ariatemplates/Aria");
var ariaModulesRequestMgr = require("ariatemplates/modules/RequestMgr");
var ariaModulesUrlServiceEnvironmentUrlService = require("ariatemplates/modules/urlService/environment/UrlService");
var ariaCoreEnvironment = require("ariatemplates/core/environment/Environment");
var ariaCoreAppEnvironment = require("ariatemplates/core/AppEnvironment");
var ariaCoreResMgr = require("ariatemplates/core/ResMgr");
var ariaUtilsFunction = require("ariatemplates/utils/Function");
require("ariatemplates/modules/urlService/PatternURLCreationImpl");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.core.ResMgrTest2",
    $extends : require("ariatemplates/jsunit/TestCase"),
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.handleAsyncTestError = ariaUtilsFunction.bind(this.handleAsyncTestError, this);
    },
    $destructor : function () {
        this.$TestCase.$destructor.call(this);
        delete this.handleAsyncTestError;
    },
    $prototype : {

        setUp : function () {
            this.savedLocale = ariaCoreResMgr.currentLocale;
            this.savedDevMode = ariaCoreEnvironment.isDevMode();
            this.savedUrlCfg = ariaModulesUrlServiceEnvironmentUrlService.getUrlServiceCfg();
            this.savedRequestMgrParams = ariaModulesRequestMgr._params;
        },

        tearDown : function () {
            ariaCoreResMgr.currentLocale = this.savedLocale;
            ariaCoreEnvironment.setDevMode(this.savedDevMode);
            ariaCoreAppEnvironment.setEnvironment({
                urlService : this.savedUrlCfg
            }, null, true);
            ariaModulesRequestMgr._params = this.savedRequestMgrParams;
        },

        beginDownloadMgrMock : function (expectedCalls) {
            var self = this;
            var files = {};
            this.overrideClass("aria.core.DownloadMgr", {
                loadFile : function (logicalPath, callback, args) {
                    try {
                        var curCall = expectedCalls.shift();
                        self.assertTrue(curCall != null, "Unexpected call to DownloadMgr.loadFile for " + logicalPath);
                        self.assertEquals(curCall.logicalPath, logicalPath);
                        self.assertJsonEquals(curCall.args, args);
                        if (curCall.content != null) {
                            files[logicalPath] = curCall.content;
                        }
                        self.$callback(callback, {
                            name : "fileReady",
                            src : this,
                            logicalPaths : [logicalPath],
                            url : logicalPath,
                            downloadFailed : !curCall.content
                        });
                    } catch (ex) {
                        self.handleAsyncTestError(ex);
                    }
                },
                getFileContent : function (logicalPath) {
                    return files[logicalPath];
                }
            });
            var notifyTestEnd = this.notifyTestEnd;
            this.notifyTestEnd = function () {
                try {
                    self.assertEquals(expectedCalls.length, 0);
                } catch (e) {
                    this.handleAsyncTestError(e, false);
                }
                self.notifyTestEnd = notifyTestEnd;
                expectedCalls = notifyTestEnd = files = null;
                self.resetClassOverrides();
                self.notifyTestEnd.apply(this, arguments);
                self = null;
            };
        },

        testAsyncCase1 : function () {
            var self = this;
            ariaCoreResMgr.currentLocale = "fr_FR";
            this.beginDownloadMgrMock([{
                logicalPath : "test/aria/core/testResMgr/MyRes1_fr_FR.js",
                content : "Aria.resourcesDefinition({$classpath: 'test.aria.core.testResMgr.MyRes1', $resources: {value:'testAsyncCase1'}})"
            }]);
            ariaCoreResMgr.loadResource(null, "test/aria/core/testResMgr/MyRes1").then(function (res) {
                self.assertEquals(res.value, "testAsyncCase1");
                self.assertEquals(res, Aria.$global.test.aria.core.testResMgr.MyRes1);
                var locale = aria.core.ResMgr.getResourceLocale("test.aria.core.testResMgr.MyRes1");
                self.assertEquals(locale, "fr_FR");
                Aria.dispose(res);
                self.notifyTestEnd();
            }, this.handleAsyncTestError);
        },

        testAsyncCase2 : function () {
            var self = this;
            ariaCoreResMgr.currentLocale = "fr_FR";
            this.beginDownloadMgrMock([{
                        logicalPath : "test/aria/core/testResMgr/MyRes2_fr_FR.js"
                    }, {
                        logicalPath : "test/aria/core/testResMgr/MyRes2_fr.js",
                        content : "Aria.resourcesDefinition({$classpath: 'test.aria.core.testResMgr.MyRes2', $resources: {value:'testAsyncCase2'}})"
                    }]);
            ariaCoreResMgr.loadResource(null, "test/aria/core/testResMgr/MyRes2").then(function (res) {
                self.assertEquals(res.value, "testAsyncCase2");
                self.assertEquals(res, Aria.$global.test.aria.core.testResMgr.MyRes2);
                var locale = aria.core.ResMgr.getResourceLocale("test.aria.core.testResMgr.MyRes2");
                self.assertEquals(locale, "fr");
                Aria.dispose(res);
                self.notifyTestEnd();
            }, this.handleAsyncTestError);
        },

        testAsyncCase3 : function () {
            var self = this;
            ariaCoreResMgr.currentLocale = "fr_FR";
            this.beginDownloadMgrMock([{
                        logicalPath : "test/aria/core/testResMgr/MyRes3_fr_FR.js"
                    }, {
                        logicalPath : "test/aria/core/testResMgr/MyRes3_fr.js"
                    }, {
                        logicalPath : "test/aria/core/testResMgr/MyRes3.js",
                        content : "Aria.resourcesDefinition({$classpath: 'test.aria.core.testResMgr.MyRes3', $resources: {value:'testAsyncCase3'}})"
                    }]);
            ariaCoreResMgr.loadResource(null, "test/aria/core/testResMgr/MyRes3").then(function (res) {
                self.assertEquals(res.value, "testAsyncCase3");
                self.assertEquals(res, Aria.$global.test.aria.core.testResMgr.MyRes3);
                var locale = aria.core.ResMgr.getResourceLocale("test.aria.core.testResMgr.MyRes3");
                self.assertEquals(locale, "");
                Aria.dispose(res);
                self.notifyTestEnd();
            }, this.handleAsyncTestError);
        },

        testAsyncCase4 : function () {
            var self = this;
            ariaCoreResMgr.currentLocale = "fr_FR";
            this.beginDownloadMgrMock([{
                        logicalPath : "test/aria/core/testResMgr/MyRes4_fr_FR.js"
                    }, {
                        logicalPath : "test/aria/core/testResMgr/MyRes4_fr.js"
                    }, {
                        logicalPath : "test/aria/core/testResMgr/MyRes4.js"
                    }]);
            ariaCoreResMgr.loadResource(null, "test/aria/core/testResMgr/MyRes4").then(function (res) {
                try {
                    self.fail("Loading MyRes4 should not succeed.");
                } catch (e) {
                    self.handleAsyncTestError(e);
                }
            }, function (error) {
                self.assertEquals(Aria.getClassRef("test.aria.core.testResMgr.MyRes4"), null);
                ariaCoreResMgr.unloadResource("test/aria/core/testResMgr/MyRes4");
                self.notifyTestEnd();
            });
        },

        testAsyncCase5 : function () {
            var self = this;
            ariaCoreEnvironment.setDevMode(true);
            ariaCoreResMgr.currentLocale = "fr_FR";
            this.beginDownloadMgrMock([{
                logicalPath : "test/aria/core/testResMgr/MyRes5.js",
                content : "Aria.resourcesDefinition({$classpath: 'test.aria.core.testResMgr.MyRes5', $resources: {value:'testAsyncCase5'}})"
            }]);
            ariaCoreResMgr.loadResource("myModule5", "test/aria/core/testResMgr/MyRes5").then(function (res) {
                self.assertEquals(res.value, "testAsyncCase5");
                self.assertEquals(res, Aria.$global.test.aria.core.testResMgr.MyRes5);
                var locale = aria.core.ResMgr.getResourceLocale("test.aria.core.testResMgr.MyRes5");
                self.assertEquals(locale, "fr_FR");
                Aria.dispose(res);
                self.notifyTestEnd();
            }, this.handleAsyncTestError);
        },

        testAsyncCase6 : function () {
            var self = this;
            ariaCoreEnvironment.setDevMode(false);
            ariaModulesRequestMgr._params = null;
            ariaCoreAppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null, "http://www.ariatemplates.com:8080/xyz/${moduleName}/sampleResId?locale=${locale}"]
                }
            }, null, true);
            ariaCoreResMgr.currentLocale = "fr_FR";
            this.beginDownloadMgrMock([{
                logicalPath : "test/aria/core/testResMgr/MyRes6_fr_FR.js",
                content : "Aria.resourcesDefinition({$classpath: 'test.aria.core.testResMgr.MyRes6', $resources: {value:'testAsyncCase6'}})",
                args : {
                    fullLogicalPath : "http://www.ariatemplates.com:8080/xyz/myModule6/sampleResId?locale=fr_FR"
                }
            }]);
            ariaCoreResMgr.loadResource("myModule6", "test/aria/core/testResMgr/MyRes6").then(function (res) {
                self.assertEquals(res.value, "testAsyncCase6");
                self.assertEquals(res, Aria.$global.test.aria.core.testResMgr.MyRes6);
                var locale = aria.core.ResMgr.getResourceLocale("test.aria.core.testResMgr.MyRes6");
                self.assertEquals(locale, "fr_FR");
                Aria.dispose(res);
                self.notifyTestEnd();
            }, this.handleAsyncTestError);
        },

        testAsyncCase7 : function () {
            var self = this;
            ariaCoreEnvironment.setDevMode(true);
            ariaCoreResMgr.currentLocale = "fr_FR";
            this.beginDownloadMgrMock([{
                        logicalPath : "test/aria/core/testResMgr/MyRes7.js"
                    }]);
            ariaCoreResMgr.loadResource("myModule7", "test/aria/core/testResMgr/MyRes7").then(function (res) {
                try {
                    self.fail("Loading MyRes7 should not succeed.");
                } catch (e) {
                    self.handleAsyncTestError(e);
                }
            }, function (error) {
                self.assertEquals(Aria.getClassRef("test.aria.core.testResMgr.MyRes7"), null);
                ariaCoreResMgr.unloadResource("test/aria/core/testResMgr/MyRes7");
                self.notifyTestEnd();
            });
        },

        testAsyncCase8 : function () {
            var self = this;
            ariaCoreEnvironment.setDevMode(false);
            ariaModulesRequestMgr._params = null;
            ariaCoreAppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [null, "http://www.ariatemplates.com:8080/xyz/${moduleName}/sampleResId?locale=${locale}"]
                }
            }, null, true);
            ariaCoreResMgr.currentLocale = "fr_FR";
            this.beginDownloadMgrMock([{
                        logicalPath : "test/aria/core/testResMgr/MyRes8_fr_FR.js",
                        args : {
                            fullLogicalPath : "http://www.ariatemplates.com:8080/xyz/myModule8/sampleResId?locale=fr_FR"
                        }
                    }]);
            ariaCoreResMgr.loadResource("myModule8", "test/aria/core/testResMgr/MyRes8").then(function (res) {
                try {
                    self.fail("Loading MyRes8 should not succeed.");
                } catch (e) {
                    self.handleAsyncTestError(e);
                }
            }, function (error) {
                self.assertEquals(Aria.getClassRef("test.aria.core.testResMgr.MyRes8"), null);
                ariaCoreResMgr.unloadResource("test/aria/core/testResMgr/MyRes8");
                self.notifyTestEnd();
            });
        }
    }
});
