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
                    $description : "Any label key for suggestions",
                    $sample : "myLabel",
                    $default : "label"
                },
                "codeKey" : {
                    $type : "json:String",
                    $description : "Any code key for suggestions",
                    $sample : "myCode",
                    $default : "code"
                },
                "sortingMethod" : {
                    $type : "json:FunctionRef",
                    $description : "A function for sorting the suggestions list. If specified, when the array of suggestions is prepared, the native Array sort method is called and the sorting function is provided as a parameter. Hence, the sorting function receives two suggestions as arguments and has to return a negative number, 0 or a positive number if the first suggestion has to be considered respectively \"smaller\", \"equal\" or \"greater\" than the second one"
                },
                "codeExactMatch" : {
                    $type : "json:Boolean",
                    $description : "If code has to be matched exactly to return the suggestion",
                    $default : false
                },
                "labelMatchAtWordBoundaries" : {
                    $type : "json:Boolean",
                    $description : "Whether to try starting the search for the match on all word boundaries in the multi-word label, or only from the beginning of the label",
                    $default : false
                },
                "threshold" : {
                    $type : "json:Integer",
                    $description : "Minimum number of letters typed to return suggestions",
                    $default : 1
                }
            }
        }
    }
});
