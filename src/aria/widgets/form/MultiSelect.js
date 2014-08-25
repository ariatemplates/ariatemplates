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
var Aria = require("../../Aria");
var ariaWidgetsFormListList = require("./list/List");
var ariaWidgetsControllersMultiSelectController = require("../controllers/MultiSelectController");
var ariaDomEvent = require("../../DomEvent");
var ariaWidgetsFormMultiSelectStyle = require("./MultiSelectStyle.tpl.css");
var ariaWidgetsFormListListStyle = require("./list/ListStyle.tpl.css");
var ariaWidgetsContainerDivStyle = require("../container/DivStyle.tpl.css");
var ariaWidgetsFormCheckBoxStyle = require("./CheckBoxStyle.tpl.css");
var ariaWidgetsFormDropDownTextInput = require("./DropDownTextInput");


/**
 * Multi-select widget which is a list of checkboxes and labels passed in an array of predefined values
 * @extends aria.widgets.form.DropDownTextInput
 * @class aria.widgets.form.MultiSelect
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.MultiSelect",
    $extends : ariaWidgetsFormDropDownTextInput,
    $css : [ariaWidgetsFormMultiSelectStyle, ariaWidgetsFormListListStyle,
            ariaWidgetsContainerDivStyle, ariaWidgetsFormCheckBoxStyle],
    $constructor : function (cfg, ctxt, lineNumber) {
        var controller = new ariaWidgetsControllersMultiSelectController();

        // The following line was added for PTR 04557432: if the value in cfg is not set to [] as a default, then the
        // handle specified as the onchange configuration property will be executed also on the first click
        cfg.value = cfg.value || [];

        this.$DropDownTextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);

        // set control options
        controller.setListOptions(cfg.items);
        controller.setSeparator(cfg.fieldSeparator);
        controller.setMaxOptions(cfg.maxOptions);
        controller.setFieldDisplay(cfg.fieldDisplay);
        controller.setValueDisplay(cfg.valueDisplay);
        controller.checkError();

        /**
         * Whether to update the data model instantly when the user checks/unchecks the checkboxes, or only when the
         * dropdown list is closed
         * @protected
         * @type Boolean
         */
        this._instantBind = (cfg.instantBind === true);

        /**
         * Flag whether the drop down is open
         * @protected
         * @type Boolean
         */
        this._dropDownOpen = false;

        /**
         * Flag whether template of template based widget has been intialised
         * @public
         * @type String
         */
        this.refreshPopup = false;

        /**
         * Whether the list is focuses
         * @protected
         * @type String
         */
        this._listFocused = false;

        /**
         * List widget associated with the multiselect
         * @protected
         * @type aria.widgets.form.list.List
         */
        this._dropDownList = null;

    },
    $destructor : function () {
        this._dropDownOpen = null;
        this.refreshPopup = null;
        this._listFocused = null;
        this.$DropDownTextInput.$destructor.call(this);
        this._dropDownList = null;
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "MultiSelect",

        /**
         * Callback called when the user clicks on a checkbox (or its label) on a dropdown list.
         * @protected
         * @param {Array} newVals array of values that will be selected after the change
         */
        _clickOnItem : function (newVals) {
            // when clicking on an item in the dropdown list, close the dropdown and save the selected item
            var report = this.controller.checkValue(this.controller.getDataModel().value);
            var arg = {
                stopValueProp : !this._instantBind
            };
            this._reactToControllerReport(report, arg);
        },

        /**
         * Checks if the currently focused item has the power to close the popup.
         * @return {Boolean}
         */
        _checkCloseItem : function (evt) {
            return (evt.focusIndex === evt.closeItem.id) ? true : false;
        },

        /**
         * Handle key event not handled by the list, in this case arrow up to close the dropdown
         * @protected
         * @param {aria.DomEvent} evt Click event
         * @return {Boolean}
         */
        _keyPressed : function (evt) {
            if ((evt.keyCode == ariaDomEvent.KC_ARROW_UP) && this._checkCloseItem(evt)) {
                this.focus();
                this._toggleDropdown();
                return true;
            }
            return false;
        },

        /**
         * Internal method called when the popup should be either closed or opened depending on the state of the
         * controller and whether it is currently opened or closed. In any case, keep the focus on the field. Called by
         * the widget button for example.
         * @protected
         */
        _toggleDropdown : function () {
            if (!this._hasFocus) {
                this.focus();
            }

            var report = this.controller.toggleDropdown(this.getTextInputField().value, this._dropdownPopup != null);
            this._reactToControllerReport(report, {
                hasFocus : true
            });
        },

        /**
         * Internal function to render the content of the dropdown div
         * @param {aria.templates.MarkupWriter} out Markup writer which should receive the content of the popup.
         */
        _renderDropdownContent : function (out) {

            var cfg = this._cfg;

            var dm = this.controller.getDataModel();

            var list = new ariaWidgetsFormListList({
                defaultTemplate : cfg.listTemplate,
                block : true,
                sclass : cfg.listSclass || this._skinObj.listSclass,
                onchange : {
                    fn : this._clickOnItem,
                    scope : this
                },
                onkeyevent : {
                    fn : this._keyPressed,
                    scope : this

                },
                onclose : {
                    fn : this._toggleDropdown,
                    scope : this
                },
                minWidth : this._inputMarkupWidth + this._skinObj.offsetRight,
                width : (cfg.popupWidth > 0 && cfg.popupWidth > this._inputMarkupWidth) ? cfg.popupWidth : null,
                multipleSelect : true,
                maxHeight : 250,
                activateSort : cfg.activateSort,
                maxOptions : cfg.maxOptions,
                bind : {
                    items : {
                        to : "listContent",
                        inside : dm
                    },
                    selectedIndex : {
                        to : "selectedIdx",
                        inside : dm
                    },
                    selectedValues : {
                        to : "selectedValues",
                        inside : dm
                    }
                },
                numberOfColumns : cfg.numberOfColumns,
                numberOfRows : cfg.numberOfRows,
                displayOptions : cfg.displayOptions
            }, this._context, this._lineNumber);

            out.registerBehavior(list);
            list.writeMarkup(out);
            this.controller.setListWidget(list);
            list.$on({
                'widgetContentReady' : {
                    fn : this._refreshPopup,
                    scope : this,
                    args : {
                        list : list
                    }

                }
            });
            this._dropDownList = list;

        },

        /**
         * Called when the dropdown is closed
         * @protected
         */
        _afterDropdownClose : function () {
            this._setPopupOpenProperty(false);
            this.controller.setListWidget(null);
            // Check _toggleDropdown already triggered
            if (!this._hasFocus) {
                // Added to keep the behaviour similar to click on close button click PTR 04661445
                var report = this.controller.toggleDropdown(this.getTextInputField().value, this._dropdownPopup != null);
                // to reset the dropdown display
                report.displayDropDown = false;
                this._reactToControllerReport(report, {
                    hasFocus : false
                });
            }
            this.$DropDownTextInput._afterDropdownClose.call(this);
            this._dropDownOpen = false;
            this.refreshPopup = false;
            this._keepFocus = false;
        },

        /**
         * This method focuses the list if the dropdown is open and the popup has been refreshed This is necessary
         * because this can happen in either order
         * @protected
         * @param {aria.widgets.form.List} list
         */
        _focusMultiSelect : function (list) {

            if (this._dropDownOpen && this.refreshPopup) {
                list.focus();
            }

        },

        /**
         * Called after the popup has opened
         * @protected
         */
        _afterDropdownOpen : function () {
            this._setPopupOpenProperty(true);
            // when the popup is clicked, don't give it focus, allow focus to be passed to the List in _refreshPopup
            this._keepFocus = true;
            var list = this.controller.getListWidget();
            this._dropDownOpen = true;
            this._focusMultiSelect(list);
        },

        /**
         * This is called when the template content is displayed for a template based widget
         * @param {aria.DomEvent} evt Click event
         * @param {Object} args Arguments that are passed to this callback
         */
        _refreshPopup : function (evt, args) {

            if (this._dropdownPopup) {
                this.refreshPopup = true;
                this._dropdownPopup.refresh();
            }

            this._focusMultiSelect(args.list);

        },

        /**
         * Override $DropDownTextInput._reactToControllerReport
         * @protected
         * @param {aria.widgets.controllers.reports.DropDownControllerReport} report
         * @param {Object} arg Optional parameters
         */
        _reactToControllerReport : function (report, arg) {

            this.$DropDownTextInput._reactToControllerReport.call(this, report, arg);
        },

        /**
         * Called then the list is ready
         * @protected
         * @param {Object} args
         */
        _widgetContentReady : function (args) {
            // focus the list when popup is opened
            this._refreshPopup(args);
            this._dropDownList.focus();
        }
    }
});
