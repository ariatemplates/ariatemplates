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
var ariaUtilsJson = require("../../utils/Json");
var ariaDomEvent = require("../../DomEvent");
var ariaWidgetsControllersReportsDropDownControllerReport = require("./reports/DropDownControllerReport");
var ariaWidgetsControllersDropDownListController = require("./DropDownListController");
var ariaUtilsString = require("../../utils/String");
var ariaUtilsArray = require("../../utils/Array");


/**
 * Controller for the Multi-Select widget.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.controllers.MultiSelectController",
    $extends : ariaWidgetsControllersDropDownListController,
    $constructor : function () {
        this.$DropDownListController.constructor.call(this);
        /**
         * separator used in the multiselect
         * @protected
         * @type String
         */
        this._separator = null;

        /**
         * Type of display for the field
         * @protected
         * @type String
         */
        this._fieldDisplay = "value";

        /**
         * List of values selected to enhance existing dataModel
         * @protected
         * @type Array
         */
        this._dataModel.selectedValues = [];

        /**
         * Maximum no. of options to be selected from multiselect
         * @protected
         * @type Integer
         */
        this._maxOptions = null;

        /**
         * Map between values and text display. The goal is too return the same object for the same text in the input,
         * for the case where the user check and uncheck an element in the multiselect dropdown
         * @protected
         * @type Object
         */
        this._cacheValues = {};

    },
    $destructor : function () {
        this._cacheValues = null;
        this.$DropDownListController.$destructor.call(this);
    },
    $statics : {
        // ERROR MESSAGES:
        INVALID_MULTISELECT_CONTENT : "Multiselect items should not contain field separator as a value."
    },
    $prototype : {

        /**
         * Set the configured separator
         * @param {String} separator Used to seperate items in the TextInput part of the multi-select
         */
        setSeparator : function (separator) {
            this._separator = separator;
        },

        /**
         * Set the configured maxOptions
         * @param {Integer} maxOptions Used to select max no. of options from Multiselect
         */
        setMaxOptions : function (maxOptions) {
            this._maxOptions = maxOptions;
        },

        /**
         * Set the display mode for the field
         * @param {String} separator Used to seperate items in the TextInput part of the multi-select
         */
        setFieldDisplay : function (display) {
            this._fieldDisplay = display;
        },

        /**
         * Set the display mode for the field
         * @param {String} separator Used to seperate items in the TextInput part of the multi-select
         */
        setValueDisplay : function (display) {
            this._valueDisplay = display;
        },

        /**
         * Get the configured separator
         * @return {String} separator Used to seperate items in the TextInput part of the multi-select
         */
        getSeparator : function () {
            return this._separator;
        },

        /**
         * Set the list content
         * @param {aria.widgets.CfgBeans:MultiSelectCfg.items} options
         */
        setListOptions : function (options) {
            // clean cache on each toggle
            this._cacheValues = {};
            this._dataModel.listContent = options;
        },

        /**
         * Prepare the drop down list
         * @param {String} displayValue
         * @param {Boolean} currentlyOpen
         * @return {aria.widgets.controllers.reports.DropDownControllerReport}
         */
        toggleDropdown : function (displayValue, currentlyOpen) {

            var dataModel = this._dataModel, options = dataModel.listContent, selectedValues = dataModel.selectedValues;
            dataModel.selectedIdx = -1; // reset selected indexes
            // retrieve selection from input
            selectedValues = this._parseInputString(options, displayValue);
            if (!currentlyOpen) {
                // update list and datamodel
                if (!ariaUtilsJson.equals(selectedValues, dataModel.value)) {
                    ariaUtilsJson.setValue(dataModel, 'selectedValues', selectedValues);
                    dataModel.value = selectedValues;
                    dataModel.text = this._getDisplayValue(selectedValues);
                }
            }

            var report = new ariaWidgetsControllersReportsDropDownControllerReport();
            report.displayDropDown = options.length > 0 && !currentlyOpen;

            if (report.displayDropDown) {
                // save initial input
                dataModel.initialInput = displayValue;
                // update list of options
                ariaUtilsJson.setValue(dataModel, 'listContent', options);
            }

            report.text = dataModel.text;
            report.value = this._getValue(dataModel.text, dataModel.value);
            if (!selectedValues.length) {
                dataModel.selectedIdx = null;
            }
            return report;
        },

        /**
         * Parse value inserted in the datefield to deduce selected objects
         * @protected
         * @param {Array} options
         * @param {String} textFieldValue
         * @return {Array}
         */
        _parseInputString : function (options, textFieldValue) {

            var selectedOptions = [];
            var trim = ariaUtilsString.trim;

            var inSplit = textFieldValue.split(this._separator);
            if (inSplit) {
                for (var i = 0, inSplitLen = aria.utils.Math.min(inSplit.length, this._maxOptions); i < inSplitLen; i++) {
                    for (var j = 0, optionsLen = options.length; j < optionsLen; j++) {
                        var key = trim(inSplit[i]);
                        options[j].label = options[j].label + "";
                        options[j].value = options[j].value + "";
                        key = key + "";

                        if ((trim(options[j].label.toLowerCase()) == key.toLowerCase() || trim(options[j].value.toLowerCase()) == key.toLowerCase())
                                && !ariaUtilsArray.contains(selectedOptions, options[j].value)
                                && !options[j].disabled) {
                            selectedOptions.push(options[j].value);
                        }
                    }
                }

            }

            return selectedOptions;
        },

        /**
         * Adds or remove items from the display value. If I am adding an item I also check that it wasn't already added
         * previously so there will be no duplicate items displayed.
         * @param {Array} selectedValues
         * @return {String}
         */
        _getDisplayValue : function (selectedValues) {
            var toDisplay = this._fieldDisplay, options = this._dataModel.listContent;
            var backUp = (this._fieldDisplay == 'value') ? 'label' : 'value';

            var display = [], option;
            for (var i = 0, l = selectedValues.length; i < l; i++) {
                option = selectedValues[i];
                for (var j = 0, l2 = options.length; j < l2; j++) {
                    if (options[j].value == option) {
                        display.push(options[j][toDisplay] ? options[j][toDisplay] : options[j][backUp]);
                    }
                }

            }
            return display.join(this._separator);
        },

        /**
         * override DropDownListController.checkValue
         * @param {String} value
         * @return {aria.widgets.controllers.reports.DropDownControllerReport}
         */
        checkValue : function (value) {
            var report = new ariaWidgetsControllersReportsDropDownControllerReport();
            var dataModel = this._dataModel;
            if (value === null) {
                report.ok = true;
                dataModel.value = null;
                dataModel.text = '';
            } else {
                if (!ariaUtilsJson.equals(value, dataModel.value)) {
                    // Only update the data-model if there has been a change, otherwise onchange is raised
                    ariaUtilsJson.setValue(dataModel, 'selectedValues', value);
                    dataModel.value = value;

                } else {
                    if (!ariaUtilsJson.equals(dataModel.selectedValues, dataModel.value)) {
                        // Only update the data-model if there has been a change, otherwise onchange is raised
                        value = dataModel.selectedValues;
                        dataModel.value = value;
                    }
                }
                report.ok = true;
                var text = this._getDisplayValue(value);
                dataModel.text = text;
            }
            if (report.ok) {
                report.text = dataModel.text;
                report.value = this._getValue(dataModel.text, dataModel.value);
            }
            return report;
        },

        /**
         * override DropDownController.checkText
         * @param {String} str
         * @return {aria.widgets.controllers.reports.DropDownControllerReport}
         */
        checkText : function (str) {

            var dataModel = this._dataModel, options = dataModel.listContent, selectedValues;

            // retrieve selection from string
            selectedValues = this._parseInputString(options, str);

            if (!ariaUtilsJson.equals(selectedValues, dataModel.value)) {

                ariaUtilsJson.setValue(dataModel, 'value', selectedValues);
                ariaUtilsJson.setValue(dataModel, 'text', this._getDisplayValue(selectedValues));
                ariaUtilsJson.setValue(dataModel, 'selectedValues', selectedValues);
            }

            var report = new ariaWidgetsControllersReportsDropDownControllerReport();

            report.text = dataModel.text;
            report.value = this._getValue(dataModel.text, dataModel.value);

            return report;
        },

        /**
         * Log the Error when option value contains field separator logged message
         */
        checkError : function () {
            var options = this._dataModel.listContent, value;
            for (var i = 0, len = options.length; i < len; i++) {
                value = options[i].value + "";
                if (value.indexOf(this._separator) != -1) {
                    this.$logError(this.INVALID_MULTISELECT_CONTENT);
                    break;
                }
            }

        },

        /**
         * Check for the case when the displayedValue will change This has to be overriden to handle list update on key
         * stroke
         * @param {Integer} charCode
         * @param {Integer} keyCode
         * @param {String} currentText
         * @param {Integer} caretPos
         * @return {aria.widgets.controllers.reports.DropDownControllerReport}
         */
        _checkInputKey : function (charCode, keyCode, currentText, caretPosStart, caretPosEnd) {
            var report;
            if (ariaDomEvent.KC_ARROW_DOWN === keyCode) {
                report = this.toggleDropdown(currentText, false);
                report.cancelKeyStroke = true;
            } else {
                report = new ariaWidgetsControllersReportsDropDownControllerReport();
                report.ok = true;
                report.cancelKeyStroke = false;
                report.displayDropDown = false;
            }
            return report;
        },

        /**
         * Return the value for given text in input and value
         * @protected
         * @param {String} text
         * @param {Object} value
         * @return {Object}
         */
        _getValue : function (text, value) {
            var cachedValue = this._cacheValues[text];
            if (cachedValue) {
                return cachedValue;
            }
            this._cacheValues[text] = value;
            return value;
        },

        /**
         * Public method that converts a set of values into the displayed text by relying on the protected method
         * _getDisplayValue
         * @param {Array} selectedValues
         * @return {String}
         */
        getDisplayTextFromValue : function (selectedValues) {
            return this._getDisplayValue(selectedValues);
        }
    }
});
