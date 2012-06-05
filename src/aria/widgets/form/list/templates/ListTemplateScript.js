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
 * Script for the default list template
 * @class aria.widgets.form.list.ListTemplateScript
 */
Aria.tplScriptDefinition({
	$classpath : 'aria.widgets.form.list.templates.ListTemplateScript',
	$constructor : function () {
		/**
		 * Name of the element containing the displayed list items
		 * @protected
		 * @type {String}
		 */
		this._refContainer = "myList";

		/**
		 * If necessary, shift between the item index and the child index in the dom
		 * @protected
		 * @type {Number}
		 */
		this._itemShift = 1;
	},
	$destructor : function () {
		if (this._scrollToSelectedItemCb != null) {
			aria.core.Timer.cancelCallback(this._scrollToSelectedItemCb);
			this._scrollToSelectedItemCb = null;
		}
	},
	$prototype : {

		/**
		 * This method (called as a timer callback) changes scrollbar position for the selected item to be displayed (if
		 * there is only one item selected).
		 * @protected
		 */
		_scrollToSelectedItem : function () {
			this._scrollToSelectedItemCb = null;
			var idx = this.data.selectedIndex;
			if (idx != null && idx > -1) {
				var wrapper = this.$getChild(this._refContainer, idx + this._itemShift);
				wrapper.scrollIntoView();
				wrapper.$dispose();
			}
		},

		/**
		 * Called after a refresh. This method adds a timer callback to change scrollbar position for the selected item
		 * to be displayed (if there is only one item selected).
		 * @param {aria.templates.CfgBeans.RefreshCfg} args arguments given for the refresh
		 */
		$afterRefresh : function (args) {
			var outputSection = args ? args.outputSection : null;
			if (outputSection == null || outputSection == "Items") {
				// automatically scroll to display selected item
				var idx = this.data.selectedIndex;
				if (idx != null && idx > -1 && this._scrollToSelectedItemCb == null) {
					this._scrollToSelectedItemCb = aria.core.Timer.addCallback({
						fn : this._scrollToSelectedItem,
						scope : this,
						delay : 1
					});
				}
			}
		},

		/**
		 * Called when ListController triggers an event.
		 * @param {Object} evt the event object
		 */
		onModuleEvent : function (evt) {
			if (evt.name == "onChange") {
				if (!evt.selectedIndexes && !evt.unselectedIndexes) {
					// No info about changed items.
					// Only solution is to refresh the whole items section
					this.$refresh({
						filterSection : 'Items'
					});
				} else {
					var items = this.data.items;
					if (evt.unselectedIndexes.length > 0) {
						for (var i = 0, len = evt.unselectedIndexes.length; i < len; i += 1) {
							var idx = evt.unselectedIndexes[i];
							var wrapper = this.$getChild(this._refContainer, idx + this._itemShift);
							wrapper.classList.setClassName(this._getClassForItem(items[idx], false));
							wrapper.$dispose();
						}
					}

					if (evt.selectedIndexes.length > 0) {
						for (var i = 0, len = evt.selectedIndexes.length; i < len; i += 1) {
							var idx = evt.selectedIndexes[i];
							var wrapper = this.$getChild(this._refContainer, idx + this._itemShift);
							wrapper.classList.setClassName(this._getClassForItem(items[idx], false));
							if (i == 0) {
								wrapper.scrollIntoView();
							}
							wrapper.$dispose();
						}
					}
				}
			}
		},

		/**
		 * Event handler to notify the module controller when an item is clicked
		 * @param {aria.templates.DomEventWrapper} evt
		 */
		itemClick : function (evt) {
			if (!this.data.disabled) {
				var itemIdx = evt.target.getExpando("itemIdx",true);
				if (itemIdx) {
					if (aria.core.Browser.isWebkit) {
						// webkit-based browsers explicitly need this
						// (http://www.quirksmode.org/dom/events/blurfocus.html)
						evt.target.focus();
					}
					this.moduleCtrl.itemClick(itemIdx);
				}
			}
		},

		/**
		 * Event handler to notify the module controller when the mouse is moved over an item
		 * @param {aria.templates.DomEventWrapper} evt
		 */
		itemMouseOver : function (evt) {
			if (!this.data.disabled) {
				var itemIdx = evt.target.getExpando("itemIdx", true);
				if (itemIdx) {
					this.moduleCtrl.itemMouseOver(itemIdx);
				}
			}
		},

		/**
		 * Gets the class name of an item depending on the data in the item (selected etc)
		 * @param {aria.widgets.form.list.CfgBeans.Item} item The list item object to decide the class name for
		 * @return {String} The class name. May consist of multiple classes.
		 * @protected
		 */
		_getClassForItem : function (item) {
			var retVal = [this.data.skin.cssClassItem];
			if (item && item.selected) {
				retVal.push(this.data.skin.cssClassSelected);
			}
			if (this.data.disabled) {
				retVal.push(this.data.skin.cssClassDisabled);
			} else {
				retVal.push(this.data.skin.cssClassEnabled);
			}
			return retVal.join(' ');
		}
	}
});
