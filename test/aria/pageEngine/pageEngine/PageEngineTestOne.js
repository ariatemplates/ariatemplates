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
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineTestOne",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.fakeSite.PageProvider");
    },
    $prototype : {

        runTestInIframe : function () {

            this._createPageEngine({
                providerArgs : {
                    failOnSite : true
                },
                onerror : "_onSiteConfigFailure"
            });
        },

        _onSiteConfigFailure : function (args) {
            this.assertTrue(args == this.pageEngine.SITE_CONFIG_NOT_AVAILABLE);
            this.assertErrorInLogs(this.pageEngine.SITE_CONFIG_NOT_AVAILABLE);
            this._disposePageEngine();

            this._createPageEngine({
                providerArgs : {
                    incorrectSite : true
                },
                onerror : "_onInvalidSiteConfig"
            });
        },
        _onInvalidSiteConfig : function (args) {
            this.assertTrue(args == this.pageEngine.INVALID_SITE_CONFIGURATION);
            this.assertErrorInLogs(this.pageEngine.INVALID_SITE_CONFIGURATION + ":");
            this.assertErrorInLogs("1 - " + aria.core.JsonValidator.MISSING_MANDATORY);

            this._disposePageEngine();
            this._createPageEngine({
                providerArgs : {
                    missingSiteDependencies : true
                },
                onerror : "_onMissingSiteDependencies"
            });
        },
        _onMissingSiteDependencies : function (args) {
            this.assertTrue(args == this.pageEngine.MISSING_DEPENDENCIES);
            this.assertErrorInLogs(this.pageEngine.MISSING_DEPENDENCIES);
            this.assertErrorInLogs(aria.core.MultiLoader.LOAD_ERROR);

            this._disposePageEngine();
            this._createPageEngine({
                providerArgs : {
                    failOnPage : true
                },
                onerror : "_onPageFailure"
            });
        },
        _onPageFailure : function (args) {
            this.assertTrue(args == this.pageEngine.PAGE_NOT_AVAILABLE);
            this.assertErrorInLogs(this.pageEngine.PAGE_NOT_AVAILABLE);

            this._disposePageEngine();
            this._createPageEngine({
                providerArgs : {
                    incorrectPage : true
                },
                onerror : "_onInvalidPage"
            });
        },
        _onInvalidPage : function (args) {
            this.assertTrue(args == this.pageEngine.INVALID_PAGE_DEFINITION);
            this.assertErrorInLogs(this.pageEngine.INVALID_PAGE_DEFINITION + ":");
            this.assertErrorInLogs("1 - " + aria.core.JsonValidator.MISSING_MANDATORY);

            this._disposePageEngine();
            this._createPageEngine({
                providerArgs : {
                    missingPageDependencies : true
                },
                onerror : "_onMissingPageDependencies"
            });
        },
        _onMissingPageDependencies : function (args) {
            this.assertTrue(args == this.pageEngine.MISSING_DEPENDENCIES);
            this.assertErrorInLogs(this.pageEngine.MISSING_DEPENDENCIES);
            this.assertErrorInLogs(aria.core.MultiLoader.LOAD_ERROR);

            this.end();
        },

        _createPageEngine : function (args) {

            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.fakeSite.PageProvider(args.providerArgs);
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();
            this.pageEngine.start({
                pageProvider : this.pageProvider,
                onerror : {
                    fn : this[args.onerror],
                    scope : this
                }
            });

        },

        end : function () {
            this._disposePageEngine();
            this.$PageEngineBaseTestCase.end.call(this);
        },

        _disposePageEngine : function () {
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();

        }

    }
});
