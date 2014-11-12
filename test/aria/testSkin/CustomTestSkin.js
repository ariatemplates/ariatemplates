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
                "imagesRoot" : "aria/css/",
                "font" : {
                    "family" : "Arial,Tahoma, sans-serif",
                    "size" : 14
                },
                "externalCSS" : ["../../test/aria/widgets/skin/ExternalStyle.css"]
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
                },
                "checkBoxes" : {
                    "content" : {
                        "cb_disabled" : 4,
                        "rb_disabled" : 12,
                        "cb_focusedSelected" : 3,
                        "cb_focused" : 2,
                        "cb_disabledSelected" : 5,
                        "rb_readonlySelected" : 15,
                        "rb_normalSelected" : 9,
                        "cb_readonly" : 6,
                        "cb_normalSelected" : 1,
                        "rb_focusedSelected" : 11,
                        "rb_readonly" : 14,
                        "cb_readonlySelected" : 7,
                        "rb_disabledSelected" : 13,
                        "rb_focused" : 10,
                        "cb_normal" : 0,
                        "rb_normal" : 8
                    },
                    "spriteSpacing" : 3,
                    "direction" : "x",
                    "iconWidth" : 19,
                    "spriteURL" : "atskin/sprites/checkbox.png",
                    "iconHeight" : 18,
                    "biDimensional" : false
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
                }
            },
            "MultiSelect" : {
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "FixedHeight"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : 2,
                            "spriteURLv" : "atskin/sprites/inputCentre.gif",
                            "sprHeight" : 20,
                            "sprWidth" : 7,
                            "marginTop" : 3,
                            "color" : "#000000",
                            "sprIdx" : 0,
                            "spcLeft" : 3,
                            "icons" : {
                                "dropdown" : "dropdown:multiselect_normal"
                            },
                            "skipRightBorder" : true,
                            "spriteURL" : "atskin/sprites/inputEdge.gif",
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontFamily" : "Tahoma",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontFamily" : "Arial",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        }

                    }

                }
            },
            "TextInput" : {
                "std" : {
                    "frame" : {
                        "frameType" : "FixedHeight"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : 2,
                            "spriteURLv" : "atskin/sprites/inputCentre.gif",
                            "sprHeight" : 20,
                            "sprWidth" : 7,
                            "marginTop" : 3,
                            "color" : "#000000",
                            "sprIdx" : 0,
                            "spcLeft" : 3,
                            "spriteURL" : "atskin/sprites/inputEdge.gif",
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontFamily" : "Tahoma",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontFamily" : "Arial",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        }
                    }
                },
                "simpleFrame" : {
                    "frame": {
                        "frameType": "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : 2,
                            "spriteURLv" : "atskin/sprites/inputCentre.gif",
                            "sprHeight" : 20,
                            "sprWidth" : 7,
                            "marginTop" : 3,
                            "color" : "#000000",
                            "sprIdx" : 0,
                            "spcLeft" : 3,
                            "spriteURL" : "atskin/sprites/inputEdge.gif",
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontFamily" : "Tahoma",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontFamily" : "Arial",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "gray"
                    }
                },
                "table": {
                    "frame": {
                        "frameType": "Table"
                    },
                    "states": {
                        "normal": {
                            "label": {
                                "font": {}
                            },
                            "frame": {
                                "sprWidth": 8,
                                "sprHeight": 12,
                                "sprIdx": 0,
                                "sprSpacing": 2,
                                "spcLeft": 4,
                                "spcTop": 6,
                                "spriteURL": "atskin/sprites/textarea.gif",
                                "spriteURLv": "atskin/sprites/textarea_v.gif",
                                "spriteURLh": "atskin/sprites/textarea_h.gif",
                                "marginTop": 0,
                                "marginLeft": 0,
                                "marginRight": 0,
                                "marginBottom": 0,
                                "color": "#000",
                                "backgroundColor": "#FFFFFF",
                                "frameIcon": "",
                                "frameIconHPos": "left",
                                "frameIconVPos": "bottom",
                                "font": {}
                            }
                        },
                        "disabled": {
                            "label": {
                                "color": "#E6D9C6",
                                "font": {}
                            },
                            "frame": {
                                "sprWidth": 8,
                                "sprHeight": 12,
                                "sprIdx": 2,
                                "sprSpacing": 2,
                                "spcLeft": 4,
                                "spcTop": 6,
                                "spriteURL": "atskin/sprites/textarea.gif",
                                "spriteURLv": "atskin/sprites/textarea_v.gif",
                                "spriteURLh": "atskin/sprites/textarea_h.gif",
                                "marginTop": 0,
                                "marginLeft": 0,
                                "marginRight": 0,
                                "marginBottom": 0,
                                "color": "#E6D9C6",
                                "backgroundColor": "#FFFFFF",
                                "frameIcon": "",
                                "frameIconHPos": "left",
                                "frameIconVPos": "bottom",
                                "font": {}
                            }
                        }
                    }
                },
                "simple": {
                    "simpleHTML": true,
                    "label": {
                        "fontWeight": "normal"
                    },
                    "helpText": {
                        "color": "gray",
                        "italics": true
                    },
                    "innerPaddingTop": 0,
                    "innerPaddingRight": 0,
                    "innerPaddingBottom": 0,
                    "innerPaddingLeft": 2,
                    "frame": {
                        "frameType": "SimpleHTML"
                    },
                    "states": {
                        "disabled": {
                            "color": "#E6D9C6",
                            "label": {
                                "color": "#E6D9C6",
                                "font": {}
                            },
                            "frame": {}
                        },
                        "normal": {
                            "color": "#000000",
                            "label": {
                                "font": {}
                            },
                            "frame": {}
                        }
                    }
                }
            },
            "SelectBox" : {
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "FixedHeight"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : 2,
                            "spriteURLv" : "atskin/sprites/inputCentre.gif",
                            "sprWidth" : 7,
                            "sprHeight" : 20,
                            "color" : "#000000",
                            "marginTop" : 3,
                            "sprIdx" : 0,
                            "spcLeft" : 3,
                            "icons" : {
                                "dropdown" : "dropdown:selectbox_normal"
                            },
                            "spriteURL" : "atskin/sprites/inputEdge.gif",
                            "skipRightBorder" : true,
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontFamily" : "Tahoma",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontFamily" : "Arial",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        }

                    }

                }
            },
            "AutoComplete" : {
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "FixedHeight"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : 2,
                            "spriteURLv" : "atskin/sprites/inputCentre.gif",
                            "skipLeftBorder" : false,
                            "sprWidth" : 7,
                            "sprHeight" : 20,
                            "color" : "#000000",
                            "marginTop" : 3,
                            "sprIdx" : 0,
                            "spcLeft" : 3,
                            "icons" : {
                                "dropdown" : "dropdown:multiselect_normal"
                            },
                            "spriteURL" : "atskin/sprites/inputEdge.gif",
                            "skipRightBorder" : "dependsOnIcon",
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontFamily" : "Tahoma",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontFamily" : "Arial",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        }
                    }
                },
                "simpleFrame" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : 2,
                            "spriteURLv" : "atskin/sprites/inputCentre.gif",
                            "skipLeftBorder" : false,
                            "sprWidth" : 7,
                            "sprHeight" : 20,
                            "color" : "#000000",
                            "marginTop" : 3,
                            "sprIdx" : 0,
                            "spcLeft" : 3,
                            "icons" : {
                                "dropdown" : "dropdown:multiselect_normal"
                            },
                            "spriteURL" : "atskin/sprites/inputEdge.gif",
                            "skipRightBorder" : "dependsOnIcon",
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontFamily" : "Tahoma",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontFamily" : "Arial",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        }
                    }
                }
            },
            "Textarea" : {

                "std" : {
                    "frame" : {
                        "frameType" : "Table"
                    },
                    "states" : {
                        "normal" : {
                            "spriteURLv" : "atskin/sprites/textarea_v.gif",
                            "spcTop" : 6,
                            "sprWidth" : 8,
                            "sprHeight" : 12,
                            "backgroundColor" : "#FFFFFF",
                            "spriteURLh" : "atskin/sprites/textarea_h.gif",
                            "sprIdx" : 0,
                            "spcLeft" : 4,
                            "spriteURL" : "atskin/sprites/textarea.gif",
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontFamily" : "Tahoma",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontFamily" : "Arial",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        }

                    }

                }
            },
            "RadioButton" : {
                "std" : {
                    "iconset" : "checkBoxes",
                    "iconprefix" : "rb_",
                    "states" : {
                        "normal" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            }
                        },
                        "disabledSelected" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            }
                        }

                    }

                }
            },
            "CheckBox" : {
                "std" : {
                    "iconset" : "checkBoxes",
                    "iconprefix" : "cb_",
                    "states" : {
                        "normal" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            }
                        }

                    }
                }
            },
            "Select" : {
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "FixedHeight"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : 2,
                            "spriteURLv" : "atskin/sprites/inputCentre.gif",
                            "sprWidth" : 7,
                            "sprHeight" : 20,
                            "color" : "#000000",
                            "marginTop" : 3,
                            "sprIdx" : 0,
                            "spcLeft" : 3,
                            "icons" : {
                                "dropdown" : "dropdown:selectbox_normal"
                            },
                            "spriteURL" : "atskin/sprites/inputEdge.gif",
                            "skipRightBorder" : true,
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontFamily" : "Tahoma",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontFamily" : "Arial",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        }

                    }

                }
            },
            "DatePicker" : {
                "std" : {
                    "iconsRight" : "dropdown",
                    "frame" : {
                        "frameType" : "FixedHeight"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : 2,
                            "spriteURLv" : "atskin/sprites/inputCentre.gif",
                            "sprWidth" : 7,
                            "sprHeight" : 20,
                            "color" : "#000000",
                            "marginTop" : 3,
                            "sprIdx" : 0,
                            "spcLeft" : 3,
                            "icons" : {
                                "dropdown" : "dropdown:datepicker_normal"
                            },
                            "spriteURL" : "atskin/sprites/inputEdge.gif",
                            "skipRightBorder" : true,
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontFamily" : "Tahoma",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontFamily" : "Arial",
                                    "fontVariant" : "small-caps",
                                    "fontWeight" : "bold"
                                }
                            }
                        }
                    },
                    "helpText" : {
                        "italics" : true,
                        "color" : "gray"
                    },
                    "offsetTop" : 1,
                    "iconsLeft" : ""
                }
            },
            "Button" : {
                "std" : {
                    "frame" : {
                        "frameType" : "FixedHeight"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : 5,
                            "spriteURLv" : "atskin/sprites/buttonCentre_1-4-2.gif",
                            "sprHeight" : 25,
                            "sprWidth" : 17,
                            "marginTop" : 5,
                            "color" : "#000000",
                            "sprIdx" : 0,
                            "spcLeft" : 8,
                            "spriteURL" : "atskin/sprites/buttonEdges_1-4-2.gif",
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontFamily" : "Tahoma",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontFamily" : "Arial",
                                "fontVariant" : "small-caps",
                                "fontWeight" : "bold"
                            }
                        }
                    }
                }

            },
            "Calendar" : {
                "std" : {
                    "previousPageIcon" : "std:home",
                    "nextPageIcon" : "std:home",
                    "defaultTemplate" : "aria.widgets.calendar.CalendarTemplate",
                    "fontFamily" : "Tahoma",
                    "fontVariant" : "small-caps"
                }
            },
            "TabPanel" : {
                "std" : {
                    "frame" : {
                        "frameType" : "Table"
                    },
                    "states" : {
                        "normal" : {
                            "marginBottom" : -6,
                            "spcTop" : 16,
                            "sprWidth" : 66,
                            "sprHeight" : 16,
                            "backgroundColor" : "#FFFFFF",
                            "marginLeft" : -25,
                            "marginTop" : -6,
                            "color" : "#333333",
                            "marginRight" : -14,
                            "sprIdx" : 0,
                            "spcLeft" : 36
                        }
                    }
                }
            },
            "Tab" : {
                "std" : {
                    "frame" : {
                        "frameType" : "Table"
                    },
                    "states" : {
                        "normal" : {
                            "spriteURLh" : "atskin/sprites/tabs_h.png",
                            "spriteURLv" : "atskin/sprites/tabs_v.png",
                            "spriteURL" : "atskin/sprites/tabs.png",
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontVariant" : "small-caps",
                                "fontFamily" : "Tahoma",
                                "fontWeight" : "bold"
                            }
                        },
                        "disabled" : {
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 19,
                                "fontVariant" : "small-caps",
                                "fontFamily" : "Arial",
                                "fontWeight" : "bold"
                            }
                        }
                    }
                }
            },
            "Div" : {
                "std" : {
                    "frame" : {
                        "frameType" : "Simple"
                    },
                    "states" : {
                        "normal" : {
                            "color" : "#000000",
                            "font" : {
                                "fontStyle" : "italic",
                                "fontSize" : 17,
                                "fontVariant" : "small-caps",
                                "fontFamily" : "Tahoma",
                                "fontWeight" : "bold"
                            }
                        }
                    }
                }
            },
            "MultiAutoComplete" : {
                "std" : {
                    "frame" : {
                        "frameType" : "Table"
                    },
                    "states" : {
                        "normal" : {
                            "spriteURLv" : "atskin/sprites/textarea_v.gif",
                            "spriteURLh" : "atskin/sprites/textarea_h.gif",
                            "spriteURL" : "atskin/sprites/textarea.gif",
                            "icons" : {
                                "dropdown" : "dropdown:multiselect_normal"
                            },
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 17,
                                    "fontVariant" : "small-caps",
                                    "fontFamily" : "Tahoma",
                                    "fontWeight" : "bold"
                                }
                            }
                        },
                        "disabled" : {
                            "label" : {
                                "font" : {
                                    "fontStyle" : "italic",
                                    "fontSize" : 19,
                                    "fontVariant" : "small-caps",
                                    "fontFamily" : "Arial",
                                    "fontWeight" : "bold"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});
