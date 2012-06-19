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
 * Bean definition containing default settings for the Date environment.
 */
Aria.beanDefinitions({
    $package : "aria.utils.environment.DateCfgBeans",
    $description : "A definition of the JSON beans used to set the environment settings.",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "environmentBase" : "aria.core.environment.EnvironmentBaseCfgBeans"
    },
    $beans : {
        "AppCfg" : {
            $type : "json:Object",
            $description : "Application environment variables",
            $restricted : false,
            $properties : {
                "dateFormats" : {
                    $type : "DateFormatsCfg",
                    $description : "Default date formatting for the application",
                    $default : {
                        "dateBeforeMonth" : true,
                        "shortFormat" : "d/M/y",
                        "mediumFormat" : "d MMM y",
                        "longFormat" : "d MMMM yyyy",
                        "fullFormat" : "EEEE d MMMM yyyy"
                    }
                },

                "timeFormats" : {
                    $type : "TimeFormatsCfg",
                    $description : "Default time formatting for the application",
                    $default : {
                        "shortFormat" : "HH:mm",
                        "fullFormat" : "HH:mm:ss"
                    }
                },

                "firstDayOfWeek" : {
                    $type : "json:Integer",
                    $description : "Defines first day of week in the locale. Available values: aria.utils.Date.SUNDAY, aria.utils.Date.MONDAY, aria.utils.Date.SATURDAY (0, 1, 6).",
                    $default : 0, // Sun
                    $sample : 1
                }
            }
        },

        "DateFormatsCfg" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "dateBeforeMonth" : {
                    $type : "json:Boolean",
                    $description : "In European display, date is before month in 21/12/2012. In US display, month is before day in  12/21/2012",
                    $default : true
                },
                "shortFormat" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Short format for date formatting",
                    $default : "d/M/y"
                },
                "mediumFormat" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Medium format for date formatting",
                    $default : "d MMM y"
                },
                "longFormat" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Long format for date formatting",
                    $default : "d MMMM yyyy"
                },
                "fullFormat" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Full format for date formatting",
                    $default : "EEEE d MMMM yyyy"
                }
            }

        },

        "TimeFormatsCfg" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "shortFormat" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Short format for the time formatting",
                    $default : "hh:mm"
                },
                "fullFormat" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Full format for time formatting",
                    $default : "hh:mm:ss"
                }
            }
        }
    }
});