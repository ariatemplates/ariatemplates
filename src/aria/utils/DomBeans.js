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
var ariaCoreJsonTypes = require("../core/JsonTypes");


/**
 * @class aria.utils.DomBeans Configuration beans for frequently used DOM description objects
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.utils.DomBeans",
    $description : "",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "Size" : {
            $type : "json:Object",
            $description : "Object description for the size of bi-dimensional object",
            $properties : {
                "width" : {
                    $type : "json:Float",
                    $description : "Width value of the Size object",
                    $default : 0
                },
                "height" : {
                    $type : "json:Float",
                    $description : "Height value of the Size object",
                    $default : 0
                }
            }
        },
        "Position" : {
            $type : "json:Object",
            $description : "Object description for the position of bi-dimensional object",
            $properties : {
                "top" : {
                    $type : "json:Float",
                    $description : "Top value of the Position object",
                    $default : 0
                },
                "left" : {
                    $type : "json:Float",
                    $description : "Left value of the Position object",
                    $default : 0
                },
                "scrollTop" : {
                    $type : "json:Float",
                    $description : "The total scrolling offset (Top)",
                    $default : 0
                },
                "scrollLeft" : {
                    $type : "json:Float",
                    $description : "The total scrolling offset (Left)",
                    $default : 0
                }
            }
        },
        "Geometry" : {
            $type : "json:Object",
            $description : "Object description for the geometry of bi-dimensional object",
            $properties : {
                "y" : {
                    $type : "json:Float",
                    $description : "y coordinate of the top-left corner",
                    $default : 0
                },
                "x" : {
                    $type : "json:Float",
                    $description : "x coordinate of the top-left corner",
                    $default : 0
                },
                "width" : {
                    $type : "json:Float",
                    $description : "Width of an element",
                    $default : 0
                },
                "height" : {
                    $type : "json:Float",
                    $description : "Height of an element",
                    $default : 0
                }
            }
        }
    }
});
