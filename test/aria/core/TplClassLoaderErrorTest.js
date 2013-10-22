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
var testAriaTemplatesTestErrorSlowDown = require("../templates/test/error/SlowDown");
var ariaJsunitTestCase = require("ariatemplates/jsunit/TestCase");
var ariaCoreCache = require("ariatemplates/core/Cache");
var ariaCoreDownloadMgr= require("ariatemplates/core/DownloadMgr");
var ariaCoreIOFiltersMgr = require("ariatemplates/core/IOFiltersMgr");
var ariaCoreMultiLoader = require("ariatemplates/core/MultiLoader");
var ariaCoreResMgr = require("ariatemplates/core/ResMgr");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.core.TplClassLoaderErrorTest",
    $extends : ariaJsunitTestCase,
    $prototype : {
        setUp : function () {
            var document = Aria.$window.document;
            this.thisDivIsInTheBody = document.createElement("div");
            this.thisDivIsInTheBody.id = "thisDivIsInTheBody";
            document.body.appendChild(this.thisDivIsInTheBody);

            // Add a filter to slow down the script, I need an instance otherwise it's not loaded for a while
            this.filterSlow = new testAriaTemplatesTestErrorSlowDown();
            ariaCoreIOFiltersMgr.addFilter(this.filterSlow);
        },

        tearDown : function () {
            this.thisDivIsInTheBody.parentNode.removeChild(this.thisDivIsInTheBody);

            ariaCoreIOFiltersMgr.removeFilter(this.filterSlow);
            this.filterSlow.$dispose();
            this.filterSlow = null;
        },

        cleanLogicalPath : function (logicalPath) {
            ariaCoreDownloadMgr.clearFile(logicalPath);
            delete require.cache[logicalPath];
            var classpath = logicalPath.replace(/\.[^\/]+$/,"").replace(/\//g,".");
            Aria.dispose(classpath);
            Aria.cleanGetClassRefCache(classpath);
        },

        /**
         * Load a template with an error, but slow down the script loading so that it comes after the first syntax error
         */
        testAsyncLoadTemplateErrors : function () {
            Aria.loadTemplate({
                classpath : "test.aria.templates.test.error.BadResources",
                div : "thisDivIsInTheBody"
            }, {
                fn : this._loadTemplateErrorsCallback,
                scope : this
            });

        },

        _loadTemplateErrorsCallback : function (res) {
            try {
                this.assertFalse(res.success);
                this.assertErrorInLogs(ariaCoreMultiLoader.LOAD_ERROR);

                var cacheItem = require.cache["test/aria/templates/test/error/BadResourcesScript.js"];
                this.assertTrue(cacheItem.preloaded, "Template script should be preloaded before calling the callback");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.cleanLogicalPath("test/aria/templates/test/error/BadResources.tpl");
            this.cleanLogicalPath("test/aria/templates/test/error/BadResourcesScript.js");

            this.notifyTestEnd("testAsyncLoadTemplateErrors");
        },

        /**
         * This test tries to load a template depending on an invalid item having sub dependencies
         */
        testAsyncLoadInvalidDependencies : function () {
            // Inject an invalid item in the cache
            var cacheItem = ariaCoreCache.getItem("files", "invalidInCache.js", true);
            cacheItem.status = ariaCoreCache.STATUS_ERROR;

            Aria.loadTemplate({
                classpath : "test.aria.templates.test.error.InvalidCache",
                div : "thisDivIsInTheBody"
            }, {
                fn : this._loadInvalidDependenciesCallback,
                scope : this
            });
        },

        _loadInvalidDependenciesCallback : function (res) {
            try {
                this.assertFalse(res.success);
                this.assertErrorInLogs(ariaCoreMultiLoader.LOAD_ERROR);

                var cacheItem = require.cache["test/aria/templates/test/error/GoodDependency.js"];
                this.assertTrue(cacheItem.preloaded, "GoodDependency should be available");

                var cacheItem = require.cache["test/aria/templates/test/error/InvalidCache.tpl"];
                this.assertFalse(cacheItem.preloaded, "Template should not be available");

                var cacheItem = require.cache["test/aria/templates/test/error/GoodTemplate.tpl"];
                this.assertTrue(cacheItem.preloaded, "Good Template should be available");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.cleanLogicalPath("invalidInCache.js");
            this.cleanLogicalPath("test/aria/templates/test/error/GoodDependency.js");
            this.cleanLogicalPath("test/aria/templates/test/error/InvalidCache.tpl");
            this.cleanLogicalPath("test/aria/templates/test/error/GoodTemplate.tpl");

            this.notifyTestEnd("testAsyncLoadInvalidDependencies");
        },

        /**
         * This test tries to load a template depending on an invalid item without any sub dependency
         */
        testAsyncLoadInvalidDependenciesNoDependencies : function () {
            // Inject an invalid item in the cache
            var cacheItem = ariaCoreCache.getItem("files", "invalidInCache.js", true);
            cacheItem.status = ariaCoreCache.STATUS_ERROR;

            Aria.loadTemplate({
                classpath : "test.aria.templates.test.error.InvalidCacheNoDep",
                div : "thisDivIsInTheBody"
            }, {
                fn : this._loadInvalidDependenciesNoDependenciesCallback,
                scope : this
            });
        },

        _loadInvalidDependenciesNoDependenciesCallback : function (res) {
            try {
                this.assertFalse(res.success);
                this.assertErrorInLogs(ariaCoreMultiLoader.LOAD_ERROR);

                var cacheItem = require.cache["test/aria/templates/test/error/GoodDependency.js"];
                this.assertTrue(cacheItem.preloaded, "GoodDependency should be available");

                var cacheItem = require.cache["test/aria/templates/test/error/InvalidCacheNoDep.tpl"];
                this.assertFalse(cacheItem.preloaded, "Template should not be available");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.cleanLogicalPath("invalidInCache.js");
            this.cleanLogicalPath("test/aria/templates/test/error/GoodDependency.js");
            this.cleanLogicalPath("test/aria/templates/test/error/InvalidCacheNoDep.tpl");

            this.notifyTestEnd("testAsyncLoadInvalidDependenciesNoDependencies");
        },

        /**
         * Load a template depending several times on a class in error
         */
        testAsyncLoadTemplateErrorsMultiple : function () {
            Aria.loadTemplate({
                classpath : "test.aria.templates.test.error.BadResourcesMultiple",
                div : "thisDivIsInTheBody"
            }, {
                fn : this._loadTemplateErrorsMultipleCallback,
                scope : this
            });

        },

        _loadTemplateErrorsMultipleCallback : function (res) {
            try {
                this.assertFalse(res.success);
                this.assertErrorInLogs(ariaCoreMultiLoader.LOAD_ERROR);

                var cacheItem = require.cache["test/aria/templates/test/error/BadResourcesMultiple.tpl"];
                this.assertFalse(cacheItem.preloaded, "Template should not be available");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.cleanLogicalPath("test/aria/templates/test/error/BadResourcesMultiple.tpl");

            this.notifyTestEnd("testAsyncLoadTemplateErrorsMultiple");
        }

    }
});
