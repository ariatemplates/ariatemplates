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
 * @class aria.templates.CfgBeans
 */
Aria.beanDefinitions({
    $package : "aria.templates.CfgBeans",
    $description : "Definition of JSON beans used in aria templates",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "coreBeans" : "aria.core.CfgBeans"
    },
    $beans : {
        "BaseTemplateCfg" : {
            $type : "json:Object",
            $description : "Base configuration for all types of templates.",
            $properties : {
                "$classpath" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the generated class.",
                    $mandatory : true
                },
                "$dependencies" : {
                    $type : "json:Array",
                    $description : "Additional dependencies",
                    $default : [],
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any class that the template is dependent of"
                    }
                },
                "$hasScript" : {
                    $type : "json:Boolean",
                    $description : "Specifies whether a script is associated with the template. If this property is true, the script is a class declared with Aria.tplScriptDefinition whose classpath is the same as the one of the template, with the suffix Script added to the end.",
                    $default : false
                },
                "$extends" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the parent template, if any."
                },
                "$texts" : {
                    $type : "json:Map",
                    $description : "Text templates used inside the Template",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the text template.",
                        $mandatory : true
                    }
                }
            }
        },
        "TemplateCfg" : {
            $type : "BaseTemplateCfg",
            $description : "Configuration of a template.",
            $mandatory : true,
            $properties : {
                "$width" : {
                    $type : "ContainerSizeCfg",
                    $description : "Constraints (min, max) for the width of the template.",
                    $default : null
                },
                "$height" : {
                    $type : "ContainerSizeCfg",
                    $description : "Constraints (min, max) for the height of the template.",
                    $default : null
                },
                "$wlibs" : {
                    $type : "json:Map",
                    $description : "Map of widget libraries used in the template. The key in the map is the prefix used inside the template to refer to that widget library. The value is the classpath of the library. The aria library is defined by default and refers to aria.widgets.AriaLib.",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the widget library.",
                        $sample : "aria.widgets.AriaLib",
                        $mandatory : true
                    },
                    $default : {}
                },
                "$res" : {
                    $type : "json:Map",
                    $description : "Resource class to be accessible through the res variable in the template.",
                    $contentType : {
                        $type : "json:MultiTypes", // can be a string (classpath of a simple resource) or an object
                        // (for resource providers)
                        $description : "Any resource class that the template is dependent of.",
                        $sample : "aria.widgets.WidgetsRes"
                    }
                },
                "$templates" : {
                    $type : "json:Array",
                    $description : "Template dependencies",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any template that should be loaded before the template is loaded."
                    }
                },
                "$css" : {
                    $type : "json:Array",
                    $description : "CSS dependencies",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any CSS template that should be loaded along with the template."
                    }
                },
                "$macrolibs" : {
                    $type : "json:Map",
                    $description : "Static macro libraries",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the macro library.",
                        $mandatory : true
                    }
                }
                /*
                 * , // TODO: complete the following properties ($mandatory, $description...): "dataController" :{
                 * $type: "json:String", $description: "" }, "dataType":{ $type: "json:String", $description: "" }
                 */
            }
        },
        "LibraryCfg" : {
            $type : "BaseTemplateCfg",
            $description : "Configuration of a library.",
            $mandatory : true,
            $properties : {
                "$wlibs" : {
                    $type : "json:Map",
                    $description : "Map of widget libraries used in the library. The key in the map is the prefix used inside the library to refer to that widget library. The value is the classpath of the library. The aria library is defined by default and refers to aria.widgets.AriaLib.",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the widget library.",
                        $sample : "aria.widgets.AriaLib",
                        $mandatory : true
                    },
                    $default : {}
                },
                "$templates" : {
                    $type : "json:Array",
                    $description : "Library dependencies",
                    $default : [],
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any template that should be loaded before the library is loaded."
                    }
                },
                "$macrolibs" : {
                    $type : "json:Map",
                    $description : "Static macro libraries",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the macro library.",
                        $mandatory : true
                    }
                },
                "$res" : {
                    $type : "json:Map",
                    $description : "Resource class to be accessible through the res variable in the library.",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any resource class that the library is dependent of",
                        $sample : "aria.widgets.WidgetsRes"
                    }
                }

            }
        },
        "CSSTemplateCfg" : {
            $type : "BaseTemplateCfg",
            $description : "Configuration of a CSS Template.",
            $properties : {
                "$csslibs" : {
                    $type : "json:Map",
                    $description : "Static CSS macro libraries",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the CSS macro library.",
                        $mandatory : true
                    }
                }
            }
        },
        "CSSLibraryCfg" : {
            $type : "BaseTemplateCfg",
            $description : "Configuration of a CSS library.",
            $mandatory : true,
            $properties : {
                "$csslibs" : {
                    $type : "json:Map",
                    $description : "Static CSS macro libraries",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the CSS macro library.",
                        $mandatory : true
                    }
                },
                "$res" : {
                    $type : "json:Map",
                    $description : "Resource class to be accessible through the res variable in the library.",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any resource class that the library is dependent of",
                        $sample : "aria.widgets.WidgetsRes"
                    }
                }

            }
        },
        "TextTemplateCfg" : {
            $type : "BaseTemplateCfg",
            $description : "Configuration of a text template.",
            $mandatory : true,
            $properties : {
                "$res" : {
                    $type : "json:Map",
                    $description : "Resource class to be accessible through the res variable in the template.",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any resource class that the template is dependent of",
                        $sample : "aria.widgets.WidgetsRes"
                    }
                }
                /*
                 * , // TODO: complete the following properties ($mandatory, $description...): "dataController" :{
                 * $type: "json:String", $description: "" }, "dataType":{ $type: "json:String", $description: "" }
                 */
            }
        },

        "ContainerSizeCfg" : {
            $type : "json:Object",
            $description : "Constraints for the size (height or width) of a container object (the browser window or a template).",
            $properties : {
                "min" : {
                    $type : "json:Integer",
                    $description : "Minimum size of the object, expressed in pixels; or null if there is no minimum size."
                },
                "max" : {
                    $type : "json:Integer",
                    $description : "Maximum size of the object, expressed in pixels; or null if there is no maximum size."
                },
                "value" : {
                    $type : "json:Integer",
                    $description : "Size of the object, if its size should be fixed, or null if there is no fixed size. When defined, it replaces both min and max."
                },
                "scrollbar" : {
                    $type : "json:Boolean",
                    $description : "If true, reserve space for the scrollbar (if constraints are on the width, space is reserved for a vertical scrollbar; if constraints are on the height, space is reserved for a horizontal scrollbar)."
                }
            },
            $default : {}
        },
        "RootDimCfg" : {
            $type : "json:Object",
            $description : "Specify the constraints on the dimensions of the browser's window, which are used to compute the size of the templates.",
            $mandatory : true,
            $properties : {
                "width" : {
                    $type : "ContainerSizeCfg",
                    $description : "Constraints on the width of the window."
                },
                "height" : {
                    $type : "ContainerSizeCfg",
                    $description : "Constraints on the height of the window."
                }
            }
        },
        "ModuleCtrl" : {
            $type : "json:MultiTypes",
            $description : "Module controller to be used in the template. It can be specified either directly with an instance of the public interface of the module controller (containing a getData method), or as a description of how to create it.",
            $contentTypes : [{
                        $type : "json:ObjectRef",
                        $description : "Instance of the public interface of the module controller to be used in the template.",
                        $mandatory : true
                    }, {
                        $type : "InitModuleCtrl"
                    }]
        },
        "InitModuleCtrl" : {
            $type : "json:Object",
            $description : "Description of how to create the module controller for a template.",
            $mandatory : true,
            $properties : {
                "classpath" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the module controller.",
                    $mandatory : true
                },
                "autoDispose" : {
                    $type : "json:Boolean",
                    $description : "If true, the module controller will be disposed when the template is disposed, otherwise, it will not be disposed.",
                    $default : true
                },
                "constructorArgs" : {
                    $type : "json:ObjectRef",
                    $description : "Parameter to be passed to the constructor of the module controller.",
                    $mandatory : false
                },
                "initArgs" : {
                    $type : "json:ObjectRef",
                    $description : "Parameter to be passed to the init method of the module controller.",
                    $mandatory : false
                }
            }
        },
        "Div" : {
            $type : "json:MultiTypes",
            $description : "Specify a div element in a page, either by its string id or by a reference to its HTMLDivElement.",
            $mandatory : true,
            $contentTypes : [{
                        $type : "json:ObjectRef",
                        $description : "The HTMLDivElement of the div."
                    }, {
                        $type : "json:String",
                        $description : "Id of the div element in the document (must be accessible through aria.utils.Dom.getElementById)."
                    }]
        },
        "TemplateSizeCfg" : {
            $type : "json:MultiTypes",
            $description : "Size of a template, which may either be relative to the size of the browser window, or be a fixed size.",
            $contentTypes : [{
                        $type : "json:Integer",
                        $description : "Fixed size of the template in pixels."
                    }, {
                        $type : "RelativeTemplateSizeCfg"
                    }]
        },
        "RelativeTemplateSizeCfg" : {
            $type : "json:Object",
            $description : "Size of the template, relative to the size of the window.",
            $properties : {
                "min" : {
                    $type : "json:Integer",
                    $description : "Minimum size of the template.",
                    $mandatory : true
                },
                "incrementFactor" : {
                    $type : "json:Float",
                    $description : "When the size of the browser window is larger than its minimum size (defined by Aria.setRootDim), the extra space multiplied by this incrementFactor is added to the minimum size of the template to set the size of the template.",
                    $default : 1
                },
                "max" : {
                    $type : "json:Integer",
                    $description : "Maximum size of the template.",
                    $default : null
                }

            }
        },
        "PrintOptions" : {
            $type : "json:Enum",
            $enumValues : ["hidden", "visible", "adaptX", "adaptY", "adaptXY"],
            $description : "This determines how the element will be printed when using the printing command from the browser.",
            $default : "visible"
        },
        "BaseLoadTemplateCfg" : {
            $type : "json:Object",
            $description : "Private base configuration for a template load.",
            $properties : {
                "classpath" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the template.",
                    $mandatory : true
                },
                "origClasspath" : {
                    $type : "json:PackageName",
                    $description : "Original classpath of the template. Differs from classpath if a customization has been defined.",
                    $mandatory : false
                },
                "printOptions" : {
                    $type : "PrintOptions",
                    $default : "adaptXY"
                },
                "width" : {
                    $type : "TemplateSizeCfg",
                    $description : "Width of the template.",
                    $mandatory : false

                },
                "height" : {
                    $type : "TemplateSizeCfg",
                    $description : "Height of the template.",
                    $mandatory : false
                },
                "data" : {
                    $type : "json:ObjectRef",
                    $description : "JSON object to appear as this.data in the template.",
                    $mandatory : false
                },
                "moduleCtrl" : {
                    $type : "ModuleCtrl",
                    $mandatory : false
                },
                "args" : {
                    $type : "json:Array",
                    $description : "Arguments to give to the main macro in the template.",
                    $default : [],
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "Any argument to give to the main macro in the template."
                    }
                },
                "rootDim" : {
                    $type : "RootDimCfg",
                    $description : "This property is a shortcut for Aria.setRootDim. If this property is defined, Aria.loadTemplate makes a call to Aria.setRootDim with this property as its parameter.",
                    $mandatory : false
                },
                "provideContext" : {
                    $type : "json:Boolean",
                    $description : "When set to true, the callback executed when the template is loaded will be passed the template context as argument",
                    $mandatory : false,
                    $default : false
                },
                "reload" : {
                    $type : "json:Boolean",
                    $description : "Specifies if the template has to be retrieved from the server or if AT cache mechanism can be used.",
                    $default : false
                },
                "reloadByPassCache" : {
                    $type : "json:Boolean",
                    $description : "If reload, timestamp will be added to bypass browser cache",
                    $default : false
                }

            }
        },
        "LoadTemplateCfg" : {
            $type : "BaseLoadTemplateCfg",
            $description : "Argument of Aria.loadTemplate, which describes which template to load with which data and parameters.",
            $properties : {
                "div" : {
                    $type : "Div",
                    $description : "Div in which the template should be loaded. The previous content of this div will be discarded.",
                    $mandatory : true
                }
            }
        },
        "InitTemplateCfg" : {
            $type : "BaseLoadTemplateCfg",
            $description : "Description of the parameter of aria.templates.TemplateCtxt.initTemplate, with the description of which template to load, with which data and parameters. It is different from LoadTemplateCfg, as it does not accept a description of how to create a module controller (only an already created instance), but it accepts a macro parameter.",
            $properties : {
                "id" : {
                    $type : "json:String",
                    $description : "Id of the template, to be used to generate sub-ids.",
                    $mandatory : false
                },
                "originalId" : {
                    $type : "json:String",
                    $description : "User defined Id of the template.",
                    $mandatory : false
                },
                "div" : {
                    $type : "Div",
                    $description : "Div in which the template should be loaded. The previous content of this div will be discarded.",
                    $mandatory : false
                },
                "tplDiv" : {
                    $type : "Div",
                    $description : "Div which will direclty contain the template. Can be omitted if not available yet, but in this case, you should call the getMarkup and linkToPreviousMarkup methods later.",
                    $mandatory : false
                },
                "macro" : {
                    $type : "MacroCfg"
                },
                "toDispose" : {
                    $type : "json:Array",
                    $description : "Array of objects to dispose when the template is disposed.",
                    $contentType : {
                        $type : "json:ObjectRef",
                        $description : "Object to dispose. Must have a $dispose method.",
                        $mandatory : true
                    }
                },
                "baseTabIndex" : {
                    $type : "json:Integer",
                    $description : "The base tab index that will be added to all tab indexes in the template.",
                    $default : 0
                },
                "isRootTemplate" : {
                    $type : "json:Boolean",
                    $description : "Specifies whether a template was loaded by loadTemplate.",
                    $default : false
                },
                "context" : {
                    $type : "json:ObjectRef",
                    $description : "Additional context used to build the template configuration.",
                    $mandatory : false
                }
            }
        },
        "InitCSSTemplateCfg" : {
            $type : "json:Object",
            $mandatory : true,
            $description : "Description of the parameter of aria.templates.CSSCtxt.initTemplate, with the description of which template to load.",
            $properties : {
                "classpath" : {
                    $type : "json:PackageName",
                    $description : "CSS Template classpath.",
                    $mandatory : true
                },
                "isWidget" : {
                    $type : "json:Boolean",
                    $description : "True if it's a CSS Template for a Widget.",
                    $mandatory : false,
                    $default : false
                },
                "widgetName" : {
                    $type : "json:String",
                    $description : "Widget name. Optional argument if the Template is for a Widget",
                    $mandatory : false,
                    $default : ""
                },
                "isTemplate" : {
                    $type : "json:Boolean",
                    $description : "True if it's a CSS Template for a normal Template.",
                    $mandatory : false,
                    $default : false
                }
            }
        },
        "InitTxtTemplateCfg" : {
            $type : "json:Object",
            $mandatory : true,
            $description : "Description of the parameter of aria.templates.TxtCtxt.initTemplate, with the description of which template to load.",
            $properties : {
                "classpath" : {
                    $type : "json:PackageName",
                    $description : "Text Template classpath.",
                    $mandatory : true
                },
                "data" : {
                    $type : "json:ObjectRef",
                    $description : "JSON object to appear as this.data in the template.",
                    $mandatory : false
                }
            }
        },
        "MacroCfg" : {
            $type : "json:MultiTypes",
            $description : "Macro to be used when refreshing the template. By default, the main macro is used.",
            $contentTypes : [{
                        $type : "json:String",
                        $description : "Name of the macro. When this form is used, no parameter is sent to the macro."
                    }, {
                        $type : "json:Object",
                        $description : "",
                        $properties : {
                            "name" : {
                                $type : "json:String",
                                $description : "Name of the macro."
                            },
                            "args" : {
                                $type : "json:Array",
                                $description : "Parameters of the macro.",
                                $contentType : {
                                    $type : "json:MultiTypes",
                                    $description : "Any parameter to give to the macro."
                                },
                                $default : []
                            },
                            "scope" : {
                                $type : "json:ObjectRef",
                                $description : "Reference to the object on which the macro is defined. This allows to call macros in macro libraries. By default, the scope is the template."
                            }
                        }
                    }]
        },
        "HtmlAttribute" : {
            $type : "json:Object",
            $description : "HTML attributes that can safely be used in a template",
            $properties : {
                "name" : {
                    $type : "json:String",
                    $description : "name given to the element"
                },
                "title" : {
                    $type : "json:String",
                    $description : "title of an element"
                },
                "classList" : {
                    $type : "json:Array",
                    $description : "Array of classnames for the element",
                    $contentType : {
                        $type : "json:String",
                        $description : "space separated names of classes to which the element belongs to"
                    }
                },
                "dataset" : {
                    $type : "json:ObjectRef",
                    $description : "Set of expando keys-values for the element"
                },
                "style" : {
                    $type : "json:String",
                    $description : "inline style for the element"
                },
                "dir" : {
                    $type : "json:String",
                    $description : "text direction for the content in the element"
                },
                "lang" : {
                    $type : "json:String",
                    $description : "language code for the content in the element"
                },
                "abbr" : {
                    $type : "json:String",
                    $description : "abbreviation for the content of the element"
                },
                "height" : {
                    $type : "json:String",
                    $description : "height of the element"
                },
                "width" : {
                    $type : "json:String",
                    $description : "width of the element"
                },
                "size" : {
                    $type : "json:String",
                    $description : "specifies the width of an element"
                },
                "cols" : {
                    $type : "json:String",
                    $description : "specifies the size and number of columns in a frameset"
                },
                "rows" : {
                    $type : "json:String",
                    $description : "specifies the size and number of rows in a frameset"
                },
                "rowspan" : {
                    $type : "json:String",
                    $description : "specifies the number of rows for a cell to span in a table"
                },
                "colspan" : {
                    $type : "json:String",
                    $description : "specifies the number of columns for a cell to span in a table"
                },
                "nowrap" : {
                    $type : "json:String",
                    $description : "boolean indicator to wrap contents of a table"
                },
                "valign" : {
                    $type : "json:String",
                    $description : "attribute specifying the vertical alignment of the contents of a cell in a table"
                },
                "align" : {
                    $type : "json:String",
                    $description : "attribute specifying the alignment of the contents of a cell in a table"
                },
                "border" : {
                    $type : "json:String",
                    $description : "attribute to specify the width of the frame around a table in pixels"
                },
                "cellpadding" : {
                    $type : "json:String",
                    $description : "numeric value specifying spacing within cells"
                },
                "cellspacing" : {
                    $type : "json:String",
                    $description : "numeric value specifying spacing between cells"
                },
                "disabled" : {
                    $type : "json:String",
                    $description : "attribute used to disable an element"
                },
                "readonly" : {
                    $type : "json:String",
                    $description : "attribute to specify a boolean value to make the contents of the element readonly"
                },
                "checked" : {
                    $type : "json:String",
                    $description : "attribute to preselect an element, usually used with input type checkbox or radio"
                },
                "selected" : {
                    $type : "json:String",
                    $description : "attribute to preselect the value of a element, usually a dropdown list"
                },
                "multiple" : {
                    $type : "json:String",
                    $description : "attribute to select multiple options at the same time"
                },
                "value" : {
                    $type : "json:String",
                    $description : "content to be displayed in the element"
                },
                "alt" : {
                    $type : "json:String",
                    $description : "alternate text of the element"
                },
                "maxlength" : {
                    $type : "json:String",
                    $description : "maximum acceptable length for the content of the element"
                },
                "type" : {
                    $type : "json:String",
                    $description : "specifies the type of an input element"
                },
                "accesskey" : {
                    $type : "json:String",
                    $description : "keyboard shortcut that activates or focuses the element"
                },
                "tabindex" : {
                    $type : "json:Integer",
                    $description : "control whether an element is supposed to be focusable, and in what order it can be reached using sequantial focus navigation"
                },
                "placeholder" : {
                    $type : "json:String",
                    $description : "short hint intended to aid the user with data entry"
                }
            }
        },
        "SectionCfg" : {
            $type : "json:Object",
            $description : "Contains configuration description for a section statement.",
            $properties : {
                "id" : {
                    $type : "json:String",
                    $description : "Id of the section.",
                    $mandatory : true
                },
                "type" : {
                    $type : "json:String",
                    $description : "DOM type for this section.",
                    $default : "span"
                },
                "bindRefreshTo" : {
                    $type : "json:Array",
                    $description : "Binding configurations for this section. If specified, this section will refresh automatically if a change is made on the data it is bound to.",
                    $default : [],
                    $contentType : {
                        $type : "BindingConfiguration",
                        $description : "Description of a binding.",
                        $sample : "{inside : ..., to : ...}"
                    }
                },
                "bindProcessingTo" : {
                    $type : "BindingConfiguration",
                    $description : "Loading overlay binding configurations for this section. If specified, this section will be hidden by a loading indicator when the value in the datamodel is true.",
                    $mandatory : false
                },
                "keyMap" : {
                    $type : "json:Array",
                    $description : "Configuration for the keyMap inside this section.",
                    $mandatory : false,
                    $contentType : {
                        $type : "KeyMapCfg",
                        $description : "keymap configuration"
                    }
                },
                "tableNav" : {
                    $type : "TableNavConfiguration",
                    $description : "Configuration for the table navigation inside this section.",
                    $mandatory : false
                },
                "processingLabel" : {
                    $type : "json:String",
                    $description : "Text message to display in the loading indicator.",
                    $mandatory : false,
                    $default : ""
                },
                "macro" : {
                    $type : "MacroCfg",
                    $description : "Macro to call to fill the section. It must not be defined if the section statement is used as a container."
                },
                "cssClass" : {
                    $type : "json:String",
                    $description : "[DEPRECATED] Use classList inside attributes instead. CSS class or space separated classes to apply to the DOM element of the section."
                },
                "attributes" : {
                    $type : "HtmlAttribute",
                    $description : "Parameters to apply to the DOM element of the section."
                },
                "on" : {
                    $type : "json:Object",
                    $description : "List of registered browser events and their callbacks. Values should match bean aria.widgetLibs.CommonBeans.Callback",
                    $default : {},
                    $restricted : false
                }

            }
        },
        "RepeaterCfg" : {
            $type : "SectionCfg",
            $description : "Configuration description for a repeater statement.",
            $mandatory : true,
            $properties : {
                "content" : {
                    $type : "json:ObjectRef",
                    $description : "Iterated set, which can be an array, a map or a view. Note that the support for views is not implemented yet.",
                    $mandatory : true
                },
                "loopType" : {
                    $type : "json:Enum",
                    $description : "How to iterate over the set (same meaning as in the foreach statement). If not specified, it is automatically set to array, pagedView or map depending on the type of object given in content.",
                    $enumValues : ["array", "pagedView", "sortedView", "filteredView", "view", "map"],
                    $mandatory : false
                },
                "childSections" : {
                    $type : "json:Object",
                    // open configuration
                    $restricted : false,
                    $description : "Properties of child sections. All the properties from aria.templates.CfgBeans.SectionCfg are supported. Each property accepts either a constant value (to have the same value for all child sections) or a callback function to make the value depend on the child section.",
                    $properties : {
                        "id" : {
                            $type : "json:MultiTypes",
                            $description : "Id of the child section. If a constant value is given (as opposed to a callback function), a child-dependent suffix will be automatically appended to this id for each child section.",
                            $mandatory : true
                        },
                        "macro" : {
                            $type : "json:MultiTypes",
                            $description : "Macro to be called to fill the child section. If a constant value is given (as opposed to a callback function), the macro will be called with an additional parameter describing the item.",
                            $mandatory : true
                        }
                    }
                },
                "macro" : {
                    $type : "SectionCfg.macro",
                    $description : "This property from sections is not supported for repeaters."
                }
            }
        },
        "BindingConfiguration" : {
            $type : "json:Object",
            $description : "Configuration for a binding between a value in the datamodel and an object.",
            $properties : {
                "to" : {
                    $type : "json:JsonProperty",
                    $description : "Name of the JSON property to bind to. If not specified, will be triggered for any change in the container.",
                    $default : null
                },
                "inside" : {
                    $type : "json:ObjectRef",
                    $description : "Reference to the object that holds the property to bind to",
                    $mandatory : true
                },
                "recursive" : {
                    $type : "json:Boolean",
                    $description : "Listen to change of the element, or listen for recursive changes",
                    $default : true
                }
            }
        },
        "TableNavConfiguration" : {
            $type : "json:MultiTypes",
            $description : "Configuration the navigation on tables."
        },
        "RefreshCfg" : {
            $type : "json:Object",
            $description : "Contains information about what to refresh in a template and how to do it.",
            $default : {},
            $properties : {
                "macro" : {
                    $type : "MacroCfg",
                    $mandatory : false
                },
                "filterSection" : {
                    $type : "json:String",
                    $description : "Id of the section to filter. If specified, the section with this id must exist in the macro called for the refresh, and any output outside the specified section is ignored.",
                    $mandatory : false
                },
                "outputSection" : {
                    $type : "json:String",
                    $description : "Id of the section to replace. By default, its value is the one of filterSection. If null, the whole template is replaced.",
                    $mandatory : false
                }
            }
        },
        "GetRefreshedSectionCfg" : {
            $type : "RefreshCfg",
            $properties : {
                "writerCallback" : {
                    $type : "coreBeans:Callback",
                    $description : "If specified, macro is ignored and this callback is called instead, with the out object (MarkupWriter) as its parameter."
                }
            }
        },
        "InsertAdjacentSectionsCfg" : {
            $type : "json:Object",
            $description : "Parameter required (by aria.templates.TemplateCtxt.insertAdjacentSections) to dynamically insert new sections in the DOM.",
            $mandatory : true,
            $properties : {
                "sections" : {
                    $type : "json:Array",
                    $description : "Array of the sections to be inserted in the DOM.",
                    $mandatory : true,
                    $contentType : {
                        $type : "json:MultiTypes",
                        $mandatory : true,
                        $description : "",
                        $contentTypes : [{
                                    $type : "json:String",
                                    $description : "Id of the new section."

                                }, {
                                    $type : "SectionCfg",
                                    $description : "Configuration of the new section."
                                }]
                    }
                },
                "refSection" : {
                    $type : "json:Object",
                    $mandatory : true,
                    $description : "Existing reference section near which new sections will be added.",
                    $properties : {
                        "object" : {
                            $type : "json:ObjectRef",
                            $classpath : "aria.templates.Section",
                            $description : "Section object.",
                            $mandatory : true
                        },
                        "domElt" : {
                            $type : "json:ObjectRef",
                            $description : "DOM element corresponding to the section object.",
                            $mandatory : true
                        }
                    }
                },
                "position" : {
                    $type : "json:Enum",
                    $description : "Where to insert new sections relative to refSection.",
                    $mandatory : true,
                    $enumValues : ['beforeBegin', 'afterBegin', 'beforeEnd', 'afterEnd']
                }
            }
        },
        "SubModuleDefinition" : {
            $type : "json:Object",
            $description : "Definition of a sub-module - as required by the loadSubModules() method",
            $mandatory : true,
            $properties : {
                "refpath" : {
                    $type : "json:String",
                    $description : "Reference Path - If the submodule is private, this path should start with an underscore character and will refer to the module controller - otherwise this path will be considered public and will refer to the data model root, so that the submodule will be visible from the data model",
                    $regExp : /./ /* at least one character */,
                    $mandatory : true,
                    $sample : "pkg1.module"
                },
                "arrayIndex" : {
                    $type : "json:Integer",
                    $description : "(optional) Index of the sub-module in the parent Array - if not provided, we assume the sub-module must not be stored in an Array (the map key will be used to either create an Array or a single reference)",
                    $mandatory : false
                },
                "classpath" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the sub-module controller class",
                    $mandatory : true
                },
                "initArgs" : {
                    $type : "json:ObjectRef",
                    $description : "Argument object that should be passed to the sub-module init method - if null an empty object will be used",
                    $mandatory : false
                },
                "display" : {
                    // TODO: change aria.tools.ToolsModule (used for debug tools) so that this item (which should not be
                    // present in this bean) can be removed from here
                    $type : "json:String",
                    $description : "[DEPRECATED] should not be used",
                    $mandatory : false
                }
            }
        },
        "TplScriptDefinitionCfg" : {
            $type : "json:Object",
            $description : "Parameter to pass to Aria.tplScriptDefinition method.",
            $properties : {
                "$classpath" : {
                    $type : "json:PackageName",
                    $description : "The fully qualified class path of the generated class.",
                    $mandatory : true,
                    $sample : 'aria.jsunit.TestSuite'
                },
                "$dependencies" : {
                    $type : "json:Array",
                    $description : "Additional dependencies",
                    $default : [],
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any class that the generated class is dependent of."
                    }
                },
                "$resources" : {
                    $type : "json:Map",
                    $description : "Resource class to be accessible inside the generated class.",
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "Any resource class that the generated class is dependent of.",
                        $sample : "aria.widgets.WidgetsRes",
                        $contentTypes : [{
                                    $type : "json:Object",
                                    $description : "Resource provider."
                                }, {
                                    $type : "json:String",
                                    $description : "Classpath of the resource class."
                                }]
                    }
                },
                "$texts" : {
                    $type : "json:Map",
                    $description : "Text templates used inside the generated class.",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the text template.",
                        $mandatory : true
                    }
                },
                "$statics" : {
                    $type : "json:Map",
                    $description : "Methods and properties that are common to all instances of the generated class.",
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "Property or method."
                    }
                },
                "$prototype" : {
                    $type : "json:MultiTypes",
                    $description : "Either a function or a map",
                    $contentTypes : [{
                                $type : "json:Map",
                                $description : "Methods and properties in the prototype of the class.",
                                $contentType : {
                                    $type : "json:MultiTypes",
                                    $description : "Property or method."
                                }
                            }, {
                                $type : "json:FunctionRef",
                                $description : "Reference to a JavaScript function, the function should return an object that will be the prototype."
                            }]
                },
                "$constructor" : {
                    $type : "json:FunctionRef",
                    $description : "Constructor function to run when the object is created through the new statement."
                },
                "$destructor" : {
                    $type : "json:FunctionRef",
                    $description : "Destructor function to run when the object has to be deleted - must be called through the '$destructor()' method that will be automatically added to the object."
                }
            }
        },

        "KeyMapCfg" : {
            $type : "json:Object",
            $description : "Configuration of a single keymap",
            $properties : {
                "key" : {
                    $type : "json:MultiTypes",
                    $description : "description of the key",
                    $mandatory : true,
                    $contentTypes : [{
                                $type : "json:Integer",
                                $description : "key code"
                            }, {
                                $type : "json:String",
                                $description : "String representing the key or wildcard",
                                $sample : "F4"
                            }]
                },
                "ctrl" : {
                    $type : "json:Boolean",
                    $description : "Whether or not the ctrl key has to pressed"
                },
                "shift" : {
                    $type : "json:Boolean",
                    $description : "Whether or not the shift key has to pressed"
                },
                "alt" : {
                    $type : "json:Boolean",
                    $description : "Whether or not the alt key has to pressed"
                },
                "callback" : {
                    $type : "json:MultiTypes",
                    $description : "handler for the keymap",
                    $mandatory : true,
                    $contentTypes : [{
                                $type : "json:FunctionRef",
                                $description : "handler to be called"
                            }, {
                                $type : "coreBeans:Callback",
                                $description : "callback object"
                            }]
                },
                "event" : {
                    $type : "json:Enum",
                    $description : "Whether the handler has to be called on keydown or on keyup",
                    $enumValues : ["keyup", "keydown"]
                }
            }
        },
        "GlobalKeyMapCfg" : {
            $type : "KeyMapCfg",
            $description : "Configuration of a global keymap",
            $properties : {
                "modal" : {
                    $type : "json:Boolean",
                    $description : "Enable the keyboard navigation for dialog",
                    $default : false
                }
            }
        }
    }
});