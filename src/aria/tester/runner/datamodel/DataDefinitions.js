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
var Aria = require("../../../Aria");
var ariaCoreJsonTypes = require("../../../core/JsonTypes");


/**
 *
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.tester.runner.datamodel.DataDefinitions",
    $description : "Definitions for todo object",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "Root" : {
            $type : "json:Object",
            $description : "Root note for the test runner datamodel",
            $properties : {
                "campaign" : {
                    $type : "Campaign",
                    $description : "Current campaign hosted by the runner",
                    $default : {}
                },
                "flow" : {
                    $type : "json:Object",
                    $description : "Flow data",
                    $properties : {
                        "currentState" : {
                            $type : "json:String",
                            $description : "currentState of the flow",
                            $default : ""
                        }
                    },
                    $default : {}
                },
                "application" : {
                    $type : "json:Object",
                    $description : "Application data : misc information, configuration etc ...",
                    $properties : {
                        "configuration" : {
                            $type : "json:Object",
                            $description : "",
                            $properties : {
                                "coverage" : {
                                    $type : "json:Boolean",
                                    $description : "",
                                    $default : false
                                }
                            },
                            $default : {}
                        }
                    },
                    $default : {}
                },
                "view" : {
                    $type : "json:Object",
                    $description : "View data",
                    $properties : {
                        "filter" : {
                            $type : "json:Object",
                            $description : "",
                            $properties : {
                                "type" : {
                                    $type : "json:String",
                                    $description : "",
                                    $default : "all"
                                }
                            },
                            $default : {}
                        },
                        "configuration" : {
                            $type : "json:Object",
                            $description : "",
                            $properties : {
                                "mini" : {
                                    $type : "json:Boolean",
                                    $description : "",
                                    $default : false
                                }
                            },
                            $default : {}
                        },
                        "scrollPositions" : {
                            $type : "json:Object",
                            $description : "map of scroll positions by id",
                            $default : {}
                        }
                    },
                    $default : {}
                }
            },
            $default : {}
        },
        "Campaign" : {
            $type : "json:Object",
            $description : "Wrapper around a test object with reporting information",
            $properties : {
                "rootClasspath" : {
                    $type : "json:String",
                    $description : "Classpath of the root test object to load and use",
                    $default : "MainTestSuite"
                },
                "currentClasspath" : {
                    $type : "json:String",
                    $description : "Classpath of the test currently executed in the scope of this campaign",
                    $default : ""
                },
                "progress" : {
                    $type : "json:Integer",
                    $description : "[0,100] Progress percentage.",
                    $default : 0
                },
                "report" : {
                    $type : "Report",
                    $description : "",
                    $default : {}
                },
                "tests" : {
                    $type : "json:Array",
                    $description : "",
                    $contentType : {
                        $type : "Test",
                        $description : "",
                        $default : {}
                    },
                    $default : []
                },
                "testsTree" : {
                    $type : "json:Array",
                    $description : "",
                    $contentType : {
                        $type : "TestWrapper",
                        $description : "",
                        $default : {}
                    },
                    $default : []
                },
                "errorCount" : {
                    $type : "json:Integer",
                    $description : "All the failures that occured during the current campaign",
                    $default : 0
                }
            },
            $default : {}
        },
        "Report" : {
            $type : "json:Object",
            $description : "",
            $properties : {},
            $default : {}
        },
        "Test" : {
            $type : "json:Object",
            $description : "",
            $properties : {},
            $default : {}
        },
        "TestWrapper" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "classpath" : {
                    $type : "json:String",
                    $description : "Classpath of the test object",
                    $default : ""
                },
                "instance" : {
                    $type : "json:Object",
                    $description : "Instance of the test object",
                    $default : null
                }
            },
            $default : {}
        },
        "Failure" : {
            $type : "json:Object",
            $description : "",
            $properties : {},
            $default : {}
        }
    }
});
