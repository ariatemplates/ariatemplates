/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath : 'test.aria.dom.domcheck.PTRTemplateTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.dom.domcheck.PTRTemplate"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this._disposeTestTemplate();

            this._loadTestTemplate({
                fn : this._stepOne,
                scope : this
            });
        },

        _stepOne : function (args) {
            var global = Aria.$global;
            this.assertTrue(global.counters.dataReadyCount == 2);
            this.assertTrue(global.counters.viewReadyCount == 2);
            this.assertTrue(global.counters.displayReadyCount == 2);

            this.assertTrue(global.counters.subDataReadyCount == 2);
            this.assertTrue(global.counters.subViewReadyCount == 2);
            this.assertTrue(global.counters.subDisplayReadyCount == 2);

            this._refreshTestTemplate();

            this.assertTrue(global.counters.subDataReadyCount == 3);
            this.assertTrue(global.counters.subViewReadyCount == 3);
            this.assertTrue(global.counters.subDisplayReadyCount == 3);

            global.counters = null;
            this.notifyTemplateTestEnd();
        }
    }
});
