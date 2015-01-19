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
    $classpath : "test.aria.widgets.form.autocomplete.popupWidth.CustomResourceHandler",
    $prototype : {

        suggestionToLabel : function (suggestion) {
            if (suggestion.cityName) {
                var airportPart = suggestion.airportName ? ("," + suggestion.airportName) : '';
                return suggestion.cityName + airportPart + " (" + suggestion.iata + ")";
            } else {
                return suggestion.iata;
            }
        },

        getDefaultTemplate : function () {
            return "test.aria.widgets.form.autocomplete.popupWidth.AIRList";
        },
        /**
         * Call the callback with an array of suggestions in its arguments.
         * @param {String} textEntry Search string
         * @param {aria.core.CfgBeans.Callback} callback Called when suggestions are ready
         */
        getSuggestions : function (textEntry, callback) {

            this.$callback(callback, {
                suggestions : textEntry ? [{
                            "type" : 1,
                            "iata" : "LON",
                            "cityName" : "London",
                            "airportName" : null,
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 2,
                            "iata" : "BQH",
                            "cityName" : "London",
                            "airportName" : "Biggin Hill",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 2,
                            "iata" : "XQE",
                            "cityName" : "London",
                            "airportName" : "Ebbsfleet International Rail Station",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 2,
                            "iata" : "LGW",
                            "cityName" : "London",
                            "airportName" : "Gatwick",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 2,
                            "iata" : "LHR",
                            "cityName" : "London",
                            "airportName" : "Heathrow",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 2,
                            "iata" : "LCY",
                            "cityName" : "London",
                            "airportName" : "London City Airport",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 2,
                            "iata" : "LTN",
                            "cityName" : "London",
                            "airportName" : "Luton",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 2,
                            "iata" : "SEN",
                            "cityName" : "London",
                            "airportName" : "Southend",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 2,
                            "iata" : "QQS",
                            "cityName" : "London",
                            "airportName" : "St Pancras International Railst",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 2,
                            "iata" : "STN",
                            "cityName" : "London",
                            "airportName" : "Stansted",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom",
                            "exactMatch" : true
                        }, {
                            "type" : 5,
                            "iata" : "LRE",
                            "cityName" : "Longreach",
                            "airportName" : "Longreach",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "AU",
                            "countryName" : "Australia"
                        }, {
                            "type" : 5,
                            "iata" : "LDB",
                            "cityName" : "Londrina",
                            "airportName" : "Jose Richa",
                            "stateCode" : "PR",
                            "stateName" : "Parana",
                            "countryCode" : "BR",
                            "countryName" : "Brazil"
                        }, {
                            "type" : 5,
                            "iata" : "YXU",
                            "cityName" : "London",
                            "airportName" : "International",
                            "stateCode" : "ON",
                            "stateName" : "Ontario",
                            "countryCode" : "CA",
                            "countryName" : "Canada"
                        }, {
                            "type" : 5,
                            "iata" : "CGQ",
                            "cityName" : "Changchun",
                            "airportName" : "Longjia International",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "CN",
                            "countryName" : "China"
                        }, {
                            "type" : 5,
                            "iata" : "KWE",
                            "cityName" : "Guiyang",
                            "airportName" : "Longdongbao International",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "CN",
                            "countryName" : "China"
                        }, {
                            "type" : 5,
                            "iata" : "LCX",
                            "cityName" : "Longyan",
                            "airportName" : "Guanzhishan",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "CN",
                            "countryName" : "China"
                        }, {
                            "type" : 5,
                            "iata" : "DIJ",
                            "cityName" : "Dijon",
                            "airportName" : "Longvic",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "FR",
                            "countryName" : "France"
                        }, {
                            "type" : 5,
                            "iata" : "LKH",
                            "cityName" : "Long Akah",
                            "airportName" : "Long Akah",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "MY",
                            "countryName" : "Malaysia"
                        }, {
                            "type" : 5,
                            "iata" : "LBP",
                            "cityName" : "Long Banga",
                            "airportName" : "Long Banga",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "MY",
                            "countryName" : "Malaysia"
                        }, {
                            "type" : 5,
                            "iata" : "LGL",
                            "cityName" : "Long Lellang",
                            "airportName" : "Long Lellang",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "MY",
                            "countryName" : "Malaysia"
                        }, {
                            "type" : 5,
                            "iata" : "ODN",
                            "cityName" : "Long Seridan",
                            "airportName" : "Long Seridan",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "MY",
                            "countryName" : "Malaysia"
                        }, {
                            "type" : 5,
                            "iata" : "LYR",
                            "cityName" : "Longyearbyen",
                            "airportName" : "Svalbard",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "NO",
                            "countryName" : "Norway"
                        }, {
                            "type" : 5,
                            "iata" : "LGB",
                            "cityName" : "Long Beach",
                            "airportName" : "Long Beach",
                            "stateCode" : "CA",
                            "stateName" : "California",
                            "countryCode" : "US",
                            "countryName" : "USA"
                        }, {
                            "type" : 5,
                            "iata" : "ISP",
                            "cityName" : "Islip",
                            "airportName" : "Long Island Macar",
                            "stateCode" : "NY",
                            "stateName" : "New York",
                            "countryCode" : "US",
                            "countryName" : "USA"
                        }, {
                            "type" : 5,
                            "iata" : "GGG",
                            "cityName" : "Longview",
                            "airportName" : "Gregg County",
                            "stateCode" : "TX",
                            "stateName" : "Texas",
                            "countryCode" : "US",
                            "countryName" : "USA"
                        }, {
                            "type" : 5,
                            "iata" : "LDY",
                            "cityName" : "Londonderry",
                            "airportName" : "Eglinton",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom"
                        }, {
                            "type" : 5,
                            "iata" : "OXF",
                            "cityName" : "Oxford",
                            "airportName" : "London Oxford",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "GB",
                            "countryName" : "United Kingdom"
                        }, {
                            "type" : 5,
                            "iata" : "LOD",
                            "cityName" : "Longana",
                            "airportName" : "Longana",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "VU",
                            "countryName" : "Vanuatu"
                        }, {
                            "type" : 5,
                            "iata" : "LNE",
                            "cityName" : "Lonorore",
                            "airportName" : "Lonorore",
                            "stateCode" : "",
                            "stateName" : "",
                            "countryCode" : "VU",
                            "countryName" : "Vanuatu"
                        }] : []
            });
        }
    }
});
