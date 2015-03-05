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
 * Base class for any data controller associated to Text Input objects
 */
Aria.classDefinition({
    $classpath : "aria.widgets.controllers.TextDataController",
    $dependencies : ["aria.widgets.controllers.reports.ControllerReport", "aria.widgets.environment.WidgetSettings"],
    $resources : {
        res : "aria.widgets.WidgetsRes"
    },
    $events : {
        "onCheck" : {
            description : "Notifies that controller has finished an asynchronous check (internal, of the value or of a keystroke)",
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

        this.setDefaultErrorMessages();
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
            return new aria.widgets.controllers.reports.ControllerReport();
        },

        /**
         * Verify a given value
         * @param {String} text - the displayed text
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkText : function (text) {
            var report = new aria.widgets.controllers.reports.ControllerReport();
            if (aria.utils.Type.isString(text) || aria.utils.Type.isNumber(text)) {
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
         * Sets the default error messages map to the given value.
         *
         * <p>
         * The input value type is specified in bean <em>aria.widgets.CfgBeans</em> for the widgets supporting it.
         * </p>
         *
         * <p>
         * If the given value is <em>null</em>, an empty object is set, meaning no default messages.
         * </p>
         *
         * @param {Object} defaultErrorMessages The map of error messages to set for the controller.
         *
         * @return {Object} The final default error messages (as given or further processed ones).
         */
        setDefaultErrorMessages : function (defaultErrorMessages) {
            if (defaultErrorMessages == null) {
                defaultErrorMessages = {};
            }

            this._defaultErrorMessages = defaultErrorMessages;

            return defaultErrorMessages;
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
        },

        /**
         * Retrieves the requested error message from different sets of configuration ordered by precedence.
         *
         * <p>
         * An error message value is requested from this error message name.
         * </p>
         *
         * <p>
         * There can be three levels of configuration for the error messages of a widget, enumerated here by order of precedence:
         * <ol>
         *  <li>local: in the configuration of the widget's instance</li>
         *  <li>global: in the application's environment configuration</li>
         *  <li>hardcoded: in internal resources; it is used as a fallback</li>
         * </ol>
         * </p>
         *
         * <p>
         * As soon as a configuration contains a non-void value for the requested error message, this one is used for the return value.
         * </p>
         *
         * <p>
         * Note that since there are hardcoded values, there will always be an error message for a valid message name. However, if the message name is not supported, an <em>undefined</em> value is returned in the end.
         * </p>
         *
         * @param {String} errorMessageName The name of the error message to retrieve (it is the key to the requested message in the collection).
         *
         * @return {String} The retrieved error message if any, <em>undefined</em> if the message name is not supported.
         */
        getErrorMessage : function (errorMessageName) {
            // ----------------------------------------------- early termination

            if (errorMessageName == null) {
                return "";
            }

            // ------------------------------------------------------ processing

            var errorMessage;

            var widgetName = this._widgetName;

            // local -----------------------------------------------------------

            if (errorMessage == null) {
                errorMessage = this._defaultErrorMessages[errorMessageName];
            }

            // global ----------------------------------------------------------

            if (errorMessage == null) {
                var allMessages = aria.widgets.environment.WidgetSettings.getWidgetSettings()["defaultErrorMessages"];
                if (allMessages != null) {
                    var widgetMessages = allMessages[widgetName];
                    if (widgetMessages != null) {
                        errorMessage = widgetMessages[errorMessageName];
                    }
                }
            }

            // hardcoded -------------------------------------------------------

            if (errorMessage == null) {
                errorMessage = this.res.errors[widgetName][errorMessageName];
                /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1428) */
                errorMessage = this.res.errors[this._newKeysToOldKeysMap[widgetName][errorMessageName]];
                /* BACKWARD-COMPATIBILITY-END (GitHub #1428) */
            }

            // ---------------------------------------------------------- return

            return errorMessage;
        }
        /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1428) */
        ,
        _newKeysToOldKeysMap: {
            "NumberField" : {
                "validation" : "40006_WIDGET_NUMBERFIELD_VALIDATION"
            },
            "TimeField" : {
                "validation" : "40007_WIDGET_TIMEFIELD_VALIDATION"
            },
            "DateField" : {
                "validation" : "40008_WIDGET_DATEFIELD_VALIDATION",
                "minValue" : "40018_WIDGET_DATEFIELD_MINVALUE",
                "maxValue" : "40019_WIDGET_DATEFIELD_MAXVALUE"
            },
            "AutoComplete" : {
                "validation" : "40020_WIDGET_AUTOCOMPLETE_VALIDATION"
            }
        }
        /* BACKWARD-COMPATIBILITY-END (GitHub #1428) */
    }
});
