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
 * Public interface for the list controller.
 * @class aria.widgets.form.list.IListController
 */
Aria.interfaceDefinition({
	$classpath : 'aria.widgets.form.list.IListController',
	$extends : "aria.templates.IModuleCtrl",
	$events : {
		"onChange" : {
			description : "Raised when user changes selection of items",
			properties : {
				selectedIndexes : "Array of newly selected indexes.",
				unselectedIndexes : "Array of newly unselected indexes."
			}
		},
		"itemClick" : {
			description : "Raised when the user clicks on an item of the list, before or after the element is actually selected or unselected (see the alreadyChanged parameter).",
			properties : {
				"item" : "Item which the user clicked on.",
				"index" : "Index of the item which the user clicked on.",
				"value" : "Value of the item which the user clicked on.",
				"alreadyChanged" : "If true, the event is raised after the value changed because of the click. Otherwise before. The event is raised only once, but whether it is raised before or after the change depends on the template.",
				"cancelDefault" : "If alreadyChanged is true, it is possible to cancel the change of the value by setting this parameter to true."
			}
		},
		"itemMouseOver" : {
			description : "Raised when the user moves the mouse over an item of the list.",
			properties : {
				"item" : "Item over which the user moved the mouse.",
				"index" : "Index of the item over which the user moved the mouse.",
				"value" : "Value of the item over which the user moved the mouse."
			}
		},
		"keyevent" : {
			description : "Raised when the keyevent method is called, which is normally when the user has pressed a key. A listener of this event can change some of the event properties to change the default behavior.",
			properties : {
				"charCode" : "",
				"keyCode" : "",
				"cancelDefault" : ""
			}
		},
		"focusList" : {
			description : "Notifies the template script to give focus to the first element of the list",
			properties : {
				report : "{aria.widgets.controllers.reports.ControllerReport} a check report"
			}
		},
		"focusTextBox" : {
			description : "Focus the text box when the user hits the up button",
			properties : {
				report : "{aria.widgets.controllers.reports.ControllerReport} a check report"
			}
		},
		"close" : {
			description : "Notification that the close method was called on the List module controller"
		}
	},
	$interface : {
		/**
		 * Toggles the selection of a specific item
		 * @param {Number} itemIndex Index of the item to toggle in the items array in the data model
		 * @return true if item is selected after this call, false if not selected
		 */
		toggleSelection : function (itemIndex) {},

		/**
		 * Selects or unselects a specific item. Will trigger the onChange event if selection is changed
		 * @param {Number} itemIndex Index of the item to toggle in the items array in the data model
		 * @param {Boolean} isSelected true if item is to be selected, false if item should be not selected
		 */
		setSelection : function (itemIndex, isSelected) {},

		/**
		 * Get an array of all selected indexes.
		 * @return {Array}
		 */
		getSelectedIndexes : function () {},

		/**
		 * Gets all selected list items.
		 * @return {Array} An array of all selected items. The items returned are in the internal data model format.
		 * From these items it's possible to get for example label, value and selection data.
		 */
		getSelectedItems : function () {},

		/**
		 * Return all selected values.
		 * @return {Array} An array of all selected values. Remark that this is only the value part of the item and
		 * doesn't contain for example label.
		 */
		getSelectedValues : function () {},

		/**
		 * Set the list of selected values.
		 * @param {Array} newValues
		 */
		setSelectedValues : function (newValues) {},

		/**
		 * Set the selected index.
		 * @param {Number} newValue
		 */
		setSelectedIndex : function (newValue) {},

		/**
		 * Set the selection mode
		 * @param {Boolean} multipleSelect
		 */
		setMultipleSelect : function (multipleSelect) {},

		/**
		 * Set the maximum number of selected items (note that multipleSelect takes precedence over this setting).
		 * @param {Integer} maxSelectedCount
		 */
		setMaxSelectedCount : function (maxSelectedCount) {},

		/**
		 * Set the items property.
		 * @param {aria.widgets.form.list.CfgBeans.Items} items
		 */
		setItems : function (items) {},

		/**
		 * Set the disabled property.
		 * @param {Boolean} boolean new value
		 */
		setDisabled : function (disabled) {},

		/**
		 * Set the focus of an item from outside the list
		 * @param {Integer} index The index of the item of the list tha you want to have focus.
		 */
		setFocus : function (index) {},

		/**
		 * Called when an item is clicked
		 * @param {String} itemIndex
		 */
		itemClick : function (itemIndex) {},

		/**
		 * Called when the mouse moves over an item.
		 * @param {String} itemIndex index of the item over which the mouse moved
		 */
		itemMouseOver : function (itemIndex) {},

		/**
		 * Set the focus on an element in the list
		 */
		setFocusedIndex : function () {},

		/**
		 * Notify the list controller that a key has been pressed. The controller reacts by sending a keyevent event.
		 * Upon receiving that event, listeners can either ignore it, which leads to the default action being executed
		 * when returning from the event, or they can override the default action by changing event properties.
		 * @param {Object} Any object with the charCode and keyCode properties which specify which key has been pressed.
		 * Any other property in this object is ignored.
		 * @return {Boolean} cancel state of the event
		 */
		keyevent : function (evtInfo) {},

		/**
		 * Triggers a close event.
		 */
		close : function () {},

		/**
		 * Deselects all values.
		 */
		deselectAll : function () {},

		/**
		 * Selects all values in order that they are stored in the datamodel. If any values are initially disabled they
		 * will not be selected. If a value becomes disabled due to the maxOptions constraint then they will not be
		 * selected.
		 */
		selectAll : function () {}
	}
});