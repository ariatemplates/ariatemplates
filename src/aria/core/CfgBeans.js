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
var Aria = require("../Aria");
var ariaCoreJsonTypes = require("./JsonTypes");


/**
 * Beans to describe Aria Templates base structures (like parameters accepted for interface definitions). To be
 * completed with, maybe, class definitions, resource definitions...
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.core.CfgBeans",
    $description : "Definition of Aria Templates base structures.",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "ClassDefinitionCfg" : {
            $type : "json:Object",
            $description : "Parameter to pass to Aria.classDefinition method.",
            $properties : {
                "$classpath" : {
                    $type : "json:PackageName",
                    $description : "The fully qualified class path.",
                    $mandatory : true,
                    $sample : 'aria.jsunit.TestSuite'
                },
                "$singleton" : {
                    $type : "json:Boolean",
                    $description : "Whether the class can be instanciated through the new statement or if it should only contain static (global) properties and methods.",
                    $default : false
                },
                "$extends" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the parent class, if any.",
                    $default : "aria.core.JsObject"
                },
                "$implements" : {
                    $type : "json:Array",
                    $description : "Interfaces that the class implements.",
                    $default : [],
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the interface"
                    }
                },
                "$dependencies" : {
                    $type : "json:Array",
                    $description : "Additional dependencies",
                    $default : [],
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any class that the class is dependent of."
                    }
                },
                "$resources" : {
                    $type : "json:Map",
                    $description : "Resource class to be accessible inside the class.",
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "Any resource class that the class is dependent of.",
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
                "$templates" : {
                    $type : "json:Array",
                    $description : "Template dependencies",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any template that should be loaded before the class is loaded."
                    }
                },
                "$css" : {
                    $type : "json:Array",
                    $description : "CSS dependencies",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Any CSS template that should be loaded along with the class."
                    }
                },
                "$macrolibs" : {
                    $type : "json:Array",
                    $description : "Static macro libraries",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the macro library to load as a dependency of the class.",
                        $mandatory : true
                    }
                },
                "$csslibs" : {
                    $type : "json:Array",
                    $description : "Static CSS macro libraries",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the CSS macro library to load as a dependency of the class.",
                        $mandatory : true
                    }
                },
                "$texts" : {
                    $type : "json:Map",
                    $description : "Text templates used inside the class.",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "Classpath of the text template.",
                        $mandatory : true
                    }
                },
                "$statics" : {
                    $type : "json:Map",
                    $description : "Methods and properties that are common to all instances of the class.",
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
                    $description : "Constructor function to run when the object is created through the new statement.",
                    $mandatory : true
                },
                "$destructor" : {
                    $type : "json:FunctionRef",
                    $description : "Destructor function to run when the object has to be deleted - must be called through the '$destructor()' method that will be automatically added to the object."
                },
                "$onload" : {
                    $type : "json:FunctionRef",
                    $description : "Function that is called after the class is loaded from the framework"
                },
                "$events" : {
                    $type : "json:Map",
                    $description : "Events that the class can raise.",
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "Event description.",
                        $contentTypes : [{
                            $type : "json:Object",
                            $description : "Event description containing name, properties and description of the event."
                        }, {
                            $type : "json:String",
                            $description : "Name of the event."
                        }]
                    }
                },
                "$beans" : {
                    $type : "json:Map",
                    $description : "Beans to be defined in the class.",
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "Beans"
                    }
                }
            }
        },
        "ItfBaseMemberCfg" : {
            $type : "json:Object",
            $description : "Base definition common for all interface member types.",
            $properties : {
                "$type" : {
                    $type : "json:Enum",
                    $enumValues : ['Function', 'Object', 'Interface'],
                    $description : "Type of the interface member."
                }
            }
        },
        "ItfMemberFunctionCfg" : {
            $type : "ItfBaseMemberCfg",
            $description : "Definition for interface methods. Methods can either be synchronous, or asynchronous with a callback parameter.",
            $properties : {
                "$callbackParam" : {
                    $type : "json:Integer",
                    $description : "Must be null (or undefined) if the method is synchronous. If the method is asynchronous, must contain the index of the parameter which contains the callback (0 = first parameter)."
                }
            }
        },
        "ItfMemberObjectCfg" : {
            $type : "ItfBaseMemberCfg",
            $description : "Definition for interface objects. Objects are not checked and simply copied in the interface wrapper.",
            $properties : {}
        },
        "ItfMemberInterfaceCfg" : {
            $type : "ItfBaseMemberCfg",
            $description : "Definition for members of interface which are other interfaces. When creating the interface wrapper, the element generated by such a member will always be an interface wrapper with the classpath specified in the $classpath property, whether it was an interface wrapper or a whole object in the whole object.",
            $properties : {
                "$classpath" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the interface which describes the interface member.",
                    $mandatory : true
                }
            }
        },
        "IOAsyncRequestCfg" : {
            $type : "json:Object",
            $description : "Parameter of aria.core.IO.asyncRequest and aria.core.IO.jsonp. It is completed by the framework and passed to filters, which should change only the properties marked as changeable by filters.",
            $properties : {
                "sender" : {
                    $type : "json:Object",
                    $description : "Optional object containing information about the sender of this request. This is especially intended to be used by IO filters. In addition to its classpath, the sender should set in this object any property that could be useful for IO filters.",
                    $restricted : false,
                    $mandatory : false,
                    $properties : {
                        "classpath" : {
                            $type : "json:PackageName",
                            $description : "Classpath of the sender of the request. Depending on this value, IO filters may react differently.",
                            $mandatory : true
                        }
                    }
                },
                "url" : {
                    $type : "json:String",
                    $description : "URL to be requested. In case of a JSON-P request, the callback parameter is appended to this url. This property can be changed by filters."
                },
                "jsonp" : {
                    $type : "json:String",
                    $description : "Contains the name of the parameter that specifies the callback to be executed. If this property is specified, the request will be done through JSON-P. This property can be changed by filters.",
                    $sample : "callback"
                },
                "async" : {
                    $type : "json:Boolean",
                    $description : "Whether the request has to be asynchronous or synchronous  (use it with care: sync requests can freeze the UI). It can be used only for XHR transport.",
                    $default : true
                },
                "method" : {
                    $type : "json:Enum",
                    $description : "HTTP method used in the request. Ignored for JSON-P requests. This property can be changed by filters.",
                    $default : "GET",
                    $enumValues : ["GET", "POST", "PUT", "DELETE", "HEAD", "TRACE", "OPTIONS", "CONNECT", "PATCH",
                            "COPY", "PROPFIND", "MKCOL", "PROPPATCH", "MOVE", "LOCK", "UNLOCK", "BIND", "UNBIND",
                            "REBIND"],
                    $sample : "POST"
                },
                "data" : {
                    $type : "json:String",
                    $description : "Data to be sent in the body of the request methods. Ignored for GET requests. This property can be changed by filters."
                },
                "headers" : {
                    $type : "json:Map",
                    $contentType : {
                        $type : "json:String",
                        $description : "HTTP request header"
                    },
                    $description : "HTTP headers to be included with this request. This array will be merged with `aria.core.IO.headers` and, in case of POST / PUT requests, also with `aria.core.IO.postHeaders`. You can override those properties of aria.core.IO to establish your application's defaults.",
                    $sample : {
                        "Content-Type" : "text/plain",
                        "Connection" : "keep-alive"
                    }
                },
                "timeout" : {
                    $type : "json:Integer",
                    $description : "Timeout in milliseconds (after which the request is canceled if no answer was received before). If this parameter is not set, the default timeout applies (specified in aria.core.IO.defaultTimeout). This property can be changed by filters."
                },
                "expectedResponseType" : {
                    $type : "json:Enum",
                    $description : "Expected type of the response. This is only a hint, currently used to automatically convert responses between text and json formats, if the expected type is not available. If not defined, no automatic conversion occurs. This property can be changed by filters.",
                    $enumValues : ["text", "json", "xml"]
                },
                "callback" : {
                    $type : "json:Object",
                    $description : "Callback functions.",
                    $properties : {
                        "fn" : {
                            $type : "json:FunctionRef",
                            $description : "Function called after the request completes successfully (after all filters have been called)."
                        },
                        "scope" : {
                            $type : "json:ObjectRef",
                            $description : "Object which should be available as 'this' in the 'fn' function called on success."
                        },
                        "onerror" : {
                            $type : "json:FunctionRef",
                            $description : "Function called if the request failed (after all filters have been called)."
                        },
                        "onerrorScope" : {
                            $type : "json:ObjectRef",
                            $description : "Object which should be available as 'this' in the 'onerror' function called on failure."
                        },
                        "args" : {
                            $type : "json:MultiTypes",
                            $description : "Object to be passed as the second parameter to the 'fn' or the 'onerror' method (the first parameter is the object described in IOAsyncRequestResponseCfg)."
                        },
                        "timeout" : {
                            $type : "json:Integer",
                            $description : "Used internally in the framework. Should not be specified directly."
                        }
                    }
                },
                // only used for asyncFormSubmit not to be used with asyncRequest directly
                "formId" : {
                    $type : "json:String",
                    $description : "Only used for asyncFormSubmit not to be used with asyncRequest directly.  Used when processing pseudo asynchronous form requests.  Needs to be passed within the request object by the user."
                },
                // only used for asyncFormSubmit not to be used with asyncRequest directly
                "form" : {
                    $type : "json:ObjectRef",
                    $description : "Only used for asyncFormSubmit not to be used with asyncRequest directly.  Contains the html form object retreived using the formId alternatively a user can pass the form object instead of the form id."
                },
                // response to be given to the caller
                "res" : {
                    $type : "IOAsyncRequestResponseCfg",
                    $description : "Response object sent as the first parameter to the callback specified in the parameter of asyncRequest or jsonp (either callback.fn or callback.onerror). It is automatically set by the framework and it is only available to filters on response. This property can be changed by filters on response."
                },
                // only targeted at filters:
                "delay" : {
                    $type : "json:Integer",
                    $description : "Delay (in ms) to add when all the filters have been called, before going on with the request or the response. (Only works when set from the onRequest or onResponse method of a filter)."
                },
                // Automatically managed by the framework (and must not be modified by filters):
                "id" : {
                    $type : "json:Integer",
                    $description : "Id of the request. It is automatically set by the framework to identify each request in a unique way (any value set in this property before calling asyncRequest is lost). This property can be used by filters but must not be changed."
                },
                "beginDownload" : {
                    $type : "json:Integer",
                    $description : "Time at which the download began. It is automatically set by the framework and it is only available to filters on response. This property should not be changed by filters."
                },
                "endDownload" : {
                    $type : "json:Integer",
                    $description : "Time at which the download ended. It is automatically set by the framework and it is only available to filters on response. This property should not be changed by filters."
                },
                "downloadTime" : {
                    $type : "json:Integer",
                    $description : "Duration of the download in milliseconds (equal to endDownload - beginDownload). It is automatically set by the framework and it is only available to filters on response. This property should not be changed by filters."
                },
                "requestSize" : {
                    $type : "json:Integer",
                    $description : "Approximate size of the request. It is automatically set by the framework and it is only available to filters on response. This property should not be changed by filters."
                },
                "responseSize" : {
                    $type : "json:Integer",
                    $description : "Approximate size of the response. It is automatically set by the framework and it is only available to filters on response. This is currently not set for JSON-P. This property should not be changed by filters."
                },
                "evalCb" : {
                    $type : "json:String",
                    $description : "Used internally by the framework to store the name of the callback function for JSON-P requests. It is not available to filters."
                }
            }
        },
        "IOAsyncRequestResponseCfg" : {
            $type : "json:Object",
            $description : "Response object sent as the first parameter to the callback specified in the parameter of asyncRequest or jsonp (either callback.fn or callback.onerror).",
            $properties : {
                url : {
                    $type : "json:String",
                    $description : "URL used in the request. Should not be changed by filters."
                },
                status : {
                    $type : "json:MultiTypes",
                    $description : "HTTP status (e.g.: 404). Can be changed by filters."
                },
                responseText : {
                    $type : "json:String",
                    $description : "If available, response from the server as a string. Can be changed by filters."
                },
                responseXML : {
                    $type : "json:ObjectRef",
                    $description : "If available, response from the server as an XML tree. Can be changed by filters."
                },
                responseJSON : {
                    $type : "json:MultiTypes",
                    $description : "If available, response from the server as a javascript object. Can be changed by filters."
                },
                error : {
                    $type : "json:String",
                    $description : "Null if no error occured. Otherwise, contains the error message. Can be changed by filters."
                }
            }
        },
        "Callback" : {
            $type : "json:Object",
            $description : "Object that describes a callback.",
            $properties : {
                "fn" : {
                    $type : "json:FunctionRef",
                    $description : "Function that has to be called.",
                    $mandatory : true
                },
                "scope" : {
                    $type : "json:ObjectRef",
                    $description : "Scope of execution of the function."
                },
                "args" : {
                    $type : "json:MultiTypes",
                    $description : "Optional argument passed to the function."
                },
                "resIndex" : {
                    $type : "json:Integer",
                    $description : "Optional param to specify the index of the result or event object in the arguments passed to the callback function.",
                    $default : 0
                },
                "apply" : {
                    $type : "json:Boolean",
                    $description : "Whether we should use Function.call or Function.apply for args. Used only if args is an array",
                    $default : false
                }
            }
        }
    }
});
