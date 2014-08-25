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


/**
 * Bean definition containing default settings for the WidgetLibs environment.
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.widgetLibs.environment.WidgetLibsSettingsCfgBeans",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $description : "",
    $beans : {
        "AppCfg" : {
            $type : "json:Object",
            $description : "",
            $restricted : false,
            $properties : {
                "defaultWidgetLibs" : {
                    $type : "json:Map",
                    $description : "Widget libraries to be available by default in all templates. The key in the map is the prefix used inside the template to refer to that widget library. The value is the classpath of the library. The settings in the environment can be overridden in templates if the same key is used. See also the $wlibs property of the {Template} statement in aria.templates.CfgBeans.TemplateCfg.$wlibs.",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the widget library."
                    },
                    $default : {
                        "aria" : "aria.widgets.AriaLib"
                    }
                }
            }
        }
    }
});
