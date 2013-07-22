/*
 * Copyright 2012 Amadeus s.a.s. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

Aria.beanDefinitions({
    $package : "aria.html.beans.RadioButtonCfg",
    $description : "Configuration for RadioButton widget.",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "base" : "aria.html.beans.InputElementCfg",
        "common" : "aria.widgetLibs.CommonBeans"
    },
    $beans : {
        "Properties" : {
            $type : "base:Properties",
            $description : "Properties of a RadioButton widget.",
            $properties : {
                "value" : {
                    $type : "json:String",
                    $description : "The value associated with the radio button."
                },
                "bind" : {
                    $type : "base:Properties.$properties.bind",
                    $properties : {
                        "selectedValue" : {
                            $type : "common:BindingRef",
                            $description : "Bi-directional binding."
                        }
                    }
                }
            }
        }
    }
});
