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
var ariaWidgetsCalendarCalendar = require("../calendar/Calendar");
var ariaWidgetsControllersDatePickerController = require("../controllers/DatePickerController");
var ariaWidgetsFormDatePickerStyle = require("./DatePickerStyle.tpl.css");
var ariaWidgetsCalendarCalendarStyle = require("../calendar/CalendarStyle.tpl.css");
var ariaWidgetsContainerDivStyle = require("../container/DivStyle.tpl.css");
var ariaWidgetsFormDropDownTextInput = require("./DropDownTextInput");

/**
 * DatePicker widget, which is a template-based widget.
 * @class aria.widgets.form.DatePicker
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.DatePicker",
    $extends : ariaWidgetsFormDropDownTextInput,
    $css : [ariaWidgetsFormDatePickerStyle, ariaWidgetsCalendarCalendarStyle, ariaWidgetsContainerDivStyle],
    $constructor : function (cfg, ctxt, lineNumber) {
        var controller = new ariaWidgetsControllersDatePickerController();
        this.$DropDownTextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);
        controller.setPattern(cfg.pattern);
        controller.setInputPattern(cfg.inputPattern);
        /*
         * Not implemented yet: controller.autoFill = cfg.autoFill; controller.focusOnField = cfg.focusOnfield;
         */
        if (cfg.minValue) {
            controller.setMinValue(new Date(cfg.minValue));
        }
        if (cfg.maxValue) {
            controller.setMaxValue(new Date(cfg.maxValue));
        }
        if (cfg.referenceDate) {
            controller.setReferenceDate(new Date(cfg.referenceDate));
        }
        this._dropDownIconFocus = false;
    },
    $destructor : function () {
        this._dropDownIcon = null;
        this.$DropDownTextInput.$destructor.call(this);
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "DatePicker",

        /**
         * Handle events raised by the frame
         * @protected
         * @param {Object} evt
         */
        _frame_events : function (evt) {

            if (evt.name === "iconFocus" && evt.iconName == "dropdown" && !this._cfg.disabled) {
                this._dropDownIconFocus = true;
            }
            if (evt.name === "iconBlur" && evt.iconName == "dropdown" && !this._cfg.disabled) {
                this._dropDownIconFocus = false;
            }
            this.$DropDownTextInput._frame_events.call(this, evt);
        },

        /**
         * Callback called when the user clicks on a date in the calendar.
         */
        _clickOnDate : function (evt) {
            // when clicking on a date in the calendar, close the calendar, and save the date
            var date = evt.date;
            this._closeDropdown();

            var report = this.controller.checkValue(date);
            this._reactToControllerReport(report);
        },

        _initInputMarkup : function () {
            this.$DropDownTextInput._initInputMarkup.apply(this, arguments);
            var dropDownIcon = null;
            if (this._frame.getIcon) {
                dropDownIcon = this._frame.getIcon("dropdown");
            }
            this.$assert(54, dropDownIcon);
            this._dropDownIcon = dropDownIcon;
        },

        /**
         * Set the caret position in the field
         * @param {Number} start
         * @param {Number} end
         */
        setCaretPosition : function (start, end) {
            if (this._dropDownIconFocus) {
                this._currentCaretPosition = {
                    start : start,
                    end : end
                };
            } else {
                return this.$DropDownTextInput.setCaretPosition.apply(this, arguments);
            }
        },

        /**
         * Return the caret position in the DatePicker. It works also if the focus is on the expand icon.
         * @return {Object} the caret position (start end end)
         */
        getCaretPosition : function () {
            if (this._dropDownIconFocus) {
                var currentCaretPosition = this._currentCaretPosition;
                if (currentCaretPosition) {
                    return currentCaretPosition;
                }
                return {
                    start : 0,
                    end : 0
                };
            } else {
                return this.$DropDownTextInput.getCaretPosition.apply(this, arguments);
            }
        },

        /**
         * Function called (either internally or externally) to set the focus on the DatePicker.
         * @override
         */
        focus : function () {
            if (this._dropdownPopup) {
                if (this._hasFocus && !this._dropDownIconFocus) {
                    // passing the focus from the text field to the icon
                    this._keepFocus = true;
                }
                // override the focus method so that calling focus on the DatePicker while it is open
                // actually focuses the dropdown icon
                // focusing the DatePicker while the popup is open means focusing the dropdown icon
                if (!this._dropDownIconFocus) {
                    this._dropDownIcon.focus();
                }
            } else {
                if (this._hasFocus && this._dropDownIconFocus) {
                    // passing the focus from the icon to the text field
                    this._keepFocus = true;
                }
                // do the normal action otherwise:
                this.$DropDownTextInput.focus.apply(this, arguments);
            }
        },

        /**
         * DOM Event raised when a click is done on the text field.
         */
        _dom_onclick : function () {
            this.$DropDownTextInput._dom_onclick.call(this);
            if (!this._dropDownIconFocus) {
                // clicking on the field while the popup is visible should close it
                this._closeDropdown();
            }
        },

        /**
         * Helper. Does mapping between calendar config property and datepicker configuration, including skin overriding
         * @protected
         * @param {String} property
         * @param {Object} targetCfg, targeted calendar configuration
         */
        _applyCalendarCfg : function (property, targetCfg) {
            var cfg = this._cfg, skinObj = this._skinObj;
            var calendarProp = 'calendar' + property.substring(0, 1).toUpperCase() + property.substring(1);
            targetCfg[property] = (typeof cfg[calendarProp] != 'undefined')
                    ? cfg[calendarProp]
                    : skinObj.calendar[property];
        },

        /**
         * Internal function to render the content of the dropdown div
         * @param {aria.templates.MarkupWriter} out Markup writer which should receive the content of the popup.
         * @protected
         */
        _renderDropdownContent : function (out) {
            var cfg = this._cfg;

            var dm = this.controller.getDataModel();

            var calendarConf = {
                block : true,
                startDate : dm.jsDate,
                tabIndex : -1,
                label : cfg.calendarLabel,
                defaultTemplate : cfg.calendarTemplate,
                minValue : cfg.minValue,
                maxValue : cfg.maxValue,
                onclick : {
                    fn : this._clickOnDate,
                    scope : this
                },
                bind : {
                    "value" : {
                        to : "calendarValue",
                        inside : dm
                    }
                }
            };

            // maps property from datepicker configuration
            var propMapped = ['displayUnit', 'numberOfUnits', 'firstDayOfWeek', 'monthLabelFormat',
                    'dayOfWeekLabelFormat', 'dateLabelFormat', 'completeDateLabelFormat', 'showWeekNumbers',
                    'showShortcuts', 'restrainedNavigation', 'sclass'];
            for (var i = 0, property; property = propMapped[i]; i++) {
                this._applyCalendarCfg(property, calendarConf);
            }

            var calendar = new ariaWidgetsCalendarCalendar(calendarConf, this._context, this._lineNumber);
            calendar.$on({
                'widgetContentReady' : this._refreshPopup,
                scope : this
            });
            this.controller.setCalendar(calendar);
            out.registerBehavior(calendar);
            calendar.writeMarkup(out);
        },

        _closeDropdown : function () {
            if (this._dropdownPopup) {
                this.$DropDownTextInput._closeDropdown.call(this);
                this.focus(null, true);
            }
        },

        _refreshPopup : function () {
            if (this._dropdownPopup) {
                this._dropdownPopup.refresh();
            }
        },

        _afterDropdownClose : function () {
            this.$DropDownTextInput._afterDropdownClose.call(this);
            this.controller.setCalendar(null);
        },

        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         * @protected
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName === 'referenceDate') {
                this.controller.setReferenceDate(newValue);
            } else {
                this.$DropDownTextInput._onBoundPropertyChange.call(this, propertyName, newValue, oldValue);
            }
        }
    }
});
