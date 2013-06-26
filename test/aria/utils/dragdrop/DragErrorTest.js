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
 * Template Test case for aria.utils.dragdrop.Drag error logging
 */
Aria.classDefinition({
    $classpath : 'test.aria.utils.dragdrop.DragErrorTest',
    $extends : 'aria.jsunit.TemplateTestCase',
    $dependencies : ["aria.utils.dragdrop.Drag", "aria.utils.Dom", "aria.tools.contextual.ContextualMenu"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.dragUtil = aria.utils.dragdrop.Drag;
        this.timer = aria.core.Timer;

        this.defaultTestTimeout = 5000;
        this.setTestEnv({
            template : 'test.aria.utils.dragdrop.DragTestTemplate'
        });
    },
    $destructor : function () {
        this.dragUtil = null;
        this.timer = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {

        runTemplateTest : function () {

            // Test Invalid type
            this._drag = new this.dragUtil(1234);

            this.assertErrorInLogs(this.dragUtil.INVALID_ATTRIBUTE);
            this._drag.$dispose();

            // Test invalid element
            this._drag = new this.dragUtil("fakeId");

            this.assertErrorInLogs(this.dragUtil.INVALID_ATTRIBUTE);
            this._drag.$dispose();
            // Test invalid handle
            this._drag = new this.dragUtil("constrained-draggable", {
                handle : "fake-id"
            });
            this.assertErrorInLogs(this.dragUtil.INVALID_ATTRIBUTE);
            this._drag.$dispose();

            // Test invalid constrainTo
            this._drag = new this.dragUtil("constrained-draggable", {
                constrainTo : "fake-id"
            });
            this._drag.start({
                x : 0,
                y : 0
            });
            this._drag.end();

            this.assertErrorInLogs(this.dragUtil.INVALID_ATTRIBUTE);
            this._drag.$dispose();

            // Test invalid proxy class
            this._drag = new this.dragUtil("constrained-draggable", {
                proxy : {
                    type : "FakeClass"
                }
            });
            this._drag.start({
                x : 0,
                y : 0
            });
            this._drag.move();
            this.timer.addCallback({
                fn : this._finishTest,
                scope : this,
                delay : 200
            });
        },

        _finishTest : function () {
            this._drag.end();

            this.assertErrorInLogs(this.dragUtil.INVALID_ATTRIBUTE);

            this._drag.$dispose();
            this._drag = null;
            this.end();
        }
    }
});
