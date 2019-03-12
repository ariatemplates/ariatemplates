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
    $classpath : "test.aria.widgets.wai.popup.dialog.waiOpenMsg.DialogOpenMsgJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.popup.dialog.waiOpenMsg.Tpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.execute([
                ["click", this.getElementById("firstField")],
                ["type", null, "[tab][space]"],
                ["pause", 5000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(true, this.end, function (text) {
                        return /My dialog heading level 1\nThis is the wai open message!/.test(text);
                    });
                },
                scope: this
            });
        }
    }
});
