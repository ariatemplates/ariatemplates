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
(function () {
	var console = Aria.$global.console;
	/**
	 * @class aria.core.log.DefaultAppender Default appender used by the logger to output log lines. The default
	 * appender is using Firebug/Firebug lite to log (or in fact, any console that defines the window.console object).
	 * Other appenders can be written by extending this default class in order to output elsewhere.
	 */
	Aria.classDefinition({
		$classpath : 'aria.core.log.DefaultAppender',
		$constructor : function () {},
		$prototype : console ? {
			/**
			 * Output the first part of the string corresponding to the classname in the log
			 * @param {String} className
			 * @return {String} The formatted classname
			 * @private
			 */
			_formatClassName : function (className) {
				return "[" + className + "] ";
			},

			/**
			 * Inspect an object in a log
			 * @param {Object} o the object to inspect
			 * @private
			 */
			_inspectObject : function (o) {
				if (o && typeof o == "object" && console.dir) {
					console.dir(o);
				}
			},

			/**
			 * Debug
			 * @param {String} className
			 * @param {String} msg The message text (including arguments)
			 * @param {String} msgText The message text (before arguments were replaced)
			 * @param {Object} o An optional object to be inspected
			 */
			debug : function (className, msg, msgText, o) {
				if (console.debug) {
					console.debug(this._formatClassName(className) + msg);
				} else if (console.log) {
					console.log(this._formatClassName(className) + msg);
				}
				this._inspectObject(o);
			},

			/**
			 * Info
			 * @param {String} className
			 * @param {String} msg The message text (including arguments)
			 * @param {String} msgText The message text (before arguments were replaced)
			 * @param {Object} o An optional object to be inspected
			 */
			info : function (className, msg, msgText, o) {
				if (console.info) {
					console.info(this._formatClassName(className) + msg);
				} else if (console.log) {
					console.log(this._formatClassName(className) + msg);
				}
				this._inspectObject(o);
			},

			/**
			 * Warn
			 * @param {String} className
			 * @param {String} msg The message text (including arguments)
			 * @param {String} msgText The message text (before arguments were replaced)
			 * @param {Object} o An optional object to be inspected
			 */
			warn : function (className, msg, msgText, o) {
				if (console.warn) {
					console.warn(this._formatClassName(className) + msg);
				} else if (console.log) {
					console.log(this._formatClassName(className) + msg);
				}
				this._inspectObject(o);
			},

			/**
			 * Error
			 * @param {String} className
			 * @param {String} msg The message text (including arguments)
			 * @param {String} msgText The message text (before arguments were replaced)
			 * @param {Object} e The exception to format
			 */
			error : function (className, msg, msgText, e) {
				var message = this._formatClassName(className) + msg;
				if (e) {
					console.error(message + "\n", e);
				} else {
					console.error(message);
				}
			},

			/**
			 * Format an exception object
			 * @param {Object} e The exception to format
			 * @param {Boolean} html Is the message going to be shown as HTML or not
			 * @return {String} The message ready to be shown
			 * @private
			 */
			_formatException : function (e, html) {
				var str = "";

				if (typeof e == 'undefined' || e == null) {
					return "";
				}
				var cr = html ? "<br />" : "\n";

				str = "Exception";
				str += cr + '---------------------------------------------------';
				if (e.fileName) {
					str += cr + 'File: ' + e.fileName;
				}
				if (e.lineNumber) {
					str += cr + 'Line: ' + e.lineNumber;
				}
				if (e.message) {
					str += cr + 'Message: ' + e.message;
				}
				if (e.name) {
					str += cr + 'Error: ' + e.name;
				}
				if (e.stack) {
					str += cr + 'Stack:' + cr + e.stack.substring(0, 200) + " [...] Truncated stacktrace.";
				}
				str += cr + '---------------------------------------------------' + cr;

				return str;
			}
		} : {
			debug : function () {},
			info : function () {},
			warn : function () {},
			error : function () {}
		}
	});
})();