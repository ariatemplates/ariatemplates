/*
 * Copyright 2016 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.input.radiobutton.initiallyDisabled.InitiallyDisabledRadioButtonsJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.radiobutton.initiallyDisabled.InitiallyDisabledRadioButtonsTpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {

            this.synEvent.execute([
                ["click", this.getElementById("tf1")], ["pause", 1000],
                ["type", null, "[tab]"], ["pause", 1000],
                ["type", null, "[down]"], ["pause", 1000],
                ["type", null, "[tab]"], ["pause", 1000],
                ["type", null, "[down]"], ["pause", 1000],
                ["type", null, "[down]"], ["pause", 1000],
                ["type", null, "[up]"], ["pause", 1000],
                ["type", null, "[<shift>][tab][>shift<]"], ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals([
                        "List box Automatic radio button checked",
                        "To change the selection press Up or Down Arrow.",
                        "List box Manual radio button checked",
                        "To change the selection press Up or Down Arrow.",
                        "List box Manual option 1 radio button checked",
                        "To change the selection press Up or Down Arrow.",
                        "List box Manual option 2 radio button checked",
                        "To change the selection press Up or Down Arrow.",
                        "List box Manual option 4 radio button checked",
                        "To change the selection press Up or Down Arrow.",
                        "List box Manual option 2 radio button checked",
                        "To change the selection press Up or Down Arrow.",
                        "List box Manual radio button checked",
                        "To change the selection press Up or Down Arrow."
                    ].join("\n"),
                    this.end, function (response) {
                        return response.replace(/.*(edit|text).*\n?/gi, "");
                    });
                },
                scope: this
            });
        }
    }
});
