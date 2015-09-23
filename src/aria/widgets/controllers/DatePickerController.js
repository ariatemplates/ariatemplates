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
 * TODOC
 * @class aria.widgets.controllers.DatePickerController
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.controllers.DatePickerController',
    $dependencies : ['aria.widgets.controllers.reports.ControllerReport', 'aria.utils.Json'],
    $extends : 'aria.widgets.controllers.DateController',
    $constructor : function () {
        this.$DateController.constructor.call(this);
        this._calendar = null;
        // the value in the calendar is not directly the value in the date picker (especially when selecting with the
        // keyboard)
        this._dataModel.calendarValue = null;
    },
    $destructor : function () {
        this._calendar = null;
        this.$DateController.$destructor.call(this);
    },
    $prototype : {

        /**
         * Set the calendar associated to this controller
         * @param {aria.widgets.calendar.Calendar} calendar
         */
        setCalendar : function (calendar) {
            this._calendar = calendar;
        },

        /**
         * Returns the calendar associated to this controller.
         * @return {aria.widgets.calendar.Calendar}
         */
        getCalendar : function () {
            return this._calendar;
        },

        /**
         * Verify a given value
         * @param {String} displayValue the displayed text
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkText : function (displayValue) {
            var report = this.$DateController.checkText.apply(this, arguments);
            if (report.ok) {
                aria.utils.Json.setValue(this._dataModel, "calendarValue", this._dataModel.jsDate);
            }
            return report;
        },

        /**
         * Verify an internal value (the same kind of value contained in this._dataModel.value)
         * @param {MultiTypes} internalValue
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkValue : function (internalValue) {
            var report = this.$DateController.checkValue.apply(this, arguments);
            if (report.ok) {
                aria.utils.Json.setValue(this._dataModel, "calendarValue", this._dataModel.jsDate);
            }
            return report;
        },

        /**
         * Verify a given keyStroke and return a report.
         * @param {Number} charCode
         * @param {Number} keyCode
         * @param {string} currentValue
         * @param {Number} caretPos
         * @return {aria.widgets.controllers.reports.DropDownControllerReport}
         */
        checkKeyStroke : function (charCode, keyCode, currentValue, caretPos) {
            if (this._calendar) {
                /* the calendar controller is available, which means the calendar is displayed */
                if (keyCode == 13 /* KC_ENTER */|| charCode == 32 /* KC_SPACE */|| keyCode == 9 /* KC_TAB */) {
                    // close and keep the value of the calendar
                    var report = this.checkValue(this._dataModel.calendarValue);
                    report.displayDropDown = false;
                    report.cancelKeyStroke = (keyCode != 9 /* KC_TAB */); // prevent default behavior (fieldset
                    // onSubmit when closing the popup through ENTER) except for TAB
                    return report;
                } else {
                    var report = new aria.widgets.controllers.reports.ControllerReport();
                    report.text = currentValue;
                    if (keyCode == 27 /* KC_ESCAPE */) {
                        // close and forget the value of the calendar
                        // select the whole value to make it easier to type another date
                        report.displayDropDown = false;
                        report.caretPosStart = 0;
                        report.caretPosEnd = currentValue.length;
                    } else {
                        // transmit the key to the calendar
                        // and cancel the key stroke if the calendar used it
                        report.cancelKeyStroke = this._calendar.sendKey(charCode, keyCode);
                    }
                    // provide the best display value to prevent a change in the text displayed in the textfield
                    // (when the calendar is displayed, the text should be read-only)
                    report.text = currentValue;
                    return report;
                }
            } else if (keyCode == 40 /* KC_ARROW_DOWN */) {
                /* validates current content and display the calendar */
                var report = this.checkText(currentValue);
                report.cancelKeyStroke = true;
                report.displayDropDown = true;
                return report;
            } else {
                return this.$DateController.checkKeyStroke.apply(this, arguments);
            }
        },

        /**
         * Called when the user wants to toggle the display of the dropdown.
         * @param {String} diplayValue
         * @param {Boolean} dropdownDisplayed
         */
        toggleDropdown : function (displayValue, dropdownDisplayed) {
            var report = this.checkText(displayValue);
            report.displayDropDown = !dropdownDisplayed;
            report.ok = report.ok || !displayValue;
            return report;
        }
    }
});
