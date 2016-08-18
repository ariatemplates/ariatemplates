/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.input.label.MultiSelectJawsTestCase",
    $extends : require("./LabelJawsTestCase"),
    $prototype : {
        elementsToTest : "msWaiEnabledStart",

        _testElement : function () {
            var domElement = this.getElementById(this.elementsToTest);
            // The Multiselect needs extra tabs now that the icon is focusable:
            this.synEvent.execute([
                ["ensureVisible", domElement],
                ["click", domElement], ["pause", 1000],
                ["type", null, "[tab]"], ["pause", 1000],
                ["type", null, "[tab]"], ["pause", 1000],
                ["type", null, "[tab]"], ["pause", 1000],
                ["type", null, "[tab]"], ["pause", 1000]
            ], {
                fn : this._testValue,
                scope : this
            });
        }
    }
});
