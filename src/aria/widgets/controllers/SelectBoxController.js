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
 * The list controller is used to check that a value entered in a field is one of the allowed values.
 */
Aria.classDefinition({
    $classpath : "aria.widgets.controllers.SelectBoxController",
    $extends : "aria.widgets.controllers.DropDownListController",
    $dependencies : ["aria.DomEvent", "aria.utils.Json", "aria.widgets.controllers.reports.DropDownControllerReport"],
    $constructor : function () {

        this.$DropDownListController.constructor.call(this);

        /**
         * Array of options
         * @type Array
         * @protected
         */
        this._options = null;

    },
    $statics : {
        /**
         * Meta data used to store labels
         * @type String
         */
        LABEL_META : Aria.FRAMEWORK_PREFIX + "lcLabel"
    },
    $prototype : {

        /**
         * Set the list content
         * @param {aria.widgets.CfgBeans:SelectBoxCfg.options} options
         */
        setListOptions : function (options) {
            this._options = options;
            // normalize labels to lowerCase
            var sz = options.length, item;
            for (var i = 0; sz > i; i++) {
                item = options[i];
                item[this.LABEL_META] = item.label.toLowerCase();
            }
        },

        /**
         * Prepare the suggestions list
         * @param {String} displayValue
         * @param {Boolean} currentlyOpen
         * @return {aria.widgets.controllers.reports.DropDownControllerReport}
         */
        toggleDropdown : function (displayValue, currentlyOpen) {
            var dm = this._dataModel;
            var report = new aria.widgets.controllers.reports.DropDownControllerReport();
            var sgs = this._options;
            report.displayDropDown = sgs.length > 0 && (!currentlyOpen || dm.listContent.length < sgs.length);
            if (report.displayDropDown) {
                dm.initialInput = displayValue;
                var jsonUtils = aria.utils.Json;
                jsonUtils.setValue(dm, 'selectedIdx', -1);
                jsonUtils.setValue(dm, 'listContent', sgs);
            }
            return report;
        },

        /**
         * Set the list widget.
         * @param {aria.widgets.form.list.List} listWidget
         */
        setListWidget : function (listWidget) {
            this._listWidget = listWidget;
        },

        /**
         * Loops through the options in the list and checks to see if the first x number of characters is the same as
         * what have been entered in the Select Box
         * @param {String} initialInput A string of what has been entered in the text box
         * @return {Object} Object containing three properties: bestDisplayValue (string), exactMatch (boolean) and
         * suggestions (array).
         */
        _buildSuggestionsList : function (initialInput) {
            // check if new value is acceptable and generate new suggestion list
            var lcval = initialInput.toLowerCase();
            var sgs = []; // suggestions
            var vsz = lcval.length;
            var sz = this._options.length, item, str;
            var bestDisplay = null;
            var exactMatch = -1; // contains the index of the first exactly matching item in the resulting
            // suggestions list
            for (var i = 0; sz > i; i++) {
                item = this._options[i];
                str = item[this.LABEL_META].slice(0, vsz);
                if (str == lcval) {
                    sgs.push(item); // add to suggestions
                    if (exactMatch == -1) {
                        if (vsz == item.label.length) {
                            // the whole label was compared and matches exactly (case insensitively)
                            exactMatch = sgs.length - 1;
                            bestDisplay = item.label;
                        } else if (bestDisplay == null) {
                            bestDisplay = item.label.slice(0, vsz);
                        }
                    }
                }
            }
            return {
                bestDisplayValue : bestDisplay,
                exactMatch : exactMatch,
                suggestions : sgs
            };
        },

        /**
         * override TextDataController.checkValue
         * @param {String} internalValue - Internal value of to be validated
         * @return {aria.widgets.controllers.reports.DropDownControllerReport}
         */
        checkValue : function (value) {
            var report = new aria.widgets.controllers.reports.DropDownControllerReport();
            var dm = this._dataModel;
            var options = this._options;
            if (value == null) {
                report.ok = true;
                dm.value = null;
                dm.text = '';
            } else if (value == dm.value) {
                report.ok = true;
            } else {
                report.ok = false;
                for (var i = 0, length = options.length; i < length; i++) {
                    var item = options[i];
                    if (item.value == value) {
                        report.ok = true;
                        dm.text = item.label;
                        dm.value = item.value;
                        break;
                    }
                }
            }
            if (report.ok) {
                report.text = dm.text;
                report.value = dm.value;
            }
            return report;
        },

        /**
         * override TextDataController.checkText
         * @param {String} displayedText - the displayed text
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkText : function (displayedText) {
            // return object
            var report = new aria.widgets.controllers.reports.DropDownControllerReport();
            var dm = this._dataModel;
            var lowerCaseDispValue = displayedText.toLowerCase();
            var dispValueLength = displayedText.length;

            // an empty field is usually not considered as an error
            if (!displayedText) {
                dm.value = null;
                dm.text = '';
                report.ok = true;
            } else if (displayedText == dm.text) {
                // if the displayed value is the same as before, don't loop over the whole list
                report.ok = true;
            } else {
                report.ok = false;
                var sz = this._options.length, item;

                for (var i = 0; sz > i; i++) {
                    item = this._options[i];
                    if (item.label == displayedText) {
                        dm.value = item.value;
                        dm.text = item.label;
                        report.ok = true;
                        break;
                    } else {
                        if (lowerCaseDispValue == item[this.LABEL_META].slice(0, dispValueLength)) {
                            report.matchCorrectValueStart = true;
                        }
                    }
                }
            }
            if (report.ok) {
                report.text = dm.text;
                report.value = dm.value;
            }

            return report;
        },

        /**
         * Check for the case when the displayedValue will change
         * @param {Integer} charCode
         * @param {Integer} keyCode
         * @param {String} nextValue the value that should be next in the textfield
         * @param {Integer} caretPos
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        _checkInputKey : function (charCode, keyCode, nextValue, caretPosStart, caretPosEnd) {
            var report = new aria.widgets.controllers.reports.DropDownControllerReport();
            var dataModel = this._dataModel;
            report.caretPosStart = caretPosStart;
            report.caretPosEnd = caretPosEnd;

            var sgsInfo = this._buildSuggestionsList(nextValue);
            var sgs = sgsInfo.suggestions;

            // prepare report
            // validation only accepts items in the list
            report.matchCorrectValueStart = (sgs.length > 0);

            if (report.matchCorrectValueStart) {
                // don't update suggestions if report is ko
                report.text = sgsInfo.bestDisplayValue;
                var exactMatch = sgsInfo.exactMatch;
                if (exactMatch != -1) {
                    var matchingItem = sgs[exactMatch];
                    report.ok = true;
                    dataModel.text = matchingItem.label;
                    dataModel.value = matchingItem.value;
                    report.displayDropDown = (sgs.length > 1);
                } else {
                    report.ok = false;
                    report.displayDropDown = (sgs.length > 0);
                }

                var jsonUtils = aria.utils.Json;
                jsonUtils.setValue(dataModel, 'listContent', sgs);
                jsonUtils.setValue(dataModel, 'selectedIdx', exactMatch);
                dataModel.initialInput = report.text;
            }
            report.cancelKeyStroke = true;
            return report;
        },

        /**
         * Public method that converts a set of values into the displayed text
         * @param {String} selectedValue
         * @return {String}
         */
        getDisplayTextFromValue : function (selectedValue) {
            var options = this._options;
            for (var i = 0, len = options.length; len > i; i++) {
                if (options[i].value == selectedValue) {
                    return options[i].label;
                }
            }
            return "";
        }
    }
});
