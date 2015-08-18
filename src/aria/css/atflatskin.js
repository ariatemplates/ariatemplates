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
// Skin configuration: flatskin
Aria.classDefinition({
    $classpath : 'aria.widgets.AriaSkin',
    $singleton : true,
    $prototype : {
        skinName : "atFlatSkin",
        skinObject : {
            "SortIndicator" : {
                "std" : {
                    "iconset" : "sortIndicator",
                    "iconprefix" : "si_"
                }
            },
            "Fieldset" : {
                "std" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#F8F8F8",
                            "color" : "#000",
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderSize" : 1,
                            "borderTopRightRadius" : 6,
                            "borderBottomRightRadius" : 6,
                            "borderTopLeftRadius" : 6,
                            "borderBottomLeftRadius" : 6,
                            "paddingBottom" : 15,
                            "paddingTop" : 10,
                            "paddingLeft" : 15,
                            "paddingRight" : 5,
                            "marginTop" : 20,
                            "label" : {
                                "left" : 0,
                                "top" : 0,
                                "paddingRight" : 5,
                                "backgroundColor" : "transparent"
                            }
                        }
                    }
                }
            },
            "MultiAutoComplete" : {
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderTopLeftRadius" : 3,
                            "borderTopRightRadius" : 3,
                            "borderBottomLeftRadius" : 3,
                            "borderBottomRightRadius" : 3,
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "icons" : {
                                "dropdown" : "multiSelectNormalRight:multiselect"
                            },
                            "paddingTop" : 5,
                            "paddingRight" : 10,
                            "paddingLeft" : 10,
                            "paddingBottom" : 5
                        },
                        "normalFocused" : {
                            "borderColor" : "#34495E",
                            "backgroundColor" : "#FFF",
                            "icons" : {
                                "dropdown" : "multiSelectNormalFocusedRight:multiselect"
                            }
                        },
                        "normalError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "multiSelectErrorRight:multiselect"
                            }
                        },
                        "normalErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "multiSelectErrorFocusedRight:multiselect"
                            }
                        },
                        "mandatory" : {
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "multiSelectMandatoryRight:multiselect"
                            }
                        },
                        "mandatoryFocused" : {
                            "backgroundColor" : "#FFC",
                            "borderColor" : "#F1C40F",
                            "icons" : {
                                "dropdown" : "multiSelectMandatoryFocusedRight:multiselect"
                            }
                        },
                        "mandatoryError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "multiSelectErrorRight:multiselect"
                            }
                        },
                        "mandatoryErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "multiSelectErrorFocusedRight:multiselect"
                            }
                        },
                        "readOnly" : {
                            "backgroundColor" : "#F8F8F8",
                            "icons" : {
                                "dropdown" : "multiSelectReadOnlyRight:multiselect"
                            }
                        },
                        "prefill" : {
                            "color" : "gray"
                        },
                        "disabled" : {
                            "backgroundColor" : "#DFDFDF",
                            "icons" : {
                                "dropdown" : "multiSelectDisabledRight:multiselect"
                            }
                        }
                    },
                    "helpText" : {
                        italics : true,
                        color : "#b2b2b2"
                    },
                    "offsetTop" : 1,
                    "optionsBackgroundColor" : "#E4E4E4",
                    "optionsColor" : "#333",
                    "optionsBorderWidth" : 1,
                    "optionsBorderColor" : "#AAAAAA",
                    "closeSpriteURL" : "atflatskin/close.gif",
                    "closeSpriteHeight" : 10,
                    "closeSpriteWidth" : 9,
                    "optionsHighlightBackgroundColor" : "#0088CC",
                    "optionsHighlightColor" : "#FFF",
                    "optionsHighlightBorderWidth" : 1,
                    "optionsHighlightBorderColor" : "#AAAAAA",
                    "closeHighlightSpriteURL" : "atflatskin/close.gif"
                }
            },
            "MultiSelect" : {
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderTopLeftRadius" : 3,
                            "borderTopRightRadius" : 0,
                            "borderBottomLeftRadius" : 3,
                            "borderBottomRightRadius" : 0,
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "icons" : {
                                "dropdown" : "multiSelectNormalRight:multiselect"
                            },
                            "paddingTop" : 5,
                            "paddingRight" : 10,
                            "paddingLeft" : 10,
                            "paddingBottom" : 5,
                            "frameHeight" : 16
                        },
                        "normalFocused" : {
                            "borderColor" : "#34495E",
                            "backgroundColor" : "#FFF",
                            "icons" : {
                                "dropdown" : "multiSelectNormalFocusedRight:multiselect"
                            }
                        },
                        "normalError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "multiSelectErrorRight:multiselect"
                            }
                        },
                        "normalErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "multiSelectErrorFocusedRight:multiselect"
                            }
                        },
                        "mandatory" : {
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "multiSelectMandatoryRight:multiselect"
                            }
                        },
                        "mandatoryFocused" : {
                            "backgroundColor" : "#FFC",
                            "borderColor" : "#F1C40F",
                            "icons" : {
                                "dropdown" : "multiSelectMandatoryFocusedRight:multiselect"
                            }
                        },
                        "mandatoryError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "multiSelectErrorRight:multiselect"
                            }
                        },
                        "mandatoryErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "multiSelectErrorFocusedRight:multiselect"
                            }
                        },
                        "readOnly" : {
                            "backgroundColor" : "#F8F8F8",
                            "icons" : {
                                "dropdown" : "multiSelectReadOnlyRight:multiselect"
                            }
                        },
                        "prefill" : {
                            "color" : "gray"
                        },
                        "disabled" : {
                            "backgroundColor" : "#DFDFDF",
                            "icons" : {
                                "dropdown" : "multiSelectDisabledRight:multiselect"
                            }
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "#b2b2b2"
                    },
                    "offsetTop" : 1,
                    "iconsLeft" : ""
                }
            },
            "Gauge" : {
                "std" : {
                    "labelMargins" : "3px 0 0 0",
                    "sprHeight" : 17,
                    "spriteUrl" : "",
                    "borderTopLeftRadius" : 25,
                    "borderBottomLeftRadius" : 25,
                    "borderTopRightRadius" : 25,
                    "borderBottomRightRadius" : 25,
                    "labelFontSize" : 12,
                    "backgroundColor" : "#0e90d2",
                    "container" : {
                        "borderTopLeftRadius" : 25,
                        "borderBottomLeftRadius" : 25,
                        "borderTopRightRadius" : 25,
                        "borderBottomRightRadius" : 25,
                        "backgroundColor" : "#F7F7F7",
                        "boxShadow" : "inset 0 1px 2px rgba(0, 0, 0, 0.1)"
                    }
                }
            },
            "Splitter" : {
                "std" : {
                    "borderColor" : "#DFDFDF",
                    "borderTopRightRadius" : 6,
                    "borderTopLeftRadius" : 6,
                    "borderBottomRightRadius" : 6,
                    "borderBottomLeftRadius" : 6,
                    "backgroundColor" : "#F8F8F8",

                    "handleBackgroundColor" : "#DFDFDF",
                    "handleSpriteURLv" : "atflatskin/handle-vertical.gif",
                    "handleSpriteURLh" : "atflatskin/handle-horizontal.gif",

                    "proxyBackgroundColor" : "#efefef",
                    "proxySpriteURLv" : "atflatskin/handle-vertical-proxy.gif",
                    "proxySpriteURLh" : "atflatskin/handle-horizontal-proxy.gif",

                    "separatorWidth" : 10,
                    "separatorHeight" : 10
                }
            },
            "DatePicker" : {
                "simple" : {
                    "innerPaddingTop" : 0,
                    "iconsRight" : "dropdown",
                    "innerPaddingRight" : 0,
                    "states" : {
                        "mandatoryErrorFocused" : {
                            "icons" : {
                                "dropdown" : "dropdown:datepicker_normal"
                            }
                        },
                        "normalErrorFocused" : {
                            "icons" : {
                                "dropdown" : "dropdown:datepicker_normal"
                            }
                        },
                        "normal" : {
                            "icons" : {
                                "dropdown" : "dropdown:datepicker_normal"
                            }
                        },
                        "mandatoryError" : {
                            "icons" : {
                                "dropdown" : "dropdown:datepicker_normal"
                            }
                        },
                        "normalFocused" : {
                            "icons" : {
                                "dropdown" : "dropdown:datepicker_normal"
                            }
                        },
                        "normalError" : {
                            "icons" : {
                                "dropdown" : "dropdown:datepicker_normal"
                            }
                        }
                    },
                    "offsetTop" : 1,
                    "innerPaddingLeft" : 0,
                    "simpleHTML" : true,
                    "innerPaddingBottom" : 0,
                    "iconsLeft" : ""
                },
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "calendar" : {
                        "sclass" : "std"
                    },
                    "states" : {
                        "normal" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderTopLeftRadius" : 3,
                            "borderTopRightRadius" : 0,
                            "borderBottomLeftRadius" : 3,
                            "borderBottomRightRadius" : 0,
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "icons" : {
                                "dropdown" : "datepickerNormalRight:datepicker"
                            },
                            "paddingTop" : 5,
                            "paddingRight" : 10,
                            "paddingLeft" : 10,
                            "paddingBottom" : 5,
                            "frameHeight" : 16
                        },
                        "normalFocused" : {
                            "borderColor" : "#34495E",
                            "backgroundColor" : "#FFF",
                            "icons" : {
                                "dropdown" : "datepickerNormalFocusedRight:datepicker"
                            }
                        },
                        "normalError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "datepickerNormalErrorRight:datepicker"
                            }
                        },
                        "normalErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "datepickerNormalErrorFocusedRight:datepicker"
                            }
                        },
                        "mandatory" : {
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "datepickerMandatoryRight:datepicker"
                            }
                        },
                        "mandatoryFocused" : {
                            "borderColor" : "#F1C40F",
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "datepickerMandatoryFocusedRight:datepicker"
                            }
                        },
                        "mandatoryError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "datepickerMandatoryErrorRight:datepicker"
                            }
                        },
                        "mandatoryErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "datepickerMandatoryErrorFocusedRight:datepicker"
                            }
                        },
                        "readOnly" : {
                            "backgroundColor" : "#F8F8F8",
                            "icons" : {
                                "dropdown" : "datepickerReadOnlyRight:datepicker"
                            }
                        },
                        "prefill" : {
                            "color" : "gray"
                        },
                        "disabled" : {
                            "backgroundColor" : "#DFDFDF",
                            "icons" : {
                                "dropdown" : "datepickerDisabledRight:datepicker"
                            }
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "#b2b2b2"
                    },
                    "offsetTop" : 1,
                    "iconsLeft" : ""
                }
            },
            "RadioButton" : {
                "simple" : {
                    "simpleHTML" : true
                },
                "std" : {
                    "iconset" : "radioButtons",
                    "iconprefix" : "rb_",
                    "states" : {
                        "disabledSelected" : {
                            "color" : "#999"
                        },
                        "normal" : {
                            "color" : "#000"
                        },
                        "focusedSelected" : {
                            "color" : "#000"
                        },
                        "focused" : {
                            "color" : "#000"
                        },
                        "normalSelected" : {
                            "color" : "#000"
                        },
                        "readonlySelected" : {
                            "color" : "#999"
                        },
                        "readonly" : {
                            "color" : "#999"
                        },
                        "disabled" : {
                            "color" : "#999"
                        }
                    }
                }
            },
            "Textarea" : {
                "std" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "borderSize" : 1,
                            "borderColor" : "#DFDFDF",
                            "borderTopRightRadius" : 3,
                            "borderBottomRightRadius" : 3,
                            "borderTopLeftRadius" : 3,
                            "borderBottomLeftRadius" : 3,
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "border" : "solid",
                            "paddingTop" : 5,
                            "paddingBottom" : 5,
                            "paddingRight" : 10,
                            "paddingLeft" : 10,
                            "marginTop" : 5
                        },
                        "normalFocused" : {
                            "borderColor" : "#34495E",
                            "backgroundColor" : "#FFF"
                        },
                        "normalError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "border" : "solid"
                        },
                        "normalErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "border" : "solid"
                        },
                        "mandatory" : {
                            "backgroundColor" : "#FFC"
                        },

                        "mandatoryFocused" : {
                            "borderColor" : "#F1C40F",
                            "backgroundColor" : "#FFC"
                        },
                        "mandatoryError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "border" : "solid"
                        },
                        "mandatoryErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "border" : "solid"
                        },
                        "readOnly" : {
                            "backgroundColor" : "#F8F8F8",
                            "color" : "#000"
                        },
                        "disabled" : {
                            "borderColor" : "#DFDFDF",
                            "backgroundColor" : "#DFDFDF"
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "#b2b2b2"
                    },
                    "innerPaddingLeft" : 2
                }
            },
            "TabPanel" : {
                "std" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "color" : "#34495c",
                            "backgroundColor" : "#ECF0F1",
                            "paddingTop" : 5,
                            "paddingLeft" : 15,
                            "paddingRight" : 15,
                            "paddingBottom" : 5,
                            "borderTopLeftRadius" : 6,
                            "borderTopRightRadius" : 6,
                            "borderBottomLeftRadius" : 6,
                            "borderBottomRightRadius" : 6
                        }
                    }
                }
            },
            "Dialog" : {
                "std" : {
                    "titleBarLeft" : 0,
                    "titleBarTop" : 0,
                    "closeIcon" : "std:close",
                    "maximizeIcon" : "std:maximize",
                    "titleBarHeight" : 32,
                    "titleColor" : "#34495e",
                    "divsclass" : "dlg",
                    "titleBarRight" : 10
                }
            },
            "Calendar" : {
                "std" : {
                    "previousPageIcon" : "std:leftArrow",
                    "nextPageIcon" : "std:rightArrow",
                    "fontSize" : 14,

                    "defaultTemplate" : "aria.widgets.calendar.CalendarTemplate",
                    "divsclass" : "calendar",

                    "generalBackgroundColor" : "#FFF",

                    "dayBorderColor" : "#FFF",
                    "dayBackgroundColor" : "#FFF",
                    "dayColor" : "#000",
                    "dayPadding" : "3px",

                    "monthTitleBackgroundColor" : "#FFF",
                    "monthTitleBorderColor" : "#FFF",
                    "monthTitleColor" : "#34495E",
                    "monthTitlePaddingBottom" : "3px",
                    "monthTitlePaddingTop" : "3px",
                    "monthTitleFontSize" : 16,

                    "weekDaysLabelBackgroundColor" : "#FFF",
                    "weekDaysLabelBorderColor" : "#FFF",
                    "weekDaysLabelColor" : "#2C3E50",
                    "weekDaysLabelFontWeight" : "bold",
                    "weekDaysLabelPadding" : "3px",

                    "weekEndBackgroundColor" : "#DFDFDF",
                    "weekEndBorderColor" : "#DFDFDF",
                    "weekEndColor" : "#000",

                    "weekNumberBackgroundColor" : "#FFF",
                    "weekNumberBorderColor" : "#FFF",

                    "selectedBorderColor" : "#E74C3C",
                    "selectedBackgroundColor" : "#E74C3C",
                    "selectedColor" : "#FFF",

                    "mouseOverBorderColor" : "#E74C3C",
                    "mouseOverBackgroundColor" : "#FFF",
                    "mouseOverColor" : "#000",

                    "todayBorderColor" : "#34495E",
                    "todayBackgroundColor" : "#34495E",
                    "todayColor" : "#FFF"
                }
            },
            "general" : {
                "imagesRoot" : "aria/css/",
                "colors" : {
                    "disabled" : "#DFDFDF"
                },
                "font" : {
                    "family" : "Arial,Tahoma, sans-serif",
                    "size" : 14
                },
                "anchor" : {
                    "states" : {
                        "visited" : {
                            "text" : {
                                "decoration" : "none"
                            },
                            "color" : "#2478AD"
                        },
                        "normal" : {
                            "text" : {
                                "decoration" : "none"
                            },
                            "color" : "#2478AD"
                        },
                        "link" : {
                            "text" : {
                                "decoration" : "none"
                            },
                            "color" : "#2478AD"
                        },
                        "hover" : {
                            "text" : {
                                "decoration" : "underline"
                            },
                            "color" : "#2E99D9"
                        },
                        "focus" : {
                            "color" : "#2E99D9",
                            "outline" : "#000 dotted 1px",
                            "text" : {}
                        }
                    }
                },
                "overlay" : {
                    "backgroundColor" : "#F8F8F8",
                    "opacity" : 80,
                    "border" : "1px solid #DFDFDF",
                    "borderTopRightRadius" : 6,
                    "borderTopLeftRadius" : 6,
                    "borderBottomRightRadius" : 6,
                    "borderBottomLeftRadius" : 6
                },
                "loadingOverlay" : {
                    "backgroundColor" : "#FFF",
                    "opacity" : 80,
                    "spriteURL" : "atflatskin/loading.gif"
                },
                "dialogMask" : {
                    "backgroundColor" : "#000"
                }
            },
            "Select" : {
                "simple" : {
                    "simpleHTML" : true
                },
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderTopLeftRadius" : 3,
                            "borderTopRightRadius" : 0,
                            "borderBottomLeftRadius" : 3,
                            "borderBottomRightRadius" : 0,
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "icons" : {
                                "dropdown" : "selectBoxNormalRight:selectbox"
                            },
                            "paddingTop" : 5,
                            "paddingRight" : 10,
                            "paddingLeft" : 10,
                            "paddingBottom" : 5,
                            "frameHeight" : 16
                        },
                        "normalFocused" : {
                            "borderColor" : "#34495E",
                            "backgroundColor" : "#FFF",
                            "icons" : {
                                "dropdown" : "selectBoxNormalFocusedRight:selectbox"
                            }
                        },
                        "normalError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "selectBoxNormalErrorRight:selectbox"
                            }
                        },
                        "normalErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "selectBoxNormalErrorFocusedRight:selectbox"
                            }
                        },
                        "mandatory" : {
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "selectBoxMandatoryRight:selectbox"
                            }
                        },
                        "mandatoryFocused" : {
                            "borderColor" : "#F1C40F",
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "selectBoxMandatoryFocusedRight:selectbox"
                            }
                        },
                        "mandatoryError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "selectBoxMandatoryErrorRight:selectbox"
                            }
                        },
                        "mandatoryErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "selectBoxMandatoryErrorFocusedRight:selectbox"
                            }
                        },
                        "readOnly" : {
                            "backgroundColor" : "#F8F8F8",
                            "icons" : {
                                "dropdown" : "selectBoxReadOnlyRight:selectbox"
                            }
                        },
                        "disabled" : {
                            "backgroundColor" : "#DFDFDF",
                            "icons" : {
                                "dropdown" : "selectBoxDisabledRight:selectbox"
                            }
                        }
                    },
                    "offsetTop" : 1,
                    "iconsLeft" : ""
                }
            },
            "Button" : {
                "important" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#1abc9c"
                        },
                        "msdown" : {
                            "backgroundColor" : "#47c9af"
                        },
                        "msover" : {
                            "backgroundColor" : "#47c9af"
                        },
                        "msoverFocused" : {
                            "backgroundColor" : "#47c9af"
                        }
                    }
                },
                "simple" : {
                    "simpleHTML" : true
                },
                "std" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "color" : "#FFF",
                            "backgroundColor" : "#0f90d2",
                            "borderSize" : 0,
                            "border" : "none",
                            "paddingTop" : 7,
                            "paddingLeft" : 15,
                            "paddingBottom" : 7,
                            "paddingRight" : 15,
                            "borderTopRightRadius" : 3,
                            "borderBottomRightRadius" : 3,
                            "borderTopLeftRadius" : 3,
                            "borderBottomLeftRadius" : 3
                        },
                        "normalFocused" : {
                            "color" : "#FFF",
                            "backgroundColor" : "#0f90d2",
                            "borderSize" : 0,
                            "border" : "none",
                            "paddingTop" : 7,
                            "paddingLeft" : 15,
                            "paddingBottom" : 7,
                            "paddingRight" : 15,
                            "borderTopRightRadius" : 3,
                            "borderBottomRightRadius" : 3,
                            "borderTopLeftRadius" : 3,
                            "borderBottomLeftRadius" : 3
                        },
                        "disabled" : {
                            "color" : "#f8f8f8",
                            "backgroundColor" : "#bdc3c7"
                        },
                        "msdown" : {
                            "backgroundColor" : "#3ea6db"
                        },
                        "msover" : {
                            "backgroundColor" : "#3ea6db"
                        },
                        "msoverFocused" : {
                            "backgroundColor" : "#3ea6db"
                        }
                    }
                }
            },
            "Link" : {
                "std" : {
                    "states" : {
                        "normal" : {
                            "textDecoration" : "none",
                            "color" : "#2478AD"
                        },
                        "hover" : {
                            "textDecoration" : "underline",
                            "color" : "#2E99D9"
                        },
                        "focus" : {
                            "textDecoration" : "underline",
                            "color" : "#2E99D9"
                        }
                    }
                }
            },
            "SelectBox" : {
                "important" : {
                    "label" : {
                        "fontWeight" : "bold"
                    }
                },
                "simple" : {
                    "innerPaddingTop" : 0,
                    "iconsRight" : "dropdown",
                    "innerPaddingRight" : 0,
                    "states" : {
                        "readOnly" : {
                            "color" : "#AB9B85"
                        },
                        "mandatoryErrorFocused" : {
                            "icons" : {
                                "dropdown" : "dropdown:selectbox_normal"
                            }
                        },
                        "normalErrorFocused" : {
                            "icons" : {
                                "dropdown" : "dropdown:selectbox_normal"
                            }
                        },
                        "normal" : {
                            "color" : "#000000",
                            "icons" : {
                                "dropdown" : "dropdown:selectbox_normal"
                            }
                        },
                        "mandatoryError" : {
                            "icons" : {
                                "dropdown" : "dropdown:selectbox_normal"
                            }
                        },
                        "normalFocused" : {
                            "icons" : {
                                "dropdown" : "dropdown:selectbox_normal"
                            }
                        },
                        "disabled" : {
                            "color" : "#E6D9C6",
                            "label" : {
                                "color" : "#E6D9C6"
                            }
                        },
                        "normalError" : {
                            "icons" : {
                                "dropdown" : "dropdown:selectbox_normal"
                            }
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "#b2b2b2"
                    },
                    "offsetTop" : 1,
                    "innerPaddingLeft" : 0,
                    "innerPaddingBottom" : 0,
                    "simpleHTML" : true,
                    "iconsLeft" : ""
                },
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderTopLeftRadius" : 3,
                            "borderTopRightRadius" : 0,
                            "borderBottomLeftRadius" : 3,
                            "borderBottomRightRadius" : 0,
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "icons" : {
                                "dropdown" : "selectBoxNormalRight:selectbox"
                            },
                            "paddingTop" : 5,
                            "paddingRight" : 10,
                            "paddingLeft" : 10,
                            "paddingBottom" : 5,
                            "frameHeight" : 16
                        },
                        "normalFocused" : {
                            "borderColor" : "#34495E",
                            "backgroundColor" : "#FFF",
                            "icons" : {
                                "dropdown" : "selectBoxNormalFocusedRight:selectbox"
                            }
                        },
                        "normalError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "selectBoxNormalErrorRight:selectbox"
                            }
                        },
                        "normalErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "selectBoxNormalErrorFocusedRight:selectbox"
                            }
                        },
                        "mandatory" : {
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "selectBoxMandatoryRight:selectbox"
                            }
                        },
                        "mandatoryFocused" : {
                            "backgroundColor" : "#FFC",
                            "borderColor" : "#F1C40F",
                            "icons" : {
                                "dropdown" : "selectBoxMandatoryFocusedRight:selectbox"
                            }
                        },
                        "mandatoryError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "selectBoxMandatoryErrorRight:selectbox"
                            }
                        },
                        "mandatoryErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "selectBoxMandatoryErrorFocusedRight:selectbox"
                            }
                        },
                        "readOnly" : {
                            "backgroundColor" : "#F8F8F8",
                            "icons" : {
                                "dropdown" : "selectBoxReadOnlyRight:selectbox"
                            }
                        },
                        "prefill" : {
                            "color" : "gray"
                        },
                        "disabled" : {
                            "backgroundColor" : "#DFDFDF",
                            "icons" : {
                                "dropdown" : "selectBoxDisabledRight:selectbox"
                            }
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "#b2b2b2"
                    },
                    "offsetTop" : 1,
                    "iconsLeft" : ""
                }
            },
            "TextInput" : {
                "simpleIcon" : {
                    "states" : {
                        "normalError" : {
                            "icons" : {
                                "dropdown" : "std:error"
                            }
                        },
                        "normal" : {
                            "icons" : {
                                "dropdown" : "std:confirm"
                            }
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "#b2b2b2"
                    },
                    "iconsLeft" : "dropdown",
                    "simpleHTML" : true
                },
                "important" : {
                    "label" : {
                        "fontWeight" : "bold"
                    }
                },
                "simple" : {
                    "simpleHTML" : true
                },
                "std" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "borderSize" : 1,
                            "borderColor" : "#DFDFDF",
                            "borderTopRightRadius" : 3,
                            "borderBottomRightRadius" : 3,
                            "borderTopLeftRadius" : 3,
                            "borderBottomLeftRadius" : 3,
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "border" : "solid",
                            "paddingTop" : 5,
                            "paddingBottom" : 5,
                            "paddingRight" : 10,
                            "paddingLeft" : 10
                        },
                        "normalFocused" : {
                            "borderColor" : "#34495E",
                            "backgroundColor" : "#FFF"
                        },
                        "normalError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "border" : "solid"
                        },
                        "normalErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "border" : "solid"
                        },
                        "mandatory" : {
                            "backgroundColor" : "#FFC"
                        },
                        "mandatoryFocused" : {
                            "borderColor" : "#F1C40F",
                            "backgroundColor" : "#FFC"
                        },
                        "mandatoryError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "border" : "solid"
                        },
                        "mandatoryErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "border" : "solid"
                        },
                        "readOnly" : {
                            "backgroundColor" : "#F8F8F8",
                            "color" : "#000"
                        },
                        "prefill" : {
                            "color" : "gray"
                        },
                        "disabled" : {
                            "borderColor" : "#DFDFDF",
                            "backgroundColor" : "#DFDFDF"
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "#b2b2b2"
                    }
                }
            },
            "CheckBox" : {
                "simple" : {
                    "simpleHTML" : true
                },
                "std" : {
                    "iconset" : "checkBoxes",
                    "iconprefix" : "cb_",
                    "states" : {
                        "disabledSelected" : {
                            "color" : "#999"
                        },
                        "normal" : {
                            "color" : "#000"
                        },
                        "focusedSelected" : {
                            "color" : "#000"
                        },
                        "focused" : {
                            "color" : "#000"
                        },

                        "normalSelected" : {
                            "color" : "#000"
                        },
                        "readonlySelected" : {
                            "color" : "#999"
                        },
                        "readonly" : {
                            "color" : "#999"
                        },
                        "disabled" : {
                            "color" : "#999"
                        }
                    }
                }
            },
            "Tab" : {
                "demoMainTabs" : {
                    "frame" : {
                        "frameType" : "Table"
                    },
                    "states" : {
                        "selectedFocused" : {
                            "marginBottom" : 0,
                            "spcTop" : 14,
                            "sprHeight" : 24,
                            "backgroundColor" : "#FFFFFF",
                            "color" : "#4776A7",
                            "sprIdx" : 0
                        },
                        "selected" : {
                            "marginBottom" : 0,
                            "spcTop" : 14,
                            "sprHeight" : 24,
                            "color" : "#4776A7",
                            "backgroundColor" : "#FFFFFF",
                            "sprIdx" : 0
                        },
                        "normal" : {
                            "marginLeft" : 0,
                            "marginTop" : 0,
                            "backgroundColor" : "#4776A7",
                            "spriteURLh" : "atskin/sprites/tabs_h.png",
                            "marginRight" : 0,
                            "sprIdx" : 1,
                            "spcLeft" : 22,
                            "sprSpacing" : 2,
                            "marginBottom" : 0,
                            "spriteURLv" : "atskin/sprites/tabs_v.png",
                            "spcTop" : 17,
                            "sprWidth" : 44,
                            "sprHeight" : 24,
                            "color" : "#fff",
                            "spriteURL" : "atskin/sprites/tabs.png"
                        },
                        "msoverFocused" : {
                            "spcTop" : 17,
                            "sprHeight" : 24,
                            "backgroundColor" : "#2f6093",
                            "marginTop" : 0,
                            "color" : "#fff",
                            "sprIdx" : 2,
                            "sprSpacing" : 2
                        },
                        "msover" : {
                            "spcTop" : 17,
                            "sprHeight" : 24,
                            "backgroundColor" : "#2f6093",
                            "color" : "#fff",
                            "marginTop" : 0,
                            "sprIdx" : 2,
                            "sprSpacing" : 2
                        },
                        "disabled" : {
                            "spriteURLv" : "atskin/sprites/tabs_v.png",
                            "sprHeight" : 40,
                            "color" : "#4776A7",
                            "marginTop" : 0,
                            "backgroundColor" : "#444444",
                            "spriteURLh" : "atskin/sprites/tabs_h.png",
                            "sprIdx" : 3,
                            "sprSpacing" : 2,
                            "spriteURL" : "atskin/sprites/tabs.png"
                        }
                    }
                },
                "std" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "selectedFocused" : {
                            "color" : "#34495c",
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#ECF0F1",
                            "backgroundColor" : "#ECF0F1",
                            "fontWeight" : "bold"
                        },
                        "selected" : {
                            "color" : "#34495c",
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#ECF0F1",
                            "backgroundColor" : "#ECF0F1",
                            "fontWeight" : "bold"
                        },
                        "normal" : {
                            "color" : "#FFF",
                            "backgroundColor" : "#34495e",
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#34495e",
                            "borderTopLeftRadius" : 6,
                            "borderTopRightRadius" : 6,
                            "paddingTop" : 10,
                            "paddingRight" : 20,
                            "paddingBottom" : 10,
                            "paddingLeft" : 20
                        },
                        "msoverFocused" : {
                            "backgroundColor" : "#485b6e",
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#485b6e"
                        },
                        "msover" : {
                            "backgroundColor" : "#485b6e",
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#485b6e"
                        },
                        "disabled" : {
                            "color" : "#999",
                            "backgroundColor" : "#DFDFDF",
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#DFDFDF"
                        }
                    }
                }
            },
            "List" : {
                "std" : {
                    "mouseOverBackgroundColor" : "#0088CC",
                    "selectedItemColor" : "#FFF",
                    "selectedItemBackgroundColor" : "#0088CC",
                    "divsclass" : "list",
                    "mouseOverColor" : "#FFF",
                    "footer" : {
                        "borderStyle" : "none",
                        "backgroundColor" : "transparent"
                    }
                },
                "dropdown" : {
                    "highlightMouseOver" : false,
                    "divsclass" : "dropdown"
                }
            },
            "Icon" : {
                "autoCompleteAirTrain" : {
                    "content" : {
                        "airport" : 1,
                        "sub" : 7,
                        "multiple_train" : 5,
                        "star" : 0,
                        "train" : 4,
                        "multiple_airport" : 2,
                        "city" : 6,
                        "train_airport" : 3
                    },
                    "spriteSpacing" : 2,
                    "direction" : "x",
                    "iconWidth" : 16,
                    "spriteURL" : "atskin/sprites/airtrainicons_16x16.gif",
                    "iconHeight" : 16,
                    "biDimensional" : false
                },
                "datepickerNormalRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#FFF",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "datepickerNormalFocusedRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#FFF",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#34495E",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "datepickerNormalErrorRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#f2dede",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#d87e8b",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "datepickerNormalErrorFocusedRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#f2dede",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#be293f",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "datepickerDisabledRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#DFDFDF",
                    "biDimensional" : false
                },
                "datepickerMandatoryRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#FFC",
                    "biDimensional" : false
                },
                "datepickerMandatoryFocusedRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#F1C40F",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#FFC",
                    "biDimensional" : false
                },
                "datepickerMandatoryErrorRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#d87e8b",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#f2dede",
                    "biDimensional" : false
                },
                "datepickerMandatoryErrorFocusedRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#be293f",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#f2dede",
                    "biDimensional" : false
                },
                "datepickerReadOnlyRight" : {
                    "content" : {
                        "datepicker" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/datepicker.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#F8F8F8",
                    "biDimensional" : false
                },
                "multiSelectNormalRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#FFF",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "multiSelectNormalFocusedRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#FFF",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#34495E",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "multiSelectNormalErrorRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#f2dede",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#d87e8b",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "multiSelectNormalErrorFocusedRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#f2dede",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#be293f",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "multiSelectDisabledRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#DFDFDF",
                    "biDimensional" : false
                },
                "multiSelectMandatoryRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#FFC",
                    "biDimensional" : false
                },
                "multiSelectMandatoryFocusedRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#F1C40F",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#FFC",
                    "biDimensional" : false
                },
                "multiSelectMandatoryErrorRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#d87e8b",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#f2dede",
                    "biDimensional" : false
                },
                "multiSelectMandatoryErrorFocusedRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#be293f",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#f2dede",
                    "biDimensional" : false
                },
                "multiSelectReadOnlyRight" : {
                    "content" : {
                        "multiselect" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/multiselect-expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#F8F8F8",
                    "biDimensional" : false
                },
                "selectBoxNormalRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#FFF",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "selectBoxNormalFocusedRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#FFF",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#34495E",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "selectBoxNormalErrorRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#f2dede",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#d87e8b",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "selectBoxNormalErrorFocusedRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#f2dede",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#be293f",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "selectBoxDisabledRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#DFDFDF",
                    "biDimensional" : false
                },
                "selectBoxMandatoryRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#FFC",
                    "biDimensional" : false
                },
                "selectBoxMandatoryFocusedRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#F1C40F",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#FFC",
                    "biDimensional" : false
                },
                "selectBoxMandatoryErrorRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#d87e8b",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#f2dede",
                    "biDimensional" : false
                },
                "selectBoxMandatoryErrorFocusedRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#be293f",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#f2dede",
                    "biDimensional" : false
                },
                "selectBoxReadOnlyRight" : {
                    "content" : {
                        "selectbox" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#F8F8F8",
                    "biDimensional" : false
                },
                "autocompleteNormalRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#FFF",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "autocompleteNormalFocusedRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#FFF",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#34495E",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "autocompleteNormalErrorRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#f2dede",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#d87e8b",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "autocompleteNormalErrorFocusedRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "backgroundColor" : "#f2dede",
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#be293f",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "biDimensional" : false
                },
                "autocompleteDisabledRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#DFDFDF",
                    "biDimensional" : false
                },
                "autocompleteMandatoryRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#FFC",
                    "biDimensional" : false
                },
                "autocompleteMandatoryFocusedRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#F1C40F",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#FFC",
                    "biDimensional" : false
                },
                "autocompleteMandatoryErrorRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#d87e8b",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#f2dede",
                    "biDimensional" : false
                },
                "autocompleteMandatoryErrorFocusedRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#be293f",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#f2dede",
                    "biDimensional" : false
                },
                "autocompleteReadOnlyRight" : {
                    "content" : {
                        "autocomplete" : 0
                    },
                    "spriteSpacing" : 1,
                    "direction" : "x",
                    "iconWidth" : 26,
                    "iconHeight" : 26,
                    "spriteURL" : "atflatskin/expand.gif",
                    "backgroundSize" : 100,
                    "borderTop" : 1,
                    "borderRight" : 1,
                    "borderBottom" : 1,
                    "borderLeft" : 0,
                    "borderStyle" : "solid",
                    "borderColor" : "#DFDFDF",
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 0,
                    "borderBottomLeftRadius" : 0,
                    "backgroundColor" : "#F8F8F8",
                    "biDimensional" : false
                },
                "checkBoxes" : {
                    "content" : {
                        "cb_normal" : 1,
                        "cb_focused" : 1,
                        "cb_focusedSelected" : 0,
                        "cb_disabled" : 2,
                        "cb_normalSelected" : 0,
                        "cb_disabledSelected" : 3,
                        "cb_readonly" : 2,
                        "cb_readonlySelected" : 3
                    },
                    "spriteSpacing" : 0,
                    "direction" : "y",
                    "iconWidth" : 16,
                    "iconHeight" : 16,
                    "spriteURL" : "atflatskin/checkbox.gif",
                    "biDimensional" : false,
                    "backgroundSize" : 100,
                    "backgroundColor" : "transparent"
                },
                "radioButtons" : {
                    "content" : {
                        "rb_normal" : 1,
                        "rb_focused" : 1,
                        "rb_focusedSelected" : 0,
                        "rb_disabled" : 2,
                        "rb_normalSelected" : 0,
                        "rb_disabledSelected" : 3,
                        "rb_readonly" : 2,
                        "rb_readonlySelected" : 3
                    },
                    "spriteSpacing" : 0,
                    "direction" : "y",
                    "iconWidth" : 16,
                    "iconHeight" : 16,
                    "spriteURL" : "atflatskin/radiobuttons.gif",
                    "biDimensional" : false,
                    "borderBottomRightRadius" : 3,
                    "borderTopRightRadius" : 3,
                    "borderTopLeftRadius" : 3,
                    "borderBottomLeftRadius" : 3,
                    "backgroundSize" : 100,
                    "backgroundColor" : "transparent"
                },
                "std" : {
                    "content" : {
                        "confirm" : 1,
                        "error" : 0,
                        "warning" : 3,
                        "info" : 2,
                        "save" : 15,
                        "zoom_in" : 18,
                        "zoom_out" : 19,
                        "close" : 4,
                        "maximize" : 17,
                        "add_line" : 5,
                        "rm_line" : 16,
                        "up_arrow" : 11,
                        "right_arrow" : 14,
                        "down_arrow" : 12,
                        "left_arrow" : 13,
                        "upArrow" : 7,
                        "rightArrow" : 8,
                        "downArrow" : 9,
                        "leftArrow" : 10,
                        "expand" : 20,
                        "collapse" : 21,
                        "home" : 6
                    },
                    "spriteSpacing" : 0,
                    "direction" : "y",
                    "iconWidth" : 16,
                    "spriteURL" : "atflatskin/standard-icons.gif",
                    "iconHeight" : 16,
                    "biDimensional" : false,
                    "backgroundColor" : "transparent"
                },
                "std23" : {
                    "content" : {
                        "confirm" : 1,
                        "error" : 0,
                        "warning" : 3,
                        "info" : 2,
                        "save" : 15,
                        "zoom_in" : 18,
                        "zoom_out" : 19,
                        "close" : 4,
                        "maximize" : 17,
                        "add_line" : 5,
                        "rm_line" : 16,
                        "up_arrow" : 11,
                        "right_arrow" : 14,
                        "down_arrow" : 12,
                        "left_arrow" : 13,
                        "upArrow" : 7,
                        "rightArrow" : 8,
                        "downArrow" : 9,
                        "leftArrow" : 10,
                        "expand" : 20,
                        "collapse" : 21,
                        "home" : 6
                    },
                    "spriteSpacing" : 0,
                    "direction" : "y",
                    "iconWidth" : 23,
                    "spriteURL" : "atflatskin/standard-icons-large.gif",
                    "iconHeight" : 23,
                    "biDimensional" : false,
                    "backgroundColor" : "transparent"
                },
                "dropdown" : {
                    "content" : {
                        "multiselect_error" : 8,
                        "datepicker_focused" : 4,
                        "selectbox_focused" : 1,
                        "multiselect_focused" : 7,
                        "datepicker_error" : 5,
                        "datepicker_normal" : 3,
                        "multiselect_normal" : 6,
                        "selectbox_error" : 2,
                        "selectbox_normal" : 0
                    },
                    "spriteSpacing" : 2,
                    "direction" : "x",
                    "iconWidth" : 14,
                    "spriteURL" : "atskin/imgs/dropdownbtns.gif",
                    "iconHeight" : 20,
                    "biDimensional" : false
                },
                "sortIndicator" : {
                    "content" : {
                        "si_normal" : 0,
                        "si_ascending" : 2,
                        "si_descending" : 1
                    },
                    "spriteSpacing" : 0,
                    "direction" : "y",
                    "iconWidth" : 23,
                    "spriteURL" : "atflatskin/sortindicator.gif",
                    "iconHeight" : 23,
                    "backgroundColor" : "transparent",
                    "biDimensional" : false
                }
            },
            "AutoComplete" : {
                "important" : {
                    "label" : {
                        "fontWeight" : "bold"
                    }
                },
                "simple" : {
                    "simpleHTML" : true
                },
                "underlineError" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderTopLeftRadius" : 3,
                            "borderTopRightRadius" : 3,
                            "borderBottomLeftRadius" : 3,
                            "borderBottomRightRadius" : 3,
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "icons" : {
                                "dropdown" : "autocompleteNormalRight:autocomplete"
                            },
                            "paddingTop" : 5,
                            "paddingRight" : 10,
                            "paddingLeft" : 10,
                            "paddingBottom" : 5,
                            "skipRightBorder" : "dependsOnIcon",
                            "frameHeight" : 16
                        },
                        "normalFocused" : {
                            "borderColor" : "#34495E",
                            "backgroundColor" : "#FFF",
                            "icons" : {
                                "dropdown" : "autocompleteNormalFocusedRight:autocomplete"
                            }
                        },
                        "normalError" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "autocompleteNormalErrorRight:autocomplete"
                            }
                        },
                        "normalErrorFocused" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "autocompleteNormalErrorFocusedRight:autocomplete"
                            }
                        },
                        "mandatory" : {
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "autocompleteMandatoryRight:autocomplete"
                            }
                        },
                        "mandatoryFocused" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#F1C40F",
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "autocompleteMandatoryFocusedRight:autocomplete"
                            }
                        },
                        "mandatoryError" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "autocompleteMandatoryErrorRight:autocomplete"
                            }
                        },
                        "mandatoryErrorFocused" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "autocompleteMandatoryErrorFocusedRight:autocomplete"
                            }
                        },
                        "readOnly" : {
                            "backgroundColor" : "#F8F8F8",
                            "color" : "#000",
                            "icons" : {
                                "dropdown" : "autocompleteReadOnlyRight:autocomplete"
                            }
                        },
                        "disabled" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "color" : "#b2b2b2",
                            "backgroundColor" : "#DFDFDF",
                            "icons" : {
                                "dropdown" : "autocompleteDisabledRight:autocomplete"
                            }
                        }
                    }
                },
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "borderTop" : 1,
                            "borderLeft" : 1,
                            "borderBottom" : 1,
                            "borderRight" : 1,
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderTopLeftRadius" : 3,
                            "borderTopRightRadius" : 3,
                            "borderBottomLeftRadius" : 3,
                            "borderBottomRightRadius" : 3,
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "icons" : {
                                "dropdown" : "autocompleteNormalRight:autocomplete"
                            },
                            "paddingTop" : 5,
                            "paddingRight" : 10,
                            "paddingLeft" : 10,
                            "paddingBottom" : 5,
                            "skipRightBorder" : "dependsOnIcon",
                            "frameHeight" : 16
                        },
                        "normalFocused" : {
                            "borderColor" : "#34495E",
                            "backgroundColor" : "#FFF",
                            "icons" : {
                                "dropdown" : "autocompleteNormalFocusedRight:autocomplete"
                            }
                        },
                        "normalError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "autocompleteNormalErrorRight:autocomplete"
                            }
                        },
                        "normalErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "autocompleteNormalErrorFocusedRight:autocomplete"
                            },
                            "border" : "solid"
                        },
                        "mandatory" : {
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "autocompleteMandatoryRight:autocomplete"
                            }
                        },
                        "mandatoryFocused" : {
                            "borderColor" : "#F1C40F",
                            "backgroundColor" : "#FFC",
                            "icons" : {
                                "dropdown" : "autocompleteMandatoryFocusedRight:autocomplete"
                            }
                        },
                        "mandatoryError" : {
                            "borderColor" : "#d87e8b",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "autocompleteMandatoryErrorRight:autocomplete"
                            }
                        },
                        "mandatoryErrorFocused" : {
                            "borderColor" : "#be293f",
                            "backgroundColor" : "#f2dede",
                            "icons" : {
                                "dropdown" : "autocompleteMandatoryErrorFocusedRight:autocomplete"
                            },
                            "border" : "solid"
                        },
                        "readOnly" : {
                            "backgroundColor" : "#F8F8F8",
                            "color" : "#000",
                            "icons" : {
                                "dropdown" : "autocompleteReadOnlyRight:autocomplete"
                            }
                        },
                        "prefill" : {
                            "color" : "gray"
                        },
                        "disabled" : {
                            "borderColor" : "#DFDFDF",
                            "color" : "#b2b2b2",
                            "backgroundColor" : "#DFDFDF",
                            "icons" : {
                                "dropdown" : "autocompleteDisabledRight:autocomplete"
                            }
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "#b2b2b2"
                    },
                    "offsetTop" : 1
                }
            },
            "ErrorList" : {
                "std" : {
                    "divsclass" : "errorlist"
                }
            },
            "Div" : {
                "dlg" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#F8F8F8",
                            "borderTopRightRadius" : 6,
                            "borderBottomRightRadius" : 6,
                            "borderTopLeftRadius" : 6,
                            "borderBottomLeftRadius" : 6,
                            "paddingLeft" : 12,
                            "paddingBottom" : 12,
                            "paddingTop" : 12,
                            "paddingRight" : 12
                        }
                    }
                },
                "errorlist" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#F8F8F8",
                            "color" : "#000",
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderSize" : 1,
                            "borderTopRightRadius" : 6,
                            "borderBottomRightRadius" : 6,
                            "borderTopLeftRadius" : 6,
                            "borderBottomLeftRadius" : 6,
                            "paddingBottom" : 10,
                            "paddingTop" : 10,
                            "paddingLeft" : 15,
                            "paddingRight" : 15
                        }
                    }
                },
                "basic" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#F8F8F8",
                            "borderTopRightRadius" : 6,
                            "borderBottomRightRadius" : 6,
                            "borderTopLeftRadius" : 6,
                            "borderBottomLeftRadius" : 6,
                            "paddingLeft" : 12,
                            "paddingBottom" : 12,
                            "paddingTop" : 12,
                            "paddingRight" : 12
                        }
                    }
                },
                "std" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "color" : "#000"
                        }
                    }
                },
                "errortip" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#E74C3C",
                            "paddingLeft" : 8,
                            "paddingBottom" : 8,
                            "paddingTop" : 8,
                            "paddingRight" : 8,
                            "color" : "#FFF",
                            "borderTopRightRadius" : 6,
                            "borderBottomRightRadius" : 6,
                            "borderTopLeftRadius" : 6,
                            "borderBottomLeftRadius" : 6
                        }
                    }
                },
                "list" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#F8F8F8",
                            "color" : "#000",
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderSize" : 1,
                            "borderTopRightRadius" : 6,
                            "borderBottomRightRadius" : 6,
                            "borderTopLeftRadius" : 6,
                            "borderBottomLeftRadius" : 6,
                            "paddingBottom" : 10,
                            "paddingTop" : 10,
                            "paddingLeft" : 15,
                            "paddingRight" : 15
                        }
                    }
                },
                "calendar" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#FFF",
                            "color" : "#000",
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderSize" : 1,
                            "borderTopRightRadius" : 6,
                            "borderBottomRightRadius" : 6,
                            "borderTopLeftRadius" : 6,
                            "borderBottomLeftRadius" : 6,
                            "paddingBottom" : 10,
                            "paddingTop" : 10,
                            "paddingLeft" : 15,
                            "paddingRight" : 15
                        }
                    }
                },
                "dropdown" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#F8F8F8",
                            "color" : "#000",
                            "border" : "solid",
                            "borderColor" : "#DFDFDF",
                            "borderSize" : 1,
                            "borderTopRightRadius" : 6,
                            "borderBottomRightRadius" : 6,
                            "borderTopLeftRadius" : 6,
                            "borderBottomLeftRadius" : 6,
                            "paddingBottom" : 10,
                            "paddingTop" : 10,
                            "paddingLeft" : 15,
                            "paddingRight" : 15
                        }
                    }
                },
                "tooltip" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "backgroundColor" : "#34495E",
                            "paddingLeft" : 8,
                            "paddingBottom" : 8,
                            "paddingTop" : 8,
                            "paddingRight" : 8,
                            "color" : "#FFF",
                            "borderTopRightRadius" : 6,
                            "borderBottomRightRadius" : 6,
                            "borderTopLeftRadius" : 6,
                            "borderBottomLeftRadius" : 6
                        }
                    }
                }
            }
        }
    }
});
