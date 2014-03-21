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
    $extends : 'aria.jsunit.TemplateTestCase',
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.testData = {
            a : {
                a : "aa",
                b : "ab"
            },
            b : "b",
            c : {
                a : "ca",
                b : "cb"
            },
            refreshes : {
                TemplateA : 0,
                TemplateB : 0,
                TemplateC : 0,
                TemplateD : 0
            }
        };
        this.setTestEnv({
            template : "test.aria.templates.autorefresh.TemplateA",
            data : this.testData
        });

        this._templateA = null;
        this._templateB = null;
        this._templateD = null;

        this._refreshesAA = 0;
        this._refreshesAAA = 0;
    },
    $destructor : function () {
        this._templateA = null;
        this._templateB = null;
        this._templateD = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.rm = this.testWindow.aria.templates.RefreshManager;
            this._retrieveContexts();
            this._subscribeListeners();

            this.rm.stop();

            for (var i = 0; i < 10; i++) { // many times, but it should be done only once
                this._templateB.$refresh();
                this._templateD.$refresh();
            }
            aria.utils.Json.setValue(this.testData, "b", "mediumB1");
            aria.utils.Json.setValue(this.testData, "b", "newB1"); // bound to W_tf_B
            aria.utils.Json.setValue(this.testData.a, "a", "newA1"); // bound to W_tf_AAA

            this.assertEquals(this.getInputField('BAtextfield').value, 'b');
            this.assertEquals(this.getInputField('AAAtextfield').value, 'aa');

            this.rm.resume();

            this.assertEquals(this.getInputField('BAtextfield').value, 'newB1');
            this.assertEquals(this.getInputField('AAAtextfield').value, 'newA1');

            this.assertEquals(this._refreshesAA, 1);
            this.assertEquals(this._refreshesAAA, 0);

            this.assertEquals(this.testData.refreshes.TemplateA, 1);
            this.assertEquals(this.testData.refreshes.TemplateB, 2);
            this.assertEquals(this.testData.refreshes.TemplateC, 1);
            this.assertEquals(this.testData.refreshes.TemplateD, 2);

            this.end();
        },

        _retrieveContexts : function () {
            this._templateA = this.templateCtxt;
            var subTpls = this._retrieveDirectSubTemplates(this._templateA);
            this._templateB = subTpls[0];
            var templateC = subTpls[1];
            subTpls = this._retrieveDirectSubTemplates(templateC);
            this._templateD = subTpls[0];
        },

        _subscribeListeners : function () {

            this._templateA.$on({
                "Ready" : {
                    fn : function () {
                        this._refreshesTemplateA++;
                    },
                    scope : this
                },
                "SectionRefreshed" : {
                    fn : function (evt) {
                        if (evt.sectionID == "SectionAA") {
                            this._refreshesAA++;
                        }
                        if (evt.sectionID == "SectionAAA") {
                            this._refreshesAAA++;
                        }
                    },
                    scope : this
                }
            });
        }
    }
});
