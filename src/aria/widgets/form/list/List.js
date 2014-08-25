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
var Aria = require("../../../Aria");
var ariaUtilsJson = require("../../../utils/Json");
require("./ListController");
var ariaWidgetsFormListListStyle = require("./ListStyle.tpl.css");
var ariaWidgetsTemplateBasedWidget = require("../../TemplateBasedWidget");


/**
 * A simple list of selectable items
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.list.List",
    $extends : ariaWidgetsTemplateBasedWidget,
    $css : [ariaWidgetsFormListListStyle],
    $constructor : function (cfg, ctxt) {
        this.$TemplateBasedWidget.constructor.apply(this, arguments);
        if (!this._cfg) {
            this._cfg = {};
        }
        var realSkinObj = aria.widgets.AriaSkinInterface.getSkinObject(this._skinnableClass, this._cfg.sclass);
        var skinObj = ariaUtilsJson.copy(realSkinObj, false);
        skinObj.cssClassItem = "x" + this._skinnableClass + "Item_" + this._cfg.sclass;
        skinObj.cssClassEnabled = "x" + this._skinnableClass + "EnabledItem_" + this._cfg.sclass;
        skinObj.cssClassSelected = "x" + this._skinnableClass + "SelectedItem_" + this._cfg.sclass;
        skinObj.cssClassDisabled = "x" + this._skinnableClass + "DisabledItem_" + this._cfg.sclass;
        skinObj.cssClassMouseover = "x" + this._skinnableClass + "MouseOverItem_" + this._cfg.sclass;
        skinObj.cssClassFooter = "x" + this._skinnableClass + "Footer_" + this._cfg.sclass;
        var divCfg = ariaUtilsJson.copy(cfg, true, ["width", "minWidth", "maxWidth", "height", "minHeight",
                "maxHeight", "scrollBarX", "scrollBarY"]);
        divCfg.sclass = skinObj.divsclass;
        divCfg.margins = "0 0 0 0";

        this._initTemplate({
            moduleCtrl : {
                classpath : "aria.widgets.form.list.ListController",
                initArgs : {
                    // In the external interface of the widget, the item data and the selected state is separated.
                    // In the internal data model, items and selection status are merged so that each list item
                    // hold info if it's selected or not. The conversion is done in the ListController module
                    itemsInfo : {
                        items : cfg.items,
                        selectedValues : cfg.selectedValues,
                        selectedIndex : cfg.selectedIndex
                    },
                    dataModel : {
                        activateSort : cfg.activateSort,
                        multipleSelect : cfg.multipleSelect,
                        maxSelectedCount : cfg.maxOptions,
                        disabled : cfg.disabled,
                        displayOptions : cfg.displayOptions,
                        numberOfColumns : cfg.numberOfColumns,
                        numberOfRows : cfg.numberOfRows,
                        skin : skinObj,
                        cfg : divCfg,
                        preselect : cfg.preselect
                    }
                }
            }
        });
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @type String
         * @protected
         */
        _skinnableClass : "List",

        /**
         * Return true to cancel default action.
         * @param {Number} charCode Character code
         * @param {Number} keyCode Code of the button pressed
         */
        sendKey : function (charCode, keyCode) {
            var moduleCtrl = this._subTplModuleCtrl;
            var closeItem = this._getFirstEnabledItem();
            if (moduleCtrl) {
                var data = moduleCtrl.getData();
                if (!this.evalCallback(this._cfg.onkeyevent, {
                    charCode : charCode,
                    keyCode : keyCode,
                    focusIndex : data.focusIndex,
                    closeItem : closeItem
                })) {
                    return moduleCtrl.keyevent({
                        charCode : charCode,
                        keyCode : keyCode
                    });
                } else {
                    return true;
                }
            }
            return false;
        },

        /**
         * Within the list the first selectable item should get focus when first openend and also can close the list
         * when the up arrow is pressed. This method will return the id (in order that the items appear) and the value
         * corresponding to the first selectable item.
         * @return {Object} the id taken from the order that the items appear, and the value of the item.
         * @protected
         */
        _getFirstEnabledItem : function () {
            var items = this._subTplData.itemsView.items;
            for (var i = 0; i < items.length; i++) {
                if (!items[i].value.currentlyDisabled) {
                    return {
                        id : i,
                        value : items[i].value.value
                    };
                }
            }
        },

        /**
         * Called when any event happens in sub module (List Controller in this case)
         * @param {aria.DomEvent} evt Module event
         */
        _onModuleEvent : function (evt) {
            if (evt.name == "onChange") {
                this._retrieveControllerSelection();
                this.evalCallback(this._cfg.onchange, this._subTplModuleCtrl.getSelectedValues());
            } else if (evt.name == "itemClick") {
                this.evalCallback(this._cfg.onclick, {
                    value : evt.value,
                    index : evt.index
                });
            } else if (evt.name == "itemMouseOver") {
                this.evalCallback(this._cfg.onmouseover, {
                    value : evt.value,
                    index : evt.index
                });
            } else if (evt.name == "close") {
                this.evalCallback(this._cfg.onclose);
            }
        },

        /**
         * Callback executed after the template is loaded and initialized. It overrides the parent implementation in
         * order to retrieve some information about the initlally selected values
         * @param {Object} args Contains information about the load and instance of the template context
         * @protected
         */
        _tplLoadCallback : function (args) {
            this.$TemplateBasedWidget._tplLoadCallback.call(this, args);
            this._retrieveControllerSelection();
        },

        /**
         * Retrieve the selected indexes and values from the list controller and set them on the widget
         * @protected
         */
        _retrieveControllerSelection : function () {
            var moduleCtrl = this._subTplModuleCtrl;
            this.setProperty("selectedValues", moduleCtrl.getSelectedValues());
            this.setProperty("selectedIndex", moduleCtrl.getData().selectedIndex);
        },

        /**
         * DOM callback function called on key press
         */
        _dom_onkeypress : function (event) {
            if (this._subTplModuleCtrl) {
                if (!event.isSpecialKey && event.charCode != event.KC_SPACE) {
                    this.sendKey(event.charCode, event.keyCode);
                }
            }
        },

        /**
         * DOM callback function called on key down
         */
        _dom_onkeydown : function (event) {
            // event.cancelBubble = true;
            if (this._subTplModuleCtrl) {
                if (event.isSpecialKey) {
                    this.sendKey(event.charCode, event.keyCode);
                }
            }
            if (event.keyCode != event.KC_TAB) {
                event.preventDefault(); // Removing due to PTR:05164409
            }
            return false;
        },

        /**
         * DOM callback function called on focus
         */
        focus : function () {
            var data = this._subTplModuleCtrl.getData();
            var toFocus = data.itemsView.items[data.focusIndex].initIndex;
            if (data.items[toFocus].currentlyDisabled) {
                data.focusIndex = this._getFirstEnabledItem().id;
            }
            this._subTplModuleCtrl.setFocus();
        },

        /**
         * Called when json data that we have properties bound to are externally changed. In general we need to update
         * our internal data model and refresh the sub template if needed.
         * @param {String} key The property changed
         * @param {Object} newValue
         * @param {Object} oldValue
         */
        _onBoundPropertyChange : function (key, newValue, oldValue) {
            // If the template needs a refresh, refreshNeeded has to be set to true
            // by each of the updates below that needs a refresh
            var refreshNeeded = false;
            var moduleCtrl = this._subTplModuleCtrl;
            // var data = this._subTplCtxt.data;
            if (key == "selectedValues") {
                moduleCtrl.setSelectedValues(newValue);
            } else if (key == "selectedIndex") {
                moduleCtrl.setSelectedIndex(newValue);
            } else if (key == "disabled") {
                moduleCtrl.setDisabled(newValue);
                refreshNeeded = true;
            } else if (key == "maxOptions") {
                moduleCtrl.setMaxSelectedCount(newValue);
            } else if (key == "items") {
                moduleCtrl.setItems(newValue);
                refreshNeeded = true;
            } else if (key == "multipleSelect") {
                moduleCtrl.setMultipleSelect(newValue);
            }
            if (refreshNeeded) {
                // TODO: this should be replaced by an event sent from the module controller
                // (but this would not be backward-compatible with current list templates)
                this._subTplCtxt.$refresh();
            }
        },

        /**
         * Register listeners for the bindings associated to this widget
         * @protected
         */
        _registerSingleProperty : function (property) {
            var bindings = this._cfg.bind, bind = bindings[property];

            if (bindings && bind && bindings.hasOwnProperty(property) && property === "items") {
                var callback = {
                    fn : this._notifyDataChange,
                    scope : this,
                    args : property
                };
                try {
                    ariaUtilsJson.addListener(bind.inside, bind.to, callback, true, true);
                    this._bindingListeners[property] = {
                        inside : bind.inside,
                        to : bind.to,
                        transform : bind.transform,
                        cb : callback
                    };

                    var newValue = this._transform(bind.transform, bind.inside[bind.to], "toWidget");
                    this._cfg[property] = newValue;
                } catch (ex) {
                    this.$logError(this.INVALID_BEAN, [property, "bind"]);
                }
            } else {
                this.$TemplateBasedWidget._registerSingleProperty.apply(this, arguments);
            }
        },

        /**
         * Set property for this widget, and reflect change on itself, but not in the associated datamodel
         * @param {String} propertyName in the configuration
         * @param {Object} newValue to set
         */
        setWidgetProperty : function (propertyName, newValue) {
            if (!this._cfg) {
                return;
            }
            if (propertyName === "items" && this._cfg.bind.hasOwnProperty(propertyName)) {
                var oldValue = this.getProperty(propertyName);
                this._cfg[propertyName] = newValue;
                this._onBoundPropertyChange(propertyName, newValue, oldValue);
            } else {
                this.$TemplateBasedWidget.setWidgetProperty.apply(this, arguments);
            }
        }
    }
});
