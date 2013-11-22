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
 * Configuration Beans that can be shared among different widget libraries
 */
Aria.beanDefinitions({
    $package : "aria.widgetLibs.CommonBeans",
    $description : "Configuration Beans that can be shared among different widget libraries",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Callback" : {
            $type : "json:MultiTypes",
            $description : "Description of a function to call with its scope and parameters.",
            $contentTypes : [{
                $type : "json:Object",
                $description : "Structure describing the function to call-back",
                $properties : {
                    "fn" : {
                        $type : "FunctionName",
                        $description : "Function to call back"
                    },
                    "scope" : {
                        $type : "json:ObjectRef",
                        $description : "Reference to the object that should be referred as 'this' in the callback function"
                    },
                    "args" : {
                        $type : "json:MultiTypes",
                        $description : "Optional argument of the callback function - allows to pass some contextual state information"
                    }
                }
            }, {
                $type : "FunctionName",
                $description : "Function to call back. This function will be called with no parameter and with the template as its scope."
            }]
        },
        "FunctionName" : {
            $type : "json:MultiTypes",
            $description : "Either the name of a function in a string or a direct reference to it.",
            $contentTypes : [{
                $type : "json:String",
                $description : "Name of the function. This function should be defined on the scope defined for the callback, or in the template if the scope is not specified."
            }, {
                $type : "json:FunctionRef",
                $description : "Reference to the function"
            }]
        },
        "BindingRef" : {
            $type : "json:Object",
            $description : "Description of a Binding",
            $properties : {
                "to" : {
                    $type : "json:JsonProperty",
                    $description : "Name of the JSON property to bind to"
                },
                "inside" : {
                    $type : "json:ObjectRef",
                    $description : "Reference to the object that holds the property to bind to"
                },
                "transform" : {
                    $type : "TransformRef",
                    $description : "Reference to the object specifying the 2 transformation functions"
                }
            }
        },
        "TransformRef" : {
            $type : "json:MultiTypes",
            $description : "Description of a 1 or 2 function transform",
            $contentTypes : [{
                        $type : "json:Object",
                        $description : "",
                        $properties : {
                            "toWidget" : {
                                $type : "FunctionName",
                                $description : "1-parameter function converting the value TO the widget"
                            },
                            "fromWidget" : {
                                $type : "FunctionName",
                                $description : "1-parameter function converting the value FROM the widget"
                            }
                        }
                    }, {
                        $type : "FunctionName",
                        $description : "1 function transform"
                    }]
        }
    }
});
