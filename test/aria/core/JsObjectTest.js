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
    $classpath : "test.aria.core.JsObjectTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.core.test.ClassA", "test.aria.core.test.ClassB", "test.aria.core.test.TestClass",
            "test.aria.core.test.ImplementInterface1", "test.aria.core.test.Interface1", "test.aria.core.test.MyFlow",
            "aria.utils.Callback"],
    $prototype : {
        setUp : function () {
            var that = this;
            this._oldAlert = Aria.$window.alert;
            Aria.$window.alert = function (msg) {
                that._myMethod.call(that, msg);
            };
        },

        tearDown : function () {
            Aria.$window.alert = this._oldAlert;
        },

        _myMethod : function (msg) {
            this._storedMessage = msg;
        },

        /**
         * Test event definition on a base class
         */
        testEventsDefinition1 : function () {
            var ca = new test.aria.core.test.ClassA();

            this.assertTrue(ca.$events["start"] != null);
            this.assertTrue(ca.$events["end"].properties.endCount != null);
            this.assertTrue(ca.$events["begin"] == null);

            ca.$dispose(); // call the destructor (mandatory when discarding an object)
        },

        /**
         * Test event defintion on a sub-class
         */
        testEventsDefinition2 : function () {
            var cb = new test.aria.core.test.ClassB();

            this.assertTrue(cb.$events["start"] != null);
            this.assertTrue(cb.$events["end"].properties.endCount != null);
            this.assertTrue(cb.$events["begin"] != null);

            cb.$dispose(); // call the destructor (mandatory when discarding an object)
        },

        /**
         * Test the $assert function
         */
        testAssert : function () {
            this.assertTrue(this.$assert(1, true));
            this.assertFalse(this.$assert(2, false));
            this.assertErrorInLogs(this.ASSERT_FAILURE);
            this.assertTrue(this.$assert(3, {}));
            this.assertFalse(this.$assert(4, null));
            this.assertErrorInLogs(this.ASSERT_FAILURE);
            this.assertFalse(this.$assert());
            this.assertErrorInLogs(this.ASSERT_FAILURE);
        },

        testLogs : function () {
            var msg = aria.core.JsObject.classDefinition.$prototype.$logDebug("debug msg");
            this.assertTrue(msg === "");
            msg = aria.core.JsObject.classDefinition.$prototype.$logInfo("debug msg");
            this.assertTrue(msg === "");
            msg = aria.core.JsObject.classDefinition.$prototype.$logWarn("debug msg");
            this.assertTrue(msg === "");
            msg = aria.core.JsObject.classDefinition.$prototype.$logError("debug msg %1", "error");
            this.assertTrue(msg === "");
        },

        testAlert : function () {
            test.aria.core.test.TestClass.$alert();
            this.assertNotEquals(this._storedMessage.indexOf("## test.aria.core.test.TestClass ##"), -1);
            this.assertNotEquals(this._storedMessage.indexOf("classNumber:2"), -1);
            this.assertNotEquals(this._storedMessage.indexOf("classObj:[object]"), -1);
            this.assertNotEquals(this._storedMessage.indexOf("classFunc:[function]"), -1);
        },

        testCallback : function () {
            var myJsObject = new aria.core.JsObject();
            this.myCallback = new aria.utils.Callback({
                fn : test.aria.core.test.TestClass.testCallbackFailure
            });
            myJsObject.CALLBACK_ERROR = "Test Callback Error: testCallbackFailure()";
            myJsObject.$callback(this.myCallback);
            this.assertErrorInLogs(myJsObject.CALLBACK_ERROR);
            myJsObject.$dispose();
            this.myCallback.$dispose();
        },

        testInterceptors : function () {
            var myInterceptor = function (param) {
                param.cancelDefault = true;
                param.returnValue = "return value intercepted";
            };

            var obj = Aria.getClassInstance('test.aria.core.test.ImplementInterface1');
            obj.$addInterceptor('', myInterceptor);
            this.assertErrorInLogs(aria.core.JsObject.INTERFACE_NOT_SUPPORTED);

            obj.$addInterceptor('test.aria.core.test.Interface1', myInterceptor);
            var results = obj.$interface('test.aria.core.test.Interface1').search('a', 'b');
            this.assertTrue(results == "return value intercepted");

            obj.$removeInterceptors('');
            results = obj.$interface('test.aria.core.test.Interface1').search('a', 'b');
            this.assertTrue(results == "return value intercepted");

            obj.$removeInterceptors('test.aria.core.test.Interface1');
            results = obj.$interface('test.aria.core.test.Interface1').search('a', 'b');
            this.assertTrue(results == "searchResult");
            obj.$dispose();
        },

        testAddInterceptedMethods : function () {
            var obj = Aria.getClassInstance('test.aria.core.test.ImplementInterface1');
            var myInterceptor = Aria.getClassInstance('test.aria.core.test.MyFlow');
            var interceptedMethodsCount = 0;

            // adding an interceptor from a class object and not a callback object
            obj.$addInterceptor('test.aria.core.test.Interface1', myInterceptor);

            // test interceptor has been added for the correct method
            this.assertTrue(obj.__$interceptors['test.aria.core.test.Interface1']['search'][0]['scope']['$classpath'] === myInterceptor.$classpath);

            // test that only specific methods defined in the interceptor have been intercepted and not all the methods
            // of the interface
            interceptedMethodsCount = aria.utils.Object.keys(obj.__$interceptors['test.aria.core.test.Interface1']).length;
            this.assertTrue(interceptedMethodsCount === 2);

            obj.$removeInterceptors('test.aria.core.test.Interface1');
            myInterceptor.$dispose();
            obj.$dispose();
        },

        testRemoveInterceptedMethods : function () {
            var obj = Aria.getClassInstance('test.aria.core.test.ImplementInterface1');
            var myInterceptor = Aria.getClassInstance('test.aria.core.test.MyFlow');

            // adding an interceptor from a class object and not a callback object
            obj.$addInterceptor('test.aria.core.test.Interface1', myInterceptor);

            // test interceptor has been added for the correct method
            this.assertTrue(obj.__$interceptors['test.aria.core.test.Interface1']['search'][0]['scope']['$classpath'] === myInterceptor.$classpath);

            // test interceptor has been removed
            obj.$removeInterceptors('test.aria.core.test.Interface1');
            this.assertTrue(aria.utils.Object.isEmpty(obj.__$interceptors['test.aria.core.test.Interface1']));
            myInterceptor.$dispose();
            obj.$dispose();
        },

        testCallInterceptedMethods : function () {
            var obj = Aria.getClassInstance('test.aria.core.test.ImplementInterface1');
            var myInterceptor = Aria.getClassInstance('test.aria.core.test.MyFlow');

            // adding an interceptor from a class object and not a callback object
            obj.$addInterceptor('test.aria.core.test.Interface1', myInterceptor);

            var results = obj.$interface('test.aria.core.test.Interface1').search();
            this.assertTrue(results == "intercepted by onSearchCallBegin");

            results = obj.$interface('test.aria.core.test.Interface1').reset();
            this.assertTrue(results == "intercepted by onResetCallEnd");

            // test interceptor has been removed
            obj.$removeInterceptors('test.aria.core.test.Interface1');
            this.assertTrue(aria.utils.Object.isEmpty(obj.__$interceptors['test.aria.core.test.Interface1']));
            myInterceptor.$dispose();
            results = obj.$interface('test.aria.core.test.Interface1').reset();
            this.assertTrue(results == null);
            obj.$dispose();
        },

        testMultipleInterceptorsForSameMethod : function () {
            var obj = Aria.getClassInstance('test.aria.core.test.ImplementInterface1');
            var myInterceptor1 = function (param) {
                param.returnValue = (!param.returnValue || typeof param.returnValue === "string")
                        ? []
                        : param.returnValue;
                param.returnValue.push("return value intercepted by myInterceptor1");
            };

            var myInterceptor2 = function (param) {
                param.returnValue = (!param.returnValue || typeof param.returnValue === "string")
                        ? []
                        : param.returnValue;
                param.returnValue.push("return value intercepted by myInterceptor2");
            };

            obj.$addInterceptor('test.aria.core.test.Interface1', myInterceptor1);
            obj.$addInterceptor('test.aria.core.test.Interface1', myInterceptor2);
            this.assertTrue(obj.__$interceptors['test.aria.core.test.Interface1']['search'].length === 2);

            var results = obj.$interface('test.aria.core.test.Interface1').search();

            /*
             * The order in which the interceptor methods should be called is as follows:
             * CallBegin: interceptor callbacks are called in the order in which they are registered with $addInterceptor
             * CallEnd, Callback: they are called in the reverse order
             * For this test interceptors are called in the following order:
             *     myInterceptor1
             *     myInterceptor2
             *     original interface method
             *     myInterceptor2
             *     myInterceptor1
             */
            // Note the original interface method changes the return value so we only detect for the CallEnd return
            // values
            this.assertTrue(results[0] == "return value intercepted by myInterceptor2");
            this.assertTrue(results[1] == "return value intercepted by myInterceptor1");

            obj.$removeInterceptors('test.aria.core.test.Interface1');
            obj.$dispose();
        }
    }
});
