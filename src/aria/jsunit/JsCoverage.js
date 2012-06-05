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
 * Handles the informations regarding JsCoverage
 */
Aria.classDefinition({
	$classpath : "aria.jsunit.JsCoverage",
	$singleton : true,
	$dependencies : ["aria.utils.Function", "aria.jsunit.JsCoverageObject", "aria.jsunit.JsCoverageReport",
			"aria.jsunit.JsCoverageStore"],
	$constructor : function () {
		/**
		 * Array of jscoverage objects extracted, from the main jscoverage data
		 * @type Array
		 */
		this.jsCoverageObjects = [];

		/**
		 * Set of filters that can be used to monitor only certain classes
		 * @type Array
		 */
		this.filters = [];

		/**
		 * Renderer/Reporter for the jsCoverage singleton
		 * @private
		 * @type aria.jsunit.JsCoverageReport
		 */
		this._reporter = new aria.jsunit.JsCoverageReport({
			jsCoverage : this
		});

		/**
		 * @type aria.jsunit.JsCoverageStore
		 */
		this.jsCoverageStore = new aria.jsunit.JsCoverageStore();
	},

	$destructor : function () {
		this._reporter.$dispose();
		this.jsCoverageStore.$dispose();
		for (var i = 0, len = this.jsCoverageObjects; i < len; i += 1) {
			this.jsCoverageObjects[i].$dispose();
		}
	},

	$prototype : {
		/**
		 * @return {Array}
		 */
		extractData : function () {
			var linesCount = 0;
			var coveredLinesCount = 0;

			var data = Aria.$global._$jscoverage;
			if (!data) {
				return;
			}

			for (var filename in data) {
				if (!data.hasOwnProperty(filename)) {
					continue;
				}
				var jsCoverageObject = new aria.jsunit.JsCoverageObject({
					data : data[filename],
					filename : filename
				});
				var isValid = this.isCoverageObjectValid(jsCoverageObject);
				if (isValid) {
					linesCount += jsCoverageObject.linesCount;
					coveredLinesCount += jsCoverageObject.coveredLinesCount;
					this.jsCoverageObjects.push(jsCoverageObject);
				}
			}
			this.linesCount = linesCount;
			this.coveredLinesCount = coveredLinesCount;
			return this.jsCoverageObjects;
		},

		addFiltersFromString : function (filterParameter) {
			var filterFunction = function (filterString, jsCoverageObject) {
				var filename = jsCoverageObject.filename.toLowerCase();
				var isPositiveFilter = filter.indexOf("-") != 0;
				if (filename.indexOf(filterString) != -1) {
					return isPositiveFilter;
				}
				return !isPositiveFilter;
			};

			var filters = filterParameter.split(",");

			for (var i = 0, l = filters.length; i < l; i++) {
				var filter = filters[i];
				var boundFilter = aria.utils.Function.bind(filterFunction, this, filter)
				this.addFilter(boundFilter);
			}
		},
		/**
		 * Automatically generate the filters from the query string The filters are expected to be in the filters URL
		 * parameter, comma separated, with a minus sign to invert the filtering logic Filters are NOT case sensitive
		 * Example : filters=util,-math,-bridge
		 */
		addFiltersFromQueryString : function () {
			var qs = aria.utils.QueryString;
			var filterParameter = qs.getKeyValue("filter");

			if (!aria.utils.Type.isString(filterParameter)) {
				return;
			}
			this.addFiltersFromString(filterParameter);
		},

		/**
		 * Add a new filter function to the set of filters used in this jsCoverage
		 * @param {Function} filterFunction : function taking a jsCoverageObject in argument and returning a boolean
		 */
		addFilter : function (filterFunction) {
			this.filters.push(filterFunction);
		},

		/**
		 *
		 */
		reset : function () {
			this.filters = [];
			this.jsCoverageObjects = [];
		},

		/**
		 * Given the current set of filters applied to this JsCoverage Decide whether or not a JsCoverageObject should
		 * be filtered or not
		 */
		isCoverageObjectValid : function (jsCoverageObject) {
			var isCoverageObjectValid = true;

			var filters = this.filters;
			for (var i = 0, l = filters.length; i < l; i++) {
				var filter = filters[i];
				if (!filter(jsCoverageObject)) {
					isCoverageObjectValid = false;
				}
			}
			return isCoverageObjectValid;
		},

		/**
		 *
		 */
		refresh : function (filterParameter) {
			this.filters = [];
			this.jsCoverageObjects = [];
			this.addFiltersFromString(filterParameter);
			this.extractData();
			this._reporter.refreshReport();
		},

		/**
		 * Retrieve the report generated for this JsCoverage
		 */
		getReport : function () {
			return this._reporter.getReport.apply(this._reporter, arguments);
		},

		getReportForEmail : function () {
			return this._reporter.getReport(true);
		},

		getFilesCount : function () {
			return this.jsCoverageObjects.length;
		},

		getLinesCount : function () {
			return this.linesCount;
		},
		/**
		 * Retrieve the percentage of coverage
		 * @return {Number} the coverage [0,100]
		 */
		getCoverage : function () {
			return Math.floor((this.coveredLinesCount / this.linesCount) * 100);
		},

		/**
		 * Store the results of the jscoverage campaign using a JsCoverageStore
		 */
		store : function (options) {
			this.jsCoverageStore.store(options);
		}
	}
});