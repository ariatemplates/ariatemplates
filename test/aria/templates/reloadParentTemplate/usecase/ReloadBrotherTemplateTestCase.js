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
    $classpath : "test.aria.templates.reloadParentTemplate.usecase.ReloadBrotherTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {};
        this._initValues();
        this.setTestEnv({
            template : "test.aria.templates.reloadParentTemplate.usecase.ContainerTemplate",
            data : this.data
        });

        this.cont = 0;
    },
    $prototype : {
        tearDown : function () {
            aria.core.IO.$removeListeners({
                "request" : {
                    fn : this._ioListener,
                    scope : this
                },
                "response" : {
                    fn : this._injectResponse,
                    scope : this
                }
            });
        },

        runTemplateTest : function () {
            this.templateMod = "";
            this.templateScriptMod = "";
            var url = Aria.rootFolderPath + "test/aria/templates/reloadParentTemplate/ParentTemplate";

            // Testing the initial values
            this.assertEquals(Aria.getClasspath(test.aria.templates.reloadParentTemplate.ChildTemplate.classDefinition.$extends), test.aria.templates.reloadParentTemplate.ParentTemplate.classDefinition.$classpath, "Child doesn't extend parent");
            this.assertEquals(Aria.getClasspath(test.aria.templates.reloadParentTemplate.usecase.BrotherTemplate.classDefinition.$extends), test.aria.templates.reloadParentTemplate.ParentTemplate.classDefinition.$classpath, "Brother doesn't extend parent");
            this.assertTrue(this.data.something === 0, "Data.something is not zero");

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
                url : url + "Mod.tpl",
                callback : {
                    fn : this._afterMockLoad,
                    scope : this,
                    args : "templateMod"
                }
            });

            aria.core.IO.asyncRequest({
                url : url + "ModScript.js",
                callback : {
                    fn : this._afterMockLoad,
                    scope : this,
                    args : "templateScriptMod"
                }
            });
        },

        _ioListener : function (args) {
            if (args.req.url.indexOf("/ChildTemplate.tpl?") > 0) {
                this.childTemplateReloaded = true;
            }
            if (args.req.url.indexOf("/ParentTemplate.tpl?") > 0) {
                this.parentTemplateReloaded = true;
            }
        },

        _injectResponse : function (args) {
            // Sending back templates and template scripts with modifications.
            var response = args.req.res;
            if (response.url.indexOf("/ParentTemplate.tpl?") > 0) {
                response.responseText = this.templateMod;
            } else if (response.url.indexOf("/ParentTemplateScript.js?") > 0) {
                response.responseText = this.templateScriptMod;
            }
        },

        _afterMockLoad : function (asyncRes, mockVar) {
            this[mockVar] = asyncRes.responseText;
            this.cont++;

            if (this.cont == 2) {
                this._reload();
            }
        },

        _reload : function () {
            // Trigger the reload for the child template, stopping the reload process to the grand parent template
            aria.templates.TemplateManager.unloadTemplate("test.aria.templates.reloadParentTemplate.ChildTemplate", true, "test.aria.templates.reloadParentTemplate.ParentTemplate");
            this._replaceTestTemplate({
                template : "test.aria.templates.reloadParentTemplate.usecase.ContainerTemplate",
                data : this.data
            }, this._reloadComplete);
        },

        _reloadComplete : function () {

            var brotherTemplate = this.getWidgetInstance("brother");
            brotherTemplate.subTplCtxt.$refresh();
            var div = this.getElementById("brother");

            // Check that the child template has been reloaded
            this.assertTrue(this.childTemplateReloaded, "Child Template not reloaded");
            // Check that the parent template has been reloaded
            this.assertTrue(this.parentTemplateReloaded, "Parent Template not reloaded");
            this.assertEquals(this.data.something, 3, "Data.something did not change");

            // Check that the brother has been refreshed after a parent reload
            this.assertNotEquals(div.firstChild.innerHTML, "", "Impossible to refresh brother template");

            this.end();
        },

        _initValues : function () {
            this.data.something = 0;
            this.childTemplateReloaded = false;
            this.parentTemplateReloaded = false;
        }
    }
});
