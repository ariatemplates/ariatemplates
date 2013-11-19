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

Aria.classDefinition({
    $classpath : "aria.widgets.controllers.DateController",
    $extends : "aria.widgets.controllers.TextDataController",
    $dependencies : ["aria.DomEvent", "aria.widgets.controllers.reports.ControllerReport", "aria.utils.Date",
            "aria.utils.Type", "aria.utils.environment.Date"],
    $resources : {
        "res" : "aria.widgets.WidgetsRes"
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
                var pattern = aria.utils.environment.Date.getDateFormats().shortFormat;
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
            this._minValue = aria.utils.Date.removeTime(value);
        },

        /**
         * Set the maximum allowed date
         * @param {Date} value maximum date
         */
        setMaxValue : function (value) {
            // remove the time, so that comparisons between the value and maxValue are
            // correct
            this._maxValue = aria.utils.Date.removeTime(value);
        },

        /**
         * Set the reference date
         * @param {Date} value reference date
         */
        setReferenceDate : function (value) {
            this._referenceDate = aria.utils.Date.removeTime(value);
        },

        /**
         * override TextDataController.checkValue
         * @param {String} internalValue - Internal value of to be validated
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkValue : function (internalValue) {
            var report = new aria.widgets.controllers.reports.ControllerReport();
            if (internalValue == null) {
                report.ok = true;
                this._dataModel.jsDate = null;
                this._dataModel.displayText = "";
            } else if (!aria.utils.Type.isDate(internalValue)) {
                report.ok = false;
            } else {
                // remove the time, so that comparisons with minValue and maxValue are
                // correct.
                internalValue = aria.utils.Date.removeTime(internalValue);
                if (this._minValue && internalValue < this._minValue) {
                    report.ok = false;
                    report.errorMessages.push(this.res.errors["40018_WIDGET_DATEFIELD_MINVALUE"]);
                } else if (this._maxValue && internalValue > this._maxValue) {
                    report.ok = false;
                    report.errorMessages.push(this.res.errors["40019_WIDGET_DATEFIELD_MAXVALUE"]);
                } else {
                    report.ok = true;
                    this._dataModel.jsDate = internalValue;
                    this._dataModel.displayText = aria.utils.Date.format(internalValue, this._pattern);
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
                var modelDate = new Date(this._dataModel.displayText);
                if (text === this._dataModel.displayText
                        && !((this._minValue && this._minValue > modelDate) || (this._maxValue && this._maxValue < modelDate))) {
                    report = new aria.widgets.controllers.reports.ControllerReport();
                    report.ok = true;
                } else {
                    var options = {
                        referenceDate : this._referenceDate,
                        inputPattern : this._inputPattern,
                        outputPattern : this._pattern
                    };
                    var date = aria.utils.Date.interpret(text, options);
                    if (date) {
                        report = this.checkValue(date);
                    } else {
                        report = new aria.widgets.controllers.reports.ControllerReport();
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
            return (date && aria.utils.Type.isDate(date)) ? aria.utils.Date.format(date, this._pattern) : "";
        }
    }
});
