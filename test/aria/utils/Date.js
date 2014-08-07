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
 * Test case for aria.utils.Date
 */
Aria.classDefinition({
    $classpath : 'test.aria.utils.Date',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ["aria.utils.Date", "aria.core.environment.Environment"],
    $prototype : {

        /**
         * testFormatToUpperCase - Test formatting to uppercase
         * @public
         */
        testFormatToUpperCase : function () {

            var date1 = new Date(2010, 3, 1); // 1st April 2010

            this.assertTrue(aria.utils.Date.format(date1, "UMMMddyyyy") === "APR012010", "Expect APR012010, get "
                    + aria.utils.Date.format(date1, "UMMMddyyyy"));
            this.assertTrue(aria.utils.Date.format(date1, "MMMddyyyy") === "Apr012010", "Expect Apr012010, get "
                    + aria.utils.Date.format(date1, "MMMddyyyy"));

        },

        /**
         * test isSameDate function
         */
        testIsSameDate : function () {
            var date1 = new Date();
            var date2 = new Date(date1.getTime());
            this.assertTrue(aria.utils.Date.isSameDay(date1, date2));
        },

        /**
         * Test basic statement
         */
        testinterpretSpecialCases : function () {
            var ariaDateUtil = aria.utils.Date, date, testDate;

            ariaDateUtil._useCache = false;

            // special case 1 : 5 -> the 5th of today's month
            date = new Date();
            date.setDate(5);
            this.assertTrue(ariaDateUtil.isSameDay(aria.utils.Date.interpret("5"), date));

            // special case 2 : +5 -> today + 5 days
            date = new Date();
            for (var index = -366; index < 367; index++) {
                testDate = new Date(date.getTime() + index * 3600 * 1000 * 24);

                if (index === 366) {
                    this.assertTrue(ariaDateUtil.interpret("+" + index) === null);
                } else if (index === -366) {
                    this.assertTrue(ariaDateUtil.interpret("" + index) === null);
                } else {
                    if (index >= 0) {
                        this.assertTrue(ariaDateUtil.isSameDay(ariaDateUtil.interpret("+" + index), testDate), " + special case  2 failed for +"
                                + index);
                        this.assertTrue(ariaDateUtil.isSameDay(ariaDateUtil.interpret("-" + index, testDate), date), " + special case  2 failed for +"
                                + index + " with reference date passed");
                    } else {
                        this.assertTrue(ariaDateUtil.isSameDay(ariaDateUtil.interpret("" + index), testDate), " - special case  2 failed for "
                                + index);
                        this.assertTrue(ariaDateUtil.isSameDay(ariaDateUtil.interpret("+" + Math.abs(index), testDate), date), " - special case  2 failed for -"
                                + index + " with reference date passed");
                    }
                }

            }

            // special case 3: 12DEC/+10
            this.assertTrue(!ariaDateUtil.interpret("12DEC/-370"));
            var dec12 = ariaDateUtil.interpret("12DEC/-10");
            var dec2 = ariaDateUtil.interpret("2DEC");
            this.assertEquals(dec12.getDate(), dec2.getDate());
            this.assertEquals(dec12.getMonth(), dec2.getMonth());
            // The year might be different (between DEC2 and DEC12)
            this.assertTrue(ariaDateUtil.isSameDay(ariaDateUtil.interpret("12DEC11/+10"), ariaDateUtil.interpret("22DEC11")));
            this.assertTrue(ariaDateUtil.isSameDay(ariaDateUtil.interpret("12DEC2011/-1"), ariaDateUtil.interpret("11DEC2011")));

            // special case 4 : just the month
            // if this is this month, then it's today, else the first of the month
            var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            for (var index1 = 0, l = months.length; index1 < l; index1++) {
                testDate = new Date();
                if (testDate.getMonth() != index1) {
                    testDate.setDate(1);
                    testDate.setMonth(index1);
                } else {
                    testDate = new Date();
                }
                this.assertTrue(ariaDateUtil.isSameDay(ariaDateUtil.interpret(months[index1]), testDate), " special case  3 failed for "
                        + (months[index1]));
            }

            ariaDateUtil._useCache = true;

        },

        /**
         * testinterpretClassicCasesEurope test the classic date formatting use cases
         * @public
         */
        testinterpretClassicCasesEurope : function () {

            // set default environment
            aria.core.AppEnvironment.setEnvironment({});
            var ariaDateUtil = aria.utils.Date;

            this.assertTrue(null === ariaDateUtil.interpret("this is not a date"));

            // standard interpretation
            var today = new Date();

            var patterns = ["dd/MM/yyyy", "dd/MM/yy", "dd/MM/yy", "d/M/yy", "d M yy", "dd MM yy", "dd-MM-yy",
                    "dd.MM.yy", "dd\\MM\\yy", "ddMMyy", "ddMMMyy", "ddMMMyyyy", "dd/MM"];

            var testCases = [];

            for (var i = 0, l = patterns.length; i < l; i++) {
                testCases.push(ariaDateUtil.format(today, patterns[i]));
            }

            for (var j = 0, tcl = testCases.length; j < tcl; j++) {
                this.assertTrue(ariaDateUtil.isSameDay(ariaDateUtil.interpret(testCases[j]), today), "Entry not recognized, case "
                        + testCases[j]);
            }

            // invalid date for europe
            this.assertTrue(ariaDateUtil.interpret("04/13") === null);
            // valid date for europe
            this.assertTrue(ariaDateUtil.interpret("13/04") !== null);

        },

        /**
         * testinterpretClassicCasesUS - Test
         */
        testinterpretClassicCasesUS : function () {

            aria.core.AppEnvironment.setEnvironment({
                "dateFormats" : {
                    "dateBeforeMonth" : false
                }
            });
            var ariaDateUtil = aria.utils.Date;

            // standard interpretation
            var today = new Date();

            var patterns = ["MM/dd/yy", "MM/dd/yy", "MM/dd/yy", "M/d/yy", "M d yy", "MM dd yy", "MM-dd-yy", "MM.dd.yy",
                    "MM\\dd\\yy", "MMddyy", "MMMddyy", "MMMddyyyy", "MM/dd"];

            var testCases = [];

            for (var i = 0, l = patterns.length; i < l; i++) {
                testCases.push(ariaDateUtil.format(today, patterns[i]));
            }

            for (var j = 0, len = testCases.length; j < len; j++) {
                this.assertTrue(ariaDateUtil.isSameDay(ariaDateUtil.interpret(testCases[j]), today), "Entry not recognized, case "
                        + testCases[j]);
            }

            // valid date for US
            this.assertTrue(ariaDateUtil.interpret("04/13") !== null);
            // invalid date for US
            this.assertTrue(ariaDateUtil.interpret("13/04") === null);

            // restore default environment
            aria.core.AppEnvironment.setEnvironment({});
        },

        /**
         * testLitterals - Test the date formatting
         * @public
         */
        testLitterals : function () {
            var ariaDateUtil = aria.utils.Date;
            this.assertTrue(ariaDateUtil.format(new Date(2010, 3, 1), " yyyy'test''test' 'test'yyyy'test' '' 'test''' ") === " 2010test'test test2010test ' test' ", "Wrong output: "
                    + ariaDateUtil.format(new Date(2010, 3, 1), " yyyy'test''test' 'test'yyyy'test' '' 'test''' "));
        },

        /**
         * testTimeFormatting - Test the date formatting
         * @public
         */
        testTimeFormatting : function () {
            var ariaDateUtil = aria.utils.Date;

            var am = ariaDateUtil.res.timeFormatLabels.am;
            var pm = ariaDateUtil.res.timeFormatLabels.pm;
            // AM/PM Tests
            var formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 0, 0), "hh:mma");
            this.assertTrue(formattedValue === "12:00" + am, "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 1, 0), "hh:mma");
            this.assertTrue(formattedValue === "12:01" + am, "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 59, 0), "hh:mma");
            this.assertTrue(formattedValue === "12:59" + am, "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 1, 0, 0), "hh:mma");
            this.assertTrue(formattedValue === "01:00" + am, "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 11, 59, 0), "hh:mma");
            this.assertTrue(formattedValue === "11:59" + am, "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 12, 0, 0), "hh:mma");
            this.assertTrue(formattedValue === "12:00" + pm, "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 12, 1, 0), "hh:mma");
            this.assertTrue(formattedValue === "12:01" + pm, "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 12, 59, 0), "hh:mma");
            this.assertTrue(formattedValue === "12:59" + pm, "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 13, 0, 0), "hh:mma");
            this.assertTrue(formattedValue === "01:00" + pm, "Wrong output: " + formattedValue);

            // 24h clock test
            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 0, 0), "HH:mm");
            this.assertTrue(formattedValue === "00:00", "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 1, 0, 0), "HH:mm");
            this.assertTrue(formattedValue === "01:00", "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 12, 0, 0), "HH:mm");
            this.assertTrue(formattedValue === "12:00", "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 23, 59, 0), "HH:mm");
            this.assertTrue(formattedValue === "23:59", "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 23, 59, 0), function () {
                if (1 == 1) {
                    return "HH:mm";
                }
            });
            this.assertTrue(formattedValue === "23:59", "Wrong output: " + formattedValue);

        },

        /**
         * testAsyncDateFormatting - Test the date formatting
         * @public
         */
        testAsyncDateFormatting : function () {
            var ariaDateUtil = aria.utils.Date;

            this.assertEquals(null, ariaDateUtil.format(null, "dd/MM/yyyy"));
            this.assertEquals(null, ariaDateUtil.format(undefined, "dd/MM/yyyy"));
            this.assertEquals(null, ariaDateUtil.format("", "dd/MM/yyyy"));
            this.assertEquals(null, ariaDateUtil.format({}, "dd/MM/yyyy"));

            var formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 0, 0), "d MMM y");
            this.assertTrue(formattedValue === "1 Apr 10", "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 0, 0), function () {
                if (1 == 1) {
                    return "d MMM y";
                }
            });
            this.assertTrue(formattedValue === "1 Apr 10", "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 0, 0), function () {
                return "EEEE d MMMM yyyy";
            });
            this.assertTrue(formattedValue === "Thursday 1 April 2010", "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 0, 0), "d MMM y");
            this.assertTrue(formattedValue === "1 Apr 10", "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 0, 0), "Ud MMM y");
            this.assertTrue(formattedValue === "1 APR 10", "Wrong output: " + formattedValue);

            formattedValue = ariaDateUtil.format(new Date(2010, 3, 1, 0, 0, 0), "d MMM y");
            this.assertTrue(formattedValue === "1 Apr 10", "Wrong output: " + formattedValue);

            aria.core.environment.Environment.setLanguage("fr_FR", {
                fn : this.appEnvChanged,
                scope : this
            });

        },

        /**
         * appEnvChanged callback after changing the app environment and loading a new Res file
         * @public
         */
        appEnvChanged : function () {

            try {

                var formattedValue = aria.utils.Date.format(new Date(2010, 3, 1, 0, 0, 0), "d MMM y");
                this.assertTrue(formattedValue === "1 Avr. 10", "Wrong output: " + formattedValue);

                formattedValue = aria.utils.Date.format(new Date(2010, 3, 1, 0, 0, 0), "Ud MMM y");
                this.assertTrue(formattedValue === "1 AVR. 10", "Wrong output: " + formattedValue);

                formattedValue = aria.utils.Date.format(new Date(2010, 3, 1, 0, 0, 0), "d I y");
                this.assertTrue(formattedValue === "1 APR 10", "Wrong output: " + formattedValue);

                formattedValue = aria.utils.Date.format(new Date(2010, 3, 1, 0, 0, 0), "dd I yyyy");
                this.assertTrue(formattedValue === "01 APR 2010", "Wrong output: " + formattedValue);

                formattedValue = aria.utils.Date.format(new Date(2010, 3, 1, 0, 0, 0), "Udd I yyyy");
                this.assertTrue(formattedValue === "01 APR 2010", "Wrong output: " + formattedValue);

                formattedValue = aria.utils.Date.format(new Date(2010, 3, 1, 0, 0, 0), "Ud MMM y");
                this.assertTrue(formattedValue === "1 AVR. 10", "Wrong output: " + formattedValue);

                this.notifyTestEnd("testAsyncDateFormatting");

            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
        },
        /**
         * Test the getStartOfWeek method.
         * @public
         */
        testGetStartOfWeek : function () {
            var ariaDateUtil = aria.utils.Date;
            var startWeekCorrect = new Date(2010, 3, 4); // Sunday, 4th April
            // 2010
            for (var i = 1; i <= 20; i++) {
                var testDate = new Date(2010, 3, i);
                var startWeekTest = ariaDateUtil.getStartOfWeek(testDate, 0);
                this.assertEquals(ariaDateUtil.isSameDay(startWeekCorrect, startWeekTest), i >= 4 && i <= 10);
            }
            startWeekCorrect = new Date(2010, 3, 5); // Monday, 5th April 2010
            for (var j = 1; j <= 20; j++) {
                testDate = new Date(2010, 3, j);
                startWeekTest = ariaDateUtil.getStartOfWeek(testDate, 1);
                this.assertEquals(ariaDateUtil.isSameDay(startWeekCorrect, startWeekTest), j >= 5 && j <= 11);
            }
        },

        /**
         * Test the dayDifference method.
         */
        testDayDifference : function () {
            var ariaDateUtil = aria.utils.Date;
            // simple test
            var date1 = new Date(2010, 3, 1); // 1st April 2010
            var date2 = new Date(2010, 3, 5); // 5th April 2010
            this.assertEquals(ariaDateUtil.dayDifference(date1, date2), 4);

            // test changing year and month
            date1 = new Date(2009, 11, 1); // 1st December 2009
            date2 = new Date(2010, 0, 1); // 1st January 2010
            this.assertEquals(ariaDateUtil.dayDifference(date1, date2), 31);

            // time shift test:
            date1 = new Date(2010, 2, 27); // 27th March 2010
            date2 = new Date(2010, 2, 29); // 29th March 2010
            this.assertEquals(ariaDateUtil.dayDifference(date1, date2), 2);

            // test with non-zero time
            date1 = new Date(2010, 3, 1, 23, 35); // 1st April 2010
            date2 = new Date(2010, 3, 5, 0, 15); // 5th April 2010
            this.assertEquals(ariaDateUtil.dayDifference(date1, date2), 4);
        },

        /**
         * Test the removeTime method.
         */
        testRemoveTime : function () {
            this.assertEquals(aria.utils.Date.removeTime(null), null);
            this._testRemoveTimeHelper(new Date());
            this._testRemoveTimeHelper(new Date(2010, 0, 1));
            this._testRemoveTimeHelper(new Date(2010, 0, 1, 0, 0, 0, 1));
            this._testRemoveTimeHelper(new Date(2010, 0, 1, 0, 0, 1, 0));
            this._testRemoveTimeHelper(new Date(2010, 0, 1, 0, 1, 0, 0));
            this._testRemoveTimeHelper(new Date(2010, 0, 1, 1, 0, 0, 0));
        },

        /**
         * Helper method to check that the answer of removeTime to a non-null parameter corresponds to what is expected.
         * @param {Date} date
         * @protected
         */
        _testRemoveTimeHelper : function (date) {
            var removedTime = aria.utils.Date.removeTime(date);
            this.assertEquals(removedTime.getHours(), 0);
            this.assertEquals(removedTime.getMinutes(), 0);
            this.assertEquals(removedTime.getSeconds(), 0);
            this.assertEquals(removedTime.getMilliseconds(), 0);
            this.assertTrue(aria.utils.Date.isSameDay(date, removedTime));
        },

        /**
         * Test format with UTC
         */
        testFormatUTC : function () {
            var myDate = new Date();
            myDate.setUTCFullYear(2010);
            myDate.setUTCMonth(11);
            myDate.setUTCDate(31);
            myDate.setUTCHours(23);
            myDate.setUTCMinutes(59);
            myDate.setUTCSeconds(59);
            myDate.setUTCMilliseconds(0);
            var formattedDate = aria.utils.Date.format(myDate, "d/M/yyyy HH:mm:ss", true);
            this.assertEquals(formattedDate, "31/12/2010 23:59:59");
        },

        /**
         * Test the getWeekNumberMethod for ISO8601 Standard
         */

        testGetWeekNumberIsoStd : function () {
            // Values for the week number of Jan 1st
            var firstIso = {
                "2010" : 53,
                "2011" : 52,
                "2012" : 52,
                "2013" : 1,
                "2014" : 1,
                "2015" : 1,
                "2016" : 53,
                "2017" : 52,
                "2018" : 1,
                "2019" : 1,
                "2020" : 1,
                "2021" : 53
            };

            // Values for the week number of Dec 31st
            var endIso = {
                "2010" : 52,
                "2011" : 52,
                "2012" : 1,
                "2013" : 1,
                "2014" : 1,
                "2015" : 53,
                "2016" : 52,
                "2017" : 52,
                "2018" : 1,
                "2019" : 1,
                "2020" : 53,
                "2021" : 52
            };

            // Values for the week number of Oct 28th
            var random = {
                "2010" : 43,
                "2011" : 43,
                "2012" : 43,
                "2013" : 44,
                "2014" : 44,
                "2015" : 44,
                "2016" : 43,
                "2017" : 43,
                "2018" : 43,
                "2019" : 44,
                "2020" : 44,
                "2021" : 43
            };
            var monday = aria.utils.Date.MONDAY; // firstDayOdWeek

            for (var year = 2010; year < 2022; year++) { // Test for 12 years

                var firstJan = new Date(year, 0, 1, 0, 0, 0, 0); // Create the 1st January for each year
                var first = aria.utils.Date.getWeekNumber(firstJan, monday);
                this.assertEquals(firstIso[year], first, "Test 1st Jan " + year + " failed: " + firstIso[year] + " = "
                        + first);

                var fourthJan = new Date(year, 0, 4, 0, 0, 0, 0); // Create the 4th January for each year
                var fourth = aria.utils.Date.getWeekNumber(fourthJan, monday);
                this.assertEquals(1, fourth, "Test 4th Jan " + year + " failed: " + 1 + " = " + fourth);

                var endYear = new Date(year, 11, 31, 0, 0, 0, 0); // Create the 31st December for each year
                var end = aria.utils.Date.getWeekNumber(endYear, monday);
                this.assertEquals(endIso[year], end, "Test end of the year " + year + " failed: " + endIso[year]
                        + " = " + end);

                var randomDate = new Date(year, 9, 28, 0, 0, 0, 0); // Create the 28th October for each year
                var rand = aria.utils.Date.getWeekNumber(randomDate, monday);
                this.assertEquals(random[year], rand, "Test random date " + year + " failed: " + random[year] + " = "
                        + rand);
            }
        },

        /**
         * Test the getWeekNumberMethod for US Standard
         */

        testGetWeekNumberUSStd : function () {
            var sunday = aria.utils.Date.SUNDAY; // firstDayOfWeek
            var endUs = {
                "2010" : 1,
                "2011" : 53,
                "2012" : 1,
                "2013" : 1,
                "2014" : 1,
                "2015" : 1,
                "2016" : 53,
                "2017" : 1,
                "2018" : 1,
                "2019" : 1,
                "2020" : 1,
                "2021" : 1
            }; // Values for the week number of Dec 31st
            var random = {
                "2010" : 44,
                "2011" : 44,
                "2012" : 44,
                "2013" : 44,
                "2014" : 44,
                "2015" : 44,
                "2016" : 44,
                "2017" : 43,
                "2018" : 44,
                "2019" : 44,
                "2020" : 44,
                "2021" : 44
            }; // Values for the week number of Oct 28th

            for (var year = 2010; year < 2022; year++) { // Test for 12 years
                var firstJan = new Date(year, 0, 1, 0, 0, 0, 0); // Create the 1st January for each year
                var first = aria.utils.Date.getWeekNumber(firstJan, sunday);
                this.assertEquals(1, first, "Test 1st Jan " + year + " failed: " + 1 + " = " + first);

                var endYear = new Date(year, 11, 31, 0, 0, 0, 0); // Create the 31st December for each year
                var end = aria.utils.Date.getWeekNumber(endYear, sunday);
                this.assertEquals(endUs[year], end, "Test end of the year " + year + " failed: " + endUs[year] + " = "
                        + end);

                var randomDate = new Date(year, 9, 28, 0, 0, 0, 0); // Create the 28th October for each year
                var rand = aria.utils.Date.getWeekNumber(randomDate, sunday);
                this.assertEquals(random[year], rand, "Test random date " + year + " failed: " + random[year] + " = "
                        + rand);
            }
        },

        /**
         * Test the getWeekNumberMethod for Middle East Standard
         */

        testGetWeekNumberMEStd : function () {
            var saturday = aria.utils.Date.SATURDAY; // firstDayOfWeek
            var endMe = {
                "2010" : 53,
                "2011" : 1,
                "2012" : 1,
                "2013" : 1,
                "2014" : 1,
                "2015" : 1,
                "2016" : 1,
                "2017" : 1,
                "2018" : 1,
                "2019" : 1,
                "2020" : 1,
                "2021" : 53
            }; // Values for the week number of Dec 31st
            var random = {
                "2010" : 44,
                "2011" : 43,
                "2012" : 44,
                "2013" : 44,
                "2014" : 44,
                "2015" : 44,
                "2016" : 44,
                "2017" : 44,
                "2018" : 44,
                "2019" : 44,
                "2020" : 44,
                "2021" : 44
            }; // Values for the week number of Oct 28th

            for (var year = 2010; year < 2022; year++) { // Test for 12 years
                var firstJan = new Date(year, 0, 1, 0, 0, 0, 0); // Create the 1st January for each year
                var first = aria.utils.Date.getWeekNumber(firstJan, saturday);
                this.assertEquals(1, first, "Test 1st Jan " + year + " failed: " + 1 + " = " + first);

                var endYear = new Date(year, 11, 31, 0, 0, 0, 0); // Create the 31st December for each year
                var end = aria.utils.Date.getWeekNumber(endYear, saturday);
                this.assertEquals(endMe[year], end, "Test end of the year " + year + " failed: " + endMe[year] + " = "
                        + end);

                var randomDate = new Date(year, 9, 28, 0, 0, 0, 0); // Create the 28th October for each year
                var rand = aria.utils.Date.getWeekNumber(randomDate, saturday);
                this.assertEquals(random[year], rand, "Test random date " + year + " failed: " + random[year] + " = "
                        + rand);
            }
        },

        /**
         * Test the getWeekNumberMethod without the optional param
         */

        testGetWeekNumberNoStd : function () {
            var endUs = {
                "2010" : 1,
                "2011" : 53,
                "2012" : 1,
                "2013" : 1,
                "2014" : 1,
                "2015" : 1,
                "2016" : 53,
                "2017" : 1,
                "2018" : 1,
                "2019" : 1,
                "2020" : 1,
                "2021" : 1
            };
            var random = {
                "2010" : 44,
                "2011" : 44,
                "2012" : 44,
                "2013" : 44,
                "2014" : 44,
                "2015" : 44,
                "2016" : 44,
                "2017" : 43,
                "2018" : 44,
                "2019" : 44,
                "2020" : 44,
                "2021" : 44
            };

            // Checking if the method works without the firstDayOfWeek param and with the default appenv firstDayOfWeek
            for (var year = 2010; year < 2022; year++) { // Test for 12 years
                var firstJan = new Date(year, 0, 1, 0, 0, 0, 0); // Create the 1st January for each year
                var first = aria.utils.Date.getWeekNumber(firstJan); // Calling the method without the firstDayOfWeek
                // Param
                this.assertEquals(1, first, "Test 1st Jan " + year + " failed US: " + 1 + " = " + first);

                var endYear = new Date(year, 11, 31, 0, 0, 0, 0); // Create the 31st December for each year
                var end = aria.utils.Date.getWeekNumber(endYear); // Calling the method without the firstDayOfWeek
                // Param
                this.assertEquals(endUs[year], end, "Test end of the year " + year + " failed: " + endUs[year] + " = "
                        + end);

                var randomDate = new Date(year, 9, 28, 0, 0, 0, 0); // Create the 28th October for each year
                var rand = aria.utils.Date.getWeekNumber(randomDate); // Calling the method without the firstDayOfWeek
                // Param
                this.assertEquals(random[year], rand, "Test random date " + year + " failed: " + random[year] + " = "
                        + rand);
            }

            var firstIso = {
                "2010" : 53,
                "2011" : 52,
                "2012" : 52,
                "2013" : 1,
                "2014" : 1,
                "2015" : 1,
                "2016" : 53,
                "2017" : 52,
                "2018" : 1,
                "2019" : 1,
                "2020" : 1,
                "2021" : 53
            };
            var endIso = {
                "2010" : 52,
                "2011" : 52,
                "2012" : 1,
                "2013" : 1,
                "2014" : 1,
                "2015" : 53,
                "2016" : 52,
                "2017" : 52,
                "2018" : 1,
                "2019" : 1,
                "2020" : 53,
                "2021" : 52
            };
            random = {
                "2010" : 43,
                "2011" : 43,
                "2012" : 43,
                "2013" : 44,
                "2014" : 44,
                "2015" : 44,
                "2016" : 43,
                "2017" : 43,
                "2018" : 43,
                "2019" : 44,
                "2020" : 44,
                "2021" : 43
            };

            // Check if changing the firstDayOfWeek the method still works
            aria.core.AppEnvironment.setEnvironment({
                "firstDayOfWeek" : 1
            });
            for (year = 2010; year < 2022; year++) { // Test for 12 years
                firstJan = new Date(year, 0, 1, 0, 0, 0, 0); // Create the 1st January for each year
                first = aria.utils.Date.getWeekNumber(firstJan, null); // Calling the method without the firstDayOfWeek
                // Param

                var fourthJan = new Date(year, 0, 4, 0, 0, 0, 0); // Create the 4th January for each year
                var fourth = aria.utils.Date.getWeekNumber(fourthJan); // Calling the method without the firstDayOfWeek
                // Param

                endYear = new Date(year, 11, 31, 0, 0, 0, 0); // Create the 31st December for each year
                end = aria.utils.Date.getWeekNumber(endYear); // Calling the method without the firstDayOfWeek Param

                randomDate = new Date(year, 9, 28, 0, 0, 0, 0); // Create the 28th October for each year
                rand = aria.utils.Date.getWeekNumber(randomDate); // Calling the method without the firstDayOfWeek
                // Param

                this.assertEquals(firstIso[year], first, "Test 1st Jan ISO " + year + " failed: " + firstIso[year]
                        + " = " + first);
                this.assertEquals(1, fourth, "Test 4th Jan " + year + " failed: " + 1 + " = " + fourth);
                this.assertEquals(endIso[year], end, "Test end of the year " + year + " failed: " + endIso[year]
                        + " = " + end);
                this.assertEquals(random[year], rand, "Test random date " + year + " failed: " + random[year] + " = "
                        + rand);
            }

            // Check the log error for a wrong firstDayOfWeekParam
            aria.core.AppEnvironment.setEnvironment({
                "firstDayOfWeek" : 10
            });
            aria.utils.Date.getWeekNumber(new Date(year, 0, 1, 0, 0, 0, 0));
            this.assertErrorInLogs(aria.utils.Date.INVALID_FIRST_DAY_OF_WEEK);

            aria.core.AppEnvironment.setEnvironment({
                "firstDayOfWeek" : 3
            });
            aria.utils.Date.getWeekNumber(new Date(year, 0, 1, 0, 0, 0, 0));
            this.assertErrorInLogs(aria.utils.Date.INVALID_FIRST_DAY_OF_WEEK);

            try {
                aria.core.AppEnvironment.setEnvironment({
                    "firstDayOfWeek" : 0
                });
                aria.utils.Date.getWeekNumber(null);
            } catch (ex) {
                this.fail("Date Null");
            }
        },
        /**
         * Test UTC formatting during DST change.
         */
        testUTCFormat : function () {
            var dt = new Date(Date.UTC(2014, 2, 30, 2, 15, 0, 0)); // 30/03/2014 02:15:00 UTC
            this.assertEquals(aria.utils.Date.format(dt, 'HH:mm', true), "02:15", "30/03/2014 02:15:00 UTC should be formated to %2, got %1");
        }
    }
});
