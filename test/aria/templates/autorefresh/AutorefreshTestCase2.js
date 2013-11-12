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
    $classpath : "test.aria.templates.autorefresh.AutorefreshTestCase2",
    $events : {
        "Ready" : {
            description : "Raised when the template content is fully displayed."
        }
    },
    $extends : 'aria.jsunit.TemplateTestCase',
    $dependencies : ['aria.templates.RefreshManager'],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        var testData = {
            a : {
                a : "aa",
                b : "ab"
            },
            b : "b",
            c : "c"
        };
        this.setTestEnv({
            template : "test.aria.templates.autorefresh.Template2A",
            data : testData
        });
        this.rm = aria.templates.RefreshManager;

        this._refreshesAA = 0;
        this._refreshesAAA = 0;
        this._template2A = 0;
        this._refreshesTemplateC = 0;
    },
    $destructor : function () {
        this._refreshesAA = null;
        this._refreshesAAA = null;
        this._templateC = null;
        this._template2A;
        this._refreshesTemplateC;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {

            this.rm.updateHierarchies();
            var h = this.rm.getHierarchies();

            this.rm.stop();

            var root = null;
            for (var i = 0; i < h.length; i++) {
                if (h[i].elem.tplClasspath == this.env.template) {
                    root = h[i];
                    break;
                }
            }
            var sectionAA = root.content[0].elem;

            var template2A = root.elem;
            var templateC = root.content[1].elem.behavior;

            aria.utils.Json.setValue(this.templateCtxt._tpl.data.a, "a", "newA");

            sectionAA.tplCtxt.$on({
                "SectionRefreshed" : {
                    fn : function (evt) {
                        // evt.name ==SectionRefreshed
                        if (evt.sectionID == "SectionAA") {
                            this._refreshesAA++;
                        }
                    },
                    scope : this
                }
            });

            templateC.subTplCtxt.$on({
                "Ready" : {
                    fn : function () {
                        this._refreshesTemplateC++;
                    },
                    scope : this
                }
            });

            this.rm.resume();

            this.assertTrue(this.getInputField("AAAtextfield").value === "newA");
            this.assertTrue(this._refreshesTemplateC === 0);
            this.assertTrue(this._refreshesAA === 1);

            this.end();
        }
    }
});
