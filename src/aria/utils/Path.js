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
 * Utility to handle JSON path. NOTE: this could be extended to support XPath like queries
 * @class aria.utils.Path
 */
Aria.classDefinition({
	$classpath : 'aria.utils.Path',
	$dependencies : ['aria.utils.String'],
	$singleton : true,
	$constructor : function () {},
	$statics : {
		// ERROR MESSAGES:
		WRONG_PATH_SYNTAX : "Syntax for path %1 is not valid. Note that variables cannot be used in paths.",
		RESOLVE_FAIL : "Resolve for path %1 failed, root element does not contain this path"
	},
	$prototype : {

		/**
		 * Resolve a path inside an object, and return result
		 * @param {String|Array} path. If a string, will parse it. If Array, specifies the suite of parameters to
		 * follow.
		 * @param {Object} inside. If not specified, window is used.
		 */
		resolve : function (path, inside) {
			if (aria.utils.Type.isString(path)) {
				path = this.parse(path);
			}
			if (aria.utils.Type.isArray) {
				for (var index = 0, param, len = path.length; index < len; index++) {
					param = path[index];
					inside = inside[param];
					if (!inside && index != len - 1) {
						throw {
							error : this.RESOLVE_FAIL,
							args : [path],
							object : inside
						};
					}
				}
				return inside;
			}
			throw {
				error : this.RESOLVE_FAIL,
				args : [path],
				object : inside
			};
		},

		/**
		 * Parse a string path and return parameter suite in an array
		 * @param {String} path, like obj.param1[0]["param2"]
		 * @return {Array}
		 */
		parse : function (path) {
			return this._paramParse("." + path);
		},

		/**
		 * Parse parameters in path
		 * @protected
		 * @param {String} path, like .param1[0]["param2"]
		 * @return {Array}
		 */
		_paramParse : function (path) {
			// edge case
			if (!path) {
				return [];
			}

			// first letter will give the type
			var first = path.charAt(0), closing, part, next, nextParse;

			// case brackets
			if (first == "[") {
				closing = path.indexOf("]");
				if (closing != -1) {
					part = path.substring(1, closing);
					next = path.substring(closing + 1);
					if (/^\d+$/.test(part)) {
						nextParse = this._paramParse(next);
						nextParse.unshift(part);
						return nextParse;
					} else {
						// check that part is "something" or 'somethingelse'
						var strMarker = part.charAt(0), utilString = aria.utils.String;
						if ((strMarker == "'" || strMarker == '"')
								&& utilString.indexOfNotEscaped(part, strMarker, 1) == part.length - 1) {
							nextParse = this._paramParse(next);
							nextParse.unshift(part.substring(1, part.length - 1).replace(new RegExp("\\\\" + strMarker, "gi"), strMarker));
							return nextParse;
						}
					}
				}
			} else if (first == ".") {
				part = /^[_A-z]\w*/.exec(path.substring(1));
				if (part.length) {
					part = part[0];
					next = path.substring(part.length + 1);
					nextParse = this._paramParse(next);
					nextParse.unshift(part);
					return nextParse;
				}
			}

			// nothing returned -> throws an exception
			throw {
				error : this.WRONG_PATH_SYNTAX,
				args : [path]
			};
		},

		/**
		 * Transform an array of paths part into a path
		 * @param {Array} pathParts
		 * @return {String}
		 */
		pathArrayToString : function (pathParts) {
			var path = [pathParts[0]];
			for (var index = 1, len = pathParts.length; index < len; index++) {
				path.push("[\"" + pathParts[index].replace(/"/gi, '\\"') + "\"]");
			}
			return path.join('');
		}
	}
});