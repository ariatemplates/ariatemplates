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
 * Test case for aria.utils.Time
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.NumberTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Number"],
    $prototype : {

        /* Backward Compatibility begins here */
        /**
         * TestCase1 Tests valid use cases.
         */
        test_isValidNumber : function () {
            // now that you can configure format symbols, "," is not allowed anymore
            var test;
            var useCases = ["1", "01", "0.1", "1.", "0.111111111111111111", "1.000", "-1", "-1.0", ".1", ".888", "+1",
                    "+0.5"];

            for (var i = 0; i < useCases.length; i++) {
                test = aria.utils.Number._validDigits.test(useCases[i]);
                this.assertTrue(aria.utils.Number._validDigits.test(useCases[i]), "testing:" + useCases[i] + ":");
            }
        },

        /**
         * TestCase2 Tests invalid use cases.
         */
        test_inValidNumber : function () {
            var test;
            var useCases = ["a", "--1", "- 1", "- 1 000,00.000,21", " ", " -1", " 1", "a1", "1 000", "1 000.21",
                    "1,00.21", "1.00,21", "1 000,21", "1 000 00,21", "1 000 00 000,21", "1 000,00 000,21",
                    "1 000,00.000,21", "-1,00.21", "-1.00,21", "-1 000", "-1 000.21", "-1 000,21", "-1 000 00,21",
                    "-1 000 00 000,21", "-1 000,00 000,21", "-1 000,00.000,21", "1...", "1-1", "1+1", "1.1.1", "1;qa",
                    "1b", "1;2", "++12", "1bb", "0,1", "0,111111111111111111", "1,000", "1,00", "-1,0", "-1,00"];

            for (var i = 0; i < useCases.length; i++) {
                test = aria.utils.Number._validDigits.test(useCases[i]);
                this.assertFalse(aria.utils.Number._validDigits.test(useCases[i]), "testing:" + useCases[i] + ":");
            }
        },
        /* Backward Compatibility ends here */

        /**
         * Test Utility Interpreter
         */
        test_interpretNumber : function () {
            var test;
            /*
             * var useCases = ["1", "01", "0.1", "1.", "0.111111111111111111", "1.000", "0,1", "0,111111111111111111",
             * "1,000", "1,00", "-1", "-1.0", "-1,0", "-1,00"]; var checker = ["1", "01", "0.1", "1.",
             * "0.111111111111111111", "1.000", "0,1", "0,111111111111111111", "1,000", "1,00", "-1", "-1.0", "-1,0",
             * "-1,00"]; for (var i = 0; i < useCases.length; i++) {
             * this.assertEquals(aria.utils.Number.interpretNumber(useCases[i]), checker[i], "testing:" + useCases[i] +
             * ":"); }
             */

            var testCase = "1,000.00";

            var success = aria.utils.Number.interpretNumber(testCase);

            this.assertEquals(aria.utils.Number.interpretNumber(testCase), '1000.00');
        },

        /**
         * Test formatCurrency
         */
        test_formatCurrency : function () {

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "\u00A4#,##0.00",
                    currencySymbol : "USD"
                }
            });

            var formattedCurrency = aria.utils.Number.formatCurrency(100);
            this.assertTrue(formattedCurrency == 'USD100.00');

            formattedCurrency = aria.utils.Number.formatCurrency(1000000.0021);
            this.assertTrue(formattedCurrency == 'USD1,000,000.00');

            formattedCurrency = aria.utils.Number.formatCurrency('1000000.0333');
            this.assertTrue(formattedCurrency == 'USD1,000,000.03');

            formattedCurrency = aria.utils.Number.formatCurrency('1000000.999');
            this.assertTrue(formattedCurrency == 'USD1,000,001.00');

            formattedCurrency = aria.utils.Number.formatCurrency('1000001.119');
            this.assertTrue(formattedCurrency == 'USD1,000,001.12');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "\u00A4#,##0",
                    currencySymbol : "EUR"
                }
            });

            formattedCurrency = aria.utils.Number.formatCurrency('1000001.119');

            this.assertTrue(formattedCurrency == 'EUR1,000,001');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "\u00A4#,###",
                    currencySymbol : "EUR"
                }
            });
            this.assertTrue(formattedCurrency == 'EUR1,000,001');

            formattedCurrency = aria.utils.Number.formatCurrency('0001.119');
            this.assertTrue(formattedCurrency == 'EUR1');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "\u00A4#,###,###",
                    currencySymbol : "EUR"
                }
            });

            formattedCurrency = aria.utils.Number.formatCurrency('10001.119');
            this.assertTrue(formattedCurrency == 'EUR10,001');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "\u00A4#,###,#00",
                    currencySymbol : "EUR"
                }
            });
            formattedCurrency = aria.utils.Number.formatCurrency('10001.119');
            this.assertTrue(formattedCurrency == 'EUR10,001');

            formattedCurrency = aria.utils.Number.formatCurrency('10001.119');
            this.assertTrue(formattedCurrency == 'EUR10,001');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "\u00A4#,##0,000",
                    currencySymbol : "EUR"
                }
            });
            this.assertTrue(formattedCurrency == 'EUR10,001');

            formattedCurrency = aria.utils.Number.formatCurrency('101.119');
            this.assertTrue(formattedCurrency == 'EUR0,101');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "\u00A4#,##0,000.00",
                    currencySymbol : "EUR"
                }
            });

            formattedCurrency = aria.utils.Number.formatCurrency(100);
            this.assertTrue(formattedCurrency == 'EUR0,100.00');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "\u00A4#,##0",
                    currencySymbol : "EUR"
                }
            });

            formattedCurrency = aria.utils.Number.formatCurrency(100);
            this.assertTrue(formattedCurrency == 'EUR100');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "#,##0\u00A4",
                    currencySymbol : "EUR"
                }
            });

            formattedCurrency = aria.utils.Number.formatCurrency(100);
            this.assertTrue(formattedCurrency == '100EUR');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "#,##0.00\u00A4",
                    currencySymbol : "EUR"
                }
            });

            formattedCurrency = aria.utils.Number.formatCurrency(100);
            this.assertTrue(formattedCurrency == '100.00EUR');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "####\u00A4",
                    currencySymbol : "EUR"
                }
            });

            formattedCurrency = aria.utils.Number.formatCurrency(100);
            this.assertTrue(formattedCurrency == '100EUR');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "#,##,##\u00A4",
                    currencySymbol : "EUR"
                }
            });

            formattedCurrency = aria.utils.Number.formatCurrency(10000000);
            this.assertTrue(formattedCurrency == '10,00,00,00EUR');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "0,00,00\u00A4",
                    currencySymbol : "EUR"
                }
            });

            formattedCurrency = aria.utils.Number.formatCurrency(10000000);
            this.assertTrue(formattedCurrency == '10,00,00,00EUR');

            // Test Dynamic Format
            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : function () {
                        var currentTime = new Date();
                        var year = currentTime.getFullYear();
                        if (year > '2008') {
                            return "0,00,00.000\u00A4";
                        }
                    },
                    currencySymbol : "EUR"
                }
            });
            formattedCurrency = aria.utils.Number.formatCurrency(10000000);
            this.assertTrue(formattedCurrency == '10,00,00,00.000EUR');

            // Test Dynamic Format
            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "  ",
                    currencySymbol : "EUR"
                }
            });
            formattedCurrency = aria.utils.Number.formatCurrency(10000000);
            this.assertErrorInLogs(aria.utils.Number.INVALID_FORMAT);

            formattedCurrency = aria.utils.Number.formatCurrency(123.321, "0.00");
            this.assertTrue(formattedCurrency == '123.32');

        },

        /**
         * Test Formatting of numbers
         */
        test_formatNumber : function () {

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "#,##0.00",
                    currencySymbol : "USD"
                }
            });

            var formattedCurrency = aria.utils.Number.formatNumber('1000000.006');
            this.assertTrue(formattedCurrency == '1,000,000.01');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "##,#0.000",
                    currencySymbol : "USD"
                }
            });

            formattedCurrency = aria.utils.Number.formatNumber('1000000.0021');
            this.assertTrue(formattedCurrency == '1,00,00,00.002');

            aria.core.AppEnvironment.setEnvironment({
                currencyFormats : {
                    currencyFormat : "#,##0.0000",
                    currencySymbol : "USD"
                }
            });
            formattedCurrency = aria.utils.Number.formatNumber('1000000.0333');
            this.assertTrue(formattedCurrency == '1,000,000.0333');

            formattedCurrency = aria.utils.Number.formatNumber('0.1', "0.0###################");
            this.assertTrue(formattedCurrency == '0.1');

            formattedCurrency = aria.utils.Number.formatNumber('0.1', "0.000000000000000000000"); // 21 decimals
            this.assertTrue(formattedCurrency == '0.10000000000000000000'); // 20 decimals

        }
    }
});
