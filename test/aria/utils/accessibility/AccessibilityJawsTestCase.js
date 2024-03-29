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
var Accessibility = require('ariatemplates/utils/Accessibility');

module.exports = Aria.classDefinition({
    $classpath : "test.aria.utils.accessibility.AccessibilityJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);

        this.setTestEnv({
            template : 'test.aria.utils.accessibility.Tpl'
        });
    },
    $prototype : {
        skipClearHistory: true,

        runTemplateTest : function () {
            Accessibility.readText("Hello", {
                alert: true
            });
            this.execute([
                ["waitForJawsToSay","Alert!"],
                ["waitForJawsToSay","Hello"]
            ], {
                fn: function () {
                    Accessibility.readText("World");
                    this.execute([
                        ["waitForJawsToSay","World"]
                    ], {
                        fn: this.end,
                        scope: this
                    });
                },
                scope: this
            });
        }
    }
});
