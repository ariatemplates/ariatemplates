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
var domUtils = require("ariatemplates/utils/Dom");
var jsonUtils = require("ariatemplates/utils/Json");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.calendar.rangeCalendar.RangeCalendar2",
    $extends : require("./BaseCalendarTest"),
    $prototype : {
        runTemplateTest : function () {
            var self = this;
            var data = self.templateCtxt.data;
            var fromDate;
            var toDate;
            var hoverDate;

            function step0 () {
                self.assertSelectedDates(0, null, null, function () {
                    self.assertFalsy(data.fromDate);
                    self.assertFalsy(data.toDate);
                    self.assertFalsy(data.fromDateCalendar);
                    self.assertFalsy(data.toDateCalendar);
                    self.assertEquals(data.activeDate, "fromDate");

                    hoverDate = self.addDays(new Date(), 3);
                    self.hoverDate(hoverDate, step1);
                });
            }

            function step1 () {
                self.assertSelectedDates(1, hoverDate, hoverDate, function () {
                    self.assertFalsy(data.fromDate);
                    self.assertFalsy(data.toDate);
                    self.assertDateEquals(data.fromDateCalendar, hoverDate);
                    self.assertFalsy(data.toDateCalendar);
                    self.assertEquals(data.activeDate, "fromDate");

                    fromDate = hoverDate;
                    self.clickDate(fromDate, step2);
                });
            }

            function step2 () {
                self.assertSelectedDates(1, fromDate, fromDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertFalsy(data.toDate);
                    self.assertDateEquals(data.fromDateCalendar, fromDate);
                    self.assertFalsy(data.toDateCalendar);
                    self.assertEquals(data.activeDate, "toDate");

                    hoverDate = self.addDays(fromDate, 3);
                    self.hoverDate(hoverDate, step3);
                });
            }

            function step3 () {
                self.assertSelectedDates(4, fromDate, hoverDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertFalsy(data.toDate);
                    self.assertDateEquals(data.fromDateCalendar, fromDate);
                    self.assertDateEquals(data.toDateCalendar, hoverDate);
                    self.assertEquals(data.activeDate, "toDate");

                    toDate = hoverDate;
                    self.clickDate(toDate, step4);
                });
            }

            function step4 () {
                self.assertSelectedDates(4, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);
                    self.assertDateEquals(data.fromDateCalendar, fromDate);
                    self.assertDateEquals(data.toDateCalendar, toDate);
                    self.assertEquals(data.activeDate, "fromDate");

                    hoverDate = new Date();
                    self.hoverDate(hoverDate, step5);
                });
            }

            function step5 () {
                self.assertSelectedDates(7, hoverDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);
                    self.assertDateEquals(data.fromDateCalendar, hoverDate);
                    self.assertDateEquals(data.toDateCalendar, toDate);
                    self.assertEquals(data.activeDate, "fromDate");

                    hoverDate = self.addDays(toDate, 4);
                    self.hoverDate(hoverDate, step6);
                });
            }

            function step6 () {
                self.assertSelectedDates(4, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);
                    self.assertDateEquals(data.fromDateCalendar, fromDate);
                    self.assertDateEquals(data.toDateCalendar, toDate);
                    self.assertEquals(data.activeDate, "fromDate");

                    hoverDate = null;
                    self.hoverDomElt(self.getElementById("toDateDisplay"), step7);
                });
            }

            function step7 () {
                self.assertSelectedDates(4, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);
                    self.assertDateEquals(data.fromDateCalendar, fromDate);
                    self.assertDateEquals(data.toDateCalendar, toDate);
                    self.assertEquals(data.activeDate, "fromDate");

                    fromDate = self.addDays(toDate, 2);
                    toDate = null;
                    self.synEvent.type(null, "[right][right][enter]", step8);
                });
            }

            function step8 () {
                self.assertSelectedDates(1, fromDate, fromDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertFalsy(data.toDate);
                    self.assertDateEquals(data.fromDateCalendar, fromDate);
                    self.assertFalsy(data.toDateCalendar);
                    self.assertEquals(data.activeDate, "toDate");

                    toDate = self.addDays(fromDate, 2);
                    self.synEvent.type(null, "[right][right][enter]", step9);
                });
            }

            function step9 () {
                self.assertSelectedDates(3, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);
                    self.assertDateEquals(data.fromDateCalendar, fromDate);
                    self.assertDateEquals(data.toDateCalendar, toDate);
                    self.assertEquals(data.activeDate, "fromDate");

                    self.synEvent.click(self.getElementById("toDateDisplay"), step10);
                });
            }

            function step10 () {
                self.assertSelectedDates(3, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);
                    self.assertDateEquals(data.fromDateCalendar, fromDate);
                    self.assertDateEquals(data.toDateCalendar, toDate);
                    self.assertEquals(data.activeDate, "toDate");

                    hoverDate = self.addDays(toDate, 5);
                    self.hoverDate(hoverDate, step11);
                });
            }

            function step11 () {
                self.assertSelectedDates(8, fromDate, hoverDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);
                    self.assertDateEquals(data.fromDateCalendar, fromDate);
                    self.assertDateEquals(data.toDateCalendar, hoverDate);
                    self.assertEquals(data.activeDate, "toDate");

                    self.end();
                });
            }

            this.synEvent.execute([["mouseMove", {
                        x : 0,
                        y : 0
                    }]], step0);
        }
    }
});
