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
 * @class aria.ext.filesgenerator.GeneratorBeans
 */
Aria.beanDefinitions({
    $package : "aria.ext.filesgenerator.GeneratorBeans",
    $description : "Definition of the JSON beans used as input of the file skeleton generator",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "classSkeletonTemplate" : {
            $type : "json:Object",
            $description : "Input parameter to generate a class skeleton from a text template",
            $properties : {
                "$classpath" : {
                    $type : "json:String",
                    $description : "classpath of the class",
                    $default : "company.package.Class"
                },
                "$description" : {
                    $type : "json:String",
                    $description : "Description of the class",
                    $default : "The description of this class and how it should be used"
                },
                "$extends" : {
                    $type : "json:String",
                    $description : "The namespace of the extended class",
                    $default : "aria.core.JsObject"
                },
                "$singleton" : {
                    $type : "json:Boolean",
                    $description : "Whether the class is a singleton or not",
                    $default : false
                },
                "$dependencies" : {
                    $type : "json:Array",
                    $description : "The list of dependencies (namespaces) this class has",
                    $default : null,
                    $contentType : {
                        $type : "json:String",
                        $description : "Classpath of the dependency"
                    }
                },
                "$implements" : {
                    $type : "json:Array",
                    $description : "list of interfaces to be implemented",
                    $default : null,
                    $contentType : {
                        $type : "json:String",
                        $description : "Classpath of the interface"
                    }
                }
            }
        },
        "interfaceSkeletonTemplate" : {
            $type : "json:Object",
            $description : "Input parameter to generate an interface skeleton from a text template",
            $properties : {
                "$classpath" : {
                    $type : "json:String",
                    $description : "classpath of the interface",
                    $default : "company.package.IClass"
                },
                "$description" : {
                    $type : "json:String",
                    $description : "Description of the interface",
                    $default : "The description of this interface and how it should be implemented"
                },
                "$extends" : {
                    $type : "json:String",
                    $description : "The namespace of the extended interface",
                    $default : null
                }
            }
        },
        "htmlTemplateSkeletonTemplate" : {
            $type : "json:Object",
            $description : "Input parameter to generate an HTML template skeleton from a text template",
            $properties : {
                "$classpath" : {
                    $type : "json:String",
                    $description : "classpath of the template",
                    $default : "company.package.MyTemplate"
                },
                "$extends" : {
                    $type : "json:String",
                    $description : "The namespace of the extended class",
                    $default : null
                },
                "$hasScript" : {
                    $type : "json:Boolean",
                    $description : "whether the template has an associated script or not",
                    $default : false
                },
                "$css" : {
                    $type : "json:Array",
                    $description : "list of CSS templates to be applied to this HTML template",
                    $default : null,
                    $contentType : {
                        $type : "json:String",
                        $description : "Classpath of the CSS templates"
                    }
                },
                "content" : {
                    $type : "json:String",
                    $description : "Optional content of the template"
                }
            }
        },
        "cssTemplateSkeletonTemplate" : {
            $type : "json:Object",
            $description : "Input parameter to generate a CSS template skeleton from a text template",
            $properties : {
                "$classpath" : {
                    $type : "json:String",
                    $description : "classpath of the css template",
                    $default : "company.package.MyCssTemplate"
                },
                "$hasScript" : {
                    $type : "json:Boolean",
                    $description : "whether the css template has an associated script or not",
                    $default : false
                }
            }
        },
        "templateScriptSkeletonTemplate" : {
            $type : "json:Object",
            $description : "Input parameter to generate a template script skeleton from a text template",
            $properties : {
                "$classpath" : {
                    $type : "json:String",
                    $description : "classpath of the template script",
                    $default : "company.package.MyTemplateScript"
                }
            }
        },
        "macroLibrarySkeletonTemplate" : {
            $type : "json:Object",
            $description : "Input parameter to generate a template script skeleton from a text template",
            $properties : {
                "$classpath" : {
                    $type : "json:String",
                    $description : "classpath of the template script",
                    $default : "company.package.MyTemplateScript"
                },
                "$hasScript" : {
                    $type : "json:Boolean",
                    $description : "whether the macro lib has an associated script or not",
                    $default : false
                }
            }
        },
        "flowControllerSkeletonTemplate" : {
            $type : "json:Object",
            $description : "Input parameter to generate a flow controller skeleton from a text template",
            $properties : {
                "$classpath" : {
                    $type : "json:String",
                    $description : "classpath of the flow controller",
                    $default : "company.package.MyFlowController"
                },
                "$description" : {
                    $type : "json:String",
                    $description : "Description of the class",
                    $default : "The description of this flow controller implementation"
                },
                "$publicInterface" : {
                    $type : "json:String",
                    $description : "The classpath of the public interface of this flow controller",
                    $default : "company.package.IMyFlowController"
                },
                "$implements" : {
                    $type : "json:Array",
                    $description : "list of other interfaces to be implemented",
                    $default : [],
                    $contentType : {
                        $type : "json:String",
                        $description : "Classpath of the interface"
                    }
                },
                "$extends" : {
                    $type : "json:String",
                    $description : "The namespace of the extended class",
                    $default : "aria.templates.FlowCtrl"
                },
                "$dependencies" : {
                    $type : "json:Array",
                    $description : "The list of dependencies (namespaces) this flow controller class has",
                    $default : null,
                    $contentType : {
                        $type : "json:String",
                        $description : "Classpath of the dependency"
                    }
                }
            }
        },
        "moduleControllerSkeletonTemplate" : {
            $type : "json:Object",
            $description : "Input parameter to generate a module controller skeleton from a text template",
            $properties : {
                "$classpath" : {
                    $type : "json:String",
                    $description : "classpath of the module controller",
                    $default : "company.package.MyModuleController"
                },
                "$publicInterface" : {
                    $type : "json:String",
                    $description : "The classpath of the public interface of this module controller",
                    $default : "company.package.IMyModuleController"
                },
                "$implements" : {
                    $type : "json:Array",
                    $description : "list of other interfaces to be implemented",
                    $default : [],
                    $contentType : {
                        $type : "json:String",
                        $description : "Classpath of the interface"
                    }
                },
                "$extends" : {
                    $type : "json:String",
                    $description : "The namespace of the extended class",
                    $default : "aria.templates.ModuleCtrl"
                },
                "$description" : {
                    $type : "json:String",
                    $description : "Description of the class",
                    $default : "The description of this module controller implementation"
                },
                "$dependencies" : {
                    $type : "json:Array",
                    $description : "The list of dependencies (namespaces) this module controller class has",
                    $default : null,
                    $contentType : {
                        $type : "json:String",
                        $description : "Classpath of the dependency"
                    }
                },
                "$hasFlowCtrl" : {
                    $type : "json:Boolean",
                    $description : "Whether the module controller has an associated flow controller.",
                    $default : false
                }
            }
        },
        "moduleControllerInterfaceSkeletonTemplate" : {
            $type : "interfaceSkeletonTemplate",
            $description : "Input parameter to generate a module controller interface skeleton from a text template"
        },
        "flowControllerInterfaceSkeletonTemplate" : {
            $type : "interfaceSkeletonTemplate",
            $description : "Input parameter to generate a flow controller interface skeleton from a text template"
        },
        "bootstrapSkeletonTemplate" : {
            $type : "json:Object",
            $description : "Input parameter to generate a bootstrap skeleton from a text template",
            $properties : {
                "$classpath" : {
                    $type : "json:String",
                    $description : "classpath of the template",
                    $default : "company.package.MyTemplate"
                },
                "$fwkpath" : {
                    $type : "json:String",
                    $description : "classpath of the framework script"
                },
                "$fwkskin" : {
                    $type : "json:String",
                    $description : "classpath of the skin script"
                },
                "$moduleCtrl" : {
                    $type : "json:String",
                    $description : "classpath of the module controller",
                    $default : null
                }
            }
        }
    }
});