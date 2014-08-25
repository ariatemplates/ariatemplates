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


(function () {

    var HORIZONTAL = 1;
    var VERTICAL = 2;
    var COMPOSITE = 3;

    module.exports = Aria.classDefinition({
        $classpath : "aria.utils.css.PropertiesConfig",
        $singleton : true,
        $statics : {
            UNITS : ["em", "%", "px", "ex", "cm", "mm", "in", "pt", "pc"],
            HORIZONTAL : HORIZONTAL,
            VERTICAL : VERTICAL,
            COMPOSITE : COMPOSITE,

            PROPERTIES : {
                backgroundPositionX : {
                    orientation : HORIZONTAL
                },
                backgroundPositionY : {
                    orientation : VERTICAL
                },
                borderWidth : {
                    orientation : COMPOSITE,
                    subProperties : ["borderLeftWidth", "borderRightWidth", "borderBottomWidth", "borderTopWidth"],
                    percentNotAdmitted : true
                },
                borderBottomWidth : {
                    orientation : VERTICAL,
                    percentNotAdmitted : true
                },
                borderLeftWidth : {
                    orientation : HORIZONTAL,
                    percentNotAdmitted : true
                },
                borderRightWidth : {
                    orientation : HORIZONTAL,
                    percentNotAdmitted : true
                },
                borderTopWidth : {
                    orientation : VERTICAL,
                    percentNotAdmitted : true
                },
                borderSpacing : {
                    orientation : COMPOSITE,
                    percentNotAdmitted : true
                },
                margin : {
                    orientation : COMPOSITE,
                    subProperties : ["marginLeft", "marginRight", "marginBottom", "marginTop"]
                },
                marginBottom : {
                    // note that the percentage of marginBottom is computed against the WIDTH (W3C)
                    orientation : HORIZONTAL
                },
                marginLeft : {
                    orientation : HORIZONTAL
                },
                marginRight : {
                    orientation : HORIZONTAL
                },
                marginTop : {
                    // note that the percentage of marginTop is computed against the WIDTH (W3C)
                    orientation : HORIZONTAL
                },
                opacity : {
                    percentNotAdmitted : true
                },
                outlineWidth : {
                    orientation : COMPOSITE,
                    percentNotAdmitted : true
                },
                padding : {
                    orientation : COMPOSITE,
                    hProperties : ["paddingLeft", "paddingRight", "paddingBottom", "paddingTop"]
                },
                paddingBottom : {
                    // note that the percentage of paddingBottom is computed against the WIDTH (W3C)
                    orientation : HORIZONTAL
                },
                paddingLeft : {
                    orientation : HORIZONTAL
                },
                paddingRight : {
                    orientation : HORIZONTAL
                },
                paddingTop : {
                    // note that the percentage of marginTop is computed against the WIDTH (W3C)
                    orientation : HORIZONTAL
                },
                height : {
                    orientation : VERTICAL
                },
                width : {
                    orientation : HORIZONTAL
                },
                maxHeight : {
                    orientation : VERTICAL
                },
                maxWidth : {
                    orientation : HORIZONTAL
                },
                minHeight : {
                    orientation : VERTICAL
                },
                minWidth : {
                    orientation : HORIZONTAL
                },
                fontSize : {
                    orientation : VERTICAL,
                    percentOfFontSize : true
                },
                bottom : {
                    orientation : VERTICAL
                },
                left : {
                    orientation : HORIZONTAL
                },
                right : {
                    orientation : HORIZONTAL
                },
                top : {
                    orientation : VERTICAL
                },
                letterSpacing : {
                    orientation : HORIZONTAL,
                    percentNotAdmitted : true
                },
                wordSpacing : {
                    orientation : HORIZONTAL,
                    percentNotAdmitted : true
                },
                lineHeight : {
                    orientation : VERTICAL,
                    percentOfFontSize : true
                },
                textIndent : {
                    orientation : HORIZONTAL
                },
                scrollTop : {
                    orientation : VERTICAL,
                    notStyleProperty : true
                },
                scrollLeft : {
                    orientation : HORIZONTAL,
                    notStyleProperty : true
                },
                backgroundColor : {
                    percentNotAdmitted : true,
                    isColor : true
                },
                borderBottomColor : {
                    percentNotAdmitted : true,
                    isColor : true
                },
                borderLeftColor : {
                    percentNotAdmitted : true,
                    isColor : true
                },
                borderRightColor : {
                    percentNotAdmitted : true,
                    isColor : true
                },
                borderTopColor : {
                    percentNotAdmitted : true,
                    isColor : true
                },
                color : {
                    percentNotAdmitted : true,
                    isColor : true
                },
                columnRuleColor : {
                    percentNotAdmitted : true,
                    isColor : true
                },
                outlineColor : {
                    percentNotAdmitted : true,
                    isColor : true
                },
                textDecorationColor : {
                    percentNotAdmitted : true,
                    isColor : true
                },
                textEmphasisColor : {
                    percentNotAdmitted : true,
                    isColor : true
                }
            },

            COLORS : {
                "aqua" : "#00ffff",
                "black" : "#000000",
                "blue" : "#0000ff",
                "fuchsia" : "#ff00ff",
                "gray" : "#808080",
                "green" : "#008000",
                "lime" : "#00ff00",
                "maroon" : "#800000",
                "navy" : "#000080",
                "olive" : "#808000",
                "orange" : "#ffa500",
                "purple" : "#800080",
                "red" : "#ff0000",
                "silver" : "#c0c0c0",
                "teal" : "#008080",
                "white" : "#ffffff",
                "yellow" : "#ffff00"
            }

        },
        $prototype : {

    }
    });
})();
