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
    $classpath : "test.aria.templates.autorefresh.AutorefreshTestCase",
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
            template : "test.aria.templates.autorefresh.TemplateA",
            data : testData
        });
        this.rm = aria.templates.RefreshManager;

        this._refreshesAA = 0;
        this._refreshesAAA = 0;
        this._refreshesCA = 0;
        this._refreshesTemplateA = 0;
        this._refreshesTemplateB = 0;
        this._refreshesTemplateC = 0;
        this._refreshesTemplateD = 0;

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
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this._subscribeListeners();

            this.rm.stop();

            this._templateB.subTplCtxt.$refresh(); // child template (TemplateB)
            this._templateD.subTplCtxt.$refresh(); // refresh TemplateD

            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "b", "mediumB1"); // bound to W_tf_B. should be
            // discarded by RefreshManager as
            // we're updating it again!
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "b", "newB1"); // bound to W_tf_B
            aria.utils.Json.setValue(this.templateCtxt._tpl.data.a, "a", "newA1"); // bound to W_tf_AAA

            this.rm.resume();

            this.assertEquals(this.getInputField('BAtextfield').value, 'newB1');
            this.assertEquals(this.getInputField('AAAtextfield').value, 'newA1');

            // this.assertTrue(this._refreshesTemplateB == 1); //not working because listeners to the "Ready" event are
            // being destroyed when parent section is refreshed

            this.assertEquals(this._refreshesAA, 1);

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
            /* BACKWARD-COMPATIBILITY-BEGIN*/ /*deprecation of {bindRefreshTo}; change also TemplateA.tpl. */
            var sectionAA = root.content[0].elem;
            var sectionAAA = root.content[0].content[1].elem;
            this._templateB = root.content[0].content[0].elem.behavior;
            this._templateC = root.content[1].elem.behavior;
            this._templateD = root.content[1].content[0].content[0].elem.behavior;
            /* BACKWARD-COMPATIBILITY-END*/

            /*
            deprecation of {bindRefreshTo} statement: remove the 5 lines above and uncomment the ones below.
            (This is a good start, though it doesn't work as it's supposed to be - to investigate).

            var sectionAA = root.content[0].content[0].elem;
            var sectionAAA = root.content[0].content[0].content[1].elem;
            this._templateB = root.content[0].content[0].content[0].elem.behavior;
            this._templateC = root.content[0].content[1].elem.behavior;
            this._templateD = root.content[0].content[1].content[0].content[0].elem.behavior;

            console.log(sectionAA.id);
            console.log(sectionAAA.id);
            console.log(this._templateB._cfg.defaultTemplate);
            console.log(this._templateC._cfg.defaultTemplate);
            console.log(this._templateD._cfg.defaultTemplate);
            */

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
                        // evt.sectionID == "SectionAA"
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
