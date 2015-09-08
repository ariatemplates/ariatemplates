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
var ariaUtilsJson = require("../utils/Json");
var ariaUtilsStackHashMap = require("../utils/StackHashMap");
var ariaUtilsType = require("../utils/Type");


(function () {

    /**
     * Sorting function by ascending sortKey. Function given as a parameter to the Array.sort JavaScript function for
     * sorting. It compares two elements and return a value telling which one should be put before the other.
     * @param {aria.templates.ViewCfgBeans:Item} elt1
     * @param {aria.templates.ViewCfgBeans:Item} elt2
     * @return {Integer} -1 if elt1.sortKey &lt; elt2.sortKey, 0 if elt1.sortKey == elt2.sortKey, 1 if elt1.sortKey &gt;
     * elt2.sortKey
     * @private
     */
    var __ascendingSortingFunction = function (elt1, elt2) {
        if (elt1.sortKey == elt2.sortKey) {
            return 0;
        }
        return (elt1.sortKey > elt2.sortKey ? 1 : -1);
    };

    /**
     * Sorting function by descending sortKey. Function given as a parameter to the Array.sort JavaScript function for
     * sorting. It compares two elements and return a value telling which one should be put before the other.
     * @param {aria.templates.ViewCfgBeans:Item} elt1
     * @param {aria.templates.ViewCfgBeans:Item} elt2
     * @return {Integer} -1 if elt2.sortKey &lt; elt1.sortKey, 0 if elt2.sortKey == elt1.sortKey, 1 if elt2.sortKey &gt;
     * elt1.sortKey
     * @private
     */
    var __descendingSortingFunction = function (elt1, elt2) {
        if (elt1.sortKey == elt2.sortKey) {
            return 0;
        }
        return (elt1.sortKey > elt2.sortKey ? -1 : 1);
    };

    /**
     * Function to be used as a sortKeyGetter callback, which returns the value of the property whose name is specified
     * in args.propertyName. See propertySorter for details.
     * @param {aria.templates.ViewCfgBeans:Item} element whose sortKey has to be retrieved
     * @param {Object} args
     * @return {MultiTypes} the sortKey of the element
     * @private
     */
    var __propertySorterSortFct = function (item, args) {
        return item.value[args.propertyName];
    };

    /**
     * Shortcut to aria.utils.Json
     */
    var json;

    /**
     * A view is an object which allows sorting, filtering and paging of an array.
     * @class aria.templates.View
     */
    module.exports = Aria.classDefinition({
        $classpath : 'aria.templates.View',
        $onload : function () {
            json = ariaUtilsJson;
        },
        $onunload : function () {
            json = null;
        },
        /**
         * Create a new view on the given array.
         * @param {Array|Object} obj array or map on which to create the view
         */
        $constructor : function (obj) {

            if (!(ariaUtilsType.isObject(obj) || ariaUtilsType.isArray(obj))) {
                this.$logError(this.INVALID_TYPE_OF_ARGUMENT);
                return;
            }

            /**
             * Contains the initial array or map from which the view is built. This can be changed outside this class at
             * any time. If you add, remove, or replace elements in this array or map, you should call the notifyChange
             * method with CHANGED_INITIAL_ARRAY, so that the view knows it should update its data in the next refresh.
             * If changing the reference with viewobj.initialArray = ..., the call of notifyChange is not necessary (it
             * is automatically detected). If the property of an element inside the array or map is changed you do not
             * need to call notifyChange, unless this property has an incidence on the sort order, in which case you
             * should use CHANGED_SORT_CRITERIA. The initial array or map is never changed by the view itself.
             * @type Array|Object
             */
            this.initialArray = obj;

            /**
             * Sort order, which can be SORT_INITIAL, SORT_ASCENDING, or SORT_DESCENDING. If you modify this property,
             * it is not taken into account until the next refresh.
             * @type String
             */
            this.sortOrder = this.SORT_INITIAL;
            /**
             * An id to use to define the type of sort (e.g. "sortByName"). Allows to detect different consecutive sort
             * types. Ignored (and will be set to null) if this.sortOrder == this.SORT_INITIAL. If you modify this
             * property, it is not taken into account until the next refresh.
             * @type String
             */
            this.sortName = null;
            /**
             * Function which returns the sort key, for each element. The first parameter of the callback is of type
             * aria.templates.ViewCfgBeans.Item. Ignored (and will be set to null) if this.sortOrder ==
             * this.SORT_INITIAL. If you modify this property, it is not taken into account until the next refresh.
             * @type aria.core.CfgBeans:Callback
             */
            this.sortKeyGetter = null;

            /**
             * Array of items (of type aria.templates.ViewCfgBeans.Item) in the correct sort order. This array must not
             * be modified outside this class, except for the filteredIn property of each element, which can be set
             * (through aria.utils.Json.setValue) to filter in or filter out an element directly.
             * @type Array
             */
            this.items = [];

            /**
             * Number of filtered in elements. This property is updated in a refresh if needed.
             * @type Integer
             */
            this.filteredInCount = 0;

            /**
             * Number of elements per page. &gt; 0 if in pageMode, -1 otherwise. If you modify this property, it is not
             * taken into account until the next refresh.
             * @type Integer
             */
            this.pageSize = -1;

            /**
             * True if page-view is activated, false otherwise. This property must not be modified outside this class.
             * It is updated in a refresh.
             * @type Boolean
             */
            this.pageMode = false;

            /**
             * Contains the index of the current page, 0 for the first page. If page mode is disabled, must be 0. If you
             * modify this property, it is not taken into account until the next refresh. You can use
             * setCurrentPageIndex method to both change current page and do the refresh.
             */
            this.currentPageIndex = 0;

            /**
             * Array of pages. This property must not be modified outside this class. It is updated in a refresh if
             * needed.
             */
            this.pages = this.EMPTY_PAGES;

            /**
             * Keep the last values of modifiable properties to detect changes since the last refresh.
             * @protected
             */
            this._currentState = {
                initialArray : null,
                sortOrder : this.sortOrder,
                sortName : this.sortName,
                sortKeyGetter : this.sortKeyGetter,
                pageSize : this.pageSize,
                currentPageIndex : this.currentPageIndex
            };
            /**
             * Bitwise OR of all notified changes since the last refresh.
             * @protected
             */
            this._changes = 0;

            /**
             * Callback structure used when listening to json objects.
             * @type aria.core.CfgBeans:Callback
             * @protected
             */
            this._jsonChangeCallback = {
                fn : this._notifyDataChange,
                scope : this
            };

            this._refreshInitialArray();
        },
        $destructor : function () {
            if (this.items) {
                this._removeListenersOnItems(this.items);
                this.items = null;
            }
            this._jsonChangeCallback = null;
            this.initialArray = null;
            this.pages = null;
        },
        $statics : {
            SORT_INITIAL : 'I',
            SORT_ASCENDING : 'A',
            SORT_DESCENDING : 'D',

            FILTER_SET : 0,
            FILTER_ADD : 1,
            FILTER_REMOVE : 2,

            CHANGED_INITIAL_ARRAY : 1,
            CHANGED_SORT_CRITERIA : 2,
            _CHANGED_FILTERED_IN : 4,
            _CHANGED_PAGE_DATA : 8,

            EMPTY_PAGES : [{
                        pageIndex : 0,
                        pageNumber : 1,
                        firstItemIndex : 0,
                        lastItemIndex : -1,
                        firstItemNumber : 0,
                        lastItemNumber : 0
                    }],

            INVALID_TYPE_OF_ARGUMENT : "Invalid type: a View can be created on Arrays or Objects",
            UNDEFINED_ARRAY_ELEMENT : "Invalid Array element: creating a View with an undefined element",

            /**
             * Utility function whose result can be used for the sortKeyGetter property.
             * @param {String} propertyName name of the property of an element of the initial array to be used as the
             * sortKey.
             * @return {aria.core.CfgBeans:Callback} callback to be used for the sortKeyGetter property.
             */
            propertySorter : function (propertyName) {
                return {
                    scope : this,
                    fn : __propertySorterSortFct,
                    args : {
                        propertyName : propertyName
                    }
                };
            }
        },
        $prototype : {
            /**
             * Notify the view that something has changed, and has to be taken into account for next refresh. Does not
             * do the refresh itself.
             * @param {Integer} changeType Can be either CHANGED_INITIAL_ARRAY or CHANGED_SORT_CRITERIA or a bitwise OR of both.
             */
            notifyChange : function (changeType) {
                this._changes = this._changes | changeType;
            },

            /**
             * Refresh the view data after something has changed. Do nothing if nothing has changed.
             * @param {Integer} changeType If specified, call notifyChange with that parameter before doing the refresh. This
             * parameter can be either CHANGED_INITIAL_ARRAY or CHANGED_SORT_CRITERIA or a bitwise OR of both.
             */
            refresh : function (changeType) {
                if (changeType) {
                    this.notifyChange(changeType);
                }
                var curState = this._currentState;
                // initial array synchronization
                this._refreshInitialArray();
                this.$assert(156, curState.initialArray == this.initialArray);

                // sort refresh
                if (this.sortOrder == this.SORT_INITIAL) {
                    if (curState.sortOrder != this.SORT_INITIAL) {
                        this._resetSortOrder();
                    }
                    this.sortName = null;
                    this.sortKeyGetter = null;
                } else if (curState.sortKeyGetter != this.sortKeyGetter || curState.sortName != this.sortName
                        || (this._changes & this.CHANGED_SORT_CRITERIA)) {
                    this._sort();
                } else if (this.sortOrder != curState.sortOrder) {
                    this.$assert(167, (this.sortOrder != this.SORT_INITIAL)
                            && (curState.sortKeyGetter == this.sortKeyGetter) && (curState.sortName == this.sortName)
                            && !(this._changes & this.CHANGED_SORT_CRITERIA));
                    // here, we have the same sort name, same sort key getter
                    // we have no change in the sort criteria, but different orders (ascending and descending),
                    // only have to reverse the order (less expensive than sorting)
                    this.items.reverse();
                    curState.sortOrder = this.sortOrder;
                    this._changes = this._changes | this._CHANGED_PAGE_DATA;
                }
                this.$assert(176, this.sortOrder == curState.sortOrder);
                this.$assert(177, this.sortKeyGetter == curState.sortKeyGetter);
                this.$assert(178, this.sortName == curState.sortName);

                // page refresh
                if (curState.pageSize != this.pageSize
                        || (this._changes & (this._CHANGED_PAGE_DATA | this._CHANGED_FILTERED_IN))) {
                    this._refreshPageData();
                }
                this.$assert(181, this.pageSize == curState.pageSize);
                if (this.pageMode) {
                    this.$assert(194, this.pages.length >= 0);
                    if (this.currentPageIndex < 0) {
                        this.currentPageIndex = 0;
                    } else if (this.currentPageIndex >= this.pages.length) {
                        this.currentPageIndex = this.pages.length - 1;
                    }
                } else {
                    this.currentPageIndex = 0;
                }
                curState.currentPageIndex = this.currentPageIndex;
                this._changes = 0;
            },

            /**
             * Function called by aria.utils.Json to notify of a change of the filteredIn property of an item (through
             * setValue).
             * @protected
             */
            _notifyDataChange : function (args) {
                // this method is only called for the filteredIn property
                this._changes = this._changes | this._CHANGED_FILTERED_IN;
            },

            /**
             * Remove the 'this' listener on each item of the given array.
             * @param {Array} array
             * @protected
             */
            _removeListenersOnItems : function (items) {
                var itemsLength = items.length;
                for (var i = 0; i < itemsLength; i++) {
                    json.removeListener(items[i], "filteredIn", this._jsonChangeCallback);
                }
            },

            /**
             * Creates this.items corresponding to this.initialArray. It reuses the current this.items elements if
             * possible.
             * @protected
             */
            _refreshInitialArray : function () {
                var curState = this._currentState;
                var initialArray = this.initialArray;
                var oldValues; // map of old values
                if (curState.initialArray == initialArray && !(this._changes & this.CHANGED_INITIAL_ARRAY)) {
                    return;
                }
                if (curState.initialArray) {
                    // there was already an array, let's keep its values
                    // to keep filteredInState when old values are reused
                    oldValues = new ariaUtilsStackHashMap();
                    var oldItems = this.items;
                    var oldItemsLength = oldItems.length, oldElt;
                    for (var i = 0; i < oldItemsLength; i++) {
                        oldElt = oldItems[i];
                        oldValues.push(oldElt.value, oldElt);
                    }
                }

                if (ariaUtilsType.isObject(initialArray)) {
                    var returnedItems = this._getItemsFromMap(oldValues);
                } else {
                    var returnedItems = this._getItemsFromArray(oldValues);
                }
                if (oldValues) {
                    this._removeListenersOnItems(oldValues.removeAll());
                    oldValues.$dispose();
                }
                this.items = returnedItems.items;
                var filteredOutElements = returnedItems.filteredOutElements;
                var arrayLength = this.items.length;
                curState.initialArray = initialArray;
                curState.sortOrder = this.SORT_INITIAL;
                curState.sortName = null;
                curState.sortKeyGetter = null;
                curState.pageSize = -1;
                this.filteredInCount = arrayLength - filteredOutElements;
                this.pages = [{ // page mode disabled: only one page
                    pageIndex : 0,
                    pageNumber : 1,
                    firstItemIndex : 0,
                    lastItemIndex : arrayLength - 1,
                    firstItemNumber : arrayLength > 0 ? 1 : 0,
                    lastItemNumber : this.filteredInCount
                }];
                this._changes = this._changes & !this.CHANGED_INITIAL_ARRAY; // don't add _CHANGED_PAGE_DATA because
                // we did the job here
            },

            /**
             * Build the items array starting from the initial array and taking into account the items that are already
             * present in the items array of the view
             * @protected
             * @param {aria.utils.StackHashMap} oldValues map of the items that are already present in the items array,
             * indexed by item value
             * @return {Object} contains the items array and the number of elements that are filtered out
             */
            _getItemsFromArray : function (oldValues) {
                var initialArray = this.initialArray;
                var items = [];
                var filteredOutElements = 0;
                var arrayLength = initialArray.length;
                for (var i = 0; i < arrayLength; i++) {
                    var iaElt = initialArray[i];
                    var itemsElt = null;
                    if (oldValues) {
                        itemsElt = oldValues.pop(iaElt);
                    }
                    if (itemsElt == null) {
                        if (iaElt != null) {
                            itemsElt = {
                                value : iaElt,
                                initIndex : i,
                                filteredIn : true,
                                sortKey : null,
                                pageIndex : 0
                            };

                            json.addListener(itemsElt, "filteredIn", this._jsonChangeCallback, true);
                        } else {
                            // log an error if iaElt is undefined
                            this.$logError(this.UNDEFINED_ARRAY_ELEMENT);
                        }

                    } else {
                        itemsElt.pageIndex = 0;
                    }
                    if (itemsElt) {
                        items[i] = itemsElt;
                        if (!itemsElt.filteredIn) {
                            filteredOutElements++;
                        }
                    }
                }
                return {
                    items : items,
                    filteredOutElements : filteredOutElements
                };

            },

            /**
             * Build the items array starting from the initial map and taking into account the items that are already
             * present in the items array of the view
             * @protected
             * @param {aria.utils.StackHashMap} oldValues map of the items that are already present in the items array,
             * indexed by item value
             * @return {Object} contains the items array and the number of elements that are filtered out
             */
            _getItemsFromMap : function (oldValues) {
                var j = 0, items = [], filteredOutElements = 0;
                var initialArray = this.initialArray;
                for (var p in initialArray) {
                    if (initialArray.hasOwnProperty(p) && !json.isMetadata(p)) {
                        var iaElt = initialArray[p];
                        var itemsElt = null;
                        if (oldValues) {
                            itemsElt = oldValues.pop(iaElt);
                        }

                        if (itemsElt == null) {
                            itemsElt = {
                                value : iaElt,
                                initIndex : p,
                                filteredIn : true,
                                sortKey : null,
                                pageIndex : 0
                            };
                            json.addListener(itemsElt, "filteredIn", this._jsonChangeCallback, true);
                        } else {
                            itemsElt.pageIndex = 0;
                        }
                        items[j] = itemsElt;
                        if (!itemsElt.filteredIn) {
                            filteredOutElements++;
                        }
                        j++;
                    }
                }
                return {
                    items : items,
                    filteredOutElements : filteredOutElements
                };

            },

            /**
             * Reset this.items to match the order of the initial array or map.
             * @protected
             */
            _resetSortOrder : function () {
                var oldItems = this.items;
                var oldItemsLength = oldItems.length;
                var newItems = [];
                var initialArray = this.initialArray;

                if (ariaUtilsType.isObject(initialArray)) {
                    var oldItemsMap = new ariaUtilsStackHashMap();
                    var oldElt;
                    for (var i = 0; i < oldItemsLength; i++) {
                        oldElt = oldItems[i];
                        oldItemsMap.push(oldElt.value, oldElt);
                    }

                    var j = 0;
                    for (var p in initialArray) {
                        if (initialArray.hasOwnProperty(p) && !json.isMetadata(p)) {
                            newItems[j] = oldItemsMap.pop(initialArray[p]);
                            j++;
                        }
                    }
                    oldItemsMap.$dispose();
                } else {

                    for (var i = 0; i < oldItemsLength; i++) {
                        var elt = oldItems[i];
                        newItems[elt.initIndex] = elt;
                        delete oldItems[i];
                    }
                }
                this.items = newItems;
                var curState = this._currentState;
                curState.sortOrder = this.SORT_INITIAL;
                curState.sortName = null;
                curState.sortKeyGetter = null;
                this._changes = this._changes | this._CHANGED_PAGE_DATA;
            },

            /**
             * Sort this.items according to this.sortKeyGetter and this.sortOrder. Should not be called if
             * this.sortOrder == this.SORT_INITIAL. Call _resetSortOrder instead.
             * @protected
             */
            _sort : function () {
                var sortKeyGetter = this.sortKeyGetter;
                var items = this.items;
                var itemsLength = items.length;
                for (var i = 0; i < itemsLength; i++) {
                    var elt = items[i];
                    elt.sortKey = sortKeyGetter.fn.call(sortKeyGetter.scope, elt, sortKeyGetter.args);
                }
                items.sort(this.sortOrder == this.SORT_ASCENDING
                        ? __ascendingSortingFunction
                        : __descendingSortingFunction);
                var curState = this._currentState;
                curState.sortKeyGetter = this.sortKeyGetter;
                curState.sortOrder = this.sortOrder;
                curState.sortName = this.sortName;
                this._changes = this._changes | this._CHANGED_PAGE_DATA;
            },

            /**
             * Build this.pages array.
             * @protected
             */
            _refreshPageData : function () {
                var items = this.items;
                var itemsLength = items.length;
                var pageSize = this.pageSize;
                if (pageSize <= 0) {
                    pageSize = -1;
                }
                var pages = [], pageLength = 0;
                var pageIndex = 0;
                var nbElementsInPage = 0;
                var firstElement = -1;
                for (var i = 0; i < itemsLength; i++) {
                    var elt = items[i];
                    if (elt.filteredIn) {
                        if (nbElementsInPage === 0) {
                            firstElement = i;
                        }
                        nbElementsInPage++;
                        elt.pageIndex = pageIndex;
                        if (nbElementsInPage == pageSize) {
                            pages[pageLength++] = {
                                pageIndex : pageIndex,
                                pageNumber : pageIndex + 1,
                                firstItemIndex : firstElement,
                                lastItemIndex : i,
                                firstItemNumber : pageIndex * pageSize + 1,
                                lastItemNumber : (pageIndex + 1) * pageSize
                            };
                            pageIndex++;
                            nbElementsInPage = 0;
                        }
                    } else {
                        elt.pageIndex = -1;
                    }
                }
                this._currentState.pageSize = pageSize;
                this.pageMode = (pageSize > 0);
                this.filteredInCount = pageIndex * pageSize + nbElementsInPage; // true even when pageMode == false (as
                // pageIndex == 0)
                if (nbElementsInPage > 0) {
                    pages[pageLength++] = {
                        pageIndex : pageIndex,
                        pageNumber : pageIndex + 1,
                        firstItemIndex : firstElement,
                        lastItemIndex : itemsLength - 1,
                        firstItemNumber : pageIndex * pageSize + 1,
                        lastItemNumber : this.filteredInCount
                    };
                }
                if (pageLength === 0) {
                    // there always must be at least one page
                    pages = this.EMPTY_PAGES;
                }
                this.pages = pages;
            },

            /**
             * Filter in all elements.
             * @param {Boolean} filteredIn [optional, default: true] If true, filter in all elements. If false, filter
             * out all elements.
             */
            allFilteredIn : function (filteredIn) {
                if (filteredIn == null) {
                    filteredIn = true;
                }
                // if not already done, we must first refresh the initial array before marking all elements:
                this._refreshInitialArray();
                var items = this.items;
                var itemsLength = items.length;
                for (var i = 0; i < itemsLength; i++) {
                    json.setValue(items[i], "filteredIn", filteredIn, this._jsonChangeCallback);
                }
                this.notifyChange(this._CHANGED_FILTERED_IN);
            },

            /**
             * Filter out all elements.
             * @param {Boolean} filteredOut [optional, default: true] If true, filter out all elements. If false, filter
             * in all elements.
             */
            allFilteredOut : function (filteredOut) {
                if (filteredOut == null) {
                    filteredOut = true;
                }
                this.allFilteredIn(!filteredOut);
            },

            /**
             * Toggle the sort order between the following states: Initial > Ascending > Descending > Ascending >
             * Descending > etc... For an explanation of the parameters, see the corresponding properties of the view.
             * @param {String} sortName An id to use to define the type of sort (e.g. "sortByName"). Allows to detect
             * different consecutive sort types.
             * @param {aria.core.CfgBeans:Callback} sortKeyGetter Function which returns the sort key, for each element.
             * The first parameter of the callback is of type aria.templates.ViewCfgBeans.Item.
             */
            toggleSortOrder : function (sortName, sortKeyGetter) {
                this.$assert(326, sortName != null && sortKeyGetter != null);
                if (this.sortOrder != this.SORT_INITIAL && this.sortName == sortName) {
                    if (this.sortOrder == this.SORT_ASCENDING) {
                        this.sortOrder = this.SORT_DESCENDING;
                    } else /* if (this.sortOrder == this.SORT_DESCENDING) */{
                        this.$assert(330, this.sortOrder == this.SORT_DESCENDING);
                        this.sortOrder = this.SORT_ASCENDING;
                    }
                } else {
                    this.sortName = sortName;
                    this.sortKeyGetter = this.$normCallback(sortKeyGetter);
                    this.sortOrder = this.SORT_ASCENDING;
                }
            },

            /**
             * Set the page size and refreshes the view.
             * @param {Integer} page size
             */
            setPageSize : function (pageSize) {
                this.pageSize = pageSize;
                this.refresh();
            },

            /**
             * Set the current page index and refreshes the view.
             * @param {Integer} page index
             */
            setCurrentPageIndex : function (pageIndex) {
                this.currentPageIndex = pageIndex;
                this.refresh();
            },

            /**
             * Shortcut function which sets the sort properties (sortOrder, sortName and sortKeyGetter) and refreshes
             * the view. For an explanation of the parameters, see the corresponding properties of the view.
             * @param {String} sortOrder
             * @param {String} sortName
             * @param {aria.core.CfgBeans:Callback} sortKeyGetter
             */
            setSort : function (sortOrder, sortName, sortKeyGetter) {
                this.sortOrder = sortOrder;
                this.sortName = sortName;
                this.sortKeyGetter = this.$normCallback(sortKeyGetter);
                this.refresh();
            },

            /**
             * Filters the items with a callback function called on each element. Does not refresh the view.
             * @param {Integer} filterType Can be either FILTER_SET (in this case, filterCallback will be called on all elements
             * whether they are filtered in or not), FILTER_ADD (filterCallback will only be called on filtered out
             * elements, so that it can only add elements to the current display) or FILTER_REMOVE (filterCallback will
             * only be called on filtered in elements, so that it can only remove elements from the current display).
             * @param {aria.core.CfgBeans:Callback} filterCallback Callback which will be called on each item. The
             * callback must return either true or false, which will be the new value of the filteredIn property of the
             * element.
             */
            filterIn : function (filterType, filterCallback) {
                // normalize callback only once
                filterCallback = this.$normCallback(filterCallback);
                var filterFn = filterCallback.fn, filterScope = filterCallback.scope;
                // if not already done, we must first refresh the initial array before marking all elements:
                this._refreshInitialArray();
                var items = this.items;
                var itemsLength = items.length;
                for (var i = 0; i < itemsLength; i++) {
                    var elt = items[i];
                    var filteredIn = elt.filteredIn;
                    if (filterType == this.FILTER_SET || (filteredIn === (filterType == this.FILTER_REMOVE))) {
                        filteredIn = filterFn.call(filterScope, elt, filterCallback.args);
                        json.setValue(elt, "filteredIn", filteredIn);
                    }
                }
            },

            getNewIndex : function (items, itemIndex) {

                for (var i = 0, ii = items.length; i < ii; i = i + 1) {
                    if (items[i].initIndex == itemIndex) {

                        return i;
                    }
                }
            },

            /**
             * Updates initial array of the view. Needed in case where the previous initial array is replaced by another object
             * @param {Array|Object} new obj array or map on which to create the view
             */
            updateInitialArray : function (array) {
                if (!(ariaUtilsType.isObject(array) || ariaUtilsType.isArray(array))) {
                    this.$logError(this.INVALID_TYPE_OF_ARGUMENT);
                    return;
                }
                this.initialArray = array;
                this._refreshInitialArray();
            }

        }
    });
})();
