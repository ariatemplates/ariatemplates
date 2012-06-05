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
 * Utils for general Objects/Map
 * @class aria.utils.Object
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
	$classpath : "aria.utils.Object",
	$singleton : true,
	$constructor : function () {},
	$prototype : {
		/**
		 * Returns an array of all own enumerable properties found upon a given object, in the same order as that provided by a for-in loop.
		 * @public
		 * @param {Object} object
		 * @return {Array}
		 */
		keys : (Object.keys) ? function (object) {
			if (!aria.utils.Type.isObject(object)) {
				return [];
			}

			return Object.keys(object);
		} : function (object) {
			if (!aria.utils.Type.isObject(object)) {
				return [];
			}
			var enumKeys = [];
			for (var key in object) {
				if (object.hasOwnProperty(key)) {
					enumKeys.push(key);
				}
			}
			return enumKeys;
		},

		/**
		 * Returns true if the object has no own enumerable properties
		 * @public
		 * @param {Object} object
		 * @return {Boolean}
		 */
		isEmpty : function (object) {
			var keys = this.keys(object);
			return (keys.length == 0) ? true : false;
		}
	}
});