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

Aria.classDefinition({
    $classpath : "test.aria.widgets.action.button.clickNotWorking.ButtonClickNotWorkingRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            var myBtn = this.getWidgetInstance("myBtn");
            myBtn.getDom(); // make sure the button is linked to DOM
            var span = myBtn._frame._childRootElt;
            var spanGeometry = aria.utils.Dom.getGeometry(span);
            this.synEvent.execute([["click", {
                x: spanGeometry.x + spanGeometry.width / 2,
                y: spanGeometry.y + 1
            }], ["pause", 1000]], {
                scope: this,
                fn: function () {
                    this.assertEquals(this.templateCtxt.data.buttonClickCalled, 1);
                    this.end();
                }
            });

        }
    }
});
