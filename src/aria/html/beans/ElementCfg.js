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
    $package : "aria.html.beans.ElementCfg",
    $description : "Base configuration for Element widget.",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "html" : "aria.templates.CfgBeans"
    },
    $beans : {
        "Properties" : {
            $type : "json:Object",
            $description : "All properties that can be used in Element widget.",
            $properties : {
                "tagName" : {
                    $type : "json:String",
                    $description : "Qualified name of the Element node",
                    $sample : "div",
                    $mandatory : true
                },
                "attributes" : {
                    $type : "html:HtmlAttribute",
                    $default : {}
                },
                "bind" : {
                    $type : "json:Object",
                    $description : "List of properties that can be bound to this widget. Values should match bean aria.widgetLibs.CommonBeans.BindRef",
                    $default : {},
                    $restricted : false
                },
                "on" : {
                    $type : "json:Object",
                    $description : "List of registered events and their callbacks. Values should match bean aria.widgetLibs.CommonBeans.Callback",
                    $default : {},
                    $restricted : false
                }
            },
            $restricted : false
        }
    }
});
