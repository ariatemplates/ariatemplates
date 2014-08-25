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
 * Describe the data model of the error list widget.
 * @class aria.widgets.errorlist.CfgBeans
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.widgets.errorlist.CfgBeans",
    $description : "Data model of the error list widget.",
    $namespaces : {
        // "validators" : "aria.validators.CfgBeans",
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "Model" : {
            $type : "json:Object",
            $description : "Root of the data model for the error list widget.",
            $mandatory : true,
            $properties : {
                "title" : {
                    $type : "json:String",
                    $description : "Title for the list of messages."
                },
                "displayCodes" : {
                    $type : "json:Boolean",
                    $description : "True if message codes should be displayed along with localized messages."
                },
                "messages" : {
                    // $type : "validators:MessagesList",
                    $type : "json:ObjectRef",
                    $description : "List of messages, with the structure described in aria.utils.validators.CfgBeans.MessagesList.",
                    $mandatory : true
                },
                "filterTypes" : {
                    $type : "json:Array",
                    $description : "If not null, specifies the types of messages which should be displayed in the widget. It must match the type property in aria.utils.validators.CfgBeans.Message.",
                    $default : null,
                    $contentType : {
                        $type : "json:String",
                        $description : "Type of message.",
                        $mandatory : true
                    },
                    $sample : ["F", "E"]
                },
                "divCfg" : {
                    $type : "json:ObjectRef",
                    $mandatory : true,
                    $description : "Configuration to give to the @aria:Div widget surrounding the messages (if necessary)."
                },
                "messageTypes" : {
                    $type : "json:Map",
                    $description : "Map giving for each type of message present in the messages property the number of messages of that type in the messages property.",
                    $contentType : {
                        $type : "json:Integer",
                        $description : "Number of messages of the corresponding type in the messages property.",
                        $minValue : 0
                    }
                }
            }
        }
    }
});
