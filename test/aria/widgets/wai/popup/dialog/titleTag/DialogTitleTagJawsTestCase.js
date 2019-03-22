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
    $classpath : "test.aria.widgets.wai.popup.dialog.titleTag.DialogTitleTagJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),

    $constructor : function() {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.popup.dialog.titleTag.DialogTitleTagTpl"
        });
     },

    $prototype : {

        skipClearHistory: true,

        runTemplateTest : function () {
            this.execute([
                ["click", this.getElementById("showDialogButton")],
                ["waitForJawsToSay","My Dialog Title heading level  1"],
                ["type",null,"[<insert>][F6][>insert<]"],
                ["waitForJawsToSay","Heading List dialog"],
                ["waitForJawsToSay","headings List view"],
                ["waitForJawsToSay","My Dialog Title colon  1"],
                ["waitForJawsToSay","1 of 1"],
                ["type",null,"[enter]"],
                ["waitForJawsToSay","Enter"],
                ["waitForJawsToSay","heading level  1   My Dialog Title"],
                ["waitForJawsToSay","My Dialog Title heading level  1"],
                ["type",null,"[<insert>][F7][>insert<]"],
                ["waitForJawsToSay","Links List dialog"],
                ["waitForJawsToSay","links List view"],
                ["waitForJawsToSay","Link In The Dialog"],
                ["waitForJawsToSay","1 of 1"],
                ["type",null,"[up]"],
                ["pause",500],
                ["type",null,"[down]"],
                ["pause",500],
                ["type",null,"[<alt>]m[>alt<]"],
                ["pause",500],
                ["waitForJawsToSay","Alt m"],
                ["waitForJawsToSay",/Link\s+Link In The Dialog/],
                ["waitForJawsToSay","Link In The Dialog Link"],
                ["type",null,"[escape]"],
                ["waitForJawsToSay","Escape"],
                ["type",null,"[<insert>][F6][>insert<]"],
                ["waitForJawsToSay","Heading List dialog"],
                ["waitForJawsToSay","headings List view"],
                ["waitForJawsToSay","Background Title colon  1"],
                ["waitForJawsToSay","1 of 1"],
                ["type",null,"[enter]"],
                ["waitForJawsToSay","Enter"],
                ["waitForJawsToSay","heading level  1   Background Title"],
                ["waitForJawsToSay","Background Title"],
                ["type",null,"[<insert>][F7][>insert<]"],
                ["waitForJawsToSay","Links List dialog"],
                ["waitForJawsToSay","links List view"],
                ["waitForJawsToSay","Background Link"],
                ["waitForJawsToSay","1 of 1"],
                ["type",null,"[up]"],
                ["pause",500],
                ["type",null,"[down]"],
                ["pause",500],
                ["type",null,"[<alt>]m[>alt<]"],
                ["pause",500],
                ["waitForJawsToSay","Alt m"],
                ["waitForJawsToSay",/Link\s+Background Link/],
                ["waitForJawsToSay","Background Link Link"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
