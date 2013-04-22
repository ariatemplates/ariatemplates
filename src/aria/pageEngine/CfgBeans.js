/**
 * Beans to describe the parameters used in aria.pageEngine
 */
Aria.beanDefinitions({
    $package : "aria.pageEngine.CfgBeans",
    $description : "Definition of the beans used in aria.pageEngine",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "core" : "aria.core.CfgBeans"
    },
    $beans : {
        "ExtendedCallback" : {
            $type : "json:Object",
            $description : "Contains a callback for success and a callback for failure.",
            $properties : {
                "onsuccess" : {
                    $type : "core:Callback",
                    $description : "Callback to be called in case of success."
                },
                "onfailure" : {
                    $type : "core:Callback",
                    $description : "Callback to be called in case of failure."
                }
            }
        },
        "Start" : {
            $type : "json:Object",
            $description : "Configuration object for the Page Engine's start method.",
            $properties : {
                "pageProvder" : {
                    $type : "json:Object",
                    $description : "Instance of class that implements aria.pageEngine.pageProviders.PageProviderInterface.",
                    $mandatory : true
                },
                "onerror" : {
                    $type : "core:Callback",
                    $description : "Callback in case of error while starting the Page Engine."
                },
                "oncomplete" : {
                    $type : "core:Callback",
                    $description : "Callback for the correct start of the Page Engine."
                }
            }
        },
        "Site" : {
            $type : "json:Object",
            $description : "Site configuration.",
            $restricted : false,
            $properties : {
                "containerId" : {
                    $type : "json:String",
                    $description : "Id of the HTML element inside which the application will be loaded.",
                    $mandatory : true
                },
                "commonModules" : {
                    $type : "json:Map",
                    $description : "Map containing the common modules to load",
                    $contentType : {
                        $type : "CommonModule",
                        $description : "Common module description."
                    },
                    $default : {}
                },
                "appData" : {
                    $type : "json:Map",
                    $description : "Application data that will be available in the data model of the page engine, for example a menu.",
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "Any kind of value."
                    },
                    $default : {}
                },
                "contentProcessors" : {
                    $type : "json:Map",
                    $description : "Classes that handle different content types",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the class that is able to preprocess the content type specified in the key."
                    },
                    $default : {}
                },
                "navigation" : {
                    $type : "json:Enum",
                    $description : "Type of navigation from page to page",
                    $enumValues : ["history", "hash"]
                },
                "animations" : {
                    $type : "json:Boolean",
                    $description : "If true actives the animations during a page transition",
                    $default : false
                },
                "css" : {
                    $type : "json:Array",
                    $description : "List of global .css standard files to be added. They persist through page navigations.",
                    $contentType : {
                        $type : "json:String",
                        $description : "Path of the .css file"
                    }
                }
            }
        },
        "PageRequest" : {
            $type : "json:Object",
            $description : "Object accepted by the navigation method",
            $restricted : false,
            $properties : {
                "pageId" : {
                    $type : "json:String",
                    $description : "Identifier of the page."
                },
                "url" : {
                    $type : "json:String",
                    $description : "Part of the url that should be appended to the domain."
                }
            }
        },
        "PageNavigationInformation" : {
            $type : "PageRequest",
            $description : "Information that is given to the history manager",
            $restricted : false,
            $properties : {
                "replace" : {
                    $type : "json:Boolean",
                    $description : "Whether to replace or push the state. Only valid when the navigation type has been set to history in the site configuration."
                },
                "title" : {
                    $type : "json:String",
                    $description : "Title of the page. Only valid when the navigation type has been set to history in the site configuration."
                },
                "data" : {
                    $type : "json:Object",
                    $description : "State information to be saved. Only valid when the navigation type has been set to history in the site configuration."
                },
                "forceReload" : {
                    $type : "json:Boolean",
                    $description : "Tells whether the reload has to be done even the target pageId is the same as the current one."
                }
            }

        },
        "PageDefinition" : {
            $type : "json:Object",
            $description : "Defintion of a page required by the application manager.",
            $restricted : false,
            $properties : {
                "contents" : {
                    $type : "PageContents",
                    $description : "Contents for the current page",
                    $mandatory : true
                },
                "pageComposition" : {
                    $type : "PageComposition",
                    $description : "Page composition",
                    $mandatory : true
                },
                "pageId" : {
                    $type : "json:String",
                    $description : "Identifier of the page.",
                    $mandatory : true
                },
                "url" : {
                    $type : "json:String",
                    $description : "Part of the url that should be appended to the domain."
                },
                "title" : {
                    $type : "json:String",
                    $description : "Title of the page. Only used when the navigation type has been set to history in the site configuration."
                },
                "animation" : {
                    $type : "PageAnimation",
                    $description : "Animation for the page transition."
                }
            }
        },
        "PageContents" : {
            $type : "json:Object",
            $description : "Menus and HTML contents of a page.",
            $properties : {
                "menus" : {
                    $type : "json:Map",
                    $description : "List of menus descriptions",
                    $keyType : {
                        $type : "json:String",
                        $description : "Id of the menu"
                    },
                    $contentType : {
                        $type : "json:Object",
                        $description : "Single menu description",
                        $restricted : false
                    }
                },
                "placeholderContents" : {
                    $type : "json:Map",
                    $description : "Contents to be added in the placeholders",
                    $keyType : {
                        $type : "json:String",
                        $description : "ContentId's that are present in the pageComposition"
                    },
                    $contentType : {
                        $type : "Content"
                    }
                }
            }
        },
        "PageComposition" : {
            $type : "json:Object",
            $description : "Defintion of a page layout required by the application manager.",
            $properties : {
                /*"pageId" : {
                    $type : "json:String",
                    $description : "Page identifier"
                },*/
                "template" : {
                    $type : "json:String",
                    $description : "Template classpath used by the page.",
                    $mandatory : true
                },
                "pageData" : {
                    $type : "json:Object",
                    $description : "data to be used by the page (removed when the page change).",
                    $restricted : false,
                    $default : {}
                },
                "modules" : {
                    $type : "json:Map",
                    $description : "List of modules that are local to the page.",
                    $contentType : {
                        $type : "Module",
                        $description : "Description of each module."
                    },
                    $default : {}
                },
                "placeholders" : {
                    $type : "json:Map",
                    $description : "List of the placeholders that can be displayed on the page.",
                    $keyType : {
                        $type : "json:String",
                        $description : "path of the placeholder.",
                        $sample : "body.top"
                    },
                    $contentType : {
                        $type : "Placeholder"
                    },
                    $mandatory : true
                },
                "css" : {
                    $type : "json:Array",
                    $description : "List of page-specific .css standard files to be added.  These files are removed when leaving the page.",
                    $contentType : {
                        $type : "json:String",
                        $description : "Path of the .css file"
                    }
                }
            }
        },
        "PageAnimation" : {
            $type : "json:Object",
            $description : "Animation applied to the coming page and/or to the leaving page",
            $properties : {
                "animateOut" : {
                    $type : "json:Enum",
                    $description : "Animation to apply to the leaving page",
                    $sample : "slide left",
                    $enumValues : ["slide left", "slide right", "slide up", "slide down", "fade", "fade reverse", "pop", "pop reverse", "flip", "flip reverse"]
                },
                "animateIn" : {
                    $type : "json:Enum",
                    $description : "Animation to apply to the coming page",
                    $sample : "slide left",
                    $enumValues : ["slide left", "slide right", "slide up", "slide down", "fade", "fade reverse", "pop", "pop reverse", "flip", "flip reverse"],
                    $mandatory : true
                }
            }
        },
        "Placeholder" : {
            $type : "json:MultiTypes",
            $description : "Description of a placeholder.",
            $contentTypes : [{
                        $type : "json:String",
                        $description : "Html content"
                    }, {
                        $type : "json:Object",
                        $description : "Contains the template classpath, and the moduleId (optional) inn order to retrieve the module controller",
                        $properties : {
                            "template" : {
                                $type : "json:String",
                                $description : "template classpath"
                            },
                            "contentId" : {
                                $type : "json:String",
                                $description : "Id that is used to retrive the html content in the global content definition. If a template is present, the retrieved contents will be provided as last arguments of the main macro of the template"
                            },
                            "module" : {
                                $type : "json:String",
                                $description : "Id of the module controller that is used as a key inside the module map of the page definition. If prefixed by the 'common:', then the module "
                            },
                            "data" : {
                                $type : "json:Object",
                                $description : "Data model of the template. This is an alternative to the module property, as templates with a module controller inherit its data model."
                            },
                            "args" : {
                                $type : "json:Array",
                                $description : "Arguments to be passed t the main macro of the template. If a contentId is specified, the retrieved content will be automatically added to the arguments.",
                                $contentType : {
                                    $type : "json:MultiTypes",
                                    $description : "Anything."
                                }
                            },
                            "css" : {
                                $type : "json:Array",
                                $description : "List of .css standard files to be added for the placeholder. These files are removed when leaving the page",
                                $contentType : {
                                    $type : "json:String",
                                    $description : "Path of the .css file"
                                }
                            }
                        }
                    }, {
                        $type : "json:Array",
                        $contentType : {
                            $type : "Placeholder"
                        },
                        $description : "List of pieces of contents to be displayed."
                    }]
        },

        "Module" : {
            $type : "json:Object",
            $description : "Description of the module that is created at page level.",
            $properties : {
                "classpath" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the module controller.",
                    $mandatory : true
                },
                "initArgs" : {
                    $type : "json:ObjectRef",
                    $description : "Arguments to pass to the init method of the module controller."
                },
                "bind" : {
                    $type : "json:ObjectRef",
                    $description : "List of data bindings. The key is a location in the module's data model, the value is inside the site module controller and has the form 'location:path' like 'appData:search.from'"
                }
            }
        },
        "CommonModule" : {
            $type : "Module",
            $description : "Common module.",
            $properties : {
                "priority" : {
                    $type : "json:Integer",
                    $description : "If it is equal to 1, the submodule is loaded in the application initialization. If it is equal to 2, it is loaded when required by a page.",
                    $default : 1,
                    $minValue : 1,
                    $maxValue : 2
                }
            }
        },
        "Content" : {
            $type : "json:Object",
            $description : "Description of a piece of content.",
            $properties : {
                "value" : {
                    $type : "json:String",
                    $description : "Content to be displayed.",
                    $mandatory : true
                },
                "contentType" : {
                    $type : "json:String",
                    $description : "Type of the content."
                }
            }
        }

    }
});
