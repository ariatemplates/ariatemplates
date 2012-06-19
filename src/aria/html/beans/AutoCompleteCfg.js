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

Aria.beanDefinitions({
    $package : "aria.html.beans.AutoCompleteCfg",
    $description : "Configuration for AutoComplete widget.",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "input" : "aria.html.beans.TextInputCfg"
    },
    $beans : {
        "Properties" : {
            $type : "input:Properties",
            $description : "Properties of an AutoComplete widget.",
            $properties : {
                "bind" : {
                    $type : "input:Properties.bind",
                    $properties : {
                        "suggestions" : {
                            $type : "json:Array",
                            $description : "List of suggestions taken from the Resources Handler",
                            $contentType : {
                                $type : "json:Object",
                                $description : "Suggestion"
                            },
                            $default : []
                        }
                    }
                }
            }
        }
    }
});