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
 * Bean definitions associated to the JsonSerializer class
 * @class aria.utils.json.JsonSerializerBeans
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.utils.json.JsonSerializerBeans",
    $description : "Bean definitions associated to the JsonSerializer class",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "JsonSerializeOptions" : {
            $type : "json:Object",
            $description : "Options given as arguments to the serialize method of JsonSerializer class",
            $restricted : false,
            $properties : {
                "indent" : {
                    $type : "json:String",
                    $description : "string to use for indentation. \"\" for no indentation",
                    $default : "",
                    $regExp : /^[\s\t]*$/
                },
                "maxDepth" : {
                    $type : "json:Integer",
                    $description : "gives the maximum depth after which the conversion must stop (e.g. 1 to have only one level of children)",
                    $default : 100
                },
                "escapeKeyNames" : {
                    $type : "json:Boolean",
                    $description : "true if key names have to be surrounded by double quotes",
                    $default : true
                },
                "encodeParameters" : {
                    $type : "json:Boolean",
                    $description : "if true, parameters will be encoded using encodeURIcomponent()",
                    $default : false
                },
                "reversible" : {
                    $type : "json:Boolean",
                    $description : "If set to true, convertor will try to return an object that can be re-evaluated to its original value, otherwise it will return null",
                    $default : false
                },
                "serializedDatePattern" : {
                    $type : "json:String",
                    $description : "format for date serialization",
                    $default : "yyyy/MM/dd HH:mm:ss"
                }
            }
        },
        "JsonSerializeAdvancedOptions" : {
            $type : "JsonSerializeOptions",
            $description : "Enahnced JSON serialization options.",
            $restricted : false,
            $properties : {
                "baseIndent" : {
                    $type : "json:String",
                    $description : "base indentation to prepend to evert line"
                }
            }
        }
    }
});
