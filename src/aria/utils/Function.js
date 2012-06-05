/**
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
 * Utils for javascript functions
 */
Aria.classDefinition({
	$classpath : 'aria.utils.Function',
	$singleton : true,
	$prototype : {

		/**
		 * Bind a function to a particular context. As a consequence, in the function 'this' will correspond to the
		 * context. Additional arguments will be prepend to the arguments of the binded function
		 * @param {Function} fn
		 * @param {Object} context
		 * @return {Function}
		 */
		bind : function (fn, context) {
			var args = [];
			for (var i = 2; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			return function () {
				// need to make a copy each time
				var finalArgs = args.slice(0);
				// concat won't work, as arguments is a special array
				for (var i = 0; i < arguments.length; i++) {
					finalArgs.push(arguments[i]);
				}
				return fn.apply(context, finalArgs);
			};
		},

		/**
		 * Put on destination object functions from source object, keeping the source object as scope for these
		 * functions
		 * @param {Object} src source object
		 * @param {Object} dest destination object
		 * @param {Array} fnNames list of function names
		 * @param {String} optional string prefix for functions on the target object
		 */
		wrapObjectFn : function (src, dest, fnNames, prefix) {
			if (!prefix) {
				prefix = '';
			}
			for (var index = 0, l = fnNames.length; index < l; index++) {
				var key = fnNames[index];
				dest[prefix + key] = this.bind(src[key], src);
			}
		},

		/**
		 * Create a function from a callback object. When the function is called, the callback is called. The first parameter in the callback is the argument array given to the function.
		 * @param {aria.core.JsObject.Callback} cb
		 * @return {Function}
		 */
		bindCallback : function (cb) {
			cb = this.$normCallback(cb);
			return function () {
				cb.fn.call(cb.scope, arguments, cb.args);
			};
		}

	}
});