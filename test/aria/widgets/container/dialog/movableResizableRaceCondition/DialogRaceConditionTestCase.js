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

Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.movableResizableRaceCondition.DialogRaceConditionTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            dialogVisible : false
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.movableResizableRaceCondition.DialogRaceCondition",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            // Show the dialog:
            aria.utils.Json.setValue(this.data, "dialogVisible", true);
            // Don't wait for the Drag and Resize classes to be loaded before unloading the dialog:
            aria.utils.Json.setValue(this.data, "dialogVisible", false);

            // now wait for those classes to be loaded (as the error was happening once those classes are loaded):
            Aria.load({
                classes : ["aria.utils.dragdrop.Drag", "aria.utils.resize.Resize"],
                oncomplete : {
                    fn : function () {
                        var self = this;
                        // wait a bit more to be sure that the callback in the aria:Dialog widget has been called
                        setTimeout(function () {
                            self.end();
                        }, 10);
                    },
                    scope : this
                }
            });
        }
    }
});
