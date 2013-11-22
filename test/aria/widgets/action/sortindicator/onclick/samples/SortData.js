/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.action.sortindicator.onclick.samples.SortData",
    $constructor : function () {},
    $prototype : {
        data : {
            "avail" : {
                "prices" : [{
                            "priceWithoutTax" : 128.95,
                            "taxAmount" : 0,
                            "price" : 128.95,
                            "currency" : "EUR",
                            "bounds" : [{
                                        "arrival" : "LHR",
                                        "departure" : "HKG",
                                        "departureDate" : {
                                            "date" : 15,
                                            "day" : 1,
                                            "hours" : 0,
                                            "minutes" : 0,
                                            "month" : 1,
                                            "seconds" : 0,
                                            "time" : 1266192000000,
                                            "timezoneOffset" : 0,
                                            "year" : 110
                                        },
                                        "errors" : [],
                                        "index" : 0,
                                        "nextDate" : {
                                            "date" : 16,
                                            "day" : 2,
                                            "hours" : 0,
                                            "minutes" : 0,
                                            "month" : 1,
                                            "seconds" : 0,
                                            "time" : 1266278400000,
                                            "timezoneOffset" : 0,
                                            "year" : 110
                                        },
                                        "previousDate" : {
                                            "date" : 14,
                                            "day" : 0,
                                            "hours" : 0,
                                            "minutes" : 0,
                                            "month" : 1,
                                            "seconds" : 0,
                                            "time" : 1266105600000,
                                            "timezoneOffset" : 0,
                                            "year" : 110
                                        },
                                        "recommendations" : [{
                                                    "duration" : "780",
                                                    "index" : 0,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 6,
                                                                        "minutes" : 35,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266215700000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 0,
                                                                        "minutes" : 35,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266194100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "737",
                                                                "flightNumber" : "1100",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "800",
                                                    "index" : 1,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 6,
                                                                        "minutes" : 20,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266214800000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 1,
                                                                        "minutes" : 0,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266195600000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "255",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "820",
                                                    "index" : 2,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 15,
                                                                        "minutes" : 0,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266246000000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 9,
                                                                        "minutes" : 20,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266225600000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "343",
                                                                "flightNumber" : "257",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "795",
                                                    "index" : 3,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 20,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266264600000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 14,
                                                                        "minutes" : 55,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266245700000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "253",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "785",
                                                    "index" : 4,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 5,
                                                                        "minutes" : 0,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266296400000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 23,
                                                                        "minutes" : 55,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266278100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "251",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "1010",
                                                    "index" : 5,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 6,
                                                                        "minutes" : 20,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266301200000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "CDG",
                                                                    "terminal" : "2A"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 23,
                                                                        "minutes" : 25,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266276300000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "1104",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "BA",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 8,
                                                                        "minutes" : 15,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266308100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "5"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266306600000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "CDG",
                                                                    "terminal" : "2A"
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "303",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "1020",
                                                    "index" : 6,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 16,
                                                                        "minutes" : 25,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266251100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 10,
                                                                        "minutes" : 15,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266228900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "1105",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "KL",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 19,
                                                                        "minutes" : 15,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266261300000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "4"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 18,
                                                                        "minutes" : 45,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266259500000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "equipment" : "F70",
                                                                "flightNumber" : "1027",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "965",
                                                    "index" : 7,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 5,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266299400000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "CDG",
                                                                    "terminal" : "2A"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 23,
                                                                        "minutes" : 45,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266277500000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "261",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "AF",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266306600000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "4"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "C",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 30,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266305400000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "CDG",
                                                                    "terminal" : "2E"
                                                                },
                                                                "equipment" : "321",
                                                                "flightNumber" : "1080",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "1030",
                                                    "index" : 8,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 16,
                                                                        "minutes" : 25,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266251100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 10,
                                                                        "minutes" : 15,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266228900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "1105",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "LH",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 19,
                                                                        "minutes" : 25,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266261900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "Y",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 19,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266261000000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "6592",
                                                                "operatingairline" : "BD",
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "1030",
                                                    "index" : 9,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 5,
                                                                        "minutes" : 25,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266297900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "MUC",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 23,
                                                                        "minutes" : 5,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266275100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "1102",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "BA",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 8,
                                                                        "minutes" : 15,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266308100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "5"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 0,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266303600000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "MUC",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "320",
                                                                "flightNumber" : "947",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "1035",
                                                    "index" : 10,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 16,
                                                                        "minutes" : 25,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266251100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 10,
                                                                        "minutes" : 15,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266228900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "1105",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "BD",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 19,
                                                                        "minutes" : 30,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266262200000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "Y",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 19,
                                                                        "minutes" : 15,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266261300000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "112",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "980",
                                                    "index" : 11,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 5,
                                                                        "minutes" : 30,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266298200000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "FRA",
                                                                    "terminal" : "2"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 15,
                                                                        "day" : 1,
                                                                        "hours" : 23,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266277800000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "289",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "BD",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 8,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266307800000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "C",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 16,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 30,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266305400000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "FRA",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "320",
                                                                "flightNumber" : "3210",
                                                                "operatingairline" : "LH",
                                                                "stops" : 0
                                                            }]
                                                }]
                                    }, {
                                        "arrival" : "HKG",
                                        "departure" : "LHR",
                                        "departureDate" : {
                                            "date" : 22,
                                            "day" : 1,
                                            "hours" : 0,
                                            "minutes" : 0,
                                            "month" : 1,
                                            "seconds" : 0,
                                            "time" : 1266796800000,
                                            "timezoneOffset" : 0,
                                            "year" : 110
                                        },
                                        "errors" : [],
                                        "index" : 0,
                                        "nextDate" : {
                                            "date" : 23,
                                            "day" : 2,
                                            "hours" : 0,
                                            "minutes" : 0,
                                            "month" : 1,
                                            "seconds" : 0,
                                            "time" : 1266883200000,
                                            "timezoneOffset" : 0,
                                            "year" : 110
                                        },
                                        "previousDate" : {
                                            "date" : 21,
                                            "day" : 0,
                                            "hours" : 0,
                                            "minutes" : 0,
                                            "month" : 1,
                                            "seconds" : 0,
                                            "time" : 1266710400000,
                                            "timezoneOffset" : 0,
                                            "year" : 110
                                        },
                                        "recommendations" : [{
                                                    "duration" : "695",
                                                    "index" : 0,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 5,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266908700000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 11,
                                                                        "minutes" : 30,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266838200000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "252",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "710",
                                                    "index" : 1,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266909000000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 12,
                                                                        "minutes" : 20,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266841200000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "equipment" : "737",
                                                                "flightNumber" : "1106",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "710",
                                                    "index" : 2,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 13,
                                                                        "minutes" : 55,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266933300000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 18,
                                                                        "minutes" : 5,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266861900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "250",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "740",
                                                    "index" : 3,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 17,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266945000000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 20,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266871800000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "equipment" : "343",
                                                                "flightNumber" : "256",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "700",
                                                    "index" : 4,
                                                    "segments" : [{
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 17,
                                                                        "minutes" : 45,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266947100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 22,
                                                                        "minutes" : 5,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266876300000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "3"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "254",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "840",
                                                    "index" : 5,
                                                    "segments" : [{
                                                                "airline" : "KL",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 11,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266839400000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 9,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266829800000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "4"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "9962",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266909000000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 13,
                                                                        "minutes" : 5,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266843900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "270",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "840",
                                                    "index" : 6,
                                                    "segments" : [{
                                                                "airline" : "LH",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 12,
                                                                        "minutes" : 25,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266841500000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "FRA",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 9,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266832200000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "321",
                                                                "flightNumber" : "4725",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266911400000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 13,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266846600000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "FRA",
                                                                    "terminal" : "2"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "288",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "840",
                                                    "index" : 7,
                                                    "segments" : [{
                                                                "airline" : "BD",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 12,
                                                                        "minutes" : 25,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266841500000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "FRA",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "C",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 9,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266832200000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "321",
                                                                "flightNumber" : "3205",
                                                                "operatingairline" : "LH",
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266911400000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 13,
                                                                        "minutes" : 50,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266846600000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "FRA",
                                                                    "terminal" : "2"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "288",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "855",
                                                    "index" : 8,
                                                    "segments" : [{
                                                                "airline" : "BD",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 11,
                                                                        "minutes" : 15,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266837300000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "Y",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 8,
                                                                        "minutes" : 55,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266828900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "103",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266909000000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 13,
                                                                        "minutes" : 5,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266843900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "270",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "855",
                                                    "index" : 9,
                                                    "segments" : [{
                                                                "airline" : "LH",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 11,
                                                                        "minutes" : 15,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266837300000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "Y",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 8,
                                                                        "minutes" : 55,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266828900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "1"
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "6583",
                                                                "operatingairline" : "BD",
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266909000000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 13,
                                                                        "minutes" : 5,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266843900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "270",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "860",
                                                    "index" : 10,
                                                    "segments" : [{
                                                                "airline" : "BA",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 11,
                                                                        "minutes" : 30,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266838200000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "CDG",
                                                                    "terminal" : "2A"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 9,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266829800000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "5"
                                                                },
                                                                "equipment" : "321",
                                                                "flightNumber" : "306",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 30,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266910200000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 13,
                                                                        "minutes" : 5,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266843900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "CDG",
                                                                    "terminal" : "2A"
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "260",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }, {
                                                    "duration" : "870",
                                                    "index" : 11,
                                                    "segments" : [{
                                                                "airline" : "BA",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 10,
                                                                        "minutes" : 55,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266836100000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "J",
                                                                            "status" : "9"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 8,
                                                                        "minutes" : 40,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266828000000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "LHR",
                                                                    "terminal" : "5"
                                                                },
                                                                "equipment" : "319",
                                                                "flightNumber" : "430",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }, {
                                                                "airline" : "CX",
                                                                "arrival" : {
                                                                    "date" : {
                                                                        "date" : 23,
                                                                        "day" : 2,
                                                                        "hours" : 7,
                                                                        "minutes" : 10,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266909000000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "HKG",
                                                                    "terminal" : "1"
                                                                },
                                                                "classes" : [{
                                                                            "rbd" : "F",
                                                                            "status" : "4"
                                                                        }],
                                                                "departure" : {
                                                                    "date" : {
                                                                        "date" : 22,
                                                                        "day" : 1,
                                                                        "hours" : 13,
                                                                        "minutes" : 5,
                                                                        "month" : 1,
                                                                        "seconds" : 0,
                                                                        "time" : 1266843900000,
                                                                        "timezoneOffset" : 0,
                                                                        "year" : 110
                                                                    },
                                                                    "location" : "AMS",
                                                                    "terminal" : ""
                                                                },
                                                                "equipment" : "744",
                                                                "flightNumber" : "270",
                                                                "operatingAirline" : -1,
                                                                "stops" : 0
                                                            }]
                                                }]
                                    }]
                        }],
                "dictionary" : {
                    "airlines" : {
                        "AF" : "Air France",
                        "LH" : "Lufthansa",
                        "CX" : "Cathay Pacific",
                        "KL" : "KLM Royal Dutch Airlines",
                        "BA" : "British Airways",
                        "BD" : "BMI"
                    },
                    "equipments" : {
                        "744" : "Boeing 747-400",
                        "319" : "Airbus Industrie A319",
                        "F70" : "Fokker 70",
                        "320" : "Airbus Industrie A320-100/200",
                        "343" : "Airbus Industrie A340-300",
                        "321" : "Airbus Industrie A321",
                        "737" : "Boeing 737 All Series Passenger"
                    },
                    "locations" : {
                        "BKK" : {
                            "airportName" : "Bangkok",
                            "cityCode" : "BKK",
                            "cityName" : "Bangkok"
                        },
                        "CDG" : {
                            "airportName" : "Charles De Gaulle",
                            "cityCode" : "PAR",
                            "cityName" : "Paris"
                        },
                        "HKG" : {
                            "airportName" : "Hong Kong International",
                            "cityCode" : "HKG",
                            "cityName" : "Hong Kong"
                        },
                        "AMS" : {
                            "airportName" : "Schiphol",
                            "cityCode" : "AMS",
                            "cityName" : "Amsterdam"
                        },
                        "FRA" : {
                            "airportName" : "Frankfurt International",
                            "cityCode" : "FRA",
                            "cityName" : "Frankfurt"
                        },
                        "LHR" : {
                            "airportName" : "Heathrow",
                            "cityCode" : "LON",
                            "cityName" : "London"
                        },
                        "MUC" : {
                            "airportName" : "Munich International",
                            "cityCode" : "MUC",
                            "cityName" : "Munich"
                        }
                    }
                },
                "errors" : [],
                "numberOfSeats" : 1,
                "pollingNeeded" : true,
                "references" : {
                    "airlines" : ["CX", "BA", "KL", "AF", "LH", "BD"],
                    "equipments" : ["737", "744", "343", "319", "F70", "321", "320"],
                    "locations" : ["HKG", "LHR", "HKG", "HKG", "LHR", "CDG", "AMS", "MUC", "FRA", "BKK"]
                },
                "travelShopperTicket" : 0
            }
        }
    }

});
