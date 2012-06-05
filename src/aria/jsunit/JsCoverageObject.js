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
	/**
	 * Simple class to extract the information provided by the files instrumented by jscoverage-server.
	 * 
	 * Documentation on JsCoverage available at http://siliconforks.com/jscoverage/manual.html
	 * 
	 * This wrapper can be used to easily process raw JsCoverage data, and then make the data easier to use.
	 * 
	 * @class aria.jsunit.JsCoverageObject description
	 * @extends aria.core.JsObject
	 */
	var classDefinition = {
		$classpath : 'aria.jsunit.JsCoverageObject',
		$singleton : false,
		$statics : {
			sort : function (o1, o2) {
				var filename1 = o1.filename.toLowerCase(), filename2 = o2.filename.toLowerCase();
				if (filename1 > filename2) {
					return 1;
				} else if (filename1 == filename2) {
					return 0;
				}
				return -1;
			}
		},
		$dependencies : [],
		$constructor : function (conf) {
			/**
			 * Filename (from the static root) "/aria-templates-dev/dev/aria/jsunit/JsCoverageObject.js"
			 * @type String
			 */
			this.filename = conf.filename || "";

			/**
			 * Pre-highlighted sourced. Highlight is done by JsCoverage
			 * @type String
			 */
			this.source = conf.source || "";

			/**
			 * Name of the class contained in the intrumented file (extracted from the source)
			 * "aria.jsunit.JsCoverageObject"
			 * @type String
			 */

			this.classname = conf.classname || "";

			/**
			 * Total number of monitored lines. JsCoverages leaves comments and blank lines out of the monitoring
			 * @type Number
			 */
			this.linesCount = conf.linesCount || 0;

			/**
			 * Total number of monitored lines that were executed
			 * @type Number
			 */
			this.coveredLinesCount = conf.coveredLinesCount || 0;

			/**
			 * Raw data used to initialize the jsCoverage object
			 * @protected
			 * @type Object
			 */
			this._data = conf.data;

			if (this._data) {
				this.init(this._data);
			}
		},
		$destructor : function () {},
		$prototype : {
			/**
			 * Instance initialization
			 * @param {Object} data
			 */
			init : function (data) {
				this.source = data.source;

				var linesCount = 0;
				var coveredLinesCount = 0;

				for (var i in data) {
					if (i == "source") {
						continue;
					}
					linesCount++;
					if (data[i] > 0) {
						coveredLinesCount++;
					}
				}
				this.linesCount = linesCount;
				this.coveredLinesCount = coveredLinesCount;
			},

			/**
			 * Strig representation
			 * @return {String}
			 */
			toString : function () {
				return (this.classname || this.filename) + " : " + this.getCoverage() + "%"
			},

			/**
			 * Retrieve the coverage (in %) of the file described by this JsCoverageData object Coverage in
			 * @return {Number}
			 */
			getCoverage : function () {
				return Math.floor((this.coveredLinesCount / this.linesCount) * 100);
			}
		}
	};
	Aria.classDefinition(classDefinition);
})();
