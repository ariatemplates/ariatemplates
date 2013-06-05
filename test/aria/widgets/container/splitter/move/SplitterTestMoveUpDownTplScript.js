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

Aria.tplScriptDefinition({
    $classpath : "test.aria.widgets.container.splitter.move.SplitterTestMoveUpDownTplScript",
    $prototype : {
        $dataReady : function () {
            this.data['firstPanelSize'] = 200;
            this.data['secondPanelSize'] = 200;
        },
        changeState : function (a, b) {
            if (b == "mOnePlus") {
                if (this.data['firstPanelSize'] < 400) {
                    this.$json.setValue(this.data, "firstPanelSize", this.data['firstPanelSize'] + 50);
                }
            }
            if (b == "mOneMinus") {
                if (this.data['firstPanelSize'] > 0) {
                    this.$json.setValue(this.data, "firstPanelSize", this.data['firstPanelSize'] - 50);
                }
            }
        }
    }
});