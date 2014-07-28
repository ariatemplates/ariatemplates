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

(function () {
    var basePackage = "atplugins.lightWidgets";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.beanDefinitions({
        $package : "atplugins.lightWidgets.datepicker.DatePickerCfgBeans",
        $description : "Configuration for the light datepicker widget.",
        $namespaces : {
            "json" : "aria.core.JsonTypes",
            "base" : "aria.html.beans.ElementCfg",
            "calendar" : "atplugins.lightWidgets.calendar.CalendarCfgBeans",
            "datefield" : "atplugins.lightWidgets.datefield.DateFieldCfgBeans",
            "textinput" : "aria.html.beans.TextInputCfg"
        },
        $beans : {
            "Properties" : {
                $type : "base:Properties",
                $description : "Properties of a Text Input widget.",
                $properties : {
                    "tagName" : {
                        $type : "base:Properties.$properties.tagName",
                        $description : "Automatically set to input by the framework. It cannot be overridden in the configuration.",
                        $default : "span",
                        $mandatory : false
                    },
                    "minValue" : {
                        $type : "json:Date",
                        $description : "Minimum date for the value property."
                    },
                    "maxValue" : {
                        $type : "json:Date",
                        $description : "Maximum date for the value property."
                    },
                    "lazy" : {
                        $type : "json:Boolean",
                        $description : "Whether the dependencies of the dropdown should be loaded at widget initialization or the first time it is needed.",
                        $default : false
                    },
                    "dateField" : {
                        $type : "datefield:Properties",
                        $description : "Configuration of the datefield component of the datepicker",
                        $restricted : false,
                        $properties : {
                            "minValue" : {
                                $type : "datefield:Properties.$properties.minValue",
                                $description : "Minimum date for the value property. It is automatically set by the datepicker"
                            },
                            "maxValue" : {
                                $type : "datefield:Properties.$properties.maxValue",
                                $description : "Maximum date for the value property. It is automatically set by the datepicker"
                            },
                            "bind" : {
                                $type : "textinput:Properties.$properties.bind",
                                $description : "Bindings to the data model. This is a readonly property as it is automatically set by the datepicker for the calendar."
                            }
                        },
                        $default : {}
                    },
                    "calendar" : {
                        $type : "calendar:Properties",
                        $description : "Configuration of the calendar component of the datepicker. It is of type atplugins.lightWidgets.calendar.CalendarCfgBeans.Properties",
                        $restricted : false,
                        $properties : {
                            "bind" : {
                                $type : "calendar:Properties.$properties.bind",
                                $description : "Bindings to the data model. This is a readonly property as it is automatically set by the datepicker for the calendar."
                            }
                        },
                        $default : {}
                    },
                    "sclass" : {
                        $type : "json:String",
                        $description : "skin class for the datepicker.",
                        $default : "std"
                    }
                }
            }
        }
    });
})();