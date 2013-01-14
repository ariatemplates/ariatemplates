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

Aria.classDefinition({
    $classpath : "test.aria.utils.NumberLocale",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Number", "aria.utils.environment.Number", "aria.utils.Json"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);

        this._combinations = {
            US : {
                // no grouping separator
                "1" : "1",
                "12.0" : "12.0",
                "12.01.0.0.012" : null,
                "." : null,
                ".12" : ".12",

                // grouping separator at the beginning
                ",1" : null,
                ",111" : null,
                ",111.1" : null,

                // correct grouping
                "1,000" : "1000",
                "12,000" : "12000",
                "1,000.00" : "1000.00",
                "2,000." : "2000.",

                // invalid grouping
                "1,0" : null,
                "1," : null,
                "1,00" : null,
                "1,a" : null,
                "1.0,000" : null,
                "1200,000" : null,

                // multiple valid grouping
                "10,000,000" : "10000000",
                "20,000,000.00" : "20000000.00",

                // multiple invalid grouping
                "1,2,3" : null,
                "1,200,2" : null,
                "1,2,000" : null,
                "1,,000" : null,
                "10,000,000," : null,

                // valid with signs
                "+1,000" : "+1000",
                "+20,000" : "+20000",
                "+300,000" : "+300000",
                "-2,000,000" : "-2000000",
                "+2000" : "+2000",

                // invalid with sign
                "1,+20,000" : null,
                "+,1000" : null,
                "1+1" : null,
                "+1,0+0" : null,
                "+1,0+0,000" : null,
                "+3000,000" : null
            },
            FR : {
                // no grouping separator
                "1" : "1",
                "12,0" : "12.0",
                "12,01,0,0,012" : null,
                "," : null,
                ",12" : ".12",

                // grouping separator at the beginning
                ".1" : null,
                ".111" : null,
                ".111,1" : null,

                // correct grouping
                "1.000" : "1000",
                "12.000" : "12000",
                "1.000,00" : "1000.00",
                "2.000," : "2000.",

                // invalid grouping
                "1.0" : null,
                "1." : null,
                "1.00" : null,
                "1.a" : null,
                "1,0.000" : null,
                "1200.000" : null,

                // multiple valid grouping
                "10.000.000" : "10000000",
                "20.000.000,00" : "20000000.00",

                // multiple invalid grouping
                "1.2.3" : null,
                "1.200.2" : null,
                "1.2.000" : null,
                "1..000" : null,
                "10.000.000." : null,

                // valid with signs
                "+1.000" : "+1000",
                "+20.000" : "+20000",
                "+300.000" : "+300000",
                "-2.000.000" : "-2000000",
                "+2000" : "+2000",

                // invalid with sign
                "1.+20.000" : null,
                "+.1000" : null,
                "1+1" : null,
                "+1.0+0" : null,
                "+1.0+0.000" : null,
                "+3000.000" : null
            },
            CUSTOM : {
                // no grouping separator
                "1" : "1",
                "12.0" : "12.0",
                "12.01.0.0.012" : null,
                "." : null,
                ".12" : ".12",

                // grouping separator at the beginning
                " 1" : null,
                " 111" : null,
                " 111.1" : null,

                // correct grouping
                "1 000" : "1000",
                "12 000" : "12000",
                "1 000.00" : "1000.00",
                "2 000." : "2000.",

                // invalid grouping
                "1 0" : null,
                "1 " : null,
                "1 00" : null,
                "1 a" : null,
                "1.0 000" : null,
                "1200 000" : null,

                // multiple valid grouping
                "10 000 000" : "10000000",
                "20 000 000.00" : "20000000.00",

                // multiple invalid grouping
                "1 2 3" : null,
                "1 200 2" : null,
                "1 2 000" : null,
                "1  000" : null,
                "10 000 000 " : null,

                // valid with signs
                "+1 000" : "+1000",
                "+20 000" : "+20000",
                "+300 000" : "+300000",
                "-2 000 000" : "-2000000",
                "+2000" : "+2000",

                // invalid with sign
                "1 +20 000" : null,
                "+ 1000" : null,
                "1+1" : null,
                "+1 0+0" : null,
                "+1 0+0 000" : null,
                "+3000 000" : null
            },
            WEIRD : {
                // no grouping separator
                "1" : "1",
                "12!0" : "12.0",
                "12!01!0!0!012" : null,
                "!" : null,
                "!12" : ".12",

                // grouping separator at the beginning
                "\\1" : null,
                "\\111" : null,
                "\\111!1" : null,

                // correct grouping
                "1\\000" : "1000",
                "12\\000" : "12000",
                "1\\000!00" : "1000.00",
                "2\\000!" : "2000.",

                // invalid grouping
                "1\\0" : null,
                "1\\" : null,
                "1\\00" : null,
                "1\\a" : null,
                "1!0\\000" : null,
                "1200\\000" : null,

                // multiple valid grouping
                "10\\000\\000" : "10000000",
                "20\\000\\000!00" : "20000000.00",

                // multiple invalid grouping
                "1\\2\\3" : null,
                "1\\200\\2" : null,
                "1\\2\\000" : null,
                "1\\\\000" : null,
                "10\\000\\000\\" : null,

                // valid with signs
                "+1\\000" : "+1000",
                "+20\\000" : "+20000",
                "+300\\000" : "+300000",
                "-2\\000\\000" : "-2000000",
                "+2000" : "+2000",

                // invalid with sign
                "1\\+20\\000" : null,
                "+\\1000" : null,
                "1+1" : null,
                "+1\\0+0" : null,
                "+1\\0+0\\000" : null,
                "+3000\\000" : null,

                // US symbols
                "1.0" : null,
                " 1" : null
            },
            STRICT_FALSE : {
                // some of these are normally error, now they should be fine
                "1.00.000.0000" : "1000000000",
                "1..00" : "100",
                "1.0.0 00" : "100.00",
                "1 0.0" : null,
                "1 0" : "1.0",
                ".1" : null,
                "1.000" : "1000",
                "1.00 0" : "100.0"
            }
        }

        this._strictTrueCombinations = {
            PATTERNS : ["#,##.##", "#,###.###", "#,##,#.#", "#,#,#.##"],
            US : {
                "1,000" : [null, 1000, null, null],
                "1,0,0.00" : [null, null, null, 100],
                "1,0,00.00" : [null, null, null, null],
                "10,00,00.00" : [100000, null, null, null],
                "100987,00,0.1" : [null, null, 100987000.1, null],
                "1,0,0,0,0,0,0,0,0.00" : [null, null, null, 100000000],
                "12,3.00" : [null, null, 123, null],
                "2,3.00" : [null, null, 23, 23]
            },
            WEIRD : {
                "1\\000" : [null, 1000, null, null],
                "1\\0\\0!00" : [null, null, null, 100],
                "1\\0\\00!00" : [null, null, null, null],
                "10\\00\\00!00" : [100000, null, null, null],
                "100987\\00\\0!1" : [null, null, 100987000.1, null],
                "1\\0\\0\\0\\0\\0\\0\\0\\0!00" : [null, null, null, 100000000],
                "12\\3!00" : [null, null, 123, null],
                "2\\3!00" : [null, null, 23, 23]
            }
        }
    },
    $prototype : {
        setUp : function () {
            aria.core.AppEnvironment.setEnvironment({
                "currencyFormats" : {
                    currencyFormat : function () {
                        return "#,##0";
                    },
                    currencySymbol : "USD"
                }
            });
        },

        /**
         * Try to assign wrong values in the number configuration. Symbols must be a non digit single character.
         */
        test_configurationError : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "",
                    groupingSeparator : "",
                    strictGrouping : true
                }
            }, null, true);
            this.assertErrorInLogs(aria.utils.Number.INVALID_FORMAT, 3);

            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "1",
                    groupingSeparator : "2",
                    strictGrouping : true
                }
            }, null, true);
            this.assertErrorInLogs(aria.utils.Number.INVALID_FORMAT, 2);

            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "a1",
                    groupingSeparator : "bz"
                    // being a boolean strict is tested by the bean
                }
            }, null, true);
            this.assertErrorInLogs(aria.utils.Number.INVALID_FORMAT, 2);

            // cannot be the same separator
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ".",
                    groupingSeparator : ".",
                    strictGrouping : true
                }
            }, null, true);
            this.assertErrorInLogs(aria.utils.Number.INVALID_FORMAT, 1);
        },

        /**
         * Set the appenvironment to US
         */
        test_interpretNumberUS : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ".",
                    groupingSeparator : ",",
                    strictGrouping : true
                }
            });
            this.assertLogsEmpty();

            var tests = this._combinations.US;

            for (var check in tests) {
                if (tests.hasOwnProperty(check)) {
                    var got = aria.utils.Number.interpretNumber(check);

                    this.assertEquals(got, tests[check], "Comparing " + check + " expected %2, got %1");
                }
            }
        },

        /**
         * Set the appenvironment to FR
         */
        test_interpretNumberFR : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ",",
                    groupingSeparator : ".",
                    strictGrouping : true
                }
            }, null, true);
            this.assertLogsEmpty();

            var tests = this._combinations.FR;

            for (var check in tests) {
                if (tests.hasOwnProperty(check)) {
                    var got = aria.utils.Number.interpretNumber(check);

                    this.assertEquals(got, tests[check], "Comparing " + check + " expected %2, got %1");
                }
            }
        },

        /**
         * Set the appenvironment to Custom
         */
        test_interpretNumberCustom : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ".",
                    groupingSeparator : " ", // a space
                    strictGrouping : true
                }
            }, null, true);
            this.assertLogsEmpty();

            var tests = this._combinations.CUSTOM;

            for (var check in tests) {
                if (tests.hasOwnProperty(check)) {
                    var got = aria.utils.Number.interpretNumber(check);

                    this.assertEquals(got, tests[check], "Comparing " + check + " expected %2, got %1");
                }
            }
        },

        /**
         * Set the appenvironment to weird characters
         */
        test_interpretNumberWeird : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "!",
                    groupingSeparator : "\\",
                    strictGrouping : true
                }
            }, null, true);
            this.assertLogsEmpty();

            var tests = this._combinations.WEIRD;

            for (var check in tests) {
                if (tests.hasOwnProperty(check)) {
                    var got = aria.utils.Number.interpretNumber(check);

                    this.assertEquals(got, tests[check], "Comparing " + check + " expected %2, got %1");
                }
            }
        },

        /**
         * Override the app environment setting
         */
        test_override : function () {
            // AppEnvironment US
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ".",
                    groupingSeparator : ",",
                    strictGrouping : true
                }
            }, null, true);
            this.assertLogsEmpty();

            var tests = this._combinations.WEIRD;

            for (var check in tests) {
                if (tests.hasOwnProperty(check)) {
                    // Override AppEnvironment with Weird
                    var got = aria.utils.Number.interpretNumber(check, null, {
                        decimalSeparator : "!",
                        groupingSeparator : "\\"
                    });

                    this.assertEquals(got, tests[check], "Comparing " + check + " expected %2, got %1");
                }
            }
        },

        /**
         * Override the app environment setting (only partially)
         */
        test_partial_override : function () {
            // AppEnvironment US
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ".",
                    groupingSeparator : ",",
                    strictGrouping : true
                }
            }, null, true);
            this.assertLogsEmpty();

            var tests = this._combinations.CUSTOM;

            for (var check in tests) {
                if (tests.hasOwnProperty(check)) {
                    // Override AppEnvironment with Weird
                    var got = aria.utils.Number.interpretNumber(check, null, {
                        groupingSeparator : " "
                    });

                    this.assertEquals(got, tests[check], "Comparing " + check + " expected %2, got %1");
                }
            }
        },

        /**
         * No strict check
         */
        test_strict_false : function () {
            // I'm not going to check everything, but just a couple of use cases
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : " ", // a space
                    groupingSeparator : ".",
                    strictGrouping : false
                }
            }, null, true);
            this.assertLogsEmpty();

            var tests = this._combinations.STRICT_FALSE;

            for (var check in tests) {
                if (tests.hasOwnProperty(check)) {
                    var got = aria.utils.Number.interpretNumber(check);

                    this.assertEquals(got, tests[check], "Comparing " + check + " expected %2, got %1");
                }
            }
        },

        /**
         * No strict check - param override
         */
        test_strict_false_override : function () {
            // I'm not going to check everything, but just a couple of use cases
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : " ", // a space
                    groupingSeparator : ".",
                    strictGrouping : true
                    // I'm going to override this
                }
            }, null, true);
            this.assertLogsEmpty();

            var tests = this._combinations.STRICT_FALSE;

            for (var check in tests) {
                if (tests.hasOwnProperty(check)) {
                    var got = aria.utils.Number.interpretNumber(check, null, {
                        decimalSeparator : " ",
                        strictGrouping : false
                    });

                    this.assertEquals(got, tests[check], "Comparing " + check + " expected %2, got %1");
                }
            }
        },

        /**
         * Test that null is returned when the input string does not match the specified pattern when strictGrouping
         * equals true
         */
        test_strict_true_US : function () {
            var combinations = this._strictTrueCombinations;
            var patterns = combinations.PATTERNS;
            var testing = combinations.US;
            var output;
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ".",
                    groupingSeparator : ",",
                    strictGrouping : true
                }
            }, null, true);
            for (var i = 0, sz = patterns.length; i < sz; i++) {
                for (var input in testing) {
                    if (testing.hasOwnProperty(input)) {
                        output = aria.utils.Number.interpretNumber(input, patterns[i]);
                        if (testing[input][i] !== null) {
                            output = new Number(output);
                        }
                        // assertEquals uses === which is false for Number, value
                        this.assertTrue(output == testing[input][i], "Comparing " + input + " expected "
                                + testing[input][i] + " got " + output);
                    }
                }
            }

        },

        test_strict_true_WEIRD : function () {
            var combinations = this._strictTrueCombinations;
            var patterns = combinations.PATTERNS;
            var testing = combinations.WEIRD;
            var output;
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "!",
                    groupingSeparator : "\\",
                    strictGrouping : true
                }
            }, null, true);
            for (var i = 0, sz = patterns.length; i < sz; i++) {
                for (var input in testing) {
                    if (testing.hasOwnProperty(input)) {
                        output = aria.utils.Number.interpretNumber(input, patterns[i]);
                        if (testing[input][i] !== null) {
                            output = new Number(output);
                        }
                        // assertEquals uses === which is false for Number, value
                        this.assertTrue(output == testing[input][i], "Comparing " + input + " expected "
                                + testing[input][i] + " got " + output);
                    }
                }
            }

        }
    }
});
