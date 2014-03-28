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
    $classpath : "test.aria.templates.autorefresh.AutorefreshTestCase4",
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
            c : {
                a : "ca",
                b : "cb"
            }
        };
        this.setTestEnv({
            template : "test.aria.templates.autorefresh.TemplateA4",
            data : testData,
            moduleCtrl : {
                classpath : 'test.aria.templates.autorefresh.RefreshModule'
            }
        });

        this.rm = aria.templates.RefreshManager;

        this._refreshesAA = 0;
        this._refreshesAAA = 0;
        this._refreshesCA = 0;
        this._refreshesTemplateA = 0;
        this._refreshesTemplateB = 0;
        this._refreshesTemplateC = 0;
        this._refreshesTemplateD = 0;

        this._expectedRefreshesSync = 1;
        this._expectedRefreshesAsync = 1;

        this.defaultTestTimeout = 30000;

    },
    $destructor : function () {
        this._refreshesAA = null;
        this._refreshesAAA = null;
        this._templateA = null;
        this._templateB = null;
        this._templateC = null;
        this._templateD = null;
        this._refreshesTemplateB = null;
        this._refreshesTemplateC = null;

        this.mc = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.mc = this.templateCtxt.moduleCtrl;
            this.mcp = this.templateCtxt.moduleCtrlPrivate;

            this._subscribeListeners();

            this._testSyncMethod();
        },

        _testSyncMethod : function () {
            this.mc.syncRefreshes(this._templateA);

            // test Template A was refreshed just once
            this._gotRefreshesSync = this._refreshesTemplateA;
            this.assertEquals(this._gotRefreshesSync, this._expectedRefreshesSync, "Expected %2 sync refreshes but got %1");

            this._testAsyncMethod();

        },

        _testAsyncMethod : function () {
            this.mc.asyncRefreshes({
                fn : this._testAsyncMethodCB,
                scope : this
            });
        },

        _testAsyncMethodCB : function () {
            // test Template A was refreshed jsut once since the last time!
            var gotRefreshesAsync = this._refreshesTemplateA - this._gotRefreshesSync;
            this.assertEquals(gotRefreshesAsync, this._expectedRefreshesAsync, "Expected %2 async refreshes but got %1");
            this.finishTest();
        },

        /**
         * Finalize the test, in this case, nothing special to do
         */
        finishTest : function () {
            this.notifyTemplateTestEnd();
        },

        _subscribeListeners : function () {

            this.rm.updateHierarchies();
            var h = this.rm.getHierarchies();

            var root = null;
            for (var i = 0; i < h.length; i++) {
                if (h[i].elem.tplClasspath == this.env.template) {
                    root = h[i];
                    break;
                }
            }

            var sectionAA = root.content[0].content[0].elem;
            var sectionAAA = root.content[0].content[0].content[1].elem;

            this._templateA = root.elem;
            this._templateB = root.content[0].content[0].content[0].elem.behavior;
            this._templateC = root.content[0].content[1].elem.behavior;
            this._templateD = root.content[0].content[1].content[0].content[0].elem.behavior;

            sectionAA.tplCtxt.$on({
                "Ready" : {
                    fn : function () {
                        this._refreshesTemplateA++;
                    },
                    scope : this
                },
                "SectionRefreshed" : {
                    fn : function (evt) {
                        // evt.name ==SectionRefreshed
                        // evt.sectionID == "tpl0_section_SectionAA"
                        if (evt.sectionID == "SectionAA") {
                            this._refreshesAA++;
                        }
                    },
                    scope : this
                }
            });
            sectionAAA.tplCtxt.$on({
                "SectionRefreshed" : {
                    fn : function (evt) {
                        if (evt.sectionID == "SectionAAA") {
                            this._refreshesAAA++;

                        }
                    },
                    scope : this
                }
            });

            this._templateB.subTplCtxt.$on({
                "Ready" : {
                    fn : function () {
                        this._refreshesTemplateB++;
                    },
                    scope : this
                },
                "SectionRefreshed" : {
                    fn : function (evt) {},
                    scope : this
                }
            });

            this._templateC.subTplCtxt.$on({
                "Ready" : {
                    fn : function () {
                        this._refreshesTemplateC++;
                    },
                    scope : this
                }
            });
        }
    }
});
