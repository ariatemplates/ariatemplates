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
    $classpath : "test.aria.templates.customization.reload.sharedChild.ChildTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.customization.reload.sharedChild.TemplateContainer"
        });

        // Know hat has been reloaded
        this.tpltContainerReloaded = false;
        this.tplOne = false;
        this.tplTwo = false;
        this.cssReloaded = false;
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
                    var tplWidget = this.getWidgetInstance("tplOne");
                    tplWidget.subTplCtxt.$reload(null, {
                        fn : this._reloadComplete,
                        scope : this
                    });
                },
                scope : this,
                delay : 100
            });
        },

        _ioListener : function (args) {
            if (args.req.url.indexOf("/Conatiner.tpl?") > 0) {
                this.tpltContainerReloaded = true;
            } else if (args.req.url.indexOf("/One.tpl?") > 0) {
                this.tplOne = true;
            } else if (args.req.url.indexOf("/Two.tpl?") > 0) {
                this.tplTwo = true;
            } else if (args.req.url.indexOf("/CommonCSS.tpl.css?") > 0) {
                this.cssReloaded = true;
            } else if (args.req.url.indexOf("/ReplacedCSS.tpl.css") > 0) {
                this.cssReplaced = true;
            }
        },

        _injectResponse : function (args) {
            if (args.req.url.indexOf("/One.tpl?") > 0) {
                var response = args.req.res;
                response.responseText = response.responseText.replace(/CommonCSS/, "ReplacedCSS");
            } else if (args.req.url.indexOf("/CommonCSS.tpl.css?") > 0) {
                var response = args.req.res;
                response.responseText = response.responseText.replace(/font-size[\s\S]+?;/, "font-size: 30pt;");
            }
        },

        _reloadComplete : function () {
            // Check that the template and the css are downloaded again, but not the ones that are inherited
            this.assertFalse(this.tpltContainerReloaded, "Template not reloaded");
            this.assertTrue(this.tplOne, "Template One reloaded");
            this.assertFalse(this.tplTwo, "Template Two reloaded");
            this.assertTrue(this.cssReloaded, "CSS not reloaded");
            this.assertTrue(this.cssReplaced, "CSS not replaced");

            // Check the text loaded inside the CSS manager
            var textLoaded = aria.templates.CSSMgr.__textLoaded;
            this.assertTrue(!!textLoaded["test.aria.templates.customization.reload.sharedChild.CommonCSS"]);
            this.assertTrue(!!textLoaded["test.aria.templates.customization.reload.sharedChild.ReplacedCSS"]);

            this.notifyTemplateTestEnd();
        }
    }
});
