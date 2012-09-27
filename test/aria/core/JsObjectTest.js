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
	$classpath:'test.aria.core.JsObjectTest',
	$extends:'aria.jsunit.TestCase',
	$dependencies:[
		'test.aria.core.test.ClassA',
		'test.aria.core.test.ClassB',
    'test.aria.core.test.TestClass',
    'test.aria.core.test.ImplementInterface1',
    'test.aria.core.test.Interface1'
	],
	$constructor:function() {
		this.$TestCase.constructor.call(this);
	},
	$prototype:{
    setUp : function () {
      var that = this;
      this._oldAlert = Aria.$window.alert;
      Aria.$window.alert = function (msg) {
        that._myMethod.call(that, msg);
      }
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
		testEventsDefinition1:function() {
			var ca=new test.aria.core.test.ClassA()

			this.assertTrue(ca.$events["start"]!=null)
			this.assertTrue(ca.$events["end"].properties.endCount!=null)
			this.assertTrue(ca.$events["begin"]==null)

			ca.$dispose(); // call the destructor (mandatory when discarding an object)
		},

		/**
		 * Test event defintion on a sub-class
		 */
		testEventsDefinition2:function() {
			var cb=new test.aria.core.test.ClassB()

			this.assertTrue(cb.$events["start"]!=null)
			this.assertTrue(cb.$events["end"].properties.endCount!=null)
			this.assertTrue(cb.$events["begin"]!=null)

			cb.$dispose(); // call the destructor (mandatory when discarding an object)
		},

		/**
		 * Test the $assert function
		 */
		testAssert:function() {
			this.assertTrue(this.$assert(1,true))
			this.assertFalse(this.$assert(2,false))
			this.assertErrorInLogs(this.ASSERT_FAILURE);
			this.assertTrue(this.$assert(3,{}))
			this.assertFalse(this.$assert(4,null))
			this.assertErrorInLogs(this.ASSERT_FAILURE);
			this.assertFalse(this.$assert())
			this.assertErrorInLogs(this.ASSERT_FAILURE);
		},

    testLogs : function () {
      var msg = aria.core.JsObject.classDefinition.$prototype.$logDebug("debug msg");
      this.assertTrue(msg == "");
      msg = aria.core.JsObject.classDefinition.$prototype.$logInfo("debug msg");
      this.assertTrue(msg == "");
      msg = aria.core.JsObject.classDefinition.$prototype.$logWarn("debug msg");
      this.assertTrue(msg == "");
      msg = aria.core.JsObject.classDefinition.$prototype.$logError("debug msg %1", "error");
      this.assertTrue(msg == "");
    },

    testAlert : function () {
      test.aria.core.test.TestClass.$alert();
      this.assertNotEquals(this._storedMessage.indexOf("## test.aria.core.test.TestClass ##"), -1);
      this.assertNotEquals(this._storedMessage.indexOf("classNumber:2"), -1);
      this.assertNotEquals(this._storedMessage.indexOf("classObj:[object]"), -1);
      this.assertNotEquals(this._storedMessage.indexOf("classFunc:[function]"), -1);
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
      var results = obj.$interface('test.aria.core.test.Interface1').search('a', 'b');
      this.assertTrue(results == "return value intercepted");

      obj.$removeInterceptors('test.aria.core.test.Interface1');
      var results = obj.search("a","b");
      this.assertTrue(results == "searchResult");
      obj.$dispose();
    }
	}
});
