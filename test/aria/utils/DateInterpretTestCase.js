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
 * Test case for aria.utils.DateInterpret
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.DateInterpretTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Date"],
    $prototype : {
        testinterpretDate : function () {

            this.interpretAndAssertMonthYear("06/2016", 6, 2016);
            this.interpretAndAssertMonthYear("06/16", 6, 2016);
            this.interpretAndAssertMonthYear("5/13", 5, 2013);
            this.interpretAndAssertMonthYear("06 2012", 6, 2012);
            this.interpretAndAssertMonthYear("06 12", 6, 2012);
            this.interpretAndAssertMonthYear("6 12", 6, 2012);
            this.interpretAndAssertMonthYear("06.2012", 6, 2012);
            this.interpretAndAssertMonthYear("06.12", 6, 2012);
            this.interpretAndAssertMonthYear("6.12", 6, 2012);
            this.interpretAndAssertMonthYear("06-2012", 6, 2012);
            this.interpretAndAssertMonthYear("06-12", 6, 2012);
            this.interpretAndAssertMonthYear("6-12", 6, 2012);
            this.interpretAndAssertMonthYear("0612", 6, 2012);
            this.interpretAndAssertMonthYear("062012", 6, 2012);
            this.interpretAndAssertMonthYear("JUN12", 6, 2012);
            this.interpretAndAssertMonthYear("JUN2012", 6, 2012);
            this.interpretAndAssertMonthYear("JUN 12", 6, 2012);
            this.interpretAndAssertMonthYear("JUN 2012", 6, 2012);
            this.interpretAndAssertMonthYear("2012/06", 6, 2012, true);
            this.interpretAndAssertMonthYear("12/02", 2, 2012, true);
            this.interpretAndAssertMonthYear("12/6", 6, 2012, true);
            this.interpretAndAssertMonthYear("2012 06", 6, 2012, true);
            this.interpretAndAssertMonthYear("12 06", 6, 2012, true);
            this.interpretAndAssertMonthYear("12 6", 6, 2012, true);
            this.interpretAndAssertMonthYear("201206", 6, 2012, true);
            this.interpretAndAssertMonthYear("12.06", 6, 2012, true);
            this.interpretAndAssertMonthYear("12.6", 6, 2012, true);
            this.interpretAndAssertMonthYear("2012-06", 6, 2012, true);
            this.interpretAndAssertMonthYear("12-06", 6, 2012, true);
            this.interpretAndAssertMonthYear("12-6", 6, 2012, true);
            this.interpretAndAssertMonthYear("1206", 6, 2012, true);
            this.interpretAndAssertMonthYear("12JUN", 6, 2012, true);
            this.interpretAndAssertMonthYear("2012JUN", 6, 2012, true);
            this.interpretAndAssertMonthYear("12 JUN", 6, 2012, true);
            this.interpretAndAssertMonthYear("2012 JUN", 6, 2012, true);

        },
        interpretAndAssertMonthYear : function (dateStr, month, year, yearBeforeMonth) {
            var date = aria.utils.Date.interpretMonthAndYear(dateStr, {
                yearBeforeMonth: yearBeforeMonth
            });
            this.assertTrue(date.getFullYear() === year);
            this.assertTrue(date.getMonth() + 1 === month);

            /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1488) */
            date = aria.utils.Date.interpretMonthAndYear(dateStr, yearBeforeMonth);
            this.assertTrue(date.getFullYear() === year);
            this.assertTrue(date.getMonth() + 1 === month);
            /* BACKWARD-COMPATIBILITY-END (GitHub #1488) */
        },
        testDateinterpreter : function () {
            // should interpret as 05 Dec
            var date1 = aria.utils.Date.interpret("05.12");
            var d1 = new Date(2012, 11, 5);
            this.assertEquals(date1.getDate(), d1.getDate());
            this.assertEquals(date1.getMonth(), d1.getMonth());
            // should interpret as May 2012
            var date2 = aria.utils.Date.interpret("05.12", {
                isMonthYear : true
            });
            var d2 = new Date(2012, 5);
            this.assertEquals(date2.getMonth(), d2.getMonth() - 1);
            this.assertEquals(date2.getFullYear(), d2.getFullYear());
            // should interpret as May 2012 with Year before month
            var date3 = aria.utils.Date.interpret("12.05", {
                isMonthYear : true,
                yearBeforeMonth : true
            });
            var d3 = new Date(2012, 5);
            this.assertEquals(date3.getMonth(), d3.getMonth() - 1);
            this.assertEquals(date3.getFullYear(), d3.getFullYear());

        },
        testDateinterpreterCases : function () {
            // should interpret as 05 of current month and year
            var date1 = aria.utils.Date.interpretWithDate("05");
            var d1 = new Date();
            d1.setDate(5);
            this.assertEquals(date1.getDate(), d1.getDate());
            this.assertEquals(date1.getMonth(), d1.getMonth());
            this.assertEquals(date1.getFullYear(), d1.getFullYear());

            // should interpret as 05 of current month and year
            var date2 = aria.utils.Date.interpretWithRefDate("+5");
            var d2 = new Date();
            d2.setDate(d2.getDate() + 5);
            this.assertEquals(date2.getDate(), d2.getDate());
            this.assertEquals(date2.getMonth(), d2.getMonth());
            this.assertEquals(date2.getFullYear(), d2.getFullYear());

            // should interpret as 05 of current month and year
            var date3 = aria.utils.Date.interpretFullDateRef("10DEC12/+5");
            var d3 = new Date(2012, 11, 15);
            this.assertEquals(date3.getDate(), d3.getDate());
            this.assertEquals(date3.getMonth(), d3.getMonth());
            this.assertEquals(date3.getFullYear(), d3.getFullYear());
            // should interpret 1st day of may current year
            var date4 = aria.utils.Date.interpretMonth("may");
            var d4 = new Date();
            if (date4.getMonth() != d4.getMonth()) {
                d4.setMonth(4, 1);
            } else {
                d4.setMonth(4);
            }

            this.assertEquals(date4.getDate(), d4.getDate());
            this.assertEquals(date4.getMonth(), d4.getMonth());
            this.assertEquals(date4.getFullYear(), d4.getFullYear());
            //
            var date5 = aria.utils.Date.interpretDateAndMonth("12May2012");
            var d5 = new Date(2012, 4, 12);
            this.assertEquals(date5.getDate(), d5.getDate());
            this.assertEquals(date5.getMonth(), d5.getMonth());
            this.assertEquals(date5.getFullYear(), d5.getFullYear());

        }
    }
});
