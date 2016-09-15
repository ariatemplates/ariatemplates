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
    $classpath : "test.aria.widgets.wai.input.radiobutton.RadioButtonGroupJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.radiobutton.RadioButtonGroupTestCaseTpl"
        });
        this.noiseRegExps.push(/(First textfield Edit|Type in text\.)$/i);
    },
    $prototype : {
        runTemplateTest : function () {

            this.synEvent.execute([
                ["click", this.getElementById("tf1")],
                ["pause", 1500],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[down][down][down][down][down]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[up][up]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[down][down][down][down][down]"],
                ["pause", 1000],
                ["type", null, "[<shift>][tab][>shift<]"],
                ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "radio button not checked Radio A\nRadio A radio button checked\nRadio A\nradio button not checked Radio B\nRadio B\nradio button not checked Radio C\nRadio C\nRadio C radio button checked\nRadio B\nradio button not checked Radio B\nRadio B radio button checked\nRadio B\nradio button not checked Radio C\nRadio C\nLast textfield\nEdit\nList box Radio B radio button checked\nTo change the selection press Up or Down Arrow.",
                        this.end
                    );
                },
                scope: this
            });
        }
    }
});
