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
    $classpath : "app.css.TextInputSkin",
    $singleton : true,
    $prototype : {

        skinObject : {
            "std" : {
                "normal" : {
                    "border" : "1px solid #DFDFDF",
                    "borderRadius" : "6px",
                    "color" : "black",
                    "backgroundColor" : "white",
                    "padding" : "5px",
                    "width" : "200px"
                },
                "focus" : {
                    "border" : "1px solid #DFDFDF",
                    "borderRadius" : "6px",
                    "color" : "black",
                    "backgroundColor" : "white"
                },
                "placeholder" : {
                    "color" : "grey",
                    "fontStyle" : "italic"
                }
            },
            "marker" : {
                "normal" : {
                    "border" : "1px solid #026c9c",
                    "borderRadius" : "6px",
                    "color" : "black",
                    "backgroundColor" : "#f8f8f8",
                    "padding" : "5px",
                    "width" : "200px"
                },
                "focus" : {
                    "border" : "1px solid #22ade6",
                    "borderRadius" : "6px",
                    "color" : "black",
                    "backgroundColor" : "#f8f8f8"
                },
                "placeholder" : {
                    "color" : "grey",
                    "fontStyle" : "italic"
                }
            }
        }
    }
});