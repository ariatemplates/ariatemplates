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
    $classpath : "test.aria.templates.issue348.transition.TransitioncaseRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json", "aria.utils.Delegate"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        var isSupported = !!aria.utils.Delegate.vendorPrefix;
        if (!isSupported) {
            this.skipTest = true;
        }
        this.data = {};
        this.setTestEnv({
            template : 'test.aria.templates.issue348.transition.Transition',
            data: this.data
        });
    },

    $prototype : {
        runTemplateTest : function () {
            var self = this;
            var mousePosition = {x: 0, y: 0};
            var element = aria.utils.Dom.getElementById('title');

            function step0() {
                // move the mouse out and wait enough time to be sure that the transition end was called
                // (in case the mouse was positioned on the element):
                self.synEvent.execute([
                    ["mouseMove", mousePosition],
                    ["pause", 3000]
                ], step1);
            }
            function step1() {
                // reset the counter, move the mouse in, and wait for the end of the transition:
                aria.utils.Json.setValue(self.data, 'transitionEndCount', 0);
                var geometry = aria.utils.Dom.getGeometry(element);
                self.assertEquals(geometry.width, 300);
                var curMousePosition = mousePosition;
                mousePosition = {
                    x: geometry.x + geometry.width / 2,
                    y: geometry.y + geometry.height / 2
                };
                self.synEvent.execute([
                    ["move", {
                        duration: 1000,
                        to: mousePosition
                    }, curMousePosition],
                    ["pause", 3000]
                ], step2);
            }
            function step2() {
                // check that the transitionend event was called, and that the final width is correct.

                var transitionEndCount = self.data.transitionEndCount;
                console.log('Number of transitionend calls: ' + transitionEndCount);

                // TODO: check why the transitionend event is called twice on IE 10 and IE 11
                // self.assertEquals(transitionEndCount, 1);
                self.assertTrue(transitionEndCount === 1 || transitionEndCount === 2);

                var geometry = aria.utils.Dom.getGeometry(element);
                self.assertEquals(geometry.width, 700);
                self.end();
            }

            step0();
        }
    }
});
