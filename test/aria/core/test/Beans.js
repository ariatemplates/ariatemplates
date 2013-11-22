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

Aria.beanDefinitions({
    $package : "test.aria.core.test.Beans",
    $description : "Definition of some beans to test the JSON validator",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "StringTest" : {
            $type : "json:String",
            $description : ""
        },
        "StringRegExpTest" : {
            $type : "json:String",
            $description : "",
            $regExp : /^my(new)?Regexp$/
        },
        "InheritStringRegExpTest" : {
            $type : "StringRegExpTest",
            $description : "",
            $regExp : /new/
        },
        "BooleanTest" : {
            $type : "json:Boolean",
            $description : ""
        },
        "IntegerTest" : {
            $type : "json:Integer",
            $description : "",
            $minValue : -100,
            $maxValue : 200
        },
        "FloatTest" : {
            $type : "json:Float",
            $description : "",
            $minValue : -100.1,
            $maxValue : 200.2
        },
        "DateTest" : {
            $type : "json:Date",
            $description : ""
        },
        "RegExpTest" : {
            $type : "json:RegExp",
            $description : ""
        },
        "ObjectRefTest" : {
            $type : "json:ObjectRef",
            $description : ""
        },
        "SequencerTest" : {
            $type : "json:ObjectRef",
            $description : "",
            $classpath : "aria.core.Sequencer"
        },
        "FunctionRefTest" : {
            $type : "json:FunctionRef",
            $description : ""
        },
        "JsonPropertyTest" : {
            $type : "json:JsonProperty",
            $description : ""
        },
        "EnumTest" : {
            $type : "json:Enum",
            $description : "",
            $enumValues : ["myValue1", "myValue2"]
        },
        "ObjectTest" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "property1" : {
                    $type : "StringRegExpTest"
                }
            }
        },
        "ComplexObjectTest" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "subObject" : {
                    $type : "json:Object",
                    $description : "",
                    $properties : {
                        "subSubObject" : {
                            $type : "SubPropertyTest",
                            $description : "",
                            $default : {}
                        }
                    }
                }
            }
        },
        "SubPropertyTest" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "property1" : {
                    $type : "StringTest",
                    $default : "someString"
                }
            }
        },
        "ArrayTest" : {
            $type : "json:Array",
            $description : "",
            $contentType : {
                $type : "StringRegExpTest"
            }
        },
        "MapTest" : {
            $type : "json:Map",
            $description : "",
            $contentType : {
                $type : "StringRegExpTest"
            }
        },
        "MapTestWithKeyType" : {
            $type : "json:Map",
            $description : "",
            $keyType : {
                $type : "json:String",
                $description : "",
                $regExp : /^...$/
                // a three characters key
            },
            $contentType : {
                $type : "BooleanTest"
            }
        },
        "MultiTypesTest" : {
            $type : "json:MultiTypes",
            $description : ""
        },
        "MandatoryTest" : {
            $type : "json:ObjectRef",
            $description : "",
            $mandatory : true
        },
        "NotMandatoryTest" : {
            $type : "json:ObjectRef",
            $description : "",
            $mandatory : false
        },

        // test for inheritance
        "InheritanceBase" : {
            $type : "json:Object",
            $description : "Base for inheritance test",
            $default : {}
        },

        // test for inheritance
        "InheritanceExtended" : {
            $type : "InheritanceBase",
            $description : "parent for inheritance test",
            $properties : {
                "property1" : {
                    $type : "json:String",
                    $default : "someString",
                    $description : "Some property"
                }
            }
        },

        // test that default objects are correctly stringified when setting the $getDefault methods
        "DefaultTest" : {
            $type : "json:Object",
            $description : "Bean with a default whose keys have to be escaped",
            $properties : {
                "myObject" : {
                    $type : "json:Map",
                    $description : "My Object",
                    $contentType : {
                        $type : "json:PackageName"
                    },
                    $default : {
                        "text/html" : "my.package.name"
                    }

                }
            }
        }
    }

});
