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
 * Definition of the suggestions used in the MultiAutoComplete Handler
 * @class aria.resources.handlers.MultiAutoCompleteHandlerBean
 */
Aria.beanDefinitions({
    $package : "aria.resources.handlers.LCRangeResourceHandlerBean",
    $description : "Definition of the suggestions used in the MultiAutoComplete resource handler",
    $namespaces : {
        "base" : "aria.resources.handlers.LCResourcesHandlerBean",
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Configuration" : {
            $type : "base:Configuration",
            $description : "Configuration Object for Suggestions with range of values",
            $restricted : false,
            $properties : {
                "allowRangeValues" : {
                    $type : "json:Boolean",
                    $description : "To add range of values",
                    $default : false
                }
            }
        }
    }
});