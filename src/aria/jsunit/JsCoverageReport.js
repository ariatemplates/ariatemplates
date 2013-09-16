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
 * Generate an HTML report from the data contained in an instance of aria.jsunit.JsCoverage
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.JsCoverageReport",
    $singleton : false,
    $constructor : function (conf) {
        this.jsCoverage = conf.jsCoverage || {};
        /**
         * @private
         * @type HTMLElement
         */
        this._reportContainer = null;
    },
    $prototype : {
        /**
         * @param {Boolean} toEmail : indicates if the output will be used in an email or not
         * @return {String} HTML report as a string
         */
        getReport : function (toEmail) {
            var coverage = parseInt(this.jsCoverage.getCoverage(), 10);

            var linesCount = this.jsCoverage.getLinesCount();
            var filesCount = this.jsCoverage.getFilesCount();

            var baseUrl = this.jsCoverage.jsCoverageStore.getBaseReportsURL();

            var coverageLink = "<a href='" + baseUrl + "jscoverage.html' target='_blank'>" + "Global Coverage" + "</a>";

            var markupArray = ["<h2>JsCoverage report</h2><br>",
                    "<table style='border-collapse: collapse;font-size: small;'>", "<tbody>"];

            if (toEmail) {
                markupArray.push("<tr><td width='350px'><strong>" + coverageLink + "</strong> (on " + filesCount
                        + " files and " + linesCount + " lines)</td>", "<td><strong>", coverage, "%<strong></td>", '<td width="100px"><table><tbody><tr>', '<td bgcolor="lime" width="'
                        + coverage + 'px"/>', '<td bgcolor="red" width="' + (100 - coverage) + 'px"/>', '</tr></tbody></table></td></tr><br>');
            } else {
                markupArray.push("<tr>", "<td><strong>" + coverageLink + "</strong> (on " + filesCount + " files and "
                        + linesCount + " lines)</td>", '<td><strong>', coverage, '%</td>', '<td style="float: right;margin-right: 5px;">', '<div style="background-color: #E00000;border: 1px solid #000000;float: right;height: 10px;margin-top: 4px;overflow: hidden;width: 100px;">', '<div style="background-color: #00F000;height: 10px;width: '
                        + coverage + 'px;"></div>', '</div>', '</td>', "</tr>");
            }

            markupArray.push("</tbody>", "</table>");

            return markupArray.join("");
        },

        /**
         * Create the DOM element displaying the actual JsCoverage report
         * @private
         */
        _createJsCoverageReport : function () {
            var document = Aria.$window.document;
            var _reportContainer = document.createElement("div");

            _reportContainer.id = "jsCoverageTableContainer";

            _reportContainer.style.cssText = ["background-color: white", "border: 3px solid Grey", "top: 100px",
                    "bottom: 100px", "left: 295px", "overflow-y: auto", "padding: 0 10px 10px", "position: absolute",
                    "width: 600px", "z-index: 1"].join(";");

            document.body.appendChild(_reportContainer);

            this._reportContainer = _reportContainer;

            this.refreshReport();
        },

        /**
         * Make the JsCoverage report container visible This method might be called as soon as the test is completed.
         * (necessary DOM elements will be created automatically if needed)
         */
        showReport : function () {
            if (!this._reportContainer) {
                this._createJsCoverageReport();
            }
            this._reportContainer.style.display = "block";
        },

        /**
         * Refresh the content of the report. To be called if anything changed in the JsCoverage instance represented by
         * this reporter (such as filters)
         */
        refreshReport : function () {
            if (!this._reportContainer) {
                this._createJsCoverageReport();
            }
            var jsCoverageReport = this.getReport();
            this._reportContainer.innerHTML = jsCoverageReport;
        },

        /**
         * Hide the JsCoverage report container
         */
        hideReport : function () {
            if (!this._reportContainer) {
                this._createJsCoverageReport();
            }
            this._reportContainer.style.display = "none";
        }
    }
});
