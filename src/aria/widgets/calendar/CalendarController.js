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
var ariaWidgetsCalendarICalendarController = require("./ICalendarController");
var dateUtils = require("../../utils/Date");
require("./CfgBeans");
var ariaUtilsEnvironmentDate = require("../../utils/environment/Date");
var ariaUtilsArray = require("../../utils/Array");
var ariaTemplatesModuleCtrl = require("../../templates/ModuleCtrl");
var ariaCoreJsonValidator = require("../../core/JsonValidator");

/**
 * Function to sort ranges by fromDate.
 * @param {aria.widgets.calendar.CfgBeans.Range} a
 * @param {aria.widgets.calendar.CfgBeans.Range} b
 * @return {Number} Returns -1 if a.fromDate < b.fromDate, 0 if a.fromDate == b.fromDate, and 1 if a.fromDate >
 * b.fromDate
 */
var sortByFromDate = function (a, b) {
    return dateUtils.compare(a.fromDate, b.fromDate);
};

/**
 * Compares the new value of the ranges property of a day with its old value and returns true if there was a meaningful
 * change and false otherwise.
 * @param {Array} oldValue old value of the ranges property
 * @param {Array} newValue new value of the ranges property
 * @return {Boolean}
 */
var checkChangesInDayRanges = function (oldValue, newValue) {
    if (!oldValue || !newValue) {
        return oldValue !== newValue;
    }
    var length = oldValue.length;
    if (newValue.length != length) {
        return true;
    }
    for (var i = 0; i < length; i++) {
        var oldValueElt = oldValue[i];
        var newValueElt = newValue[i];
        if (oldValueElt.range !== newValueElt.range || oldValueElt.positionInRange !== newValueElt.positionInRange) {
            return true;
        }
    }
    return false;
};

