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

Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.MovableDialogTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this._tests = ["test.aria.widgets.container.dialog.bindPosition.DialogRobotBase",
                "test.aria.widgets.container.dialog.bindPosition.ModalDialogRobotTestCase",
                "test.aria.widgets.container.dialog.bindPosition.DialogOnResizeRobotTestCase",
                "test.aria.widgets.container.dialog.bindPosition.PopupMoveToRobotTestCase",
                "test.aria.widgets.container.dialog.bindPosition.DialogInViewportRobotTestCase",
                "test.aria.widgets.container.dialog.movable.issue367.MovableDialogRobotTestCase",
                "test.aria.widgets.container.dialog.movable.test1.MovableDialogRobotTestCase",
                "test.aria.widgets.container.dialog.movable.test2.MovableDialogTwoRobotTestCase",
                "test.aria.widgets.container.dialog.movable.test3.MovableDialogThreeRobotTestCase",
                "test.aria.widgets.container.dialog.movable.test4.MovableDialogFourRobotTestCase",
                "test.aria.widgets.container.dialog.movable.test5.MovableDialogFiveRobotTestCase"];
    }
});
