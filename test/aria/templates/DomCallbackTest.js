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
 * DomCallback test class
 */
Aria.classDefinition({
	$classpath : 'test.aria.templates.DomCallbackTest',
	$extends : 'aria.jsunit.TestCase',
	$dependencies : ['aria.templates.DomCallback'],
	$prototype : {
		/**
		 * Callback function. It changes its args parameter so that it is possible to check
		 * the correct call of this method in testDomCallback.
		 * @private
		 */
		_myCallback : function (res, args) {
			args.res.push(res);
			args.scope = this;
		},

		/**
		 * Create a DomCallback object, returns its javascript code to call it,
		 * eval it and check it calls the function properly.
		 * Also check that the callback is not called anymore after the dispose.
		 */
		testDomCallback : function () {
			var args = {
				res: []
			};
			var myCallback = new aria.templates.DomCallback({
				scope : this,
				args : args,
				fn : this._myCallback
			});
			var jscode = myCallback.getJavascriptCode("{value:2}");
			this.assertTrue(typeof(jscode)=="string");
			this.assertTrue(args.res.length==0);
			this.assertTrue(args.res.scope==null);

			// check that the function can be called several times
			Aria.eval(jscode);
			this.assertTrue(this==args.scope);
			this.assertTrue(args.res.length==1);
			this.assertTrue(args.res[0].value==2);
			args.res=[];
			args.scope=null;

			Aria.eval(jscode);
			this.assertTrue(args.res.length==1);
			this.assertTrue(args.res[0].value==2);
			args.res=[];
			args.res=[];
			args.scope=null;

			// check that the function is no longer called after dispose
			myCallback.$dispose();
			Aria.eval(jscode);
			this.assertTrue(args.res.length==0);
			this.assertTrue(args.res.scope==null);
		}
	}
});