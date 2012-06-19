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

/**
 * Bean definitions for the Application configuration object for the aria.modules package
 */
Aria.beanDefinitions({
    $package : "aria.modules.environment.EnvironmentCfgBeans",
    $description : "A definition of the JSON beans used to set the environment settings.",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "AppCfg" : {
            $type : "json:Object",
            $description : "Application environment variables",
            $restricted : false,
            $properties : {
                "requestJsonSerializer" : {
                    $type : "RequestJsonSerializerCfg",
                    $description : "Default request handler configuration",
                    $default : {
                        options : {
                            encodeParameters : true,
                            keepMetadata : false
                        }
                    }
                }
            }
        },
        "RequestJsonSerializerCfg" : {
            $type : "json:Object",
            $description : "Settings related to the JSON serializer used to convert JSON data to a string before sending a request.",
            $properties : {
                "instance" : {
                    $type : "json:ObjectRef",
                    $description : "Instance of a class that implements a \"serialize\" method"
                },
                "options" : {
                    $type : "json:Map",
                    $description : "Argument passed to the \"serialize\" method of the serializer",
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "Option to pass as argument to the serialize method of the serializer"
                    },
                    $default : null
                }
            }
        }
    }
});
//BACKWARD COMPATIBILITY ONLY: PLEASE REMOVE