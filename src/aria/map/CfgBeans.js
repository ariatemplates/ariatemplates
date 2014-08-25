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
var Aria = require("../Aria");
var ariaCoreJsonTypes = require("../core/JsonTypes");
var ariaCoreCfgBeans = require("../core/CfgBeans");


/**
 * @class aria.templates.CfgBeans
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.map.CfgBeans",
    $description : "Definition of beans used for Maps",
    $namespaces : {
        "json" : ariaCoreJsonTypes,
        "core" : ariaCoreCfgBeans
    },
    $beans : {
        "MapCfg" : {
            $type : "json:Object",
            $description : "Configuration object passed to a Map Provider to create a map",
            $properties : {
                "id" : {
                    $type : "json:String",
                    $description : "unique id of the map",
                    $mandatory : true
                },
                "domElement" : {
                    $type : "json:ObjectRef",
                    $description : "HTML Element in which the map will be created",
                    $mandatory : true
                },
                "initArgs" : {
                    $type : "json:MultiTypes",
                    $description : "Arguments that will be used to create the actual map instance",
                    $default : {}
                }
            }
        },

        "CreateMapCfg" : {
            $type : "MapCfg",
            $description : "Configuration object passed to the Map Manager to create a map",
            $properties : {
                "provider" : {
                    $type : "json:String",
                    $description : "Map provider. It can be an alias for a classpath that was already added to the MapManager, or a classpath",
                    $mandatory : true
                },
                "afterCreate" : {
                    $type : "core:Callback",
                    $description : "Callback called after the map is created, It receives the map instance as first argument"
                }
            }
        }
    }
});
