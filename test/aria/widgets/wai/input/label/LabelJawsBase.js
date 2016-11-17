/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.input.label.LabelJawsBase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.label.LabelJawsBaseTpl"
        });
    },
    $prototype : {
        nbTabs: 2,

        runTemplateTest : function () {
            this._testElement();
        },
        _testElement : function () {
            var domElement = this.getElementById(this.elementsToTest);
            var actions = [
                ["ensureVisible", domElement],
                ["click", domElement], ["pause", 1000]
            ];
            var nbTabs = this.nbTabs;
            for (var i = 0 ; i < nbTabs ; i++) {
                actions.push(["type", null, "[tab]"], ["pause", 1000]);
            }
            this.synEvent.execute(actions, {
                fn : this._testValue,
                scope : this
            });
        },
        _testValue : function () {
            this.assertJawsHistoryEquals(true, this._resetTest, function (response) {
                if (!/waiLabel/.test(response) || !/aria label described by/.test(response)
                        || !/aria label labelled by/.test(response)
                        || /enabled - with aria label hidden/.test(response)) {
                    return false;
                }
                return true;
            });
        },
        _resetTest : function () {
            this.end();
        }
    }
});