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
 * @class aria.widgets.WidgetsRes Error messages which can be displayed to the user.
 */
Aria.resourcesDefinition({
    $classpath : 'aria.widgets.WidgetsRes',
    $resources : {
        errors : {
            "NumberField" : {
                "validation" : "Number field must be a numerical value."
            },
            "TimeField" : {
                "validation" : "Please enter a valid time format, for example: 1000 or 10:00"
            },
            // For PTR 04203167, we must ensure that the error message below (for date validation) does not contain
            // formats unsuitable for booking a flight (e.g. date in the past like -5)
            "DateField" : {
                "validation" : "Please enter a valid date format, for example: 10/12 or 01MAR or +4",
                "minValue" : "Date is before the minimum date.",
                "maxValue" : "Date is after the maximum date."
            },
            "AutoComplete" : {
                "validation" : "There is no suggestion available for the given entry."
            }
            /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1428) */
            ,
            "40006_WIDGET_NUMBERFIELD_VALIDATION" : "Number field must be a numerical value.",
            "40007_WIDGET_TIMEFIELD_VALIDATION" : "Please enter a valid time format, for example: 1000 or 10:00",
            // For PTR 04203167, we must ensure that the error message below (for date validation) does not contain
            // formats unsuitable for booking a flight (e.g. date in the past like -5)
            "40008_WIDGET_DATEFIELD_VALIDATION" : "Please enter a valid date format, for example: 10/12 or 01MAR or +4",
            "40018_WIDGET_DATEFIELD_MINVALUE" : "Date is before the minimum date.",
            "40019_WIDGET_DATEFIELD_MAXVALUE" : "Date is after the maximum date.",
            "40020_WIDGET_AUTOCOMPLETE_VALIDATION" : "There is no suggestion available for the given entry."
            /* BACKWARD-COMPATIBILITY-END (GitHub #1428) */
        }
    }
});
