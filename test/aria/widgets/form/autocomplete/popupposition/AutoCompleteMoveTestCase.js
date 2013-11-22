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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.popupposition.AutoCompleteMoveTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.popups.PopupManager", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.popupposition.AutoCompleteMove"
        });

    },
    $prototype : {

        runTemplateTest : function () {
            var self = this;
            var field = this.getInputField("ac");
            this.synEvent.execute([["click", field], ["type", field, "ab"], ["pause", 1000]], {
                fn : "_afterTyping",
                scope : this
            });
        },

        _afterTyping : function () {
            // checking the position of the popup
            var openedPopups = aria.popups.PopupManager.openedPopups;
            this.assertTrue(openedPopups.length == 1, "There is not exactly one popup opened.");
            var popup = openedPopups[0];
            var position = aria.utils.Dom.calculatePosition(popup.domElement);

            var underAutoCompleteElt = this.getElementById("underAutoComplete");
            var underAutoCompletePosition = aria.utils.Dom.calculatePosition(underAutoCompleteElt);

            var topDiff = Math.abs(position.top - underAutoCompletePosition.top);
            this.assertTrue(topDiff < 3, "The popup is not correctly positioned.");
            this.notifyTemplateTestEnd();
        }

    }
});
