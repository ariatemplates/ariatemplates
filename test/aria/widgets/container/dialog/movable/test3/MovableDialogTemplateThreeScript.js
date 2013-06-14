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
    $classpath : "test.aria.widgets.container.dialog.movable.test3.MovableDialogTemplateThreeScript",
    $prototype : {

        onDragStart : function (evt, dataName) {
            var container = this.data[dataName];
            container.dragStart = (container.dragStart != null) ? container.dragStart + 1 : 1;
        },
        onDragEnd : function (evt, dataName) {
            var container = this.data[dataName];
            container.dragEnd = (container.dragEnd != null) ? container.dragEnd + 1 : 1;
        },
        refreshInnerSection : function () {
            this.$refresh({
                filterSection : "testInnerMacroSection",
                macro : "displayDialogContent"
            });
        }
    }
});