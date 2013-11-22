/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath : "test.aria.templates.reloadResources.ReloadResourcesTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.reloadResources.LocalizedTemplate"
        });

        this.resReloaded = false;
        this.cont = 0;
        this.defaultTestTimeout = 10000;
    },
    $prototype : {
        tearDown : function () {
            // Delete the resource loaded
            delete aria.core.ResMgr.loadedResources["test.aria.templates.reloadResources.ExternalResource"];
            aria.core.IO.$removeListeners(this);
        },

        runTemplateTest : function () {
            this.resMod = "";
            this.resErr = "";
            var url = Aria.rootFolderPath + "test/aria/templates/reloadResources/ExternalResource";

            // Listen for requests sent to the server
            aria.core.IO.$on({
                "request" : {
                    fn : this._ioListener,
                    scope : this
                },
                "response" : {
                    fn : this._injectResponse,
                    scope : this
                }
            });

            aria.core.IO.asyncRequest({
                url : url + "Mod.js",
                callback : {
                    fn : this._resMod,
                    scope : this
                }
            });

            aria.core.IO.asyncRequest({
                url : url + "Err.js",
                callback : {
                    fn : this._resErr,
                    scope : this
                }
            });

            this.assertTrue(test.aria.templates.reloadResources.ExternalResource.common.label.ok == "OK", "Resource not loaded");
            this.assertTrue(this.templateCtxt._tpl.res.common.label.ok == "OK", "Resource not loaded");
            aria.core.Timer.addCallback({
                fn : this._firstReload,
                scope : this,
                delay : 500
            });
        },

        _resMod : function (asyncRes) {
            this.resMod = asyncRes.responseText;
        },

        _resErr : function (asyncRes) {
            this.resErr = asyncRes.responseText;
        },

        _ioListener : function (args) {
            if (args.req.url.indexOf("/ExternalResource.js?") > 0) {
                this.resReloaded = true;
                this.cont++;
            }
        },

        _injectResponse : function (args) {
            // Sending back the resource file modified, first time with errors and the second time correct.
            var response = args.req.res;
            if (response.url.indexOf("/ExternalResource.js?") > 0) {
                if (this.cont == 1)
                    response.responseText = this.resErr;
                else if (this.cont == 2)
                    response.responseText = this.resMod;
            }
        },

        _firstReload : function () {
            // Trigger the reload
            this.templateCtxt.$reload(null, {
                fn : this._firstReloadComplete,
                scope : this
            });
        },

        _firstReloadComplete : function () {
            // Remove the error prompted when the test loads a resource file with an error inside
            this.assertErrorInLogs(aria.core.ClassLoader.CLASS_LOAD_ERROR);
            // Trigger the reload
            aria.templates.TemplateManager.unloadTemplate("test.aria.templates.reloadResources.LocalizedTemplate", true);

            this._replaceTestTemplate({
                template : "test.aria.templates.reloadResources.LocalizedTemplate"
            }, this._secondReloadComplete);
        },

        _secondReloadComplete : function () {
            // Check that the resource file is downloaded again
            this.assertTrue(this.resReloaded, "Res not reloaded");
            // Check the text loaded inside the Res file
            this.assertTrue(test.aria.templates.reloadResources.ExternalResource.common.label.ok == "KO", "Resource not downloaded again");
            this.assertTrue(this.templateCtxt._tpl.res.common.label.ok == "KO", "Resource not downloaded again");

            this.end();
        }
    }
});
