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

var Aria = require("ariatemplates/Aria");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.popup.dialog.waiEscapeMsg.DialogEscapeJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),

    $constructor : function() {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.popup.dialog.waiEscapeMsg.DialogEscapeTpl"
        });
        this.noiseRegExps.push(/Edit|Type/);
     },

    $prototype : {
        runTemplateTest : function () {
            this.synEvent.execute([
                ["click", this.getElementById("myInput")],
                ["pause", 1000],
                ["type", null, "[tab]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[escape]"],
                ["pause", 1000],
                ["type", null, "[escape]"],
                ["pause", 5000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "Open dialog Button\nMyDialogTitle dialog\nMyDialogTitle heading level 1\nPress escape again to close the dialog.\nOpen dialog Button\nMyDialog is closed.",
                        this.end
                    );
                },
                scope: this
            });
        }
    }
});
