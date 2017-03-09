/*
 * Copyright 2017 Amadeus s.a.s.
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
    $package : "app.SampleBean",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Ancestor1" : {
            $type : "json:Object",
            $properties : {
                "text1" : {
                    $type : "json:String",
                    $default : "defValue1"
                },
                "text2" : {
                    $type : "json:String",
                    $default : "defValue2"
                },
                "obj" : {
                    $type : "json:Object",
                    $default : {},
                    $properties : {
                        "subProperty1" : {
                            $type : "json:String",
                            $default : "defV1"
                        }
                    }
                }
            }
        },
        "Ancestor2" : {
            $type : "Ancestor1"
        },
        "Ancestor3" : {
            $type : "Ancestor2",
            $properties : {
                "text3" : {
                    $type : "json:String",
                    $default : "defValue3"
                },
                "text4" : {
                    $type : "json:String",
                    $default : "defValue4"
                }
            }
        },
        "Child" : {
            $type : "Ancestor3",
            $properties : {
                "text1" : {
                    $type : "Ancestor3.text1",
                    $default : "defChildTextV1"
                },
                "text3" : {
                    $type : "Ancestor3.text3",
                    $default : "defChildTextV3"
                },
                "obj": {
                    $type : "Ancestor3.obj",
                    $default : {},
                    $properties : {
                        "subProperty1" : {
                            $type: "Ancestor3.obj.subProperty1",
                            $default : "defChildV1"
                        },
                        "subProperty2" : {
                            $type: "json:String",
                            $default : "defChildV2"
                        }
                    }
                }
            }
        },
        "Tree" : {
            $type : "json:Object",
            $properties : {
                "value1" : {
                    $type : "json:Integer",
                    $default : 3
                },
                "subTrees" : {
                    $type : "json:Array",
                    $default : [],
                    $contentType : {
                        $type : "Tree"
                    }
                },
                "value2" : {
                    $type : "json:Integer",
                    $default : 7
                },
                "structure" : {
                    $type : "json:Object",
                    $default : {
                        value4 : 50
                    },
                    $properties : {
                        "value3" : {
                            $type : "json:Integer",
                            $default : 12
                        },
                        "value4" : {
                            $type : "json:Integer",
                            $default : 70
                        }
                    }
                },
                "child" : {
                    $type : "Child"
                },
                "ancestor3" : {
                    $type : "Ancestor3"
                },
                "ancestor2" : {
                    $type : "Ancestor2"
                },
                "ancestor1" : {
                    $type : "Ancestor1"
                }
            }
        }
    }
});