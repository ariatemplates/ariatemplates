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
 * Test case for the calendar controller.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.calendar.CalendarControllerTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.ModuleCtrlFactory", "aria.utils.Date"],
    $prototype : {
        _initCalendarCtrl : function (args, cb) {
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : "aria.widgets.calendar.CalendarController",
                initArgs : args
            }, {
                fn : this._initCalendarCtrlCb,
                scope : this,
                args : cb
            });
        },

        _initCalendarCtrlCb : function (res, cb) {
            this._calendarCtrlPrivate = res.moduleCtrlPrivate;
            var calendarCtrl = res.moduleCtrl;
            this._calendarCtrl = calendarCtrl;
            this.$callback(cb);
        },
        _disposeCalendar : function () {
            this._calendarCtrl.unregisterListeners(this);
            this._calendarCtrlPrivate.$dispose();
            this._calendarCtrl = null;
            this._calendarCtrlPrivate = null;
        },
        testAsyncNavigate : function () {
            this._initCalendarCtrl({
                settings : {
                    /* by default, the start date it is the current date */
                    value : new Date(2010, 1, 5),
                    numberOfUnits : 2,
                    displayUnit : "M",
                    firstDayOfWeek : 0
                }
            }, {
                fn : this._navigateTestCallback1,
                scope : this
            });
        },
        _navigateTestCallback1 : function () {
            try {
                var calendar = this._calendarCtrl.getData().calendar;
                // general tests before navigating to the specific date:
                this._generalCalendarChecks(calendar);
                this._generalMonthChecks(calendar, calendar.months[calendar.startMonthIndex]);
                this._generalWeekChecks(calendar, calendar.weeks[calendar.startWeekIndex]);
                this._calendarCtrl.registerListener({
                    fn : this._navigateTestCallback2,
                    scope : this
                });
                this._calendarCtrl.navigate(null, {
                    date : new Date(2010, 1, 25)
                });
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
        },
        _navigateTestCallback2 : function (evt) {
            if (evt.name == "update") {
                try {
                    this.assertTrue(evt.properties['startDate'] != null);
                    var dateUtils = aria.utils.Date;
                    var calendar = this._calendarCtrl.getData().calendar;
                    this._generalCalendarChecks(calendar);

                    // Checking month data:
                    var firstMonth = calendar.months[calendar.startMonthIndex];
                    this._generalMonthChecks(calendar, firstMonth);
                    this._checkFeb2010(firstMonth); // in this test: firstMonth must be february 2010

                    // Checking weeks data:
                    var firstWeek = calendar.weeks[calendar.startWeekIndex];
                    this._generalWeekChecks(calendar, firstWeek);
                    this._checkFirstWeekFeb2010(firstWeek);
                } catch (ex) {
                    this.handleAsyncTestError(ex, false);
                } finally {
                    this._disposeCalendar();
                    this.notifyTestEnd("testAsyncNavigate");
                }
            }
        },
        testAsyncCheckInitialContent : function () {
            this._initCalendarCtrl({
                settings : {
                    startDate : new Date(2010, 1, 25),
                    value : new Date(2010, 1, 5),
                    numberOfUnits : 2,
                    displayUnit : "M",
                    firstDayOfWeek : 0
                }
            }, {
                fn : this._checkInitialContentCallback,
                scope : this
            });
        },
        _checkInitialContentCallback : function () {
            try {
                var dateUtils = aria.utils.Date;
                var calendar = this._calendarCtrl.getData().calendar;
                this._generalCalendarChecks(calendar);

                // Checking month data:
                var firstMonth = calendar.months[calendar.startMonthIndex];
                this._generalMonthChecks(calendar, firstMonth);
                this._checkFeb2010(firstMonth); // in this test: firstMonth must be february 2010

                // Checking weeks data:
                var firstWeek = calendar.weeks[calendar.startWeekIndex];
                this._generalWeekChecks(calendar, firstWeek);
                this._checkFirstWeekFeb2010(firstWeek);

            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            } finally {
                this._disposeCalendar();
                this.notifyTestEnd("testAsyncCalendarContent");
            }
        },

        _checkFeb2010 : function (month) {
            var dateUtils = aria.utils.Date;
            this.assertTrue(dateUtils.isSameDay(month.firstOfMonth, new Date(2010, 1, 1)));
            this.assertTrue(month.daysInMonth == 28);
            this.assertTrue(month.daysBeforeStartOfMonth == 1);
            this.assertTrue(month.daysAfterEndOfMonth == 6);
            this.assertTrue(month.weeksInMonth == 5);
            this.assertTrue(month.wholeWeeksInMonth == 3);
        },
        _checkFirstWeekFeb2010 : function (week) {
            var dateUtils = aria.utils.Date;
            this.assertTrue(week.overlappingDays == 1);
            this.assertTrue(week.indexInMonth == 5);
            this.assertTrue(dateUtils.isSameDay(week.days[1].jsDate, new Date(2010, 1, 1))); // check february 1st
            this.assertTrue(week.days[0].isWeekend);
            this.assertTrue(week.days[0].isLastOfMonth);
            this.assertTrue(week.days[1].isFirstOfMonth);
            this.assertTrue(week.days[6].isWeekend);
            this.assertTrue(week.days[5].isSelected);
            this.assertTrue(week.days[3].isSelectable);
        },
        _generalCalendarChecks : function (calendar) {
            var dateUtils = aria.utils.Date;
            this.assertTrue(dateUtils.isSameDay(calendar.today, new Date()));
            this.assertEquals(calendar.daysOfWeek.length, 7);
            this.assertTrue(calendar.startMonthIndex < calendar.months.length);
            this.assertTrue(calendar.endMonthIndex < calendar.months.length);
            this.assertTrue(calendar.startMonthIndex <= calendar.endMonthIndex);
            this.assertTrue(calendar.startWeekIndex < calendar.weeks.length);
            this.assertTrue(calendar.endWeekIndex < calendar.weeks.length);
            this.assertTrue(calendar.startWeekIndex <= calendar.endWeekIndex);
            this.assertTrue(calendar.startDate < calendar.endDate);
        },
        _generalMonthChecks : function (calendar, month) {
            this.assertEquals(month.weeksInMonth, month.weeks.length);
            this.assertTrue(month.wholeWeeksInMonth <= month.weeksInMonth);
            this.assertEquals(month, calendar.months[month.monthKey]);
        },
        _generalWeekChecks : function (calendar, week) {
            var monthKey = week.month ? week.month : week.monthEnd;
            var month = calendar.months[monthKey];
            if (month) {
                this.assertEquals(month.weeks[week.indexInMonth], week);
            }
            this.assertEquals(week.days.length, 7);
            this.assertTrue(week.overlappingDays < 7);
            this.assertTrue(week.overlappingDays === 0 || (week.monthStart != null && week.monthEnd != null));
        },

        testAsyncBoundaryValues : function () {
            this._initCalendarCtrl({
                settings : {
                    startDate : new Date(2010, 1, 25),
                    value : new Date(2010, 1, 5),
                    minValue : new Date(2008, 8, 8),
                    maxValue : new Date(2013, 3, 3),
                    numberOfUnits : 2,
                    displayUnit : "M",
                    firstDayOfWeek : 0
                }
            }, {
                fn : this._checkBoundaryValues,
                scope : this
            });
        },
        _checkBoundaryValues : function () {
            try {
                this.assertTrue(this._calendarCtrlPrivate._isSelectable(new Date(2008, 8, 8, 0, 0, 0, 0)));
                this.assertTrue(this._calendarCtrlPrivate._isSelectable(new Date(2013, 3, 3, 23, 59, 59, 999)));
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            } finally {
                this._disposeCalendar();
                this.notifyTestEnd("testAsyncBoundaryValues");
            }
        }

    }
});
