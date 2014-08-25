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
    $package : "aria.utils.css.AnimationsBean",
    $description : "Definition of parameters used by Animations class",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "AnimationCfg" : {
            $type : "json:Object",
            $description : "Parameters for aria.utils.css.Animations",
            $properties : {
                "from" : {
                    $type : "json:ObjectRef",
                    $description : "HTMLElement to animate out"
                },
                "to" : {
                    $type : "json:ObjectRef",
                    $description : "HTMLElement to animate in"
                },
                "reverse" : {
                    $type : "json:Boolean",
                    $description : "property that activates the reverse of the animation called"
                },
                "type" : {
                    $type : "json:Integer",
                    $description : "type of animation to activate (1: normal/2: with hardware acceleration/3: 3D)"
                },
                "hiddenClass" : {
                    $type : "json:String",
                    $description : "className to apply to the element animate out and to remove from the element animate in"
                }
            }
        },
        "AnimationName" : {
            $type : "json:MultiTypes",
            $description : "The name of the animation",
            $sample : "slide left",
            $contentTypes : [{
                $type : "json:Enum",
                $description : "Predefined framework animation",
                $enumValues : ["slide left", "slide right", "slide up", "slide down", "fade", "fade reverse",
                    "pop", "pop reverse", "flip", "flip reverse"]
            }, {
                $type : "json:String",
                $description : "Custom animation"
            }]
        }
    }
});
