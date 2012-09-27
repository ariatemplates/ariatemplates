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
 * Mock for async request with 100ms delay
 * @class test.aria.core.mock.IOMock
 */
Aria.classDefinition({
	$classpath : 'test.aria.core.mock.IOMock',
	$singleton : true,
	$constructor : function () {},
	$prototype : {

		/**
		 * Perform an asynchronous request to the server Note: callback is always called in an asynchronous way (even in
		 * case of errors)
		 * @param {Object} req the request description [req] { url:"myfile.txt", // absolute or relative URL method:
		 * "POST", // POST or GET (default) urlParams:[], // TODO postData: "", // {String} null by default timeout:
		 * 1000, // {Integer} timeout in ms - default: DEFAULT_TIMEOUT callback: { fn:obj.method, // mandatory
		 * scope:obj, // mandatory onerror:obj2.method2 // callback error handler - optional - default: Timer error log
		 * onerrorScope:obj2 // optional - default: Timer or scope if onError is provided args:{x:123} // optional -
		 * default: null } } When a response is received, the callback function is called with the following arguments:
		 * cb(asyncRes,cbArgs) where: [asyncRes] { url:"", status:"", responseText:"", responseXML:xmlObj, error:"" //
		 * error description } and cbArgs == args object in the req object
		 * @return {Integer} a request id
		 */
		asyncRequest : function (req) {
			var cb = req.callback;
			setTimeout(function () {
				cb.fn.call(cb.scope, {}, cb.args);
			}, 100);
		}
	}
});