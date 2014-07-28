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
        $package : "atplugins.lightWidgets.datefield.DateFieldCfgBeans",
        $description : "Configuration for the light datefield widget.",
        $namespaces : {
            "json" : "aria.core.JsonTypes",
            "base" : "aria.html.beans.TextInputCfg"
        },
        $beans : {
            "Properties" : {
                $type : "base:Properties",
                $description : "Properties of a Text Input widget.",
                $properties : {
                    "tagName" : {
                        $type : "base:Properties.$properties.tagName",
                        $description : "Automatically set to input by the framework. It cannot be overridden in the configuration.",
                        $default : "input",
                        $mandatory : false
                    },
                    "pattern" : {
                        $type : "json:String",
                        $description : "Date pattern used to propose a best value for the date entry",
                        $default : "d/M/y"
                    },
                    "minValue" : {
                        $type : "json:Date",
                        $description : "Minimum date for the value property."
                    },
                    "maxValue" : {
                        $type : "json:Date",
                        $description : "Maximum date for the value property."
                    }
                }
            }
        }
    });
})();