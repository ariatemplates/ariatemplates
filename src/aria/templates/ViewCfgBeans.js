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


/**
 * @class aria.templates.ViewCfgBeans
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.templates.ViewCfgBeans",
    $description : "Definition of beans used in aria.templates.View",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "Item" : {
            $type : "json:Object",
            $description : "Structure used in the items property of the view. Each item corresponds to an element of the initial array.",
            $properties : {
                "value" : {
                    $type : "json:MultiTypes",
                    $description : "Link to the value in the initial array."
                },
                "initIndex" : {
                    $type : "json:MultiTypes",
                    $description : "Index of the element inside the initial array or map.",
                    $mandatory : true,
                    $contentTypes : [{
                                $type : "json:Integer",
                                $description : "Position of the item value inside the initial array."
                            }, {
                                $type : "json:String",
                                $description : "Key of the item value inside the initial map."
                            }]
                },
                "filteredIn" : {
                    $type : "json:Boolean",
                    $description : "Indicates whether the element is filtered in or not. Can be changed outside the View class, but only through the aria.utils.Json.setValue function, so that the view is notified of any change. This way, this property can also be binded to a widget.",
                    $mandatory : true
                },
                "sortKey" : {
                    $type : "json:String",
                    $description : "Last sort key used for this element."
                },
                "pageIndex" : {
                    $type : "json:Integer",
                    $description : "Index of the page to which the element belongs. If not in page mode, is 0 for all filtered in elements. If filteredIn is false, pageIndex = -1.",
                    $mandatory : true
                }
            }
        },
        "Pages" : {
            $type : "json:Object",
            $description : "Description of a page.",
            $properties : {
                "pageIndex" : {
                    $type : "json:Integer",
                    $description : "Index of the page in the pages property of the view. 0 for the first page."
                },
                "pageNumber" : {
                    $type : "json:Integer",
                    $description : "Number of the page (= pageIndex + 1)"
                },
                "firstItemIndex" : {
                    $type : "json:Integer",
                    $description : "Index of an element in the items property of the view, such that no element before that one belongs to this page."
                },
                "lastItemIndex" : {
                    $type : "json:Integer",
                    $description : "Index of an element in the items property of the view, such that no element after that one belongs to this page."
                },
                "firstItemNumber" : {
                    $type : "json:Integer",
                    $description : "Number of the first element in the page, counting only the filtered in elements, and starting at 1 for the first element in the first page."
                },
                "lastItemNumber" : {
                    $type : "json:Integer",
                    $description : "Number of the last element in the page, counting only the filtered in elements, and starting at 1 for the first element in the first page. When in page mode, for all pages except the last one: lastItemNumber - firstItemNumber + 1 = pageSize"
                }
            }
        }
    }
});
