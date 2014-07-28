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

Aria.classDefinition({
    $classpath : "app.css.AutocompleteSkin",
    $singleton : true,
    $prototype : {
        skinObject : {
            "std" : {
                "backgroundColor" : "white",
                "borderRadius" : "6px",
                "border" : "1px solid #DFDFDF",
                "padding" : "5px",
                "width" : "400px",
                "item" : {
                    "background" : "white",
                    "color" : "black",
                    "padding" : "5px"
                },
                "disabledItem" : {
                    "background" : "white",
                    "color" : "#CCC"
                },
                "selectedItem" : {
                    "background" : "#0088CC",
                    "color" : "white"
                },
                "mouseOverItem" : {
                    "background" : "#0088CC",
                    "color" : "white"
                }
            },
            "marker" : {
                "backgroundColor" : "#f8f8f8",
                "borderRadius" : "6px",
                "border" : "1px solid #22ade6",
                "padding" : "5px",
                "width" : "400px",
                "item" : {
                    "background" : "#f8f8f8",
                    "color" : "black",
                    "padding" : "5px"
                },
                "disabledItem" : {
                    "background" : "#F5FF00",
                    "color" : "#CCC"
                },
                "selectedItem" : {
                    "background" : "#F5FF00",
                    "color" : "black"
                },
                "mouseOverItem" : {
                    "background" : "#FCD27B",
                    "color" : "black"
                }
            }
        }
    }
});
