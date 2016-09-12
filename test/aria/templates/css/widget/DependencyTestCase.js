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
    $classpath : "test.aria.templates.css.widget.DependencyTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Type", "aria.templates.CSSMgr", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.css.widget.DependencyTemplate"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            // Try to load a class that has a dependency on a css file (not a template)
            Aria.load({
                classes : ["test.aria.templates.css.widget.DependencyLoader"],
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
            // Try to instantiate the CSS Template object that should be loaded as a dependency of the previous class
            var Css = Aria.getClassRef("test.aria.templates.css.widget.DependencyCSS");

            this.assertTrue(!!Css, "CSS dependency is not loaded");

            // Now try to put the CSS in the page
            var instance = test.aria.templates.css.widget.DependencyLoader;
            var cm = aria.templates.CSSMgr;
            cm.loadClassPathDependencies(instance.$classpath, instance.$css);

            var tag = aria.utils.Dom.getElementById(cm.__TAG_PREFX + "pool1");
            this.assertTrue(aria.utils.Type.isHTMLElement(tag));

            this.notifyTemplateTestEnd();
        }
    }
});
