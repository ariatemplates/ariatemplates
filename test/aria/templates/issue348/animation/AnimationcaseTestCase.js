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
    $classpath : "test.aria.templates.issue348.animation.AnimationcaseTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.FireDomEvent", "aria.core.Browser", "aria.touch.Event",
            "aria.utils.Delegate"],
    $constructor : function () {
        this.isSupported = aria.utils.Delegate.vendorPrefix;
        this.$TemplateTestCase.constructor.call(this);
        this.domUtil = aria.utils.Dom;
        this.fireEvent = aria.utils.FireDomEvent;
        this.target = {};
        var currentBrowser = aria.core.Browser;
        if (this.isSupported === null || (currentBrowser.isFirefox && currentBrowser.majorVersion < 15)) {
            this.setTestEnv({
                template : 'test.aria.templates.issue348.animation.FakeAnimation'
            });

        } else {
            this.setTestEnv({
                template : 'test.aria.templates.issue348.animation.Animation'
            });
        }
    },
    $destructor : function () {
        this.domUtil = null;
        this.fireEvent = null;
        this.target = null;
        this.isSupported = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        /**
         * Start the template test suite for the Tap event.
         */
        runTemplateTest : function () {
            var currentBrowser = aria.core.Browser;
            if (this.isSupported === null || (currentBrowser.isFirefox && currentBrowser.majorVersion < 15)) {
                this._endTestAnimation();

            } else {
                var args = {
                    "animationIteration" : 0
                };
                this._delay(8000, this._testAnimation, args);
            }
        },

        /**
         * Utility to add delay.
         * @param {Number} delay
         * @param {Object} callback
         * @param {Object} args
         */
        _delay : function (delay, callback, args) {
            var callback = (callback) ? callback : args.callback;
            var that = this;
            aria.core.Timer.addCallback({
                fn : callback,
                scope : that,
                delay : delay,
                args : args
            });
        },
        /**
         * Utility to test for animation.
         * @param {Object} args
         */
        _testAnimation : function (args) {
            var Iteration = this.templateCtxt.data.iteration;
            this.assertFalse(Iteration === args.animationIteration);

            var startText = this.templateCtxt.data.startTxt;
            this.assertTrue(startText === "Animation Started");

            var endTxt = this.templateCtxt.data.endTxt;
            this.assertTrue(endTxt === "Animation Ended");
            this._endTestAnimation();
        },
        /**
         * Wrapper to end the tests.
         */
        _endTestAnimation : function () {
            this.end();
        }
    }
});
