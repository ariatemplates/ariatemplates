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
 * Test case for aria.widgets.form.Input
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Time",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Date"],
    $prototype : {

        /**
         * TestCase1 Tests string is valid i.e has a least one digit at the beginning.
         */
        test_isValidTime : function () {
            var trueTime = "09.00PM";
            var falseTime = "abc";
            this.assertTrue(aria.utils.Date._isValidTime(trueTime));
            this.assertFalse(aria.utils.Date._isValidTime(falseTime));
        },

        /**
         * TestCase2 Tests string contains pm.
         */
        test_isPM : function () {
            var trueTime = "09.00P.m.";
            var falseTime = "9";
            this.assertTrue(aria.utils.Date._isPM(trueTime));
            this.assertFalse(aria.utils.Date._isPM(falseTime));
        },

        /**
         * TestCase3 Remove am/pm from string.
         */
        test_removeAMPM : function () {
            var time = "09.00";
            var timeAMPM = "09.00am";
            this.assertEquals(aria.utils.Date._removeAMPM(timeAMPM), time);
        },

        /**
         * TestCase4 Remove unwanted characters from string.
         */
        test_removeUnwantedCharacters : function () {
            var time = "8hb9ma-;67s\\ ,.a45/:0123";
            // james var timeReturn = "8h9m-;67\\ ,.45/:0123";
            var timeReturn = "8h9m-;67\\,.45/:0123";
            this.assertEquals(aria.utils.Date._removeUnwantedCharacters(time), timeReturn);
        },

        /**
         * TestCase5 Calculate hours from string.
         */
        test_calculateHours : function () {
            var time = "24";
            var timeReturn = 0;
            var test = aria.utils.Date._calculateHours(time);
            this.assertEquals(test[0], timeReturn);
        },

        /**
         * TestCase6 Calculate minutes or seconds from string.
         */
        test_calculateMS : function () {
            var time = "55";
            var timeReturn = "55";
            var test = aria.utils.Date._calculateMS(time);
            this.assertEquals(test[0], timeReturn);
        },

        /**
         * TestCase7 remove hours, minutes, seconds from string.
         */
        test_removeHMS : function () {
            var time = "99";
            var timeReturn = "9";
            this.assertEquals(aria.utils.Date._removeHMS(time), timeReturn);
        },

        /**
         * TestCase8 remove seperator from string. \;,.-/:"_"
         */
        test_removeSeparator : function () {
            var time = "\\12";
            var timeReturn = "12";
            var test = aria.utils.Date._removeSeparator(time);
            this.assertEquals(aria.utils.Date._removeSeparator(time), timeReturn);
        },

        /**
         * TestCase9 Creates and returns date/time object.
         */
        test_returnTime : function () {
            var ariaTimeUtil = aria.utils.Date;
            var hours = "09";
            var minutes = "09";
            var seconds = "09";
            var now = new Date();
            now.setHours(hours, minutes, seconds);
            var testDate1 = ariaTimeUtil.format(aria.utils.Date._returnTime(hours, minutes, seconds), 'hh:mm:ss');
            var testDate2 = ariaTimeUtil.format(now, 'hh:mm:ss');
            this.assertEquals(testDate1, testDate2);
        },

        /**
         * Test Utility Patterns
         */
        testFormat : function () {
            var ariaTimeUtil = aria.utils.Date;
            var now = new Date();
            now.setHours("09", "08", "07");

            var patterns = ["hh/mm/ss", "hh mm ss", "hh:mm:ss", "hh/mm", "hh mm", "hh:mm", "hh", "mm", "ss", "h/m/s",
                    "h m s", "h:m:s", "h/m", "h m", "h:m", "h", "m", "s"];

            var checker = ["09/08/07", "09 08 07", "09:08:07", "09/08", "09 08", "09:08", "09", "08", "07", "9/8/7",
                    "9 8 7", "9:8:7", "9/8", "9 8", "9:8", "9", "8", "7"];

            var testCases = [];

            for (var i = 0, l = patterns.length; i < l; i++) {
                testCases.push(ariaTimeUtil.format(now, patterns[i]));
                this.assertEquals(testCases[i], checker[i]);
            }
        },

        /**
         * Test Utility Interpreter
         */
        test_interpretTime : function () {
            var ariaTimeUtil = aria.utils.Date;
            var useCases = ["22:4p:1", "99", "9p", "9h00", "9:9", "11:09   p", "9 9", "9/2", "9;2", "9-2", "9:9",
                    "09:9", "0909", "9h09", "9h9", "09h9", "9.51", "9.51pm", "9,5pm"];

            var checker = ["22:04:01", "09:09:00", "21:00:00", "09:00:00", "09:09:00", "23:09:00", "09:09:00",
                    "09:02:00", "09:02:00", "09:02:00", "09:09:00", "09:09:00", "09:09:00", "09:09:00", "09:09:00",
                    "09:09:00", "09:51:00", "21:51:00", "21:05:00"];

            var testCases = [];

            for (var i = 0, l = useCases.length; i < l; i++) {
                testCases.push(ariaTimeUtil.interpretTime(useCases[i]));
                this.assertEquals(ariaTimeUtil.format(testCases[i], 'HH:mm:ss'), checker[i]);
            }
        },

        /**
         * Helper method to check that the answer of removeTime to a non-null parameter corresponds to what is expected.
         * @param {Date} date
         * @protected
         */
        testInterpretTime : function (text) {

            var ariaDateUtil = aria.utils.Date;

            var interpretedDate = ariaDateUtil.interpretTime('25:01');
            // should be rejected
            this.assertTrue(interpretedDate === null);

            var interpretedDate = ariaDateUtil.interpretTime('3030');
            // should be rejected
            this.assertTrue(interpretedDate === null);

            var interpretedDate = ariaDateUtil.interpretTime('2501');
            // should be rejected
            this.assertTrue(interpretedDate === null);

            var interpretedDate = ariaDateUtil.interpretTime('25h12');
            // should be rejected
            this.assertTrue(interpretedDate === null);

            this._dateCheckHelper('9 h00', '9', '00', '00');
            this._dateCheckHelper('10 h05', '10', '05', '00');

            // Test the sell guidelines
            this._dateCheckHelper('303', '03', '03', '00');
            this._dateCheckHelper('3h30', '03', '30', '00');
            this._dateCheckHelper('9', '9', '00', '00');
            this._dateCheckHelper('9h', '9', '00', '00');
            this._dateCheckHelper('9h0', '9', '00', '00');
            this._dateCheckHelper('9 h0', '9', '00', '00');
            this._dateCheckHelper('0905', '09', '05', '00');
            this._dateCheckHelper('09:05', '09', '05', '00');
            this._dateCheckHelper('10h', '10', '00', '00');
            this._dateCheckHelper('10 h', '10', '00', '00');
            this._dateCheckHelper('10h05', '10', '05', '00');
            this._dateCheckHelper('10h 05', '10', '05', '00');
            this._dateCheckHelper('10 h 05', '10', '05', '00');
            this._dateCheckHelper('10 p m', '22', '00', '00');
            this._dateCheckHelper('10pm', '22', '00', '00');
            this._dateCheckHelper('10 am', '10', '00', '00');
            this._dateCheckHelper('10 pm', '22', '00', '00');
            this._dateCheckHelper('10 a m', '10', '00', '00');
            this._dateCheckHelper('10 a.m.', '10', '00', '00');
            this._dateCheckHelper('10 p.m.', '22', '00', '00');
            this._dateCheckHelper('10 a.m', '10', '00', '00');
            this._dateCheckHelper('10 p.m', '22', '00', '00');
            this._dateCheckHelper('10a.m', '10', '00', '00');
            this._dateCheckHelper('10p.m', '22', '00', '00');
            this._dateCheckHelper('10a m', '10', '00', '00');
            this._dateCheckHelper('10p m', '22', '00', '00');
            this._dateCheckHelper('10 a.m', '10', '00', '00');
            this._dateCheckHelper('10 p.m', '22', '00', '00');
            this._dateCheckHelper('10a. m', '10', '00', '00');
            this._dateCheckHelper('10p. m', '22', '00', '00');
            this._dateCheckHelper('10 a .m', '10', '00', '00');
            this._dateCheckHelper('10 p .m', '22', '00', '00');
            this._dateCheckHelper('10 a . m', '10', '00', '00');
            this._dateCheckHelper('10 p . m', '22', '00', '00');

        },
        _dateCheckHelper : function (dateParam, hours, minutes, seconds) {

            var ariaDateUtil = aria.utils.Date;

            var interpretedDate = ariaDateUtil.interpretTime(dateParam);

            if (interpretedDate !== null) {
                var intTime = interpretedDate.getTime();
                intTime = intTime / 1000;
                intTime = Math.floor(intTime);
                intTime = intTime * 1000;

                var d = new Date(intTime);

                d.setHours(hours);
                d.setMinutes(minutes);
                d.setSeconds(seconds);

                var dTime = d.getTime();

                this.assertTrue(dTime == intTime);
            } else {
                // This shouldn't happen
                this.assertTrue(1 == 2);
            }

        }

    }
});
