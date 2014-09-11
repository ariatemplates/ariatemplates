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
var ariaUtilsType = require("../../utils/Type");
var ariaUtilsEnvironmentDate = require("../../utils/environment/Date");
var ariaWidgetsWidgetsRes = require("../../$resources").file(__dirname, "../WidgetsRes");
var ariaWidgetsControllersTextDataController = require("./TextDataController");


module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.controllers.DateController",
    $extends : ariaWidgetsControllersTextDataController,
    $resources : {
        "res" : ariaWidgetsWidgetsRes
    },
    $constructor : function () {

        this.$TextDataController.constructor.call(this);

        /**
         * Data model associated to a date input
         * @type Object
         * @protected
         */
        this._dataModel = {
            /**
             * @type Date
             */
            jsDate : null,
            displayText : ''
        };

        /**
         * Pattern used to display the date entry
         * @protected
         * @type String
         */
        this._pattern = '';
        /**
         * List of pattern used to parse user input
         * @protected
         * @type String
         */
        this._inputPattern = '';

        /**
         * Minimum allowed date
         * @protected
         * @type Date
         */
        this._minValue = null;

        /**
         * Maximum allowed date
         * @protected
         * @type Date
         */
        this._maxValue = null;

        /**
         * Reference date
         * @protected
         * @type Date
         */
        this._referenceDate = null;
    },
    $destructor : function () {
        this._dataModel = null;
        this.$TextDataController.$destructor.call(this);
    },
    $prototype : {

        /**
         * Set the date pattern
         * @param {aria.widgets.CfgBeans:DateFieldCfg} pattern options
         */
        setPattern : function (pattern) {
            if (!pattern) {
                var pattern = ariaUtilsEnvironmentDate.getDateFormats().shortFormat;
            }
            this._pattern = pattern;
        },
        /**
         * Set the date input pattern
         * @param {aria.widgets.CfgBeans:DatePickerCfg} pattern options
         */
        setInputPattern : function (inputPattern) {

            this._inputPattern = inputPattern;
        },

        /**
         * Set the minimum allowed date
         * @param {Date} value minimum date
         */
        setMinValue : function (value) {
            // remove the time, so that comparisons between the value and minValue are
            // correct
            this._minValue = ariaUtilsDate.removeTime(value);
        },

        /**
         * Set the maximum allowed date
         * @param {Date} value maximum date
         */
        setMaxValue : function (value) {
            // remove the time, so that comparisons between the value and maxValue are
            // correct
            this._maxValue = ariaUtilsDate.removeTime(value);
        },

        /**
         * Set the reference date
         * @param {Date} value reference date
         */
        setReferenceDate : function (value) {
            this._referenceDate = ariaUtilsDate.removeTime(value);
        },

        /**
         * override TextDataController.checkValue
         * @param {String} internalValue - Internal value of to be validated
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkValue : function (internalValue) {
            var report = new ariaWidgetsControllersReportsControllerReport();
            if (internalValue == null) {
                report.ok = true;
                this._dataModel.jsDate = null;
                this._dataModel.displayText = "";
            } else if (!ariaUtilsType.isDate(internalValue)) {
                report.ok = false;
            } else {
                // remove the time, so that comparisons with minValue and maxValue are
                // correct.
                internalValue = ariaUtilsDate.removeTime(internalValue);
                if (this._minValue && internalValue < this._minValue) {
                    report.ok = false;
                    report.errorMessages.push(this.res.errors["40018_WIDGET_DATEFIELD_MINVALUE"]);
                } else if (this._maxValue && internalValue > this._maxValue) {
                    report.ok = false;
                    report.errorMessages.push(this.res.errors["40019_WIDGET_DATEFIELD_MAXVALUE"]);
                } else {
                    report.ok = true;
                    this._dataModel.jsDate = internalValue;
                    this._dataModel.displayText = ariaUtilsDate.format(internalValue, this._pattern);
                }
            }
            if (report.ok) {
                report.text = this._dataModel.displayText;
                report.value = this._dataModel.jsDate;
            }
            return report;
        },

        /**
         * override TextDataController.checkText
         * @param {String} text - the displayed text
         * @param {Boolean} hasErrors - flags if errors have been already found
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkText : function (text, hasErrors) {

            // return object
            var report;
            // an empty field is usually not considered as an error
            if (!text) {
                report = this.checkValue(null);
            } else {
                if (text === this._dataModel.displayText) {
                    report = new ariaWidgetsControllersReportsControllerReport();
                    report.ok = true;
                } else {
                    var options = {
                        referenceDate : this._referenceDate,
                        inputPattern : this._inputPattern,
                        outputPattern : this._pattern
                    };
                    var date = ariaUtilsDate.interpret(text, options);
                    if (date) {
                        report = this.checkValue(date);
                    } else {
                        report = new ariaWidgetsControllersReportsControllerReport();
                        report.ok = false;
                        report.errorMessages.push(this.res.errors["40008_WIDGET_DATEFIELD_VALIDATION"]);
                    }
                }
            }

            return report;
        },

        /**
         * Convert a date to a string according to the pattern configured for this instance
         * @param {Date} date
         */
        getDisplayTextFromValue : function (date) {
            return (date && ariaUtilsType.isDate(date)) ? ariaUtilsDate.format(date, this._pattern) : "";
        }
    }
});
