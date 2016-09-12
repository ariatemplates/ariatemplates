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
    $classpath : "test.aria.html.element.ElementBindingsTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.html.Element", "aria.utils.Json", "aria.utils.Array"],
    $prototype : {
        /**
         * Verify that onbind is called with the correct parameters
         */
        testBindings : function () {
            var basket = {};
            var shopping = {
                bags : [{
                            hand : "left",
                            content : null
                        }, {
                            hand : "right",
                            content : null
                        }]
            };

            var cfg = {
                tagName : "span",
                bind : {
                    "apple" : {
                        inside : basket,
                        to : "apples"
                    },
                    "pear" : {
                        inside : basket,
                        to : "pears"
                    },
                    "coffe" : {
                        inside : shopping.bags[0],
                        to : "content"
                    },
                    "sugar" : {
                        inside : shopping.bags[1],
                        to : "content"
                    }
                }
            };

            var widget = new aria.html.Element(cfg, {
                tplClasspath : "Element"
            });

            var name, value, old;
            widget.onbind = function (property, newValue, oldValue) {
                // Simply put them in the closure
                name = property;
                value = newValue;
                old = oldValue;
            };

            // Change a value with listener
            aria.utils.Json.setValue(basket, "apples", 3);
            this.assertEquals(name, "apple", "Expecting name %2, got %1");
            this.assertEquals(value, 3, "Expecting value %2, got %1");
            this.assertTrue(old == null, "Expecting old value null, got " + old);

            // Change it again
            aria.utils.Json.setValue(basket, "apples", 0);
            this.assertEquals(name, "apple", "Expecting name %2, got %1");
            this.assertEquals(value, 0, "Expecting value %2, got %1");
            this.assertEquals(old, 3, "Expecting old value %2, got %1");

            // Change a different value
            aria.utils.Json.setValue(basket, "pears", ["abate"]);
            this.assertEquals(name, "pear", "Expecting name %2, got %1");
            this.assertEquals(value.length, 1, "Expecting value length %2, got %1");
            this.assertEquals(value[0], "abate", "Expecting value %2, got %1");
            this.assertTrue(old == null, "Expecting old value null, got " + old);

            // And cahnge again the previous one
            aria.utils.Json.setValue(basket, "apples", {
                type : "golden"
            });
            this.assertEquals(name, "apple", "Expecting name %2, got %1");
            this.assertEquals(value.type, "golden", "Expecting value %2, got %1");
            this.assertEquals(old, 0, "Expecting old value %2, got %1");

            // Change a value with no listeners
            aria.utils.Json.setValue(shopping.bags[0], "hand", "middle");
            this.assertEquals(name, "apple", "Expecting name %2, got %1");
            this.assertEquals(value.type, "golden", "Expecting value %2, got %1");
            this.assertEquals(old, 0, "Expecting old value %2, got %1");

            // And now one with a listener
            aria.utils.Json.setValue(shopping.bags[1], "content", false);
            this.assertEquals(name, "sugar", "Expecting name %2, got %1");
            this.assertEquals(value, false, "Expecting value false, got %1");
            this.assertEquals(old, null, "Expecting old value null, got %1");

            widget.$dispose();
        },

        /**
         * Check that listeners are removed when the widget is disposed
         */
        testDestroy : function () {
            var internet = {};

            var cfg = {
                tagName : "img",
                bind : {
                    "src" : {
                        inside : internet,
                        to : "image"
                    },
                    "alt" : {
                        inside : internet,
                        to : "text"
                    }
                }
            };

            var widget = new aria.html.Element(cfg, {
                tplClasspath : "Element"
            });

            // Value and old value are already tested
            var name;
            widget.onbind = function (property) {
                name = property;
            };

            aria.utils.Json.setValue(internet, "image", "something");
            this.assertEquals(name, "src", "The listener on src should be called");

            // Dispose the widget, this is the important part
            widget.$dispose();

            aria.utils.Json.setValue(internet, "text", "something");
            this.assertEquals(name, "src", "The listener on src shouldn't be called again");
        },

        /**
         * Just to be sure that two listener on the same value are called correctly
         */
        testMultipleBind : function () {
            var internet = {};

            var cfg = {
                tagName : "img",
                bind : {
                    "src" : {
                        inside : internet,
                        to : "same"
                    },
                    "alt" : {
                        inside : internet,
                        to : "same"
                    }
                }
            };

            var widget = new aria.html.Element(cfg, {
                tplClasspath : "Element"
            });

            // Value and old value are already tested
            var names = [];
            widget.onbind = function (property) {
                names.push(property);
            };

            aria.utils.Json.setValue(internet, "same", "something");
            this.assertEquals(names.length, 2, "Two listeners should be called");
            this.assertTrue(aria.utils.Array.contains(names, "src"), "src callback not called");
            this.assertTrue(aria.utils.Array.contains(names, "alt"), "alt callback not called");

            widget.$dispose();
        },

        /**
         * This is a bit of paranoia, but check that when there are more widgets, the correct callback is called
         */
        testMultipleWidgets : function () {
            var container = {};
            var first = {
                tagName : "img",
                bind : {
                    "me" : {
                        inside : container,
                        to : "one"
                    }
                }
            };
            var second = {
                tagName : "ul",
                bind : {
                    "you" : {
                        inside : container,
                        to : "two"
                    }
                }
            };
            var third = {
                tagName : "iframe",
                bind : {
                    "me" : {
                        inside : container,
                        to : "two"
                    }
                }
            };

            var one = new aria.html.Element(first, {
                tplClasspath : "Element"
            });
            var two = new aria.html.Element(second, {
                tplClasspath : "Element"
            });
            var three = new aria.html.Element(third, {
                tplClasspath : "Element"
            });

            var names = [];
            one.onbind = function (property) {
                names.push("one_" + property);
            };
            two.onbind = function (property) {
                names.push("two_" + property);
            };
            three.onbind = function (property) {
                names.push("three_" + property);
            };

            aria.utils.Json.setValue(container, "one", 1);
            this.assertEquals(names.length, 1, "One listener should be called");
            this.assertEquals(names[0], "one_me", "One listener should be called");

            names = [];
            aria.utils.Json.setValue(container, "two", 2);
            this.assertEquals(names.length, 2, "Two listeners should be called");
            this.assertTrue(aria.utils.Array.contains(names, "two_you"), "Second listener not called");
            this.assertTrue(aria.utils.Array.contains(names, "three_me"), "Third listener not called");

            one.$dispose();
            two.$dispose();
            three.$dispose();
        }
    }
});
