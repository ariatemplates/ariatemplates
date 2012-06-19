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
 * Bean definition containing default settings for the Number environment.
 */
Aria.beanDefinitions({
    $package : "aria.utils.environment.NumberCfgBeans",
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
                "decimalFormatSymbols" : {
                    $type : "DecimalFormatSymbols",
                    $description : "Represents the set of symbols used to interpret and format numbers.",
                    $default : {}
                },

                "currencyFormats" : {
                    $type : "CurrencyFormatsCfg",
                    $description : "Default currency formatting for the application.",
                    $default : {}
                }
            }
        },
        "DecimalFormatSymbols" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "decimalSeparator" : {
                    $type : "json:String",
                    $description : "Character used for decimal sign. (e.g. '.' dot in en_US or ',' comma in fr_FR.",
                    $default : "."
                },
                "groupingSeparator" : {
                    $type : "json:String",
                    $description : "Character used for grouping separator. (e.g. ',' dot in en_US or ' ' space in fr_FR.",
                    $default : ","
                },
                "strictGrouping" : {
                    $type : "json:Boolean",
                    $description : "Enforce strict group validation. If true, a grouping separation will be checked against the pattern.",
                    $default : false
                }
            }
        },
        "CurrencyFormatsCfg" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "currencyFormat" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Pattern for number formatting.",
                    $default : "#.######"
                },
                "currencySymbol" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Currency symbol.",
                    $default : "USD"
                }
            }
        }
    }
});