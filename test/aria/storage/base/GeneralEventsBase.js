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
    $classpath : "test.aria.storage.base.GeneralEvents",
    $extends : "test.aria.storage.base.BaseTests",
    $prototype : {
        testEvents : function () {
            var one = new this.storageClass();
            var two = new this.storageClass();

            var counter = {
                one : 0,
                two : 0
            };
            var expectedArguments = {};

            one.$on({
                change : {
                    fn : function (evt) {
                        counter.one += 1;

                        this.checkEventArguments(expectedArguments, evt, "one");
                    },
                    scope : this
                }
            });
            two.$on({
                change : {
                    fn : function (evt) {
                        counter.two += 1;

                        this.checkEventArguments(expectedArguments, evt, "two");
                    },
                    scope : this
                }
            });

            // set an item on object one
            expectedArguments = {
                key : "a",
                oldValue : null,
                newValue : "12",
                url : Aria.$window.location
            };
            one.setItem("a", "12");
            this.assertEquals(counter.one, 1, "Event 1 not called on one");
            this.assertEquals(counter.two, 1, "Event 1 not called on two");

            // different type of value
            expectedArguments.oldValue = "12";
            expectedArguments.newValue = 4;
            one.setItem("a", 4);
            this.assertEquals(counter.one, 2, "Event 2 not called on one");
            this.assertEquals(counter.two, 2, "Event 2 not called on two");

            // check that the old value matches the type
            expectedArguments.oldValue = 4;
            expectedArguments.newValue = false;
            one.setItem("a", false);
            this.assertEquals(counter.one, 3, "Event 3 not called on one");
            this.assertEquals(counter.two, 3, "Event 3 not called on two");

            // remove item
            expectedArguments.oldValue = false;
            expectedArguments.newValue = null;
            one.removeItem("a");
            this.assertEquals(counter.one, 4, "Event 4 not called on one");
            this.assertEquals(counter.two, 4, "Event 4 not called on two");

            // clear
            expectedArguments.key = null;
            expectedArguments.oldValue = null;
            expectedArguments.newValue = null;
            one.clear();
            this.assertEquals(counter.one, 5, "Event 5 not called on one");
            this.assertEquals(counter.two, 5, "Event 5 not called on two");

            // remove an item that doesn't exist shouldn't raise an event
            one.removeItem("this one here");
            this.assertEquals(counter.one, 5, "Event 6 called on one");
            this.assertEquals(counter.two, 5, "Event 6 called on two");

            one.$dispose();
            two.$dispose();
        },

        testSerializedEvent : function () {
            var storage = new this.storageClass();

            var counter = 0, expected;
            storage.$on({
                change : {
                    fn : function (evt) {
                        counter += 1;

                        this.assertEquals(aria.utils.Object.keys(evt.newValue || {}).length, expected.newValues, "Event "
                                + counter + " has wrong newValue");
                        this.assertEquals(aria.utils.Object.keys(evt.oldValue || {}).length, expected.oldValues, "Event "
                                + counter + " has wrong oldValue");
                    },
                    scope : this
                }
            });

            var meta = {
                one : 1,
                two : 1
            };
            expected = {
                newValues : 2,
                oldValues : 0
            };
            meta[Aria.FRAMEWORK_PREFIX + "metadata"] = "what";

            // check the new value with metadata
            storage.setItem("a", meta);
            this.assertEquals(counter, 1, "Event 1 not called");

            // check the old value with metadata
            meta.somethingElse = {
                "true" : true
            };
            expected = {
                newValues : 3,
                oldValues : 2
            };
            storage.setItem("a", meta);
            this.assertEquals(counter, 2, "Event 2 not called");

            storage.$dispose();
        }
    }
});
