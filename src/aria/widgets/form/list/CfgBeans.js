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
 * Beans used for the data model of the list module controller.
 * @class aria.widgets.form.list.CfgBeans
 */
Aria.beanDefinitions({
    $package : "aria.widgets.form.list.CfgBeans",
    $description : "Beans used for the data model of the list module controller.",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "ListModel" : {
            $type : "json:Object",
            $description : "Root of the list data model.",
            $properties : {
                "items" : {
                    $type : "ItemsArray"
                },
                "itemsView" : {
                    $type : "json:ObjectRef",
                    $description : "View on the items, with the correct order to display them.",
                    $classpath : "aria.templates.View"
                },
                "activateSort" : {
                    $type : "json:Boolean",
                    $description : "Whether sorting is enabled."
                },
                "multipleSelect" : {
                    $type : "json:Boolean",
                    $description : "Specify whether it is possible to select multiple items at the same time (true) or at most one (false)."
                },
                "maxSelectedCount" : {
                    $type : "json:Integer",
                    $minValue : 1,
                    $description : "Maximum number of items that can be selected at the same time. It is only taken into account if multipleSelect is true. A null value means there is no maximum."
                },
                "disabled" : {
                    $type : "json:Boolean",
                    $description : "Specify whether the list is disabled (true) or enabled (false)."
                },
                "selectedIndex" : {
                    $type : "json:Integer",
                    $minValue : -1,
                    $description : "Index of the selected element in the list, if only one is selected. -1 means no element is selected. A null value means several elements are selected."
                },
                "selectedCount" : {
                    $type : "json:Integer",
                    $description : "Number of selected items.",
                    $minValue : 0
                },
                "displayOptions" : {
                    $type : "displayOptions"
                },
                "cfg" : {
                    $type : "json:ObjectRef",
                    $description : "Configuration which should be used for the div surrounding the widget."
                },
                "skin" : {
                    $type : "json:ObjectRef",
                    $description : "Skin properties."
                },
                "numberOfColumns" : {
                    $type : "numberOfColumns",
                    $description : "How many Rows the multi-select should contain"
                },
                "numberOfRows" : {
                    $type : "numberOfRows",
                    $description : "How many Columns the multi-select should contain"
                },
                /*
                 * TODO remove? "numItemsLastCol" : { $type : "numberOfRows", $description : "How many Columns the
                 * multi-select should contain" },
                 */
                "focusIndex" : {
                    $type : "json:Integer",
                    $description : "The index of the list item with focus",
                    $default : 0
                },
                "preselect" : {
                    $type : "json:String",
                    $description : "strict: for strict highlighting (exact match only), always: for selecting the first item everytime, none: for no highlighting",
                    $default : "none"
                }
            }
        },
        "numberOfColumns" : {
            $type : "json:Integer",
            $description : "How many columns are to be used in the display of the list",
            $default : 0,
            $minValue : 0
        },
        "numberOfRows" : {
            $type : "json:Integer",
            $description : "How many columns are to be used in the display of the list",
            $default : 0,
            $minValue : 0
        },
        "displayOptions" : {
            $type : "json:Object",
            $description : "Display options that are not interpreted by the list controller.",
            $default : {
                "flowOrientation" : 'vertical',
                "tableMode" : false
            },
            $properties : {
                "flowOrientation" : {
                    $type : "json:Enum",
                    $description : "The Orientation of a list whether items are listed horizontally or vertically first. Display options may not be supported by all list templates.",
                    $enumValues : ["horizontal", "vertical"],
                    $default : 'vertical'
                },
                "tableMode" : {
                    $type : "json:Boolean",
                    $description : "Specifies whether the list uses Table Mode which is when the values of a list are split on a seperator and list resulting values are put 1 on each row",
                    $default : false
                },
                "listDisplay" : {
                    $type : "json:Enum",
                    $description : "Whether to display code, value or both on the label next to the checkbox.",
                    $enumValues : ["code", "label", "both"],
                    $default : 'code'
                },
                "displayFooter" : {
                    $type : "json:Boolean",
                    $description : "Used to display the select all, deselect all, and close links.",
                    $default : false
                }
            }
        },
        "ItemsArray" : {
            $type : "json:Array",
            $description : "Array of items.",
            $contentType : {
                $type : "Item"
            }
        },
        "Item" : {
            $type : "json:Object",
            $description : "Structure describing an item in the list",
            $properties : {
                "label" : {
                    $type : "json:String",
                    $description : "Text to display to the user - must be translated in user language."
                },
                "value" : {
                    $type : "json:String",
                    $description : "Internal value associated to the item - usually a language-independent code."
                },
                "currentlyDisabled" : {
                    $type : "json:Boolean",
                    $description : "Whether the item is disabled (true) or enabled (false), taking into account whether the maximum number of selected items has been reached or not."
                },
                "initiallyDisabled" : {
                    $type : "json:Boolean",
                    $description : "Whether the item is disabled (true) or enabled (false), independently of whether the maximum number of selected items has been reached or not."
                },
                "object" : {
                    $type : "json:ObjectRef",
                    $description : "Reference to the object storing extra information about the item."
                },
                "selected" : {
                    $type : "json:Boolean",
                    $description : "Specifies whether the item is selected (true) or not (false)."
                },
                "index" : {
                    $type : "json:Integer",
                    $description : "Index in the items array."
                }
            }
        }
    }
});