/**
 * Calendar controller which manages calendar data.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.calendar.CalendarController",
    $extends : ariaTemplatesModuleCtrl,
    $implements : [ariaWidgetsCalendarICalendarController],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this._dataBeanName = "aria.widgets.calendar.CfgBeans.CalendarModel";
        /* map of changed settings since last update: all for first update */
        this._changedSettings = {
            "value" : {},
            "minValue" : {},
            "maxValue" : {},
            "startDate" : {},
            "displayUnit" : {},
            "numberOfUnits" : {},
            "firstDayOfWeek" : {},
            "monthLabelFormat" : {},
            "dayOfWeekLabelFormat" : {},
            "dateLabelFormat" : {},
            "completeDateLabelFormat" : {},
            "ranges" : {}
        };
        this._changedSettingsNbr = 12;
        this._hasRanges = false;
    },
    $destructor : function () {
        if (this._jsonListener) {
            this.json.removeListener(this._calendarSettings, null, this._jsonListener);
            this._jsonListener = null;
        }
        this._calendarData = null;
        this._calendarSettings = null;
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $hasFlowCtrl : false,

        $publicInterfaceName : "aria.widgets.calendar.ICalendarController",

        /**
         * Map of properties inside this._calendarSettings.
         */
        _settingsProperties : {
            "value" : {
                isDate : true
            },
            "minValue" : {
                isDate : true
            },
            "maxValue" : {
                isDate : true
            },
            "startDate" : {
                isDate : true
            },
            "displayUnit" : {},
            "numberOfUnits" : {},
            "firstDayOfWeek" : {},
            "monthLabelFormat" : {},
            "dayOfWeekLabelFormat" : {},
            "dateLabelFormat" : {},
            "completeDateLabelFormat" : {},
            "ranges" : {}
        },
        _defaultKeyActions : {
            33 : {/* KC_PAGE_UP */
                increment : -1,
                incrementUnit : "M"
            },
            34 : {/* KC_PAGE_DOWN */
                increment : 1,
                incrementUnit : "M"
            },
            35 : {/* KC_END */
                refDate : "maxValue"
            },
            36 : {/* KC_HOME */
                refDate : "minValue"
            },
            37 : {/* KC_ARROW_LEFT */
                increment : -1,
                incrementUnit : "D"
            },
            38 : {/* KC_ARROW_UP */
                increment : -7,
                incrementUnit : "D"
            },
            39 : {/* KC_ARROW_RIGHT */
                increment : 1,
                incrementUnit : "D"
            },
            40 : {/* KC_ARROW_DOWN */
                increment : 7,
                incrementUnit : "D"
            }
        },
        _jsonDataChanged : function (args) {
            var dataName = args.dataName;
            var property = this._settingsProperties[dataName];
            if (property) {
                var changeInfo = this._changedSettings[dataName];
                if (changeInfo == null) {
                    changeInfo = {
                        oldValue : args.oldValue,
                        newValue : args.newValue
                    };
                    this._changedSettingsNbr++;
                }
                if (changeInfo.oldValue === args.newValue
                        || (property.isDate && dateUtils.isSameDay(changeInfo.oldValue, args.newValue))) {
                    changeInfo = null;
                    this._changedSettingsNbr--;
                }
                this._changedSettings[dataName] = changeInfo;
            }
        },
        init : function (data, cb) {
            if (!data) {
                data = {};
            }
            data.calendar = {};
            if (!data.settings) {
                data.settings = {};
            }
            var settings = data.settings;
            this._data = data;
            this._calendarSettings = settings;
            this._calendarData = data.calendar;
            if (!settings.startDate) {
                settings.startDate = new Date();
            }
            if (!settings.completeDateLabelFormat) {
                settings.completeDateLabelFormat = ariaUtilsEnvironmentDate.getDateFormats().longFormat;
            }
            if (settings.firstDayOfWeek == null) { // compare to null because 0 is a valid value
                settings.firstDayOfWeek = ariaUtilsEnvironmentDate.getFirstDayOfWeek();
            }
            ariaCoreJsonValidator.normalize({
                json : this._calendarSettings,
                beanName : "aria.widgets.calendar.CfgBeans.CalendarSettings"
            });
            this.update();
            this._jsonListener = {
                fn : this._jsonDataChanged,
                scope : this
            };
            this.json.addListener(settings, null, this._jsonListener, true);
            this.$callback(cb);
        },
        /**
         * Notify the calendar controller that the focus changed, and give the new value of the focus.
         * @param {Boolean} calendarFocused new value of the focus.
         * @return {Boolean} if true, the default focus visual notification should not be displayed
         */
        notifyFocusChanged : function (calendarFocused) {
            var evt = {
                name : "focusChanged",
                focus : calendarFocused,
                cancelDefault : false
            };
            this.json.setValue(this._data.settings, "focus", calendarFocused);
            this.$raiseEvent(evt);
            return evt.cancelDefault;
        },
        /**
         * Notify the calendar controller that a key has been pressed. The controller reacts by sending a keyevent
         * event. Upon receiving that event, listeners can either ignore it, which leads to the default action being
         * executed when returning from the event, or they can override the default action by changing event properties.
         * @param {Object} Any object with the charCode and keyCode properties which specify which key has been pressed.
         * Any other property in this object is ignored.
         * @return {Boolean} true if the default action should be canceled, false otherwise
         */
        keyevent : function (evtInfo) {
            var evt = {
                name : "keyevent",
                charCode : evtInfo.charCode,
                keyCode : evtInfo.keyCode,
                cancelDefault : false
            };
            var defActions = this._defaultKeyActions[evt.keyCode];
            if (defActions != null) {
                evt.cancelDefault = true; // if there is a default action from _defaultKeyActions, browser action
                // should be canceled
                this.json.inject(defActions, evt, false);
            }
            this.$raiseEvent(evt);
            var newValue = this._transformDate(this._calendarSettings.value, evt);
            if (newValue) {
                this.selectDay({
                    date : newValue
                });
            }
            return (evt.cancelDefault === true);
        },
        /**
         * Return information about the position of the given JavaScript date in the calendar data model.
         * @param {Date} JavaScript date
         * @return {aria.widgets.calendar.CfgBeans:DatePosition} position of the date in the calendar data model, or
         * null if the date cannot be found in the current calendar data model.
         */
        getDatePosition : function (jsDate) {
            var calendar = this._calendarData;
            var diff = dateUtils.dayDifference(this._realStartDate, jsDate);
            var weekIndex = Math.floor(diff / 7);
            if (weekIndex < 0 || weekIndex >= calendar.weeks.length) {
                return null;
            }
            var week = calendar.weeks[weekIndex];
            var dayInWeekIndex = diff % 7;
            var day = week.days[dayInWeekIndex];
            this.$assert(228, dateUtils.isSameDay(jsDate, day.jsDate));
            var weekInMonthIndex = null;
            var monthIndex = null;
            var month = calendar.months[day.monthKey];
            if (month != null) {
                // the month may not be present (e.g.: for a day at the end of the last week, which is in the month
                // after the last month)
                monthIndex = ariaUtilsArray.indexOf(calendar.months, month);
                this.$assert(239, month == calendar.months[monthIndex]);
                if (day.monthKey == week.month || day.monthKey == week.monthEnd) {
                    weekInMonthIndex = week.indexInMonth;
                } else {
                    weekInMonthIndex = 0; // first week in the month
                }
                this.$assert(245, month.weeks[weekInMonthIndex] == week);
            }
            return {
                weekIndex : weekIndex,
                monthIndex : monthIndex,
                weekInMonthIndex : weekInMonthIndex,
                dayInWeekIndex : dayInWeekIndex,
                month : month,
                week : week,
                day : day
            };
        },
        /**
         * Notify the calendar controller that the user has moved the mouse on a date.
         */
        dateMouseOver : function (args) {
            var evt = {
                name : "dateMouseOver",
                date : args.date,
                cancelDefault : false
            };
            this.$raiseEvent(evt);
            return (evt.cancelDefault === true);
        },
        /**
         * Notify the calendar controller that the user has moved the mouse out of a date.
         */
        dateMouseOut : function (args) {
            var evt = {
                name : "dateMouseOut",
                date : args.date,
                cancelDefault : false
            };
            this.$raiseEvent(evt);
            return (evt.cancelDefault === true);
        },
        /**
         * Notify the calendar controller that the user has clicked on a date.
         */
        dateClick : function (args) {
            var evt = {
                name : "dateClick",
                date : args.date,
                cancelDefault : false
            };
            this.$raiseEvent(evt);
            if (this._data && evt.cancelDefault !== true) {
                // we check this._data because because in the click event, the calendar controller
                // may have been disposed (e.g. in the datePicker)
                this.selectDay({
                    date : evt.date
                });
            }
            return (evt.cancelDefault === true);
        },
        /**
         * Navigate to the next page, the previous page or to a specific date.
         */
        navigate : function (evt, args) {

            if (evt && evt.preventDefault) {
                // Don't follow the link
                evt.preventDefault();
            }

            var curStartDate = this._calendarData.startDate;
            var newStartDate = this._transformDate(curStartDate, args);
            if (newStartDate == null) {
                return;
            }
            if (dateUtils.isSameDay(curStartDate, newStartDate)
                    || dateUtils.isSameDay(this._calendarSettings.startDate, newStartDate))
                return;
            this.json.setValue(this._calendarSettings, "startDate", newStartDate);
            this.update();
        },
        selectDay : function (args) {
            var newValue = args.date;
            if (!newValue || this._isSelectable(newValue)) {
                this.json.setValue(this._calendarSettings, "value", newValue);
                if (args.ensureVisible !== false) {
                    this._ensureDateVisible(newValue);
                }
                this.update();
            }
        },

        /**
         * Ensure the date given as a parameter is visible on the active page, otherwise, changes the start date
         * @private
         */
        _ensureDateVisible : function (jsDate) {
            if (jsDate) {
                var calendar = this._calendarData;
                if (dateUtils.dayDifference(jsDate, calendar.startDate) > 0
                        || dateUtils.dayDifference(jsDate, calendar.endDate) < 0 || this._changedSettings["startDate"]) {
                    this.json.setValue(this._calendarSettings, "startDate", jsDate);
                }
            }
        },
        _getMonthKey : function (jsDate) {
            return [jsDate.getMonth(), jsDate.getFullYear()].join('-');
        },

        /**
         * Sets the ranges of dates to be highlighted in the calendar.
         * @param {Array} ranges Array of ranges (of type aria.widgets.calendar.CfgBeans.Range) to be highlighted.
         */
        setRanges : function (ranges) {
            this.json.setValue(this._calendarSettings, "ranges", ranges);
            this.update();
        },

        /**
         * Returns a filtered and sorted array of ranges extracted from this._calendarSettings.ranges. Only the ranges
         * related to the dates present in the current data model of the calendar are kept, and they are sorted by the
         * fromDate property.
         * @return {Array}
         */
        _getFilteredRanges : function () {
            var calendarStart = this._realStartDate;
            var calendarEnd = this._realEndDate;
            var ranges = this._calendarSettings.ranges;
            var filteredRanges = [];
            for (var i = 0, l = ranges.length; i < l; i++) {
                var curRange = ranges[i];
                var fromDate = curRange.fromDate;
                var toDate = curRange.toDate;
                var keepRange = dateUtils.compare(fromDate, toDate) <= 0
                        && dateUtils.compare(calendarStart, toDate) <= 0
                        && dateUtils.compare(fromDate, calendarEnd) <= 0;
                if (keepRange) {
                    filteredRanges.push(curRange);
                }
            }
            return filteredRanges.sort(sortByFromDate);
        },

        /**
         * Computes and returns the set of ranges the given date belongs to.
         * @param {Date} jsDate Date for which the set of ranges is to be computed.
         * @param {Array} filteredRanges Note that this function can change this array to remove ranges whose toDate
         * property is after jsDate.
         * @return {Array} value to be stored in the ranges property of the day object.
         */
        _computeDayRanges : function (jsDate, filteredRanges) {
            var dayRanges = null;
            for (var i = 0, l = filteredRanges.length; i < l; i++) {
                var curRange = filteredRanges[i];
                var fromDatePos = dateUtils.compare(curRange.fromDate, jsDate);
                if (fromDatePos > 0) {
                    // in filteredRanges, ranges are sorted by start date, so as soon as we find
                    // a range which is not yet started, all the following ones will also be in the future
                    break;
                }
                var toDatePos = dateUtils.compare(jsDate, curRange.toDate);
                if (toDatePos > 0) {
                    // if the range has already ended, we can remove it from filteredRanges as all later
                    // dates will not be in the range either
                    filteredRanges.splice(i, 1);
                    l--;
                    i--;
                    continue;
                }
                // here: rangeStarted && rangeStillOngoing
                if (!dayRanges) {
                    dayRanges = [];
                }
                dayRanges.push({
                    range : curRange,
                    positionInRange : fromDatePos === 0 ? (toDatePos === 0 ? "sameFromTo" : "from") : (toDatePos === 0
                            ? "to"
                            : "fromTo")
                });
            }
            return dayRanges;
        },

        /**
         * Updates the range property of all days in the data model of the calendar, optionally filling the
         * changedPositions array with the positions of days for which the range property changed.
         * @param {Array} changedPositions Array of aria.widgets.calendar.CfgBeans.DatePosition Array to be filled with
         * the positions of days for which the range property changed. This parameter can be omitted if the list of
         * changes is not needed.
         */
        _updateRanges : function (changedPositions) {
            var hasNoInitialRange = !this._hasRanges;
            this._hasRanges = false;
            var filteredRanges = this._getFilteredRanges();
            if (hasNoInitialRange && filteredRanges.length === 0) {
                return;
            }
            var months = this._calendarData.months;
            var weeks = this._calendarData.weeks;
            for (var weekIndex = 0, weeksLength = weeks.length; weekIndex < weeksLength; weekIndex++) {
                var week = weeks[weekIndex];
                for (var dayInWeekIndex = 0; dayInWeekIndex < 7; dayInWeekIndex++) {
                    var day = week.days[dayInWeekIndex];
                    var dayRanges = this._computeDayRanges(day.jsDate, filteredRanges);
                    if (dayRanges) {
                        this._hasRanges = true;
                    }
                    if (changedPositions) {
                        var hasChanged = checkChangesInDayRanges(dayRanges, day.ranges);
                        if (hasChanged) {
                            var month = months[day.monthKey];
                            changedPositions.push({
                                weekIndex : weekIndex,
                                monthIndex : month ? ariaUtilsArray.indexOf(months, month) : null,
                                weekInMonthIndex : (day.monthKey == week.month || day.monthKey == week.monthEnd)
                                        ? week.indexInMonth
                                        : 0,
                                dayInWeekIndex : dayInWeekIndex,
                                month : month,
                                week : week,
                                day : day
                            });
                            this.json.setValue(day, "ranges", dayRanges);
                        }
                    } else {
                        this.json.setValue(day, "ranges", dayRanges);
                    }
                    if (hasNoInitialRange && filteredRanges.length === 0) {
                        return;
                    }
                }
            }
        },

        /**
         *
         */
        update : function () {
            if (this._changedSettingsNbr === 0) {
                // no need to update if no property changed
                return;
            }
            var json = this.json;
            var changed = this._changedSettings;
            var calendar = this._calendarData;
            var settings = this._calendarSettings;
            if (changed["minValue"]) {
                // remove time, so that comparisons with current value are correct
                json.setValue(settings, "minValue", dateUtils.removeTime(settings.minValue));
            }
            if (changed["maxValue"]) {
                // remove time, so that comparisons with current value are correct
                json.setValue(settings, "maxValue", dateUtils.removeTime(settings.maxValue));
            }
            if (changed["value"] || changed["minValue"] || changed["maxValue"]) {
                // calling the following method can change the value
                this._checkValue();
            }
            var valueChanged = changed["value"];
            var rangesChanged = changed["ranges"];
            var optimizedUpdate = (this._changedSettingsNbr == 1 && (valueChanged || rangesChanged))
                    || (this._changedSettingsNbr == 2 && valueChanged && rangesChanged);
            if (optimizedUpdate) {
                // only the value and/or ranges changed, optimize that very frequent case
                if (valueChanged) {
                    var oldDate = changed["value"].oldValue;
                    var newDate = settings.value;
                    if (oldDate) {
                        // unselect old date
                        var oldPosition = this.getDatePosition(oldDate);
                        if (oldPosition) {
                            oldPosition.day.isSelected = false;
                            valueChanged.oldValuePosition = oldPosition;
                        }
                    }
                    if (newDate) {
                        // select new date
                        var newPosition = this.getDatePosition(newDate);
                        if (newPosition) {
                            newPosition.day.isSelected = true;
                            valueChanged.newValuePosition = newPosition;
                        }
                    }
                }
                if (rangesChanged) {
                    rangesChanged.changedPositions = [];
                    this._updateRanges(rangesChanged.changedPositions);
                }
            } else {
                if (changed["firstDayOfWeek"] || changed["dayOfWeekLabelFormat"]) {
                    json.setValue(calendar, "daysOfWeek", this._createDaysOfWeek());
                }

                // TODO: do less things according to the properties in changed and the already computed properties
                json.setValue(calendar, "today", new Date());
                var startDate = new Date(settings.startDate); // must be the first day of the time unit (either
                // the
                // first day of a week or the first day of a month)
                var realStartDate; // must be the first day of a week, and must include the whole month containing
                // startDate
                var endDate; // must be the last day of the time unit (either the last day of a week or the last
                // day
                // of a month)
                var realEndDate; // must be the first day of a week and must include the whole month containing
                // endDate
                if (settings.displayUnit == "W") {
                    startDate = dateUtils.getStartOfWeek(startDate, settings.firstDayOfWeek);
                    realStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 12);
                    realStartDate = dateUtils.getStartOfWeek(realStartDate, settings.firstDayOfWeek);
                    endDate = new Date(startDate.getTime());
                    endDate.setDate(endDate.getDate() + 7 * settings.numberOfUnits - 1);
                    realEndDate = new Date(endDate.getTime());
                    realEndDate.setDate(32);
                    realEndDate.setDate(1);
                } else /* if (settings.displayUnit == "M") */{
                    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 12);
                    realStartDate = dateUtils.getStartOfWeek(startDate, settings.firstDayOfWeek);
                    endDate = new Date(startDate.getTime());
                    endDate.setMonth(endDate.getMonth() + settings.numberOfUnits);
                    endDate.setDate(endDate.getDate() - 1); // last day of the month
                    realEndDate = new Date(endDate.getTime());
                    realEndDate.setDate(realEndDate.getDate() + 1);
                }
                // currently, we never reuse existing data; we do not cache calendar data, which could be a good
                // optimization
                var weeks = [];
                var months = [];
                this._createMonthsAndWeeks(realStartDate, realEndDate, weeks, months);
                this._hasRanges = false;
                json.setValue(calendar, "startDate", startDate);
                json.setValue(calendar, "endDate", endDate);
                json.setValue(calendar, "weeks", weeks);
                json.setValue(calendar, "months", months);
                json.setValue(calendar, "startMonthIndex", 0); // if changing this, also change getDatePosition()
                json.setValue(calendar, "endMonthIndex", months.length - 1);
                json.setValue(calendar, "startWeekIndex", Math.floor(dateUtils.dayDifference(realStartDate, startDate)
                        / 7));
                json.setValue(calendar, "endWeekIndex", Math.floor(dateUtils.dayDifference(realStartDate, endDate) / 7));
                this.$assert(128, calendar.endMonthIndex < months.length);
                this.$assert(129, calendar.endWeekIndex < weeks.length);
                var minValue = settings.minValue;
                var maxValue = settings.maxValue;
                json.setValue(calendar, "previousPageEnabled", !minValue || minValue < startDate);
                json.setValue(calendar, "nextPageEnabled", !maxValue || maxValue > endDate);
                this._realStartDate = realStartDate; // save the start date for future use
                this._realEndDate = realEndDate;
                this._updateRanges();
            }

            /*
             * aria.core.JsonValidator.normalize({ json : this._data, beanName : this._dataBeanName });
             */
            var oldChangedSettings = this._changedSettings;
            var oldChangedSettingsNbr = this._changedSettingsNbr;
            this._changedSettings = {};
            this._changedSettingsNbr = 0;
            this.$raiseEvent({
                name : "update",
                properties : oldChangedSettings,
                propertiesNbr : oldChangedSettingsNbr,
                propertyshowShortcuts : settings.showShortcuts
            });
        },
        _transformDate : function (oldDate, changeInfo) {
            var newValue;
            if (changeInfo.increment != null) {
                if (oldDate == null) {
                    oldDate = this._calendarSettings.startDate;
                }
                newValue = new Date(oldDate);
                if (changeInfo.incrementUnit == "M") {
                    var oldMonth = newValue.getMonth();
                    newValue.setMonth(oldMonth + changeInfo.increment);
                    if ((24 + oldMonth + changeInfo.increment) % 12 != newValue.getMonth()) {
                        // the previous month does not have enough days, go to its last day
                        newValue.setDate(0);
                    }
                } else if (changeInfo.incrementUnit == "D") {
                    newValue.setDate(newValue.getDate() + changeInfo.increment);
                } else /* if (incrementUnit == "W") */{
                    newValue.setDate(newValue.getDate() + 7 * changeInfo.increment);
                }
            } else if (changeInfo.refDate) {
                var refDate = changeInfo.refDate;
                if (refDate == "minValue") {
                    if (this._calendarSettings.minValue) {
                        newValue = this._calendarSettings.minValue;
                    }
                } else if (refDate == "maxValue") {
                    if (this._calendarSettings.maxValue) {
                        newValue = this._calendarSettings.maxValue;
                    }
                }
            } else if (changeInfo.date) {
                newValue = new Date(changeInfo.date);
            }
            return newValue;
        },
        _createDaysOfWeek : function () {
            var days = [];
            var dayOfWeekLabelFormat = this._calendarSettings.dayOfWeekLabelFormat;
            var date = dateUtils.getStartOfWeek(new Date(), this._calendarSettings.firstDayOfWeek);
            for (var i = 0; i < 7; i++) {
                days.push({
                    label : dateUtils.format(date, dayOfWeekLabelFormat),
                    day : date.getDay()
                });
                date.setDate(date.getDate() + 1);
            }
            return days;
        },
        _createMonthsAndWeeks : function (startDate, endDate, weeks, months) {
            var curDate = new Date(startDate.getTime());
            var curMonth = (curDate.getDate() == 1 ? curDate.getMonth() : null);
            while (curDate < endDate) {
                var week = this._createWeek(curDate); // this also changes curDate
                weeks.push(week);
                if (curDate.getMonth() != curMonth) {
                    // the first day of the new week is in a different month than the first day
                    // of the previous week, so a month has just ended
                    if (curMonth != null) {
                        // create the month only if all the weeks of the month have been created
                        var month = this._createMonth(weeks, weeks.length - 1);
                        months.push(month);
                        months[month.monthKey] = month;
                    }
                    curMonth = curDate.getMonth(); // set curMonth so that, at the end of the month, the month will
                    // be created
                }
            }
        },
        _createWeek : function (currentDate) {
            var overlappingDays = 0;
            var monthKey;
            var days = [];
            var res = {
                days : days,
                indexInMonth : 1 + Math.floor((currentDate.getDate() - 2) / 7),
                weekNumber : dateUtils.dayOfWeekNbrSinceStartOfYear(currentDate)
            };
            for (var i = 0; i < 7; i++) {
                var day = this._createDay(currentDate);
                days.push(day);
                if (!monthKey) {
                    monthKey = day.monthKey;
                } else if (overlappingDays === 0 && monthKey != day.monthKey) {
                    overlappingDays = i;
                }
                if (currentDate.getDate() == 1) {
                    res.monthStart = day.monthKey;
                    day.isFirstOfMonth = true;
                }
                currentDate.setDate(currentDate.getDate() + 1);
                if (currentDate.getDate() == 1) {
                    // the next day is the first of a month, so 'day' is the last of the month
                    res.monthEnd = day.monthKey;
                    day.isLastOfMonth = true;
                }
            }
            res.overlappingDays = overlappingDays;
            if (overlappingDays === 0) {
                res.month = monthKey;
            }
            return res;
        },
        _isSelectable : function (jsDate) {
            var settings = this._calendarSettings;
            var minValue = settings.minValue;
            var maxValue = settings.maxValue;
            return (!minValue || jsDate >= minValue)
                    && (!maxValue || jsDate <= maxValue || dateUtils.isSameDay(jsDate, maxValue));
        },
        _checkValue : function () {
            var settings = this._calendarSettings;
            var value = settings.value;
            var minValue = settings.minValue;
            var maxValue = settings.maxValue;
            var newValue = value;
            if (value == null) {
                return;
            }
            if (minValue && minValue > value) {
                newValue = minValue;
            }
            if (maxValue && maxValue < value) {
                newValue = maxValue;
            }
            if (newValue != value) {
                if (minValue > maxValue) {
                    newValue = null;
                }
                this.json.setValue(settings, "value", newValue);
            }
        },
        _createDay : function (jsDate) {
            var settings = this._calendarSettings;
            var date = new Date(jsDate.getFullYear(), jsDate.getMonth(), jsDate.getDate(), 12); // copying the date
            // object
            var day = jsDate.getDay();
            var res = {
                jsDate : date,
                label : dateUtils.format(date, settings.dateLabelFormat),
                monthKey : this._getMonthKey(jsDate),
                ranges : null
            };
            if (day === 0 || day === 6) {
                res.isWeekend = true;
            }
            if (dateUtils.isSameDay(date, this._calendarData.today)) {
                res.isToday = true;
            }
            if (dateUtils.isSameDay(date, settings.value)) {
                res.isSelected = true;
            }
            res.isSelectable = this._isSelectable(date);
            // isFirstOfMonth and isLastOfMonth are defined in _createWeek()
            return res;

        },
        _createMonth : function (weeksArray, lastWeekIndex) {
            var lastWeek = weeksArray[lastWeekIndex];
            var monthKey = lastWeek.days[0].monthKey; // the first day of the last week in the month
            var weeks = [];
            var res = {
                monthKey : monthKey,
                weeks : weeks
            };
            for (var i = lastWeekIndex; i >= 0; i--) {
                var week = weeksArray[i];
                weeks.unshift(week);
                if (week.monthStart == monthKey) {
                    // we have reached the begining of the month
                    break;
                }
            }
            var firstWeek = weeks[0];
            this.$assert(260, firstWeek.monthStart == monthKey);
            var firstOfMonth = firstWeek.days[firstWeek.overlappingDays].jsDate;
            res.firstOfMonth = firstOfMonth;
            res.label = dateUtils.format(firstOfMonth, this._calendarSettings.monthLabelFormat);
            res.weeksInMonth = weeks.length;
            res.daysBeforeStartOfMonth = firstWeek.overlappingDays;
            res.daysAfterEndOfMonth = (lastWeek.overlappingDays > 0 ? 7 - lastWeek.overlappingDays : 0);
            res.daysInMonth = weeks.length * 7 - res.daysBeforeStartOfMonth - res.daysAfterEndOfMonth;
            res.wholeWeeksInMonth = weeks.length - (firstWeek.overlappingDays > 0 ? 1 : 0)
                    - (lastWeek.overlappingDays > 0 ? 1 : 0);
            return res;
        }
    }
});
