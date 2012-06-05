/**
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
 * The beans contained in this file describe the structure of a skin configuration and the aria.widgets.AriaSkin class.
 * @class aria.widgets.AriaSkinBeans
 */
Aria.beanDefinitions({
	$package : "aria.widgets.AriaSkinBeans",
	$description : "Structure of a skin.",
	$namespaces : {
		"json" : "aria.core.JsonTypes"
	},
	$beans : {
		"SkinCfg" : {
			$type : "json:Object",
			$description : "Whole configuration of a skin (both CSS and JS part), as an application developper can describe it.",
			$properties : {
				"name" : {
					$type : "json:String",
					$description : ""
				},
				"palette" : {
					$type : "json:Object",
					$description : "",
					$properties : {
						"background" : {
							$type : "json:Object",
							$description : ""
						},
						"border" : {
							$type : "json:Object",
							$description : ""
						},
						"text" : {
							$type : "json:Object",
							$description : ""
						}
					}
				},
				"parent" : {
					$type : "json:Object",
					$description : "",
					$properties : {
						"name" : {
							$type : "json:String",
							$description : ""
						},
						"version" : {
							$type : "json:String",
							$description : ""
						}
					}
				},
				/*
				 * The following three items (general, icons, widgets) are of type ObjectRef temporarily, so that the
				 * validation passes without errors, until documented more precisely.
				 */
				"general" : {
					$type : "json:ObjectRef",
					$description : ""
				},
				"widgets" : {
					$type : "json:Object",
					$description : "",
					$properties : {
						"TextInput" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Dialog" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"SelectBox" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Select" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"DatePicker" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"MultiSelect" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Div" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Button" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"CheckBox" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"RadioButton" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Icon" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"List" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Calendar" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Gauge" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"SortIndicator" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Tab" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"TabPanel" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Text" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""
						},
						"Link" : {
							/* TODO: replace type with json:Object and complete it */
							$type : "json:ObjectRef",
							$description : ""							
						},
						/******** Mobile skins ********/
						"scFieldSet" : {
							$type: "BaseWidgetJsSkinCfg",
							$description: "",
							$mandatory: false
						}						
					}
				}
			}
		},
		"DivSkinCfg" : {
			$type : "json:Object",
			$description : "",
			$properties : {
				"sprType" : {
					$type: "json:Integer",
					$description : "",
					$minValue: 0,
					$maxValue: 3
				},
				"states" : { 
					$type: "json:Map",
					$description: "",
					$contentType: {
						$type: "json:ObjectRef",
						$description : ""/*,
						$properties : {
							
						}*/
					}
				}
			}
		},
		/*"TextInputSkinCfg" : {
			$type : "DivSkinCfg",
			$description : "",
			$properties : {
				/* TODO: complete this part with TextInput properties not dependent on the state */
				/*"states" : {
					$type : "DivSkinCfg.states",
					$description : "",
					$contentType : {
						$type : "DivSkinCfg.states.$contentType",
						$description : "",
						$properties : {
							
/* TODO: complete this part with TextInput properties dependent on the state */
/*}
					}
				}
			}
		},*/

		/*
		 * Maybe, in the future, this file should be split in two. Up to here, it is the whole skin configuration. Down
		 * to the end, it is the part of the skin stored in the JS file (notice the JsSkinCfg suffix). Some parts may be
		 * common (Color, for example...).
		 */

		"Color" : {
			$type : "json:String",
			$description : ""
		},
		"JsSkinCfg" : {
			$type : "json:Object",
			$description : "Part of the skin configuration which is stored as a JS file (as opposed to the part of the skin which is stored as a CSS file).",
			$properties : {
				"scDiv" : {
					$type : "DivJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scTextInput" : {
					$type : "TextInputJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scButton" : {
					$type : "ButtonJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scCheckBox" : {
					$type : "CheckBoxJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scSortIndicator" : {
					$type : "SortIndicatorJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scTab" : {
					$type : "TabJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scTabPanel" : {
					$type : "TabPanelJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scText" : {
					$type : "TextJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scRadioButton" : {
					$type : "RadioButtonJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scIcon" : {
					$type : "IconJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scList" : {
					$type : "ListJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scCalendar" : {
					$type : "CalendarJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scGauge" : {
					$type : "GaugeJsSkinCfg",
					$description : "",
					$mandatory : true
				},
				"scDialog" : {
					$type : "DialogJsSkinCfg",
					$description : "",
					$mandatory : true
				}
			}
		},
		"BaseWidgetJsSkinCfg" : {
			$type : "json:Map",
			$description : "",
			$contentType : {
				$type : "json:Object",
				$description : ""
			}
		},
		"CheckBoxJsSkinCfg" : {
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
				$properties : {
					iconset : {
						$type : "json:String",
						$description : ""
					},
					iconprefix : {
						$type : "json:String",
						$description : ""
					},
					states : {
						$type : "json:Map",
						$description : "",
						$contentType : {
							$type : "json:Object",
							$description : "",
							$properties : {
								color : {
									$type : "Color",
									$description : ""
								}
							}
						}
					}
				}
			}
		},
		"SortIndicatorJsSkinCfg" : {
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
				$properties : {
					iconset : {
						$type : "json:String",
						$description : ""
					},
					iconprefix : {
						$type : "json:String",
						$description : ""
					},
					states : {
						$type : "json:Map",
						$description : "",
						$contentType : {
							$type : "json:Object",
							$description : "",
							$properties : {
								color : {
									$type : "Color",
									$description : ""
								}
							}
						}
					}
				}
			}
		},
		"TabJsSkinCfg" : {
			$type : "DivJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "DivJsSkinCfg.$contentType",
				$description : ""
			}			
		},
		"TabPanelJsSkinCfg" : {
			$type : "DivJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "DivJsSkinCfg.$contentType",
				$description : ""
			}			
		},
		"TextJsSkinCfg" : { 
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
				$description : ""
			}			
		},
		"RadioButtonJsSkinCfg" : {
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
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
			}
		},
		"IconJsSkinCfg" : {
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
				$description : "",
				$properties : {
					cssClass : {
						$type : "json:String",
						$description : ""
					},
					spriteURL : {
						$type : "json:String",
						$description : ""
					},
					spriteSpacing : {
						$type : "json:Integer",
						$description : ""
					},
					iconWidth : {
						$type : "json:Integer",
						$description : ""
					},
					iconHeight : {
						$type : "json:Integer",
						$description : ""
					},
					verticalAlign : {
						$type : "json:String",
						$description : ""
					},
					margins : {
						$type : "json:String",
						$description : ""
					},
					biDimensional : {
						$type : "json:Boolean",
						$description : ""
					},
					direction : {
						$type : "json:Enum",
						$description : "",
						$enumValues : ["x", "y"]
					},
					content : {
						$type : "json:Map",
						$description : "",
						$contentType : {
							$type : "json:MultiTypes",
							$description : "",
							$contentTypes : [{
										$type : "json:String",
										$description : ""
									}, {
										$type : "json:Integer",
										$description : ""
									}]
						}
					}
				}
			}
		},
		"DivJsSkinCfg" : {
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
				$description : "",
				$properties : {
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
					offsetLeft : {
						$type : "json:Integer",
						$description : ""
					},
					sprType : {
						$type : "json:Integer",
						$description : ""
					},
					sprHeight : {
						$type : "json:Integer",
						$description : ""
					},
					sprWidth : {
						$type : "json:Integer",
						$description : ""
					},
					bgRepeat : {
						$type : "json:Boolean",
						$description : ""
					},
					fixedHeight : {
						$type : "json:Boolean",
						$description : ""
					},
					states : {
						$type : "json:Map",
						$description : "",
						$contentType : {
							$type : "json:Object",
							$description : "",
							$properties : {
								topPos : {
									$type : "json:Integer",
									$description : ""
								},
								sprIdx : {
									$type : "json:Integer",
									$description : ""
								},
								color : {
									$type : "Color",
									$description : ""
								},
								textAlign : {
									$type : "json:String",
									$description : ""
								}
							}
						}
					}
				}
			}
		},
		"TextInputJsSkinCfg" : {
			$type : "DivJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "DivJsSkinCfg.$contentType",
				$description : "",
				$properties : {
					helpText : {
						$type : "json:Object",
						$description : "",
						$properties : {
							color : {
								$type : "Color",
								$description : ""
							},
							italics : {
								$type : "json:Boolean",
								$description : ""
							}
						}
					}
				}
			}
		},
		"ButtonJsSkinCfg" : {
			$type : "DivJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "DivJsSkinCfg.$contentType",
				$description : ""
			}
		},
		"ListJsSkinCfg" : {
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
				$description : "",
				$properties : {
					"divsclass" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassItem" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassEnabled" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassSelected" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassDisabled" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassFooter" : {
						$type : "json:String",
						$description : "Class for the footer of the list"
					}
				}
			}
		},
		"CalendarJsSkinCfg" : {
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
				$description : "",
				$properties : {
					"defaultTemplate" : {
						$type : "json:String",
						$description : ""
					},
					"cssClass" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassMonthTitle" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassSelected" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassUnselectable" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassSelectable" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassDay" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassWeekend" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassToday" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassMouseover" : {
						$type : "json:String",
						$description : ""
					},
					"cssClassMouseout" : {
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
			}
		},
		"DialogJsSkinCfg" : {
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
				$description : ""
			}
		},
		"GaugeJsSkinCfg" : {
			$type : "BaseWidgetJsSkinCfg",
			$description : "",
			$contentType : {
				$type : "BaseWidgetJsSkinCfg.$contentType",
				$description : "",
				$properties : {
					sprHeight : {
						$type : "json:Integer",
						$description : "Specifies the sprite height used for the background of the whole gauge and the progress bar"
					},
					border : {
						$type : "json:String",
						$description : "Specifies the gauge border style, width and color"
					},
					borderPadding : {
						$type : "json:Integer",
						$description : "Specifies the border padding"
					},
					labelMargins : {
						$type : "json:String",
						$description : ""
					},
					labelFontSize : {
						$type : "json:Integer",
						$description : "Font size in pixels"
					}
				}
			}
		}
	}
});
