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
    $classpath : "test.aria.templates.customization.reload.multipleCSS.ReloadTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.customization.reload.multipleCSS.Multiple"
        });

        // Know hat has been reloaded
        this.templateReloaded = false;
        this.cssOneReloaded = false;
        this.cssTwoReloaded = false;
        this.cssParentReloaded = false;
        this.cssInheritedReloaded = false;
        this.templateParentReloaded = false;
    },
    $prototype : {
        tearDown : function () {
            aria.core.IO.$unregisterListeners(this);
        },

        runTemplateTest : function () {
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

            // Reload the template context, after yielding
            aria.core.Timer.addCallback({
                fn : function () {
                    this.templateCtxt.$reload(null, {
                        fn : this._reloadComplete,
                        scope : this
                    });
                },
                scope : this,
                delay : 100
            });
        },

        _ioListener : function (args) {
            if (args.req.url.indexOf("/Multiple.tpl?") > 0) {
                this.templateReloaded = true;
            } else if (args.req.url.indexOf("/One.tpl.css?") > 0) {
                this.cssOneReloaded = true;
            } else if (args.req.url.indexOf("/Two.tpl.css?") > 0) {
                this.cssTwoReloaded = true;
            } else if (args.req.url.indexOf("/ParentCSS.tpl.css?") > 0) {
                this.cssParentReloaded = true;
            } else if (args.req.url.indexOf("/Inherited.tpl.css?") > 0) {
                this.cssInheritedReloaded = true;
            } else if (args.req.url.indexOf("/ParentTemplate.tpl?") > 0) {
                this.templateParentReloaded = true;
            }
        },

        _injectResponse : function (args) {
            if (args.req.url.indexOf("/InitialCSS.tpl.css?") > 0) {
                var response = args.req.res;
                response.responseText = response.responseText.replace(/color[\s\S]+?;/, "color: yellow;");
            }
        },

        _reloadComplete : function () {
            // Check that the template and the css are downloaded again, but not the ones that are inherited
            this.assertTrue(this.templateReloaded, "Template not reloaded");
            this.assertTrue(this.cssOneReloaded, "CSS One not reloaded");
            this.assertTrue(this.cssTwoReloaded, "CSS Two not reloaded");
            this.assertFalse(this.cssParentReloaded, "CSS Parent reloaded");
            this.assertFalse(this.cssInheritedReloaded, "CSS Inherited reloaded");
            this.assertFalse(this.templateParentReloaded, "Template Parent reloaded");

            // Check the text loaded inside the CSS manager
            //var textLoaded = aria.templates.CSSMgr.__textLoaded["samples.customization.templates.reload.InitialCSS"];
            //this.assertTrue(textLoaded.text.indexOf("yellow") > 0, "Couldn't find the color yellow in the loaded CSS");

            this.notifyTemplateTestEnd();
        }
    }
});
