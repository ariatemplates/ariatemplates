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
var ariaUtilsType = require("../../utils/Type");


/**
 * Base class for any data controller associated to Text Input objects
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.controllers.TextDataController",
    $events : {
        "onCheck" : {
            description : "Notifies that controller has finished am asynchronouse check (internal, of the value or of a keystroke)",
            properties : {
                report : "{aria.widgets.controllers.reports.ControllerReport} a check report"
            }
        }
    },
    $constructor : function () {
        /**
         * Data model associated to this controller
         * @type Object
         */
        this._dataModel = {
            value : null,
            displayText : ''
        };
    },
    $prototype : {

        /**
         * Verify a given keyStroke
         * @param {Integer} charCode
         * @param {Integer} keyCode
         * @param {String} currentValue
         * @param {Integer} caretPos
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkKeyStroke : function (charCode, keyCode, currentValue, caretPos) {
            return new ariaWidgetsControllersReportsControllerReport();
        },

        /**
         * Verify a given value
         * @param {String} text - the displayed text
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkText : function (text) {
            var report = new ariaWidgetsControllersReportsControllerReport();
            if (ariaUtilsType.isString(text) || ariaUtilsType.isNumber(text)) {
                // allow values that can be easily displayed in the textfield
                report.value = text;
                report.ok = true;
            } else {
                report.ok = false;
            }
            return report;
        },

        /**
         * Verify an internal value (the same kind of value contained in this._dataModel.value)
         * @param {MultiTypes} internalValue
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkValue : function (internalValue) {
            // consider null as empty string
            if (internalValue == null) {
                internalValue = '';
            }
            // internal value is the same as displayed value
            var report = this.checkText(internalValue);
            report.text = report.value;
            return report;
        },

        /**
         * Return the data model associated to this controller
         * @return {Object}
         */
        getDataModel : function () {
            return this._dataModel;
        },

        /**
         * Deduce the value that will be generated if the char is typed at the specified caret postion
         * @param {Integer} charCode the unicode character code that has been typed
         * @param {String} curVal the current text field value
         * @param {Integer} caretPosStart the start of the caret (cursor) position in the text field
         * @param {Integer} caretPosEnd the end of the caret (cursor) position in the text field (can be a selection)
         * @return {Object} the next field value along with the next caret positions
         */
        _getTypedValue : function (charCode, curVal, caretPosStart, caretPosEnd) {
            var returnedObject;
            if (charCode === 0) {
                returnedObject = {
                    nextValue : curVal,
                    caretPosStart : caretPosStart,
                    caretPosEnd : caretPosEnd
                };
                return returnedObject;
            }
            var str = String.fromCharCode(charCode);
            if (str === '') {
                returnedObject = {
                    nextValue : curVal,
                    caretPosStart : caretPosStart,
                    caretPosEnd : caretPosEnd
                };
                return returnedObject;
            }
            if (curVal == null || curVal === '') {
                returnedObject = {
                    nextValue : str,
                    caretPosStart : str.length,
                    caretPosEnd : str.length
                };
                return returnedObject;
            }

            var sz = curVal.length;
            if (caretPosStart >= sz) {
                returnedObject = {
                    nextValue : curVal + str,
                    caretPosStart : caretPosStart + str.length,
                    caretPosEnd : caretPosStart + str.length
                };
                return returnedObject;
            } else {
                var s1 = curVal.slice(0, caretPosStart);
                var s2 = curVal.slice(caretPosEnd, sz);
                returnedObject = {
                    nextValue : s1 + str + s2,
                    caretPosStart : caretPosStart + str.length,
                    caretPosEnd : caretPosStart + str.length
                };
                return returnedObject;
            }
        },

        /**
         * Deduce the value that will be generated if the delete or backspace keys are typed
         * @param {Integer} keyCode the key code (DEL or BACKSPACE)
         * @param {String} curVal the current text field value
         * @param {Integer} caretPosStart the start of the caret (cursor) position in the text field
         * @param {Integer} caretPosEnd the end of the caret (cursor) position in the text field (can be a selection)
         * @return {Object} the next field value along with the next caret positions
         */
        _getTypedValueOnDelete : function (keyCode, curVal, caretPosStart, caretPosEnd) {
            var returnedObject = {};
            if (curVal == null || curVal === '') {
                returnedObject = {
                    nextValue : '',
                    caretPosStart : 0,
                    caretPosEnd : 0
                };
                return returnedObject;
            }
            var sz = curVal.length;
            if (caretPosStart >= sz) {
                caretPosStart = sz;
            }
            var s1 = '', s2 = '';
            // backspace and del behave the same when there is a selection
            if (caretPosStart != caretPosEnd) {
                keyCode = aria.DomEvent.KC_DELETE;
            }
            if (keyCode == aria.DomEvent.KC_DELETE) {
                // delete key
                if (caretPosStart != caretPosEnd) {
                    s1 = curVal.slice(0, caretPosStart);
                    s2 = curVal.slice(caretPosEnd, sz);
                } else {
                    // caretPosStart==caretPosEnd
                    s1 = curVal.slice(0, caretPosStart);
                    if (caretPosStart == sz) {
                        s2 = '';
                    } else {
                        s2 = curVal.slice(caretPosStart + 1, sz);
                    }
                }
                returnedObject.caretPosStart = caretPosStart;
                returnedObject.caretPosEnd = caretPosStart;
            } else {
                // backspace key
                if (caretPosStart < 1) {
                    s1 = '';
                    returnedObject.caretPosStart = caretPosStart;
                    returnedObject.caretPosEnd = caretPosStart;
                } else {
                    s1 = curVal.slice(0, caretPosStart - 1);
                    returnedObject.caretPosStart = caretPosStart - 1;
                    returnedObject.caretPosEnd = caretPosStart - 1;
                }
                s2 = curVal.slice(caretPosEnd, sz);
            }
            returnedObject.nextValue = s1 + s2;
            return returnedObject;
        },

        /**
         * Raise a onCheck event with the given report
         * @protected
         * @param {aria.widgets.controllers.reports.ControllerReport} report
         */
        _raiseReport : function (report, arg) {
            this.$raiseEvent({
                name : "onCheck",
                report : report,
                arg : arg
            });
        }
    }
});
