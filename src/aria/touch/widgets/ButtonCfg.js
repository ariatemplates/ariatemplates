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
var ariaHtmlBeansElementCfg = require("../../html/beans/ElementCfg");
var ariaWidgetLibsCommonBeans = require("../../widgetLibs/CommonBeans");

module.exports = Aria.beanDefinitions({
    $package : "aria.touch.widgets.ButtonCfg",
    $description : "Configuration for Button widget.",
    $namespaces : {
        "json" : ariaCoreJsonTypes,
        "base" : ariaHtmlBeansElementCfg,
        "common" : ariaWidgetLibsCommonBeans
    },
    $beans : {
        "Properties" : {
            $type : "base:Properties",
            $description : "Properties of a Button widget.",
            $properties : {
                "on" : {
                    $type : "base:Properties.$properties.on",
                    $properties : {
                        "type" : {
                            $type : "common:Callback",
                            $description : "Callback called when the user interacts with the button."
                        }
                    }
                },
                "isLink" : {
                    $type : "json:Boolean",
                    $description : "Whether the button is a link, which means a different highlighting pattern.",
                    $default : false
                },
                "delay" : {
                    $type : "json:Integer",
                    $description : "delay between and tapstart event and highlighting of the link or button in milliseconds."
                },
                "tagName" : {
                    $type : "base:Properties.$properties.tagName",
                    $description : "Tag to be used for Button markup."
                }
            }
        }
    }
});
