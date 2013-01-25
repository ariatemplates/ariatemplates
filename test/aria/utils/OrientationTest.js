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
 * Test case for aria.utils.Orientation
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.OrientationTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Orientation"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.counter = 0;
    },
    $destructor : function () {
        this.$TestCase.$destructor.call(this);
        this.emitter = null;
    },
    $prototype : {

        setUp : function () {
            // Setup required environment for orientation change simulation test
            this.emitter = aria.utils.Orientation;
            Aria.$window.orientationchange = function (thisObj) {
                this.$raiseEvent({
                    name : "change",
                    screenOrientation : Aria.$window.orientation,
                    isPortrait : this.isPortrait,
                    scope : thisObj
                })
            };
            // capture the change event raised by Orientation object
            this.emitter.$on({
                "change" : this.__assertValues,
                scope : this
            });
        },

        /**
         * Test case for aria.utils.Orientation will be used for simulating orientation change on desktop browser that
         * with mobile device browser where orientationchange event is present
         * @public
         */
        testOrientation : function () {
            // Call the mock method to add orientation change. Mock for portrait by passing 0
            this.__mockOrientation(0);
            // Call the mock method to add orientation change. Mock for landscape by passing 90
            this.__mockOrientation(90);
            this.assertTrue(this.counter == 2, " The event was expected to get raised two times, but actually it got raised  "
                    + this.counter + " times");
        },

        /**
         * asserts isPortrait based on the screenOrientation
         * @private
         * @param {Object} evt
         */
        __assertValues : function (evt) {
            if (evt.screenOrientation % 180 === 0) {
                this.assertTrue(evt.isPortrait == true, "Expected isPortrait true got  " + evt.isPortrait
                        + " for screenOrientation :" + evt.screenOrientation);
            } else {
                this.assertTrue(evt.isPortrait == false, "Expected isPortrait false got  " + evt.isPortrait
                        + " for screenOrientation :" + evt.screenOrientation);
            }
            this.counter++;
        },

        /**
         * Mock Orientation change for desktop browsers. Add orientationchange mock event through a normal function
         * Invoke the mock event explicitly.
         * @private
         * @param arg
         */
        __mockOrientation : function (orientation) {
            Aria.$window.orientation = orientation;
            this.emitter._onOrientationChange();
        }
    }
});