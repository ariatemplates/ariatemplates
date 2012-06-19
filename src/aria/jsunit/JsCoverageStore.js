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
 * Store for coverage reports
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.JsCoverageStore",
    $dependencies : ["aria.utils.Date", "aria.core.Browser"],
    $statics : {
        baseReportsURL : "http://aria/jscoverage-reports/",
        baseStoreURL : "http://aria/jscoverage-store/"
    },
    $constructor : function () {
        /**
         * The timestamp for the current test, which will be used to store the results
         * @type String
         */
        this.reportDate = aria.utils.Date.format(new Date(), "yyyy'_'MM'_'dd'_'hh'_'mm'_'ss");

        /**
         * URL "suffix" describing the current report
         * @type String
         */
        this._urlSuffix = aria.core.Browser.name.toLowerCase() + "/" + this.reportDate + "/";
    },
    $destructor : function () {},
    $prototype : {
        /**
         * Send all the JsCoverage reports to the jscoverage server
         * @param {Object} options
         */
        store : function (options) {
            this.storeReport();
            if (options.callback) {
                options.callback.fn.call(options.callback.scope);
            }
        },

        /**
         * Store the Js Coverage report on the server. They are stored in browser specific folders. The latest coverage
         * is always accessible at http://aria/jscoverage-reports/${browsername}/latest
         */
        storeReport : function () {
            var url = this.getBaseStoreURL();
            var jsonReport = this.getJSONReport();
            this.sendJSONReport(jsonReport, url);
        },

        /**
         * @return {String}
         */
        getBaseStoreURL : function () {
            return this.baseStoreURL + this._getURLSuffix();
        },

        /**
         * @return {String}
         */
        getBaseReportsURL : function () {
            return this.baseReportsURL + this._getURLSuffix();
        },

        /**
         * Retrieve a URL "suffix" describing the current report, based on the browser name, and the test date This
         * suffix should then be used both to store and retrieve the JSCoverage report
         * @return {String}
         * @protected
         */
        _getURLSuffix : function () {
            return this._urlSuffix;
        },

        /**
         * Send a Js Coverage report as JSON
         * @param {String} The report as a javascript object
         * @param {String} URL of the jscoverage-store service. Defaults to http://aria/jscoverage-store/
         */
        sendJSONReport : function (jsonReport, url) {
            var createRequest = function () {
                if (Aria.$global.XMLHttpRequest) {
                    return new Aria.$global.XMLHttpRequest();
                } else if (Aria.$global.ActiveXObject) {
                    return new Aria.$global.ActiveXObject("Microsoft.XMLHTTP");
                }
            };

            var request = createRequest();

            request.open("POST", url, false);
            request.setRequestHeader("Content-Type", "application/json");
            request.setRequestHeader("Content-Length", jsonReport.length.toString());
            request.send(jsonReport);

            if (request.status === 200 || request.status === 201 || request.status === 204) {
                return request.responseText;
            } else {
                throw request.status;
            }
        },

        /**
         * Return JSON representation of a report
         * @return String
         */
        getJSONReport : function () {
            var pad = function (s) {
                return "0000".substr(s.length) + s;
            };
            var quote = function (s) {
                return "\"" + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
                    switch (c) {
                        case "\b" :
                            return "\\b";
                        case "\f" :
                            return "\\f";
                        case "\n" :
                            return "\\n";
                        case "\r" :
                            return "\\r";
                        case "\t" :
                            return "\\t";
                        case "\"" :
                            return "\\\"";
                        case "\\" :
                            return "\\\\";
                        default :
                            return "\\u" + pad(c.charCodeAt(0).toString(16));
                    }
                }) + "\"";
            };
            var json = [];
            var jscov = Aria.$global._$jscoverage;
            if (jscov) {
                for (var file in jscov) {
                    if (!jscov.hasOwnProperty(file)) {
                        continue;
                    }
                    var coverage = jscov[file];
                    var array = [];
                    var length = coverage.length;
                    for (var line = 0; line < length; line++) {
                        var value = coverage[line];
                        if (value === undefined || value === null) {
                            value = "null";
                        }
                        array.push(value);
                    }
                    var source = coverage.source;
                    var lines = [];
                    length = source.length;
                    for (var line = 0; line < length; line++) {
                        lines.push(quote(source[line]));
                    }
                    json.push(quote(file)
                            + (":{\"coverage\":[" + array.join(",") + "],\"source\":[" + lines.join(",") + "]}"));
                }
            }
            json = "{" + json.join(",") + "}";
            return json;
        }
    }
});
