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
 * @class aria.widgets.controllers.TimeController
 * @extends aria.widgets.controllers.TextDataController*
 */
Aria.classDefinition({
    $classpath : "aria.widgets.controllers.TimeController",
    $extends : "aria.widgets.controllers.TextDataController",
    $dependencies : ["aria.widgets.controllers.reports.ControllerReport", "aria.utils.Date", "aria.utils.environment.Date"],
    $resources : {
        "res" : "aria.widgets.WidgetsRes"
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
         * @param {aria.widgets.CfgBeans.TimeFieldCfg} pattern options
         */
        setPattern : function (pattern) {
            if (!pattern) {
                var pattern = aria.utils.environment.Date.getTimeFormats().longFormat;
            }
            this._pattern = pattern;
        },

        /**
         * override TextDataController.checkValue
         * @param {Date} internalValue - Internal value to be validated
         * @return {aria.widgets.controllers.reports.ControllerReport}
         */
        checkValue : function (internalValue) {
            var report = new aria.widgets.controllers.reports.ControllerReport();
            report.ok = (internalValue == null || aria.utils.Type.isDate(internalValue));
            if (report.ok) {
                this._dataModel.jsDate = internalValue;
                this._dataModel.displayText = (internalValue
                        ? aria.utils.Date.format(internalValue, this._pattern)
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
                var report = new aria.widgets.controllers.reports.ControllerReport(), timeUtil = aria.utils.Date;
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
            return (time && aria.utils.Type.isDate(time)) ? aria.utils.Date.format(time, this._pattern) : "";
        }

    }
});