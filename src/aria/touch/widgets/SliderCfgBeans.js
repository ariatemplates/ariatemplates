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

Aria.beanDefinitions({
    $package : "aria.touch.widgets.SliderCfgBeans",
    $description : "Slider config beans",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "common" : "aria.widgetLibs.CommonBeans"
    },
    $beans : {
        "SliderCfg" : {
            $type : "json:Object",
            $description : "Configuration of the slider widget.",
            $properties : {
                id : {
                    $type : "json:String",
                    $description : "Id of the widget"
                },
                width : {
                    $type : "json:Integer",
                    $description : "Width to use for the widget.",
                    $default : 100
                },
                bindValue : {
                    $type : "json:Object",
                    $description : "Binding for the value of the slider.",
                    $properties : {
                        inside : {
                            $type : "json:ObjectRef",
                            $description : "Reference to the object that holds the property to bind to.",
                            $mandatory : true
                        },
                        to : {
                            $type : "json:String",
                            $description : "Name of the JSON property to bind to.",
                            $mandatory : true
                        }
                    }
                }
            }
        },
        "DoubleSliderCfg" : {
            $type : "json:Object",
            $description : "Configuration of the slider widget with two thumbs.",
            $properties : {
                id : {
                    $type : "json:String",
                    $description : "Id of the widget"
                },
                width : {
                    $type : "json:Integer",
                    $description : "Width to use for the widget.",
                    $default : 100
                },
                bind : {
                    $type : "json:Object",
                    $description : "Automatic bindings for the widget properties",
                    $properties : {
                        value : {
                            $type : "json:Object",
                            $description : "Binding for the widget's value",
                            $properties : {
                                inside : {
                                    $type : "json:ObjectRef",
                                    $description : "Reference to the object that holds the property to bind to.",
                                    $mandatory : true
                                },
                                to : {
                                    $type : "json:String",
                                    $description : "Name of the property to bind to.",
                                    $mandatory : true
                                }
                            }
                        }
                    }
                },
                onchange : {
                    $type : "common:Callback",
                    $description : "Function to be called when at least on the values of the widget changes due to user action (drag)."
                }
            }
        }
    }
});
