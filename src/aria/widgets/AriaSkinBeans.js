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
            $minValue : 0,
            $maxValue : 100
        },
        "WidgetGeneralCfg" : {
            $type : "Object",
            $properties : {
                "font" : {
                    $type : "Object",
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
            $properties : {
                "imagesRoot" : {
                    $type : "json:String",
                    $description : "Root path for skin images (relative to Aria.rootFolderPath). It is supposed to end with a slash.",
                    $default : "css/"
                },
                "externalCSS" : {
                    $type : "json:Array",
                    $description : "List of external CSS files to load with the skin. The path is calculated starting from the imagesRoot property.",
                    $contentType : {
                        $type : "json:String",
                        $description : "Path and filename of the CSS to load."
                    },
                    $default : []
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
                            $type : "json:String"
                        },
                        "opacity" : {
                            $type : "Opacity"
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
                            $default : 100
                        },
                        "border" : {
                            $type : "json:String",
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
                            $default : 40
                        }
                    }
                },
                "disable" : {
                    $type : "Object",
                    $properties : {
                        "ul" : {
                            $type : "Object",
                            $properties : {
                                "list" : {
                                    $type : "Object",
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
                    $contentType : {
                        $type : "json:MultiTypes",
                        $contentTypes : [{
                                    $type : "json:Boolean"
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
                    $properties : {
                        "fontWeight" : {
                            $type : "json:String",
                            $default : "normal"
                        }
                    }
                }
            }
        },
        "CalendarCfg" : {
            $type : "Object",
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
                    $default : "0px"
                },
                "monthTitlePaddingBottom" : {
                    $type : "json:String",
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
                    $default : "0px"
                },
                "dayFontWeight" : {
                    $type : "json:String",
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
                    $default : "bold"
                },
                "weekDaysLabelColor" : {
                    $type : "Color",
                    $default : "black"
                },
                "weekDaysLabelPadding" : {
                    $type : "json:String",
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
                    $default : 10
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
                            $default : false
                        },
                        "borderStyle" : {
                            $type : "json:String",
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
            $properties : {
                "color" : {
                    $type : "Color"
                },
                "textDecoration" : {
                    $type : "json:String"
                }

            }
        },
        "GaugeCfg" : {
            $type : "Object",
            $properties : {
                "spriteUrl" : {
                    $type : "json:String",
                    $default : 'atdefskin/sprites/back.gif'
                },
                "backgroundColor" : {
                    $type : "Color",
                    $default : "transparent"
                },
                "sprHeight" : {
                    $type : "Pixels"
                },
                "border" : {
                    $type : "json:String"
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
                },
                "borderPadding" : {
                    $type : "Pixels"
                },
                "labelMargins" : {
                    $type : "json:String"
                },
                "labelFontSize" : {
                    $type : "Pixels"
                },
                "container" : {
                    $type : "Object",
                    $properties : {
                        "backgroundColor" : {
                            $type : "Color",
                            $default : "transparent"
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
                        },
                        "boxShadow" : {
                            $type : "json:String",
                            $default : ""
                        }
                    }
                }
            }
        },
        "RadioButtonCfg" : {
            $type : "CheckBoxCfg"
        },
        "CheckBoxCfg" : {
            $type : "Object",
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
                    $type : "json:String"
                },
                "iconprefix" : {
                    $type : "json:String"
                }
            }
        },
        "CheckBoxStateCfg" : {
            $type : "Object",
            $properties : {
                "color" : {
                    $type : "Color"
                }
            }
        },
        "DatePickerCfg" : {
            $type : "DropDownTextInputCfg",
            $properties : {
                calendar : {
                    $type : "Object",
                    $properties : {
                        showWeekNumbers : {
                            $type : "json:Boolean",
                            $default : true
                        },
                        restrainedNavigation : {
                            $type : "json:Boolean",
                            $default : true
                        },
                        showShortcuts : {
                            $type : "json:Boolean",
                            $default : true
                        },
                        numberOfUnits : {
                            $type : "json:Integer",
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
            $properties : {
                "listSclass" : {
                    $type : "json:String",
                    $description : "sclass of the List to use inside the widget. It must be defined in the skin.",
                    $default : "dropdown"
                }
            }
        },
        "TextareaCfg" : {
            $type : "TextInputCfg"
        },
        "ErrorListCfg" : {
            $type : "Object",
            $properties : {
                "divsclass" : {
                    $type : "json:String",
                    $description : "sclass of the Div to use inside the widget. It must be defined in the skin."
                }
            }
        },
        "FieldsetCfg" : {
            $type : "Object",
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
            $properties : {
                "label" : {
                    $type : "Object",
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
                "offsetRight" : {
                    $type : "json:Integer",
                    $description : "Offset to be added on the right to manage box shadow (for example)",
                    $default : 15
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
            $properties : {
                iconset : {
                    $type : "json:String"
                },
                iconprefix : {
                    $type : "json:String"
                }
            }
        },
        "SplitterCfg" : {
            $type : "Object",
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
                    $type : "json:String"
                },
                handleSpriteURLv : {
                    $type : "json:String"
                },
                proxyBackgroundColor : {
                    $type : "Color",
                    $default : "transparent"
                },
                proxySpriteURLh : {
                    $type : "json:String"
                },
                proxySpriteURLv : {
                    $type : "json:String"
                },
                borderColor : {
                    $type : "Color"
                },
                borderTopLeftRadius : {
                    $type : "Pixels",
                    $default : 0
                },
                borderTopRightRadius : {
                    $type : "Pixels",
                    $default : 0
                },
                borderBottomLeftRadius : {
                    $type : "Pixels",
                    $default : 0
                },
                borderBottomRightRadius : {
                    $type : "Pixels",
                    $default : 0
                },
                borderWidth : {
                    $type : "Pixels",
                    $default : 1
                },
                backgroundColor : {
                    $type : "Color",
                    $default : "transparent"
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
                    $type : "json:String"
                },
                "backgroundSize" : {
                    $type : "json:Integer"
                },
                "backgroundColor" : {
                    $type : "Color",
                    $default : ""
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
                },
                "borderTop" : {
                    $type : "Pixels",
                    $default : 0
                },
                "borderBottom" : {
                    $type : "Pixels",
                    $default : 0
                },
                "borderRight" : {
                    $type : "Pixels",
                    $default : 0
                },
                "borderLeft" : {
                    $type : "Pixels",
                    $default : 0
                },
                "borderStyle" : {
                    $type : "json:String"
                },
                "borderColor" : {
                    $type : "Color"
                }
            }
        },
        "DivCfg" : {
            $type : "Object",
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
                "titleBackgroundColor" : {
                    $type : "Color"
                },
                "titlePadding" : {
                    $type : "json:String"
                },
                "titleBorder" : {
                    $type : "json:String"
                },
                "titleBorderStyle" : {
                    $type : "json:String"
                },
                "titleBorderColor" : {
                    $type : "Color"
                },
                "titleBorderRadius" : {
                    $type : "json:String"
                },
                "divsclass" : {
                    $type : "json:String",
                    $description : "sclass of the Div to use inside the widget. It must be defined in the skin."
                },
                "closeIcon" : {
                    $type : "json:String"
                },
                "maximizeIcon" : {
                    $type : "json:String"
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
                    $properties : {
                        "fontWeight" : {
                            $type : "json:String",
                            $default : "normal"
                        }
                    }
                },
                "helpText" : {
                    $type : "Object",
                    $properties : {
                        "color" : {
                            $type : "Color"
                        },
                        "italics" : {
                            $type : "json:Boolean"
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
            $properties : {
                "color" : {
                    $type : "Color",
                    $default : "#000"
                }
            }
        },
        "DropDownTextInputCfg" : {
            $type : "TextInputCfg",
            $properties : {
                "offsetTop" : {
                    $type : "Pixels"
                },
                "offsetRight" : {
                    $type : "Pixels",
                    $description : "Offset to be added on the right to manage box shadow (for example)",
                    $default : 15
                }
            }
        },
        "AutoCompleteCfg" : {
            $type : "DropDownTextInputCfg",
            $properties : {
                "listSclass" : {
                    $type : "json:String",
                    $description : "sclass of the List to use inside the widget. It must be defined in the skin.",
                    $default : "dropdown"
                }
            }
        },
        "MultiAutoCompleteCfg" : {
            $type : "DropDownTextInputCfg",
            $properties : {
                "closeSpriteURL" : {
                    $type : "json:String"
                },
                "closeHighlightSpriteURL" : {
                    $type : "json:String"
                },
                "closeSpriteHeight" : {
                    $type : "Pixels"
                },
                "closeSpriteWidth" : {
                    $type : "Pixels"
                },
                "optionsColor" : {
                    $type : "Color",
                    $default : "#333"
                },
                "optionsBackgroundColor" : {
                    $type : "Color",
                    $default : "#E4E4E4"
                },
                "optionsBorderColor" : {
                    $type : "Color",
                    $default : "#AAAAAA"
                },
                "optionsBorderWidth" : {
                    $type : "Pixels",
                    $default : 1
                },
                "optionsHighlightColor" : {
                    $type : "Color",
                    $default : "#333"
                },
                "optionsHighlightBackgroundColor" : {
                    $type : "Color",
                    $default : "#FFCC66"
                },
                "optionsHighlightBorderColor" : {
                    $type : "Color",
                    $default : "#AAAAAA"
                },
                "optionsHighlightBorderWidth" : {
                    $type : "Pixels",
                    $default : 1
                }
            }
        },
        "TabPanelCfg" : {
            $type : "Object",
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
                "verticalAlign" : {
                    $type : "json:String",
                    $description : "Vertical alignment value applied to the content. The standard html values are accepted (top, middle, ...). The innerHeight must be set to have it working"
                },
                "innerHeight" : {
                    $type : "Pixels",
                    $description : "The text line height. It must be set when the verticalAlign is used."
                },
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
                "border" : {
                    $type : "json:String",
                    $description : "Style of the border",
                    $default : "",
                    $sample : "solid"
                },
                "borderTop" : {
                    $type : "Pixels",
                    $description : "Size of the border"
                },
                "borderBottom" : {
                    $type : "Pixels",
                    $description : "Size of the border"
                },
                "borderRight" : {
                    $type : "Pixels",
                    $description : "Size of the border"
                },
                "borderLeft" : {
                    $type : "Pixels",
                    $description : "Size of the border"
                },
                "borderSize" : {
                    $type : "Pixels",
                    $default : 0
                },
                "borderColor" : {
                    $type : "Color",
                    $default : ""
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
                },
                "boxShadow" : {
                    $type : "json:String",
                    $default : "none"
                },
                "backgroundColor" : {
                    $type : "Color",
                    $default : "#FFF"
                },
                "color" : {
                    $type : "Color",
                    $default : ""
                },
                "skipLeftBorder" : {
                    $type : "SkipBorderCfg"
                },
                "skipRightBorder" : {
                    $type : "SkipBorderCfg"
                },
                "fontWeight" : {
                    $type : "json:String",
                    $default : "normal"
                },
                "frameHeight" : {
                    $type : "json:Integer",
                    $description : "Simple frame height."
                }
            }
        },
        "SkipBorderCfg" : {
            $type : "json:MultiTypes",
            $default : false,
            $contentTypes : [{
                        $type : "json:Boolean"
                    }, {
                        $type : "json:Enum",
                        $enumValues : ["dependsOnIcon"]
                    }]

        },
        "FixedHeightFrameCfg" : {
            $type : "Object",
            $description : "Used for widgets which have a fixed height. Frame properties are then specified state-wise.",
            $properties : {
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
                    $type : "json:String"
                },
                "spriteURLv" : {
                    $type : "json:String"
                },
                "skipLeftBorder" : {
                    $type : "SkipBorderCfg"
                },
                "skipRightBorder" : {
                    $type : "SkipBorderCfg"
                },
                "sprWidth" : {
                    $type : "Pixels"
                },
                "sprHeight" : {
                    $type : "Pixels"
                },
                "verticalAlign" : {
                    $type : "json:String",
                    $description : "Vertical alignment value applied to the content. The standard html values are accepted (top, middle, ...). The innerHeight must be set to have it working"
                },
                "innerHeight" : {
                    $type : "Pixels",
                    $description : "The text line height. It must be set when the verticalAlign is used."
                },
                "sprIdx" : {
                    $type : "json:Integer"
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
                    $type : "json:String"
                },
                "spriteURLv" : {
                    $type : "json:String"
                },
                "spriteURLh" : {
                    $type : "json:String"
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
                    $default : ""
                },
                "frameIconHPos" : {
                    $type : "json:String",
                    $default : "left"
                },
                "frameIconVPos" : {
                    $type : "json:String",
                    $default : "bottom"
                }
            }
        },
        "SimpleHTMLFrameCfg" : {
            $type : "Object",
            $description : "Used for widgets which have no frame at all. No frame properties have to be specified state-wise.",
            $properties : {
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
