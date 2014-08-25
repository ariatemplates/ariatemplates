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
var ariaUtilsCssAnimationsBean = require("../utils/css/AnimationsBean");


/**
 * Configuration Beans for aria.popups.Popup
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.popups.Beans",
    $description : "Definition of the JSON beans used to set application variables",
    $namespaces : {
        "json" : ariaCoreJsonTypes,
        "animation" : ariaUtilsCssAnimationsBean
    },
    $beans : {
        "PopupConf" : {
            $type : "json:Object",
            $description : "Configuration object for the aria.popups.Popup",
            $properties : {
                "section" : {
                    $type : "json:ObjectRef",
                    $description : "{aria.templates.Section} The section used to create the content of the popup",
                    $mandatory : true
                },
                "keepSection" : {
                    $type : "json:Boolean",
                    $description : "If true, the section is not disposed when the popup is closed (its content only is removed).",
                    $default : false
                },
                "modal" : {
                    $type : "json:Boolean",
                    $description : "If true, a mask is shown behind the popup so that mouse and keyboard interraction with elements behind the popup is not possible.",
                    $default : false
                },
                "maskCssClass" : {
                    $type : "json:String",
                    $description : "CSS classes to be applied on the mask. Only used if modal is true. If not specified, a default style is applied."
                },
                "domReference" : {
                    $type : "json:ObjectRef",
                    $description : "{HTMLElement} The DOM reference which will be used as the reference position for the popup",
                    $default : null
                },
                "absolutePosition" : {
                    $type : "AbsolutePositionConfig",
                    $description : "The exact coordinates where the popup should be displayed. The position of the popup is computed firstly with respect to the domReference, if it is provided in the configuration. The computed positions are then overridden by the properties specified inside absolutePosition.",
                    $default : null
                },
                "center" : {
                    $type : "json:Boolean",
                    $description : "If true, the popup will be in the center of the browser window. This takes priority over absolutePosition and domReference.",
                    $default : false
                },
                "maximized" : {
                    $type : "json:Boolean",
                    $description : "If true, the popup will be moved towards top left of the browser window and occupy the whole viewport. This takes priority over center. Implemented only by Dialog.",
                    $default : false
                },
                "closeOnMouseClick" : {
                    $type : "json:Boolean",
                    $description : "Close the popup when the user clicks outside of the popup",
                    $default : true
                },
                "closeOnMouseScroll" : {
                    $type : "json:Boolean",
                    $description : "Close the popup when the user scrolls outside of the popup",
                    $default : true
                },
                "closeOnMouseOut" : {
                    $type : "json:Boolean",
                    $description : "Close the popup when the user leaves the popup, after a delay, set in closeOnMouseOutDelay",
                    $default : false
                },
                "closeOnMouseOutDelay" : {
                    $type : "json:Integer",
                    $description : "Delay before closing the popup when the user leaves the popup",
                    $default : 500
                },
                "preferredPositions" : {
                    $type : "json:Array",
                    $description : "Array of positions such as 'bottom right' to describe the relative position of the popup with its reference.",
                    $contentType : {
                        $type : "PreferredPosition",
                        $mandatory : true,
                        $description : "A preferred position. The order indicates the order of preference."
                    },
                    $default : [{}]
                },
                "offset" : {
                    $type : "OffsetConfig",
                    $description : "Offset for displaying the popup",
                    $default : {}
                },
                "ignoreClicksOn" : {
                    $type : "json:Array",
                    $description : "Array of HTMLElements. The popup should not close when one of the elements are clicked.",
                    $contentType : {
                        $type : "json:ObjectRef",
                        $description : "(HTMLElement)"
                    },
                    $default : [{}]
                },
                "parentDialog" : {
                    $type : "json:ObjectRef",
                    $description : "[Optional] The dialog the popup belongs to",
                    $default : null
                },
                "preferredWidth" : {
                    $type : "json:Integer",
                    $description : "Width of the popup in px - if negative, the width is computed dynamically depending on the content.",
                    $default : -1
                },
                "animateOut" : {
                    $type : "animation:AnimationName",
                    $description : "When the popup is being closed, the reverse of the animation is applied",
                    $sample : "slide left"
                },
                "animateIn" : {
                    $type : "animation:AnimationName",
                    $description : "When the popup is being opened, the animation is applied",
                    $sample : "slide left"
                }
            }
        },
        "PreferredPosition" : {
            $type : "json:Object",
            $description : "Couple of anchors describing the positionning between the popup and the reference.",
            $properties : {
                "reference" : {
                    $type : "json:String",
                    $description : "Anchor of the reference to use for this position setting",
                    $default : "bottom right"
                },
                "popup" : {
                    $type : "json:String",
                    $description : "Anchor of the reference to use for this position setting",
                    $default : "top left"
                },
                "offset" : {
                    $type : "OffsetConfig",
                    $description : "Offset to apply for this position"
                }
            }
        },
        "OffsetConfig" : {
            $type : "json:Object",
            $description : "Configuration object to describe the display offsets to adjust the position the popup",
            $properties : {
                "top" : {
                    $type : "json:Integer",
                    $description : "Offset to be applied between the top of the popup and the reference, when the popup anchor contains 'top'",
                    $default : 0
                },
                "bottom" : {
                    $type : "json:Integer",
                    $description : "Offset to be applied between the bottom of the popup and the reference, when the popup anchor contains 'bottom'",
                    $default : 0
                },
                "right" : {
                    $type : "json:Integer",
                    $description : "Offset to be applied between the right of the popup and the reference, when the popup anchor contains 'right'",
                    $default : 0
                },
                "left" : {
                    $type : "json:Integer",
                    $description : "Offset to be applied between the left of the popup and the reference, when the popup anchor contains 'left'",
                    $default : 0
                }
            }
        },
        "AbsolutePositionConfig" : {
            $type : "json:Object",
            $description : "Configuration object to describe the absolute positionning of the popup",
            $properties : {
                "top" : {
                    $type : "json:Float",
                    $description : "Top value of the AbsolutePosition object",
                    $default : null
                },
                "bottom" : {
                    $type : "json:Float",
                    $description : "Bottom value of the AbsolutePosition object",
                    $default : null
                },
                "right" : {
                    $type : "json:Float",
                    $description : "Right value of the AbsolutePosition object",
                    $default : null
                },
                "left" : {
                    $type : "json:Float",
                    $description : "Left value of the AbsolutePosition object",
                    $default : null
                }
            }
        }
    }
});
