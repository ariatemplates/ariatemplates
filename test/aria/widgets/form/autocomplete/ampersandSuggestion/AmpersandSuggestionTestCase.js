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
    $classpath : "test.aria.widgets.form.autocomplete.ampersandSuggestion.AmpersandSuggestion",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.String"],
    $prototype : {
        runTemplateTest : function () {
            this.clickAndType("ac", "R&", {
                fn : function () {
                    this.waitForDropDownPopup("ac", this.afterTypingAmpersand);
                },
                scope : this
            }, false);
        },

        afterTypingAmpersand : function () {
            var inputField = this.getInputField("ac");
            this.checkLastSuggestion();
            this.synEvent.type(inputField, "D", {
                fn: function () {
                    this.waitFor({
                        condition: function () {
                            return inputField.value === "R&D";
                        },
                        callback: this.afterTypingD
                    });
                },
                scope: this
            });
        },

        afterTypingD : function () {
            this.checkLastSuggestion();
            this.end();
        },

        checkLastSuggestion : function () {
            var expectedLabel = "R&D-AFW";
            var popup = this.getWidgetDropDownPopup("ac");
            var links = popup.getElementsByTagName("a");
            var lastLink = links[links.length - 1];
            var lastLinkText = aria.utils.String.trim(lastLink.textContent || lastLink.innerText);
            this.assertEquals(lastLinkText, expectedLabel);
            var strongTags = lastLink.getElementsByTagName("strong");
            this.assertEquals(strongTags.length, 1);
            var strongTagText = aria.utils.String.trim(strongTags[0].textContent || strongTags[0].innerText);
            this.assertTrue(strongTagText.length > 1);
            this.assertEquals(strongTagText, expectedLabel.substr(0, strongTagText.length));
            var inputField = this.getInputField("ac");
            this.assertEquals(inputField.value, strongTagText);
        }
    }
});
