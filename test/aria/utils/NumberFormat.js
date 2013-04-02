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
    $classpath : "test.aria.utils.NumberFormat",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Number", "aria.utils.environment.Number", "aria.utils.Json"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);

        this._combinations = function () {
            return {
                NUMBERS : [1, 10, 100, 1000, 10000, 100000, 1000000, 1.4, 1.04, 1.004, 1.6, 1.06, 1.006, -1, -1000000,
                        -1.6],
                1 : {
                    US : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0,001",
                        "#.#" : "1",
                        "#.0" : "1.0",
                        "#.00" : "1.00",
                        "0#.#0" : "01.00",
                        "0#.#" : "01",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1.0",
                        "##,00,##.0#" : "00,01.0"
                    },
                    FR : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0 001",
                        "#.#" : "1",
                        "#.0" : "1,0",
                        "#.00" : "1,00",
                        "0#.#0" : "01,00",
                        "0#.#" : "01",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1,0",
                        "##,00,##.0#" : "00 01,0"
                    }
                },
                10 : {
                    US : {
                        "#" : "10",
                        "0" : "10",
                        "##" : "10",
                        "00" : "10",
                        "#00" : "10",
                        "###" : "10",
                        "####" : "10",
                        "#,###" : "10",
                        "0,000" : "0,010",
                        "#.#" : "10",
                        "#.0" : "10.0",
                        "#.00" : "10.00",
                        "0#.#0" : "10.00",
                        "0#.#" : "10",
                        "##,##,##" : "10",
                        "##,##,##.0" : "10.0",
                        "##,00,##.0#" : "00,10.0"
                    },
                    FR : {
                        "#" : "10",
                        "0" : "10",
                        "##" : "10",
                        "00" : "10",
                        "#00" : "10",
                        "###" : "10",
                        "####" : "10",
                        "#,###" : "10",
                        "0,000" : "0 010",
                        "#.#" : "10",
                        "#.0" : "10,0",
                        "#.00" : "10,00",
                        "0#.#0" : "10,00",
                        "0#.#" : "10",
                        "##,##,##" : "10",
                        "##,##,##.0" : "10,0",
                        "##,00,##.0#" : "00 10,0"
                    }
                },
                100 : {
                    US : {
                        "#" : "100",
                        "0" : "100",
                        "##" : "100",
                        "00" : "100",
                        "#00" : "100",
                        "###" : "100",
                        "####" : "100",
                        "#,###" : "100",
                        "0,000" : "0,100",
                        "#.#" : "100",
                        "#.0" : "100.0",
                        "#.00" : "100.00",
                        "0#.#0" : "100.00",
                        "0#.#" : "100",
                        "##,##,##" : "1,00",
                        "##,##,##.0" : "1,00.0",
                        "##,00,##.0#" : "01,00.0"
                    },
                    FR : {
                        "#" : "100",
                        "0" : "100",
                        "##" : "100",
                        "00" : "100",
                        "#00" : "100",
                        "###" : "100",
                        "####" : "100",
                        "#,###" : "100",
                        "0,000" : "0 100",
                        "#.#" : "100",
                        "#.0" : "100,0",
                        "#.00" : "100,00",
                        "0#.#0" : "100,00",
                        "0#.#" : "100",
                        "##,##,##" : "1 00",
                        "##,##,##.0" : "1 00,0",
                        "##,00,##.0#" : "01 00,0"
                    }
                },
                1000 : {
                    US : {
                        "#" : "1000",
                        "0" : "1000",
                        "##" : "1000",
                        "00" : "1000",
                        "#00" : "1000",
                        "###" : "1000",
                        "####" : "1000",
                        "#,###" : "1,000",
                        "0,000" : "1,000",
                        "#.#" : "1000",
                        "#.0" : "1000.0",
                        "#.00" : "1000.00",
                        "0#.#0" : "1000.00",
                        "0#.#" : "1000",
                        "##,##,##" : "10,00",
                        "##,##,##.0" : "10,00.0"
                    },
                    FR : {
                        "#" : "1000",
                        "0" : "1000",
                        "##" : "1000",
                        "00" : "1000",
                        "#00" : "1000",
                        "###" : "1000",
                        "####" : "1000",
                        "#,###" : "1 000",
                        "0,000" : "1 000",
                        "#.#" : "1000",
                        "#.0" : "1000,0",
                        "#.00" : "1000,00",
                        "0#.#0" : "1000,00",
                        "0#.#" : "1000",
                        "##,##,##" : "10 00",
                        "##,##,##.0" : "10 00,0"
                    }
                },
                10000 : {
                    US : {
                        "#" : "10000",
                        "0" : "10000",
                        "##" : "10000",
                        "00" : "10000",
                        "#00" : "10000",
                        "###" : "10000",
                        "####" : "10000",
                        "#,###" : "10,000",
                        "0,000" : "10,000",
                        "#.#" : "10000",
                        "#.0" : "10000.0",
                        "#.00" : "10000.00",
                        "0#.#0" : "10000.00",
                        "0#.#" : "10000",
                        "##,##,##" : "1,00,00",
                        "##,##,##.0" : "1,00,00.0"
                    },
                    FR : {
                        "#" : "10000",
                        "0" : "10000",
                        "##" : "10000",
                        "00" : "10000",
                        "#00" : "10000",
                        "###" : "10000",
                        "####" : "10000",
                        "#,###" : "10 000",
                        "0,000" : "10 000",
                        "#.#" : "10000",
                        "#.0" : "10000,0",
                        "#.00" : "10000,00",
                        "0#.#0" : "10000,00",
                        "0#.#" : "10000",
                        "##,##,##" : "1 00 00",
                        "##,##,##.0" : "1 00 00,0"
                    }
                },
                100000 : {
                    US : {
                        "#" : "100000",
                        "0" : "100000",
                        "##" : "100000",
                        "00" : "100000",
                        "#00" : "100000",
                        "###" : "100000",
                        "####" : "100000",
                        "#,###" : "100,000",
                        "0,000" : "100,000",
                        "#.#" : "100000",
                        "#.0" : "100000.0",
                        "#.00" : "100000.00",
                        "0#.#0" : "100000.00",
                        "0#.#" : "100000",
                        "##,##,##" : "10,00,00",
                        "##,##,##.0" : "10,00,00.0"
                    },
                    FR : {
                        "#" : "100000",
                        "0" : "100000",
                        "##" : "100000",
                        "00" : "100000",
                        "#00" : "100000",
                        "###" : "100000",
                        "####" : "100000",
                        "#,###" : "100 000",
                        "0,000" : "100 000",
                        "#.#" : "100000",
                        "#.0" : "100000,0",
                        "#.00" : "100000,00",
                        "0#.#0" : "100000,00",
                        "0#.#" : "100000",
                        "##,##,##" : "10 00 00",
                        "##,##,##.0" : "10 00 00,0"
                    }
                },
                1000000 : {
                    US : {
                        "#" : "1000000",
                        "0" : "1000000",
                        "##" : "1000000",
                        "00" : "1000000",
                        "#00" : "1000000",
                        "###" : "1000000",
                        "####" : "1000000",
                        "#,###" : "1,000,000",
                        "0,000" : "1,000,000",
                        "#.#" : "1000000",
                        "#.0" : "1000000.0",
                        "#.00" : "1000000.00",
                        "0#.#0" : "1000000.00",
                        "0#.#" : "1000000",
                        // regular patterns
                        "##,##,##" : "1,00,00,00",
                        "##,##,##.0" : "1,00,00,00.0",
                        "#,#,#,#" : "1,0,0,0,0,0,0",
                        "#,##" : "1,00,00,00",
                        // irregular patterns
                        "#,##,###" : "10,00,000",
                        "##,#,##,###" : "1,0,00,000"
                    },
                    FR : {
                        "#" : "1000000",
                        "0" : "1000000",
                        "##" : "1000000",
                        "00" : "1000000",
                        "#00" : "1000000",
                        "###" : "1000000",
                        "####" : "1000000",
                        "#,###" : "1 000 000",
                        "0,000" : "1 000 000",
                        "#.#" : "1000000",
                        "#.0" : "1000000,0",
                        "#.00" : "1000000,00",
                        "0#.#0" : "1000000,00",
                        "0#.#" : "1000000",
                        // regular patterns
                        "##,##,##" : "1 00 00 00",
                        "##,##,##.0" : "1 00 00 00,0",
                        "#,#,#,#" : "1 0 0 0 0 0 0",
                        "#,##" : "1 00 00 00",
                        // irregular patterns
                        "#,##,###" : "10 00 000",
                        "##,#,##,###" : "1 0 00 000"
                    }
                },
                1.4 : {
                    US : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0,001",
                        "#.#" : "1.4",
                        "#.0" : "1.4",
                        "#.00" : "1.40",
                        "0#.#0" : "01.40",
                        "0#.#" : "01.4",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1.4",
                        "##,00,##.0#" : "00,01.4"
                    },
                    FR : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0 001",
                        "#.#" : "1,4",
                        "#.0" : "1,4",
                        "#.00" : "1,40",
                        "0#.#0" : "01,40",
                        "0#.#" : "01,4",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1,4",
                        "##,00,##.0#" : "00 01,4"
                    }
                },
                1.04 : {
                    US : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0,001",
                        "#.#" : "1",
                        "#.0" : "1.0",
                        "#.00" : "1.04",
                        "0#.#0" : "01.04",
                        "0#.#" : "01",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1.0",
                        "##,00,##.0#" : "00,01.04"
                    },
                    FR : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0 001",
                        "#.#" : "1",
                        "#.0" : "1,0",
                        "#.00" : "1,04",
                        "0#.#0" : "01,04",
                        "0#.#" : "01",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1,0",
                        "##,00,##.0#" : "00 01,04"
                    }
                },
                1.004 : {
                    US : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0,001",
                        "#.#" : "1",
                        "#.0" : "1.0",
                        "#.00" : "1.00",
                        "0#.#0" : "01.00",
                        "0#.#" : "01",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1.0",
                        "##,00,##.0#" : "00,01.0"
                    },
                    FR : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0 001",
                        "#.#" : "1",
                        "#.0" : "1,0",
                        "#.00" : "1,00",
                        "0#.#0" : "01,00",
                        "0#.#" : "01",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1,0",
                        "##,00,##.0#" : "00 01,0"
                    }
                },
                1.6 : {
                    US : {
                        "#" : "2",
                        "0" : "2",
                        "##" : "2",
                        "00" : "02",
                        "#00" : "02",
                        "###" : "2",
                        "####" : "2",
                        "#,###" : "2",
                        "0,000" : "0,002",
                        "#.#" : "1.6",
                        "#.0" : "1.6",
                        "#.00" : "1.60",
                        "0#.#0" : "01.60",
                        "0#.#" : "01.6",
                        "##,##,##" : "2",
                        "##,##,##.0" : "1.6",
                        "##,00,##.0#" : "00,01.6"
                    },
                    FR : {
                        "#" : "2",
                        "0" : "2",
                        "##" : "2",
                        "00" : "02",
                        "#00" : "02",
                        "###" : "2",
                        "####" : "2",
                        "#,###" : "2",
                        "0,000" : "0 002",
                        "#.#" : "1,6",
                        "#.0" : "1,6",
                        "#.00" : "1,60",
                        "0#.#0" : "01,60",
                        "0#.#" : "01,6",
                        "##,##,##" : "2",
                        "##,##,##.0" : "1,6",
                        "##,00,##.0#" : "00 01,6"
                    }
                },
                1.06 : {
                    US : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0,001",
                        "#.#" : "1.1",
                        "#.0" : "1.1",
                        "#.00" : "1.06",
                        "0#.#0" : "01.06",
                        "0#.#" : "01.1",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1.1",
                        "##,00,##.0#" : "00,01.06"
                    },
                    FR : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0 001",
                        "#.#" : "1,1",
                        "#.0" : "1,1",
                        "#.00" : "1,06",
                        "0#.#0" : "01,06",
                        "0#.#" : "01,1",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1,1",
                        "##,00,##.0#" : "00 01,06"
                    }
                },
                1.006 : {
                    US : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0,001",
                        "#.#" : "1",
                        "#.0" : "1.0",
                        "#.00" : "1.01",
                        "0#.#0" : "01.01",
                        "0#.#" : "01",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1.0",
                        "##,00,##.0#" : "00,01.01"
                    },
                    FR : {
                        "#" : "1",
                        "0" : "1",
                        "##" : "1",
                        "00" : "01",
                        "#00" : "01",
                        "###" : "1",
                        "####" : "1",
                        "#,###" : "1",
                        "0,000" : "0 001",
                        "#.#" : "1",
                        "#.0" : "1,0",
                        "#.00" : "1,01",
                        "0#.#0" : "01,01",
                        "0#.#" : "01",
                        "##,##,##" : "1",
                        "##,##,##.0" : "1,0",
                        "##,00,##.0#" : "00 01,01"
                    }
                },
                "-1" : {
                    US : {
                        "#" : "-1",
                        "0" : "-1",
                        "##" : "-1",
                        "00" : "-01",
                        "#00" : "-01",
                        "###" : "-1",
                        "####" : "-1",
                        "#,###" : "-1",
                        "0,000" : "-0,001",
                        "#.#" : "-1",
                        "#.0" : "-1.0",
                        "#.00" : "-1.00",
                        "0#.#0" : "-01.00",
                        "0#.#" : "-01",
                        "##,##,##" : "-1",
                        "##,##,##.0" : "-1.0"
                    },
                    FR : {
                        "#" : "-1",
                        "0" : "-1",
                        "##" : "-1",
                        "00" : "-01",
                        "#00" : "-01",
                        "###" : "-1",
                        "####" : "-1",
                        "#,###" : "-1",
                        "0,000" : "-0 001",
                        "#.#" : "-1",
                        "#.0" : "-1,0",
                        "#.00" : "-1,00",
                        "0#.#0" : "-01,00",
                        "0#.#" : "-01",
                        "##,##,##" : "-1",
                        "##,##,##.0" : "-1,0"
                    }
                },
                "-1000000" : {
                    US : {
                        "#" : "-1000000",
                        "0" : "-1000000",
                        "##" : "-1000000",
                        "00" : "-1000000",
                        "#00" : "-1000000",
                        "###" : "-1000000",
                        "####" : "-1000000",
                        "#,###" : "-1,000,000",
                        "0,000" : "-1,000,000",
                        "#.#" : "-1000000",
                        "#.0" : "-1000000.0",
                        "#.00" : "-1000000.00",
                        "0#.#0" : "-1000000.00",
                        "0#.#" : "-1000000",
                        // regular patterns
                        "##,##,##" : "-1,00,00,00",
                        "##,##,##.0" : "-1,00,00,00.0",
                        "#,#,#,#" : "-1,0,0,0,0,0,0",
                        "#,##" : "-1,00,00,00",
                        // irregular patterns
                        "#,##,###" : "-10,00,000",
                        "##,#,##,###" : "-1,0,00,000"
                    },
                    FR : {
                        "#" : "-1000000",
                        "0" : "-1000000",
                        "##" : "-1000000",
                        "00" : "-1000000",
                        "#00" : "-1000000",
                        "###" : "-1000000",
                        "####" : "-1000000",
                        "#,###" : "-1 000 000",
                        "0,000" : "-1 000 000",
                        "#.#" : "-1000000",
                        "#.0" : "-1000000,0",
                        "#.00" : "-1000000,00",
                        "0#.#0" : "-1000000,00",
                        "0#.#" : "-1000000",
                        // regular patterns
                        "##,##,##" : "-1 00 00 00",
                        "##,##,##.0" : "-1 00 00 00,0",
                        "#,#,#,#" : "-1 0 0 0 0 0 0",
                        "#,##" : "-1 00 00 00",
                        // irregular patterns
                        "#,##,###" : "-10 00 000",
                        "##,#,##,###" : "-1 0 00 000"
                    }
                },
                "-1.6" : {
                    US : {
                        "#" : "-2",
                        "0" : "-2",
                        "##" : "-2",
                        "00" : "-02",
                        "#00" : "-02",
                        "###" : "-2",
                        "####" : "-2",
                        "#,###" : "-2",
                        "0,000" : "-0,002",
                        "#.#" : "-1.6",
                        "#.0" : "-1.6",
                        "#.00" : "-1.60",
                        "0#.#0" : "-01.60",
                        "0#.#" : "-01.6",
                        "##,##,##" : "-2",
                        "##,##,##.0" : "-1.6"
                    },
                    FR : {
                        "#" : "-2",
                        "0" : "-2",
                        "##" : "-2",
                        "00" : "-02",
                        "#00" : "-02",
                        "###" : "-2",
                        "####" : "-2",
                        "#,###" : "-2",
                        "0,000" : "-0 002",
                        "#.#" : "-1,6",
                        "#.0" : "-1,6",
                        "#.00" : "-1,60",
                        "0#.#0" : "-01,60",
                        "0#.#" : "-01,6",
                        "##,##,##" : "-2",
                        "##,##,##.0" : "-1,6"
                    }
                }
            };
        };
    },
    $prototype : {
        setUp : function () {
            this._formatEnv = aria.utils.Json.copy(aria.utils.environment.Number.getDecimalFormatSymbols());
        },

        tearDown : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : this._formatEnv
            });
        },

        _helperFormaNumber : function (expected, testing, pattern, symbols) {
            var got;
            // No currency
            got = aria.utils.Number.formatNumber(testing, pattern, symbols);
            this.assertEquals(expected, got, "Format " + testing + " with pattern " + pattern + " expecting %1 got %2");

            // Left currency
            got = aria.utils.Number.formatNumber(testing, "\u00A4" + pattern, symbols);
            this.assertEquals(expected, got, "Format " + testing + " with pattern " + "\u00A4" + pattern
                    + " expecting %1 got %2");

            // Right currency
            got = aria.utils.Number.formatNumber(testing, pattern + "\u00A4", symbols);
            this.assertEquals(expected, got, "Format " + testing + " with pattern " + pattern + "\u00A4"
                    + " expecting %1 got %2");

            // Both currenct
            got = aria.utils.Number.formatNumber(testing, "\u00A4" + pattern + "\u00A4", symbols);
            this.assertEquals(expected, got, "Format " + testing + " with pattern " + "\u00A4" + pattern + "\u00A4"
                    + " expecting %1 got %2");

            // ////////////////////////////////
            // Now do the same with currencies
            // ////////////////////////////////
            // No currency
            got = aria.utils.Number.formatCurrency(testing, pattern, symbols);
            this.assertEquals(expected, got, "Currency " + testing + " with pattern " + pattern
                    + " expecting %1 got %2");

            // Left currency
            got = aria.utils.Number.formatCurrency(testing, "\u00A4" + pattern, symbols);
            this.assertEquals("USD" + expected, got, "Currency " + testing + " with pattern " + "\u00A4" + pattern
                    + " expecting %1 got %2");

            // Right currency
            got = aria.utils.Number.formatCurrency(testing, pattern + "\u00A4", symbols);
            this.assertEquals(expected + "USD", got, "Currency " + testing + " with pattern " + pattern + "\u00A4"
                    + " expecting %1 got %2");

            // Both currenct
            got = aria.utils.Number.formatCurrency(testing, "\u00A4" + pattern + "\u00A4", symbols);
            this.assertEquals("USD" + expected, got, "Currency " + testing + " with pattern " + "\u00A4" + pattern
                    + "\u00A4" + " expecting %1 got %2");
        },

        /**
         * Set the appenvironment to US
         */
        test_formatNumberUS_strict : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ".",
                    groupingSeparator : ","
                }
            }, null, true);
            this.assertLogsEmpty();

            var combinations = this._combinations();

            for (var i = 0; i < combinations.NUMBERS.length; i += 1) {
                var testing = combinations.NUMBERS[i];
                var possibilities = combinations[testing];

                if (possibilities) {
                    for (var pattern in possibilities.US) {
                        if (possibilities.US.hasOwnProperty(pattern)) {
                            var expected = possibilities.US[pattern];

                            this._helperFormaNumber(expected, testing, pattern);
                        }
                    }
                }
            }
        },

        /**
         * Set the appenvironment to US
         */
        test_formatNumberUS_override : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "(",
                    groupingSeparator : ")"
                }
            }, null, true);
            this.assertLogsEmpty();

            var combinations = this._combinations();

            for (var i = 0; i < combinations.NUMBERS.length; i += 1) {
                var testing = combinations.NUMBERS[i];
                var possibilities = combinations[testing];

                if (possibilities) {
                    for (var pattern in possibilities.US) {
                        if (possibilities.US.hasOwnProperty(pattern)) {
                            var expected = possibilities.US[pattern];

                            this._helperFormaNumber(expected, testing, pattern, {
                                decimalSeparator : ".",
                                groupingSeparator : ","
                            });
                        }
                    }
                }
            }
        },

        /**
         * Set the appenvironment to US
         */
        test_formatNumberUS_NOstrict : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ".",
                    groupingSeparator : ",",
                    strictGrouping : false
                }
            }, null, true);
            this.assertLogsEmpty();

            var combinations = this._combinations();

            for (var i = 0; i < combinations.NUMBERS.length; i += 1) {
                var testing = combinations.NUMBERS[i];
                var possibilities = combinations[testing];

                if (possibilities) {
                    for (var pattern in possibilities.US) {
                        if (possibilities.US.hasOwnProperty(pattern)) {
                            var expected = possibilities.US[pattern];

                            this._helperFormaNumber(expected, testing, pattern, {
                                strictGrouping : false
                            });
                        }
                    }
                }
            }
        },

        /**
         * Set the appenvironment to US
         */
        test_formatNumberUS_NOstrict_override : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "(",
                    groupingSeparator : ")"
                }
            }, null, true);
            this.assertLogsEmpty();

            var combinations = this._combinations();

            for (var i = 0; i < combinations.NUMBERS.length; i += 1) {
                var testing = combinations.NUMBERS[i];
                var possibilities = combinations[testing];

                if (possibilities) {
                    for (var pattern in possibilities.US) {
                        if (possibilities.US.hasOwnProperty(pattern)) {
                            var expected = possibilities.US[pattern];

                            this._helperFormaNumber(expected, testing, pattern, {
                                decimalSeparator : ".",
                                groupingSeparator : ",",
                                strictGrouping : false
                            });
                        }
                    }
                }
            }
        },

        /**
         * Set the appenvironment to FR
         */
        test_formatNumberFR_strict : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ",",
                    groupingSeparator : " "
                }
            }, null, true);
            this.assertLogsEmpty();

            var combinations = this._combinations();

            for (var i = 0; i < combinations.NUMBERS.length; i += 1) {
                var testing = combinations.NUMBERS[i];
                var possibilities = combinations[testing];

                if (possibilities) {
                    for (var pattern in possibilities.FR) {
                        if (possibilities.FR.hasOwnProperty(pattern)) {
                            var expected = possibilities.FR[pattern];

                            this._helperFormaNumber(expected, testing, pattern);
                        }
                    }
                }
            }
        },

        /**
         * Set the appenvironment to FR
         */
        test_formatNumberFR_override : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "(",
                    groupingSeparator : ")"
                }
            }, null, true);
            this.assertLogsEmpty();

            var combinations = this._combinations();

            for (var i = 0; i < combinations.NUMBERS.length; i += 1) {
                var testing = combinations.NUMBERS[i];
                var possibilities = combinations[testing];

                if (possibilities) {
                    for (var pattern in possibilities.FR) {
                        if (possibilities.FR.hasOwnProperty(pattern)) {
                            var expected = possibilities.FR[pattern];

                            this._helperFormaNumber(expected, testing, pattern, {
                                decimalSeparator : ",",
                                groupingSeparator : " "
                            });
                        }
                    }
                }
            }
        },

        /**
         * Set the appenvironment to FR
         */
        test_formatNumberFR_NOstrict : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : ",",
                    groupingSeparator : " ",
                    strictGrouping : false
                }
            }, null, true);
            this.assertLogsEmpty();

            var combinations = this._combinations();

            for (var i = 0; i < combinations.NUMBERS.length; i += 1) {
                var testing = combinations.NUMBERS[i];
                var possibilities = combinations[testing];

                if (possibilities) {
                    for (var pattern in possibilities.FR) {
                        if (possibilities.FR.hasOwnProperty(pattern)) {
                            var expected = possibilities.FR[pattern];

                            this._helperFormaNumber(expected, testing, pattern, {
                                strictGrouping : false
                            });
                        }
                    }
                }
            }
        },

        /**
         * Set the appenvironment to FR
         */
        test_formatNumberFR_NOstrict_override : function () {
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "(",
                    groupingSeparator : ")"
                }
            }, null, true);
            this.assertLogsEmpty();

            var combinations = this._combinations();

            for (var i = 0; i < combinations.NUMBERS.length; i += 1) {
                var testing = combinations.NUMBERS[i];
                var possibilities = combinations[testing];

                if (possibilities) {
                    for (var pattern in possibilities.FR) {
                        if (possibilities.FR.hasOwnProperty(pattern)) {
                            var expected = possibilities.FR[pattern];

                            this._helperFormaNumber(expected, testing, pattern, {
                                decimalSeparator : ",",
                                groupingSeparator : " ",
                                strictGrouping : false
                            });
                        }
                    }
                }
            }
        },

        test_formatFunctions : function () {
            // No need to test everything like before, just make sure that a pattern is used
            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "(",
                    groupingSeparator : ")"
                },
                "currencyFormats" : {
                    currencyFormat : function () {
                        return "##,##0.00";
                    },
                    currencySymbol : "$"
                }
            });

            var got = aria.utils.Number.formatNumber(12.3);
            this.assertEquals("12(30", got, "Formatting 12.3 format ##,##0.00 expected %1 got %2");

            got = aria.utils.Number.formatNumber(12.3, function () {
                return "#,#.0";
            });
            this.assertEquals("1)2(3", got, "Formatting 12.3 format #,#.0 expected %1 got %2");

            got = aria.utils.Number.formatNumber(-12.3, function () {
                return "#,#.0";
            }, {
                strictGrouping : false
            });
            this.assertEquals("-1)2(3", got, "Formatting -12.3 format #,#.0 expected %1 got %2");

            this.assertLogsEmpty();
        },

        test_errors : function () {
            aria.utils.Number.formatNumber(12.3, function () {
                return "# #.0";
            });
            aria.utils.Number.formatNumber(12.3, "# #.0");
            aria.utils.Number.formatNumber(12.3, []);
            aria.utils.Number.formatNumber(12.3, "  ");
            aria.utils.Number.formatNumber(12.3, function () {
                return function () {
                    return "#";
                };
            });
            this.assertErrorInLogs(aria.utils.Number.INVALID_FORMAT, 5);
        }
    }
});