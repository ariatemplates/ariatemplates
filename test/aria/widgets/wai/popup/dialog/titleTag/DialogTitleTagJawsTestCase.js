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
        this.noiseRegExps.push(/page|Arrow/);
     },

    $prototype : {
        runTemplateTest : function () {
            this.synEvent.execute([
                ["type", null, "[<insert>][F6][>insert<]"],
                ["pause", 1000],
                ["type", null, "[enter]"],
                ["pause", 1000],
                ["type", null, "[<insert>][F7][>insert<]"],
                ["pause", 1000],
                ["type", null, "[up]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[<alt>]m[>alt<]"],
                ["pause", 1000],
                ["type", null, "[escape]"],
                ["pause", 1000],
                ["type", null, "[<insert>][F6][>insert<]"],
                ["pause", 1000],
                ["type", null, "[enter]"],
                ["pause", 1000],
                ["type", null, "[<insert>][F7][>insert<]"],
                ["pause", 1000],
                ["type", null, "[up]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[<alt>]m[>alt<]"],
                ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "Heading List dialog\nheadings List view\nMyDialogTitle : 1\n1 of 1\nheading level 1 MyDialogTitle\nMyDialogTitle heading level 1\nLinks List dialog\nlinks List view\nLinkInTheDialog\n1 of 1\nLink LinkInTheDialog\nLinkInTheDialog Link\nHeading List dialog\nheadings List view\nBackgroundTitle : 1\n1 of 1\nheading level 1 BackgroundTitle\nBackgroundTitle\nheading level 1\nLinks List dialog\nlinks List view\nBackgroundLink\n1 of 1\nLink BackgroundLink\nBackgroundLink Link",
                        this.end
                    );
                },
                scope: this
            });
        }
    }
});
