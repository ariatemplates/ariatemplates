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
 * Test case for the interfaces class.
 */
Aria.classDefinition({
    $classpath : "test.aria.core.InterfacesTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.core.test.ImplementInterface1", "test.aria.core.test.ImplementInterface2",
            "test.aria.core.test.InheritAndImplementInterface"],
    $prototype : {

        /**
         * Test various properties on an interface wrapper that supports Interface1 (test.aria.core.test.Interface1).
         * @param {Object} obj whole object which implements Interface1
         * @param {Object} itf interface wrapper for Interface1 or which inherits from Interface1
         */
        checkInterface1 : function (obj, itf) {
            // test that the notPartOfInterface method exists on the object but not on the interface
            this.assertTrue(obj.notPartOfInterface != null);
            this.assertTrue(itf.notPartOfInterface == null);

            // test that the dataNotPartOfInterface property exists on the object but not on the interface
            this.assertTrue(obj.dataNotPartOfInterface != null);
            this.assertTrue(itf.dataNotPartOfInterface == null);

            // test that calling the search method actually works both on the object and on the interface (with its
            // parameters and return value)
            obj.myData.searchCalled = 0;
            obj.search(0, 1);
            this.assertTrue(obj.myData.searchCalled == 1 && obj.myData.searchParam1 === 0
                    && obj.myData.searchParam2 === 1);
            this.assertTrue(itf.search(2, 3) == "searchResult");
            this.assertTrue(obj.myData.searchCalled == 2 && obj.myData.searchParam1 === 2
                    && obj.myData.searchParam2 === 3);

            // test that the myArray and myData are both present on the interface (and are equal to the properties
            // present on the object):
            this.assertTrue(obj.myArray == itf.myArray);
            this.assertTrue(obj.myData == itf.myData);

            // check the event of the interface and of the object:
            this.assertTrue(obj.$events["MyEventFromInterface1"] != null);
            this.assertTrue(itf.$events["MyEventFromInterface1"] != null);

            // check that the event of the object is not visible on the interface:
            this.assertTrue(obj.$events["evtNotPartOfInterface"] != null);
            this.assertTrue(itf.$events["evtNotPartOfInterface"] == null);

            // check that event-related methods are available on the interface:
            this.assertTrue(obj.$addListeners != null);
            this.assertTrue(obj.$removeListeners != null);
            this.assertTrue(obj.$unregisterListeners != null);
            this.assertTrue(obj.$on == obj.$addListeners);

            // check that we cannot add listeners to evtNotPartOfInterface from the interface
            this.assertLogsEmpty();
            itf.$on({
                'evtNotPartOfInterface' : this._itfEvtHandler,
                scope : this
            });
            this.assertErrorInLogs(aria.core.JsObject.UNDECLARED_EVENT);

            // register as a listener for all events on the interface and check we only receive
            // MyEventFromInterface1 even when evtNotPartOfInterface is fired
            this._itfEvtHandlerCalled = 0;
            this._objEvtHandlerCalled = 0;

            itf.$on({
                "*" : {
                    fn : this._itfEvtHandler,
                    args : {
                        itf : itf,
                        obj : obj
                    }
                },
                scope : this
            });
            obj.$on({
                "*" : {
                    fn : this._objEvtHandler,
                    args : {
                        itf : itf,
                        obj : obj
                    }
                },
                scope : this
            });
            obj.$raiseEvent({
                name : "MyEventFromInterface1"
            });
            this.assertTrue(this._itfEvtHandlerCalled == 1);
            this.assertTrue(this._objEvtHandlerCalled == 1);
            obj.$raiseEvent({ // this event should not call the listener
                name : "evtNotPartOfInterface"
            });
            this.assertTrue(this._itfEvtHandlerCalled == 1);
            this.assertTrue(this._objEvtHandlerCalled == 2);

            // check that unregistering listeners from the interface does not unregister
            // the one from the object
            itf.$unregisterListeners(this);

            obj.$raiseEvent({
                name : "MyEventFromInterface1"
            });
            this.assertTrue(this._itfEvtHandlerCalled == 1);
            this.assertTrue(this._objEvtHandlerCalled == 3);

            obj.$unregisterListeners(this);
        },

        /**
         * Event handler registered on an interface wrapper.
         * @param {Object} evt event object
         * @param {Object} args contains obj and itf properties (whole object and interface wrapper)
         */
        _itfEvtHandler : function (evt, args) {
            this._itfEvtHandlerCalled++;
            // check the src property of the event
            this.assertTrue(evt.src == args.itf);
        },

        /**
         * Event handler registered on the whole object.
         * @param {Object} evt event object
         * @param {Object} args contains obj and itf properties (whole object and interface wrapper)
         */
        _objEvtHandler : function (evt, args) {
            this._objEvtHandlerCalled++;
            // check the src property of the event
            this.assertTrue(evt.src == args.obj);
        },

        /**
         * Do various checks with ImplementInterface1 (test.aria.core.test.ImplementInterface1). (with no interface
         * inheritance)
         */
        testSimpleInterface : function () {
            var obj = new test.aria.core.test.ImplementInterface1();
            var itf = obj.$interface("test.aria.core.test.Interface1");

            // check the properties and methods present in the interface
            this.checkInterface1(obj, itf);

            // test that the Interface2 is not supported on obj:
            this.assertLogsEmpty();
            var notAccepted = obj.$interface("test.aria.core.test.Interface2");
            this.assertErrorInLogs(obj.INTERFACE_NOT_SUPPORTED);
            this.assertTrue(notAccepted == null);

            var itf2 = obj.$interface("test.aria.core.test.Interface1"); // try to get a second instance of the same
            // interface
            this.assertTrue(itf2 == itf); // check that the second instance of the interface is the same as the first
            // one

            // Check that disposing the object also disposes interfaces:
            // before the object is destroyed, myData and myArray are not null:
            this.assertTrue(itf.myData != null);
            this.assertTrue(itf.myArray != null);

            obj.$dispose();

            // but after, they are null:
            this.assertTrue(itf.myData == null);
            this.assertTrue(itf.myArray == null);
        },

        /**
         * Do various checks with ImplementInterface2 (test.aria.core.test.ImplementInterface2) and
         * InheritAndImplementInterface (test.aria.core.test.InheritAndImplementInterface), especially check
         * inheritance-related behavior.
         */
        testInterfaceInheritance : function () {
            this.checkBothInterface1and2(new test.aria.core.test.ImplementInterface2());
            this.checkBothInterface1and2(new test.aria.core.test.InheritAndImplementInterface());
        },

        /**
         * Do various inheritance-related checks on an object which both implements Interface1 and Interface2.
         * @param {Object} obj object which both implements Interface1 and Interface2. This object is disposed in this
         * method.
         */
        checkBothInterface1and2 : function (obj) {
            var itf1 = obj.$interface("test.aria.core.test.Interface1");
            // check the properties and methods present in the interface
            this.checkInterface1(obj, itf1);
            // ensure that this interface2 element is not in itf1:
            this.assertTrue(itf1.myAdditionnalFunction == null);
            this.assertTrue(itf1.$events.MyEventFromInterface2 == null);
            var itf2 = obj.$interface("test.aria.core.test.Interface2");
            // check the properties and methods present in the interface
            // by inheritance, interface2 must support everything interface1 supports
            this.checkInterface1(obj, itf2);
            // ensure that this interface2 element works well:
            obj.myData.myAdditionnalFunctionCalled = 0;
            this.assertTrue(itf2.myAdditionnalFunction("a", "b") == "a");
            this.assertTrue(obj.myData.myAdditionnalFunctionCalled == 1);
            this.assertTrue(obj.myData.myAFParam1 == "a" && obj.myData.myAFParam2 == "b");
            this.assertTrue(itf2.$events.MyEventFromInterface2 != null);

            // try to get a second instance of the same interface on the object
            var itf1bis = obj.$interface("test.aria.core.test.Interface1");
            // check that the second instance of the interface is the same as the first one
            this.assertTrue(itf1bis == itf1);
            // same thing with itf2:
            var itf2bis = obj.$interface("test.aria.core.test.Interface2");
            this.assertTrue(itf2bis == itf2);

            // Check that disposing the object also disposes interfaces:
            // before the object is destroyed, myData and myArray are not null:
            this.assertTrue(itf1.myData != null);
            this.assertTrue(itf1.myArray != null);
            this.assertTrue(itf2.myData != null);
            this.assertTrue(itf2.myArray != null);

            obj.$dispose();

            // but after, they are null:
            this.assertTrue(itf1.myData == null);
            this.assertTrue(itf1.myArray == null);
            this.assertTrue(itf2.myData == null);
            this.assertTrue(itf2.myArray == null);
        },

        /**
         * Helper method for testLinkItfWrappers. Create an object containing two methods (myFunc1 and myFunc2) and two
         * values.
         * @param {Number} value Value to be returned when calling the methods on the returned object.
         * @return {Object} resulting object
         * @protected
         */
        _utilCreateObject : function (value) {
            var proto = {
                myFunc1 : function () {
                    return value;
                }
            };
            proto["proto-" + value] = 1;
            var Constr = new Function();
            Constr.prototype = proto;
            var res = new Constr();
            res.myFunc2 = function () {
                return value;
            };
            res["own-" + value] = 1;
            return res;
        },

        /**
         * Helper method for testLinkItfWrappers. Check an object looks like the result of _utilCreateObject with the
         * given value.
         * @param {Object} object object to be checked
         * @param {Number} value value
         * @protected
         */
        _checkObject : function (obj, value) {
            this.assertTrue(obj.myFunc1() == value);
            this.assertTrue(obj.myFunc2() == value);
            this.assertTrue(obj["proto-" + value] == 1);
            this.assertTrue(obj["own-" + value] == 1);
            for (var k = 0; k < value; k++) {
                this.assertTrue(obj["proto-" + k] == null);
                this.assertTrue(obj["own-" + k] == null);
            }
        },

        /**
         * Test the behavior of linkItfWrappers.
         */
        testLinkItfWrappers : function () {
            var size = 5;
            var itf = aria.core.Interfaces;
            var objs = [];
            for (var i = 0; i < size; i++) {
                objs[i] = this._utilCreateObject(i);
                this._checkObject(objs[i], i);
            }
            for (var i = 1; i < size; i++) {
                // previous object points to the new one:
                itf.linkItfWrappers(objs[i - 1], objs[i]);
                for (var j = 0; j <= i; j++) {
                    this._checkObject(objs[j], i);
                }
                for (var j = i + 1; j < size; j++) {
                    this._checkObject(objs[j], j);
                }
            }
        },

        testAsyncErrorInterface : function () {
            Aria.load({
                classes : ['test.aria.core.test.ImplementErrorInterface'],
                oncomplete : {
                    fn : this._afterClassLoaded,
                    scope : this
                },
                onerror : {
                    fn : this._afterClassLoaded,
                    scope : this
                }
            });
        },

        _afterClassLoaded : function () {
            this.assertErrorInLogs(aria.core.Interfaces.INVALID_INTERFACE_MEMBER);
            this.assertErrorInLogs(aria.core.Interfaces.INVALID_INTERFACE_MEMBER_DEF);
            this.assertErrorInLogs(aria.core.Interfaces.WRONG_INTERFACE);
            this.notifyTestEnd('testAsyncErrorInterface');
        }
    }
});
