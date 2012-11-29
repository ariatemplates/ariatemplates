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
 * The list widget is constructed with a sub module controller and a sub template. This is the sub module controller.
 */
Aria.classDefinition({
    $classpath : "aria.widgets.form.list.ListController",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["aria.widgets.form.list.IListController"],
    $dependencies : ["aria.utils.Array", "aria.widgets.form.list.CfgBeans", "aria.templates.View", "aria.DomEvent"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this._dataBeanName = "aria.widgets.form.list.CfgBeans.ListModel";
        this._nbStopUpdates = 0;

        /**
         * Whether the current event is a navigation event or a generic event
         * @type Boolean
         * @protected
         */
        this._navigationEvent = false;

        this._itemsListener = {
            fn : this._notifyItemsChange,
            scope : this
        };

        this.json.setValue(this._data, "focusIndex", 0);

    },

    $destructor : function () {

        var data = this._data;
        var itemsView = data.itemsView;
        if (itemsView) {
            itemsView.$dispose();
            data.itemsView = null;
        }
        // Calling _setItems with null removes listeners
        this._setItems(null);
        this._navigationEvent = null;
        this._itemsListener = null;
        this.$ModuleCtrl.$destructor.call(this);
    },

    $prototype : {
        $hasFlowCtrl : false,
        $publicInterfaceName : "aria.widgets.form.list.IListController",

        /**
         * Initialise the module controller
         * @param {Object} args
         * @param {Object} cb callback
         */
        init : function (args, cb) {

            this.setData(args.dataModel);
            var itemsInfo = args.itemsInfo;

            var res = this._mergeItemsAndSelectionInfo(itemsInfo.items, itemsInfo.selectedValues, itemsInfo.selectedIndex);
            this._setItems(res.items);

            this.json.setValue(this._data, "selectedIndex", res.selectedIndex);
            this.json.setValue(this._data, "selectedCount", res.selectedCount);
            // this.json.setValue(this._data, "selectedValues", res.selectedValues);

            if (itemsInfo.selectedValues == null) {
                this.setSelectedIndex(itemsInfo.selectedIndex);
            }
            var itemsView = new aria.templates.View(this._data.items);
            this.json.setValue(this._data, "itemsView", itemsView);
            if (this._data.activateSort) {
                itemsView.setSort(itemsView.SORT_ASCENDING, "sortByLabel", this._sortByLabel);
            }

            this.$callback(cb);

        },

        /**
         * Raise a focusList event. This can be used by the List Template to give focus to a specific item
         * @param {Integer} index
         */
        setFocus : function (index) {
            var evt = {
                name : "focusList"
            };
            this.$raiseEvent(evt);
        },

        /**
         * Return the item that should be preselected depending on the navigation event
         * @protected
         * @return {Integer} Item position or null if nothing should be preselected
         */
        _checkPreselect : function () {
            if (!this._navigationEvent) { // will not override any selections using arrow keys or mouse over
                if (this._data.preselect === "none") {
                    return null;
                } else if (this._data.preselect === "always") {
                    return 0;
                }
            } else {
                this._navigationEvent = false;
            }
        },

        /**
         * Sort key getter by label, used when activateSort is used.
         * @protected
         * @param {aria.templates.ViewCfgBeans.Item} obj view item object whose sort key should be returned
         */
        _sortByLabel : function (obj) {
            // BE CAREFUL:
            // in this method, most of the time, 'this' will not refer to the list controller.
            return obj.value.label;
        },

        /**
         * Prevent the automatic updates in the data model when selecting or unselecting an item in the list. Call
         * _resumeUpdates to allow them again.
         * @protected
         */
        _stopUpdates : function () {
            this._nbStopUpdates++;
        },

        /**
         * Allow automatic updates in the data model (for example: selectedCount) when selecting or unselecting an item
         * in the list. (to be used in conjunction with _stopUpdates).
         * @protected
         */
        _resumeUpdates : function () {
            this.$assert(63, this._nbStopUpdates > 0);
            this._nbStopUpdates--;
        },

        /**
         * Return true if automatic updates in the data model are not allowed.
         * @protected
         */
        _updatesStopped : function () {
            return this._nbStopUpdates > 0;
        },

        /**
         * Called when a property of one of the this._data.items[*] objects changed.
         * @param {Object}
         * @protected
         */
        _notifyItemsChange : function (args) {
            if (this._updatesStopped()) {
                return;
            }
            var dataName = args.dataName;
            if (dataName == "selected") {
                var item = args.dataHolder;
                if ((args.newValue && !args.oldValue) // item was just selected
                        || (!args.newValue && args.oldValue) // item was just unselected
                ) {
                    this._selectionChanged(item.index);
                }
            } else if (dataName == "initiallyDisabled") {
                this._updateCurrentlyDisabled([args.dataHolder]);
            }
        },

        /**
         * Update the currentlyDisabled properties of each item in itemsList, based on the initiallyDisabled and
         * selected properties and on the current number of selected items.
         * @param {Array} itemsList array of items (sub-array of this._data.items) whose currentlyDisabled properties
         * have to be updated
         * @protected
         */
        _updateCurrentlyDisabled : function (itemsList) {
            var selectedCount = this._data.selectedCount;
            var maxSelectedCount = this._getTrueMaxSelectedCount();
            for (var i = 0, l = itemsList.length; i < l; i++) {
                var item = itemsList[i];
                var res = item.initiallyDisabled;
                if (!res && selectedCount >= maxSelectedCount) {
                    res = !item.selected;
                }
                this.json.setValue(item, "currentlyDisabled", res);
            }
        },

        /**
         * Called when the selected property of an item changed. This method updates the selectedCount and selectedIndex
         * properties in the data model and unselect other items if the maximum number of selected items has been
         * reached.
         * @param {Number} itemIndex item whose selected property has just changed.
         * @protected
         */
        _selectionChanged : function (itemIndex) {

            this._stopUpdates();
            var json = this.json;
            var data = this._data;
            var itemsList = data.items;
            var item = itemsList[itemIndex];
            var isSelected = item.selected;

            // Needed to optimize the template
            var newlySelectedIndexes = [];
            var newlyUnselectedIndexes = [];

            // items for which _updateCurrentlyDisabled will be called:
            var changedItems = [item];

            var maxSelectedCount = this._getTrueMaxSelectedCount();
            var previousSelectedCount = data.selectedCount;
            var newSelectedIndex = data.selectedIndex;
            var newSelectedCount = previousSelectedCount;
            this.$assert(149, maxSelectedCount >= previousSelectedCount);

            // now we need to update the selectedIndex and selectedCount properties
            // and also the selection of other items (if max selected count has been reached)
            if (isSelected) {
                newlySelectedIndexes[0] = itemIndex;
                newSelectedCount++;
                if (newSelectedCount > maxSelectedCount) {
                    // selecting a new item would be a problem, we need to unselect another item for this to work
                    var selectedIndexes = this.getSelectedIndexes(); // this may or may not contain itemIndex
                    // (depending on selectedIndex)
                    for (var i = 0, len = selectedIndexes.length; i < len; i++) {
                        var indexSelected = selectedIndexes[i];
                        if (indexSelected != itemIndex) { // do not unselect the item that has just been selected
                            var itemToUnselect = itemsList[indexSelected];
                            // check initiallyDisabled so that programmatically disabled items cannot be unselected
                            // here
                            if (!itemToUnselect.initiallyDisabled) {
                                // we found an item to unselect
                                newSelectedCount--;
                                newlyUnselectedIndexes[0] = indexSelected;
                                json.setValue(itemToUnselect, "selected", false);
                                changedItems.push(itemToUnselect);
                                break;
                            }
                        }
                    }
                    this.$assert(182, newSelectedCount == maxSelectedCount); // we must have found an item to
                    // unselect
                }
                if (newSelectedCount === 1) {
                    newSelectedIndex = itemIndex;
                } else {
                    // more than 1 selected item
                    newSelectedIndex = null;
                }
            } else {
                newlyUnselectedIndexes[0] = itemIndex;
                newSelectedCount--;
                if (newSelectedCount === 0) {
                    this.$assert(194, newSelectedIndex == itemIndex); // it was the only selected item
                    newSelectedIndex = -1;
                } else if (newSelectedCount === 1) {
                    // one remaining selected item, need to find which one
                    var selectedIndexes = this.getSelectedIndexes();
                    this.$assert(202, selectedIndexes.length == 1);
                    newSelectedIndex = selectedIndexes[0];
                } else {
                    // more than one remaining selected item, nothing to do with newSelectedIndex
                    this.$assert(203, newSelectedCount > 1);
                    this.$assert(204, newSelectedIndex == null);
                }
            }
            json.setValue(data, "selectedIndex", newSelectedIndex);
            json.setValue(data, "selectedCount", newSelectedCount);
            if ((newSelectedCount != previousSelectedCount)
                    && (previousSelectedCount == maxSelectedCount || newSelectedCount == maxSelectedCount)) {
                // the number of selected items has changed, and it either the old or the new number is the maximum
                // number
                // update all disabled information
                this._updateCurrentlyDisabled(itemsList);
            } else {
                this._updateCurrentlyDisabled(changedItems);
            }
            this._resumeUpdates();
            // after everything is updated, send the event:
            this._raiseOnChangeEvent(newlySelectedIndexes, newlyUnselectedIndexes);
        },

        /**
         * Set the items property.
         * @param {aria.widgets.form.list.CfgBeans.ItemsArray} newItems array of items
         * @protected
         */
        _setItems : function (newItems) {

            var itemsListener = this._itemsListener;
            var json = this.json;
            var oldItems = this._data.items;
            var numberOfItems;

            if (oldItems == newItems) {
                // items did not change
                // return;
                numberOfItems = newItems.length;
            } else {
                if (oldItems) {
                    // remove the listener on the old items object:
                    for (var i = 0, l = oldItems.length; i < l; i++) {
                        json.removeListener(oldItems[i], null, itemsListener);
                    }
                }
                json.setValue(this._data, "items", newItems);

                if (newItems) {
                    numberOfItems = newItems.length;
                    // add the listener on the new items object:
                    for (var i = 0, l = newItems.length; i < l; i++) {
                        json.addListener(newItems[i], null, itemsListener);
                    }
                    var view = this._data.itemsView;
                    if (view) {
                        view.initialArray = newItems;
                        view.refresh(view.CHANGED_INITIAL_ARRAY);
                    }
                }
            }

            if (this._data.displayOptions) {
                this._calcRowCols(this._data.displayOptions.flowOrientation, this._data.numberOfRows, this._data.numberOfColumns, numberOfItems);
            }

        },

        /**
         * This method return the maximum number of selected items, taking into account both the multipleSelect and
         * maxSelectedCount properties (multipleSelect takes precedence). If there is no maximum number, return a number
         * that is higher than the current number of items in the list.
         * @return {Number}
         * @protected
         */
        _getTrueMaxSelectedCount : function (items) {
            var data = this._data;
            var res = data.multipleSelect ? data.maxSelectedCount : 1;
            if (res == null) {
                if (items == null) {
                    items = data.items;
                }
                res = 1 + items.length;
            }
            this.$assert(268, res >= 1);
            return res;
        },

        /**
         * Merges item data in it's different formats with the selection info.
         * @param {} items The items in one of the accepted formats by the ListCfg bean. Can for example be an array
         * with label/value pairs, or a specification of a container and where to get the label and value properties in
         * that container.
         * @param {} selectedValues [optional] An array with values matching the value property in the items
         * @param Number selectedIdx [optional] Index of the item in selectedValues array which should be selected
         * parameter above.
         * @return {} Returns an object with 4 properties..
         */
        _mergeItemsAndSelectionInfo : function (items, selectedValues, selectedIdx) {
            var arrayUtil = aria.utils.Array;
            var preselect = this._checkPreselect();
            selectedIdx = (preselect === undefined) ? selectedIdx : preselect;
            var maxSelectedCount = this._getTrueMaxSelectedCount(items);
            var pbMaxSelected = false; // true if the number of selected values is greater than maxSelectedCount

            // Items can be taken directly from the array or from another array
            // Identify from which container we'll take the items and from which properties.
            var container = items;
            var labelProperty = "label";
            var valueProperty = "value";
            var disabledProperty = "disabled";
            if (!aria.utils.Type.isArray(items)) {
                container = items.container;
                labelProperty = items.labelProperty;
                valueProperty = items.valueProperty;
                disabledProperty = items.disabledProperty;
            }

            // Merge the item data and info about selection in one array for simpler template construction
            var listItems = [];
            var selectedIndex = -1;
            var selectedCount = 0;
            for (var item = 0, length = container.length; item < length; item++) {
                var itemObj = container[item];
                var itemSelected = selectedValues ? arrayUtil.contains(selectedValues, itemObj[valueProperty])
                        || selectedIdx === item : false;
                if (items[item].disabled) {
                    itemSelected = false;
                }
                if (itemSelected) {
                    if (selectedCount < maxSelectedCount) {
                        selectedCount++;
                        if (selectedIndex != null) {
                            if (selectedIndex == -1) {
                                selectedIndex = item; // only one item is selected
                            } else {
                                selectedIndex = null; // multiple items are selected
                            }
                        }
                    } else {
                        pbMaxSelected = true;
                        // we do as if this item was not selected, as we have reached the
                        // maximum number of selected items
                        itemSelected = false;
                    }
                }
                var initiallyDisabled = disabledProperty ? itemObj[disabledProperty] : false;
                listItems[item] = {
                    index : item,
                    label : itemObj[labelProperty],
                    value : itemObj[valueProperty],
                    object : itemObj,
                    selected : itemSelected,
                    initiallyDisabled : initiallyDisabled,
                    currentlyDisabled : initiallyDisabled
                    // currentlyDisabled will be updated at the end if the maximum number of selected items has been
                    // reached
                };
            }
            // check if the maximum number of items has been reached:
            if (selectedCount == maxSelectedCount) {
                // in this case, all the unselected items must be disabled:
                for (var item = 0, length = listItems.length; item < length; item++) {
                    if (!listItems[item].selected) {
                        listItems[item].currentlyDisabled = true;
                    }
                }
            }

            // In case of single selection mode, we keep track of the current selected index
            // to avoid looping through all elements when doing new selection.
            return {
                items : listItems,
                pbMaxSelected : pbMaxSelected,
                selectedIndex : selectedIndex,
                selectedCount : selectedCount
            };
        },

        /**
         * Method to set the value of the disabled property.
         * @param {Boolean} value new value of the disabled property.
         */
        setDisabled : function (value) {
            this.json.setValue(this._data, "disabled", value);
        },

        /**
         * Set the items property.
         * @param {aria.widgets.form.list.CfgBeans.Items} newItems
         */
        setItems : function (newItems) {
            var res = this._mergeItemsAndSelectionInfo(newItems, this.getSelectedValues());
            this._setItems(res.items);
            this.json.setValue(this._data, "selectedIndex", res.selectedIndex);
            this.json.setValue(this._data, "selectedCount", res.selectedCount);
        },

        /**
         * This method calculates which element of the list should have focus after a keypress
         * @param {String} flowOrientation Whether the items are listed horizonally or vertically
         * @param {String} focusIndex Which list item is currently focused
         * @param {String} numberOfRows How many rows are there in the list
         * @param {String} numberOfColumns How many columns are there in the list
         * @param {String} keyCode Which key was pressed
         * @param {String} numberItems How many items are in the list
         * @returns {Number}
         */
        calcMoveFocus : function (flowOrientation, focusIndex, numberOfRows, numberOfColumns, keyCode, numberItems) {

            var moveFocus = focusIndex;

            if (numberOfColumns == 1) {
                if (keyCode == aria.DomEvent.KC_ARROW_UP) {
                    moveFocus--;
                }
                if (keyCode == aria.DomEvent.KC_ARROW_DOWN) {
                    moveFocus++;
                }
            } else {

                if (keyCode == aria.DomEvent.KC_ARROW_UP) {

                    if (flowOrientation == 'vertical') {
                        moveFocus = focusIndex - 1;
                    } else {
                        if (focusIndex - numberOfColumns < 0) {
                            moveFocus = focusIndex--;
                        } else {
                            moveFocus = focusIndex - numberOfColumns;
                        }
                    }

                } else if (keyCode == aria.DomEvent.KC_ARROW_DOWN) {

                    if (flowOrientation == 'vertical') {
                        moveFocus = focusIndex + 1;
                    } else {
                        if (numberOfColumns < numberItems - focusIndex) {
                            moveFocus = focusIndex + numberOfColumns;
                        } else {
                            return focusIndex;
                        }
                    }
                } else if (keyCode == aria.DomEvent.KC_ARROW_LEFT) {
                    if (flowOrientation == 'horizontal') {
                        moveFocus = focusIndex - 1;
                    } else {
                        if (focusIndex >= numberOfRows) {
                            moveFocus = focusIndex - numberOfRows;
                        } else {
                            return focusIndex;
                        }
                    }
                } else if (keyCode == aria.DomEvent.KC_ARROW_RIGHT) {
                    if (flowOrientation == 'horizontal') {
                        moveFocus = focusIndex + 1;
                    } else {
                        if (numberOfColumns < numberItems - focusIndex) {
                            moveFocus = focusIndex + numberOfRows;
                        } else {
                            return focusIndex;
                        }
                    }
                }
            }
            if (moveFocus >= numberItems) {
                return numberItems - 1;
            } else if (moveFocus < 0) {
                return 0;
            } else {
                return moveFocus;
            }

        },

        /**
         * Notify the list controller that a key has been pressed. The controller reacts by sending a keyevent event.
         * Upon receiving that event, listeners can either ignore it, which leads to the default action being executed
         * when returning from the event, or they can override the default action by changing event properties.
         * @param {Object} Any object with the charCode and keyCode properties which specify which key has been pressed.
         * Any other property in this object is ignored.
         * @return {Boolean} cancel state of the event
         */
        keyevent : function (evtInfo) {

            var data = this._data;

            var evt = {
                name : "keyevent",
                charCode : evtInfo.charCode,
                keyCode : evtInfo.keyCode,
                focusIndex : data.focusIndex,
                cancelDefault : false
            };

            this.$raiseEvent(evt);

            if (data && !evt.cancelDefault) {

                var moveFocus, itemsView = data.itemsView;
                if (aria.DomEvent.isNavigationKey(evt.keyCode)) {
                    this._navigationEvent = true;
                    var startIndex = data.multipleSelect ? data.focusIndex : data.selectedIndex, isFocusable = false, oldFocus = startIndex;
                    moveFocus = startIndex;
                    while (!isFocusable) {
                        moveFocus = this.calcMoveFocus(data.displayOptions.flowOrientation, moveFocus, data.numberOfRows, data.numberOfColumns, evt.keyCode, data.itemsView.items.length);
                        if (oldFocus == moveFocus) {
                            // Tried to move on to a disabled box that cannot be skipped because it's on the edge of
                            // the container
                            moveFocus = startIndex;
                            isFocusable = true;
                        } else {
                            // do not check for single selection as all other are disabled (max item is set to one,
                            // to be refactored properly, in a way that makes sens)
                            isFocusable = !data.multipleSelect
                                    || !itemsView.initialArray[itemsView.items[moveFocus].initIndex].currentlyDisabled;
                        }
                        oldFocus = moveFocus;
                    }

                } else {
                    var moveFocus = data.focusIndex;
                }

                if (data.multipleSelect) {
                    evt.cancelDefault = this.setFocusedIndex(moveFocus);
                } else if (data.selectedIndex != null) {
                    this.setSelectedIndex(moveFocus);
                }
                evt.cancelDefault = true;
            }
            return evt.cancelDefault;
        },

        /**
         * This focuses the correct item in the list based on the item passed
         * @public
         * @param {Number} The item number to focus
         * @returns Boolean
         */
        setFocusedIndex : function (newValue) {

            var data = this._data;
            if (newValue == null) {
                // a null value is allowed for the selectedIndex property, but it cannot be used to set the property
                // as it means several items are selected and we do not know which ones
                // just ignore the null value
                return;
            }
            var items = data.items;

            if (newValue < 0) {
                return false;
            } else if (newValue >= items.length) {
                return false;
            } else {

                this.json.setValue(data, "focusIndex", newValue);
                this.setFocus(data.focusIndex);
                return true;

            }
        },

        /**
         * Called when an item is clicked
         * @param {String} itemIndex index of the item that was changed
         * @param {Boolean} alreadyChanged if true the selected property of the item was already changed (so that it is
         * not necessary to change it again, only raise the itemClick event)
         */
        itemClick : function (itemIndex, alreadyChanged) {

            var data = this._data;

            itemIndex = parseInt(itemIndex, 10); // it will most likely be a string before the conversion
            if (isNaN(itemIndex) || itemIndex < 0 || itemIndex > data.items.length) {
                return; // ignore wrong values of itemIndex
            }

            var newIndex;
            if (data.itemsView) {
                newIndex = this._data.itemsView.getNewIndex(data.itemsView.items, itemIndex);
            } else {
                newIndex = itemIndex;
            }
            this.setFocusedIndex(newIndex);

            if (alreadyChanged == null) {
                alreadyChanged = false;
            }
            var item = data.items[itemIndex];

            var evt = {
                name : "itemClick",
                index : itemIndex,
                item : item,
                value : item.value,
                alreadyChanged : alreadyChanged
            };
            this.$raiseEvent(evt);

            // Warning: this._data below shouldn't be changed to a local variable as this._data can be disposed in
            // some cases and it's needed in toggleSection
            if (this._data && !evt.cancelDefault && !alreadyChanged) {
                // we check this._data because because in the click event, the list controller
                // may have been disposed (e.g. in the selectBox)
                this.toggleSelection(itemIndex);
            }
        },

        /**
         * Called when the mouse moves over an item.
         * @param {String} itemIndex index of the item over which the mouse moved
         */
        itemMouseOver : function (itemIndex) {
            var data = this._data;
            itemIndex = parseInt(itemIndex, 10); // it will most likely be a string before the conversion
            if (isNaN(itemIndex) || itemIndex < 0 || itemIndex > data.items.length) {
                return; // ignore wrong values of itemIndex
            }
            var item = data.items[itemIndex];
            this._navigationEvent = true;
            var evt = {
                name : "itemMouseOver",
                index : itemIndex,
                item : item,
                value : item.value
            };
            this.$raiseEvent(evt);
        },

        /**
         * Toggles the selection of a specific item
         * @param {Number} itemIndex Index of the item to toggle in the items array in the data model
         * @return true if item is selected after this call, false if not selected
         */
        toggleSelection : function (itemIndex) {
            // Don't do anything if the widget is disabled
            if (!this._data.disabled) {
                var newVal = !this._data.items[itemIndex].selected;
                this.setSelection(itemIndex, newVal);
                return newVal;
            } else {
                return this._data.items[itemIndex].selected;
            }
        },

        /**
         * Selects or unselects a specific item. Will trigger the onChange event if selection is changed
         * @param {Number} itemIndex Index of the item to toggle in the items array in the data model
         * @param {Boolean} isSelected true if item is to be selected, false if item should be not selected
         */
        setSelection : function (itemIndex, isSelected) {
            this.json.setValue(this._data.items[itemIndex], "selected", isSelected);
        },

        /**
         * Set the list of selected values.
         * @param {Array} newValues
         */
        setSelectedValues : function (newValues) {
            var arrayUtil = aria.utils.Array;

            this._stopUpdates();
            var newlySelectedIndexes = [];
            var newlyUnselectedIndexes = [];

            // Loop through all of the items and update the selection status for each item,
            // depending on the new array of selected values
            var selectedIndex = -1;
            var data = this._data;
            var items = data.items;
            var maxSelectedCount = this._getTrueMaxSelectedCount(items);
            var selectedCount = 0;
            for (var idx = 0, length = items.length; idx < length; idx++) {
                var item = items[idx];
                var selected = arrayUtil.contains(newValues, item.value);
                if (selected) {
                    if (selectedCount == maxSelectedCount) {
                        // cancel selection when there is more than what is allowed
                        selected = false;
                    } else if (selectedIndex == -1) {
                        selectedCount = 1;
                        selectedIndex = idx;
                    } else {
                        selectedCount++;
                        selectedIndex = null;
                    }
                }
                if (data.preselect === "none" || item.selected != selected) {
                    // selection has changed
                    (selected ? newlySelectedIndexes : newlyUnselectedIndexes).push(idx);
                    this.json.setValue(items[idx], "selected", selected);
                }
            }
            this.json.setValue(data, "selectedIndex", selectedIndex);
            this.json.setValue(data, "selectedCount", selectedCount);

            // James removed this because if more than one item is selected, data. selectedIndex is set to null.
            // Also, in the case of the multi-select we don't necessarily
            // Want to focus a selected item - need to check this on the list.
            // this.json.setValue(data, "focusIndex", selectedIndex);
            // this.setFocus(data.focusIndex);

            this._updateCurrentlyDisabled(items);
            this._resumeUpdates();
            if (newlySelectedIndexes.length > 0 || newlyUnselectedIndexes.length > 0) {
                this._raiseOnChangeEvent(newlySelectedIndexes, newlyUnselectedIndexes);
            }
        },

        /**
         * Set the selected index.
         * @param {Number} newValue
         */
        setSelectedIndex : function (newValue) {
            if (newValue == null) {
                // a null value is allowed for the selectedIndex property, but it cannot be used to set the property
                // as it means several items are selected and we do not know which ones
                // just ignore the null value
                return;
            }
            var items = this._data.items;
            if (newValue < 0 || newValue >= items.length) {
                // unselect all values in case newValue is -1 or invalid
                this.setSelectedValues([]);
            } else {
                this.setSelectedValues([items[newValue].value]);
            }
        },

        /**
         * Set the selection mode
         * @param {Boolean} multipleSelect
         */
        setMultipleSelect : function (multipleSelect) {
            this.json.setValue(this._data, "multipleSelect", multipleSelect);
            this._updateMaxSelectedCount();
        },

        /**
         * Set the maximum number of selected items (note that multipleSelect takes precedence over this setting).
         * @param {Integer} maxSelectedCount
         */
        setMaxSelectedCount : function (maxSelectedCount) {
            this.json.setValue(this._data, 'maxSelectedCount', maxSelectedCount);
            this._updateMaxSelectedCount();
        },

        /**
         * Called to update the selection after the value returned by getMaxSelectedCount has changed.
         * @protected
         */
        _updateMaxSelectedCount : function () {
            var maxSelectedCount = this._getTrueMaxSelectedCount();
            if (this._data.selectedCount >= maxSelectedCount) {
                this.setSelectedValues(this.getSelectedValues());
            }
        },

        /**
         * Get an array of all selected indexes.
         * @return {Array}
         */
        getSelectedIndexes : function () {
            var data = this._data;
            if (data.selectedIndex == -1) {
                // no item is selected
                return [];
            } else if (data.selectedIndex != null) {
                return [data.selectedIndex];
            } else {
                var retVal = [];
                // we iterate over the view, so that we return indexes in the order visible to the user:
                var view = data.itemsView;
                view.refresh(); // in case there are changes in the view, refresh it
                var items = view.items;
                for (var idx = 0, length = items.length; idx < length; idx++) {
                    if (items[idx].value.selected) {
                        // retVal.push(idx);
                        retVal.push(items[idx].initIndex);
                    }
                }
                return retVal;
            }
        },

        /**
         * Gets all selected list items.
         * @return {Array} An array of all selected items. The items returned are in the internal data model format.
         * From these items it's possible to get for example label, value and selection data.
         */
        getSelectedItems : function () {
            var selectedIndexes = this.getSelectedIndexes();
            var retVal = [];
            var items = this._data.items;
            for (var i = 0, length = selectedIndexes.length; i < length; i++) {
                retVal[i] = items[selectedIndexes[i]];
            }
            return retVal;
        },

        /**
         * Return all selected values.
         * @return {Array} An array of all selected values. Remark that this is only the value part of the item and
         * doesn't contain for example label.
         */
        getSelectedValues : function () {
            var selectedIndexes = this.getSelectedIndexes();
            var retVal = [];
            var items = this._data.items;
            for (var i = 0, length = selectedIndexes.length; i < length; i++) {
                retVal[i] = items[selectedIndexes[i]].value;
            }
            return retVal;
        },

        /**
         * Raises the onChange event
         * @protected
         * @param {Array} newlySelectedIndexes array of newly selected indexes
         * @param {Array} newlyUnselectedIndexes array of newly unselected indexes
         */
        _raiseOnChangeEvent : function (newlySelectedIndexes, newlyUnselectedIndexes) {
            var preselect = this._checkPreselect();
            newlySelectedIndexes = (preselect === undefined) ? newlySelectedIndexes : [preselect];
            this.$raiseEvent({
                name : "onChange",
                selectedIndexes : newlySelectedIndexes,
                unselectedIndexes : newlyUnselectedIndexes
            });
        },

        /**
         * Calculates the number of columns and rows a list should have based on the flow
         * @protected
         * @param {String} flowOrientation Orientation of list whether 'horizontal' or 'verticle'
         * @param {Number} numberOfRows The number of Rows
         * @param {Number} numberOfCols The number of Columns
         * @param {Number} noItems The number of Items
         */
        _calcRowCols : function (flowOrientation, numberOfRows, numberOfCols, noItems) {
            var numItemsLastCol;

            if (flowOrientation == 'vertical') {

                if (!numberOfRows) {
                    if (numberOfCols) {
                        numberOfRows = Math.ceil(noItems / numberOfCols);
                        // Now make sure the number of cols they've passed is correct
                        numberOfCols = Math.ceil(noItems / numberOfRows);
                    } else {
                        numberOfCols = 1;
                        numberOfRows = noItems;
                    }
                } else {
                    numberOfCols = Math.ceil(noItems / numberOfRows);
                    numItemsLastCol = noItems % numberOfRows;

                }
            } else if (flowOrientation == 'horizontal') {
                if (!numberOfCols) {
                    if (numberOfRows) {
                        numberOfCols = Math.ceil(noItems / numberOfRows);
                        // Now make sure the number of rows they've passed is correct
                        numberOfRows = Math.ceil(noItems / numberOfCols);
                    } else {
                        numberOfRows = 1;
                        numberOfCols = noItems;
                    }
                } else {
                    numberOfRows = Math.ceil(noItems / numberOfCols);
                }
            }

            this.json.setValue(this._data, "numberOfRows", numberOfRows);
            this.json.setValue(this._data, "numberOfColumns", numberOfCols);
        },

        /**
         * Triggers a close event.
         */
        close : function () {
            this.$raiseEvent("close");
        },

        /**
         * Deselects all values.
         */
        deselectAll : function () {
            this.setSelectedValues([]);
            this.json.setValue(this._data, "focusIndex", 0);
        },

        /**
         * Selects all values in order that they are stored in the datamodel. If any values are initially disabled they
         * will not be selected. If a value becomes disabled due to the maxOptions constraint then they will not be
         * selected.
         */
        selectAll : function () {
            var selected = [];
            var items = this._data.items;
            for (var i = 0; i < items.length; i++) {
                if (!items[i].initiallyDisabled) {
                    selected.push(items[i].value);
                }
            }
            this.setSelectedValues(selected);
            this.json.setValue(this._data, "focusIndex", 0);
        }
    }
});
