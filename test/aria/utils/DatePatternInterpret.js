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
 * Test case for aria.utils.DatePatternInterpret
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.DatePatternInterpret",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Date"],
    $constructor : function () {
        this.$TestCase.$constructor.call(this);
        this.defaultTestTimeout = 60000;
    },
    $prototype : {
        testInputPattern : function () {
            var today = new Date();
            var expectedDate = new Date(2012, 2, 10);
            var expectedDateCurrentYear = new Date(today.getFullYear(), 2, 10);

            // one string pattern
            var inputPattern1 = "yyyy-MM-dd";
            var date1options = {
                inputPattern : inputPattern1
            };
            this.interpretInputPatternAndAssert("2012-03-10", date1options, expectedDate);
            // function pattern
            var userDefinedParser = function (dateStr) {
                if (dateStr === "today") {
                    return new Date();
                } else
                    return null;

            };
            var date2options = {
                inputPattern : userDefinedParser
            };

            this.interpretInputPatternAndAssert("today", date2options, today);
            // array of patterns
            var inputPattern3 = ["yyyy-I-dd", "yyyy:dd MMM", userDefinedParser, "yyyy*dd;MM", "yy-I", "d/yy.M", "I-dd",
                    "MMM.yyyy", "dKMM"];
            var date3options = {
                inputPattern : inputPattern3

            };
            this.interpretInputPatternAndAssert("2012-MAR-10", date3options, expectedDate);
            this.interpretInputPatternAndAssert("2012:10 Mar", date3options, expectedDate);
            this.interpretInputPatternAndAssert("today", date3options, today);
            this.interpretInputPatternAndAssert("2012*10;03", date3options, expectedDate);
            this.interpretInputPatternAndAssert("12-juL", date3options, new Date(2012, 6, 1));
            this.interpretInputPatternAndAssert("9/12.7", date3options, new Date(2012, 6, 9));
            this.interpretInputPatternAndAssert("mar-10", date3options, expectedDateCurrentYear);
            this.interpretInputPatternAndAssert("jul.2012", date3options, new Date(2012, 6, 1));
            this.interpretInputPatternAndAssert("9K07", date3options, new Date(today.getFullYear(), 6, 9));
        },

        interpretInputPatternAndAssert : function (dateStr, dateOptions, expectedDate) {
            var interpretedDate = aria.utils.Date.interpret(dateStr, dateOptions);
            this.assertEquals(interpretedDate.getDate(), expectedDate.getDate());
            this.assertEquals(interpretedDate.getMonth(), expectedDate.getMonth());
            this.assertEquals(interpretedDate.getFullYear(), expectedDate.getFullYear());
        },

        testAsyncLocalizedInterpretation : function () {

            this._toSkip = {
                "ja_JP" : {
                    "ddMMMyyyy" : [0, 1],
                    "ddMMM" : [0, 1]
                },
                "ko_KR" : {
                    "ddMMMyyyy" : [0, 1],
                    "ddMMMMyyyy" : [0, 1],
                    "ddMMM" : [0, 1],
                    "ddMMMM" : [0, 1]
                }
            };
            this._testLocale(0);
        },

        _testLocale : function (index) {
            var languages = this.languages = [["ar", "SA"], ["da", "DK"], ["de", "DE"], ["en", "GB"], ["en", "US"],
                    ["es", "ES"], ["et", "EE"], ["fi", "FI"], ["fr", "FR"], ["he", "IL"], ["is", "IS"], ["it", "IT"],
                    ["ja", "JP"], ["kl", "GL"], ["ko", "KR"], ["nl", "NL"], ["no", "NO"], ["pl", "PL"], ["pt", "BR"],
                    ["pt", "PT"], ["ru", "RU"], ["sv", "SE"], ["th", "TH"], ["tk", "TK"], ["tr", "TR"], ["zh", "CN"],
                    ["is", "IS"], ["zh", "TW"]];
            if (index < languages.length) {
                aria.core.AppEnvironment.setEnvironment({
                    language : {
                        primaryLanguage : languages[index][0],
                        region : languages[index][1]
                    }
                }, {
                    fn : this._afterLocaleChange,
                    scope : this,
                    args : index
                });
            } else {
                this.notifyTestEnd("testAsyncLocalizedInterpretation");
            }
        },

        _afterLocaleChange : function (res, index) {
            var language = this.languages[index].join("_");
            var patterns = ["dd MMM yyyy", "dd MMMM yyyy", "ddMMMyyyy", "ddMMMMyyyy", "dd MMM", "dd MMMM", "ddMMM",
                    "ddMMMM", "dd I yyyy", "ddIyyyy", "ddI", "dd-MMM-yyyy","dd/MMM*yyyy"];
            var date, dateUtil = aria.utils.Date, formattedDate, interpreted, middleDate;
            for (var k = 0; k < 12; k++) {
                date = new Date(2015, k, 1);
                middleDate = new Date(2015, k, 15);
                for (var j = 0; j < patterns.length; j++) {
                    var skip = this._toSkip[language] && this._toSkip[language][patterns[j]]
                            && aria.utils.Array.contains(this._toSkip[language][patterns[j]], k);
                    if (!skip) {
                        formattedDate = dateUtil.format(date, patterns[j]);
                        interpreted = dateUtil.interpret(formattedDate, {
                            outputPattern : patterns[j]
                        });

                        this._assertDatesEquality(date, interpreted, formattedDate, language, patterns[j]);

                        if (!/[\-\/]/.test(patterns[j])) {
                            // check +5 pattern
                            formattedDate = dateUtil.format(middleDate, patterns[j]);
                            interpreted = dateUtil.interpret(formattedDate + "/+5");
                            this._assertDatesEquality(middleDate, interpreted, formattedDate, language, patterns[j], "+5");

                            // check -5 pattern
                            interpreted = dateUtil.interpret(formattedDate + "/-5");
                            this._assertDatesEquality(middleDate, interpreted, formattedDate, language, patterns[j], "-5");
                        }
                    }

                }
            }
            var self = this;
            setTimeout(function () {
                // in AT 1.4.17, it is not supported to change again the locale from the callback of changeLocale...
                self._testLocale(++index);
            }, 1);
        },

        _assertDatesEquality : function (expected, got, formattedDate, language, pattern, shift) {
            shift = shift || 0;
            this.assertEquals(expected.getDate() + parseInt(shift, 10), got.getDate(), "Date " + formattedDate
                    + (shift ? "/" + shift : "") + " was not correctly interpreted in language " + language);

            this.assertEquals(expected.getMonth(), got.getMonth(), "Date " + formattedDate
                    + " was not correctly interpreted in language " + language);
            if (/y/.test(pattern)) {
                this.assertEquals(expected.getFullYear(), got.getFullYear(), "Date " + formattedDate
                        + " was not correctly interpreted in language " + language);
            }
        }
    }
});
