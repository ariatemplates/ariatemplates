/*
 * Copyright 2017 Amadeus s.a.s.
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
    $package : "app.SampleBean",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Tree" : {
            $type : "json:Object",
            $properties : {
                "value1" : {
                    $type : "json:Integer",
                    $default : 3
                },
                "subTrees" : {
                    $type : "json:Array",
                    $default : [],
                    $contentType : {
                        $type : "Tree"
                    }
                },
                "value2" : {
                    $type : "json:Integer",
                    $default : 7
                },
                "structure" : {
                    $type : "json:Object",
                    $default : {
                        value4 : 50
                    },
                    $properties : {
                        "value3" : {
                            $type : "json:Integer",
                            $default : 12
                        },
                        "value4" : {
                            $type : "json:Integer",
                            $default : 70
                        }
                    }
                }
            }
        }
    }
});