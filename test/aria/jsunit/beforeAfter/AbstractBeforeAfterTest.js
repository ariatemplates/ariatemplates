/*
 * Copyright 2013 Amadeus s.a.s.
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
 * Abstract class to share some logic between sync and async test.
 */
Aria.classDefinition({
    $classpath : "test.aria.jsunit.beforeAfter.AbstractBeforeAfterTest",
    $extends : "aria.jsunit.TestCase",
    $constructor : function () {
        this.defaultTestTimeout = 2000;
        this.$TestCase.constructor.call(this);
        this.events = [];
    },
    $destructor : function () {
        // Testing that "beforeClass" was executed is straightforward - do something and check in test2 if this has
        // really been done.

        // Testing that "afterClass" was at all executed is a bit tricky.

        // At this point ($destructor), the test update event has already been raised.
        // However we can still call assertions now; if they fail, instead of failed asserts, this will result in test
        // case class disposal error.
        // Hence in this hacky way we'll receive an error notification from the test runner.

        var events = this.events;
        this.assertEquals(events.length, 8);
        this.assertEquals(events[7], "afterClass");

        this.events = null;
        this.$TestCase.constructor.call(this);
    },
    $prototype : {
        setUp : function () {
            this.events.push("setUp");
        },

        tearDown : function () {
            this.events.push("tearDown");
        },

        test1 : function () {
            this.events.push("test1");
        },

        test2 : function () {
            // we implicitly rely on the order of enumeration, this is bad, but let's not overcomplicate
            this.events.push("test2");

            var events = this.events;
            this.assertEquals(events.length, 6);
            this.assertEquals(events[0], "beforeClass");

            this.assertEquals(events[1], "setUp");
            this.assertEquals(events[2], "test1");
            this.assertEquals(events[3], "tearDown");

            this.assertEquals(events[4], "setUp");
            this.assertEquals(events[5], "test2");
        }
    }
});
