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
 * Aria resource object for dates sv-SE
 */
Aria.resourcesDefinition({
    $classpath : 'aria.resources.DateRes',
    $resources : {
        day : [
            "s\u00F6ndag",
            "m\u00E5ndag",
            "tisdag",
            "onsdag",
            "torsdag",
            "fredag",
            "l\u00F6rdag"
        ],
        // a false value for the following items mean: use substring
        // to generate the short versions of days or months
        dayShort : false,
        monthShort : false,
        month : [
            "januari",
            "februari",
            "mars",
            "april",
            "maj",
            "juni",
            "juli",
            "augusti",
            "september",
            "oktober",
            "november",
            "december"
        ]
    }
});
