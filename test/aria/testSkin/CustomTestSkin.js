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
// Skin configuration: Custom Skin for testing
Aria.classDefinition({
    $classpath : 'aria.widgets.AriaSkin',
    $singleton : true,
    $prototype : {
        skinName : "customTestSkin",
        skinObject : {
            "general" : {
                "imagesRoot" : "test/aria/widgets",
                "font" : {
                    "family" : "Arial,Tahoma, sans-serif",
                    "size" : 14
                },
                "externalCSS" : ["/skin/ExternalStyle.css"]
            },
            "Icon" : {
                "std" : {
                    "content" : {
                        "camera-retro" : "fa fa-camera-retro",
                        "spinner" : "fa fa-spinner fa-spin",
                        "home" : "fa fa-home",
                        "pencil" : "fa fa-pencil",
                        "cog" : "fa fa-cog",
                        "cog-spinner" : "fa fa-cog fa-spin",
                        "refresh" : "fa fa-refresh fa-spin",
                        "circle" : "fa fa-circle-o-notch fa-spin",
                        "shield" : "fa fa-shield",
                        "terminal" : "fa fa-terminal",
                        "shield-90" : "fa fa-shield fa-rotate-90",
                        "shield-180" : "fa fa-shield fa-rotate-180"
                    }
                }
            }
        }
    }
});
