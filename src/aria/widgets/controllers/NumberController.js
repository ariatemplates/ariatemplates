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
var ariaUtilsNumber = require("../../utils/Number");
var ariaCoreJsonValidator = require("../../core/JsonValidator");
var ariaWidgetsControllersTextDataController = require("./TextDataController");
var ariaUtilsType = require("../../utils/Type");


/**
 * Data controller associated to NumberField. It checks the input value, updates the data model and generates a report
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.controllers.NumberController",
    $extends : ariaWidgetsControllersTextDataController,
    $constructor : function () {
        this._widgetName = "NumberField";

        this.$TextDataController.constructor.call(this);

        /**
         * Data model associated to number input
         * @type Object
         */
        this._dataModel = {
            number : 0,
            displayText : ''
        };

        /**
         * NumberField pattern
         * @type String
         */
        this._pattern = '';
    },
    $destructor : function () {
        this._dataModel = null;
        this.$TextDataController.$destructor.call(this);
        this._pattern = null;
    },
    $prototype : {

        /**
         * Set Pattern if one has been specified
         * @param {String} internalValue
         */
        setPattern : function (pattern) {
            if (pattern) {
                if (ariaUtilsNumber.isValidPattern(pattern)) {
                    this._pattern = pattern;
                } else {
                    this.$logError(ariaCoreJsonValidator.INVALID_CONFIGURATION, ["pattern "]);
                }
            }
        },

        /**
         * Override TextDataController.checkValue
         * @param {Number} internalValue - Internal value of to be validated
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkValue : function (internalValue) {
            var report = new ariaWidgetsControllersReportsControllerReport();

            report.ok = (internalValue === null || ariaUtilsType.isNumber(internalValue));
            if (report.ok) {
                this._dataModel.number = internalValue;

                if (internalValue !== null) {
                    if (this._pattern) {
                        this._dataModel.displayText = ariaUtilsNumber.formatNumber(internalValue.toString(), this._pattern);
                    } else {
                        this._dataModel.displayText = internalValue.toString();
                    }
                } else {
                    this._dataModel.displayText = '';
                }

                report.text = this._dataModel.displayText;
                report.value = this._dataModel.number;
            }
            return report;
        },

        /**
         * Override TextDataController.checkText
         * @param {String} text - the displayed text
         * @param {Boolean} hasErrors - flags if errors have been already found
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkText : function (text, hasErrors) {
            // return object
            var report = new ariaWidgetsControllersReportsControllerReport();
            report.ok = false;
            // an empty field is not usually considered as an error
            if (!text) {
                report.ok = true;
                this._dataModel.displayText = '';
                this._dataModel.number = null;
            } else {
                if (text === this._dataModel.displayText) {
                    // Nothing changed
                    report.ok = !hasErrors;
                    if (!report.ok) {
                        report.errorMessages[0] = this.getErrorMessage("validation");
                    }
                } else {
                    // Update the text datamodel
                    this._dataModel.displayText = text;

                    var number = ariaUtilsNumber.interpretNumber(text, this._pattern);
                    number = ariaUtilsNumber.toNumber(number);

                    // If the number is valid, update the datamodel
                    if (number !== null) {
                        this._dataModel.number = number;
                        this._dataModel.displayText = ariaUtilsNumber.formatNumber(number, this._pattern);

                        report.ok = true;
                    } else {
                        report.errorMessages[0] = this.getErrorMessage("validation");
                        // The text doesn't correspond to a valid number
                        this._dataModel.number = null;
                    }
                }
            }

            // update report with current datamodel values
            report.text = this._dataModel.displayText;
            report.value = this._dataModel.number;

            return report;
        }
    }
});
