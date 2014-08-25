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
var Aria = require("../../../Aria");
var ariaUtilsDom = require("../../../utils/Dom");
var ariaUtilsJson = require("../../../utils/Json");


// Appenders should implement an interface
// And the type of the <report> object passed to the append method should be documented in a bean
// For now, we only have one appender anyway
/**
 * Appender that will output the report as a JSON string inside a hidden DIV so that browser drivers such as Selenium
 * can retrieve it
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.tester.runner.appenders.JsonTextDivAppender",
    $statics : {
        REPORT_DIV_ID : 'testReport'
    },
    $prototype : {
        _destroyReportDiv : function () {
            var div = ariaUtilsDom.getElementById(this.REPORT_DIV_ID);
            if (div) {
                div.parentNode.removeChild(div);
            }
        },
        _createReportDiv : function (content) {
            var div = ariaUtilsDom.getElementById(this.REPORT_DIV_ID);
            if (!div) {
                var document = Aria.$window.document;
                div = document.createElement("DIV");
                div.id = this.REPORT_DIV_ID;
                div.style.display = "none";
                div.innerHTML = content;
                document.body.appendChild(div);
            }
        },
        /**
         * Append the report
         * @param {Object} report
         */
        append : function (report) {
            this._destroyReportDiv();
            this._createReportDiv(ariaUtilsJson.convertToJsonString(report));
        }
    }
});
