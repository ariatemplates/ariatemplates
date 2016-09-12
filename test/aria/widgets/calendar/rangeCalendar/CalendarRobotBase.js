/*
 * Copyright 2014 Amadeus s.a.s.
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
var Aria = require("ariatemplates/Aria");
var arrayUtils = require("ariatemplates/utils/Array");
var domUtils = require("ariatemplates/utils/Dom");
var dateUtils = require("ariatemplates/utils/Date");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.calendar.rangeCalendar.BaseCalendarTest",
    $extends : require("ariatemplates/jsunit/RobotTestCase"),
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.lastMousePos = {
            x : 0,
            y : 0
        };
    },
    $prototype : {
        getTestedCalendar : function () {
            return this.getWidgetInstance("calendar");
        },

        getAllDatesDomElt : function () {
            var calendar = this.getTestedCalendar();
            var calendarDomElt = calendar.getDom();
            return domUtils.getElementsByClassName(calendarDomElt, "xCalendar_std_day");
        },

        getDomEltForDate : function (date) {
            var allDates = this.getAllDatesDomElt();
            var dateAttribute = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12).getTime();
            for (var i = 0, l = allDates.length; i < l; i++) {
                var curDate = allDates[i];
                if (curDate.getAttribute("data-date") == dateAttribute) {
                    return curDate;
                }
            }
            return null;
        },

        getSelectedDatesDomElements : function () {
            var allDates = this.getAllDatesDomElt();
            var res = [];
            for (var i = 0, l = allDates.length; i < l; i++) {
                var curDate = allDates[i];
                if (curDate.className.indexOf("xCalendar_std_selected") > -1) {
                    // this includes several classes:
                    // xCalendar_std_selected
                    // xCalendar_std_selected_from
                    // xCalendar_std_selected_to
                    // xCalendar_std_selected_from_to
                    // xCalendar_std_selected_same_from_to
                    res.push(curDate);
                }
            }
            return res;
        },

        assertSelectedDates : function (number, fromDate, toDate, cb) {

            this.waitFor({
                msg : function () {
                    return "The number of selected items is wrong: expected " + number + ", got "
                            + this.getSelectedDatesDomElements().length + ".";
                },
                condition : function () {
                    return number == this.getSelectedDatesDomElements().length;
                },
                callback : {
                    fn : function () {
                        var selectedItems = this.getSelectedDatesDomElements();
                        var selectedDates = [];
                        for (var i = 0, l = selectedItems.length; i < l; i++) {
                            selectedDates.push(parseInt(selectedItems[i].getAttribute("data-date"), 10));
                        }
                        if (fromDate) {
                            var curDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 12);
                            var endDateTime = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 12).getTime();
                            while (curDate.getTime() <= endDateTime) {
                                var removed = arrayUtils.remove(selectedDates, curDate.getTime());
                                this.assertTrue(removed, "The following date should be selected: " + curDate);
                                curDate.setDate(curDate.getDate() + 1);
                            }
                            this.assertEquals(selectedDates.length, 0, "Some selected dates are outside of the expected range: "
                                    + selectedDates.join(", "));
                        }

                        cb.call(this);
                    },
                    scope : this
                }
            });
        },

        assertDateEquals : function (date1, date2) {
            this.assertEquals(dateUtils.compare(date1, date2), 0, "The given dates are different: " + date1 + " "
                    + date2);
        },

        clickDate : function (targetDate, cb) {
            var lastMousePos = this.lastMousePos;
            var clickTarget = this.lastMousePos = this.getDomEltForDate(targetDate);
            this.synEvent.execute([["move", {
                                duration : 200,
                                to : clickTarget
                            }, lastMousePos], ["click", clickTarget]], cb);
        },

        hoverDate : function (targetDate, cb) {
            this.hoverDomElt(this.getDomEltForDate(targetDate), cb);
        },

        hoverDomElt : function (domElt, cb) {
            var lastMousePos = this.lastMousePos;
            this.lastMousePos = domElt;
            this.synEvent.execute([["move", {
                        duration : 200,
                        to : domElt
                    }, lastMousePos]], cb);
        },

        addDays : function (oldDate, dayDiff) {
            return new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate() + dayDiff);
        }
    }
});
