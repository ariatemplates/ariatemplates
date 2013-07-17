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

/**
 * Test event propagation for on statement Scenario 0: propagation Scenario 1: stop propagation with
 * evt.stopPropagation(); Scenario 2: stop propagation with return false;
 */
Aria.classDefinition({
    $classpath : 'test.aria.templates.events.eventpropagation.EventPropagationTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $dependencies : ['aria.utils.Dom'],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.events.eventpropagation.EventPropagation",
            data : {
                outter : 0,
                inner : 0,
                scenario : 0
            }
        });
    },
    $prototype : {

        runTemplateTest : function () {
            this.synEvent.click(aria.utils.Dom.getElementById("inner"), {
                fn : this.checkAndExecuteScenario1,
                scope : this
            });
        },

        checkAndExecuteScenario1 : function () {
            this.assertTrue(this.templateCtxt.data.outter == 1);
            this.assertTrue(this.templateCtxt.data.inner == 1);

            // switch to next scenario
            this.templateCtxt.data.scenario = 1;

            this.synEvent.click(aria.utils.Dom.getElementById("inner"), {
                fn : this.checkAndExecuteScenario2,
                scope : this
            });
        },

        checkAndExecuteScenario2 : function () {
            this.assertTrue(this.templateCtxt.data.outter == 1);
            this.assertTrue(this.templateCtxt.data.inner == 2);

            // switch to next scenario
            this.templateCtxt.data.scenario = 2;

            this.synEvent.click(aria.utils.Dom.getElementById("inner"), {
                fn : this.finishTest,
                scope : this
            });
        },

        finishTest : function () {
            this.assertTrue(this.templateCtxt.data.outter == 1);
            this.assertTrue(this.templateCtxt.data.inner == 3);

            this.notifyTemplateTestEnd();
        }
    }
});
