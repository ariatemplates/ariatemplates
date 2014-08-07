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
 * DO NOT FORMAT
 * Aria resource object for dates fi-FI
 */
Aria.resourcesDefinition({
    $classpath : 'aria.resources.DateRes',
    $resources : {
        day : [
            "Sunnuntai",
            "Maanantai",
            "Tiistai",
            "Keskiviikko",
            "Torstai",
            "Perjantai",
            "Lauantai"
        ],
        // a false value for the following items mean: use substring
        // to generate the short versions of days or months
        dayShort : false,
        monthShort : [
            "tammi",
            "helmi",
            "maalis",
            "huhti",
            "touko",
            "kes\u00E4",
            "hein\u00E4",
            "elo",
            "syys",
            "loka",
            "marras",
            "joulu"],
        month : [
            "tammikuu",
            "helmikuu",
            "maaliskuu",
            "huhtikuu",
            "toukokuu",
            "kes\u00E4kuu",
            "hein\u00E4kuu",
            "elokuu",
            "syyskuu",
            "lokakuu",
            "marraskuu",
            "joulukuu"
        ]
    }
});
