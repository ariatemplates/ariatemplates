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
 * Abstract class for drag tests
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.dragdrop.AbstractDragRobotBase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.dragdrop.Drag", "aria.utils.Dom", "aria.tools.contextual.ContextualMenu"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        // special env settings to reproduce GH-545
        this.setTestEnv({
            template : "test.aria.utils.dragdrop.DragTestTemplate",
            css : "position:relative;border:15px solid blue;"
        });
    },
    $prototype : {
        tearDown : function () {
            this._dialog.$dispose();
            this._dragOne.$dispose();
            this._dragTwo.$dispose();
            this._dragThree.$dispose();
            this._dragFour.$dispose();
            this._dialog = null;
            this._dragOne = null;
            this._dragTwo = null;
            this._dragThree = null;
            this._dragFour = null;
        },

        /**
         * Override in the subclass
         */
        startDragTest : function () {

        },

        runTemplateTest : function () {
            var dom = aria.utils.Dom;
            this._dialog = new aria.utils.dragdrop.Drag("dialog-container", {
                handle : "dialog-title",
                cursor : "pointer",
                proxy : {
                    type : "CloneOverlay",
                    cfg : {
                        opacity : 0.4
                    }
                },
                constrainTo : aria.utils.Dom.VIEWPORT
            });
            this._dragOne = new aria.utils.dragdrop.Drag("constrained-draggable", {
                proxy : {
                    type : "CloneOverlay"
                },
                constrainTo : "first-boundary"
            });
            this._dragTwo = new aria.utils.dragdrop.Drag("vertical-draggable", {
                cursor : "move",
                constrainTo : dom.getElementById("second-boundary"),
                axis : "y"
            });
            this._dragThree = new aria.utils.dragdrop.Drag(dom.getElementById("horizontal-draggable"), {
                proxy : {
                    type : "Overlay"
                },
                constrainTo : "third-boundary",
                axis : "x"
            });
            this._dragFour = new aria.utils.dragdrop.Drag("free-draggable");
            this.startDragTest();
        }
    }
});
