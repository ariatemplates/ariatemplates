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
        $package : "atplugins.lightWidgets.DropDownCfgBeans",
        $description : "Configuration for DropDown constructor.",
        $namespaces : {
            "json" : "aria.core.JsonTypes"
        },
        $beans : {
            "Configuration" : {
                $type : "json:Object",
                $description : "Configuration for a dropdown.",
                $restricted : false,
                $properties : {
                    "context" : {
                        $type : "json:ObjectRef",
                        $description : "The instance of aria.templates.TemplateCtxt in which the DropDown lives.",
                        $mandatory : true
                    },
                    "lineNumber" : {
                        $type : "json:Integer",
                        $description : "LineNumber line number in the template. Useful if instances of other widgets have to be created."
                    },
                    "domReference" : {
                        $type : "json:Object",
                        $description : "HTMLElement that should be used as a reference to display the popup.",
                        $mandatory : true
                    },
                    "ignoreClicksOn" : {
                        $type : "json:Array",
                        $description : "Array of HTMLElements. The popup should not close when one of the leemnts are clicked.",
                        $contentType : {
                            $type : "json:ObjectRef",
                            $description : "(HTMLElement)"
                        },
                        $default : [{}]
                    }
                }
            }
        }
    });
})();