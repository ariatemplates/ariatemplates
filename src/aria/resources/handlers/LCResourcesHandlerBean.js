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
 * Definition of the suggestions used in the LC resource handler
 * @class aria.resources.handlers.LCResourcesHandlerBean
 */
Aria.beanDefinitions({
    $package : "aria.resources.handlers.LCResourcesHandlerBean",
    $description : "Definition of the suggestions used in the LC resource handler",
    $namespaces : {
        "base" : "aria.widgets.form.AutoCompleteBean",
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Suggestion" : {
            $type : "base:Suggestion",
            $description : "A Label-Code suggestion",
            $restricted : false,
            $properties : {
                "label" : {
                    $type : "json:String",
                    $description : "label for this suggestion",
                    $sample : "Paris",
                    $mandatory : true
                },
                "code" : {
                    $type : "json:String",
                    $description : "A code matching this suggestion",
                    $sample : "PAR"
                }
            }
        },
        "Configuration" : {
            $type : "json:Object",
            $description : "Configuration Object for Suggestions",
            $restricted : false,
            $properties : {
                "labelKey" : {
                    $type : "json:String",
                    $description : "Any label key for suggetions",
                    $sample : "myLabel",
                    $default : "label"
                },
                "codeKey" : {
                    $type : "json:String",
                    $description : "Any code key for suggetions",
                    $sample : "myCode",
                    $default : "code"
                },
                "sortingMethod" : {
                    $type : "json:FunctionRef",
                    $description : "An anonymous function for sorting the suggestions list"
                },
                "codeExactMatch" : {
                    $type : "json:Boolean",
                    $description : "code has to be matched exactly to return the suggestion",
                    $default : false
                },
                "threshold" : {
                    $type : "json:Integer",
                    $description : "Minimum number of letter to return suggestions",
                    $default : 1
                }
            }
        }
    }
});