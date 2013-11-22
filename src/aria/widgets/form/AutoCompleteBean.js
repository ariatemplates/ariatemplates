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
    $package : "aria.widgets.form.AutoCompleteBean",
    $description : "Definition of the suggestions used in the autocomplete",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Suggestion" : {
            $type : "json:Object",
            $description : "A Label-Code suggestion",
            $properties : {
                "exactMatch" : {
                    $type : "json:Boolean",
                    $description : "is this entry an exact match in the suggestions",
                    $default : false
                }
            }
        }
    }
});
