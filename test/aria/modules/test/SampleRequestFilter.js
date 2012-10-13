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
 * Simple RequestFilter class used for unit tests
 */
Aria.classDefinition({
	$classpath : "test.aria.modules.test.SampleRequestFilter",
	$extends : "aria.core.IOFilter",
	$constructor : function (arg) {
		this.$IOFilter.constructor.call(this, arg);
		this.testCase = null;
		if (arg) {
			this.initTxt = arg.txt;
			this.testCase = arg.testCase;
		}
	},
	$destructor : function () {
		this.testCase = null;
		this.$IOFilter.$destructor.call(this);
	},
	$prototype : {

		/**
		 * Method called before a request is sent to get a chance to change its arguments
		 * @param {aria.modules.RequestMgr.FilterRequest} req
		 */
		onRequest : function (req) {
			// For test purpose only
			req.url = Aria.rootFolderPath + "test/aria/modules/test/SampleResponse.xml";
			req.method = "GET";
			var rObj = req.sender.requestObject;
			if (this.testCase) {
				this.testCase.__requestPath = rObj.moduleName + "/" + rObj.actionName;
			};
		},

		/**
		 * Method called when a response is received to change the result values before the RequestMgr callback is
		 * called
		 * @param {aria.modules.RequestMgr.FilterResponse} res
		 */
		onResponse : function (request) {
			var res = request.res;
			// For test purpose only
			if (this.testCase) {
				this.testCase.__responseData = res.responseXML.documentElement.tagName;
			}
		}

	}
});