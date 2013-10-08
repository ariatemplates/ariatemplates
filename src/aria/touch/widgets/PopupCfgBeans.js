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

Aria.beanDefinitions({
    $package : "aria.touch.widgets.PopupCfgBeans",
    $description : "Popup config beans",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "common" : "aria.widgetLibs.CommonBeans",
        "base" : "aria.html.beans.ElementCfg",
        "dom" : "aria.utils.DomBeans",
        "templates" : "aria.templates.CfgBeans",
        "animation" : "aria.utils.css.AnimationsBean",
        "popup" : "aria.popups.Beans"
    },
    $beans : {
        "PopupCfg" : {
            $type : "json:Object",
            $description : "Configuration object for the aria.touch.widgets.Popup",
            $properties : {
                "id" : {
                    $type : "json:String",
                    $description : "Id of the widget"
                },
                "contentMacro" : {
                    $type : "templates:MacroCfg",
                    $description : "The macro that will be used as popup content, Browser will freeze if it does not find this property  as part of widget or bindable property"
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
                    $description : "{HTMLElement} The DOM reference which will be used as the reference position for the tooltip",
                    $default : null
                },
                "referenceId" : {
                    $type : "json:String",
                    $description : "The id of the reference which will be used for position of the tooltip the tooltip.",
                    $default : null
                },
                "absolutePosition" : {
                    $type : "popup:AbsolutePositionConfig",
                    $description : "Takes priority over domReference if defined. The exact coordinates where the popup should be displayed. Anchors and offsets will still be applied",
                    $default : null
                },
                "center" : {
                    $type : "json:Boolean",
                    $description : "If true, the popup will be in the center of the browser window. This takes priority over absolutePosition and domReference.",
                    $default : false
                },
                "maximized" : {
                    $type : "json:Boolean",
                    $description : "If true, the popup will be moved towards top left of the browser window and occupy the whole viewport. This takes priority over center. Implemented only by Popup.",
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
                        $type : "popup:PreferredPosition",
                        $mandatory : true,
                        $description : "A preferred position. The order indicates the order of preference."
                    },
                    $default : [{}]
                },
                "offset" : {
                    $type : "popup:OffsetConfig",
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
                },
                "htmlContent" : {
                    $type : "json:String",
                    $description : "The popup's HTML content"
                },
                "bind" : {
                    $type : "base:Properties.$properties.bind",
                    $properties : {
                        "visible" : {
                            $type : "common:BindingRef",
                            $description : "Bi-directional binding. shows/hides the dialog window"
                        }
                    }
                }
            }
        }
    }
});
