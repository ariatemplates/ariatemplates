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
 * Test case for aria.touch.gestures.Tap
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.issue348.transition.TransitionTestcase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.FireDomEvent", "aria.core.Browser", "aria.touch.Event",
            "aria.utils.Delegate"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.domUtil = aria.utils.Dom;
        this.fireEvent = aria.utils.FireDomEvent;
        this.target = {};
        this.isSupported = aria.utils.Delegate.vendorPrefix;

        if (this.isSupported === null) {
            this.setTestEnv({
                template : 'test.aria.templates.issue348.transition.FakeTransition'
            });
        } else {
            this.setTestEnv({
                template : 'test.aria.templates.issue348.transition.Transition'
            });
        }
    },
    $destructor : function () {
        this.domUtil = null;
        this.fireEvent = null;
        this.target = null;
        this.isSupported = null;
        this.$RobotTestCase.$destructor.call(this);
    },

    $prototype : {
        /**
         * Start the template test suite for the Tap event.
         */
        runTemplateTest : function () {
            if (this.isSupported !== null) {
                this.target = this.domUtil.getElementById("title");

                var dom = aria.utils.Dom;
                this.element = dom.getElementById("title");

                var geometry = dom.getGeometry(this.element);
                this.geometry = geometry;
                var from = {
                    x : geometry.x + geometry.width / 2,
                    y : geometry.y + geometry.height / 2
                };
                var args = {
                    "animationIteration" : 0
                };
                var options = {
                    duration : 7000,
                    to : {
                        x : geometry.x + geometry.width / 2,
                        y : geometry.y + geometry.height / 2
                    }
                };
                this.from = from;
                this.options = options;
                this.synEvent.execute([["move", options, this.from]], {
                    fn : this._MoveMouseAway,
                    scope : this,
                    args : args
                });
            } else {
                this._endTransition();
            }
        },

        /**
         * Testing the event occured once the transition is ended.
         * @param {Object} args
         */
        _MoveMouseAway : function (args) {
            this.target = this.domUtil.getElementById("title");
            var geometry = aria.utils.Dom.getGeometry(this.target);
            var options = {
                duration : 5000,
                to : {
                    x : 700,
                    y : 400
                }
            };
            var args = {
                "animationIteration" : 0
            };
            var Transition = this.templateCtxt.data.transition;
            this.assertFalse(Transition === args.animationIteration);
            this.synEvent.execute([["move", options, this.from]], {
                fn : this._endTransition,
                scope : this,
                args : args
            });
        },
        /**
         * Utility to add delay.
         * @param {Number} delay
         * @param {Object} callback
         * @param {Object} args
         */
        _delay : function (delay, callback, args) {
            var callback = (callback) ? callback : args.callback;
            aria.core.Timer.addCallback({
                fn : callback,
                scope : this,
                delay : delay,
                args : args
            });
        },

        /**
         * Wrapper to end the tests.
         */
        _endTransition : function () {
            this.end();
        }
    }
});
