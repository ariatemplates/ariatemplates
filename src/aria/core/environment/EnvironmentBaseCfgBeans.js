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
    $package : "aria.core.environment.EnvironmentBaseCfgBeans",
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
                "appSettings" : {
                    $type : "AppSettingsCfg",
                    $description : "Default application settings for the application",
                    $default : {}
                },

                "language" : {
                    $type : "LanguageCfg",
                    $description : "Default language for the application",
                    $default : {
                        "primaryLanguage" : "en",
                        "region" : "US"
                    }
                },

                "templateSettings" : {
                    $type : "TemplateSettingsCfg",
                    $description : "Default templating engine settings",
                    $default : {}
                }
            }
        },

        "AppSettingsCfg" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "devMode" : {
                    $type : "json:Boolean",
                    $description : "Indicates if the application is in development mode. Useful i.e. for resource manager - if set to true static RES files will be used instead of requesting them from the server",
                    $default : false
                },
                "debug" : {
                    $type : "json:Boolean",
                    $description : "Indicates if the application is in debug state (strong validation, more error reporting).",
                    $default : Aria.debug
                }
            }

        },

        "LanguageCfg" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "primaryLanguage" : {
                    $type : "json:String",
                    $description : "Primary language (i.e 'en' in 'en_US')",
                    $mandatory : true,
                    $regExp : /^[a-z]{2}$/
                },
                "region" : {
                    $type : "json:String",
                    $description : "Region (i.e US in en_US)",
                    $mandatory : true,
                    $regExp : /^[A-Z]{2}$/
                }
            }

        },

        "TemplateSettingsCfg" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "escapeHtmlByDefault" : {
                    $type : "json:Boolean",
                    $description : "Indicates if markup should be automatically escaped in ${} statements",
                    $default : true
                },
                "escapeHtmlByDefaultPerPackage" : {
                    $type : "json:Map",
                    $description : "Allows to specify a different value of escapeHtmlByDefault depending on the package to which the template belongs. The key in the map is a package classpath. The value is the setting of escapeHtmlByDefault for that package. If different values are specified for nested packages, the value for the most specific package for a template is used.",
                    $contentType : {
                        $type : "json:Boolean",
                        $description : "Value of escapeHtmlByDefault for the package."
                    }
                }
            }
        },

        "FormatTypes" : {
            $type : "json:MultiTypes",
            $description : "",
            $contentTypes : [{
                        $type : "json:String",
                        $description : "..."
                    }, {
                        $type : "json:FunctionRef",
                        $description : "..."
                    }]

        },
        "inputFormatTypes" : {
            $type : "json:MultiTypes",
            $description : "",
            $contentTypes : [{
                $type : "json:String",
                $description : "A pattern to be used for user input matching. For instance yyyy*MM*dd, * represents the separator, it can be any character except numeric"
            }, {
                $type : "json:FunctionRef",
                $description : "A user-defined function used to parse the input in a JavaScript date."
            }, {
                $type : "json:Array",
                $description : "Contains an array of patterns and/or functions",
                $contentType : {
                    $type : "json:MultiTypes",
                    $description : "",
                    $contentTypes : [{
                                $type : "json:String",
                                $description : "..."
                            }, {
                                $type : "json:FunctionRef",
                                $description : "..."
                            }]
                }
            }]
        }

    }
});
