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
 * Test case for aria.utils.Event. This unit tests only check the error conditions because event handling requires a
 * template
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Event",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Event", "aria.utils.SynEvents"],
    $prototype : {
        /**
         * Specify that this test needs to be run on a visible document.
         * @type Boolean
         */
        needVisibleDocument : true,

        /**
         * Test case on the aria.utils.Array.indexOf method
         */
        testAsyncAddListeners : function () {
            var document = Aria.$window.document;
            var that = this;
            var util = aria.utils.Event, returnValue, callback = {
                fn : function () {
                    if (this == document.body) {
                        that.BodyWasClicked = true;
                        that = null;
                    } else {
                        that.$assertTrue(false, "The callback shouldn't be called");
                    }
                }
            };
            this.toBeRemoved = callback;

            returnValue = util.addListener(null, "click", callback);
            this.assertFalse(returnValue);

            returnValue = util.addListener("I don't exist in the DOM", "click", callback);
            this.assertFalse(returnValue);
            this.assertErrorInLogs(util.INVALID_TARGET);

            returnValue = util.addListener({}, "click", callback);
            this.assertFalse(returnValue);

            returnValue = util.addListener(1, "click", callback);
            this.assertFalse(returnValue);

            returnValue = util.addListener({
                length : 1,
                0 : "Trying to fool you"
            }, "click", callback);
            this.assertFalse(returnValue);

            returnValue = util.addListener({
                length : 1
            }, "click", callback);
            this.assertFalse(returnValue);

            returnValue = util.addListener([], "click", callback);
            this.assertFalse(returnValue);

            returnValue = util.addListener(document.body, "click");
            this.assertFalse(returnValue);

            returnValue = util.addListener(document.body, "click", {});
            this.assertFalse(returnValue);

            returnValue = util.addListener(["I don't exist either", {}], "click", callback);
            this.assertFalse(returnValue);

            returnValue = util.addListener(["Again I'm missing", document.body], "click", callback);
            this.assertFalse(returnValue);
            this.assertErrorInLogs(util.INVALID_TARGET);
            // However this should add a click listener on the body

            Syn.click(document.body);

            aria.core.Timer.addCallback({
                fn : this.afterClick,
                scope : this,
                delay : 400
            });
        },

        afterClick : function () {
            var document = Aria.$window.document;
            aria.utils.Event.removeListener(["I'm still not in the dom", document.body], "click", this.toBeRemoved);
            this.assertTrue(this.BodyWasClicked, "Listener on body was not added correctly");
            this.BodyWasClicked = false;

            // Try to click again to see if the listener is removed
            Syn.click(document.body);

            aria.core.Timer.addCallback({
                fn : this.afterSecondClick,
                scope : this,
                delay : 400
            });
        },

        afterSecondClick : function () {
            this.assertFalse(this.BodyWasClicked, "Listener on body was not removed correctly");

            this.notifyTestEnd("testAsyncAddListeners");
        }
    }
});
