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
var Aria = require("../../Aria");
var ariaCoreJsonTypes = require("../../core/JsonTypes");


module.exports = Aria.beanDefinitions({
    $package : "aria.utils.dragdrop.DragDropBean",
    $description : "Definition of parameters used by Drag/Drop classes",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "DragCfg" : {
            $type : "json:Object",
            $description : "Parameters for aria.utils.dragdrop.Drag constructor",
            $properties : {
                "handle" : {
                    $type : "json:MultiTypes",
                    $description : "This is the element from which drag can be initialized by the user.",
                    $contentTypes : [{
                                $type : "json:String",
                                $description : "Element ID"
                            }, {
                                $type : "json:ObjectRef",
                                $description : "HTML Element"
                            }]
                },

                "cursor" : {
                    $type : "json:String",
                    $description : "css cursor property to be added on the draggable element or the handle. If not specified no value will be added."
                },

                "proxy" : {
                    $type : "ProxyCfg",
                    $description : ""
                },
                "constrainTo" : {
                    $type : "json:MultiTypes",
                    $description : "Element to which the movement should be constrained.",
                    $contentTypes : [{
                                $type : "json:String",
                                $description : "Can be only aria.utils.Dom.VIEWPORT"
                            }, {
                                $type : "json:String",
                                $description : "Id of the element"
                            }, {
                                $type : "json:ObjectRef",
                                $description : "HTML Element"
                            }]
                },
                "axis" : {
                    $type : "json:Enum",
                    $description : "Direction of the movement",
                    $enumValues : ["x", "y"]
                }
            }
        },

        "ProxyCfg" : {
            $type : "json:Object",
            $description : "Configuration object for the element that moves with the mouse.",
            $properties : {
                "type" : {
                    $type : "json:Enum",
                    $description : "Type of proxy. It corresponds to the class aria.utils.overlay.[type]",
                    $enumValues : ["Overlay", "CloneOverlay"]
                },

                "cfg" : {
                    $type : "json:ObjectRef",
                    $description : "Argument passed to the constructor of the overlay described by type."
                }
            }
        }
    }
});
