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
var Aria = require("../Aria");


/**
 * Report representation
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.TestReport",
    $singleton : false,
    $constructor : function (conf) {
        this.testRunner = conf.testRunner;
    },
    $destructor : function () {
        this.testRunner = null;
    },
    $prototype : {
        /**
         * Return HTML representation of this report
         * @return {String}
         */
        getReport : function () {
            var errors = this.testRunner.getErrors();
            var date = new Date().toLocaleString();
            var report = ['Aria templates test campaign completed<br>', date, '<br>', '<h2>Error report</h2>',
                    this.getErrorSummary(), '<ul>'].join("<br>");
            for (var i = 0, l = errors.length; i < l; i++) {
                var error = errors[i];
                var errorReport = this.getErrorReport(error);
                report += errorReport;
            }
            report += "</ul><br>";
            return report;
        },

        /**
         * Return HTML representation of errors summary
         * @return {String}
         */
        getErrorSummary : function () {
            var errors = this.testRunner.getErrors();
            var errorSummary = "";
            if (errors.length === 0) {
                errorSummary = '<b><font color="green">No test failed !</font></b>';
            } else if (errors.length === 1) {
                errorSummary = '<b>1 test failed :</b>';
            } else {
                errorSummary = '<b>' + errors.length + ' tests failed :</b>';
            }
            return errorSummary;
        },

        /**
         * Return HTML representation of an error
         * @param {Object} error
         * @return {String}
         */
        getErrorReport : function (error) {
            var messages = error.messages;
            var errorReport = '<li>' + '<a href="' + error.retryURL + '">' + error.testClass + '</a>' + '</li>'
                    + '<li> Error' + (messages.length > 1 ? 's' : '') + ' : ' + '<ul>';

            for (var j = 0, m = messages.length; j < m; j++) {
                var message = messages[j];
                errorReport += '<li>' + message + '</li>';
            }
            errorReport += '</ul></li><br>';
            return errorReport;
        },

        /**
         * Retrieve html-email header to be used when generating the mail report.
         * @return {String}
         */
        getMailHeader : function () {
            var header = '<!DOCTYPE html>'
                    + '<html>'
                    + '<head>'
                    + '<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">'
                    + '<title>Aria Templates Tests</title>'
                    + '<style>'
                    + '*{font-family: Tahoma,Arial,sans-serif;font-size:10pt;}'
                    + 'h1{font-size:14pt;} '
                    + 'h2{font-size:22pt;margin-bottom:0px;font-weight:lighter} '
                    + 'ul{line-height:1.5em;list-style-type:none;margin:0.3em 0 0 1.5em;padding:0;}'
                    + '</style>'
                    + '</head>' + '<body>';
            return header;
        },

        /**
         * @return {String}
         */
        getMailFooter : function () {
            return '<br><img src="http://ariatemplates.com/images/logo-page.png"/><br><b>Aria team</b></body></html>';
        }
    }
});
