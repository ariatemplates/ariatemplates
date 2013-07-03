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
 * Class to be extended to create a template test case using the Robot applet. The applet allows to execute user actions
 * (click, type, move, drag, ...) as if they were done by the user instead of simulating browser events.<br />
 * This test makes sure that the robot is loaded and initialized before starting the template test case
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.RobotTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.jsunit.SynEvents", "aria.jsunit.Robot"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        /**
         * Events utility to simulate user actions
         * @type aria.jsunit.SynEvents
         */
        this.synEvent = aria.jsunit.SynEvents;
    },
    $destructor : function () {
        this.synEvent = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        run : function () {
            var robot = aria.jsunit.Robot;
            if (!this.skipTest && !robot.isUsable()) {
                this._startTest();
                this.raiseFailure('The robot is not usable');
                this._endTest();
            } else {
                this.$TemplateTestCase.run.call(this);
            }
        },
        _startTests : function () {
            this.testWindow.Aria.load({
                classes : ["aria.jsunit.SynEvents", "aria.jsunit.Robot"],
                oncomplete : {
                    scope: this,
                    fn: function() {
                        this.synEvent = this.testWindow.aria.jsunit.SynEvents;
                        var robot = this.testWindow.aria.jsunit.Robot;
                        robot.initRobot({
                            fn : this.$TemplateTestCase._startTests,
                            scope : this
                        });
                    }
                }
            });
        }
    }
});