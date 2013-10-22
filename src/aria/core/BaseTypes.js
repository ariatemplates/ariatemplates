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
 * Definition of all base beans used in all JSON schemas
 */
Aria.beanDefinitions({
    $package : "aria.core.BaseTypes",
    $description : "Definition of all base beans used in all JSON schemas",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Package" : {
            $type : "json:Object",
            $description : "Definition of a bean package, which is the root element of a JSON schema. A bean package groups together a set of bean definitions with a common purpose.",
            $properties : {
                "$package" : {
                    $type : "json:PackageName",
                    $description : "Complete path of the bean package which is being defined.",
                    $mandatory : true
                },
                "$description" : {
                    $type : "json:String",
                    $description : "A literal description of the package and its purpose."
                },

                "$dependencies" : {
                    $type : "json:Array",
                    $description : "Contains an array of dependencies to be loaded for the bean package.",
                    $contentType : {
                        $type : "json:PackageName",
                        $description : "The class path for the dependency to be loaded."
                    }
                },

                "$namespaces" : {
                    $type : "json:Map",
                    $description : "A map containing all the external bean packages referenced in this package. The key in the map is the prefix used in this package to refer to the imported package. The value is the complete path of the imported package.",
                    $contentType : {
                        $type : "json:ClassRef",
                        $mandatory : true,
                        $description : "Bean package to be imported."
                    }
                },
                "$beans" : {
                    $type : "json:Map",
                    $description : "Map of beans. The key in the map is the name of the bean, which must be a valid variable name in the JavaScript language.",
                    $mandatory : true,
                    $contentType : {
                        $type : "Bean",
                        $mandatory : true
                    }
                },
                "$oldModuleLoader" : {
                    $type : "json:ObjectRef",
                    $description : ""
                }
            }
        },
        "ElementType" : {
            $type : "json:String",
            $description : "A string composed of two parts: 'namespace:value' where the namespace is optional if the value refers a type defined in the same package. The type value must correspond to a type structure defined in a JSON schema",
            $mandatory : true,
            $regExp : /^([a-zA-Z_\$][\w\$]*:)?([a-zA-Z_\$][\w\$]*($|\.))+$/,
            $sample : "json:Boolean"
        },
        "Bean" : {
            $type : "json:MultiTypes",
            $description : "Any schema element. Schema elements are represented as JSON objects, which describe the element schema. Depending on its $type an element can correspond to a JSON value (simple type) or to a JSON object or array (complex type)",
            $contentTypes : [{
                        $type : "String"
                    }, {
                        $type : "Boolean"
                    }, {
                        $type : "Integer"
                    }, {
                        $type : "Float"
                    }, {
                        $type : "Date"
                    }, {
                        $type : "RegExp"
                    }, {
                        $type : "ObjectRef"
                    }, {
                        $type : "FunctionRef"
                    }, {
                        $type : "Enum"
                    }, {
                        $type : "Object"
                    }, {
                        $type : "Array"
                    }, {
                        $type : "Map"
                    }, {
                        $type : "MultiTypes"
                    }]
        },
        // Root type - from which all other element inherits
        "Element" : {
            $type : "json:Object",
            $description : "Base JSON schema element from which all other schema element inherits. Schema elements are represented as JSON objects, the element name being the property name referencing the object whereas the object content is used to describe the element schema. Depending on its $type an element can correspond to a JSON value (simple type) or to a JSON object or array (complex type)",
            $properties : {
                "$description" : {
                    $type : "json:String",
                    $description : "A literal description of the element - its purpose and possible constraints",
                    $mandatory : false
                },
                "$type" : {
                    $type : "ElementType",
                    $mandatory : true
                },
                "$sample" : {
                    $type : "json:MultiTypes",
                    $description : "Example of what such an element can look like - can be any possible JSON value, object or array",
                    $mandatory : false
                },
                "$default" : {
                    $type : "json:MultiTypes",
                    $description : "Default value associated to this type - if provided, the $mandatory attribute is considered as false",
                    $mandatory : false
                },
                "$mandatory" : {
                    $type : "json:Boolean",
                    $description : "Tells if the element must be provided for the JSON object to be valid",
                    $mandatory : false
                }
            }
        },

        // Simple Types (don't contain sub-elements)
        "String" : {
            $type : "Element",
            $description : "Correspond to any possible JavaScript string or characters. Its acceptable values can be restricted by the use of a $regExp property in the schema.",
            $properties : {
                "$regExp" : {
                    $type : "json:RegExp",
                    $description : "Regular expression that the string must match"
                }
            }
        },
        "Boolean" : {
            $type : "Element",
            $description : "Correspond to a JavaScript boolean: true or false"
        },
        "Integer" : {
            $type : "Element",
            $description : "Correspond to an integer. Its acceptable range can be restricted by the use of the $minValue and $maxValue properties in the schema.",
            $properties : {
                $minValue : {
                    $type : "json:Integer",
                    $description : "The minimum value of the integer. Must be inferior to $maxValue, if both are provided."
                },
                $maxValue : {
                    $type : "json:Integer",
                    $description : "The maximum value of the integer. Must be superior to $minValue, if both are provided."
                }
            }
        },
        "Float" : {
            $type : "Element",
            $description : "Correspond to a floating point number. Its acceptable range can be restricted by the use of the $minValue and $maxValue properties in the schema.",
            $properties : {
                $minValue : {
                    $type : "json:Float",
                    $description : "The minimum value of the floating point number. Must be inferior to $maxValue, if both are provided."
                },
                $maxValue : {
                    $type : "json:Float",
                    $description : "The maximum value of the floating point number. Must be inferior to $maxValue, if both are provided."
                }
            }
        },
        "Date" : {
            $type : "Element",
            $description : "Correspond to a date string that can be converted to a JavaScript date"
        },
        "RegExp" : {
            $type : "Element",
            $description : "Correspond to a JavaScript regular expression."
        },
        "ObjectRef" : {
            $type : "Element",
            $description : "Correspond to any JavaScript object, but whose properties will not be checked with the schema.",
            $properties : {
                "$classpath" : {
                    $type : "json:PackageName",
                    $description : "If defined, the object will be checked that it is an instance of a class with that classpath."
                }
            }
        },
        "FunctionRef" : {
            $type : "Element",
            $description : "Correspond to a JavaScript function."
        },
        "JsonProperty" : {
            $type : "Element",
            $description : "Any string or integer that can be used as JSON property - must not be a JavaScript reserved word to avoid potential issues with some browsers"
        },
        "Enum" : {
            $type : "Element",
            $description : "String that can only take a limited number of values - which must be described in the $enumValues Array associated to the element description",
            $properties : {
                "$enumValues" : {
                    $type : "json:Array",
                    $description : "Array of accepted string values for the enum.",
                    $contentType : {
                        $type : "json:String",
                        $mandatory : true,
                        $description : "A possible value for the enum."
                    }
                }
            }
        },

        // Complex Types (contain sub elements)
        "Object" : {
            $type : "Element",
            $description : "Correspond a structure to with defined parameters : unlike maps, property names are clearly defined. However properties may not be present if not mandatory, and if object is not restricted, other properties might be available. Object description, property name and types must be described in the $properties map of the object schema.",
            $properties : {
                "$properties" : {
                    $type : "json:Map",
                    $description : "The list of all properties associated to the object. These properties will complement or override the properties defined in the object's parent (cf. $type value).",
                    $contentType : {
                        $type : "Bean",
                        $mandatory : true,
                        $description : "Type of the property."
                    }
                },
                "$restricted" : {
                    $type : "json:Boolean",
                    $description : "Specifies if the object may or may not accept properties not defined in its definition. Default is restricted.",
                    $default : true
                },
                "$fastNorm" : {
                    $type : "json:FunctionRef",
                    $description : "Fast normalization function for this type. Automatically added by the framework."
                },
                "$getDefault" : {
                    $type : "json:FunctionRef",
                    $description : "Return default value. Automatically added by the framework."
                }
            }
        },
        "Array" : {
            $type : "Element",
            $description : "Correspond to variable-length structure where items are indexed with an integer (first = 0). An array contains items of the same type (which can be a MultiTypes), which is described in the $contentType object of the schema description.",
            $properties : {
                "$contentType" : {
                    $type : "Bean",
                    $description : "Type of each element in the array."
                },
                "$fastNorm" : {
                    $type : "json:FunctionRef",
                    $description : "Fast normalization function for this type. Automatically added by the framework."
                },
                "$getDefault" : {
                    $type : "json:FunctionRef",
                    $description : "Return default value. Automatically added by the framework."
                }
            }
        },
        "Map" : {
            $type : "Element",
            $description : "Like Arrays, Maps correspond to variable-length structure - but contrary to Arrays, Map items are indexed with strings. A map contains items of the same type (which can be a MultiTypes), which is described in the $contentType object of the schema description.",
            $properties : {
                "$contentType" : {
                    $type : "Bean",
                    $description : "Type of each element in the map."
                },
                "$keyType" : {
                    $type : "Bean",
                    $description : "Type of each key in the map (this type must be a subtype of String)."
                },
                "$fastNorm" : {
                    $type : "json:FunctionRef",
                    $description : "Fast normalization function for this type. Automatically added by the framework."
                },
                "$getDefault" : {
                    $type : "json:FunctionRef",
                    $description : "Return default value. Automatically added by the framework."
                }
            }
        },
        "MultiTypes" : {
            $type : "Element",
            $description : "A multi type element is an element that can reference items of different types. As such, its possible types should be described in the $contentTypes array of the schema description.",
            $properties : {
                "$contentTypes" : {
                    $type : "json:Array",
                    $description : "Array of the different accepted types.",
                    $contentType : {
                        $type : "Bean",
                        $mandatory : true
                    }
                }
            }
        }
    }
});
