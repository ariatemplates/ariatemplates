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

(function () {
    var basePackage = "atplugins.lightWidgets";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.beanDefinitions({
        $package : "atplugins.lightWidgets.autocomplete.AutocompleteCfgBeans",
        $description : "Configuration for the light autocomplete widget.",
        $namespaces : {
            "json" : "aria.core.JsonTypes",
            "base" : "aria.html.beans.TextInputCfg"
        },
        $beans : {
            "Properties" : {
                $type : "base:Properties",
                $description : "Properties of a Text Input widget.",
                $properties : {
                    "preselect" : {
                        $type : "json:Enum",
                        $enumValues : ["strict", "always", "none"],
                        $description : "strict: for strict highlighting (exact match only), always: for selecting the first item everytime, none: for no highlighting",
                        $default : "strict"
                    },
                    "suggestionsTemplate" : {
                        $type : "json:PackageName",
                        $description : "Template to use to display the list."
                    },
                    "lazy" : {
                        $type : "json:Boolean",
                        $description : "Whether the dependencies of the dropdown should be loaded at widget initialization or the first time it is needed.",
                        $default : false
                    },
                    "resourcesHandler" : {
                        $type : "json:MultiTypes",
                        $description : "",
                        $contentTypes : [{
                                    $type : "json:PackageName",
                                    $description : "Classpath of the resources handler"
                                }, {
                                    $type : "json:ObjectRef",
                                    $description : "Instance of a resources handler"
                                }],
                        $mandatory : true
                    },
                    "sclass" : {
                        $type : "json:String",
                        $description : "skin class for the autocomplete",
                        $default : "std"
                    }
                }
            }
        }
    });
})();