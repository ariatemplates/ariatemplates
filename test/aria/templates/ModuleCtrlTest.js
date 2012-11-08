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
 * Module Controller test class
 */
Aria.classDefinition({
	$classpath : 'test.aria.templates.ModuleCtrlTest',
	$extends : 'aria.jsunit.TestCase',
	$dependencies : ['aria.templates.ModuleCtrlFactory'],
	$constructor : function () {
		this.$TestCase.constructor.call(this);

		// The test testAsyncSubmitJsonRequest is going to take a lot of time, change the default test timeout
		// the test makes 4 invalid request each running for ~4.000 ms
		this.defaultTestTimeout = 20000;
	},
	$prototype : {
		/**
		 * Test a basic module controller interface : available method, data, test executing methods
		 */
		testAsyncPublicInterface : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl"
			}, {
				fn : this._testAsyncPublicInterfaceCb,
				scope : this
			});
		},

		/**
		 * Assert linked to test testAsyncPublicInterface
		 * @param {Object} res
		 */
		_testAsyncPublicInterfaceCb : function (res) {
			try {
				var mc = res.moduleCtrlPrivate;

				var m = res.moduleCtrl;
				this.assertTrue(m.getData != null);
				this.assertTrue(m.incrementCount != null);

				var data = m.getData();
				this.assertTrue(data.count == 0);
				m.incrementCount();
				this.assertTrue(data.count == 1);
				m.incrementCount({
					by : 3
				});
				this.assertTrue(data.count == 4);
				this.assertTrue(m._decrementCount == null);

				mc.$dispose();
				this.notifyTestEnd("testAsyncPublicInterface");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Test the removal of backward compatibility: it is no longer possible to define the public interface by
		 * calling the $publicInterface method in the module controller constructor and passing an array of methods name
		 */
		testAsyncRemovedBackwardCompatPublicInterface1 : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl3"
			}, {
				fn : this._testAsyncRemovedBackwardCompatPublicInterface1Cb,
				scope : this
			}, true);
		},

		_testAsyncRemovedBackwardCompatPublicInterface1Cb : function (res) {
			try {
				var m3 = res.moduleCtrl;
				this.assertTrue(m3.getData != null);
				this.assertTrue(m3.$classpath == "aria.templates.IModuleCtrl");
				res.moduleCtrlPrivate.$dispose();
				this.notifyTestEnd("testAsyncRemovedBackwardCompatPublicInterface1");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Test the removal of backward compatibility: using the syntax this._publicInterfaceName in the module
		 * controller constructor does not produce any effect
		 */
		testAsyncRemovedBackwardCompatPublicInterface2 : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl4"
			}, {
				fn : this._testAsyncRemovedBackwardCompatPublicInterface2Cb,
				scope : this
			}, true);
		},

		_testAsyncRemovedBackwardCompatPublicInterface2Cb : function (res) {
			try {
				var m4 = res.moduleCtrl;
				this.assertTrue(m4.$classpath == "aria.templates.IModuleCtrl");
				res.moduleCtrlPrivate.$dispose();
				this.notifyTestEnd("testAsyncRemovedBackwardCompatPublicInterface2");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}

		},

		testAsyncInit : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl"
			}, {
				fn : this._testAsyncInitCb,
				scope : this
			}, true /* skip init */);
		},

		_testAsyncInitCb : function (res) {
			try {
				var mc = res.moduleCtrlPrivate;
				var m = res.moduleCtrl;

				this.__initCbArgs = '';
				m.init(null, {
					fn : this._initCb,
					scope : this,
					args : 123
				});
				this.assertTrue(this.__initCbArgs == 123);
				delete this.__initCbArgs;

				mc.$dispose();
				this.notifyTestEnd("testAsyncInit");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Internal function used to validate init callback
		 * @param {JSIN} args callback argument object
		 */
		_initCb : function (ok, args) {
			this.__initCbArgs = args;
		},

		/**
		 * Test that calling loadSubModules with an empty array works correctly, and is synchronous.
		 */
		testAsyncEmptyLoadSubModules : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl"
			}, {
				fn : this._testAsyncEmptyLoadSubModulesCb1,
				scope : this
			});
		},

		_testAsyncEmptyLoadSubModulesCb1 : function (res, args) {
			try {
				var mc = res.moduleCtrlPrivate;
				var args = {
					callbackCalled : false
				};
				mc.loadSubModules([], {
					fn : this._testAsyncEmptyLoadSubModulesCb2,
					scope : this,
					args : args
				});
				this.assertTrue(args.callbackCalled == true);
				mc.$dispose();
				this.notifyTestEnd("testAsyncEmptyLoadSubModules");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		_testAsyncEmptyLoadSubModulesCb2 : function (res, args) {
			try {
				this.assertTrue(args.callbackCalled == false, "_testAsyncEmptyLoadSubModulesCb2 called twice");
				args.callbackCalled = true;
				this.assertTrue(res.subModules.length == 0);
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		testAsyncSubModulesInit : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl2",
				initArgs : {
					test1 : true
				}
			}, {
				fn : this._initCb2,
				scope : this
			});
		},

		_initCb2 : function (res, args) {
			try {
				var m2 = res.moduleCtrl, m2d = m2.getData();
				this.assertTrue(m2.sm1 != null, "sub-reference validation");
				this.assertTrue(m2.sm1.getData != null);
				this.assertTrue(m2d.sm1 != null);
				this.assertTrue(m2.sm1.getData().instanceName == 'sm1');
				this.assertTrue(m2.getData().sm1.instanceName == 'sm1');
				res.moduleCtrlPrivate.$dispose();
				this.notifyTestEnd("testAsyncSubModulesInit");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Validate creation and init of sub-module arrays
		 */
		testAsyncSubModulesInitArr : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl2",
				initArgs : {
					test1 : true
				}
			}, {
				fn : this._testAsyncSubModulesInitArrCb1,
				scope : this
			});
		},

		_testAsyncSubModulesInitArrCb1 : function (res) {
			try {
				this.mc2 = res.moduleCtrlPrivate;
				this.m2 = res.moduleCtrl;
				var d = this.m2.getData();
				this.assertTrue(d.count2 == 0);
				this.m2.incrementCount2(); // no callback passed here
				this.assertTrue(d.count2 == 1);

				this.m2.incrementCount2({
					by : 3
				}, {
					fn : this._testAsyncSubModulesInitArrCb2,
					scope : this
				});
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		_testAsyncSubModulesInitArrCb2 : function () {
			try {
				var d = this.m2.getData();
				this.assertTrue(d.count2 == 4);

				this.assertTrue(this.mc2.pkg1.sm2.length == 3, "sub-module array available on controller");

				// sm2 is an Array
				this.assertTrue(this.m2.pkg1.sm2.length == 3);
				// sm2 sub-modules are SampleModuleCtrl and must have an incrementCount method
				this.assertTrue(this.m2.pkg1.sm2[0].incrementCount != null);
				this.assertTrue(this.m2.pkg1.sm2[2].incrementCount != null);
				this.assertTrue(this.m2.pkg1.sm2[0].getData().instanceName == "pkg1.sm2[0]");
				this.assertTrue(this.m2.pkg1.sm2[2].getData().instanceName == "pkg1.sm2[2]");

				this.assertTrue(this.m2.getData().sm1.instanceName == 'sm1');
				this.assertTrue(this.m2.getData().pkg1.sm2[0].instanceName == "pkg1.sm2[0]");
				this.assertTrue(this.m2.getData().pkg1.sm2[2].instanceName == "pkg1.sm2[2]");
				this.mc2.$dispose();
				this.notifyTestEnd("testAsyncSubModulesInitArr");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Test that private submodules are correctly supported
		 */
		testAsyncPrivateSubModules : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl2",
				initArgs : {
					test2 : true
				}
			}, {
				fn : this._testAsyncPrivateSubModulesCb,
				scope : this
			});
		},

		_testAsyncPrivateSubModulesCb : function (res) {
			try {
				var mc2 = res.moduleCtrlPrivate;
				var m2 = res.moduleCtrl;
				var d = m2.getData();
				this.assertTrue(mc2._psm != null, "private submodule existence");
				this.assertTrue(mc2._psm.getData().instanceName == "_psm", "private submodule initialization");
				this.assertTrue(m2._psm == null, "private submodule not on public interface");
				this.assertTrue(m2.getData()._psm == null, "private submodule not in data model");
				mc2.$dispose();
				this.notifyTestEnd("testAsyncPrivateSubModules");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Validate that sub-objects are supported in module public wrappers
		 */
		testAsyncSubObjectInPublicWrapper : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl2"
			}, {
				fn : this._testAsyncSubObjectInPublicWrapperCb,
				scope : this
			}, true);
		},

		_testAsyncSubObjectInPublicWrapperCb : function (res) {
			try {
				var m2 = res.moduleCtrl;
				this.assertTrue(m2.subcontroller != null, 'subobject existence');
				this.assertTrue(m2.subcontroller.samplePublicMethod != null, 'subobject public method');
				this.assertTrue(m2.subcontroller.__samplePrivateMethod == null, 'subobject private method');
				this.assertTrue(m2.subcontroller.samplePublicMethod() == 'name=subcontroller', 'subobject public method call');

				res.moduleCtrlPrivate.$dispose();
				this.notifyTestEnd("testAsyncSubObjectInPublicWrapper");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Test that calling submitJsonRequest from the module controller correctly calls the callback (with the right
		 * "this").
		 */
		testAsyncSubmitJsonRequest : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl"
			}, {
				fn : this._testAsyncSubmitJsonRequestCb,
				scope : this
			}, true);
		},

		_testAsyncSubmitJsonRequestCb : function (res) {
			try {
				var mc = res.moduleCtrlPrivate;
				this.mc = mc;
				mc.submitJsonRequestExternalCallback = {
					fn : this._submitJsonRequestCallback,
					scope : this,
					args : {
						step : 1
					}
				};

				// Reduce the default timeout for shorter tests
				aria.core.IO.defaultTimeout = 4000;

				mc.submitJsonRequest("invalidRequest", null, mc._submitJsonRequestCallback);
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Callback method for the testAsyncSubmitJsonRequest test.
		 */
		_submitJsonRequestCallback : function (params, args) {
			try {
				var mc = this.mc;
				var req = params.req;
				this.assertTrue(req.error != null);
				if (args.step == 1) {
					mc.submitJsonRequestExternalCallback = {
						fn : this._submitJsonRequestCallback,
						scope : this,
						args : {
							step : 2
						}
					};
					mc.submitJsonRequest("invalidRequest", null, "_submitJsonRequestCallback");
				} else if (args.step == 2) {
					mc.submitJsonRequestExternalCallback = {
						fn : this._submitJsonRequestCallback,
						scope : this,
						args : {
							step : 3
						}
					};
					mc.submitJsonRequest("invalidRequest", null, {
						fn : mc._submitJsonRequestCallback,
						args : "ok"
					});
				} else if (args.step == 3) {
					this.assertTrue(params.args == "ok");
					mc.submitJsonRequestExternalCallback = {
						fn : this._submitJsonRequestCallback,
						scope : this,
						args : {
							step : 4
						}
					};
					mc.submitJsonRequest("invalidRequest", null, {
						fn : "_submitJsonRequestCallback",
						args : "ok"
					});
				} else if (args.step == 4) {
					this.assertTrue(params.args == "ok");
					mc.$dispose();

					// Put back the original timeout
					aria.core.IO.defaultTimeout = aria.core.IO.classDefinition.$prototype.defaultTimeout;

					this.notifyTestEnd("testAsyncSubmitJsonRequest");
				}
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}

		},

		/**
		 * Test load submodule method, and test that session is given to submodules
		 */
		testAsyncLoadSubModules : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl"
			}, {
				fn : this._testLoadSubModulesParentCreationCallback,
				scope : this
			});
		},

		/**
		 * Callback for the testLoadSubModules method
		 * @protected
		 * @param {Object} res description of module controller loaded
		 */
		_testLoadSubModulesParentCreationCallback : function (res) {
			try {
				var parentModuleCtrl = res.moduleCtrlPrivate;
				parentModuleCtrl.setSession({
					id : "TOTO"
				});
				this._checksInInitDone = false;
				parentModuleCtrl.loadSubModules([{
							refpath : "subData",
							classpath : "test.aria.templates.test.SampleModuleCtrl",
							initArgs : {
								callbackInInit : {
									fn : this._checksInSubModuleInit,
									scope : this
								}
							}
						}], {
					fn : this._testLoadSubModulesSubModuleLoaded,
					scope : this,
					args : parentModuleCtrl
				});
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Called from the init method of the submodule
		 * @param {aria.templates.ModuleCtrl} subModulePrivate reference to the sub-module controller
		 */
		_checksInSubModuleInit : function (subModulePrivate) {
			try {
				this._checksInInitDone = true;
				// necessary for PTR 05340621
				var session = subModulePrivate.getSession();
				this.assertTrue(session && session.id == "TOTO", "session not forwarded to submodule early enough (should be available in init method)");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},

		/**
		 * Callback when submodules are loaded
		 * @protected
		 * @param {Object} loadReport
		 * @param {Object} parentModuleCtrl
		 */
		_testLoadSubModulesSubModuleLoaded : function (loadReport, parentModuleCtrl) {
			try {
				var parentData = parentModuleCtrl.getData();
				var parentModuleCtrlPublic = parentModuleCtrl.$publicInterface();
				var subModule = parentModuleCtrl.subData;
				this.assertTrue(loadReport.subModules[0] == subModule);
				this.assertTrue(parentModuleCtrlPublic.subData == subModule);
				this.assertTrue(parentData.subData.count === 0, "Data not forwarded to parent module");
				this.assertTrue(subModule.getSession() && subModule.getSession().id == "TOTO", "session not forwarded to submodule");
				this.assertTrue(this._checksInInitDone, "_checksInSubModuleInit was not called");
				this.assertTrue(parentModuleCtrl._smList.length == 1, "List of subModules should contain 1 sub module.");

				// test event
				var test = 0;
				parentModuleCtrl.$on({
					"testEvent" : function () {
						test++;
					},
					scope : this
				});
				subModule.raiseTestEvent();
				this.assertTrue(test == 1, "Event was not caught by parent module");

				// test disposeSubModule:
				parentModuleCtrl.disposeSubModule(subModule);
				this.assertTrue(parentModuleCtrlPublic.subData == null, "sub-module reference was not properly removed in public interface");
				this.assertTrue(parentModuleCtrl.subData == null, "sub-module reference was not properly removed in whole object");
				this.assertTrue(parentData.subData == null, "sub-module reference was not properly removed in the data model");
				this.assertTrue(parentModuleCtrl._smList.length == 0, "List of subModules should not contain any sub module.");

				parentModuleCtrl.$dispose();

				this.notifyTestEnd("testAsyncLoadSubModules");
			} catch (ex) {
				this.handleAsyncTestError(ex);
			}
		},
		/**
		 * Worker function to test all the position of callback params for Object|Array types
		 */
		_testModuleCtrlCallback : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.templates.test.SampleModuleCtrl"
			}, {
				fn : this.__ResultDefaultObject,
				scope : this
			});
		},

		__ResultDefaultObject : function (res, a) {
			var m = res.moduleCtrl;
			var mc = res.moduleCtrlPrivate;
			var domWrap = new aria.templates.DomElementWrapper(this.outObj);
			var evt;
			this.outObj.testArea.onclick = function (e) {
				evt = e;
			}
			this.outObj.testArea.click();

			var evtWrap = new aria.templates.DomEventWrapper(evt);
			var args = {
				fn : "eventCallBack",
				scope : m,
				resIndex : 2,
				args : [1, 2, 3]
			};
			var handlerCBInstance = new aria.utils.Callback(args);
			var cbArgs = handlerCBInstance.call(evtWrap);

			this.assertTrue(cbArgs[2] == evtWrap, "Failed to set the argument in order!!!");

			mc.$dispose();
			this.notifyTestEnd("testModuleCtrlCallback");
		}


	}
});
