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
            $description : ""
        },
        "Opacity" : {
            $type : "json:Float",
            $description : "",
            $minValue : 0,
            $maxValue : 100
        },
        "GeneralCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "imagesRoot" : {
                    $type : "json:String",
                    $description : "Root path for skin images (relative to Aria.rootFolderPath). It is supposed to end with a slash.",
                    $default : "css/"
                },
                "font" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "size" : {
                            $type : "json:Integer",
                            $description : ""
                        },
                        "family" : {
                            $type : "json:String",
                            $description : ""
                        }
                    }
                },
                "colors" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "bkg" : {
                            $type : "Color",
                            $description : ""
                        },
                        "disabled" : {
                            $type : "Color",
                            // used in aria.widgets.calendar.CalendarStyle
                            $description : ""
                        }
                    }
                },
                "loadingOverlay" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "backgroundColor" : {
                            $type : "Color",
                            $description : ""
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
                    $description : "",
                    $properties : {
                        "backgroundColor" : {
                            $type : "Color",
                            $default : "#ddd"
                        },
                        "opacity" : {
                            $type : "Opacity",
                            $description : ""
                        },
                        "border" : {
                            $type : "json:String",
                            $description : "",
                            $default : "1px solid black"
                        }
                    }
                },
                "dialogMask" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "backgroundColor" : {
                            $type : "Color",
                            $description : "",
                            $default : "black"
                        },
                        "opacity" : {
                            $type : "Opacity",
                            $description : "",
                            $default : 40
                        }
                    }
                },
                "anchor" : {
                    $type : "Object",
                    $description : "",
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
                                            $description : ""
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
            $description : "",
            $properties : {
                "color" : {
                    $type : "Color",
                    $description : ""
                },
                "text" : {
                    $type : "Object",
                    $properties : {
                        "decoration" : {
                            $type : "json:String",
                            $description : ""
                        }
                    }
                },
                "outline" : {
                    $type : "json:String",
                    $description : ""
                }
            }
        },
        "Icons" : {
            $type : "json:String",
            $description : ""
        },
        "IconsLeft" : {
            $type : "Icons",
            $description : ""
        },
        "IconsRight" : {
            $type : "Icons",
            $description : ""
        },
        "StatesSet" : {
            $type : "Object",
            $description : ""
        },
        "StateWithFrame" : {
            $type : "Object",
            $description : "",
            $properties : {
                "frame" : {
                    $type : "json:ObjectRef",
                    $description : "",
                    $default : {}
                }
            }
        },
        "StateWithFrameWithIcons" : {
            $type : "StateWithFrame",
            $description : "",
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
                                    $type : "json:String",
                                    $description : ""
                                }]
                    }
                }
            }
        },
        "Frame" : {
            $type : "json:ObjectRef",
            $description : ""
        },
        "BaseFrame" : {
            $type : "Object",
            $description : "",
            $properties : {
                "sprType" : {
                    $type : "json:Integer",
                    $description : "Deprecated, please use frameType instead."
                },
                "frameType" : {
                    $type : "json:Enum",
                    $enumValues : ["FixedHeight", "Simple", "Table", "SimpleHTML", "Old0", "Old1", "Old2"],
                    $description : ""
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
                        "selected" : {
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
                    $description : "",
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
                    $type : "Color",
                    $description : ""
                },
                "monthTitleBorderColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "#E6D9C6"
                },
                "monthTitleColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "black"
                },
                "monthTitleBackgroundColor" : {
                    $type : "Color",
                    $description : "",
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
                "dayBorderColor" : {
                    $type : "Color",
                    $description : ""
                },
                "dayBackgroundColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "transparent"
                },
                "dayColor" : {
                    $type : "Color",
                    $description : "",
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
                    $description : "",
                    $default : "#F2ECDE"
                },
                "weekEndBorderColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "#F2ECDE"
                },
                "weekEndColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "black"
                },
                "unselectableBorderColor" : {
                    $type : "Color",
                    $description : ""
                },
                "unselectableBackgroundColor" : {
                    $type : "Color",
                    $description : ""
                },
                "unselectableColor" : {
                    $type : "Color",
                    $description : ""
                },
                "todayBorderColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "black"
                },
                "todayBackgroundColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "transparent"
                },
                "todayColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "black"
                },
                "weekNumberBackgroundColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "#E7DBC6"
                },
                "weekNumberBorderColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "#E7DBC6"
                },
                "weekDaysLabelBackgroundColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "transparent"
                },
                "weekDaysLabelBorderColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "white"
                },
                "weekDaysLabelFontWeight" : {
                    $type : "json:String",
                    $description : "",
                    $default : "bold"
                },
                "weekDaysLabelColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "black"
                },
                "weekDaysLabelPadding" : {
                    $type : "json:String",
                    $description : "",
                    $default : "0px"
                },
                "selectedBackgroundColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "#FFCC66"
                },
                "selectedBorderColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "black"
                },
                "selectedColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "black"
                },
                "defaultTemplate" : {
                    $type : "json:String",
                    $description : ""
                },
                "divsclass" : {
                    $type : "json:String",
                    $description : ""
                },
                "previousPageIcon" : {
                    $type : "json:String",
                    $description : ""
                },
                "nextPageIcon" : {
                    $type : "json:String",
                    $description : ""
                }

            }
        },
        "ListCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "divsclass" : {
                    $type : "json:String",
                    $description : ""
                },
                "enabledColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "#666"
                },
                "mouseOverBackgroundColor" : {
                    $type : "Color",
                    $description : ""
                },
                "mouseOverColor" : {
                    $type : "Color",
                    $description : ""
                },
                "highlightMouseOver" : {
                    $type : "json:Boolean",
                    $description : "",
                    $default : true
                },
                "selectedItemBackgroundColor" : {
                    $type : "Color",
                    $description : ""
                },
                "selectedItemColor" : {
                    $type : "Color",
                    $description : ""
                },
                "link" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        marginLeft : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 3
                        },
                        marginRight : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 3
                        }
                    }
                },
                "footer" : {
                    $type : "Object",
                    $description : "",
                    $properties : {
                        "padding" : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 5
                        },
                        "backgroundColor" : {
                            $type : "Color",
                            $description : "",
                            $default : "#eadbc8"
                        },
                        "borderColor" : {
                            $type : "Color",
                            $description : "",
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
                            $type : "json:Integer",
                            $description : "",
                            $default : 1
                        },
                        "marginTop" : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 5
                        },
                        "marginRight" : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 0
                        },
                        "marginBottom" : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 0
                        },
                        "marginLeft" : {
                            $type : "json:Integer",
                            $description : "",
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
                    $type : "Color",
                    $description : ""
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
                    $type : "json:Integer",
                    $description : ""
                },
                "border" : {
                    $type : "json:String",
                    $description : ""
                },
                "borderPadding" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "labelMargins" : {
                    $type : "json:String",
                    $description : ""
                },
                "labelFontSize" : {
                    $type : "json:Integer",
                    $description : ""
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
                    $description : "",
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
                    $type : "Color",
                    $description : ""
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
                        }
                    }
                }
            }
        },
        "SelectBoxCfg" : {
            $type : "DropDownTextInputCfg",
            $description : ""
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
                    $description : ""
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
                            $type : "json:Integer",
                            $description : "",
                            $default : 0
                        },
                        "top" : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 0
                        },
                        "paddingTop" : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 0
                        },
                        "paddingLeft" : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 0
                        },
                        "paddingRight" : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 0
                        },
                        "paddingBottom" : {
                            $type : "json:Integer",
                            $description : "",
                            $default : 0
                        },
                        "backgroundColor" : {
                            $type : "Color",
                            $description : "",
                            $default : "white"
                        },
                        "fontWeight" : {
                            $type : "json:String",
                            $description : "",
                            $default : "bold"
                        },
                        "color" : {
                            $type : "Color",
                            $description : "",
                            $default : "black"
                        }
                    }
                }
            }
        },
        "MultiSelectCfg" : {
            $type : "DropDownTextInputCfg",
            $description : ""
        },
        "SelectCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "states" : {
                    $type : "StatesSet",
                    $properties : {
                        "normal" : {
                            $type : "StateWithFrameWithIcons"
                        },
                        "normalFocused" : {
                            $type : "StateWithFrameWithIcons"
                        },
                        "mandatory" : {
                            $type : "StateWithFrameWithIcons"
                        },
                        "mandatoryFocused" : {
                            $type : "StateWithFrameWithIcons"
                        },
                        "disabled" : {
                            $type : "StateWithFrameWithIcons"
                        },
                        "readOnly" : {
                            $type : "StateWithFrameWithIcons"
                        },
                        "normalError" : {
                            $type : "StateWithFrameWithIcons"
                        },
                        "normalErrorFocused" : {
                            $type : "StateWithFrameWithIcons"
                        },
                        "mandatoryError" : {
                            $type : "StateWithFrameWithIcons"
                        },
                        "mandatoryErrorFocused" : {
                            $type : "StateWithFrameWithIcons"
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
                    $description : "",
                    $default : false
                },
                "offsetTop" : {
                    $type : "json:Integer",
                    $description : ""
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
                    $type : "json:Integer",
                    $description : ""
                },
                handleBackgroundColor : {
                    $type : "Color",
                    $description : "",
                    $default : "transparent"
                },
                handleSpriteURLh : {
                    $type : "json:String",
                    $description : ""
                },
                proxyBackgroundColor : {
                    $type : "Color",
                    $description : "",
                    $default : "transparent"
                },
                proxySpriteURLh : {
                    $type : "json:String",
                    $description : ""
                },
                borderColor : {
                    $type : "Color",
                    $description : ""
                }
            }
        },
        "IconCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "iconWidth" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "iconHeight" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "spriteSpacing" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "biDimensional" : {
                    $type : "json:Boolean",
                    $description : "",
                    $default : false
                },
                "direction" : {
                    $type : "json:Enum",
                    $description : "",
                    $enumValues : ["x", "y"]
                },
                "content" : {
                    $type : "json:Map",
                    $default : {},
                    $description : "",
                    $contentType : {
                        $type : "json:Integer",
                        $description : ""
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
                    $type : "json:Integer",
                    $description : ""
                },
                "titleBarLeft" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "titleBarRight" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "titleBarHeight" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "titleColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "#615E55"
                },
                "divsclass" : {
                    $type : "json:String",
                    $description : ""
                },
                "closeIcon" : {
                    $type : "json:String",
                    $description : ""
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
                    $description : "",
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
                            $type : "Color",
                            $description : ""
                        },
                        "italics" : {
                            $type : "json:Boolean",
                            $description : ""
                        }
                    }
                },
                "innerPaddingTop" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "innerPaddingRight" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "innerPaddingBottom" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "innerPaddingLeft" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                }
            }
        },
        "TextInputStateCfg" : {
            $type : "StateWithFrameWithIcons",
            $description : "",
            $properties : {
                "color" : {
                    $type : "Color",
                    $description : "",
                    $default : "#000"
                }
            }
        },
        "DropDownTextInputCfg" : {
            $type : "TextInputCfg",
            $description : "",
            $properties : {
                "offsetTop" : {
                    $type : "json:Integer",
                    $description : ""
                }
            }
        },
        "AutoCompleteCfg" : {
            $type : "DropDownTextInputCfg",
            $description : ""
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
            $type : "BaseFrame"
        },
        "SimpleFrameStateCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "paddingTop" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "paddingRight" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "paddingBottom" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "paddingLeft" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "border" : {
                    $type : "json:String",
                    $description : "",
                    $default : ""
                },
                "borderSize" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "borderColor" : {
                    $type : "Color",
                    $description : "",
                    $default : ""
                },
                "backgroundColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "#FFF"
                },
                "color" : {
                    $type : "Color",
                    $description : "",
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
            $type : "BaseFrame"
        },
        "FixedHeightFrameStateCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "color" : {
                    $type : "Color",
                    $description : "",
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
                    $type : "json:Integer",
                    $description : ""
                },
                "sprHeight" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "sprIdx" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "sprSpacing" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 2
                },
                "spcLeft" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "marginTop" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "marginLeft" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "marginRight" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "marginBottom" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                }
            }
        },
        "TableFrameCfg" : {
            $type : "BaseFrame"
        },
        "TableFrameStateCfg" : {
            $type : "Object",
            $description : "",
            $properties : {
                "sprWidth" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "sprHeight" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "sprIdx" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "sprSpacing" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 2
                },
                "spcLeft" : {
                    $type : "json:Integer",
                    $description : ""
                },
                "spcTop" : {
                    $type : "json:Integer",
                    $description : ""
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
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "marginLeft" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "marginRight" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "marginBottom" : {
                    $type : "json:Integer",
                    $description : "",
                    $default : 0
                },
                "color" : {
                    $type : "Color",
                    $description : "",
                    $default : "#000"
                },
                "backgroundColor" : {
                    $type : "Color",
                    $description : "",
                    $default : "#FFF"
                },
                "frameHeight" : {
                    $type : "json:Integer",
                    $description : ""
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
        "OldFrame" : {
            $type : "BaseFrame",
            $description : "",
            $properties : {
                spriteURL : {
                    $type : "json:String",
                    $description : ""
                },
                spcLeft : {
                    $type : "json:Integer",
                    $description : ""
                },
                spcRight : {
                    $type : "json:Integer",
                    $description : ""
                },
                spcTop : {
                    $type : "json:Integer",
                    $description : ""
                },
                spcBottom : {
                    $type : "json:Integer",
                    $description : ""
                },
                sprWidth : {
                    $type : "json:Integer",
                    $description : ""
                },
                sprHeight : {
                    $type : "json:Integer",
                    $description : ""
                },
                offsetLeft : {
                    $type : "json:Integer",
                    $description : ""
                }
            }
        },
        "Old0FrameCfg" : {
            $type : "OldFrame"
        },
        "Old1FrameCfg" : {
            $type : "OldFrame"
        },
        "Old2FrameCfg" : {
            $type : "OldFrame"
        },
        "OldFrameState" : {
            $type : "Object",
            $description : "",
            $properties : {
                sprIdx : {
                    $type : "json:Integer",
                    $description : ""
                },
                textAlign : {
                    $type : "json:String",
                    $description : ""
                },
                color : {
                    $type : "Color",
                    $description : ""
                }
            }
        },
        "Old0FrameStateCfg" : {
            $type : "OldFrameState"
        },
        "Old1FrameStateCfg" : {
            $type : "OldFrameState"
        },
        "Old2FrameStateCfg" : {
            $type : "OldFrameState"
        },
        "SimpleHTMLFrameCfg" : {
            $type : "BaseFrame"
        },
        "SimpleHTMLFrameStateCfg" : {
            $type : "Object",
            $description : "",
            $properties : {}
        }
    }
});
