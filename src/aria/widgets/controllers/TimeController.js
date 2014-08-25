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
var Aria = require("../../Aria");
var ariaWidgetsControllersReportsControllerReport = require("./reports/ControllerReport");
var ariaUtilsDate = require("../../utils/Date");
var ariaUtilsEnvironmentDate = require("../../utils/environment/Date");
var ariaWidgetsWidgetsRes = require("../../$resources").file(__dirname, "../WidgetsRes");
var ariaWidgetsControllersTextDataController = require("./TextDataController");
var ariaUtilsType = require("../../utils/Type");


/**
 * @class aria.widgets.controllers.TimeController
 * @extends aria.widgets.controllers.TextDataController*
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.controllers.TimeController",
    $extends : ariaWidgetsControllersTextDataController,
    $resources : {
        "res" : ariaWidgetsWidgetsRes
    },
    $constructor : function () {
        this.$TextDataController.constructor.call(this);

        /**
         * Data model associated to time input
         * @type Object
         */
        this._dataModel = {
            /**
             * @type Date
             */
            jsDate : null,
            /**
             * @type String
             */
            displayText : ''
        };

        /**
         * @private Pattern used to display the time entry
         * @type String
         */
        this._pattern = '';
    },
    $destructor : function () {
        this._dataModel = null;
        this.$TextDataController.$destructor.call(this);
    },
    $prototype : {
        /**
         * Set the time pattern
         * @param {aria.widgets.CfgBeans:TimeFieldCfg} pattern options
         */
        setPattern : function (pattern) {
            if (!pattern) {
                var pattern = ariaUtilsEnvironmentDate.getTimeFormats().longFormat;
            }
            this._pattern = pattern;
        },

        /**
         * override TextDataController.checkValue
         * @param {Date} internalValue - Internal value to be validated
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkValue : function (internalValue) {
            var report = new ariaWidgetsControllersReportsControllerReport();
            report.ok = (internalValue == null || ariaUtilsType.isDate(internalValue));
            if (report.ok) {
                this._dataModel.jsDate = internalValue;
                this._dataModel.displayText = (internalValue
                        ? ariaUtilsDate.format(internalValue, this._pattern)
                        : '');
                report.text = this._dataModel.displayText;
                report.value = this._dataModel.jsDate;
            }
            return report;
        },

        /**
         * Override TextDataController.checkText
         * @param {String} text - the displayed text
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkText : function (text, hasErrors) {
            // an empty field is not usually considered as an error
            if (!text) {
                return this.checkValue(null);
            } else {
                var report = new ariaWidgetsControllersReportsControllerReport(), timeUtil = ariaUtilsDate;
                report.ok = false;

                if (text === this._dataModel.displayText) {
                    report.ok = true;
                } else {
                    var time = timeUtil.interpretTime(text);
                    if (time) {
                        this._dataModel.jsDate = time;
                        report.ok = true;
                        if (this._pattern) {
                            this._dataModel.displayText = timeUtil.format(time, this._pattern);
                            report.text = this._dataModel.displayText;
                            report.value = this._dataModel.jsDate;
                        }
                    } else {
                        report.errorMessages[0] = this.res.errors["40007_WIDGET_TIMEFIELD_VALIDATION"];
                    }
                }
            }
            return report;
        },

        /**
         * Public method that converts a time to the pattern configured for this instance
         * @param {Date} time
         * @return {String}
         */
        getDisplayTextFromValue : function (time) {
            return (time && ariaUtilsType.isDate(time)) ? ariaUtilsDate.format(time, this._pattern) : "";
        }

    }
});
