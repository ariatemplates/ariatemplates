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

/**
 * Test case for aria.utils.dragdrop.Drag
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.mouse.MouseDragOkRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.dragdrop.Drag", "aria.utils.Dom", "aria.utils.overlay.Overlay"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        /**
         * @type aria.utils.dragdrop.Drag
         */
        this.drag = null;

        this.setTestEnv({
            template : "test.aria.utils.mouse.MouseTpl"
        });
    },
    $destructor : function () {

        this.drag.$dispose();
        this.drag = null;

        this.$RobotTestCase.$destructor.call(this);
    },
    $prototype : {

        runTemplateTest : function () {
            var domUtil = aria.utils.Dom;
            this.drag = new aria.utils.dragdrop.Drag("dialog-container");

            var element = domUtil.getElementById("dialog-container");
            var result = {
                startVar : false,
                moveVar : false,
                endVar : false
            };
            this.drag.start = function () {
                result.startVar = true;
            };

            this.drag.move = function () {
                result.moveVar = true;
            };

            this.drag.end = function () {
                result.endVar = true;
            };
            var geometry = domUtil.getGeometry(element);
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 50,
                    y : from.y + 50
                }
            };

            this.synEvent.execute([["click", {
                                x : 0,
                                y : 0
                            }], ["drag", options, from]], {
                fn : this.endDrag,
                scope : this,
                args : result
            });

        },

        endDrag : function (useless, result) {
            this.assertTrue(result.startVar, "Drag: start broken");
            this.assertTrue(result.moveVar, "Drag: move broken");
            this.assertTrue(result.endVar, "Drag: end broken");

            this.end();
        }
    }
});
