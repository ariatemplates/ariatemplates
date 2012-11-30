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
 * Bean definitions that are either common to multiple areas of the framework, or are needed before dependencies are
 * loaded by the framework.
 */
Aria.beanDefinitions({
    $package : "aria.modules.urlService.environment.UrlServiceCfgBeans",
    $description : "A definition of the JSON beans used to set the environment settings.",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "AppCfg" : {
            $type : "json:Object",
            $description : "Application environment variables",
            $restricted : false,
            $properties : {
                "urlService" : {
                    $type : "UrlServiceCfg",
                    $description : "Default URL creation strategy configuration",
                    $default : {
                        implementation : 'aria.modules.urlService.PatternURLCreationImpl',
                        args : ["${moduleName}/${actionName}", "${moduleName}"]
                    }
                }
            }
        },
        "UrlServiceCfg" : {
            $type : "json:Object",
            $description : "Settings related to the URL creation strategy",
            $properties : {
                "implementation" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the URL creation strategy implementation",
                    $default : null
                },
                "args" : {
                    $type : "json:Array",
                    $description : "Arguments passed to the implementation's constructor",
                    $default : [],
                    $contentType : {
                        $type : "json:String",
                        $description : "Base URL used for pattern replacement"
                    }
                }
            }
        }
    }
});
