/*
 * Copyright 2013 Amadeus s.a.s.
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

require("ariatemplates/widgets/errorlist/ErrorListTemplate.tpl"); // just to be sure the template is loaded when the test is run, since it depends on its (DOM) content

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.errorlist.titleTag.ErrorListTitleTagJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),

    $constructor : function() {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.errorlist.titleTag.ErrorListTitleTagTpl"
        });
        this.noiseRegExps.push(/page|Arrow/);
     },

    $prototype : {
        runTemplateTest : function () {
            var classNameCheck = this.getElementsByClassName(this.testDiv, "myErrorListH1ClassName");
            this.assertEquals(classNameCheck.length, 1, "Unexpected number of tags with the myErrorListH1ClassName class: %1");
            this.assertEquals(classNameCheck[0].tagName.toLowerCase(), "h1", "Unexpected element with the myErrorListH1ClassName class: %1");
            this.assertTrue(classNameCheck[0].innerHTML.indexOf("MyErrorListTitleWithFirstHeadingLevel") > -1, "The element with the myErrorListH1ClassName class does not have the expected content.");

            this.synEvent.execute([
                ["type", null, "[<insert>][F6][>insert<]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[enter]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "Heading List dialog\nheadings List view\nMyErrorListTitleWithFirstHeadingLevel : 1\n1 of 3\nMyErrorListTitleWithSecondHeadingLevel : 2\nMyErrorListTitleWithThirdHeadingLevel : 3\nheading level 3 MyErrorListTitleWithThirdHeadingLevel\nMyErrorListTitleWithThirdHeadingLevel\nheading level 3\nlist of 1 items\n• MyError3Description\nlist end\nMyErrorListTitleWithNoHTag",
                        this.end
                    );
                },
                scope: this
            });
        }
    }
});
