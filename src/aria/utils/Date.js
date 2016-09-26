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
 * This class contains utilities to manipulate Dates.
 */
Aria.classDefinition({
    $classpath : "aria.utils.Date",
    $singleton : true,
    $dependencies : ["aria.utils.String", "aria.utils.Type", "aria.utils.environment.Date", "aria.utils.Array",
            "aria.core.ResMgr"],
    $resources : {
        dateRes : "aria.resources.DateRes",
        res : "aria.utils.UtilsRes"
    },
    $constructor : function () {

        /**
         * Dynamic cut date, 90 years in the past
         * @type Number
         * @private
         */
        this._cutYear = ((new Date()).getFullYear() + 10) % 100;

        /**
         * Application environment shortcut
         * @private
         * @type aria.utils.environment.Date
         */
        this._environment = aria.utils.environment.Date;

        var res = this.dateRes, utilString = aria.utils.String, utilRes = this.res;

        /**
         * IATA and localized months for interpretation. It is set in method _prepareLocalizedPatterns at initialization
         * and every time the locale changes
         * @protected
         * @type Array
         */
        this._interpret_monthTexts;

        /**
         * IATA months for interpretation
         * @protected
         * @type Array
         */
        var iataMonths = this._iataMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT",
                "NOV", "DEC"];

        /**
         * Date formatter letter patterns.
         * @see http://java.sun.com/j2se/1.4.2/docs/api/java/text/SimpleDateFormat.html
         * @type Object
         */
        this.formatPatterns = {

            "d" : function (value, number) {
                return utilString.pad(value.getDate(), number, "0", true);
            },

            "M" : function (value, number) {
                // TODO: reintroduce month long and month short (substring is not
                // enought)
                switch (number) {
                    case 1 :
                    case 2 :
                        return utilString.pad(value.getMonth() + 1, number, "0", true);
                    case 3 :
                        var monthShort = res.monthShort;
                        if (monthShort) {
                            return monthShort[value.getMonth()];
                        }
                        return res.month[value.getMonth()].substring(0, number);
                    default :
                        return res.month[value.getMonth()];
                }
            },

            "I" : function (value, number) {
                return iataMonths[value.getMonth()];
            },

            "y" : function (value, number) {
                switch (number) {
                    case 1 :
                    case 2 :
                        return value.getFullYear().toString().slice(2);
                    default :
                        return utilString.pad(value.getFullYear(), number, "0", true);
                }
            },

            "G" : function (value, number) {
                return aria.utils.Date.NOT_SUPPORTED_MESSAGE;
            },

            "E" : function (value, number) {
                switch (number) {
                    case 1 :
                    case 2 :
                    case 3 :
                        var dayShort = res.dayShort;
                        if (dayShort) {
                            return dayShort[value.getDay()];
                        }
                        return res.day[value.getDay()].substring(0, number);
                    default :
                        return res.day[value.getDay()];
                }
            },

            /*
             * Time patterns
             */

            // h:hh:Hour in day am/pm (1-12) or (01-12)
            "h" : function (value, number) {
                var hours = value.getHours();
                if (hours === 0) {
                    hours = 12;
                } else if (hours >= 13) {
                    hours -= 12;
                }

                if (hours < 10 && number === 2) {
                    hours = '0' + hours;
                }
                return hours;
            },

            // h:hh:Hour in day (0-23) or (00-23)
            "H" : function (value, number) {
                var hours = value.getHours();
                if (hours < 10 && number === 2) {
                    hours = '0' + hours;
                }
                return hours;
            },

            // a: Part of day, AM or PM
            "a" : function (value, number) {
                var hours = value.getHours();
                return hours < 12 ? utilRes.timeFormatLabels.am : utilRes.timeFormatLabels.pm;
            },

            // m:mm:Minute in hour (0-59) or (00-59)
            "m" : function (value, number) {
                var minutes = value.getMinutes();
                if (minutes < 10 && number === 2) {
                    minutes = '0' + minutes;
                }
                return minutes;
            },

            // s:ss:Seconds in minute (0-59) or (00-59)
            "s" : function (value, number) {
                var seconds = value.getSeconds();
                if (seconds < 10 && number === 2) {
                    seconds = '0' + seconds;
                }
                return seconds;
            }

        };

        /**
         * cache for format functions
         * @private
         */
        this._formatCache = {};

        /**
         * simple format valid check : 0 or 1 month + digits + separators
         * @private
         * @type RegExp
         */
        this._interpret_isValid = /^[\d\W]*([^\d\+\\\/]+)?[\d\W]*$/i;

        /**
         * special case 1 RegExp : 5 -> the 5th of today's month
         * @private
         * @type RegExp
         */
        this._interpret_specialCase1 = /^\d{1,2}$/;

        /**
         * special case 2 RegExp : +-5 -> today +-5 days
         * @private
         * @type RegExp
         */
        this._interpret_specialCase2 = /^[+\-]\d+$/;

        /**
         * special case 3 RegExp : 10DEC/+-5 -> 10DEC +-5 days. Localized regexp.It is set in method
         * _prepareLocalizedPatterns at initialization and every time the locale changes
         * @private
         * @type RegExp
         */
        this._interpret_specialCase3 = null;
        /**
         * @private
         * @type String
         */
        this._allowedSeparator = "(?:\\s+|[^dMyI]{1})";
        /**
         * corresponding strings yy, yyyy,M,MM,d,dd
         * @private
         * @type String
         */
        this._yearOrMonthOrDay_format = "(y{2}|y{4}|M{1,2}|d{1,2})";
        /**
         * corresponding strings yy, yyyy,MMM,I,d,dd
         * @private
         * @type String
         */
        this._yearOrIATAMonthOrDay_format = "(y{2}|y{4}|I|[a-z|A-Z]{3}|d{1,2})";
        /**
         * corresponding strings yy, yyyy,M,MM
         * @private
         * @type String
         */
        this._yearOrMonth_format = "(y{2}|y{4}|M{1,2})";
        /**
         * corresponding strings yy, yyyy,MMM,I
         * @private
         * @type String
         */
        this._yearOrIATAMonth_format = "(y{2}|y{4}|I|[a-z|A-Z]{3})";
        /**
         * corresponding strings M,MM,d,dd
         * @private
         * @type RegExp
         */
        this._dayOrMonth_format = "(d{1,2}|M{1,2})";
        /**
         * corresponding strings MMM,I,d,dd
         * @private
         * @type RegExp
         */
        this._dayOrIATAMonth_format = "(d{1,2}|I|[a-z|A-Z]{3})";
        /**
         * Checks if the pattern is yyyy*MM*dd, * can be any character except alphanumeric the order of year, month and
         * day can be reversed
         * @private
         * @type RegExp
         */

        this._fullDatePattern = new RegExp("^" + this._yearOrMonthOrDay_format + this._allowedSeparator
                + this._yearOrMonthOrDay_format + this._allowedSeparator + this._yearOrMonthOrDay_format + "$");
        /**
         * Checks if the pattern is MM*dd, * can be any character except alphanumeric, the order of month and day can be
         * reversed
         * @private
         * @type RegExp
         */
        this._dayAndMonthDatePattern = new RegExp("^" + this._dayOrMonth_format + this._allowedSeparator
                + this._dayOrMonth_format + "$");

        /**
         * Checks if the pattern isMMM*dd, * can be any character except alphanumeric, the order of month and day can be
         * reversed
         * @private
         * @type RegExp
         */
        this._dayAndIATAMonthDatePattern = new RegExp("^" + this._dayOrIATAMonth_format + this._allowedSeparator
                + this._dayOrIATAMonth_format + "$");
        /**
         * Checks if the pattern is yyyy*MM, * can be any character except alphanumeric, the order of year and month can
         * be reversed
         * @private
         * @type RegExp
         */
        this._yearAndMonthDatePattern = new RegExp("^" + this._yearOrMonth_format + this._allowedSeparator
                + this._yearOrMonth_format + "$");
        /**
         * Checks if the pattern is yyyy*MMM, * can be any character except alphanumeric, the order of year and month
         * can be reversed
         * @private
         * @type RegExp
         */
        this._yearAndIATAMonthDatePattern = new RegExp("^" + this._yearOrIATAMonth_format + this._allowedSeparator
                + this._yearOrIATAMonth_format + "$");
        /**
         * Checks if the pattern is yyyy*MMM*dd, * can be any character except alphanumeric, the order of year month and
         * day can be reversed
         * @private
         * @type RegExp
         */
        this._fullIATADatePattern = new RegExp("^" + this._yearOrIATAMonthOrDay_format + this._allowedSeparator
                + this._yearOrIATAMonthOrDay_format + this._allowedSeparator + this._yearOrIATAMonthOrDay_format + "$");
        /**
         * An array containing all date patterns allowed as inputPattern
         * @private
         * @type RegExp
         */
        this._allDateInputPatterns = [this._fullDatePattern, this._fullIATADatePattern, this._dayAndMonthDatePattern,
                this._dayAndIATAMonthDatePattern, this._yearAndMonthDatePattern, this._yearAndIATAMonthDatePattern];

        /**
         * 3 char possibility, something like 1/3 (1st of march)
         * @private
         * @type RegExp
         */
        this._interpret_littleDate = /^\d\W\d$/;
        /**
         * year recognition RegExp, used in inputPattern definition
         * @private
         * @type RegExp
         */
        this._interpret_isYear = /yyyy/g;
        /**
         * year on 2 digits recognition RegExp,used in inputPattern definition
         * @private
         * @type RegExp
         */
        this._interpret_isYearOn2Digit = /yy/g;
        /**
         * month recognition RegExp, used in inputPattern definition
         * @private
         * @type RegExp
         */
        this._interpret_isAnymonth = /MMM|I|MM/g;

        /**
         * Localized month recognition RegExp Parenthesis are used in this regexp to capture a backreference for
         * replacement. It is set in method _prepareLocalizedPatterns at initialization and every time the locale
         * changes
         * @private
         * @type RegExp
         */
        this._interpret_isMonth = null;
        /**
         * day recognition RegExp, used in inputPattern definition
         * @private
         * @type RegExp
         */
        this._interpret_isDay = /dd/g;

        /**
         * recognize something like 01022008 RegExp
         * @private
         * @type RegExp
         */
        this._interpret_digitOnly = /^\d+$/;

        /**
         * separators RegExp : recognize any being not a number or a letter
         * @private
         * @type RegExp
         */
        this._separators = /[^\w]/;

        /*
         * Time RegExp
         */

        /**
         * check for am pm in time string
         * @private
         * @type(RegExp)
         */

        this._interpret_time_ampm = /am|pm|a\.m\.|p\.m\.|a|p|\sp\sm/g;

        /**
         * simple format valid check : at least one digit at the beginning of the string
         * @private
         * @type RegExp
         */

        this._interpret_time_isValid = /^\d/;

        /**
         * check string for any unwanted characters except separators and pattern letters.
         * @private
         * @type RegExp
         */
        this._interpret_time_remove_unwantedCharacters = /[^\\h;m,.\-:\/\d]+/gi;

        /**
         * check string for any separators and pattern letters.
         * @private
         * @type RegExp
         */
        this._interpret_time_remove_separatorCharacters = /[\\h;m,.\-:\/\s]/;

        /**
         * when formatting, pattern U change output to uppercase
         * @protected
         * @type Boolean
         */
        this._formatToUpperCase = false;

        this._prepareLocalizedPatterns();

        aria.core.ResMgr.$on({
            "resourcesReloadComplete" : this._prepareLocalizedPatterns,
            scope : this
        });

    },
    $destructor : function () {
        this._formatCache = null;
        aria.core.ResMgr.$unregisterListeners(this);
    },
    $statics : {
        PATTERN_ERROR_MESSAGE : "##PATTERN_ERROR##",
        FORMAT_ERROR_MESSAGE : "##FORMAT_ERROR##",
        NOT_SUPPORTED_MESSAGE : "##NOT_SUPPORTED##",

        // ERROR MESSAGES:
        FORMATTER_STATEMENT_NOT_FOUND : "Following pattern %1 is not defined for this formatter: %2",
        FORMATTER_UNFINISHED_LITTERAL : "Unfinished litteral in this formatter: %1",
        INVALID_FORMAT_TYPE : "Application config format can only be a string or a function",
        INVALID_INPUT_PATTERN_TYPE : "Defined pattern : %1 inputPattern can only be a string, a function or an array of strings and/or functions",
        INVALID_INPUT_PATTERN_DUPLICATE : "Invalid pattern in inputPattern property definition: %1 year, month or day is duplicated",
        INVALID_FIRST_DAY_OF_WEEK : "Invalid first day of week. Received: %1 while allowed values are: 0, 1, 6.",

        // DAYS OF WEEK FOR WEEK-START:
        SUNDAY : 0,
        MONDAY : 1,
        SATURDAY : 6,

        /**
         * Number of milliseconds in a day.
         * @type Number
         */
        MS_IN_A_DAY : 86400000
    },
    $prototype : {

        /*
         * Time functions
         */

        /**
         * Interpret a String as a JS date if possible. <br />
         * This function only interprets time and returns a JS Date object where the date is today and the time (H/m/s)
         * is the one interpreted. <br />
         * Possible separators are '\', ';', ',', '.', '-', ':' or a whitespace.<br />
         * Hours and minutes can be followed by the letters 'h' and 'm'
         * @example
         * Given the following extry string, the result in the hh:mm:ss format is
         * <pre>
         * string     format (24h)
         * 1            01:00:00
         * 1 10         01:10:00
         * 1,20         01:20:00
         * 1h 30m       01:30:00
         * 1;40pm       13:40:00
         * 2-10-30am    02:10:30
         * </pre>
         *
         * @param {String} entryStr String to be interpreted
         * @return {Date}
         */
        interpretTime : function (entryStr) {

            var entry, jsTime, hours = 0, minutes = 0, seconds = 0, pmCorrection = 0, amCorrection = false, i = 0;

            if (!entryStr) {
                return null;
            }

            entry = entryStr;

            // need to check for at least one digit at the beginning of the string
            if (!this._isValidTime(entry)) {
                return null;
            }

            // need to check for PM
            if (this._isPM(entry)) {
                pmCorrection = 12;
            }

            // need to check for AM
            if (this._isAM(entry)) {
                amCorrection = true;
            }

            // need to replace am/pm from string
            entry = this._removeAMPM(entry);

            // need to remove any characters that are not separators,
            // digits, h, or m
            entry = this._removeUnwantedCharacters(entry);

            // check string contains a digit as the first character
            if (!this._isValidTime(entry)) {
                return null;
            }

            // calculate the hours from the string
            hours = this._calculateHours(entry);

            if (hours === null) {
                return null;
            }

            // remove hours from string users the second value in the hours
            // array to determine how many digits to remove
            for (i = 0; i < hours[1]; i++) {
                entry = this._removeHMS(entry);
            }

            // convert hours to integer
            hours = parseFloat(hours);

            // action pmCorrection
            if (hours < 12 && (pmCorrection)) {
                hours += pmCorrection;
            }

            // action amCorrection
            if (hours === 12 && amCorrection) {
                hours = 0;
            }

            // reset 24 to 0
            if (hours === 24) {
                hours = 0;
            }

            // remove separator from string
            entry = this._removeSeparator(entry);

            // check string contains a digit as the first character
            if (!this._isValidTime(entry)) {
                // return the time
                jsTime = this._returnTime(hours, minutes, seconds);
                return jsTime;
            }

            // calculate the minutes from the string
            minutes = this._calculateMS(entry);

            // remove minutes from string uses the second value in the
            // minutes array to determine how many digits to remove
            for (i = 0; i < minutes[1]; i++) {
                entry = this._removeHMS(entry);
            }
            // convert minutes to integer
            minutes = parseFloat(minutes);

            // remove separator from string
            entry = this._removeSeparator(entry);

            // check string contains a digit as the first character
            if (!this._isValidTime(entry)) {
                // return the time
                jsTime = this._returnTime(hours, minutes, seconds);
                return jsTime;
            }

            // calculate the seconds from the string
            seconds = parseFloat(this._calculateMS(entry));

            // return the time
            jsTime = this._returnTime(hours, minutes, seconds);
            return jsTime;
        },

        /**
         * Tests string is valid i.e has a least one digit at the beginning.
         * @protected
         * @param {String} time
         * @return {Boolean}
         */
        _isValidTime : function (time) {
            if (!this._interpret_time_isValid.test(time)) {
                return false;
            } else {
                return true;
            }
        },

        /**
         * Tests string contains pm.
         * @protected
         * @param {String} time
         * @return {Boolean}
         */
        _isPM : function (time) {
            var pm = time.toLowerCase();
            pm = pm.match(this._interpret_time_ampm);

            if (pm !== null && pm[0].indexOf("p") !== -1) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Tests string contains am.
         * @protected
         * @param {String} time
         * @return {Boolean}
         */
        _isAM : function (time) {
            var am = time.toLowerCase();
            am = am.match(this._interpret_time_ampm);

            if (am !== null && am[0].indexOf("a") !== -1) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Remove am/pm from string.
         * @protected
         * @param {String} time
         * @return {String}
         */
        _removeAMPM : function (time) {
            var toReplace = time.toLowerCase();
            toReplace = time.match(this._interpret_time_ampm);
            time = time.replace(toReplace, "");

            return time;
        },

        /**
         * Remove unwanted characters from string.
         * @protected
         * @param {String} time
         * @return {String}
         */
        _removeUnwantedCharacters : function (time) {

            var toReplace = time.match(this._interpret_time_remove_unwantedCharacters);
            if (toReplace !== null) {
                for (var i = 0; i < toReplace.length; i++) {
                    if (time.indexOf(toReplace[i]) !== -1) {
                        time = time.replace(toReplace[i], "");
                    }
                }
            }

            time = aria.utils.String.trim(time);

            return time;
        },

        /**
         * Remove hours/minutes/seconds from string.
         * @protected
         * @param {String} time
         * @return {String}
         */
        _removeHMS : function (time) {
            var toReplace = time.match(this._interpret_time_isValid);
            time = time.replace(toReplace, "");
            return time;
        },

        /**
         * Remove separator from string.
         * @protected
         * @param {String} time
         * @return {String}
         */
        _removeSeparator : function (time) {
            var toReplace = time.match(this._interpret_time_remove_separatorCharacters);
            time = time.replace(toReplace, "");
            return time;
        },

        /**
         * Calculate hours from string.
         * @protected
         * @param {String} time
         * @return {Array}
         */
        _calculateHours : function (time) {

            var hours = [];
            var characterCheck1 = time.charAt(0);
            var characterCheck2 = time.charAt(1);

            // where the first two digits are 24 need to set the hour to 00
            if (characterCheck1 === '2' && characterCheck2 === '4') {
                hours[0] = 0; // value to be used for hours
                hours[1] = 2; // number of digits for hours in entry
                // string
                return hours;
            }

            // where there is a second digit and (the first digit is 2 the
            // second digit cannot be more than 3) or (the first digit
            // cannot be more than 1) otherwise the first digit is the hour

            if (characterCheck2.match(this._interpret_digitOnly)
                    && (characterCheck1 === '2' && characterCheck2 < '4' || characterCheck1 < '2')) {
                hours[0] = characterCheck1 + characterCheck2; // value to
                // be used
                // for hours
                hours[1] = 2; // number of digits for hours in entry
                // string
                return hours;
            } else {
                if (characterCheck2.match(this._interpret_digitOnly) && time.length > 3) {
                    // like 3030/2501 - through error - 25h
                    return null;
                } else {
                    // like 3/30/303
                    // the hour is the first digit
                    hours[0] = characterCheck1; // value to be used for hours
                    hours[1] = 1; // number of digits for hours in entry
                    // string
                }

            }

            if (hours[0].match(this._interpret_digitOnly)) {
                return hours;
            } else {
                return null;
            }
        },

        /**
         * Calculate minutes or seconds from string.
         * @protected
         * @param {String} time
         * @return {Array}
         */
        _calculateMS : function (time) {
            var unit = [];
            var characterCheck1 = time.charAt(0);
            var characterCheck2 = time.charAt(1);

            // where there is a second digit the first digit cannot be more
            // than 5
            if (characterCheck2.match(this._interpret_digitOnly) && characterCheck1 < 6) {
                unit[0] = characterCheck1 + characterCheck2; // value to
                // be used
                // for
                // minutes/seconds
                unit[1] = 2; // number of digits for minutes/seconds in
                // entry string
                return unit;
            } else {
                // the minutes/seconds are the first digit
                unit[0] = characterCheck1; // value to be used for
                // minutes/seconds
                unit[1] = 1; // number of digits for minutes/seconds in
                // entry string
            }

            if (unit[0].match(this._interpret_digitOnly)) {
                return unit;
            } else {
                return null;
            }
        },

        /**
         * Creates and returns a date time object.
         * @protected
         * @param {String} hours
         * @param {String} minutes
         * @param {String} seconds
         * @return {object}
         */
        _returnTime : function (hours, minutes, seconds) {
            var jsTime = new Date();
            jsTime.setHours(hours, minutes, seconds);
            return jsTime;
        },

        /**
         * End Time functions
         */

         /**
          * Returns the full year corresponding to the year entered by the user.
          * @param {Number} year entered by the user (can be either 2 digits or 4 digits)
          * @param {aria.utils.Beans:options} options options object, only its cutYear property is used - optional
          * @return {Number} full year (4 digits)
          */
        _applyCutYear : function (year, options) {
            if (year < 100) {
                var cutYear = (options && ("cutYear" in options)) ? options.cutYear : this._cutYear;
                year += year > cutYear ? 1900 : 2000;
            }
            return year;
        },

        /**
         * Interpret a String as a JS Date if possible<br />
         * This function only interprets dates and returns a JS Date object where the date is the one interpreted and
         * the time is set to 00:00:00 <br />
         * It can interpret dates in the format d/M/Y and M/d/Y plus some other special cases. Any non alphanumeric
         * character can be used as separator<br />
         * @example
         * Given the following extry string, the result in the format d:MMM:Y is
         * <pre>
         * string       format
         * 1             (first day of current month)
         * 1 12          1 Dec (current year)
         * 10/3/2012     10 Mar 2012
         * 2APR2012      2 Apr 2012
         * +5            (five days from now)
         * -2            (two days ago)
         * 10JUN2012/+3  13 Jun 2012
         * </pre>
         *
         * @param {String} entryStr String to be interpreted
         * @param {aria.utils.Beans:options} options options for the date interpreter - optional
         *
         * @return {Date}
         */
        interpret : function (entryStr, options) {
            var inputPattern, outputPattern;

            if (options) {
                inputPattern = options.inputPattern;
                outputPattern = options.outputPattern;
            }
            // is input pattern set?
            if (inputPattern) {
                var parsedDate = this._interpretAgainstPattern(entryStr, inputPattern, options);
                if (parsedDate) {
                    return parsedDate;
                }
                // In case inputPattern is not mentioned, pattern will take precedence
            } else if (outputPattern) {
                var parsedDate = this._interpretAgainstPattern(entryStr, outputPattern, options);
                if (parsedDate) {
                    return parsedDate;
                }
            }

            var entry, entrylen, dateOptions;
            /* Code for Reference Date backward compatibility */
            dateOptions = aria.utils.Type.isDate(options) ? {
                referenceDate : options
            } : options || {};
            /* Code for Reference Date backward compatibility ends */

            if (!entryStr) {
                return null;
            }
            entry = aria.utils.String.trim(entryStr);
            entrylen = entry.length;
            // will not interpret something that does not looks like a bit
            // like a date
            if (!this._interpret_isValid.test(entry)) {
                return null;
            }

            // special case 1 : 5 -> the 5th of today's month
            if (this._interpret_specialCase1.test(entry)) {
                return this.interpretWithDate(entry);
            }

            // special case 2 : +-5 -> today +-5 days
            if (this._interpret_specialCase2.test(entry)) {
                return this.interpretWithRefDate(entry, dateOptions.referenceDate);
            }

            // special case 3 10DEC11/+5 -> 10DEC2011 + 5 days
            if (this._interpret_specialCase3.test(entry)) {
                return this.interpretFullDateRef(entry, dateOptions);
            }
            // if length is less than 3 its not date string
            if (entrylen < 3) {
                return null;
            }
            if (entrylen == 3) {

                // special case 4 : just the month
                // if this is this month, then it's today, else the first of
                // the month

                if (this._interpret_isMonth.test(entry)) {
                    return this.interpretMonth(entry);
                }

                // only possible 3 char possibility is something like 1/3
                // (1st of march)
                // -> we can add a 0 at the beginning without any risk
                if (this._interpret_littleDate.test(entry)) {
                    entry = "0" + entry;
                } else {
                    return null;
                }
            }
            /*
             * Remaining cases : classic interpret we will insert separators, then cut the entry on separators and
             * interpret it
             */
            // To Interpret all Remaining cases
            // check if only month and year is sent in date string.
            if (!dateOptions.isMonthYear) {
                return this.interpretDateAndMonth(entry, dateOptions);
            } else {
                return this.interpretMonthAndYear(entry, dateOptions);
            }
            // return null if nothing matches

            return null;
        },
        /**
         * Interpret a String as a JS Date against a pattern<br />
         * @param {String} entryStr String to be interpreted
         * @param {Array} pattern matching the string to be interpreted
         * @param {aria.utils.Beans:options} options options for the date interpreter - optional
         * @return {Date}
         */
        _interpretAgainstPattern : function (entryStr, inputPattern, options) {
            if (aria.utils.Type.isFunction(inputPattern) || aria.utils.Type.isString(inputPattern)) {
                inputPattern = [inputPattern];
            } else if (!aria.utils.Type.isArray(inputPattern)) {
                this.$logError(this.INVALID_INPUT_PATTERN_TYPE, inputPattern);
                return null;
            }
            var entry = aria.utils.String.trim(entryStr), jsDate, indexes, datePattern, patternComposition, userInputInterpreter;
            for (var i = 0; i < inputPattern.length; i++) {
                if (aria.utils.Type.isFunction(inputPattern[i])) {
                    jsDate = inputPattern[i](entry);
                    if (aria.utils.Type.isDate(jsDate)) {
                        return jsDate;
                    }
                } else if (!aria.utils.Type.isString(inputPattern[i])) {
                    this.$logError(this.INVALID_INPUT_PATTERN_TYPE, inputPattern);
                } else {
                    if (this._containDuplicates(inputPattern[i])) {
                        this.$logError(this.INVALID_INPUT_PATTERN_DUPLICATE, inputPattern[i]);
                        return null;
                    }
                    for (var j = 0; j < this._allDateInputPatterns.length; j++) {
                        datePattern = this._allDateInputPatterns[j];
                        patternComposition = datePattern.exec(inputPattern[i]);
                        if (patternComposition) {
                            // determines the position of year, month ,and day
                            indexes = this._generateIndexes(datePattern, patternComposition);
                            // user input parser
                            userInputInterpreter = this._userInputFormatGenerator(patternComposition);
                            if (userInputInterpreter.test(entry.toUpperCase())) {
                                jsDate = this._interpretDateWithAnySeparator(userInputInterpreter, entry.toUpperCase(), indexes.yearIndex, indexes.monthIndex, indexes.dayIndex, options);
                            }
                            if (aria.utils.Type.isDate(jsDate)) {
                                return jsDate;
                            }
                        }

                    }

                }

            }
            return null;
        },

        /**
         * checks if there is no duplicates in a pattern to avoid cases like yyyy/yyyy/MM
         * @param {Array} patternComposition an array containing different parts of a pattern
         * @return {Boolean}
         */
        _containDuplicates : function (pattern) {
            var yearOccurence, monthOccurence, dayOccurence;
            if (pattern.match(this._interpret_isYear)) {
                yearOccurence = pattern.match(this._interpret_isYear).length;
            } else if (pattern.match(this._interpret_isYearOn2Digit)) {
                yearOccurence = pattern.match(this._interpret_isYearOn2Digit).length;
            }
            if (pattern.match(this._interpret_isAnyMonth)) {
                monthOccurence = pattern.match(this._interpret_isAnyMonth).length;
            }
            if (pattern.match(this._interpret_isDay)) {
                dayOccurence = pattern.match(this._interpret_isDay).length;
            }

            if (yearOccurence > 1 || monthOccurence > 1 || dayOccurence > 1) {
                return true;
            }
            return false;
        },
        /**
         * Interprets as Date 10: for 10th of current month
         * @param {String} dateStr
         * @return {Date}
         */
        interpretWithDate : function (dateStr) {
            var date = parseInt(dateStr, 10), jsdate;
            // is valid date
            if (!date) {
                return null;
            }
            jsdate = new Date();
            jsdate.setDate(date);

            // is valid ?
            if (jsdate.getDate() !== date) {
                return null;
            }

            return jsdate;
        },

        /**
         * Interpret as Date +-5: for today +-5 days
         * @param {String} dateStr as -+5
         * @param {Date} referenceDate optional date reference
         */
        interpretWithRefDate : function (dateStr, referenceDate) {
            var shift = parseInt(dateStr, 10), jsdate;
            // When a reference date is set, the shift needs to be added to the reference date.
            if (referenceDate != null) {
                jsdate = new Date(referenceDate.getTime());
            } else {
                jsdate = new Date();
            }
            jsdate.setDate(jsdate.getDate() + shift);
            if (!aria.utils.Type.isValidDate(jsdate)) {
                // too large shift values (such as +100000000) lead to an invalid date
                return null;
            }
            return jsdate;

        },

        /**
         * To interpret the date 01Jan2012/+5
         * @param {String} dateStr string that needs to be parsed
         * @param {aria.utils.Beans:options} options options for the date interpreter - optional
         * @return {Date}
         */
        interpretFullDateRef : function (dateStr, options) {
            var execResult = this._interpret_specialCase3.exec(dateStr), jsdate;
            var newEntry = execResult[1];
            var shift = parseInt(execResult[3], 10);
            jsdate = this.interpretDateAndMonth(newEntry, options);
            if (jsdate) {
                jsdate.setDate(jsdate.getDate() + shift);
                if (!aria.utils.Type.isValidDate(jsdate)) {
                    // too large shift values (such as +100000000) lead to an invalid date
                    return null;
                }
            }
            return jsdate;

        },
        /**
         * @param {RegExp} format
         * @param {String} patternComposition
         * @return {Object}
         */

        _generateIndexes : function (format, patternComposition) {
            var result = {}, yearIndex = null, monthIndex = null, dayIndex = null, arrayUtil = aria.utils.Array;
            yearIndex = arrayUtil.indexOf(patternComposition, "yyyy");
            if (yearIndex === -1) {
                yearIndex = arrayUtil.indexOf(patternComposition, "yy");
            }
            dayIndex = arrayUtil.indexOf(patternComposition, "dd");
            if (dayIndex === -1) {
                dayIndex = arrayUtil.indexOf(patternComposition, "d");
            }
            if (format === this._fullDatePattern || format === this._yearAndMonthDatePattern
                    || format === this._dayAndMonthDatePattern) {
                monthIndex = arrayUtil.indexOf(patternComposition, "MM");
                if (monthIndex === -1) {
                    monthIndex = arrayUtil.indexOf(patternComposition, "M");
                }

            } else if (format === this._fullIATADatePattern || format === this._yearAndIATAMonthDatePattern
                    || format === this._dayAndIATAMonthDatePattern) {
                monthIndex = arrayUtil.indexOf(patternComposition, "MMM");
                if (monthIndex === -1) {
                    monthIndex = arrayUtil.indexOf(patternComposition, "I");
                }

            }
            if (yearIndex !== -1) {
                result.yearIndex = yearIndex;
            }
            if (monthIndex !== -1) {
                result.monthIndex = monthIndex;
            }
            if (dayIndex !== -1) {
                result.dayIndex = dayIndex;
            }
            return result;

        },
        /**
         * Generate a regular expression to verify user input accordingly to a date format
         * @param {Array}
         * @return {RegExp}
         */
        _userInputFormatGenerator : function (patterncomposition) {
            var userInputFormat = null;
            var monthIndex = aria.utils.Array.indexOf(patterncomposition, "MMM");
            if (monthIndex === -1) {
                monthIndex = aria.utils.Array.indexOf(patterncomposition, "I");
            }
            var monthRegExpSource = this._interpret_isMonth.source;
            switch (monthIndex) {
                case -1 :
                    // no Iata month
                    if (patterncomposition.length === 4) {
                        // full date pattern
                        userInputFormat = new RegExp("^" + "(\\d{" + patterncomposition[1].length + "})"
                                + this._allowedSeparator + "(\\d{" + patterncomposition[2].length + "})"
                                + this._allowedSeparator + "(\\d{" + patterncomposition[3].length + "})" + "$");
                    } else if (patterncomposition.length === 3) {
                        // monthAndYear or dayAndMonth date pattern
                        userInputFormat = new RegExp("^" + "(\\d{" + patterncomposition[1].length + "})"
                                + this._allowedSeparator + "(\\d{" + patterncomposition[2].length + "})" + "$");
                    }
                    break;
                case 1 :
                    // Iata month is in the first position example Mar 05, 2012
                    if (patterncomposition.length === 4) {
                        // full iata date pattern
                        userInputFormat = new RegExp("^" + monthRegExpSource + this._allowedSeparator + "(\\d{"
                                + patterncomposition[2].length + "})" + this._allowedSeparator + "(\\d{"
                                + patterncomposition[3].length + "})" + "$");
                    } else if (patterncomposition.length === 3) {
                        // monthAndYear or dayAndMonth iata date pattern
                        userInputFormat = new RegExp("^" + monthRegExpSource + this._allowedSeparator + "(\\d{"
                                + patterncomposition[2].length + "})" + "$");
                    }
                    break;
                case 2 :
                    // Iata month is in the second position example 2012 Mar, 2012
                    if (patterncomposition.length === 4) {
                        // full iata date pattern
                        userInputFormat = new RegExp("^" + "(\\d{" + patterncomposition[1].length + "})"
                                + this._allowedSeparator + monthRegExpSource + this._allowedSeparator + "(\\d{"
                                + patterncomposition[3].length + "})" + "$");
                    } else if (patterncomposition.length === 3) {
                        // monthAndYear or dayAndMonth iata date pattern
                        userInputFormat = new RegExp("^" + "(\\d{" + patterncomposition[1].length + "})"
                                + this._allowedSeparator + monthRegExpSource + "$");
                    }
                    break;
                case 3 :
                    // Iata month is in the third position example 2012, 05 Mar
                    // full iata date pattern
                    userInputFormat = new RegExp("^" + "(\\d{" + patterncomposition[1].length + "})"
                            + this._allowedSeparator + "(\\d{" + patterncomposition[2].length + "})"
                            + this._allowedSeparator + monthRegExpSource + "$");

                    break;
                default :
                    break;
            }
            return userInputFormat;
        },

        /**
         * Interpret into date a string in the format yyyy*MM*dd, * can be any separator except numeric
         * @param {String} dateStr string that needs to be parsed
         * @return {Date}
         */
        _interpretDateWithAnySeparator : function (userInputInterpreter, dateStr, yearIndex, monthIndex, dayIndex, options) {
            var execResult = userInputInterpreter.exec(dateStr), day, month, year, jsdate = null, currentDate = new Date();
            if (yearIndex) {
                year = execResult[yearIndex];
            } else {
                // in this case the year is not specified -> default = current year
                year = currentDate.getFullYear();
            }
            if (dayIndex) {
                day = execResult[dayIndex];
            } else {
                // in this case the day is not specified -> default = first day of the current month
                day = 1;
            }
            if (dateStr.match(this._interpret_isMonth)) {
                // IATA date
                month = this._getMonthIndex(execResult[monthIndex]);
            } else {
                month = execResult[monthIndex];
                month -= 1;
            }
            day = parseInt(day, 10);
            month = parseInt(month, 10);
            year = parseInt(year, 10);
            year = this._applyCutYear(year, options);
            jsdate = new Date(year, month, day);
            return jsdate;

        },
        /**
         * To interpret the date for entered month string
         * @param {String} dateStr for month string
         * @return {Date}
         */
        interpretMonth : function (dateStr) {
            var jsdate;
            var monthIndex = this._getMonthIndex(dateStr);
            if (monthIndex != -1) {
                jsdate = new Date();
                if (jsdate.getMonth() != monthIndex) {
                    jsdate.setDate(1);
                    jsdate.setMonth(monthIndex);
                }
                return jsdate;
            }

            // 3 letters not being a month is nothing
            return null;

        },

        /**
         * To interpret the date having month, date, optional year.
         * @param {String} dateStr string need to be parsed.
         * @param {aria.utils.Beans:options} options options for the date interpreter - optional
         * @return {Date}
         */
        interpretDateAndMonth : function (dateStr, options) {
            /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1488) */
            if (options != null && typeof options != "object") {
                options = {
                    isDateBeforeMonth: options
                };
            }
            /* BACKWARD-COMPATIBILITY-END (GitHub #1488) */
            var dateBeforeMonth = (options && ("isDateBeforeMonth" in options))
                  ? options.isDateBeforeMonth
                  : this._environment.getDateFormats().dateBeforeMonth;

            var dateArray = this._parseDateString(dateStr), interpretdDate, interpretdMonth, interpretdYear, arrayLen;
            arrayLen = dateArray.length;
            // With the previous changes, dateArray length should be 2 or 3.
            // Otherwise, this is not a date.
            if (arrayLen != 2 && arrayLen != 3) {
                return null;
            }
            if (arrayLen == 2) {
                if (this._interpret_isMonth.test(dateArray[1])) {
                    // Case 01JAN, Valid input according to SELL guidelines independent of
                    // locale
                    interpretdDate = dateArray[0];
                    interpretdMonth = dateArray[1];
                } else if (dateBeforeMonth) {
                    // case JAN2010
                    if (this._interpret_isMonth.test(dateArray[0])) {
                        interpretdDate = "1";
                        interpretdMonth = dateArray[0];
                        interpretdYear = dateArray[1];
                    } else {
                        interpretdDate = dateArray[0];
                        interpretdMonth = dateArray[1];
                    }
                } else {
                    interpretdMonth = dateArray[0];
                    // case JAN2010 : year merged with day
                    if (dateArray[1].length > 2) {
                        interpretdDate = dateArray[1].slice(0, 2);
                        interpretdYear = dateArray[1].slice(2);
                    } else {
                        interpretdDate = dateArray[1];
                    }
                }
            }

            if (arrayLen == 3) {
                if (this._interpret_isMonth.test(dateArray[1])) {
                    // Case 01JAN2010, Valid input according to SELL guidelines
                    // independent of locale
                    interpretdDate = dateArray[0];
                    interpretdMonth = dateArray[1];
                    interpretdYear = dateArray[2];
                } else if (dateBeforeMonth) {
                    interpretdDate = dateArray[0];
                    interpretdMonth = dateArray[1];
                    interpretdYear = dateArray[2];
                } else {
                    interpretdDate = dateArray[1];
                    interpretdMonth = dateArray[0];
                    interpretdYear = dateArray[2];
                }
            }

            return this._checkParsedDate(interpretdDate, interpretdMonth, interpretdYear, options);

        },

        /**
         * Interpret date if the string has only month and year
         * @param {String} dateStr
         * @param {aria.utils.Beans:options} options options for the date interpreter - optional
         * @return {Date}
         */
        interpretMonthAndYear : function (dateStr, options) {
            /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1488) */
            if (options != null && typeof options != "object") {
                options = {
                    yearBeforeMonth: options
                };
            }
            /* BACKWARD-COMPATIBILITY-END (GitHub #1488) */
            var yearBeforeMonth = options && options.yearBeforeMonth;
            var dateArray = this._parseDateString(dateStr), interpretdDate, interpretdMonth, arrayLen, interpretdYear;
            // The Array size should always be 2 if not return nothing
            arrayLen = dateArray.length;
            if (arrayLen != 2 && arrayLen != 3) {
                return null;
            }
            if (arrayLen == 2) {
                if (this._interpret_isMonth.test(dateArray[0])) {
                    interpretdMonth = dateArray[0];
                    interpretdYear = dateArray[1];
                } else if (yearBeforeMonth) {
                    if (this._interpret_isMonth.test(dateArray[1])) {
                        interpretdMonth = dateArray[1];
                        interpretdYear = dateArray[0];
                    } else {// to match Numbers
                        interpretdMonth = dateArray[1];
                        interpretdYear = dateArray[0];
                    }

                } else {
                    interpretdMonth = dateArray[0];
                    interpretdYear = dateArray[1];
                }
                // always set the date as first day of the month
                interpretdDate = 1;
            }

            if (arrayLen == 3) {
                if (this._interpret_isMonth.test(dateArray[1])) {
                    interpretdDate = dateArray[0];
                    interpretdMonth = dateArray[1];
                    interpretdYear = dateArray[2];

                } else if (yearBeforeMonth) {
                    if (this._interpret_isMonth.test(dateArray[2])) {
                        interpretdDate = dateArray[0];
                        interpretdMonth = dateArray[2];
                        interpretdYear = dateArray[1];

                    } else {
                        // to match the string 201006
                        interpretdDate = 1;
                        interpretdMonth = dateArray[2];
                        interpretdYear = dateArray[0] + dateArray[1];
                    }

                } else {
                    // To match the string 062010
                    interpretdDate = 1;
                    interpretdMonth = dateArray[0];
                    interpretdYear = dateArray[1] + dateArray[2];

                }

            }

            return this._checkParsedDate(interpretdDate, interpretdMonth, interpretdYear, options);

        },

        /**
         * parses the entered string into array of date, month and year
         * @param {String} entry the date string
         * @return {Array}
         */
        _parseDateString : function (entry) {
            var dateArray;
            if (this._interpret_digitOnly.test(entry)) {
                entry = entry.slice(0, 2) + "/" + entry.slice(2, 4) + "/" + entry.slice(4);
            } else {
                // replace all non-word characters with "/" skipping the month. Then surround the month word, if any,
                // with "/"
                var month = entry.match(this._interpret_isMonth);
                if (month) {
                    var parts = entry.split(month[0]);
                    for (var i = 0, len = parts.length; i < len; i++) {
                        parts[i] = parts[i].replace(/\W+/g, "/");
                    }
                    entry = parts.join("/" + month[0] + "/");
                } else {
                    entry = entry.replace(/\W+/g, "/");
                }
            }
            dateArray = entry.split(/\/+/);
            // clean the array of useless piece of empty strings
            for (var index = 0, l = dateArray.length; index < l; index++) {
                if (!dateArray[index]) {
                    dateArray.splice(index, 1);
                    index--;
                    l--;
                }
            }
            return dateArray;
        },

        /**
         * checks for the parsed date, month and year string and returns the date object.
         * @param {String} interpretdDate date string
         * @param {String} interpretdMonth month string
         * @param {String} interpretdYear year string
         * @param {aria.utils.Beans:options} options options for the date interpreter - optional
         * @return {Date} returns the date object
         */
        _checkParsedDate : function (interpretdDate, interpretdMonth, interpretdYear, options) {
            var jsdate;
            // get date integer
            if (this._interpret_digitOnly.test(interpretdDate)) {
                interpretdDate = parseInt(interpretdDate, 10);
            } else {
                interpretdDate = null;
            }

            // get month integer
            if (this._interpret_digitOnly.test(interpretdMonth)) {
                interpretdMonth = parseInt(interpretdMonth, 10) - 1;
            } else {
                var monthIndex = this._getMonthIndex(interpretdMonth);
                if (monthIndex !== -1) {
                    interpretdMonth = monthIndex;
                } else {
                    interpretdMonth = null;
                }
                // check if month is integer
                if (!aria.utils.Type.isNumber(interpretdMonth)) {
                    interpretdMonth = null;
                }
            }
            // get year integer
            if (interpretdYear) {
                if (this._interpret_digitOnly.test(interpretdYear)) {
                    interpretdYear = parseInt(interpretdYear, 10);
                } else {
                    interpretdYear = null;
                }
                interpretdYear = this._applyCutYear(interpretdYear, options);
            } else {
                var todaydate = new Date();
                interpretdYear = todaydate.getFullYear();
                var todayTime = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate()).getTime();
                // get the interpreted date
                todaydate = new Date(todaydate.getFullYear(), interpretdMonth, interpretdDate);
                if (todaydate.getTime() < todayTime) {
                    interpretdYear += 1;
                }
            }
            // new date instance with parsed date string
            jsdate = new Date(interpretdYear, interpretdMonth, interpretdDate);
            if (aria.utils.Type.isDate(jsdate)) {
                if (jsdate.getDate() != interpretdDate || jsdate.getMonth() != interpretdMonth
                        || jsdate.getFullYear() != interpretdYear) {
                    return null;
                } else {
                    return jsdate;
                }
            }

            return null;

        },

        /**
         * Utility which return a new date object with the non UTC function replaced by the UTC ones
         * @param {Date} date
         * @return {Date} a new date object
         */
        _createUTCDate : function (date) {
            var newDate = new Date(date.getTime());
            newDate.getFullYear = newDate.getUTCFullYear;
            newDate.getMonth = newDate.getUTCMonth;
            newDate.getDate = newDate.getUTCDate;
            newDate.getHours = newDate.getUTCHours;
            newDate.getMinutes = newDate.getUTCMinutes;
            newDate.getSeconds = newDate.getUTCSeconds;
            newDate.getMilliseconds = newDate.getUTCMilliseconds;
            return newDate;
        },

        /**
         * Format a date from a given pattern
         * @param {Date} date
         * @param {String} pattern. See
         * http://www.ariatemplates.com/usermanual/latest/localization_and_resources#Date_and_Time
         * @param {Boolean} utcTime if true, display UTC date/time instead of local
         * @return {String}
         */
        format : function (date, pattern, utcTime) {
            if (!aria.utils.Type.isDate(date)) {
                return null;
            }

            if (typeof pattern === 'function') {
                pattern = pattern();
            } else if (typeof pattern !== 'string') {
                this.$logError(this.INVALID_FORMAT_TYPE);
            }

            if (utcTime) {
                // create a date object whose local time is the UTC time:
                date = this._createUTCDate(date);
            }

            var formatFn = this._getFormatFunction(pattern);
            this.$assert(118, aria.utils.Type.isFunction(formatFn));

            return formatFn(date);
        },

        /**
         * Get an instance of a formatter for a given pattern
         * @protected
         * @param {String} pattern.
         * @return {Function}
         */
        _getFormatFunction : function (pattern) {

            var workPattern = pattern, currentChar, previousChar, inLitteral, litteral = [], quoteJustInserted = false, patternOccurency = 0, fnParts = [], formatFunction;

            // retrieve from cache
            if (this._formatCache[pattern]) {
                return this._formatCache[pattern];
            }

            while (workPattern.length > 0) {

                previousChar = currentChar;
                currentChar = workPattern.slice(0, 1); // first char
                workPattern = workPattern.slice(1); // workpattern without first char

                // first push any waiting pattern in fnParts if chars are
                // different
                if (previousChar !== currentChar) {
                    this._pushIfExists(fnParts, previousChar, patternOccurency, pattern);
                    patternOccurency = 0;
                }

                // check for litterals
                if (currentChar === "'") {
                    if (!inLitteral) {
                        if (previousChar === "'") { // case '' in litteral :
                            // we went out of
                            // litteral and enter
                            // again
                            litteral.push("'");
                            quoteJustInserted = true; // for the case 'something''' ->
                            // something'
                        }
                        inLitteral = true;
                    } else {
                        if (previousChar === "'") {
                            if (!quoteJustInserted) {
                                litteral.push("'"); // case '' directly in the pattern
                            }
                        }
                        inLitteral = false;
                    }
                    continue;
                }

                quoteJustInserted = false;

                // deals with something different than ' in litteral
                if (inLitteral) {
                    litteral.push(currentChar);
                    continue;
                }

                // deals with something not in litteral
                // first separators -> push them as litterals
                if (this._separators.test(currentChar)) {
                    litteral.push(currentChar);
                    continue;
                }

                // here the char is a letter or number outside a litteral.
                // first push any remaining litterals in fnParts
                if (litteral.length) {
                    fnParts.push(litteral.join(''));
                    litteral = [];
                }

                // same letter as previous
                if (currentChar === previousChar) {
                    patternOccurency++;
                } else {
                    // prepare new pattern
                    patternOccurency = 1;
                }
            }

            if (inLitteral) {
                this.$logError(this.FORMATTER_UNFINISHED_LITTERAL, pattern);
            }

            // deals with remaining pattern / litteral
            this._pushIfExists(fnParts, currentChar, patternOccurency, pattern);

            if (litteral.length) {
                fnParts.push(litteral.join(''));
            }

            var toUpperCase = this._formatToUpperCase;
            this._formatToUpperCase = false;

            // create formatter function
            formatFunction = function (entry) {
                var element, result = [];
                // try {
                for (var index = 0, l = fnParts.length; index < l; index++) {
                    element = fnParts[index];
                    if (aria.utils.Type.isObject(element)) {
                        result.push(element.patternFn(entry, element.occurency));
                    } else {
                        result.push(element);
                    }
                }
                // } catch (e) {
                // return aria.utils.Date.FORMAT_ERROR_MESSAGE;
                // }
                result = result.join('');
                if (toUpperCase) {
                    result = result.toUpperCase();
                }
                return result;
            };

            // cache it
            this._formatCache[pattern] = formatFunction;

            return formatFunction;
        },

        /**
         * Check if occurency is not null, and if not, check if patternChar is a valid letter, push the linked function
         * and occurency in the array fnParts. Used in _getFormatFunction
         * @private
         * @param {Array} fnParts
         * @param {String} patternChar
         * @param {Integer} patternOccurency
         * @param {String} originalPattern
         */
        _pushIfExists : function (fnParts, patternChar, patternOccurency, originalPattern) {
            var patternFn, utilType = aria.utils.Type;
            if (patternOccurency) {
                // special case for uppercase
                if (patternChar == 'U') {
                    this._formatToUpperCase = true;
                    return true;
                }
                patternFn = this.formatPatterns[patternChar];
                if (!utilType.isFunction(patternFn)) {
                    this.$logError(this.FORMATTER_STATEMENT_NOT_FOUND, [patternChar, originalPattern]);
                    fnParts.push(aria.utils.Date.PATTERN_ERROR_MESSAGE);
                } else {
                    fnParts.push({
                        patternFn : patternFn,
                        occurency : patternOccurency
                    });
                }
            }
        },

        /**
         * Check if two dates corresponds to the same day
         * @public
         * @param {Date} date1 First Date to check
         * @param {Date} date2 2nd Date to check
         * @return {Boolean}
         */
        isSameDay : function (date1, date2) {
            if (!date1 || !date2) {
                return false;
            }
            var formatFn = this._getFormatFunction('ddMMyyyy');
            return (formatFn(date1) === formatFn(date2));

        },

        /**
         * Return the first day of the week which contains date.
         * @public
         * @param {Date} date
         * @param {Number} firstDayOfWeek [optional, default depending on the regional settings] day to be defined as
         * the first in the week, 0 = sunday, 1 = monday ...
         * @return {Date} the first day of the week which contains date.
         */
        getStartOfWeek : function (date, firstDayOfWeek) {
            if (firstDayOfWeek == null) {
                firstDayOfWeek = this._environment.getFirstDayOfWeek();
            }
            var res = new Date(date);
            var difference = date.getDay() - firstDayOfWeek;
            if (difference < 0) {
                difference += 7;
            }
            res.setDate(res.getDate() - difference);
            return res;
        },

        /**
         * Return the number of days between two dates (always an integer).
         * @param {Date} date1 First date to check
         * @param {Date} date2 2nd date to check
         * @return {Integer} the number of days between two dates
         */
        dayDifference : function (date1, date2) {
            // Be aware of time shift:
            // if using (new Date(...,...,...) - new
            // Date(...,...,...))/(1000*60*60*24)
            // the result is not an integer if one date is in the winter and the other
            // in the summer
            var d1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
            var d2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
            var res = (d2 - d1) / (1000 * 60 * 60 * 24);
            this.$assert(949, res == Math.round(res));
            return res;
        },

        /**
         * Return a Date object with time set to 00:00:00. When comparing two dates (with &lt; and &gt; operators), it
         * is better to have all dates with the same time, so that time is not taken into account.
         * @param {Date} date The date you want to work on.
         * @return {Date} date with time set to 00:00:00, on the same day as the parameter. If the parameter is null,
         * return null.
         */
        removeTime : function (date) {
            if (date == null) {
                return null;
            }
            if (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0
                    || date.getMilliseconds() !== 0) {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            } else {
                return date;
            }
        },

        /**
         * Computes the number of times the day of the week of the given date has occured from the begining of the same
         * year to that date. Return 1 if this date is the first time this day of the week has occured since the
         * begining of the year. To return the week number of any date myDate, simply call:
         * <code>dayOfWeekNbrSinceStartOfYear(getStartOfWeek(myDate))</code>.
         * @param {Date} date The date you want to work on.
         * @return {Integer} the number of times the day of the week of the given date has occured from the begining of
         * the same year to that date.
         */
        dayOfWeekNbrSinceStartOfYear : function (date) {
            var d1 = Date.UTC(date.getFullYear(), 0, 1);
            var d2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
            var nbOfDays = (d2 - d1) / (1000 * 60 * 60 * 24); // number of days since
            // the begining of the
            // year
            this.$assert(981, nbOfDays == Math.round(nbOfDays));
            return 1 + Math.floor(nbOfDays / 7);
        },

        /**
         * Computes the week number for given date. It is locale-aware (week can start on Monday, Saturday or Sunday)
         * and follows standards about week calculations for different cultures. Use this function in preference to
         * <code>dayOfWeekNbrSinceStartOfYear</code>.
         * @param {Date} date The date you want to operate on.
         * @param {Integer} firstDayOfWeek [optional] first day of week in the locale. Allowed values:
         * <code>aria.utils.Date.{MONDAY|SUNDAY|SATURDAY}</code>. If not provided, it is read from the configuration
         * environment. If disallowed value provided, an error is logged and the function returns.
         * @return {Integer} standardized week number for given inputs.
         */
        getWeekNumber : function (date, firstDayOfWeek) {

            if (!aria.utils.Type.isDate(date)) {
                return;
            }

            if (firstDayOfWeek == null) {
                firstDayOfWeek = this._environment.getFirstDayOfWeek();
            }

            var refDay;
            var refDate = new Date(date.getTime());

            // we subtract certain amount of days, and then add fixed number to
            // get reference day of the week
            switch (firstDayOfWeek) {
                case this.MONDAY :
                    // week starts on MON, we look for the following THU
                    refDay = refDate.getDate() + 4 - (refDate.getDay() || 7);
                    break;

                case this.SUNDAY :
                    // week starts on SUN, we look for the following SAT
                    refDay = refDate.getDate() + 6 - (refDate.getDay());
                    break;

                case this.SATURDAY :
                    // week starts on SAT, we look for the following FRI
                    refDay = refDate.getDate() + 6 - (refDate.getDay() + 1) % 7;
                    break;

                default :
                    this.$logError(this.INVALID_FIRST_DAY_OF_WEEK, [firstDayOfWeek]);
                    return;
            }
            refDate.setDate(refDay); // can be negative, but JS handles it nicely
            var refTime = refDate.getTime();

            var january1 = new Date(refDate.getFullYear(), 0, 1);

            return Math.floor(Math.round((refTime - january1) / this.MS_IN_A_DAY) / 7) + 1;
        },

        /**
         * Compare two dates
         * @param {Date} firstDate
         * @param {Date} secondDate
         * @param {Boolean} time whether time should be taken into account for the comparison. It defaults to false
         * @return {Number} -1 if firstDate < secondDate, 0 if firstDate == secondDate, 1 if firstDate > secondDate
         */
        compare : function (firstDate, secondDate, time) {
            var firstTime = time ? firstDate.getTime() : this.removeTime(firstDate).getTime();
            var secondTime = time ? secondDate.getTime() : this.removeTime(secondDate).getTime();
            var difference = firstTime - secondTime;
            return (difference === 0) ? 0 : difference / Math.abs(difference);
        },

        /**
         * Prepare the array containing IATA months, localized long and short months for data interpretation
         * @private
         */
        _prepareLocalizedPatterns : function () {
            var res = this.dateRes, localizedMonths = res.month, localizedShortMonths = res.monthShort;
            var monthTexts = [], i, len;
            for (i = 0, len = localizedMonths.length; i < len; i++) {
                monthTexts.push(localizedMonths[i].toUpperCase());
            }
            if (localizedShortMonths) {
                for (i = 0, len = localizedShortMonths.length; i < len; i++) {
                    monthTexts.push(localizedShortMonths[i].toUpperCase());
                }
            } else {
                for (i = 0, len = localizedMonths.length; i < len; i++) {
                    monthTexts.push(localizedMonths[i].substring(0, 3).toUpperCase());
                }
            }

            monthTexts = monthTexts.concat(this._iataMonths);
            this._interpret_monthTexts = monthTexts;
            var source = monthTexts.join("|").replace("\\", "\\\\").replace(/\s/g, "\\s").replace(/\./g, "\\.");
            this._interpret_isMonth = new RegExp("(" + source + ")", "i");
            this._interpret_specialCase3 = new RegExp("^(\\d{1,2}\\s*(" + source + ")\\s*\\d{0,4})\\/([+\\-]\\d+)$", "i");
        },

        /**
         * Compute the month number out of the month name
         * @param {String} entry Month present in the date text
         * @return {Integer} month number, or -1 if no month is found
         */
        _getMonthIndex : function (entry) {
            return aria.utils.Array.indexOf(this._interpret_monthTexts, entry.toUpperCase()) % 12;
        }
    }
});
