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
 * Test case for the default module creation implementation
 */
Aria.classDefinition({
	$classpath : "test.aria.modules.urlService.URLCreationServiceTest",
	$dependencies : ["aria.modules.RequestMgr", "test.aria.modules.urlService.ModuleURLCreationImpl",
			"test.aria.modules.test.MockRequestHandler", "test.aria.modules.urlService.SearchURLCreationImpl",
			"aria.templates.ModuleCtrl"],
	$extends : "aria.jsunit.TestCase",
	$constructor : function () {
		this.$TestCase.constructor.call(this);
		this.defaultTestTimeout = 2000;
	},
	$prototype : {
		// To set the initial app environment
		setUp : function () {
			var patternAction = Aria.rootFolderPath + "${moduleName}/${actionName};jsessionid=${sessionId}";
			var patternI18n = Aria.rootFolderPath + "resources;jsessionid=${sessionId}?module=${moduleName}";
			aria.core.AppEnvironment.setEnvironment({
				urlService : {
					implementation : "aria.modules.urlService.PatternURLCreationImpl",
					args : [patternAction, patternI18n]
				}
			}, null, true);
		},
		// Does the testing for module level request
		testAsyncFromModuleLayer : function () {
			aria.templates.ModuleCtrlFactory.createModuleCtrl({
				classpath : "test.aria.modules.urlService.ModuleCtrlSample"
			}, {
				fn : this._afterModuleCreation,
				scope : this
			}, false);
		},
		_afterModuleCreation : function (args) {
			var module = args.moduleCtrlPrivate;
			this.assertFalse(!module, "Failed in module creation!");

			module.submitJsonRequest('SampleData', {}, {
				fn : this._onModuleLayerCb,
				scope : this,
				args : module
			});

		},
		_onModuleLayerCb : function (res, moduleObj) {
			try {
				// handler was used
				this.assertTrue(res.response.mockData, "Module layer failed to complete the request!");
				moduleObj.$dispose();
			} catch (ex) {
				this.handleAsyncTestError(ex, false);
			}
			this.notifyTestEnd("testAsyncModuleRequest");
		},
		// Does the testing for every individual request
		testAsyncFromRequestLayer : function () {
			var requestUrlPattern = Aria.rootFolderPath + "test/aria/modules/${moduleName}/${actionName}.xml";
			var requestHandler = new test.aria.modules.test.MockRequestHandler(this);
			var urlService = new test.aria.modules.urlService.SearchURLCreationImpl(requestUrlPattern, null);
			var req = {
				moduleName : "urlService",
				actionName : "SampleData",
				session : null,
				actionQueuing : null,
				requestHandler : requestHandler,
				urlService : urlService
			};

			// Creating a argument list to destroy
			var args = {
				requestHandler : requestHandler,
				urlService : urlService
			};
			aria.modules.RequestMgr.submitJsonRequest(req, {}, {
				fn : this._onRequestLayerCb,
				scope : this,
				args : args
			});
		},
		_onRequestLayerCb : function (res, args) {
			try {
				this.assertTrue(res.response.mockData, "Request layer failed to complete the request!");
				args.requestHandler.$dispose();
				args.urlService.$dispose();
			} catch (ex) {
				this.handleAsyncTestError(ex, false);
			}
			this.notifyTestEnd("testAsyncFromRequestLayer");
		}
	}
});