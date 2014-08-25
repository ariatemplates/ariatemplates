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
var Aria = require("../../../Aria");
var ariaCoreJsonTypes = require("../../../core/JsonTypes");


/**
 * Bean definitions that are either common to multiple areas of the framework, or are needed before dependencies are
 * loaded by the framework.
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.modules.requestHandler.environment.RequestHandlerCfgBeans",
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
                "requestHandler" : {
                    $type : "RequestHandlerCfg",
                    $description : "Default request handler configuration",
                    $default : {
                        implementation : 'aria.modules.requestHandler.JSONRequestHandler'
                    }
                },
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
        "RequestHandlerCfg" : {
            $type : "json:Object",
            $description : "Settings related to the request handler used by the request manager by default",
            $properties : {
                "implementation" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the URL creation strategy implementation",
                    $default : null
                },
                "args" : {
                    $type : "json:ObjectRef",
                    $description : "Arguments passed to the implementation's constructor"

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
