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

(function () {
    var basePackage = "atplugins.lightWidgets";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.classDefinition({
        $classpath : "atplugins.lightWidgets.autocomplete.AutocompleteDropDown",
        $extends : "atplugins.lightWidgets.DropDown",
        $dependencies : ["aria.utils.Dom", "aria.utils.Json", "aria.popups.Popup", "aria.html.Template"],
        $constructor : function (cfg) {
            this.$DropDown.constructor.call(this, cfg);

            /**
             * data model that is shared with the widget and the template
             * @type Object
             * @protected
             */
            this.data = cfg.data;

            /**
             * Listener to the change of popup status
             * @type aria.core.CfgBeans.Callback
             * @protected
             */
            this._popupStatusListener = {
                fn : this._onpopupStatusChange,
                scope : this
            };

            aria.utils.Json.addListener(this.data, "popupOpen", this._popupStatusListener);

            /**
             * Instance of the template that is currently shown
             * @type aria.html.Template
             * @protected
             */
            this._templateInstance = null;

            /**
             * skin class of the widget
             * @type String
             * @protected
             */
            this._sclass = cfg.sclass;
        },
        $destructor : function () {
            aria.utils.Json.removeListener(this.data, "popupOpen", this._popupStatusListener);
            this.data = null;
            this._popupStatusListener = null;
            this.$DropDown.$destructor.call(this);
        },
        $prototype : {

            /**
             * Closes the popup as a reaction to a user interaction of the template
             * @param {Object} change Contains oldValue and newValue
             * @protected
             */
            _onpopupStatusChange : function (change) {
                if (!change.newValue) {
                    this.close();
                }
            },

            /**
             * Open the popup
             */
            open : function () {
                this.$DropDown.open.call(this);
                aria.utils.Json.setValue(this.data, "popupOpen", true);
            },

            /**
             * React to popup close
             * @protected
             */
            _onAfterClose : function () {
                aria.utils.Json.setValue(this.data, "popupOpen", false, this._popupStatusListener);
                this.$DropDown._onAfterClose.call(this);
            },

            /**
             * Method that fills the section shown in the popup
             * @param {aria.templates.MarkupWriter} out
             * @protected
             */
            _contentWriter : function (out) {

                this._prepareDataForTemplate();
                var content = {
                    classpath : this._cfg.template,
                    data : this.data,
                    attributes : {
                        style : "display: inline-block; height: 10px; overflow: visible",
                        classList : [this._sclass + "acListContainer"]
                    }
                };

                var template = new aria.html.Template(content, this._cfg.context, this._cfg.lineNumber);
                out.registerBehavior(template);
                template.writeMarkup(out);
                this._templateInstance = template;
            },

            refresh : function () {
                this._prepareDataForTemplate();
                this._templateInstance.subTplCtxt.$refresh();
            },

            _prepareDataForTemplate : function () {
                var cfg = this._cfg;
                var controllerData = cfg.controller.data;
                var matchValueIndex = this._prepareSuggestionsAndMatch(controllerData.suggestions, this.data.textValue);
                var suggestionMerged = this._mergeItemsAndSelectionInfo(controllerData.newsuggestions, controllerData.suggestions, matchValueIndex);

                var skinObj = {};
                skinObj.cssClassItem = "xACItem";
                skinObj.cssClassEnabled = "xACEnabledItem";
                skinObj.cssClassSelected = "xACSelectedItem";
                skinObj.cssClassDisabled = "xACDisabledItem";
                skinObj.cssClassMouseover = "xACMouseOverItem";
                skinObj.cssClassFooter = "xACFooter";

                this.data.items = suggestionMerged.items;
                this.data.skin = skinObj;

                this.data.selectedIdx = null;
            },
            _prepareSuggestionsAndMatch : function (suggestions, textEntry) {
                var matchValueIndex = -1, suggestion;
                this._cfg.controller.data.newsuggestions = [];

                for (var index = 0, len = suggestions.length, label; index < len; index += 1) {
                    suggestion = suggestions[index];
                    // if it's the first exact match, store it
                    if (matchValueIndex == -1) {
                        if (suggestion.exactMatch) {
                            matchValueIndex = index;
                        }
                    }
                    label = this._getLabelFromSuggestion(suggestion);
                    var tmp = {
                        entry : textEntry,
                        label : label,
                        value : suggestion
                    };

                    this._cfg.controller.data.newsuggestions[index] = tmp;
                }

                return matchValueIndex;
            },

            _getLabelFromSuggestion : function (value) {
                return this._cfg.controller._resourcesHandler.suggestionToLabel(value);
            },

            _mergeItemsAndSelectionInfo : function (items, selectedValues, selectedIdx) {
                var arrayUtil = aria.utils.Array;
                var preselect;

                selectedIdx = (preselect === undefined) ? selectedIdx : preselect;
                var maxSelectedCount = this._getTrueMaxSelectedCount(items);
                var pbMaxSelected = true; // true if the number of selected values is greater than maxSelectedCount

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

            _getTrueMaxSelectedCount : function (items) {
                var data = this._cfg.controller.data;
                var res = data.multipleSelect ? data.maxSelectedCount : 1;
                if (res == null) {
                    if (items == null) {
                        items = data.items;
                    }
                    res = 1 + items.length;
                }
                this.$assert(268, res >= 1);
                return res;
            }
        }
    });
})();