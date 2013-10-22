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
    $classpath : "test.aria.html.textarea.bind.TextAreaBindTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.html.TextArea", "aria.utils.Json"],
    $prototype : {
        testInitialValueEmpty : function () {
            var container = {};

            var cfg = {
                bind : {
                    value : {
                        inside : container,
                        to : "empty"
                    }
                }
            };

            var widget = this.createAndInit("aria.html.TextArea", cfg);

            this.assertEquals(widget._domElt.value, "", "Value : " + widget._domElt.value);

            aria.utils.Json.setValue(container, "empty", "something");
            this.assertEquals(widget._domElt.value, "something", "Set value : " + widget._domElt.value);

            widget.$dispose();
            this.outObj.clearAll();
        },

        testInitialValueSomething : function () {
            var container = {
                something : "abc"
            };

            var cfg = {
                bind : {
                    value : {
                        inside : container,
                        to : "something"
                    }
                }
            };

            var widget = this.createAndInit("aria.html.TextArea", cfg);

            this.assertEquals(widget._domElt.value, "abc", "Value : " + widget._domElt.value);

            aria.utils.Json.setValue(container, "something", 12);
            this.assertEquals(widget._domElt.value, "12", "Set value : " + widget._domElt.value);

            widget.$dispose();
            this.outObj.clearAll();
        },

        testInitialValueNumber : function () {
            var container = {
                number : 12
            };

            var cfg = {
                bind : {
                    value : {
                        inside : container,
                        to : "number"
                    }
                }
            };

            var widget = this.createAndInit("aria.html.TextArea", cfg);

            this.assertEquals(widget._domElt.value, "12", "Value : " + widget._domElt.value);

            aria.utils.Json.setValue(container, "number", "other");
            this.assertEquals(widget._domElt.value, "other", "Set value : " + widget._domElt.value);

            widget.$dispose();
            this.outObj.clearAll();
        },

        testInitialValueTransformSingle : function () {
            var container = {
                mutable : "BIG"
            };

            var cfg = {
                bind : {
                    value : {
                        inside : container,
                        to : "mutable",
                        transform : function (value) {
                            return value.toLowerCase();
                        }
                    }
                }
            };

            var widget = this.createAndInit("aria.html.TextArea", cfg);

            this.assertEquals(widget._domElt.value, "big", "Value : " + widget._domElt.value);

            aria.utils.Json.setValue(container, "mutable", "HUGE");
            this.assertEquals(widget._domElt.value, "huge", "Set value : " + widget._domElt.value);

            widget.$dispose();
            this.outObj.clearAll();
        },

        testInitialValueTransformMiltiple : function () {
            var container = {
                mutable : "BIG"
            };

            var cfg = {
                bind : {
                    value : {
                        inside : container,
                        to : "mutable",
                        transform : {
                            fromWidget : function (value) {
                                return value.toUpperCase();
                            },
                            toWidget : function (value) {
                                return value.toLowerCase();
                            }
                        }
                    }
                }
            };

            var widget = this.createAndInit("aria.html.TextArea", cfg);

            this.assertEquals(widget._domElt.value, "big", "Value : " + widget._domElt.value);

            aria.utils.Json.setValue(container, "mutable", "big");
            this.assertEquals(widget._domElt.value, "big", "Set value : " + widget._domElt.value);

            widget.$dispose();
            this.outObj.clearAll();
        }
    }
});
