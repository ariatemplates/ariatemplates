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
    $classpath : "test.aria.storage.base.GeneralNamespace",
    $extends : "test.aria.storage.base.BaseTests",
    $prototype : {
        /**
         * Check what happens when you use namespaces, one namespaced shouldn't affect the others
         */
        testNamespaceAPI : function () {
            var global = new this.storageClass();
            var one = new this.storageClass({
                namespace : "first"
            });
            var two = new this.storageClass({
                namespace : "second"
            });

            // Setting on global you don't see it in namespace
            global.setItem("a", "global");
            var value = one.getItem("a");
            this.assertEquals(value, null, "one namespaced is accessing a global item, got " + value);
            value = two.getItem("a");
            this.assertEquals(value, null, "two namespaced is accessing a global item, got " + value);

            // setting on namespace shouldn't change others
            one.setItem("a", "namespaced");
            value = global.getItem("a");
            this.assertEquals(value, "global", "one namespaced is modifying a global item, got " + value);
            value = two.getItem("a");
            this.assertEquals(value, null, "two namespaced is accessing a global item, got " + value);

            // remove item on a namespace
            two.removeItem("a", "second space");
            value = global.getItem("a");
            this.assertEquals(value, "global", "two namespaced is removing a global item, got " + value);
            value = one.getItem("a");
            this.assertEquals(value, "namespaced", "two namespaced is removing a namespaced item, got " + value);

            // I'm not sure on what clear is supposed to do, let's say it removes everything everywhere
            one.clear();
            value = global.getItem("a");
            this.assertEquals(value, null, "one namespaced has still items, got " + value);
            value = two.getItem("a");
            this.assertEquals(value, null, "two namespaced has still items, got " + value);

            global.$dispose();
            one.$dispose();
            two.$dispose();
        },

        /**
         * Verify if the events are raised correctly
         */
        testNamespaceEvents : function () {
            var global = new this.storageClass();
            var one = new this.storageClass({
                namespace : "first"
            });
            var two = new this.storageClass({
                namespace : "second"
            });
            var oneAgain = new this.storageClass({
                namespace : "first"
            });

            var counter = {
                global : 0,
                one : 0,
                two : 0,
                oneAgain : 0
            };
            var expectedArguments = {};

            global.$on({
                change : {
                    fn : function (evt) {
                        counter.global += 1;

                        this.checkEventArguments(expectedArguments, evt, "global");
                    },
                    scope : this
                }
            });
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
            oneAgain.$on({
                change : {
                    fn : function (evt) {
                        counter.oneAgain += 1;

                        this.checkEventArguments(expectedArguments, evt, "oneAgain");
                    },
                    scope : this
                }
            });

            expectedArguments = {
                key : "a",
                oldValue : null,
                newValue : "global",
                url : Aria.$window.location
            };
            // changes on global shouldn't be seen on namespaced instances
            global.setItem("a", "global");
            this.assertEquals(counter.global, 1, "Event 1 not called on global");
            this.assertEquals(counter.one, 0, "Event 1 called on one");
            this.assertEquals(counter.two, 0, "Event 1 called on two");
            this.assertEquals(counter.oneAgain, 0, "Event 1 called on oneAgain");

            // chaneges on namespace should be seen only on the same namespaced instances
            expectedArguments.newValue = "first namespace";
            one.setItem("a", "first namespace");
            this.assertEquals(counter.global, 1, "Event 2 called on global");
            this.assertEquals(counter.one, 1, "Event 2 not called on one");
            this.assertEquals(counter.two, 0, "Event 2 called on two");
            this.assertEquals(counter.oneAgain, 1, "Event 2 not called on oneAgain");

            expectedArguments.newValue = "second as well";
            two.setItem("a", "second as well");
            this.assertEquals(counter.global, 1, "Event 3 called on global");
            this.assertEquals(counter.one, 1, "Event 3 called on one");
            this.assertEquals(counter.two, 1, "Event 3 not called on two");
            this.assertEquals(counter.oneAgain, 1, "Event 3 called on oneAgain");

            // check the history of namespaced events
            expectedArguments.newValue = "change this value";
            expectedArguments.oldValue = "first namespace";
            oneAgain.setItem("a", "change this value");
            this.assertEquals(counter.global, 1, "Event 4 called on global");
            this.assertEquals(counter.one, 2, "Event 4 not called on one");
            this.assertEquals(counter.two, 1, "Event 4 called on two");
            this.assertEquals(counter.oneAgain, 2, "Event 4 not called on oneAgain");

            // remove an item
            expectedArguments.oldValue = "second as well";
            expectedArguments.newValue = null;
            two.removeItem("a");
            this.assertEquals(counter.global, 1, "Event 5 called on global");
            this.assertEquals(counter.one, 2, "Event 5 called on one");
            this.assertEquals(counter.two, 2, "Event 5 not called on two");
            this.assertEquals(counter.oneAgain, 2, "Event 5 called on oneAgain");

            // remove an item that doesn't exist
            global.removeItem("missing item");
            this.assertEquals(counter.global, 1, "Event 6 called on global");
            this.assertEquals(counter.one, 2, "Event 6 called on one");
            this.assertEquals(counter.two, 2, "Event 6 called on two");
            this.assertEquals(counter.oneAgain, 2, "Event 6 called on oneAgain");

            // clear
            expectedArguments.oldValue = null;
            expectedArguments.newValue = null;
            expectedArguments.key = null;
            one.clear();
            this.assertEquals(counter.global, 2, "Event 7 not called on global");
            this.assertEquals(counter.one, 3, "Event 7 not called on one");
            this.assertEquals(counter.two, 3, "Event 7 not called on two");
            this.assertEquals(counter.oneAgain, 3, "Event 7 not called on oneAgain");

            global.$dispose();
            one.$dispose();
            two.$dispose();
            oneAgain.$dispose();
        }
    }
});
