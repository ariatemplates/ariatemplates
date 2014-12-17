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
    $classpath : "test.aria.core.useragent.BrowserAndDeviceTest",
    $dependencies : ["test.aria.core.useragent.UseCases", "aria.core.Browser", "aria.utils.Device", "aria.utils.Array", "aria.utils.Type"],
    $extends : "aria.jsunit.TestCase",

    $constructor : function() {
        this.$TestCase.constructor.call(this);

        // ---------------------------------------------------------------------

        this.useCases = test.aria.core.useragent.UseCases.getValues();
    },

    $prototype : {
        tearDown : function () {
            // -----------------------------------------------------------------

            aria.core.Browser.init();

            // -----------------------------------------------------------------

            aria.utils.Device.init();
            aria.utils.Device._styleCache = {};
        },

        /**
         * Tests whether the two given strings are equal or not, without considering the case.
         *
         * @param {String} a One of the strings to compare.
         * @param {String} b The other string to compare.
         *
         * @return {Boolean} true if they are the same, false otherwise. Also returns false if given values are not proper strings with a method toLowerCase.
         */
        stringsEqualNoCase : function(a, b) {
            if (a == null || a.toLowerCase == null || b == null || b.toLowerCase == null) {
                return false;
            }

            return a.toLowerCase() == b.toLowerCase();
        },

        testBrowser : function () {
            var stringsEqualNoCase = this.stringsEqualNoCase;

            var scope = {
                name: 'browser',

                properties: [
                    {
                        name: "name",
                        areEqual: stringsEqualNoCase
                    },
                    {
                        name: "osName",
                        areEqual: stringsEqualNoCase
                    },
                    "osVersion",
                    {
                        name: "version",
                        areEqual: function(a, b) {
                            // Browser version is not determined through user agent under IE, so we can't test it, it should pass
                            if (aria.core.Browser.isIE) {
                                return true;
                            }

                            return stringsEqualNoCase(a, b);
                        }
                    }
                ],

                flags: [
                    {
                        category: "engine",
                        flags: ['Gecko', 'Webkit']
                    },
                    {
                        category: "browser",
                        flags: [
                            'Firefox', 'Chrome', 'IE', 'Safari', 'Opera',
                            'AndroidBrowser', 'SafariMobile', 'IEMobile',
                            'BlackBerryBrowser', 'OperaMini', 'OperaMobile', 'S60',
                            'PhantomJS', 'OtherBrowser'
                        ]
                    },
                    {
                        category: "os",
                        flags: [
                            'Mac', 'Windows',
                            'Android', 'IOS', 'WindowsPhone',
                            'BlackBerry', 'Symbian', 'OtherOS'
                        ]
                    }
                ]
            };

            // -----------------------------------------------------------------

            var Browser = aria.core.Browser;

            this._testUseCases({
                useCases: this.useCases,
                scope: scope,

                getResult: function(ua) {
                    Browser.init(ua);
                    return Browser;
                }
            });
        },

        testDevice : function () {
            var scope = {
                name: 'device',

                properties: [
                    {name: "isDevice", type: "method"},
                    {name: "isPhone", type: "method"},
                    {name: "isDesktop", type: "method"},
                    {name: "isTablet", type: "method"},
                    {name: "deviceName", type: "method", areEqual: this.stringsEqualNoCase}
                ]
            };

            // -----------------------------------------------------------------

            var Device = aria.utils.Device;

            this._testUseCases({
                useCases: this.useCases,
                scope: scope,

                getResult: function(ua) {
                    Device.init(ua);
                    return Device;
                }
            });
        },

        /**
         * Test that values are correct for all use cases for a specified scope.
         *
         * <p>
         * Arguments are:
         * <code>
         * {
         *     useCases // set of use cases with expected values
         *     scope // scope of tested values, with description of the properties (see below)
         *
         * // hooks/callbacks
         *     getResult // to get the actual values for a use case
         * }
         * </code>
         * </p>
         *
         * <p>
         * The scope object is a description of properties used for proper testing. Here are its parameters:
         * <code>
         * {
         *     name // the name of the scope, use to group the properties in use cases
         *
         *     properties // standard properties
         *     flags // flags properties: boolean properties with one true among a category (like an enumeration)
         * }
         * </code>
         * </p>
         *
         * @param spec {Object} Set of arguments (see description)
         */
        _testUseCases : function(spec) {
            var forEach = aria.utils.Array.forEach;

            // ----------------------------------------- arguments destructuring

            var useCases = spec.useCases;
            var scope = spec.scope;

            var getResult = spec.getResult;

            // -------------------------------------------------- implementation

            var testers = [
                {
                    type: "properties",
                    fn: this._testValues
                },
                {
                    type: "flags",
                    fn: this._testFlags
                }
            ];

            forEach(useCases, function(useCase) {
                var actualValues = getResult(useCase.ua);
                var expectedValues = useCase.values[scope.name];

                forEach(testers, function(tester) {
                    var type = tester.type;
                    var fn = tester.fn;
                    var noExpectedValues = tester.noExpectedValues;
                    if (noExpectedValues == null) {
                        noExpectedValues = false;
                    }

                    // ---------------------------------------------------------

                    if (noExpectedValues || expectedValues != null) {
                        var specifications = scope[type];

                        var specificExpectedValues = expectedValues[type];

                        if (specifications != null && (noExpectedValues || specificExpectedValues != null)) {
                            fn.call(this, {
                                specifications: specifications,

                                useCase: useCase,

                                actualValues: actualValues,
                                expectedValues: specificExpectedValues
                            });
                        }
                    }
                }, this);
            }, this);
        },

        _testValues : function (spec) {
            var forEach = aria.utils.Array.forEach;
            var isString = aria.utils.Type.isString;

            // ----------------------------------------- arguments destructuring

            var specifications = spec.specifications;

            var useCase = spec.useCase;

            var actualValues = spec.actualValues;
            var expectedValues = spec.expectedValues;

            // -------------------------------------------------- implementation

            forEach(specifications, function(specification) {
                // --------------------------------------- specification factory

                if (isString(specification)) {
                    specification = {name: specification};
                }

                // ----------------------------------------------- property name

                var name = specification.name;

                // ---------------------------------- equality checking function

                var areEqual = specification.areEqual;

                if (areEqual == null) {
                    areEqual = function(a, b) {return a == b;};
                }

                // ----------------------------------------------- property type

                var type = specification.type;

                if (type == null) {
                    type = "attribute";
                }

                var getActualValue;

                if (type == "attribute") {
                    getActualValue = function(propertyValue) {
                        return propertyValue;
                    };
                } else if (type == "method") {
                    getActualValue = function(propertyValue, container) {
                        return propertyValue.call(container);
                    };
                }

                // -------------------------------------------------- value test

                var actualValue = getActualValue(actualValues[name], actualValues);
                var expectedValue = expectedValues[name];
                var message = 'The value returned through entry point "' + name + '" is wrong. ' +
                'Got actual value "' + actualValue + '" instead of expected "' + expectedValue + '". ' +
                'Additional information: ' + useCase.id + ', ua: ' + useCase.ua;

                this.assertTrue(areEqual(actualValue, expectedValue), message);
            }, this);
        },

        _testFlags : function (spec) {
            var forEach = aria.utils.Array.forEach;
            var Browser = aria.core.Browser;

            // ----------------------------------------- arguments destructuring

            var specifications = spec.specifications;

            var useCase = spec.useCase;

            var actualValues = spec.actualValues;
            var expectedValues = spec.expectedValues;

            // -------------------------------------------------- implementation

            forEach(specifications, function(specification) {
                // -------------------------------------------------- flags sets

                var trueFlag;
                var falseFlags = [].concat(specification.flags);

                var expectedFlagName = expectedValues[specification.category];
                if (expectedFlagName != null) {
                    trueFlag = expectedFlagName;
                    falseFlags.splice(aria.utils.Array.indexOf(falseFlags, trueFlag), 1);
                }

                // ------------------------------------------------------- tests

                if (trueFlag != null) {
                    var propertyName = Browser._buildFlagName(trueFlag);
                    var message = 'Flag "' + propertyName + '" should be true. ' +
                    'Browser: ' + useCase.id + ', ua: ' + useCase.ua;
                    this.assertTrue(actualValues[propertyName], message);
                }

                forEach(falseFlags, function(falseFlag) {
                    var propertyName = Browser._buildFlagName(falseFlag);
                    var message = 'Flag "' + propertyName + '" should be false. ' +
                    'Additional information: ' + useCase.id + ', ua: ' + useCase.ua;
                    this.assertFalse(actualValues[propertyName], message);
                }, this);
            }, this);
        }
    }
});
