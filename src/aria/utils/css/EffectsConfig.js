(function() {
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


var HORIZONTAL = 1;
var VERTICAL = 2;
var COMPOSITE = 3;

/**
 *
 */
Aria.classDefinition({
    $classpath : "aria.utils.css.EffectsConfig",
    $singleton : true,
    $statics : {
        // animation interval in ms
        DEFAULT_EASING : "linear",
        DEFAULT_INTERVAL : 20,
        DEFAULT_DURATION : 1000,
        DEFAULT_QUEUE_KEY : "default",
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
                subProperties : ["borderLeftWidth", "borderRightWidth","borderBottomWidth", "borderTopWidth"],
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
//              note that the percentage of marginBottom is computed against the WIDTH  (W3C)
                orientation : HORIZONTAL
            },
            marginLeft : {
                orientation : HORIZONTAL
            },
            marginRight : {
                orientation : HORIZONTAL
            },
            marginTop : {
//              note that the percentage of marginTop is computed against the WIDTH  (W3C)
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
                hProperties : ["paddingLeft", "paddingRight","paddingBottom", "paddingTop"]
            },
            paddingBottom : {
//              note that the percentage of paddingBottom is computed against the WIDTH  (W3C)
                orientation : HORIZONTAL
            },
            paddingLeft : {
                orientation : HORIZONTAL
            },
            paddingRight : {
                orientation : HORIZONTAL
            },
            paddingTop : {
//              note that the percentage of marginTop is computed against the WIDTH  (W3C)
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
            }
        }


    },
    $prototype : {

    }
});
})();
