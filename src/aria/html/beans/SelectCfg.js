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
var ariaHtmlBeansElementCfg = require("./ElementCfg");
var ariaWidgetLibsCommonBeans = require("../../widgetLibs/CommonBeans");
var ariaTemplatesCfgBeans = require("../../templates/CfgBeans");


module.exports = Aria.beanDefinitions({
    $package : "aria.html.beans.SelectCfg",
    $description : "Configuration for Select widget.",
    $namespaces : {
        "json" : ariaCoreJsonTypes,
        "base" : ariaHtmlBeansElementCfg,
        "common" : ariaWidgetLibsCommonBeans,
        "html" : ariaTemplatesCfgBeans
    },
    $beans : {
        "Properties" : {
            $type : "base:Properties",
            $description : "Properties of a Select widget.",
            $properties : {
                "options" : {
                    $type : "json:Array",
                    $description : "List of the possible items that have to be proposed to the user",
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "An array defining the options",
                        $contentTypes : [{
                                    $type : "ListItemCfg",
                                    $description : "a set of value / label / attibutes"
                                }, {
                                    $type : "json:String",
                                    $description : "a string used both as label and value"
                                }]
                    },
                    $default : []
                },
                "bind" : {
                    $type : "base:Properties.bind",
                    $properties : {
                        "selectedIndex" : {
                            $type : "common:BindingRef",
                            $description : "Bi-directional binding on the selected index"
                        },
                        "value" : {
                            $type : "common:BindingRef",
                            $description : "Bi-directional binding on the selected value"
                        },
                        "disabled" : {
                            $type : "common:BindingRef",
                            $description : "Binding for the disabled attribute of the select element."
                        }
                    }
                }
            }
        },
        "ListItemCfg" : {
            $type : "json:Object",
            $description : "Option structure",
            // open configuration
            $restricted : false,
            $properties : {
                "value" : {
                    $type : "json:MultiTypes",
                    $description : "Internal value associated to the option - usually a language-independent code",
                    $mandatory : false,
                    $contentTypes : [{
                                $type : "json:Integer",
                                $description : ""
                            }, {
                                $type : "json:String",
                                $description : ""
                            }]
                },
                "label" : {
                    $type : "json:String",
                    $description : "Text to display to the user",
                    $mandatory : true
                },
                "attributes" : {
                    $type : "html:HtmlAttribute",
                    $description : "a list of attributes for the option tags"
                }
            }
        }
    }
});
