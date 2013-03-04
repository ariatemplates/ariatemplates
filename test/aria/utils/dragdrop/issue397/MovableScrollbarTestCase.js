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

/**
 * Test case for aria.widgets.container.Dialog movable dialog with scroll bars
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.dragdrop.issue397.MovableScrollbarTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.dragdrop.Drag", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.utils.dragdrop.issue397.MovableScrollbarTpl",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {

            // Initialize the dragging
            new aria.utils.dragdrop.Drag("tick", {
                axis: "y",
                constraintTo: "scrollbar"
            });

            aria.core.Timer.addCallback({
                fn : this._dragScrollbar,
                scope : this,
                delay : 1000
            });
        },

        _dragScrollbar : function () {
            var handleGeometry = aria.utils.Dom.getGeometry(Aria.$window.document.getElementById("tick"));
            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : 200,
                to : {
                    x : from.x + 40,
                    y : from.y + 40
                }
            };

            this.synEvent.execute([["drag", options, from]], {
                fn : this._afterDrag,
                scope : this
            });
        },

        _afterDrag : function () {
            var tick = Aria.$window.document.getElementById("tick");

            var offset = aria.utils.Dom.getOffset(tick);

            this.assertEquals(offset.left, 1, "The scrollbar has moved from its x axis.");
            this.assertTrue(offset.top > 20, "The scrollbar hasn't moved from its y axis.");
            this._endofTest();
        },

        _endofTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
