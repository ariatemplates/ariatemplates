/*
 * Copyright 2018 Amadeus s.a.s.
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

var Aria = require("ariatemplates/Aria");
var ariaUtilsJson = require("ariatemplates/utils/Json");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.input.actionWidget.blurBeforeAction.BlurBeforeActionJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.actionWidget.blurBeforeAction.BlurBeforeActionTpl",
            data: {}
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var data = this.templateCtxt.data;
            this.noiseRegExps.push(/type/i);

            this.execute([
                ["click", this.getElementById("tf1")], ["pause", 100],
                ["type", null, "[tab]"], ["pause", 200], ["type", null, "hello"], ["pause", 200],
                ["type", null, "[escape]"], ["pause", 200], ["type", null, "b"], ["pause", 200],
                ["type", null, "[enter]"], ["pause", 200], ["click", this.getElementById("tf2")], ["pause", 100],
                ["type", null, "[up]"], ["pause", 200], ["type", null, "[up]"], ["pause", 2000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals([
                        "First field Edit",
                        "Query Edit",
                        "virtual PC Cursor",
                        "Search Button",
                        "Second field Edit",
                        "Second field",
                        "Last search: hello"
                    ].join("\n"), this.end);
                },
                scope: this
            });
        }
    }
});
