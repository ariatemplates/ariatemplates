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
    $classpath : "aria.widgets.AriaSkin",
    $singleton : true,
    $prototype : {
        skinName : "atskin",
        skinObject : {
            SortIndicator : {
                std : {
                    iconset : "sortIndicator",
                    iconprefix : "si_"
                }
            },
            Fieldset : {
                std : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        normal : {
                            spriteURLv : "atskin/sprites/fieldset_v.gif",
                            spcTop : 12,
                            sprWidth : 13,
                            sprHeight : 16,
                            marginTop : 10,
                            backgroundColor : "#FFFFF7",
                            spriteURLh : "atskin/sprites/fieldset_h.gif",
                            spcLeft : 6,
                            label : {
                                backgroundColor : "#FFFFF7",
                                left : 10,
                                paddingLeft : 5,
                                top : 2,
                                paddingRight : 5
                            },
                            spriteURL : "atskin/sprites/fieldset.gif"
                        }
                    }
                }
            },
            MultiSelect : {
                std : {
                    iconsRight : "dropdown",
                    frame : {
                        frameType : "FixedHeight"
                    },
                    states : {
                        normal : {
                            marginBottom : 2,
                            spriteURLv : "atskin/sprites/inputCentre.gif",
                            sprHeight : 20,
                            sprWidth : 7,
                            marginTop : 3,
                            color : "#000000",
                            sprIdx : 0,
                            spcLeft : 3,
                            icons : {
                                dropdown : "dropdown:multiselect_normal"
                            },
                            skipRightBorder : true,
                            spriteURL : "atskin/sprites/inputEdge.gif"
                        },
                        prefill : {
                            color : "gray"
                        },
                        normalFocused : {
                            sprIdx : 2,
                            icons : {
                                dropdown : "dropdown:multiselect_focused"
                            }
                        },
                        normalError : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        mandatoryFocused : {
                            sprIdx : 3,
                            icons : {
                                dropdown : "dropdown:multiselect_focused"
                            }
                        },
                        mandatoryError : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        readOnly : {
                            color : "#AB9B85",
                            sprIdx : 7
                        },
                        mandatoryErrorFocused : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        normalErrorFocused : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        mandatory : {
                            sprIdx : 1
                        },
                        disabled : {
                            color : "#E6D9C6",
                            sprIdx : 6,
                            label : {
                                color : "#E6D9C6"
                            }
                        }
                    },
                    helpText : {
                        italics : true,
                        color : "gray"
                    },
                    offsetTop : 1,
                    iconsLeft : ""
                }
            },
            Gauge : {
                std : {
                    labelMargins : "3px 0 0 0",
                    sprHeight : 17,
                    spriteUrl : "atskin/sprites/back.gif",
                    border : "1px solid #C2D1F0",
                    labelFontSize : 12,
                    borderPadding : 1
                }
            },
            Splitter : {
                std : {
                    borderColor : "#AB9B85",
                    borderTopWidth : 1,
                    borderBottomWidth : 1,
                    borderLeftWidth : 1,
                    borderRightWidth : 1,
                    proxySpriteURLh : "atskin/sprites/splitter.gif",
                    proxyBackgroundColor : "#BBBBBB",
                    handleBackgroundColor : "#FFFBF1",
                    handleSpriteURLh : "atskin/sprites/splitter.gif",
                    separatorHeight : 6,
                    separatorWidth : 6,
                    handleSpriteURLv : "atskin/sprites/splitter_v.gif",
                    proxySpriteURLv : "atskin/sprites/splitter_v.gif"
                }
            },
            DatePicker : {
                simple : {
                    innerPaddingTop : 1,
                    iconsRight : "dropdown",
                    innerPaddingRight : 0,
                    states : {
                        mandatoryErrorFocused : {
                            icons : {
                                dropdown : "dropdown:datepicker_normal"
                            }
                        },
                        normalErrorFocused : {
                            icons : {
                                dropdown : "dropdown:datepicker_normal"
                            }
                        },
                        normal : {
                            icons : {
                                dropdown : "dropdown:datepicker_normal"
                            }
                        },
                        mandatoryError : {
                            icons : {
                                dropdown : "dropdown:datepicker_normal"
                            }
                        },
                        normalFocused : {
                            icons : {
                                dropdown : "dropdown:datepicker_normal"
                            }
                        },
                        normalError : {
                            icons : {
                                dropdown : "dropdown:datepicker_normal"
                            }
                        }
                    },
                    offsetTop : 1,
                    innerPaddingLeft : 0,
                    innerPaddingBottom : 2,
                    simpleHTML : true,
                    iconsLeft : ""
                },
                std : {
                    iconsRight : "dropdown",
                    frame : {
                        frameType : "FixedHeight"
                    },
                    states : {
                        readOnly : {
                            color : "#AB9B85",
                            sprIdx : 7
                        },
                        mandatoryErrorFocused : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:datepicker_error"
                            }
                        },
                        normalErrorFocused : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:datepicker_error"
                            }
                        },
                        mandatory : {
                            sprIdx : 1
                        },
                        normal : {
                            marginBottom : 2,
                            spriteURLv : "atskin/sprites/inputCentre.gif",
                            sprWidth : 7,
                            sprHeight : 20,
                            color : "#000000",
                            marginTop : 3,
                            sprIdx : 0,
                            spcLeft : 3,
                            icons : {
                                dropdown : "dropdown:datepicker_normal"
                            },
                            spriteURL : "atskin/sprites/inputEdge.gif",
                            skipRightBorder : true
                        },
                        mandatoryFocused : {
                            sprIdx : 3,
                            icons : {
                                dropdown : "dropdown:datepicker_focused"
                            }
                        },
                        prefill : {
                            color : "gray"
                        },
                        mandatoryError : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:datepicker_error"
                            }
                        },
                        normalFocused : {
                            sprIdx : 2,
                            icons : {
                                dropdown : "dropdown:datepicker_focused"
                            }
                        },
                        disabled : {
                            color : "#E6D9C6",
                            sprIdx : 6,
                            label : {
                                color : "#E6D9C6"
                            }
                        },
                        normalError : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:datepicker_error"
                            }
                        }
                    },
                    helpText : {
                        italics : true,
                        color : "gray"
                    },
                    offsetTop : 1,
                    iconsLeft : ""
                }
            },
            RadioButton : {
                simple : {
                    simpleHTML : true
                },
                std : {
                    iconset : "checkBoxes",
                    iconprefix : "rb_",
                    states : {
                        disabledSelected : {
                            color : "#B0B0B0"
                        },
                        normal : {
                            color : "#000000"
                        },
                        focusedSelected : {
                            color : "#000000"
                        },
                        focused : {
                            color : "#000000"
                        },
                        normalSelected : {
                            color : "#000000"
                        },
                        readonlySelected : {
                            color : "#B0B0B0"
                        },
                        readonly : {
                            color : "#B0B0B0"
                        },
                        disabled : {
                            color : "#B0B0B0"
                        }
                    }
                }
            },
            Textarea : {
                std : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        readOnly : {
                            backgroundColor : "#FFFFFF",
                            sprIdx : 2
                        },
                        mandatoryErrorFocused : {
                            backgroundColor : "#FFE6AB",
                            sprIdx : 5
                        },
                        normalErrorFocused : {
                            sprIdx : 6
                        },
                        normal : {
                            spriteURLv : "atskin/sprites/textarea_v.gif",
                            spcTop : 6,
                            sprWidth : 8,
                            sprHeight : 12,
                            backgroundColor : "#FFFFFF",
                            spriteURLh : "atskin/sprites/textarea_h.gif",
                            sprIdx : 0,
                            spcLeft : 4,
                            spriteURL : "atskin/sprites/textarea.gif"
                        },
                        mandatory : {
                            backgroundColor : "#FFE6AB",
                            sprIdx : 3
                        },
                        mandatoryFocused : {
                            backgroundColor : "#FFE6AB",
                            sprIdx : 4
                        },
                        mandatoryError : {
                            backgroundColor : "#FFE6AB",
                            sprIdx : 5
                        },
                        normalFocused : {
                            sprIdx : 1
                        },
                        normalError : {
                            sprIdx : 6
                        },
                        disabled : {
                            color : "#E6D9C6",
                            backgroundColor : "#FFFFFF",
                            sprIdx : 2,
                            label : {
                                color : "#E6D9C6"
                            }
                        }
                    },
                    helpText : {
                        italics : true,
                        color : "gray"
                    }
                }
            },
            TabPanel : {
                std : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        normal : {
                            marginBottom : -6,
                            spcTop : 16,
                            sprWidth : 66,
                            sprHeight : 16,
                            backgroundColor : "#FFFFFF",
                            marginLeft : -25,
                            marginTop : -6,
                            color : "#333333",
                            marginRight : -14,
                            sprIdx : 0,
                            spcLeft : 36
                        }
                    }
                }
            },
            Dialog : {
                std : {
                    titleBarLeft : 0,
                    titleBarTop : 0,
                    closeIcon : "std:close",
                    maximizeIcon : "std:maximize",
                    titleBarHeight : 32,
                    titleColor : "#615E55",
                    divsclass : "dlg",
                    titleBarRight : 10,
                    shadowLeft : 0,
                    shadowTop : 0,
                    shadowRight : 14,
                    shadowBottom : 8
                }
            },
            Calendar : {
                std : {
                    day : {
                        fontWeight : "normal",
                        color : "black",
                        backgroundColor : "transparent",
                        borderColor : "white"
                    },
                    today : {
                        color : "black",
                        backgroundColor : "transparent",
                        borderColor : "black"
                    },
                    selectedDate : {
                        color : "black",
                        backgroundColor : "#FFCC66",
                        borderColor : "black"
                    },
                    mouseOverDate : {
                        color : "black",
                        backgroundColor : "#FFCC66",
                        borderColor : "black"
                    },
                    weekEnd : {
                        color : "black",
                        borderColor : "#F2ECDE",
                        backgroundColor : "#F2ECDE"
                    },
                    unselectableDate : {
                        color : "#AB9B85",
                        backgroundColor : "transparent",
                        borderColor : "white"
                    },
                    previousPageIcon : "std:left_arrow",
                    monthTitleBackgroundColor : "transparent",
                    monthTitleColor : "black",
                    weekDaysLabelBorderColor : "white",
                    weekDaysLabelFontWeight : "bold",
                    dayPadding : "0px",
                    weekDaysLabelBackgroundColor : "white",
                    nextPageIcon : "std:right_arrow",
                    monthTitleBorderColor : "#E6D9C6",
                    monthTitlePaddingBottom : "0px",
                    weekDaysLabelColor : "black",
                    generalBackgroundColor : "white",
                    weekDaysLabelPadding : "0px",
                    divsclass : "list",
                    monthTitlePaddingTop : "0px",
                    defaultTemplate : "aria.widgets.calendar.CalendarTemplate",
                    weekNumberBackgroundColor : "#E7DBC6",
                    weekNumberBorderColor : "#E7DBC6"
                },
                dropdown : {
                    divsclass : "dropdown"
                }
            },
            general : {
                imagesRoot : "aria/css/",
                overlay : {
                    backgroundColor : "#ddd",
                    opacity : 40,
                    border : "1px solid black"
                },
                colors : {
                    disabled : "#AB9B85"
                },
                loadingOverlay : {
                    backgroundColor : "#fff",
                    opacity : 80,
                    spriteURL : "atskin/imgs/loading.gif"
                }
            },
            Select : {
                simple : {
                    simpleHTML : true
                },
                std : {
                    iconsRight : "dropdown",
                    frame : {
                        frameType : "FixedHeight"
                    },
                    states : {
                        readOnly : {
                            color : "#AB9B85",
                            sprIdx : 7
                        },
                        mandatoryErrorFocused : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:selectbox_error"
                            }
                        },
                        normalErrorFocused : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:selectbox_error"
                            }
                        },
                        mandatory : {
                            sprIdx : 1
                        },
                        normal : {
                            marginBottom : 2,
                            spriteURLv : "atskin/sprites/inputCentre.gif",
                            sprWidth : 7,
                            sprHeight : 20,
                            color : "#000000",
                            marginTop : 3,
                            sprIdx : 0,
                            spcLeft : 3,
                            icons : {
                                dropdown : "dropdown:selectbox_normal"
                            },
                            spriteURL : "atskin/sprites/inputEdge.gif",
                            skipRightBorder : true
                        },
                        mandatoryFocused : {
                            sprIdx : 3,
                            icons : {
                                dropdown : "dropdown:selectbox_focused"
                            }
                        },
                        mandatoryError : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:selectbox_error"
                            }
                        },
                        normalFocused : {
                            sprIdx : 2,
                            icons : {
                                dropdown : "dropdown:selectbox_focused"
                            }
                        },
                        disabled : {
                            color : "#E6D9C6",
                            sprIdx : 6,
                            label : {
                                color : "#E6D9C6"
                            }
                        },
                        normalError : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:selectbox_error"
                            }
                        }
                    },
                    offsetTop : 1,
                    iconsLeft : ""
                }
            },
            Button : {
                important : {
                    label : {
                        fontWeight : "bold"
                    }
                },
                simple : {
                    simpleHTML : true
                },
                std : {
                    frame : {
                        frameType : "FixedHeight"
                    },
                    states : {
                        normal : {
                            marginBottom : 5,
                            spriteURLv : "atskin/sprites/buttonCentre_1-4-2.gif",
                            sprHeight : 25,
                            sprWidth : 17,
                            marginTop : 5,
                            color : "#000000",
                            sprIdx : 0,
                            spcLeft : 8,
                            spriteURL : "atskin/sprites/buttonEdges_1-4-2.gif"
                        },
                        disabled : {
                            color : "#B0B0B0",
                            sprIdx : 2
                        },
                        msdown : {
                            marginBottom : 3,
                            marginTop : 7,
                            sprIdx : 1
                        },
                        normalFocused : {
                            sprIdx : 3
                        },
                        msoverFocused : {
                            sprIdx : 3
                        }
                    }
                }
            },
            Link : {
                std : {
                    states : {
                        normal : {
                            color : "#6365FF"
                        },
                        hover : {
                            color : "#6365FF"
                        },
                        focus : {
                            color : "#6365FF"
                        }
                    },
                    disabledColor : "#E6D9C6"
                }
            },
            SelectBox : {
                simple : {
                    innerPaddingTop : 1,
                    iconsRight : "dropdown",
                    innerPaddingRight : 0,
                    states : {
                        readOnly : {
                            color : "#AB9B85"
                        },
                        mandatoryErrorFocused : {
                            icons : {
                                dropdown : "dropdown:selectbox_normal"
                            }
                        },
                        normalErrorFocused : {
                            icons : {
                                dropdown : "dropdown:selectbox_normal"
                            }
                        },
                        normal : {
                            color : "#000000",
                            icons : {
                                dropdown : "dropdown:selectbox_normal"
                            }
                        },
                        mandatoryError : {
                            icons : {
                                dropdown : "dropdown:selectbox_normal"
                            }
                        },
                        normalFocused : {
                            icons : {
                                dropdown : "dropdown:selectbox_normal"
                            }
                        },
                        disabled : {
                            color : "#E6D9C6",
                            label : {
                                color : "#E6D9C6"
                            }
                        },
                        normalError : {
                            icons : {
                                dropdown : "dropdown:selectbox_normal"
                            }
                        }
                    },
                    helpText : {
                        italics : true,
                        color : "gray"
                    },
                    offsetTop : 1,
                    innerPaddingLeft : 0,
                    innerPaddingBottom : 2,
                    simpleHTML : true,
                    iconsLeft : ""
                },
                std : {
                    iconsRight : "dropdown",
                    frame : {
                        frameType : "FixedHeight"
                    },
                    states : {
                        readOnly : {
                            color : "#AB9B85",
                            sprIdx : 7
                        },
                        mandatoryErrorFocused : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:selectbox_error"
                            }
                        },
                        normalErrorFocused : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:selectbox_error"
                            }
                        },
                        mandatory : {
                            sprIdx : 1
                        },
                        normal : {
                            marginBottom : 2,
                            spriteURLv : "atskin/sprites/inputCentre.gif",
                            sprWidth : 7,
                            sprHeight : 20,
                            color : "#000000",
                            marginTop : 3,
                            sprIdx : 0,
                            spcLeft : 3,
                            icons : {
                                dropdown : "dropdown:selectbox_normal"
                            },
                            spriteURL : "atskin/sprites/inputEdge.gif",
                            skipRightBorder : true
                        },
                        mandatoryFocused : {
                            sprIdx : 3,
                            icons : {
                                dropdown : "dropdown:selectbox_focused"
                            }
                        },
                        prefill : {
                            color : "gray"
                        },
                        mandatoryError : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:selectbox_error"
                            }
                        },
                        normalFocused : {
                            sprIdx : 2,
                            icons : {
                                dropdown : "dropdown:selectbox_focused"
                            }
                        },
                        disabled : {
                            color : "#E6D9C6",
                            sprIdx : 6,
                            label : {
                                color : "#E6D9C6"
                            }
                        },
                        normalError : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:selectbox_error"
                            }
                        }
                    },
                    helpText : {
                        italics : true,
                        color : "gray"
                    },
                    offsetTop : 1,
                    iconsLeft : ""
                }
            },
            TextInput : {
                simpleIcon : {
                    states : {
                        normal : {
                            icons : {
                                dropdownIsActive : false,
                                dropdown : "std:confirm"
                            }
                        },
                        normalError : {
                            icons : {
                                dropdownIsActive : false,
                                dropdown : "std:error"
                            }
                        }
                    },
                    iconsLeft : "dropdown",
                    simpleHTML : true
                },
                important : {
                    label : {
                        fontWeight : "bold"
                    }
                },
                simple : {
                    simpleHTML : true
                },
                std : {
                    innerPaddingTop : 0,
                    innerPaddingRight : 0,
                    frame : {
                        frameType : "FixedHeight"
                    },
                    states : {
                        readOnly : {
                            color : "#AB9B85",
                            sprIdx : 7
                        },
                        normalErrorFocused : {
                            sprIdx : 4
                        },
                        mandatoryErrorFocused : {
                            sprIdx : 5
                        },
                        mandatory : {
                            sprIdx : 1
                        },
                        normal : {
                            marginBottom : 2,
                            spriteURLv : "atskin/sprites/inputCentre.gif",
                            sprHeight : 20,
                            sprWidth : 7,
                            marginTop : 3,
                            color : "#000000",
                            sprIdx : 0,
                            spcLeft : 3,
                            spriteURL : "atskin/sprites/inputEdge.gif"
                        },
                        mandatoryFocused : {
                            sprIdx : 3
                        },
                        prefill : {
                            color : "gray"
                        },
                        mandatoryError : {
                            sprIdx : 5
                        },
                        normalFocused : {
                            sprIdx : 2
                        },
                        disabled : {
                            color : "#E6D9C6",
                            sprIdx : 6,
                            label : {
                                color : "#E6D9C6"
                            }
                        },
                        normalError : {
                            sprIdx : 4
                        }
                    },
                    helpText : {
                        italics : true,
                        color : "gray"
                    },
                    innerPaddingLeft : 2,
                    innerPaddingBottom : 0
                }
            },
            CheckBox : {
                simple : {
                    simpleHTML : true
                },
                std : {
                    iconset : "checkBoxes",
                    iconprefix : "cb_",
                    states : {
                        disabledSelected : {
                            color : "#B0B0B0"
                        },
                        normal : {
                            color : "#000000"
                        },
                        focusedSelected : {
                            color : "#000000"
                        },
                        focused : {
                            color : "#000000"
                        },
                        normalSelected : {
                            color : "#000000"
                        },
                        readonlySelected : {
                            color : "#B0B0B0"
                        },
                        readonly : {
                            color : "#B0B0B0"
                        },
                        disabled : {
                            color : "#B0B0B0"
                        }
                    }
                }
            },
            Tab : {
                demoMainTabs : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        selectedFocused : {
                            marginBottom : 0,
                            spcTop : 14,
                            sprHeight : 24,
                            backgroundColor : "#FFFFFF",
                            color : "#4776A7",
                            sprIdx : 0
                        },
                        selected : {
                            marginBottom : 0,
                            spcTop : 14,
                            sprHeight : 24,
                            color : "#4776A7",
                            backgroundColor : "#FFFFFF",
                            sprIdx : 0
                        },
                        normal : {
                            marginLeft : 0,
                            marginTop : 0,
                            backgroundColor : "#4776A7",
                            spriteURLh : "atskin/sprites/tabs_h.png",
                            marginRight : 0,
                            sprIdx : 1,
                            spcLeft : 22,
                            sprSpacing : 2,
                            marginBottom : 0,
                            spriteURLv : "atskin/sprites/tabs_v.png",
                            spcTop : 17,
                            sprWidth : 44,
                            sprHeight : 24,
                            color : "#fff",
                            spriteURL : "atskin/sprites/tabs.png"
                        },
                        msoverFocused : {
                            spcTop : 17,
                            sprHeight : 24,
                            backgroundColor : "#2f6093",
                            marginTop : 0,
                            color : "#fff",
                            sprIdx : 2,
                            sprSpacing : 2
                        },
                        msover : {
                            spcTop : 17,
                            sprHeight : 24,
                            backgroundColor : "#2f6093",
                            color : "#fff",
                            marginTop : 0,
                            sprIdx : 2,
                            sprSpacing : 2
                        },
                        disabled : {
                            spriteURLv : "atskin/sprites/tabs_v.png",
                            sprHeight : 40,
                            color : "#4776A7",
                            marginTop : 0,
                            backgroundColor : "#444444",
                            spriteURLh : "atskin/sprites/tabs_h.png",
                            sprIdx : 3,
                            sprSpacing : 2,
                            spriteURL : "atskin/sprites/tabs.png"
                        }
                    }
                },
                std : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        selectedFocused : {
                            spcTop : 14,
                            backgroundColor : "#FFFFFF",
                            color : "#4776A7",
                            sprIdx : 0
                        },
                        selected : {
                            spcTop : 14,
                            color : "#4776A7",
                            backgroundColor : "#FFFFFF",
                            sprIdx : 0
                        },
                        normal : {
                            marginLeft : 0,
                            backgroundColor : "#4c7bac",
                            marginTop : 0,
                            spriteURLh : "atskin/sprites/tabs_h.png",
                            marginRight : 0,
                            sprIdx : 1,
                            spcLeft : 22,
                            sprSpacing : 2,
                            marginBottom : 0,
                            spriteURLv : "atskin/sprites/tabs_v.png",
                            spcTop : 17,
                            sprHeight : 24,
                            sprWidth : 44,
                            color : "#fff",
                            spriteURL : "atskin/sprites/tabs.png"
                        },
                        msoverFocused : {
                            sprHeight : 24,
                            backgroundColor : "#2f6093",
                            marginTop : 0,
                            color : "#fff",
                            sprIdx : 2,
                            sprSpacing : 2
                        },
                        msover : {
                            sprHeight : 24,
                            color : "#fff",
                            backgroundColor : "#2f6093",
                            marginTop : 0,
                            sprIdx : 2,
                            sprSpacing : 2
                        },
                        disabled : {
                            marginBottom : 0,
                            spcTop : 17,
                            sprWidth : 44,
                            sprHeight : 24,
                            color : "#C2C3C6",
                            marginTop : 0,
                            marginLeft : 0,
                            backgroundColor : "#4c7bac",
                            marginRight : 0,
                            sprIdx : 1,
                            spcLeft : 22,
                            sprSpacing : 2
                        }
                    }
                }
            },
            List : {
                std : {
                    mouseOverBackgroundColor : "#fc6",
                    selectedItemColor : "#000",
                    selectedItemBackgroundColor : "#fc6",
                    divsclass : "list",
                    mouseOverColor : "#000"
                },
                dropdown : {
                    highlightMouseOver : false,
                    divsclass : "dropdown"
                }
            },
            Icon : {
                autoCompleteAirTrain : {
                    content : {
                        airport : 1,
                        sub : 7,
                        multiple_train : 5,
                        star : 0,
                        train : 4,
                        multiple_airport : 2,
                        city : 6,
                        train_airport : 3
                    },
                    spriteSpacing : 2,
                    direction : "x",
                    iconWidth : 16,
                    spriteURL : "atskin/sprites/airtrainicons_16x16.gif",
                    iconHeight : 16,
                    biDimensional : false
                },
                checkBoxes : {
                    content : {
                        cb_disabled : 4,
                        rb_disabled : 12,
                        cb_focusedSelected : 3,
                        cb_focused : 2,
                        cb_disabledSelected : 5,
                        rb_readonlySelected : 15,
                        rb_normalSelected : 9,
                        cb_readonly : 6,
                        cb_normalSelected : 1,
                        rb_focusedSelected : 11,
                        rb_readonly : 14,
                        cb_readonlySelected : 7,
                        rb_disabledSelected : 13,
                        rb_focused : 10,
                        cb_normal : 0,
                        rb_normal : 8
                    },
                    spriteSpacing : 3,
                    direction : "x",
                    iconWidth : 19,
                    spriteURL : "atskin/sprites/checkbox.png",
                    iconHeight : 18,
                    biDimensional : false
                },
                std : {
                    content : {
                        hand_bag : 29,
                        amn_pch : 8,
                        save : 23,
                        undo : 25,
                        amn_saf : 12,
                        zoom_in : 21,
                        amn_swi : 15,
                        validated : 36,
                        amn_bus : 2,
                        info : 17,
                        amn_res : 10,
                        close : 24,
                        maximize : 42,
                        amn_lau : 5,
                        rm_line : 20,
                        missing : 38,
                        amn_spa : 14,
                        help : 41,
                        up_arrow : 35,
                        left_arrow : 32,
                        down_arrow : 33,
                        amn_chi : 3,
                        expand : 30,
                        baby : 27,
                        collapse : 31,
                        error : 39,
                        amn_pet : 9,
                        zoom_out : 22,
                        amn_hea : 4,
                        add_line : 19,
                        amn_roo : 11,
                        amn_wif : 16,
                        fire : 18,
                        amn_air : 0,
                        amn_gym : 4,
                        amn_mee : 6,
                        amn_bar : 1,
                        extended_seat : 28,
                        right_arrow : 34,
                        redo : 26,
                        amn_sea : 13,
                        amn_par : 7,
                        confirm : 40,
                        warning : 37
                    },
                    spriteSpacing : 2,
                    direction : "x",
                    iconWidth : 16,
                    spriteURL : "atskin/sprites/icons_16x16.gif",
                    iconHeight : 16,
                    biDimensional : false
                },
                dropdown : {
                    content : {
                        multiselect_error : 8,
                        datepicker_focused : 4,
                        selectbox_focused : 1,
                        multiselect_focused : 7,
                        datepicker_error : 5,
                        datepicker_normal : 3,
                        multiselect_normal : 6,
                        selectbox_error : 2,
                        selectbox_normal : 0
                    },
                    spriteSpacing : 2,
                    direction : "x",
                    iconWidth : 14,
                    spriteURL : "atskin/imgs/dropdownbtns.gif",
                    iconHeight : 20,
                    biDimensional : false
                },
                sortIndicator : {
                    content : {
                        si_normal : 0,
                        si_ascending : 2,
                        si_descending : 1
                    },
                    spriteSpacing : 0,
                    direction : "x",
                    iconWidth : 15,
                    spriteURL : "atskin/sprites/sortlist.gif",
                    iconHeight : 11,
                    biDimensional : false
                }
            },
            AutoComplete : {
                simple : {
                    simpleHTML : true
                },
                important : {
                    label : {
                        fontWeight : "bold"
                    }
                },
                underlineError : {
                    frame : {
                        frameType : "FixedHeight"
                    },
                    states : {
                        readOnly : {
                            color : "#AB9B85",
                            sprIdx : 7
                        },
                        normalErrorFocused : {
                            sprIdx : 4
                        },
                        mandatoryErrorFocused : {
                            sprIdx : 5
                        },
                        mandatory : {
                            sprIdx : 1
                        },
                        normal : {
                            marginBottom : 2,
                            spriteURLv : "atskin/sprites/inputCentreUnderlineError.gif",
                            sprHeight : 20,
                            sprWidth : 7,
                            marginTop : 3,
                            color : "#000000",
                            sprIdx : 0,
                            spcLeft : 3,
                            spriteURL : "atskin/sprites/inputEdgeUnderlineError.gif"
                        },
                        mandatoryFocused : {
                            sprIdx : 3
                        },
                        mandatoryError : {
                            sprIdx : 9
                        },
                        normalFocused : {
                            sprIdx : 2
                        },
                        disabled : {
                            color : "#E6D9C6",
                            sprIdx : 6,
                            label : {
                                color : "#E6D9C6"
                            }
                        },
                        normalError : {
                            sprIdx : 8
                        }
                    }
                },
                std : {
                    iconsRight : "dropdown",
                    frame : {
                        frameType : "FixedHeight"
                    },
                    states : {
                        readOnly : {
                            color : "#AB9B85",
                            sprIdx : 7
                        },
                        mandatoryErrorFocused : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        normalErrorFocused : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        mandatory : {
                            sprIdx : 1
                        },
                        normal : {
                            marginBottom : 2,
                            spriteURLv : "atskin/sprites/inputCentre.gif",
                            skipLeftBorder : false,
                            sprWidth : 7,
                            sprHeight : 20,
                            color : "#000000",
                            marginTop : 3,
                            sprIdx : 0,
                            spcLeft : 3,
                            icons : {
                                dropdown : "dropdown:multiselect_normal"
                            },
                            spriteURL : "atskin/sprites/inputEdge.gif",
                            skipRightBorder : "dependsOnIcon"
                        },
                        mandatoryFocused : {
                            sprIdx : 3
                        },
                        prefill : {
                            color : "gray"
                        },
                        mandatoryError : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        normalFocused : {
                            sprIdx : 2,
                            icons : {
                                dropdown : "dropdown:multiselect_focused"
                            }
                        },
                        disabled : {
                            color : "#E6D9C6",
                            sprIdx : 6,
                            label : {
                                color : "#E6D9C6"
                            }
                        },
                        normalError : {
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        }
                    },
                    helpText : {
                        italics : true,
                        color : "gray"
                    },
                    offsetTop : 1
                }
            },

            MultiAutoComplete : {
                std : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        readOnly : {
                            backgroundColor : "#FFFFFF",
                            sprIdx : 2
                        },
                        mandatoryErrorFocused : {
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        normalErrorFocused : {
                            sprIdx : 6,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        normal : {
                            spriteURLv : "atskin/sprites/textarea_v.gif",
                            spcTop : 6,
                            sprWidth : 8,
                            sprHeight : 12,
                            backgroundColor : "#FFFFFF",
                            spriteURLh : "atskin/sprites/textarea_h.gif",
                            sprIdx : 0,
                            spcLeft : 4,
                            spriteURL : "atskin/sprites/textarea.gif",
                            icons : {
                                dropdown : "dropdown:multiselect_normal"
                            }
                        },
                        mandatory : {
                            backgroundColor : "#FFE6AB",
                            sprIdx : 3
                        },
                        mandatoryFocused : {
                            backgroundColor : "#FFE6AB",
                            sprIdx : 4,
                            icons : {
                                dropdown : "dropdown:multiselect_focused"
                            }
                        },
                        mandatoryError : {
                            backgroundColor : "#FFE6AB",
                            sprIdx : 5,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        normalFocused : {
                            sprIdx : 1,
                            icons : {
                                dropdown : "dropdown:multiselect_focused"
                            }
                        },
                        normalError : {
                            sprIdx : 6,
                            icons : {
                                dropdown : "dropdown:multiselect_error"
                            }
                        },
                        disabled : {
                            color : "#E6D9C6",
                            backgroundColor : "#FFFFFF",
                            sprIdx : 2,
                            label : {
                                color : "#E6D9C6"
                            }
                        }
                    },
                    helpText : {
                        italics : true,
                        color : "gray"
                    },
                    offsetTop : 1,
                    optionsBackgroundColor : "#E4E4E4",
                    optionsColor : "#333",
                    optionsBorderWidth : 1,
                    optionsBorderColor : "#AAAAAA",
                    closeSpriteURL : "atskin/sprites/closemark.gif",
                    closeSpriteHeight : 10,
                    closeSpriteWidth : 9,
                    optionsHighlightBackgroundColor : "#FFCC66",
                    optionsHighlightColor : "#333",
                    optionsHighlightBorderWidth : 1,
                    optionsHighlightBorderColor : "#AAAAAA",
                    closeHighlightSpriteURL : "atskin/sprites/closemark_highlight.gif",
                    iconsRight : "dropdown"

                }
            },
            ErrorList : {
                std : {
                    divsclass : "errorlist"
                }
            },
            Div : {
                dlg : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        normal : {
                            marginBottom : -5,
                            spriteURLv : "atskin/sprites/dialog_v.png",
                            spcTop : 31,
                            sprWidth : 36,
                            sprHeight : 53,
                            marginLeft : 0,
                            marginTop : -4,
                            spriteURLh : "atskin/sprites/dialog_h.png",
                            marginRight : -4,
                            spcLeft : 11,
                            spriteURL : "atskin/sprites/dialog.png"
                        }
                    }
                },
                errorlist : {
                    frame : {
                        frameType : "Simple"
                    },
                    states : {
                        normal : {
                            borderSize : 0,
                            paddingTop : 10,
                            backgroundColor : "#F2ECDE",
                            border : "solid",
                            paddingLeft : 15,
                            paddingBottom : 10,
                            paddingRight : 15
                        }
                    }
                },
                basic : {
                    frame : {
                        frameType : "Simple"
                    },
                    states : {
                        normal : {
                            borderSize : 1,
                            borderColor : "#000",
                            paddingTop : 10,
                            backgroundColor : "#EBE1CF",
                            border : "solid",
                            paddingLeft : 10,
                            paddingBottom : 10,
                            paddingRight : 10
                        }
                    }
                },
                std : {
                    frame : {
                        frameType : "Simple"
                    },
                    states : {
                        normal : {
                            color : "#000000"
                        }
                    }
                },
                errortip : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        bottomLeft : {
                            frameIcon : "atskin/sprites/frameIconErrortipTopRight.png",
                            frameIconVPos : "top",
                            frameIconHPos : "right"
                        },
                        topLeft : {
                            frameIcon : "atskin/sprites/frameIconErrortipBottomRight.png",
                            frameIconHPos : "right"
                        },
                        bottomRight : {
                            frameIconVPos : "top",
                            frameIcon : "atskin/sprites/frameIconErrortipTopLeft.png",
                            frameIconHPos : "left"
                        },
                        normal : {
                            frameIconVPos : "bottom",
                            marginLeft : 0,
                            backgroundColor : "#FFC759",
                            spriteURLh : "atskin/sprites/errtip_h2.png",
                            marginRight : 6,
                            sprIdx : 0,
                            spcLeft : 16,
                            frameIconHPos : "left",
                            frameIcon : "atskin/sprites/frameIconErrortip2.png",
                            spcTop : 30,
                            spriteURLv : "atskin/sprites/errtip_v2.png",
                            sprHeight : 60,
                            sprWidth : 32,
                            spriteURL : "atskin/sprites/errtip2.png",
                            frameHeight : 30
                        }
                    }
                },
                list : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        normal : {
                            spriteURLv : "atskin/sprites/list_v.png",
                            spcTop : 6,
                            sprWidth : 8,
                            sprHeight : 12,
                            spriteURLh : "atskin/sprites/list_h.png",
                            spcLeft : 4,
                            spriteURL : "atskin/sprites/list.png"
                        }
                    }
                },
                dropdown : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        normal : {
                            spriteURLv : "atskin/sprites/dropdown_v.png",
                            spcTop : 7,
                            sprWidth : 20,
                            sprHeight : 20,
                            marginLeft : -3,
                            marginTop : -3,
                            spriteURLh : "atskin/sprites/dropdown_h.png",
                            spcLeft : 7,
                            spriteURL : "atskin/sprites/dropdown.png"
                        }
                    }
                },
                tooltip : {
                    frame : {
                        frameType : "Table"
                    },
                    states : {
                        normal : {
                            spriteURLv : "atskin/sprites/tooltip_v.png",
                            spcTop : 8,
                            sprWidth : 20,
                            sprHeight : 18,
                            backgroundColor : "#F2ECE1",
                            spriteURLh : "atskin/sprites/tooltip_h.png",
                            spcLeft : 9,
                            spriteURL : "atskin/sprites/tooltip.png"
                        }
                    }
                }
            }
        }
    }
});
