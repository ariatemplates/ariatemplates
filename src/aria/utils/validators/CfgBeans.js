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
 * Beans describing the message structure used in validators, in the error list widget, and returned in server side
 * validation.
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.utils.validators.CfgBeans",
    $description : "Beans used in validators and in the error widget.",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "MessagesList" : {
            $type : "json:Array",
            $description : "List of messages.",
            $contentType : {
                $type : "Message"
            }
        },
        "Message" : {
            $type : "json:Object",
            $description : "Structure to store a message to be displayed to the user, with type, code, localized message, optional sub-messages...",
            $properties : {
                type : {
                    $type : "json:String",
                    $description : "Type of message, may be aria.utils.Data.TYPE_WARNING, aria.utils.Data.TYPE_ERROR or aria.utils.Data.TYPE_INFO. Other types are accepted as well.",
                    $default : "E"
                },
                localizedMessage : {
                    $type : "json:String",
                    $mandatory : true,
                    $description : "Message in user language."
                },
                escape : {
                    $default : "true",
                    $description : "The parameter to pass to the aria.utils.String.escapeForHTML method (please refer to it for more information). This can be used to disable the automatic escaping or refine its configuration inside the default template which is used by the widget to display the messages. This is up to the user to use this information in case he provides a custom template."
                },
                code : {
                    $type : "json:String",
                    $mandatory : false,
                    $description : "Language-independent error code."
                },
                fieldRef : {
                    $type : "json:String",
                    $mandatory : false,
                    $description : "Path to a value in the data model which the message refers to."
                },
                metaDataRef : {
                    $type : "json:ObjectRef",
                    $mandatory : false,
                    $description : "Reference to the meta-data structure of the value in the data model which the message refers to."
                },
                subMessages : {
                    $type : "MessagesList",
                    $mandatory : false,
                    $description : "List of messages which describe in more details this message."
                }
            }
        }
    }
});
