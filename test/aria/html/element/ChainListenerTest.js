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

Aria.classDefinition({
    $classpath : "test.aria.html.element.ChainListenerTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.html.element.ElementOne", "aria.utils.Array"],
    $prototype : {
        /**
         * Verify that onbind is called with the correct parameters
         */
        testChainListener : function () {
            var objectOne = Aria.empty;
            var objectTwo = Aria.returnFalse;
            var objectThree = Aria.returnTrue;
            var objectFour = {
                a : "a"
            };

            var cfg = {
                tagName : "span",
                on : {
                    "keydown" : [objectOne, objectTwo],
                    "mousedown" : objectThree,
                    "coffee" : [objectFour]
                }
            };

            var widget = new test.aria.html.element.ElementOne(cfg, {
                tplClasspath : "Element"
            });

            var listeners = cfg.on;

            // test notInThere
            this.assertEquals(listeners.notInThere.length, 1, "Listener to an event with no previous listener was not added.");
            this.assertJsonEquals(listeners.notInThere[0], {
                b : "b"
            }, "Listener to an event with no previous listener was not added properly.");

            // test keydown
            this.assertEquals(listeners.keydown.length, 4, "Listener to an event with an already existing array of listeners was not added.");
            this.assertJsonEquals(listeners.keydown[0], {
                c : "c"
            });
            this.assertEquals(listeners.keydown[1], objectOne);
            this.assertEquals(listeners.keydown[2], objectTwo);
            this.assertJsonEquals(listeners.keydown[3], {
                d : "d"
            });

            // test mousedown
            this.assertEquals(listeners.mousedown.length, 2, "Listener to an event with one existing listener was not added.");
            this.assertJsonEquals(listeners.mousedown[0], objectThree);
            this.assertJsonEquals(listeners.mousedown[1], {
                e : "e"
            });

            // test coffee
            this.assertEquals(listeners.coffee.length, 2, "Listener to an event with one existing listener in array was not added.");
            this.assertJsonEquals(listeners.coffee[0], {
                f : "f"
            });
            this.assertJsonEquals(listeners.coffee[1], objectFour);

            widget.$dispose();
        }

    }
});
