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
 * Aria resource object for dates en-US
 */
Aria.resourcesDefinition({
    $classpath : 'aria.resources.DateRes',
    $resources : {
        firstDayOfWeek : 0 /* Sunday */,
        day : [
            "sunnudagur",
            "m\u00E1nudagur",
            "\u00FEri\u00F0judagur",
            "mi\u00F0vikudagur",
            "fimmtudagur",
            "f\u00F6studagur",
            "laugardagur"
        ],
        // a false value for the following items mean: use substring
        // to generate the short versions of days or months
        dayShort : false,
        monthShort : false,
        month : [
            "jan\u00FAar",
            "febr\u00FAar",
            "mars",
            "apr\u00EDl",
            "ma\u00ED",
            "j\u00FAn\u00ED",
            "j\u00FAl\u00ED",
            "\u00E1g\u00FAst",
            "september",
            "okt\u00F3ber",
            "n\u00F3vember",
            "desember"
        ]
    }
});
