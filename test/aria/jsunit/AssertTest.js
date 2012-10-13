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
    $classpath : 'test.aria.jsunit.AssertTest',
    $extends : 'aria.jsunit.TestCase',
    $singleton : false,
    $dependencies : ["test.aria.jsunit.assertTest.MyClass"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {
        setUp : function () {
            this.myClass = new test.aria.jsunit.assertTest.MyClass();
        },

        tearDown : function () {
            this.myClass.$dispose();
            delete this.myClass;
        },

        testAssertEventFired : function () {
            this.registerObject(this.myClass);

            this.myClass.fireEvent1();
            this.assertEventFired("event1");
            this.assertEventNotFired("event2");

            this.myClass.fireEvent2();
            this.assertEventFired("event1");
            this.assertEventFired("event2");
        },

        /**
         * This test is really similar to the previous one but it asserts an internal method Also having these two tests
         * defined allows to make sure test the log cleaning between tests
         */
        testSeekEvent : function () {
            this.registerObject(this.myClass);

            this.myClass.fireEvent1();
            this.assertTrue(this.__hasEvent("event1"));
            this.assertFalse(this.__hasEvent("event2"));

            this.myClass.fireEvent2();
            this.assertTrue(this.__hasEvent("event1"));
            this.assertTrue(this.__hasEvent("event2"));
        },

        /**
         * Test a few basic use cases for assertEquals. This assert most likely will always rely on === comparison, this
         * test is really designed as a safety net if anyone wants to try changing the implementation. Testing
         * assertNotEquals as well.
         */
        testAssertEquals : function () {
            // Define two identical objects
            var obj1 = {
                a : "a",
                b : {
                    c : 0
                }
            };
            var obj2 = {
                a : "a",
                b : {
                    c : 0
                }
            };
            var obj3 = {
                someRef : obj1
            };

            this.assertEquals(obj1, obj1, "assertEquals on the same reference to the same object should succeed");
            this.assertEquals(obj1, obj3.someRef, "assertEquals on two references to the same object should succeed");
            this.assertEquals("k", "k", "assertEquals on \"k\" and \"k\" should succeed");

            this.assertNotEquals(obj1, obj2, "assertNotEquals on two different copies of the same object should succeed");
            this.assertNotEquals(obj2, obj3.someRef, "assertNotEquals on two references to the same object should succeed");
            this.assertNotEquals(obj1, null, "assertNotEquals on an object and undefined should succeed");
            this.assertNotEquals(obj1, undefined, "assertNotEquals on two references to the same object should succeed");
            this.assertNotEquals(0, null, "assertNotEquals on 0 and null should succeed");
            this.assertNotEquals(0, false, "assertNotEquals on 0 and false should succeed");
            this.assertNotEquals(null, undefined, "assertNotEquals on null and undefined should succeed");
            this.assertNotEquals("", false, "assertNotEquals empty string and false should succeed");
            this.assertNotEquals(new Array(), [], "assertNotEquals on new Array and [] should succeed");
            this.assertNotEquals("k", new String("k"), "assertNotEquals on \"k\" and new String(\"k\") should succeed");
            this.assertNotEquals([], [], "assertNotEquals on [] and [] should succeed");
            this.assertNotEquals({}, {}, "assertNotEquals on [] and [] should succeed");

            // asserting assert failures ! need to bypass the raiseFailure method
            this.raiseFailure = function () {};
            var assertFailed = true;
            try {
                this.assertEquals(obj1, obj2);
                assertFailed = false; // We expect the assert to fail so we should not reach this statement
            } catch (e) {}
            this.raiseFailure = this.constructor.prototype.raiseFailure;
            this.assertTrue(assertFailed, "Comparing two copies of the same object should fail an assertEquals. assertEquals should only accept strictly identical objects (====)");

            this.raiseFailure = function () {};
            assertFailed = true;
            try {
                this.assertEquals(0, false);
                assertFailed = false; // We expect the assert to fail so we should not reach this statement
            } catch (e) {}
            this.raiseFailure = this.constructor.prototype.raiseFailure;
            this.assertTrue(assertFailed, "assertEquals(0, false) should fail. assertEquals should rely on strict equality");
        },

        /**
         * Similar to the previous test but focusing on assertJsonEquals and assertJsonNotEquals.
         */
        testAssertJsonEquals : function () {
            // Define two identical objects
            var obj1 = {
                a : "a",
                b : {
                    c : 0
                }
            };
            var obj2 = {
                a : "a",
                b : {
                    c : 0
                }
            };
            var obj3 = {
                a : "a",
                b : {
                    c : 0
                },
                d : "d"
            };
            var obj3 = {
                someRef : obj1
            };

            this.assertJsonEquals(obj1, obj1, "assertJsonEquals on the same reference to the same object should succeed");
            this.assertJsonEquals(obj1, obj3.someRef, "assertJsonEquals on two references to the same object should succeed");
            this.assertJsonEquals("k", "k", "assertJsonEquals on \"k\" and \"k\" should succeed");
            this.assertJsonEquals(obj1, obj2, "assertJsonEquals on two different copies of the same object should succeed");
            this.assertJsonEquals(obj2, obj3.someRef, "assertJsonEquals on two references to the same object should succeed");
            this.assertJsonEquals([], [], "assertJsonEquals on [] and [] should succeed");
            this.assertJsonEquals({}, {}, "assertJsonEquals on [] and [] should succeed");
            this.assertJsonEquals(new Array(), [], "assertJsonEquals on new Array and [] should succeed");

            this.assertJsonNotEquals(obj1, null, "assertJsonNotEquals on two references to the same object should succeed");
            this.assertJsonNotEquals(obj1, undefined, "assertJsonNotEquals on two references to the same object should succeed");
            this.assertJsonNotEquals(0, null, "assertJsonNotEquals on 0 and null should succeed");
            this.assertJsonNotEquals(0, false, "assertJsonNotEquals on 0 and false should succeed");
            this.assertJsonNotEquals(null, undefined, "assertJsonNotEquals on null and undefined should succeed");
            this.assertJsonNotEquals("", false, "assertJsonNotEquals empty string and false should succeed");
            this.assertJsonNotEquals("k", new String("k"), "assertJsonNotEquals on \"k\" and new String(\"k\") should succeed");
            this.assertJsonNotEquals(obj1, obj3, "assertJsonNotEquals should succeed on two objects with a different set of properties");

            // asserting assert failures ! need to bypass the raiseFailure method
            this.raiseFailure = function () {};
            var assertFailed = true;
            try {
                this.assertJsonNotEquals(obj1, obj2);
                assertFailed = false; // We expect the assert to fail so we should not reach this statement
            } catch (e) {}
            this.raiseFailure = this.constructor.prototype.raiseFailure;
            this.assertTrue(assertFailed, "Comparing two copies of the same object should fail an assertEquals. assertEquals should only accept strictly identical objects (====)");
        }
    }
});