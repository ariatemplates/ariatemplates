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
 * Test for the serialization of JSON data to be sent along with the request
 */
Aria.classDefinition({
	$classpath : "test.aria.modules.RequestMgrJsonSerializerTest",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["aria.modules.RequestMgr", "test.aria.modules.test.JsonSerializerTestFilter",
			"aria.modules.requestHandler.RequestHandler", "aria.utils.Date",
			"test.aria.modules.test.jsonSerializers.FirstJsonSerializer",
			"test.aria.modules.test.jsonSerializers.SecondJsonSerializer",
			"test.aria.modules.test.jsonSerializers.ThirdJsonSerializer", "aria.templates.ModuleCtrlFactory"],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
		this.defaultTestTimeout = 12000;
		// filter used to redirect requests
		this.__filter = new test.aria.modules.test.JsonSerializerTestFilter();
		aria.core.IOFiltersMgr.addFilter(this.__filter);

		this.rm = aria.modules.RequestMgr;

		// request handler
		this.__requestHandler = new aria.modules.requestHandler.RequestHandler();

		// serializers
		this.__firstSerializer = new test.aria.modules.test.jsonSerializers.FirstJsonSerializer();
		this.__secondSerializer = new test.aria.modules.test.jsonSerializers.SecondJsonSerializer();
		this.__thirdSerializer = new test.aria.modules.test.jsonSerializers.ThirdJsonSerializer();

		this.__requestObject = {
			actionName : "serializerTestAction",
			moduleName : "module",
			requestHandler : this.__requestHandler
		};

		this.__requestJson = {
			myDate : new Date(2011, 5, 24, 12, 45, 50)
		};

	},
	$destructor : function () {
		aria.core.IOFiltersMgr.removeFilter(this.__filter);

		this.__filter.$dispose();
		this.__filter = null;

		this.rm = null;

		this.__requestHandler.$dispose();
		this.__requestHandler = null;

		this.__firstSerializer.$dispose();
		this.__secondSerializer.$dispose();
		this.__thirdSerializer.$dispose();
		this.__firstSerializer = null;
		this.__secondSerializer = null;
		this.__thirdSerializer = null;

		this.__requestObject = null;
		this.__requestJson = null;

		this.$TestCase.$destructor.call(this);
	},
	$prototype : {
		/**
		 * Unique test in order to enforce tghe correct sequence on all browsers
		 */
		testAsyncUniqueTest : function () {
			this._testAsyncAppEnvSerializer();
		},
		/**
		 * Test that the serializer specified in the application environment is taken into account
		 */
		_testAsyncAppEnvSerializer : function () {
			aria.core.AppEnvironment.setEnvironment({
				requestJsonSerializer : {
					options : {
						serializedDatePattern : "dd MMM yy",
						escapeKeyNames : false
					}
				}
			});

			this.rm.submitJsonRequest(this.__requestObject, this.__requestJson, {
				fn : this.__testAsyncAppEnvSerializerCbOne,
				scope : this
			});
		},

		__testAsyncAppEnvSerializerCbOne : function (res) {
			this.assertTrue(res.responseText == "{myDate:\"24 Jun 11\"}", "Application environment serializer not taken into account.");

			aria.core.AppEnvironment.setEnvironment({
				requestJsonSerializer : {
					options : {
						serializedDatePattern : "dd MMM yy"
					}
				}
			});
			this.rm.submitJsonRequest(this.__requestObject, this.__requestJson, {
				fn : this.__testAsyncAppEnvSerializerCbTwo,
				scope : this
			});

		},
		__testAsyncAppEnvSerializerCbTwo : function (res) {
			this.assertTrue(res.responseText == "{\"myDate\":\"24 Jun 11\"}", "Application environment serializer not taken into account.");

			aria.core.AppEnvironment.setEnvironment({
				requestJsonSerializer : {
					instance : this.__firstSerializer
				}
			});
			this.rm.submitJsonRequest(this.__requestObject, this.__requestJson, {
				fn : this.__testAsyncAppEnvSerializerCbThree,
				scope : this
			});

		},
		__testAsyncAppEnvSerializerCbThree : function (res) {
			this.assertTrue(res.responseText == "FirstJsonSerializer", "Application environment serializer not taken into account.");
			aria.core.AppEnvironment.setEnvironment({
				requestJsonSerializer : {
					instance : this.__firstSerializer,
					options : {
						msg : "OK"
					}
				}
			});
			this.rm.submitJsonRequest(this.__requestObject, this.__requestJson, {
				fn : this.__testAsyncAppEnvSerializerCbFour,
				scope : this
			});

		},
		__testAsyncAppEnvSerializerCbFour : function (res) {
			this.assertTrue(res.responseText == "FirstJsonSerializerOK", "Application environment serializer not taken into account.");

			this._testAsyncRequestSerializer();
		},

		/**
		 * Test that the correct JSON serializer is called when specified in the request object
		 */
		_testAsyncRequestSerializer : function () {

			this.__requestObject.requestJsonSerializer = {
				options : {
					msg : "msg"
				}
			};
			this.rm.submitJsonRequest(this.__requestObject, this.__requestJson, {
				fn : this.__testAsyncRequestSerializerCbOne,
				scope : this
			});

		},
		__testAsyncRequestSerializerCbOne : function (res) {
			this.assertTrue(res.responseText == "FirstJsonSerializermsg", "Request serializer options not taken into account.");

			this.__requestObject.requestJsonSerializer = {
				instance : this.__secondSerializer
			};
			this.rm.submitJsonRequest(this.__requestObject, this.__requestJson, {
				fn : this.__testAsyncRequestSerializerCbTwo,
				scope : this
			});

		},
		__testAsyncRequestSerializerCbTwo : function (res) {
			this.assertTrue(res.responseText == "{\"myDate\":SecondJsonSerializerDate}", "Request serializer options not taken into account.");
			this.__requestObject.requestJsonSerializer = {
				instance : this.__secondSerializer,
				options : {
					msg : "msg"
				}
			};
			this.rm.submitJsonRequest(this.__requestObject, this.__requestJson, {
				fn : this.__testAsyncRequestSerializerCbThree,
				scope : this
			});

		},
		__testAsyncRequestSerializerCbThree : function (res) {
			this.assertTrue(res.responseText == "{\"myDate\":SecondJsonSerializerDatemsg}", "Request serializer options not taken into account.");

			// test that the request options override the environment options

			aria.core.AppEnvironment.setEnvironment({
				requestJsonSerializer : {
					options : {
						serializedDatePattern : "dd MMM yy"
					}
				}
			});
			this.__requestObject.requestJsonSerializer = {
				options : {
					serializedDatePattern : "MMM dd yy"
				}
			};
			this.rm.submitJsonRequest(this.__requestObject, this.__requestJson, {
				fn : this.__testAsyncRequestSerializerCbFour,
				scope : this
			});

		},
		__testAsyncRequestSerializerCbFour : function (res) {
			this.assertTrue(res.responseText == "{\"myDate\":\"Jun 24 11\"}", "Request serializer options not taken into account.");
			delete this.__requestObject.requestJsonSerializer;
			aria.core.AppEnvironment.setEnvironment({
				requestJsonSerializer : {
					instance : this.__firstSerializer,
					options : {
						msg : "OK"
					}
				}
			});

			this._testAsyncModuleJsonSerializer();

		},

		/**
		 * Test json serializer at module level
		 */
		_testAsyncModuleJsonSerializer : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.modules.test.jsonSerializers.TestModule"
			}, {
				fn : this.__testAsyncModuleJsonSerializerCbOne,
				scope : this
			});
		},

		__testAsyncModuleJsonSerializerCbOne : function (res) {
			this.__module = res.moduleCtrlPrivate;
			this.__module.$requestHandler = this.__requestHandler;
			this.__module.$requestJsonSerializer = {
				options : {
					msg : "msg"
				}
			};
			this.__module.submitJsonRequest("serializerTestAction", this.__requestJson, {
				fn : this.__testAsyncModuleJsonSerializerCbTwo,
				scope : this
			});

		},
		__testAsyncModuleJsonSerializerCbTwo : function (res) {
			this.assertTrue(res.responseText == "FirstJsonSerializermsg", "Request serializer options not taken into account.");

			this.__module.$requestJsonSerializer = {
				instance : this.__thirdSerializer
			};
			this.__module.submitJsonRequest("serializerTestAction", this.__requestJson, {
				fn : this.__testAsyncModuleJsonSerializerCbThree,
				scope : this
			});

		},
		__testAsyncModuleJsonSerializerCbThree : function (res) {

			this.assertTrue(res.responseText == "{\"myDate\":ThirdJsonSerializerDate}", "Request serializer options not taken into account.");
			this.__module.$requestJsonSerializer = {
				instance : this.__thirdSerializer,
				options : {
					msg : "msg"
				}
			};
			this.__module.submitJsonRequest("serializerTestAction", this.__requestJson, {
				fn : this.__testAsyncModuleJsonSerializerCbFour,
				scope : this
			});

		},
		__testAsyncModuleJsonSerializerCbFour : function (res) {
			this.assertTrue(res.responseText == "{\"myDate\":ThirdJsonSerializerDatemsg}", "Request serializer options not taken into account.");

			// Test that the module options override the environment options
			aria.core.AppEnvironment.setEnvironment({
				requestJsonSerializer : {
					options : {
						serializedDatePattern : "dd MMM yy"
					}
				}
			});
			this.__module.$requestJsonSerializer = {
				options : {
					serializedDatePattern : "MMM dd yy"
				}
			};
			this.__module.submitJsonRequest("serializerTestAction", this.__requestJson, {
				fn : this.__testAsyncModuleJsonSerializerCbFive,
				scope : this
			});

		},
		__testAsyncModuleJsonSerializerCbFive : function (res) {
			this.assertTrue(res.responseText == "{\"myDate\":\"Jun 24 11\"}", "Request serializer options not taken into account.");

			this.__module.$dispose();

			this.notifyTestEnd("testAsyncUniqueTest");
		}

	}
});
