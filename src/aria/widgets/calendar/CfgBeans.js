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
var Aria = require("../../Aria");
var ariaCoreJsonTypes = require("../../core/JsonTypes");
var ariaCoreEnvironmentEnvironmentBaseCfgBeans = require("../../core/environment/EnvironmentBaseCfgBeans");


/**
 * TODOC
 * @class aria.widgets.calendar.CfgBeans
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.widgets.calendar.CfgBeans",
    $description : "Beans used for the data model of the calendar module controller.",
    $namespaces : {
        "json" : ariaCoreJsonTypes,
        "AppCfg" : ariaCoreEnvironmentEnvironmentBaseCfgBeans
    },
    $beans : {
        "CalendarSettings" : {
            $type : "json:Object",
            $description : "Properties which can be set directly. They are taken into account when calling one of the the refresh methods of the calendar controller.",
            $properties : {
                "value" : {
                    $type : "json:Date",
                    $description : "Date currently selected in the calendar."
                },
                "minValue" : {
                    $type : "json:Date",
                    $description : "Minimum date for the value property."
                },
                "maxValue" : {
                    $type : "json:Date",
                    $description : "Maximum date for the value property."
                },
                "displayUnit" : {
                    $type : "json:Enum",
                    $description : "Unit which must be displayed entirely in the calendar. May be either month (M) or week (W). The default template only supports month view.",
                    $enumValues : ["M", "W"],
                    $default : "M"
                },
                "numberOfUnits" : {
                    $type : "json:Integer",
                    $description : "Number of display units to show at the same time.",
                    $minValue : 1,
                    $default : 2
                },
                "startDate" : {
                    $type : "json:Date",
                    $description : "Approximate first date in the currently displayed calendar. However, as the calendar may have a display with whole weeks or whole months, dates before this date may also appear."
                },
                "firstDayOfWeek" : {
                    $type : "json:Integer",
                    $description : "First day of the week. 0 = Sunday, ... 6 = Saturday. The null value means that it is set according to the regional settings.",
                    $minValue : 0,
                    $maxValue : 6
                },
                "monthLabelFormat" : {
                    $type : "json:String",
                    $description : "Date pattern to be used when displaying each month.",
                    $default : "MMMM yyyy"
                },
                "dayOfWeekLabelFormat" : {
                    $type : "json:String",
                    $description : "Date pattern to be used when displaying each day of the week.",
                    $default : "EE"
                },
                "dateLabelFormat" : {
                    $type : "json:String",
                    $description : "Date pattern to be used when displaying each date in the calendar.",
                    $default : "d"
                },
                "completeDateLabelFormat" : {
                    $type : "AppCfg:FormatTypes",
                    $description : "Date pattern to be used when displaying complete dates (for example, in the default template, the tooltip on the today link)."
                },
                "label" : {
                    $type : "json:String",
                    $description : "Label text to associate to the calendar."
                },
                "showWeekNumbers" : {
                    $type : "json:Boolean",
                    $description : "Specifies whether week numbers should be displayed."
                },
                "showShortcuts" : {
                    $type : "json:Boolean",
                    $description : "Specifies if today and selected day shortcuts should be displayed",
                    $default : true
                },
                "restrainedNavigation" : {
                    $type : "json:Boolean",
                    $description : "Specifies if today and selected day shortcuts should be displayed",
                    $default : true
                },
                "focus" : {
                    $type : "json:Boolean",
                    $description : "Is true if the calendar currently has the focus."
                }

            }
        },
        "CalendarModel" : {
            $type : "json:Object",
            $description : "Data model for the calendar.",
            $properties : {
                "settings" : {
                    $type : "CalendarSettings"
                },
                "skin" : {
                    $type : "json:Object",
                    $description : "Skin properties",
                    $properties : {
                        "sclass" : {
                            $type : "json:String",
                            $description : "Skin class."
                        },
                        "baseCSS" : {
                            $type : "json:String",
                            $description : "Name of CSS classes provided by the skin class."
                        },
                        "skinObject" : {
                            $type : "json:ObjectRef",
                            $description : "Properties provided by the skin class."
                        }
                    }
                },
                "calendar" : {
                    $type : "json:Object",
                    $description : "Data to be used when displaying the calendar. They are managed by the calendar controller and must not be changed directly.",
                    $properties : {
                        "startDate" : {
                            $type : "json:Date",
                            $description : "First date which must be displayed in the calendar.",
                            $mandatory : true
                        },
                        "endDate" : {
                            $type : "json:Date",
                            $description : "Last date which must be displayed in the calendar.",
                            $mandatory : true
                        },
                        "daysOfWeek" : {
                            $type : "json:Array",
                            $description : "Array of the days of the week, starting with settings.firstDayOfWeek.",
                            $contentType : {
                                $type : "DayOfWeek"
                            },
                            $mandatory : true
                        },
                        "startWeekIndex" : {
                            $type : "json:Integer",
                            $description : "Index of first week to display in the weeks array (the weeks array may contain additional weeks before this index for caching purposes, but they should not be currently displayed).",
                            $mandatory : true
                        },
                        "endWeekIndex" : {
                            $type : "json:Integer",
                            $description : "Index of the last week to display in the weeks array (the weeks array may contain additional weeks after this index for caching purposes, but they should not be currently displayed).",
                            $mandatory : true
                        },
                        "weeks" : {
                            $type : "json:Array",
                            $description : "Array of weeks. May be larger than the actual weeks to display. Use startWeekIndex and endWeekIndex to know which weeks to display.",
                            $contentType : {
                                $type : "Week"
                            },
                            $mandatory : true
                        },
                        "startMonthIndex" : {
                            $type : "json:Integer",
                            $description : "Index of first month to display in the months array (the months array may contain additional months before this index for caching purposes, but they should not be currently displayed).",
                            $mandatory : true
                        },
                        "endMonthIndex" : {
                            $type : "json:Integer",
                            $description : "Index of last month to display in the months array (the months array may contain additional months after this index for caching purposes, but they should not be currently displayed).",
                            $mandatory : true
                        },
                        "months" : {
                            $type : "json:Map",
                            $description : "Array and map of months. May be larger than the actual months to display. Use startMonthIndex and endMonthIndex to know which months to display.",
                            $contentType : {
                                $type : "Month"
                            },
                            $mandatory : true
                        },
                        "previousPageEnabled" : {
                            $type : "json:Boolean",
                            $description : "Is true if it is possible to get the previous page.",
                            $mandatory : true
                        },
                        "nextPageEnabled" : {
                            $type : "json:Boolean",
                            $description : "Is true if it is possible to get the next page.",
                            $mandatory : true
                        },
                        "today" : {
                            $type : "json:Date",
                            $description : "Date of the current day.",
                            $mandatory : true
                        }
                    }
                }
            }
        },
        "DayOfWeek" : {
            $type : "json:Object",
            $description : "Information about a day of the week.",
            $properties : {
                "label" : {
                    $type : "json:String",
                    $description : "Label to be displayed for the day (see settings.dayOfWeekLabelFormat)."
                },
                "day" : {
                    $type : "json:Integer",
                    $description : "Day in the week. 0 = Sunday, ... 6 = Saturday",
                    $minValue : 0,
                    $maxValue : 6
                }
            }
        },
        "Month" : {
            $type : "json:Object",
            $description : "Contains information about a specific month.",
            $properties : {
                "label" : {
                    $type : "json:String",
                    $description : "Label to be displayed for the month (see settings.monthLabelFormat).",
                    $mandatory : true
                },
                "monthKey" : {
                    $type : "json:String",
                    $description : "String which specify the month. Its format could change in the future. It should only be used to compare several monthKey fields or to retrieve the month from the calendar.months array.",
                    $mandatory : true
                },
                "firstOfMonth" : {
                    $type : "json:Date",
                    $description : "Javascript Date for the first day of the month.",
                    $mandatory : true
                },
                "weeks" : {
                    $type : "json:Array",
                    $description : "Array of the weeks in this month.",
                    $contentType : {
                        $type : "Week"
                    },
                    $mandatory : true
                },
                "weeksInMonth" : {
                    $type : "json:Integer",
                    $description : "Number of weeks in the month, including weeks overlapping with other months (is equal to weeks.length).",
                    $minValue : 4,
                    $maxValue : 6,
                    $mandatory : true
                },
                "wholeWeeksInMonth" : {
                    $type : "json:Integer",
                    $description : "Number of whole weeks in the month (not including weeks overlapping with other months).",
                    $minValue : 3,
                    $maxValue : 4,
                    $mandatory : true
                },
                "daysBeforeStartOfMonth" : {
                    $type : "json:Integer",
                    $description : "Number of days between the first day of the week and the first day of the month.",
                    $minValue : 0,
                    $maxValue : 6,
                    $mandatory : true
                },
                "daysInMonth" : {
                    $type : "json:Integer",
                    $description : "Number of days in the month.",
                    $minValue : 28,
                    $maxValue : 31,
                    $mandatory : true
                },
                "daysAfterEndOfMonth" : {
                    $type : "json:Integer",
                    $description : "Number of days between the last day of the month and the end of the week.",
                    $minValue : 0,
                    $maxValue : 6,
                    $mandatory : true
                }
            },
            $mandatory : true
        },
        "Week" : {
            $type : "json:Object",
            $description : "Contains information about a specific week.",
            $properties : {
                "overlappingDays" : {
                    $type : "json:Integer",
                    $description : "Number of days at the begining of the week which belong to the previous month, if the whole week is not in a single month. The value is 0 if the whole week is in a single month.",
                    $mandatory : true
                },
                "monthStart" : {
                    $type : "json:String",
                    $description : "If the week contains the first day of a month, contain the monthKey of that month. Is null or undefined otherwise.",
                    $mandatory : false
                },
                "month" : {
                    $type : "json:String",
                    $description : "If overlappingDays is 0, contain the monthKey of the month which this week belongs to.",
                    $mandatory : false
                },
                "monthEnd" : {
                    $type : "json:String",
                    $description : "If the week contains the last day of a month, contain the monthKey of that month. Is null or undefined otherwise.",
                    $mandatory : false
                },
                "indexInMonth" : {
                    $type : "json:Integer",
                    $description : "Contain the index of this week inside the month specified by month or monthEnd.",
                    $mandatory : true
                },
                "weekNumber" : {
                    $type : "json:Integer",
                    $description : "Number of the week in the year (first whole week = 1).",
                    $mandatory : true
                },
                "days" : {
                    $type : "json:Array",
                    $description : "Contains the days of this week.",
                    $contentType : {
                        $type : "Date"
                    },
                    $mandatory : true
                }
            }
        },
        "Date" : {
            $type : "json:Object",
            $description : "Contains information about a specific date.",
            $properties : {
                "jsDate" : {
                    $type : "json:Date",
                    $description : "Javascript date object.",
                    $mandatory : true
                },
                "label" : {
                    $type : "json:String",
                    $description : "Label to use when displaying the date in the calendar.",
                    $mandatory : true
                },
                "monthKey" : {
                    $type : "json:String",
                    $description : "String which specify the month. Its format could change in the future. It should only be used to compare several monthKey fields or to retrieve the month from the calendar.months array.",
                    $mandatory : true
                },
                "isFirstOfMonth" : {
                    $type : "json:Boolean",
                    $description : "Is true if the date is the first of its month.",
                    $mandatory : false
                },
                "isLastOfMonth" : {
                    $type : "json:Boolean",
                    $description : "Is true if the date is the last of its month.",
                    $mandatory : false
                },
                "isSelected" : {
                    $type : "json:Boolean",
                    $description : "Is true if the date is selected.",
                    $mandatory : false
                },
                "isWeekend" : {
                    $type : "json:Boolean",
                    $description : "Is true if the date is in the week-end (either a saturday or a sunday).",
                    $mandatory : false
                },
                "isToday" : {
                    $type : "json:Boolean",
                    $description : "Is true if the date is today.",
                    $mandatory : false
                },
                "isSelectable" : {
                    $type : "json:Boolean",
                    $description : "Is true if the date is selectable.",
                    $mandatory : false
                }
            },
            $mandatory : true
        },
        "DatePosition" : {
            $type : "json:Object",
            $description : "Information about the position of a specific date inside the data model of the calendar.",
            $properties : {
                "weekIndex" : {
                    $type : "json:Integer",
                    $description : "Index in the general weeks array.",
                    $mandatory : true
                },
                "monthIndex" : {
                    $type : "json:Integer",
                    $description : "Index in the general months array, or null if the month is not in the data model."
                },
                "weekInMonthIndex" : {
                    $type : "json:Integer",
                    $description : "Index in the weeks array of the month, or null if the month is not in the data model",
                    $mandatory : true

                },
                "dayInWeekIndex" : {
                    $type : "json:Integer",
                    $description : "Index in the days array of the week.",
                    $mandatory : true
                },
                "month" : {
                    $type : "Month",
                    $description : "Month in which the date is found, or null if the month is not in the data model",
                    $mandatory : true
                },
                "week" : {
                    $type : "Week",
                    $description : "Week in which the date is found.",
                    $mandatory : true
                },
                "day" : {
                    $type : "Date",
                    $description : "Date information.",
                    $mandatory : true
                }
            }
        }
    }
});
