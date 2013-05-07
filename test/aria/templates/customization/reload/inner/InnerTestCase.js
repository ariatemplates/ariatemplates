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
    $classpath : "test.aria.templates.customization.reload.inner.InnerTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.customization.reload.inner.MainContainer"
        });

        // Know hat has been reloaded
        this.mainReloaded = false;
        this.innerReloaded = false;
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
            if (args.req.url.indexOf("/MainContainer.tpl?") > 0) {
                this.mainReloaded = true;
            } else if (args.req.url.indexOf("/Inside.tpl?") > 0) {
                this.innerReloaded = true;
            } else if (args.req.url.indexOf("/CSSContent.tpl.css?") > 0) {
                this.cssReloaded = true;
            }
        },

        _reloadComplete : function () {
            // Check that the template and the css are downloaded again, but not the ones that are inherited
            this.assertTrue(this.mainReloaded, "Main Template not reloaded");
            this.assertFalse(this.innerReloaded, "Inner Template reloaded");
            this.assertFalse(this.cssReloaded, "CSS reloaded");

            this.notifyTemplateTestEnd();
        }
    }
});
