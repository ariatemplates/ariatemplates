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
 * Bean definitions that are either common to multiple areas of the framework, or are needed before dependencies are
 * loaded by the framework.
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.templates.environment.ImgUrlMappingCfgBeans",
    $description : "A definition of the JSON beans used to set the environment settings.",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "AppCfg" : {
            $type : "json:Object",
            $description : "Application environment variables",
            $restricted : false,
            $properties : {
                "imgUrlMapping" : {
                    $type : "json:FunctionRef",
                    $description : "Method to map img urls inside CSS templates.",
                    $default : null
                }
            }
        }
    }
});
