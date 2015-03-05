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
var ariaUtilsDragdropDragDropBean = require("../../utils/dragdrop/DragDropBean");
var ariaWidgetsCfgBeans = require("../CfgBeans");


/**
 * Bean definition containing default settings for the Widget Settings environment.
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.widgets.environment.WidgetSettingsCfgBeans",
    $namespaces : {
        "json" : ariaCoreJsonTypes,
        "dragDrop" : ariaUtilsDragdropDragDropBean,
        "widgets" : ariaWidgetsCfgBeans
    },
    $description : "",
    $beans : {
        "AppCfg" : {
            $type : "json:Object",
            $description : "",
            $restricted : false,
            $properties : {
                "widgetSettings" : {
                    $type : "WidgetSettingsCfg",
                    $description : "Default widget settings for the application",
                    $default : {}
                }
            }
        },
        "WidgetSettingsCfg" : {
            $type : "json:Object",
            $description : "Global settings for widgets",
            $properties : {
                "directOnBlurValidation" : {
                    $type : "json:Boolean",
                    $description : "Whether validation on input widgets is automatically called by default on blur.",
                    $default : true
                },
                "autoselect" : {
                    $type : "json:Boolean",
                    $description : "Specifies whether display text should be highlighted when the field is clicked.",
                    $default : false
                },
                "middleAlignment" : {
                    $type : "json:Boolean",
                    $description : "Specifies whether the widgets should be middle-aligned vertically.",
                    $default : true
                },
                "dialog" : {
                    $type : "json:Object",
                    $description : "Default values for Dialog widget configuration.",
                    $properties : {
                        "movable" : {
                            $type : "json:Boolean",
                            $description : "If true, the dialog can be moved.",
                            $default : false
                        },
                        "movableProxy" : {
                            $type : "dragDrop:ProxyCfg",
                            $description : "Specifies the type of proxy for the dialog motion."
                        }
                    },
                    $default : {}
                },
                "defaultErrorMessages" : {
                    $type : "json:Object",
                    $description : "Default values for widgets' error messages.",
                    $properties : {
                        "NumberField" : {
                            $type : "widgets:NumberFieldCfg.defaultErrorMessages",
                            $description : "Default values for NumberField's error messages."
                        },
                        "TimeField" : {
                            $type : "widgets:TimeFieldCfg.defaultErrorMessages",
                            $description : "Default values for TimeField's error messages."
                        },
                        "DateField" : {
                            $type : "widgets:DateFieldCfg.defaultErrorMessages",
                            $description : "Default values for DateField's error messages."
                        },
                        "AutoComplete" : {
                            $type : "widgets:AutoCompleteCfg.defaultErrorMessages",
                            $description : "Default values for AutoComplete's error messages."
                        }
                    },
                    $default : {}
                }
            }
        }
    }
});
