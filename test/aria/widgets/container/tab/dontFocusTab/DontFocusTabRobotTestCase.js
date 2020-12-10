/*
 * Copyright 2017 Amadeus s.a.s.
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
var domUtils = require("ariatemplates/utils/Dom");

module.exports = Aria.classDefinition({
    $classpath: "test.aria.widgets.container.tab.dontFocusTab.DontFocusTabRobotTestCase",
    $extends: require("ariatemplates/jsunit/RobotTestCase"),
    $prototype: {
        runTemplateTest: function () {
            var myInput = this.getElementById("myInput");
            var summaryTab = this.getElementById("summaryTab");
            this.synEvent.execute([
                ["click", myInput],
                ["waitFocus", myInput],
                ["click", summaryTab],
                ["pause", 2000]
            ], {
                    fn: function () {
                        // checks that the focus is not in the tab:
                        var activeElement = Aria.$window.document.activeElement;
                        this.assertFalse(domUtils.isAncestor(activeElement, summaryTab), "The focus should not be in the tab.");
                        this.end();
                    },
                    scope: this
                }
            );
        }
    }
});
