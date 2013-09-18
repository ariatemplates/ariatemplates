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
var ariaCoreClassLoader = require("ariatemplates/core/ClassLoader");
var ariaCoreIOFiltersMgr = require("ariatemplates/core/IOFiltersMgr");
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
            // Otherwise the resource is loaded again when we reset the locale at the end of a test
            delete ariaCoreResMgr.loadedResources["test.aria.templates.test.error.Resource"];
            this.thisDivIsInTheBody.parentNode.removeChild(this.thisDivIsInTheBody);

            ariaCoreIOFiltersMgr.removeFilter(this.filterSlow);
            this.filterSlow.$dispose();
            this.filterSlow = null;
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
                this.assertErrorInLogs(ariaCoreClassLoader.CLASS_LOAD_ERROR);

                var cacheItem = ariaCoreCache.getItem("classes", "test.aria.templates.test.error.BadResourcesScript");
                this.assertEquals(cacheItem.status, ariaCoreCache.STATUS_AVAILABLE, "Template script should be loaded before calling the callback");
            } catch (ex) {}

            this.notifyTestEnd("testAsyncLoadTemplateErrors");
        },

        /**
         * This test tries to load a template depending on an invalid item having sub dependencies
         */
        testAsyncLoadInvalidDependencies : function () {
            // Inject an invalid item in the cache
            var cacheItem = ariaCoreCache.getItem("classes", "invalidInCache", true);
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

                var cacheItem = ariaCoreCache.getItem("classes", "test.aria.templates.test.error.GoodDependency");
                this.assertFalse(!!cacheItem, "GoodDependency shouldn't be in cache");

                var cacheItem = ariaCoreCache.getItem("classes", "test.aria.templates.test.error.InvalidCache");
                this.assertEquals(cacheItem.status, ariaCoreCache.STATUS_ERROR, "Template should be in error");

                var cacheItem = ariaCoreCache.getItem("classes", "test.aria.templates.test.error.GoodTemplate");
                this.assertEquals(cacheItem.status, ariaCoreCache.STATUS_AVAILABLE, "Good Template should be available");
            } catch (ex) {}

            delete ariaCoreCache.content.classes.InvalidInCache;

            this.notifyTestEnd("testAsyncLoadInvalidDependencies");
        },

        /**
         * This test tries to load a template depending on an invalid item without any sub dependency
         */
        testAsyncLoadInvalidDependenciesNoDependencies : function () {
            // Inject an invalid item in the cache
            var cacheItem = ariaCoreCache.getItem("classes", "invalidInCache", true);
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

                var cacheItem = ariaCoreCache.getItem("classes", "test.aria.templates.test.error.GoodDependency");
                this.assertFalse(!!cacheItem, "GoodDependency shouldn't be in cache");

                var cacheItem = ariaCoreCache.getItem("classes", "test.aria.templates.test.error.InvalidCacheNoDep");
                this.assertEquals(cacheItem.status, ariaCoreCache.STATUS_ERROR, "Template should be in error");
            } catch (ex) {}

            delete ariaCoreCache.content.classes.InvalidCacheNoDep;

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
                this.assertErrorInLogs(ariaCoreClassLoader.CLASS_LOAD_ERROR);

                var cacheItem = ariaCoreCache.getItem("classes", "test.aria.templates.test.error.BadResourcesScript");
                this.assertEquals(cacheItem.status, ariaCoreCache.STATUS_AVAILABLE, "Template script should be loaded before calling the callback");
            } catch (ex) {}

            this.notifyTestEnd("testAsyncLoadTemplateErrorsMultiple");
        }

    }
});
