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
    $classpath : "test.aria.widgets.calendar.rangeCalendar.RangeCalendar1",
    $extends : require("./BaseCalendarTest"),
    $prototype : {
        runTemplateTest : function () {
            var data = this.templateCtxt.data;
            var self = this;
            var fromDate;
            var toDate;

            function step0 () {
                self.assertSelectedDates(0, null, null, function () {
                    self.assertFalsy(data.fromDate);
                    self.assertFalsy(data.toDate);

                    fromDate = self.addDays(new Date(), 3);
                    self.clickDate(fromDate, step1);
                });
            }

            function step1 () {
                self.assertSelectedDates(1, fromDate, fromDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertFalsy(data.toDate);

                    toDate = self.addDays(fromDate, 3);
                    self.clickDate(toDate, step2);
                });
            }

            function step2 () {
                self.assertSelectedDates(4, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);

                    fromDate = toDate;
                    toDate = self.addDays(toDate, 14);
                    self.synEvent.type(null, "[down][down][enter]", step3);
                });
            }

            function step3 () {
                self.assertSelectedDates(15, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);

                    fromDate = self.addDays(fromDate, 5);
                    self.clickDate(fromDate, step4);
                });
            }

            function step4 () {
                self.assertSelectedDates(10, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);

                    fromDate = self.addDays(fromDate, -7);
                    jsonUtils.setValue(data, "fromDate", self.addDays(fromDate, 0));
                    step5();
                });
            }

            function step5 () {
                self.assertSelectedDates(17, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);

                    toDate = self.addDays(fromDate, 1);
                    jsonUtils.setValue(data, "toDate", self.addDays(toDate, 0));
                    step6();
                });
            }

            function step6 () {
                self.assertSelectedDates(2, fromDate, toDate, function () {
                    self.assertDateEquals(data.fromDate, fromDate);
                    self.assertDateEquals(data.toDate, toDate);
                    self.end();
                });
            }

            step0();
        }
    }
});
