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
    $classpath : "test.aria.templates.css.WidgetContext.ContextTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.templates.CSSMgr", "aria.utils.Json"],
    $prototype : {
        tearDown : function () {
            // Restore the original function
            aria.templates.CSSMgr.__reloadStyleTags = aria.templates.CSSMgr.classDefinition.$prototype.__reloadStyleTags;
        },

        runTemplateTest : function () {
            // Try to load a class that has a dependency on a css file (not a template)
            Aria.load({
                classes : ["test.aria.templates.css.WidgetContext.DependencyLoader"],
                oncomplete : {
                    fn : this.classLoaded,
                    scope : this
                },
                onerror : {
                    fn : this.handleAsyncTestError,
                    scope : this,
                    args : new Error("Aria.load failed")
                }
            });
        },

        classLoaded : function () {
            // Now override the CSSMgr to test the insertion
            var cm = aria.templates.CSSMgr;
            var closure = {};
            cm.__reloadStyleTags = function (arg) {
                closure = arg;
            };

            var instance = test.aria.templates.css.WidgetContext.DependencyLoader;
            cm.loadWidgetDependencies(instance.$classpath, instance.$css);

            var dependencyText = "";
            for (var i = 0; i < closure.wgt.length; i += 1) {
                if (closure.wgt[i] === "test.aria.templates.css.WidgetContext.DependencyCSS") {
                    // the next items are a closing comment **/ and the actual loaded test
                    dependencyText = closure.wgt[i + 2];
                }
            }

            this.assertEquals(dependencyText, "main");

            this.notifyTemplateTestEnd();
        }
    }
});
