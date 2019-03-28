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
     },

    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var myInput = this.getElementById("myInput");
            this.execute([
                ["click",myInput],
                ["waitFocus",myInput],
                ["type",null,"[tab]"],
                ["waitForJawsToSay","Tab"],
                ["waitForJawsToSay","Open dialog Button"],
                ["type",null,"[space]"],
                ["waitForJawsToSay","Space"],
                ["waitForJawsToSay","My Dialog Title dialog"],
                ["waitForJawsToSay","My Dialog Title heading level  1"],
                ["type",null,"[escape]"],
                ["waitForJawsToSay","Escape"],
                ["waitForJawsToSay","Press escape again to close the dialog."],
                ["type",null,"[escape]"],
                ["waitForJawsToSay","Escape"],
                ["waitForJawsToSay", {
                    find: "Open dialog Button",
                    skipClear: true // because JAWS 16 says "MyDialog is closed" before "Open dialog Button"
                }],
                ["waitForJawsToSay","My Dialog is closed."]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
