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
var ariaTemplatesCfgBeans = require("../templates/CfgBeans");


/**
 * Configuration Beans associated to the Aria Templates Widgets
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.embed.CfgBeans",
    $description : "Definition of the JSON beans used by the aria embed lib",
    $namespaces : {
        "json" : ariaCoreJsonTypes,
        "html" : ariaTemplatesCfgBeans
    },
    $beans : {
        "ElementCfg" : {
            $type : "json:Object",
            $description : "Embed element widget",
            $properties : {
                "controller" : {
                    $type : "json:ObjectRef",
                    $description : "Controller used to manage the embedded dom"
                },
                "type" : {
                    $type : "json:String",
                    $description : "DOM type for this section.",
                    $default : "div"
                },
                "attributes" : {
                    $type : "html:HtmlAttribute",
                    $description : "Parameters to apply to the DOM element of the section."
                },
                "args" : {
                    $type : "json:MultiTypes",
                    $description : "Argument given to the onEmbeddedElementCreate and onEmbeddedElementDispose functions of the provided embed controller"
                }
            }
        },
        "PlaceholderCfg" : {
            $type : "json:Object",
            $description : "Placeholder",
            $properties : {
                "name" : {
                    $type : "json:String",
                    $description : "Placeholder name",
                    $mandatory : true
                },
                "type" : {
                    $type : "json:String",
                    $description : "DOM type for this section.",
                    $default : "div"
                },
                "attributes" : {
                    $type : "html:HtmlAttribute",
                    $description : "Parameters to apply to the DOM element of the section."
                }
            }
        },
        "MapCfg" : {
            $type : "json:Object",
            $description : "Map widget configuration",
            $properties : {
                "id" : {
                    $type : "json:String",
                    $description : "Id of the map",
                    $mandatory : true
                },
                "provider" : {
                    $type : "json:String",
                    $description : "Map provider",
                    $mandatory : true
                },
                "initArgs" : {
                    $type : "json:MultiTypes",
                    $description : "Map initialization arguments"
                },
                "loadingIndicator" : {
                    $type : "json:Boolean",
                    $description : "Add a loading overlay over the map while loading",
                    $default : false
                },
                "type" : {
                    $type : "json:String",
                    $description : "DOM type for this section.",
                    $default : "div"
                },
                "attributes" : {
                    $type : "html:HtmlAttribute",
                    $description : "Parameters to apply to the DOM element of the section."
                }
            }
        }
    }
});
