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
var ariaDomEvent = require("../../DomEvent");
var ariaWidgetsControllersReportsDropDownControllerReport = require("./reports/DropDownControllerReport");
var ariaWidgetsControllersTextDataController = require("./TextDataController");


/**
 * Controller for the a widget with a dropdown that contains a list.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.controllers.DropDownListController",
    $extends : ariaWidgetsControllersTextDataController,

    /**
     * Constructor
     */
    $constructor : function () {

        this.$TextDataController.constructor.call(this);

        /**
         * List widget if the dropdown is open
         * @protected
         * @type aria.widgets.form.list.List
         */
        this._listWidget = null;

        /**
         * Datamodel associated to this input
         * @protected
         * @type Object
         */
        this._dataModel = {
            /**
             * Current internal value
             * @type Object
             */
            value : null,

            /**
             * display value corresponding to the value in the controller
             * @type String
             */
            text : '',

            // following properties are used for suggestions:

            /**
             * Initial input in the textfield
             * @type String
             */
            initialInput : '',

            /**
             * Index of the selected item in the list
             * @type Number
             */
            selectedIdx : -1,

            /**
             * Content given to the list
             * @type Array
             */
            listContent : []
        };

    },
    $destructor : function () {
        if (this._listWidget && this._listWidget.$dispose) {
            this._listWidget.$dispose();
        }
        this._dataModel = null;
        this.$TextDataController.$destructor.call(this);
    },
    $prototype : {

        /**
         * Set the list widget.
         * @param {aria.widgets.form.list.List} listWidget
         */
        setListWidget : function (listWidget) {
            this._listWidget = listWidget;
        },

        /**
         * Get the list widget.
         * @return {aria.widgets.form.list.List} listWidget
         */
        getListWidget : function () {
            return this._listWidget;
        },

        /**
         * Checking against special key combinations that trigger a selection of the item in the dropdown
         * @param {aria.DomEvent} event
         * @return {Boolean} Whether the event corresponds to a selection key
         */
        checkSelectionKeys : function (event) {
            return event.keyCode == event.KC_ENTER;
        },

        /**
         * OVERRIDE TextDataController.checkKeyStroke
         * @param {Integer} charCode
         * @param {Integer} keyCode
         * @param {String} currentText
         * @param {Integer} caretPos
         * @param {aria.DomEvent} event
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkKeyStroke : function (charCode, keyCode, currentText, caretPosStart, caretPosEnd, event) {
            var dataModel = this._dataModel, domEvent = ariaDomEvent, report, selectionKey;

            if (this._listWidget) {
                selectionKey = this.checkSelectionKeys(event);
            }
            if (!domEvent.isNavigationKey(keyCode) && !selectionKey) {
                // value that should be in the input after this keystroke and also the caret positions
                var nextValueObject;
                var isDelKey = (keyCode == domEvent.KC_DELETE || keyCode == domEvent.KC_BACKSPACE);
                if (isDelKey) {
                    nextValueObject = this._getTypedValueOnDelete(keyCode, currentText, caretPosStart, caretPosEnd);
                } else {
                    nextValueObject = this._getTypedValue(charCode, currentText, caretPosStart, caretPosEnd);
                }

                dataModel.initialInput = nextValueObject.nextValue;

                return this._checkInputKey(charCode, keyCode, nextValueObject.nextValue, nextValueObject.caretPosStart, nextValueObject.caretPosEnd);
            }

            // Handling for navigation. First if dropdown list is opened
            if (this._listWidget) {
                if (!selectionKey && keyCode == domEvent.KC_ESCAPE) {
                    report = this.checkText(dataModel.initialInput);
                    if (!report) {
                        report = new ariaWidgetsControllersReportsDropDownControllerReport();
                    }
                    report.displayDropDown = false; // close the dropdown
                    report.text = dataModel.initialInput;
                    // data Model value reset on escape to retain error no escape PTR 05163905
                    report.value = report.text;
                    dataModel.value = null;
                    return report;

                } else if (selectionKey || keyCode == domEvent.KC_TAB) {
                    if (dataModel.selectedIdx != -1) {
                        if (dataModel.selectedIdx != null) {
                            dataModel.text = this._getLabelFromListValue(dataModel.listContent[dataModel.selectedIdx]);
                            dataModel.value = dataModel.listContent[dataModel.selectedIdx].value;
                        }
                        report = this.checkDropdownValue(dataModel.value);
                    } else {
                        var report = new ariaWidgetsControllersReportsDropDownControllerReport();
                    }
                    report.displayDropDown = false; // close the dropdown
                    if (keyCode != domEvent.KC_TAB) {
                        report.cancelKeyStroke = true; // prevent fieldset onSubmit when typing ENTER
                    }
                    return report;
                } else if (keyCode == domEvent.KC_ARROW_LEFT) {
                    return;
                } else {
                    report = new ariaWidgetsControllersReportsDropDownControllerReport();

                    var oldIdx = dataModel.selectedIdx;
                    this._listWidget.sendKey(0, keyCode);
                    var newIdx = dataModel.selectedIdx;
                    if (oldIdx != newIdx) {
                        report.ok = true;
                        if (newIdx == -1) {
                            dataModel.value = null;
                            dataModel.text = dataModel.initialInput;
                        } else {
                            dataModel.value = dataModel.listContent[newIdx].value;
                            dataModel.text = this._getLabelFromListValue(dataModel.listContent[newIdx]);
                        }
                        report.text = dataModel.text;
                    }
                    return report;
                }
            } else {
                // otherwise open list dropdown on arrow down if needed
                if (keyCode == domEvent.KC_ARROW_DOWN) {
                    report = this._checkInputKey(charCode, keyCode, currentText, caretPosStart, caretPosEnd);
                } else {
                    report = new ariaWidgetsControllersReportsDropDownControllerReport();
                }
                // domEvent.KC_ESCAPE for issue#697 on FF
                if (report && keyCode != domEvent.KC_TAB && keyCode != domEvent.KC_ARROW_DOWN) {
                    // domEvent.KC_ESCAPE for issue#697 on FF
                    report.cancelKeyStroke = (keyCode == domEvent.KC_ESCAPE);
                }
                return report;
            }
        },

        /**
         * Check the value selected by the user in the dropdown.
         * @param {Object} value
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkDropdownValue : function (value) {
            return this.checkValue(value);
        },

        /**
         * Check for the case when the displayedValue will change This has to be overridden to handle list update on key
         * stroke
         * @param {Integer} charCode
         * @param {Integer} keyCode
         * @param {String} currentText
         * @param {Integer} caretPos
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        _checkInputKey : function (charCode, keyCode, currentText, caretPosStart, caretPosEnd) {
            var report = new ariaWidgetsControllersReportsDropDownControllerReport();
            report.ok = true;
            report.cancelKeyStroke = false;
            report.displayDropDown = this._dataModel.listContent.length > 0;
            return report;
        },

        /**
         * Retrieve the label to display in the textfield for an element of the list in the datamodel. This element may
         * be different from the element in the 'value' parameter of the datamodel.
         * @param {Object} value
         * @return {String} null if display in textfield should not change
         */
        _getLabelFromListValue : function (listValue) {
            return listValue.label;
        }

    }
});
