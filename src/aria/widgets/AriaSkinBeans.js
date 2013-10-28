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

/**
 * The beans contained in this file describe the structure of a skin configuration in the aria.widgets.AriaSkin class.
 */
Aria.beanDefinitions({
    $package : "aria.widgets.AriaSkinBeans",
    $description : "Structure of a skin.",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Object" : {
            $type : "json:Object",
            $description : "",
            $default : {}
        },
        "Color" : {
            $type : "json:String",
            $description : "Description of the desired color in any accepted format."
        },
        "Pixels" : {
            $type : "json:Integer",
            $description : "Number of pixels for the property."
        },
        "Opacity" : {
            $type : "json:Float",
            $description : "",
            $minValue : 0,
            $maxValue : 100
        },
        "WidgetGeneralCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "font" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "size" : {
                            $type : "Pixels",
                            $description : "Font size inside the widgets (in pixels)."
                        },
                        "family" : {
                            $type : "json:String",
                            $description : "Font family inside the widgets."
                        }
                    }
                },
                "anchor" : {
                    $type : "Object",
                    $description : "Settings for anchors inside widgets.",
                    $properties : {
                        "states" : {
                            $type : "StatesSet",
                            $description : "",
                            $properties : {
                                "normal" : {
                                    $type : "AnchorState"
                                },
                                "link" : {
                                    $type : "AnchorState"
                                },
                                "visited" : {
                                    $type : "AnchorState"
                                },
                                "hover" : {
                                    $type : "AnchorState"
                                },
                                "focus" : {
                                    $type : "AnchorState"
                                }
                            }
                        }
                    }
                }
            }
        },
        "PageGeneralCfg" : {
            $type : "WidgetGeneralCfg",
            $description : "",
            $properties : {
                "imagesRoot" : {
                    $type : "json:String",
                    $description : "Root path for skin images (relative to Aria.rootFolderPath). It is supposed to end with a slash.",
                    $default : "css/"
                },
                "colors" : {
                    $type : "Object",
                    $description : "General color settings for your application",
                    $properties : {
                        "disabled" : {
                            $type : "Color",
                            // used in aria.widgets.calendar.CalendarStyle
                            $description : "Background color assigned to disabled elements."
                        }
                    }
                },
                "loadingOverlay" : {
                    $type : "Object",
                    $description : "General settings for loading indicators.",
                    $properties : {
                        "backgroundColor" : {
                            $type : "Color"
                        },
                        "spriteURL" : {
                            $type : "json:String",
                            $description : ""
                        },
                        "opacity" : {
                            $type : "Opacity",
                            $description : ""
                        }
                    }
                },
                "overlay" : {
                    $type : "Object",
                    $description : "General settings for overlays.",
                    $properties : {
                        "backgroundColor" : {
                            $type : "Color",
                            $default : "#ddd"
                        },
                        "opacity" : {
                            $type : "Opacity",
                            $description : "",
                            $default : 100
                        },
                        "border" : {
                            $type : "json:String",
                            $description : "",
                            $default : "1px solid black"
                        },
                        "borderTopLeftRadius" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "borderTopRightRadius" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "borderBottomLeftRadius" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "borderBottomRightRadius" : {
                            $type : "Pixels",
                            $default : 0
                        }
                    }
                },
                "dialogMask" : {
                    $type : "Object",
                    $description : "General settings for the mask displayed in modal dialogs.",
                    $properties : {
                        "backgroundColor" : {
                            $type : "Color",
                            $default : "black"
                        },
                        "opacity" : {
                            $type : "Opacity",
                            $description : "",
                            $default : 40
                        }
                    }
                },
                "disable" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "ul" : {
                            $type : "Object",
                            $description : "",
                            $properties : {
                                "list" : {
                                    $type : "Object",
                                    $description : "",
                                    $properties : {
                                        "style" : {
                                            $type : "json:Boolean",
                                            $description : "[Deprecated, please use a CSS file directly]"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "AnchorState" : {
            $type : "Object",
            $description : "[Deprecated, please use a CSS file directly] Settings for anchors.",
            $properties : {
                "color" : {
                    $type : "Color",
                    $description : "[Deprecated, please use a CSS file directly]"
                },
                "text" : {
                    $type : "Object",
                    $properties : {
                        "decoration" : {
                            $type : "json:String",
                            $description : "[Deprecated, please use a CSS file directly]"
                        }
                    }
                },
                "outline" : {
                    $type : "json:String",
                    $description : "[Deprecated, please use a CSS file directly]"
                }
            }
        },
        "Icons" : {
            $type : "json:String",
            $description : "Identifier for the icon to use. It has the syntax \"group:name\": the group is the key used to define the group of icons and the name represents the key used to refer to a specific icon inside the \"content\" property of the group of icons."
        },
        "IconsLeft" : {
            $type : "Icons",
            $description : "Identifier for the icon to place at the left of the widget. It has the syntax \"group:name\": the group is the key used to define the group of icons and the name represents the key used to refer to a specific icon inside the \"content\" property of the group of icons."
        },
        "IconsRight" : {
            $type : "Icons",
            $description : "Identifier for the icon to place at the right of the widget. It has the syntax \"group:name\": the group is the key used to define the group of icons and the name represents the key used to refer to a specific icon inside the \"content\" property of the group of icons."
        },
        "StatesSet" : {
            $type : "Object",
            $description : "Description of the properties to apply to a widget depending on the state in which it is. Every widget has at least a \"normal\" state."
        },
        "StateWithFrame" : {
            $type : "json:Object",
            $description : "Description of the properties to applied in a certain state of a widget which has a frame.",
            $properties : {
                "frame" : {
                    $type : "json:MultiTypes",
                    $description : "Description of the properties of a frame. The available properties depend on the type of frame that has been selected in the general widget skin settings.",
                    $contentTypes : [{
                                $type : "FixedHeightFrameStateCfg"
                            }, {
                                $type : "SimpleFrameStateCfg"
                            }, {
                                $type : "TableFrameStateCfg"
                            }, {
                                $type : "SimpleHTMLFrameStateCfg"
                            }]
                }
            },
            $default : {}
        },
        "StateWithFrameWithIconsAndLabel" : {
            $type : "StateWithFrame",
            $description : "Description of the properties to applied in a certain state of a widget which has a frame with icons.",
            $properties : {
                "icons" : {
                    $type : "json:Map",
                    $description : "",
                    $contentType : {
                        $type : "json:MultiTypes",
                        $description : "",
                        $contentTypes : [{
                                    $type : "json:Boolean",
                                    $description : ""
                                }, {
                                    $type : "Icons"
                                }]
                    }
                },
                "label" : {
                    $type : "LabelState"
                }
            }
        },
        "Frame" : {
            $type : "json:MultiTypes",
            $description : "General state-independent settings for the frame of a widget. This object allows to define the type of frame to use. Its properties can also be set on the parent object for backward compatibility.",
            $contentTypes : [{
                        $type : "FixedHeightFrameCfg"
                    }, {
                        $type : "SimpleFrameCfg"
                    }, {
                        $type : "TableFrameCfg"
                    }, {
                        $type : "SimpleHTMLFrameCfg"
                    }]
        },
        "LabelState" : {
            $type : "Object",
            $description : "Settings to display the label part of the widget.",
            $properties : {
                "color" : {
                    $type : "Color"
                }
            }
        },
        "ButtonCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "StateWithFrame"
                        },
                        "msdown" : {
                            $type : "StateWithFrame"
                        },
                        "msover" : {
                            $type : "StateWithFrame"
                        },
                        "normalFocused" : {
                            $type : "StateWithFrame"
                        },
                        "msoverFocused" : {
                            $type : "StateWithFrame"
                        },
                        "disabled" : {
                            $type : "StateWithFrame"
                        }
                    }
                },
                "frame" : {
                    $type : "Frame"
                },
                "simpleHTML" : {
                    $type : "json:Boolean",
                    $description : "true when the widget has to have a basic markup as close as possible to standard HTML. As a consequence, a frame of type \"SimpleHTML\" will be used, which basically means that no further frame markup will be added.",
                    $default : false
                },
                "label" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "fontWeight" : {
                            $type : "json:String",
                            $description : "",
                            $default : "normal"
                        }
                    }
                }
            }
        },
        "CalendarCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "generalBackgroundColor" : {
                    $type : "Color"
                },
                "monthTitleBorderColor" : {
                    $type : "Color",
                    $default : "#E6D9C6"
                },
                "monthTitleColor" : {
                    $type : "Color",
                    $default : "black"
                },
                "monthTitleBackgroundColor" : {
                    $type : "Color",
                    $default : "transparent"
                },
                "monthTitlePaddingTop" : {
                    $type : "json:String",
                    $description : "",
                    $default : "0px"
                },
                "monthTitlePaddingBottom" : {
                    $type : "json:String",
                    $description : "",
                    $default : "0px"
                },
                "monthTitleFontSize" : {
                    $type : "json:Integer"
                },
                "dayBorderColor" : {
                    $type : "Color"
                },
                "dayBackgroundColor" : {
                    $type : "Color",
                    $default : "transparent"
                },
                "dayColor" : {
                    $type : "Color",
                    $default : "black"
                },
                "dayPadding" : {
                    $type : "json:String",
                    $description : "",
                    $default : "0px"
                },
                "dayFontWeight" : {
                    $type : "json:String",
                    $description : "",
                    $default : "normal"
                },
                "weekEndBackgroundColor" : {
                    $type : "Color",
                    $default : "#F2ECDE"
                },
                "weekEndBorderColor" : {
                    $type : "Color",
                    $default : "#F2ECDE"
                },
                "weekEndColor" : {
                    $type : "Color",
                    $default : "black"
                },
                "unselectableBorderColor" : {
                    $type : "Color"
                },
                "unselectableBackgroundColor" : {
                    $type : "Color"
                },
                "unselectableColor" : {
                    $type : "Color"
                },
                "todayBorderColor" : {
                    $type : "Color",
                    $default : "black"
                },
                "todayBackgroundColor" : {
                    $type : "Color",
                    $default : "transparent"
                },
                "todayColor" : {
                    $type : "Color",
                    $default : "black"
                },
                "weekNumberBackgroundColor" : {
                    $type : "Color",
                    $default : "#E7DBC6"
                },
                "weekNumberBorderColor" : {
                    $type : "Color",
                    $default : "#E7DBC6"
                },
                "weekDaysLabelBackgroundColor" : {
                    $type : "Color",
                    $default : "transparent"
                },
                "weekDaysLabelBorderColor" : {
                    $type : "Color",
                    $default : "white"
                },
                "weekDaysLabelFontWeight" : {
                    $type : "json:String",
                    $description : "",
                    $default : "bold"
                },
                "weekDaysLabelColor" : {
                    $type : "Color",
                    $default : "black"
                },
                "weekDaysLabelPadding" : {
                    $type : "json:String",
                    $description : "",
                    $default : "0px"
                },
                "selectedBackgroundColor" : {
                    $type : "Color",
                    $default : "#FFCC66"
                },
                "selectedBorderColor" : {
                    $type : "Color",
                    $default : "black"
                },
                "selectedColor" : {
                    $type : "Color",
                    $default : "black"
                },
                "defaultTemplate" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the default template used to display the Calendar widget."
                },
                "divsclass" : {
                    $type : "json:String",
                    $description : "sclass of the Div to use inside the widget. It must be defined in the skin."
                },
                "fontSize" : {
                    $type : "json:Integer",
                    $default: 10
                },
                "mouseOverBackgroundColor" : {
                    $type : "Color"
                },
                "mouseOverColor" : {
                    $type : "Color"
                },
                "mouseOverBorderColor" : {
                    $type : "Color"
                },
                "previousPageIcon" : {
                    $type : "Icons"
                },
                "nextPageIcon" : {
                    $type : "Icons"
                }
            }
        },
        "ListCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "divsclass" : {
                    $type : "json:String",
                    $description : "sclass of the Div to use inside the widget. It must be defined in the skin."
                },
                "enabledColor" : {
                    $type : "Color",
                    $default : "#666"
                },
                "mouseOverBackgroundColor" : {
                    $type : "Color"
                },
                "mouseOverColor" : {
                    $type : "Color"
                },
                "highlightMouseOver" : {
                    $type : "json:Boolean",
                    $description : "",
                    $default : true
                },
                "selectedItemBackgroundColor" : {
                    $type : "Color"
                },
                "selectedItemColor" : {
                    $type : "Color"
                },
                "link" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        marginLeft : {
                            $type : "Pixels",
                            $default : 3
                        },
                        marginRight : {
                            $type : "Pixels",
                            $default : 3
                        }
                    }
                },
                "footer" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "padding" : {
                            $type : "Pixels",
                            $default : 5
                        },
                        "backgroundColor" : {
                            $type : "Color",
                            $default : "#eadbc8"
                        },
                        "borderColor" : {
                            $type : "Color",
                            $default : "#d3c3ab"
                        },
                        "borderTopOnly" : {
                            $type : "json:Boolean",
                            $description : "",
                            $default : false
                        },
                        "borderStyle" : {
                            $type : "json:String",
                            $description : "",
                            $default : "solid"
                        },
                        "borderWidth" : {
                            $type : "Pixels",
                            $default : 1
                        },
                        "marginTop" : {
                            $type : "Pixels",
                            $default : 5
                        },
                        "marginRight" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "marginBottom" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "marginLeft" : {
                            $type : "Pixels",
                            $default : -1
                        }
                    }
                }
            }
        },
        "LinkCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "LinkStateCfg"
                        },
                        "hover" : {
                            $type : "LinkStateCfg"
                        },
                        "focus" : {
                            $type : "LinkStateCfg"
                        }
                    }
                }

            }
        },
        "LinkStateCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "color" : {
                    $type : "Color"
                },
                "textDecoration" :  {
                    $type : "json:String"
                }

            }
        },
        "GaugeCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "spriteUrl" : {
                    $type : "json:String",
                    $description : "",
                    $default : 'atdefskin/sprites/back.gif'
                },
                "sprHeight" : {
                    $type : "Pixels"
                },
                "border" : {
                    $type : "json:String",
                    $description : ""
                },
                "borderPadding" : {
                    $type : "Pixels"
                },
                "labelMargins" : {
                    $type : "json:String",
                    $description : ""
                },
                "labelFontSize" : {
                    $type : "Pixels"
                }
            }
        },
        "RadioButtonCfg" : {
            $type : "CheckBoxCfg",
            $description : ""
        },
        "CheckBoxCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "CheckBoxStateCfg"
                        },
                        "normalSelected" : {
                            $type : "CheckBoxStateCfg"
                        },
                        "focused" : {
                            $type : "CheckBoxStateCfg"
                        },
                        "focusedSelected" : {
                            $type : "CheckBoxStateCfg"
                        },
                        "disabled" : {
                            $type : "CheckBoxStateCfg"
                        },
                        "disabledSelected" : {
                            $type : "CheckBoxStateCfg"
                        },
                        "readonly" : {
                            $type : "CheckBoxStateCfg"
                        },
                        "readonlySelected" : {
                            $type : "CheckBoxStateCfg"
                        }
                    }
                },
                "simpleHTML" : {
                    $type : "json:Boolean",
                    $description : "true when the widget has to have a basic markup as close as possible to standard HTML. As a consequence, a frame of type \"SimpleHTML\" will be used, which basically means that no further frame markup will be added.",
                    $default : false
                },
                "iconset" : {
                    $type : "json:String",
                    $description : ""
                },
                "iconprefix" : {
                    $type : "json:String",
                    $description : ""
                }
            }
        },
        "CheckBoxStateCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "color" : {
                    $type : "Color"
                }
            }
        },
        "DatePickerCfg" : {
            $type : "DropDownTextInputCfg",
            $description : "",
            $properties : {
                calendar : {
                    $type : "Object",
                    $properties : {
                        showWeekNumbers : {
                            $type : "json:Boolean",
                            $description : "",
                            $default : true
                        },
                        restrainedNavigation : {
                            $type : "json:Boolean",
                            $description : "",
                            $default : true
                        },
                        showShortcuts : {
                            $type : "json:Boolean",
                            $description : "",
                            $default : true
                        },
                        numberOfUnits : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 3
                        },
                        sclass : {
                            $type : "json:String",
                            $description : "sclass of the calendar to use inside the DatePicker. It must be defined in the skin.",
                            $default : "dropdown"
                        }
                    }
                }
            }
        },
        "SelectBoxCfg" : {
            $type : "DropDownTextInputCfg",
            $description : "",
            $properties : {
                "listSclass" : {
                    $type : "json:String",
                    $description : "sclass of the List to use inside the widget. It must be defined in the skin.",
                    $default : "dropdown"
                }
            }
        },
        "TextareaCfg" : {
            $type : "TextInputCfg",
            $description : ""
        },
        "ErrorListCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "divsclass" : {
                    $type : "json:String",
                    $description : "sclass of the Div to use inside the widget. It must be defined in the skin."
                }
            }
        },
        "FieldsetCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "FieldsetStateCfg"
                        }
                    }
                },
                "frame" : {
                    $type : "Frame"
                }
            }
        },
        "FieldsetStateCfg" : {
            $type : "StateWithFrame",
            $description : "",
            $properties : {
                "label" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "left" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "top" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "paddingTop" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "paddingLeft" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "paddingRight" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "paddingBottom" : {
                            $type : "Pixels",
                            $default : 0
                        },
                        "backgroundColor" : {
                            $type : "Color",
                            $default : "white"
                        },
                        "fontWeight" : {
                            $type : "json:String",
                            $description : "",
                            $default : "bold"
                        },
                        "color" : {
                            $type : "Color",
                            $default : "black"
                        }
                    }
                }
            }
        },
        "MultiSelectCfg" : {
            $type : "DropDownTextInputCfg",
            $description : "",
            $properties : {
                "listSclass" : {
                    $type : "json:String",
                    $description : "sclass of the List to use inside the widget. It must be defined in the skin.",
                    $default : "dropdown"
                }
            }
        },
        "SelectCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        },
                        "normalFocused" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        },
                        "mandatory" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        },
                        "mandatoryFocused" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        },
                        "disabled" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        },
                        "readOnly" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        },
                        "normalError" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        },
                        "normalErrorFocused" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        },
                        "mandatoryError" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        },
                        "mandatoryErrorFocused" : {
                            $type : "StateWithFrameWithIconsAndLabel"
                        }
                    }
                },
                "frame" : {
                    $type : "Frame"
                },
                "iconsLeft" : {
                    $type : "IconsLeft"
                },
                "iconsRight" : {
                    $type : "IconsRight"
                },
                "simpleHTML" : {
                    $type : "json:Boolean",
                    $description : "true when the widget has to have a basic markup as close as possible to standard HTML. As a consequence, a frame of type \"SimpleHTML\" will be used, which basically means that no further frame markup will be added.",
                    $default : false
                },
                "offsetTop" : {
                    $type : "Pixels"
                },
                "listSclass" : {
                    $type : "json:String",
                    $description : "sclass of the List to use inside the widget. It must be defined in the skin.",
                    $default : "dropdown"
                }
            }
        },
        "SortIndicatorCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                iconset : {
                    $type : "json:String",
                    $description : ""
                },
                iconprefix : {
                    $type : "json:String",
                    $description : ""
                }
            }
        },
        "SplitterCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                separatorHeight : {
                    $type : "Pixels"
                },
                separatorWidth : {
                    $type : "Pixels"
                },
                handleBackgroundColor : {
                    $type : "Color",
                    $default : "transparent"
                },
                handleSpriteURLh : {
                    $type : "json:String",
                    $description : ""
                },
                handleSpriteURLv : {
                    $type : "json:String",
                    $description : ""
                },
                proxyBackgroundColor : {
                    $type : "Color",
                    $default : "transparent"
                },
                proxySpriteURLh : {
                    $type : "json:String",
                    $description : ""
                },
                proxySpriteURLv : {
                    $type : "json:String",
                    $description : ""
                },
                borderColor : {
                    $type : "Color"
                },
                borderWidth : {
                    $type : "Pixels",
                    $default : 1
                }
            }
        },
        "IconCfg" : {
            $type : "Object",
            $description : "Description of a group of icons.",
            $properties : {
                "iconWidth" : {
                    $type : "Pixels"
                },
                "iconHeight" : {
                    $type : "Pixels"
                },
                "spriteSpacing" : {
                    $type : "Pixels"
                },
                "biDimensional" : {
                    $type : "json:Boolean",
                    $description : "",
                    $default : false
                },
                "direction" : {
                    $type : "json:Enum",
                    $description : "Whether the sprite is horizontal or vertical",
                    $enumValues : ["x", "y"]
                },
                "content" : {
                    $type : "json:Map",
                    $default : {},
                    $description : "",
                    $contentType : {
                        $type : "json:Integer",
                        $description : "Index of the icon inside the sprite."
                    },
                    $keyType : {
                        $type : "json:String",
                        $description : "Name of the icon within this sprite. To be used to refer to a specific icon with the syntax \"group:icon\"."
                    }
                },
                "spriteURL" : {
                    $type : "json:String",
                    $description : ""
                }

            }
        },
        "DivCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "StateWithFrame"
                        },
                        "topLeft" : {
                            $type : "StateWithFrame"
                        },
                        "bottomRight" : {
                            $type : "StateWithFrame"
                        },
                        "bottomLeft" : {
                            $type : "StateWithFrame"
                        }
                    }
                },
                "frame" : {
                    $type : "Frame"
                }
            }
        },
        "DialogCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "titleBarTop" : {
                    $type : "Pixels"
                },
                "titleBarLeft" : {
                    $type : "Pixels"
                },
                "titleBarRight" : {
                    $type : "Pixels"
                },
                "titleBarHeight" : {
                    $type : "Pixels"
                },
                "titleColor" : {
                    $type : "Color",
                    $default : "#615E55"
                },
                "divsclass" : {
                    $type : "json:String",
                    $description : "sclass of the Div to use inside the widget. It must be defined in the skin."
                },
                "closeIcon" : {
                    $type : "json:String",
                    $description : ""
                },
                "maximizeIcon" : {
                    $type : "json:String",
                    $description : ""
                },
                "shadowLeft" : {
                    $type : "Pixels"
                },
                "shadowTop" : {
                    $type : "Pixels"
                },
                "shadowRight" : {
                    $type : "Pixels"
                },
                "shadowBottom" : {
                    $type : "Pixels"
                }
            }
        },
        "TextInputCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "TextInputStateCfg"
                        },
                        "normalFocused" : {
                            $type : "TextInputStateCfg"
                        },
                        "mandatory" : {
                            $type : "TextInputStateCfg"
                        },
                        "mandatoryFocused" : {
                            $type : "TextInputStateCfg"
                        },
                        "normalError" : {
                            $type : "TextInputStateCfg"
                        },
                        "normalErrorFocused" : {
                            $type : "TextInputStateCfg"
                        },
                        "mandatoryError" : {
                            $type : "TextInputStateCfg"
                        },
                        "mandatoryErrorFocused" : {
                            $type : "TextInputStateCfg"
                        },
                        "disabled" : {
                            $type : "TextInputStateCfg"
                        },
                        "readOnly" : {
                            $type : "TextInputStateCfg"
                        },
                        "prefill" : {
                            $type : "TextInputStateCfg"
                        }
                    }
                },
                "simpleHTML" : {
                    $type : "json:Boolean",
                    $description : "true when the widget has to have a basic markup as close as possible to standard HTML. As a consequence, a frame of type \"SimpleHTML\" will be used, which basically means that no further frame markup will be added.",
                    $default : false
                },
                "frame" : {
                    $type : "Frame"
                },
                "iconsLeft" : {
                    $type : "IconsLeft"
                },
                "iconsRight" : {
                    $type : "IconsRight"
                },
                "label" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "fontWeight" : {
                            $type : "json:String",
                            $description : "",
                            $default : "normal"
                        }
                    }
                },
                "helpText" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "color" : {
                            $type : "Color"
                        },
                        "italics" : {
                            $type : "json:Boolean",
                            $description : ""
                        }
                    }
                },
                "innerPaddingTop" : {
                    $type : "Pixels",
                    $default : 0
                },
                "innerPaddingRight" : {
                    $type : "Pixels",
                    $default : 0
                },
                "innerPaddingBottom" : {
                    $type : "Pixels",
                    $default : 0
                },
                "innerPaddingLeft" : {
                    $type : "Pixels",
                    $default : 0
                }
            }
        },
        "TextInputStateCfg" : {
            $type : "StateWithFrameWithIconsAndLabel",
            $description : "",
            $properties : {
                "color" : {
                    $type : "Color",
                    $default : "#000"
                }
            }
        },
        "DropDownTextInputCfg" : {
            $type : "TextInputCfg",
            $description : "",
            $properties : {
                "offsetTop" : {
                    $type : "Pixels"
                }
            }
        },
        "AutoCompleteCfg" : {
            $type : "DropDownTextInputCfg",
            $description : "",
            $properties : {
                "listSclass" : {
                    $type : "json:String",
                    $description : "sclass of the List to use inside the widget. It must be defined in the skin.",
                    $default : "dropdown"
                }
            }
        },
        "TabPanelCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "StateWithFrame"
                        }
                    }
                },
                "frame" : {
                    $type : "Frame"
                }
            }
        },
        "TabCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "StateWithFrame"
                        },
                        "msover" : {
                            $type : "StateWithFrame"
                        },
                        "selected" : {
                            $type : "StateWithFrame"
                        },
                        "disabled" : {
                            $type : "StateWithFrame"
                        },
                        "normalFocused" : {
                            $type : "StateWithFrame"
                        },
                        "msoverFocused" : {
                            $type : "StateWithFrame"
                        },
                        "selectedFocused" : {
                            $type : "StateWithFrame"
                        }
                    }
                },
                "frame" : {
                    $type : "Frame"
                }
            }
        },
        "SimpleFrameCfg" : {
            $type : "Object",
            $description : "Used for widgets which have a basic frame around them. Frame properties are then specified state-wise.",
            $properties : {
                "sprType" : {
                    $type : "json:Integer",
                    $description : "Deprecated, please use frameType instead. The value corresponding to this type of frame is 6."
                },
                "frameType" : {
                    $type : "json:Enum",
                    $enumValues : ["Simple"],
                    $description : "The value that indicates that a simple frame is desired is \"Simple\"."
                }
            }
        },
        "SimpleFrameStateCfg" : {
            $type : "Object",
            $description : "Properties of a frame of type \"Simple\" for this state.",
            $properties : {
                "paddingTop" : {
                    $type : "Pixels",
                    $default : 0
                },
                "paddingRight" : {
                    $type : "Pixels",
                    $default : 0
                },
                "paddingBottom" : {
                    $type : "Pixels",
                    $default : 0
                },
                "paddingLeft" : {
                    $type : "Pixels",
                    $default : 0
                },
                "border" : {
                    $type : "json:String",
                    $description : "Style of the border",
                    $default : "",
                    $sample : "solid"
                },
                "borderSize" : {
                    $type : "Pixels",
                    $default : 0
                },
                "borderColor" : {
                    $type : "Color",
                    $default : ""
                },
                "backgroundColor" : {
                    $type : "Color",
                    $default : "#FFF"
                },
                "color" : {
                    $type : "Color",
                    $default : ""
                }
            }
        },
        "SkipBorderCfg" : {
            $type : "json:MultiTypes",
            $description : "",
            $default : false,
            $contentTypes : [{
                        $type : "json:Boolean",
                        $description : ""
                    }, {
                        $type : "json:Enum",
                        $description : "",
                        $enumValues : ["dependsOnIcon"]
                    }]

        },
        "FixedHeightFrameCfg" : {
            $type : "Object",
            $description : "Used for widgets which have a fixed height. Frame properties are then specified state-wise.",
            $properties : {
                "sprType" : {
                    $type : "json:Integer",
                    $description : "Deprecated, please use frameType instead. The value corresponding to this type of frame is 2."
                },
                "frameType" : {
                    $type : "json:Enum",
                    $enumValues : ["FixedHeight"],
                    $description : "The value that indicates that a fixed height frame is desired is \"FixedHeight\"."
                }
            }
        },
        "FixedHeightFrameStateCfg" : {
            $type : "Object",
            $description : "Properties of a frame of type \"FixedHeight\" for this state.",
            $properties : {
                "color" : {
                    $type : "Color",
                    $default : "#000"
                },
                "spriteURL" : {
                    $type : "json:String",
                    $description : ""
                },
                "spriteURLv" : {
                    $type : "json:String",
                    $description : ""
                },
                "skipLeftBorder" : {
                    $type : "SkipBorderCfg",
                    $description : ""
                },
                "skipRightBorder" : {
                    $type : "SkipBorderCfg",
                    $description : ""
                },
                "sprWidth" : {
                    $type : "Pixels"
                },
                "sprHeight" : {
                    $type : "Pixels"
                },
                "sprIdx" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "sprSpacing" : {
                    $type : "Pixels",
                    $default : 2
                },
                "spcLeft" : {
                    $type : "Pixels"
                },
                "marginTop" : {
                    $type : "Pixels",
                    $default : 0
                },
                "marginLeft" : {
                    $type : "Pixels",
                    $default : 0
                },
                "marginRight" : {
                    $type : "Pixels",
                    $default : 0
                },
                "marginBottom" : {
                    $type : "Pixels",
                    $default : 0
                }
            }
        },
        "TableFrameCfg" : {
            $type : "Object",
            $description : "Used for widgets which have a layout based on a table. Frame properties are then specified state-wise.",
            $properties : {
                "sprType" : {
                    $type : "json:Integer",
                    $description : "Deprecated, please use frameType instead. The value corresponding to this type of frame is 3."
                },
                "frameType" : {
                    $type : "json:Enum",
                    $enumValues : ["Table"],
                    $description : "The value that indicates that a table layout is desired is \"Table\"."
                }
            }
        },
        "TableFrameStateCfg" : {
            $type : "Object",
            $description : "Properties of a frame of type \"Table\" for this state.",
            $properties : {
                "sprWidth" : {
                    $type : "Pixels"
                },
                "sprHeight" : {
                    $type : "Pixels"
                },
                "sprIdx" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "sprSpacing" : {
                    $type : "Pixels",
                    $default : 2
                },
                "spcLeft" : {
                    $type : "Pixels"
                },
                "spcTop" : {
                    $type : "Pixels"
                },
                "spriteURL" : {
                    $type : "json:String",
                    $description : ""
                },
                "spriteURLv" : {
                    $type : "json:String",
                    $description : ""
                },
                "spriteURLh" : {
                    $type : "json:String",
                    $description : ""
                },
                "marginTop" : {
                    $type : "Pixels",
                    $default : 0
                },
                "marginLeft" : {
                    $type : "Pixels",
                    $default : 0
                },
                "marginRight" : {
                    $type : "Pixels",
                    $default : 0
                },
                "marginBottom" : {
                    $type : "Pixels",
                    $default : 0
                },
                "color" : {
                    $type : "Color",
                    $default : "#000"
                },
                "backgroundColor" : {
                    $type : "Color",
                    $default : "#FFF"
                },
                "frameHeight" : {
                    $type : "Pixels"
                },
                "frameIcon" : {
                    $type : "json:String",
                    $description : "",
                    $default : ""
                },
                "frameIconHPos" : {
                    $type : "json:String",
                    $description : "",
                    $default : "left"
                },
                "frameIconVPos" : {
                    $type : "json:String",
                    $description : "",
                    $default : "bottom"
                }
            }
        },
        "SimpleHTMLFrameCfg" : {
            $type : "Object",
            $description : "Used for widgets which have no frame at all. No frame properties have to be specified state-wise.",
            $properties : {
                "sprType" : {
                    $type : "json:Integer",
                    $description : "Deprecated, please use frameType instead. The value corresponding to this type of frame is 5."
                },
                "frameType" : {
                    $type : "json:Enum",
                    $enumValues : ["SimpleHTML"],
                    $description : "The value that indicates that no frame is desired is \"SimpleHTML\"."
                }
            }
        },
        "SimpleHTMLFrameStateCfg" : {
            $type : "Object",
            $description : "No properties to specify when the selected frame type is \"SimpleHTML\".",
            $properties : {}
        }
    }
});
