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
 * DropDownListTrait is a class to share code between dropdown widgets containing a list in their popup. The purpose of
 * this class is not to be created directly, but to allow its prototype to be imported.
 * @class aria.widgets.form.DropDownListTrait
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.form.DropDownListTrait',
    $dependencies : ['aria.widgets.form.list.List'],
    $constructor : function () {
        // The purpose of this class is to provide a prototype to be imported, not to be created directly.
        this.$assert(11, false);
    },
    $statics : {
        MAX_HEIGHT : 210,
        MIN_HEIGHT : 50
    },
    $prototype : {

        /**
         * Callback called when the user clicks on a date in the list.
         * @param {Object} evt object containing information about the clicked item in the list (value and index).
         * @protected
         */
        _clickOnItem : function (evt) {
            // when clicking on an item in the dropdown list, close the dropdown and save the selected item
            this._closeDropdown();
            var report = this.controller.checkValue(evt.value);
            this._reactToControllerReport(report);
        },

        /**
         * Handle key event on keydown or keypress.
         * @protected
         * @param {Object|aria.DomEvent} event object containing keyboard event information (at least charCode and
         * keyCode properties). This object may be or may not be an instance of aria.DomEvent.
         */
        _handleKey : function (event) {
            // In some browsers (Firefox and Chrome), scrolling content under the mouse raises mouse over events.
            // For smooth scrolling without the selection being always put back on the item under the mouse,
            // we disable the mouseOver handler during a short time delay:
            if (this._ignoreMouseOverItemCallback) {
                aria.core.Timer.cancelCallback(this._ignoreMouseOverItemCallback);
            }
            this._ignoreMouseOverItemCallback = aria.core.Timer.addCallback({
                fn : this._enableMouseOverItem,
                scope : this,
                delay : 100
            });
            var parent = this.$DropDownTextInput || this.$DropDownInput;
            parent._handleKey.call(this, event);
        },

        /**
         * Restore mouseOver handling after it has been disabled by typing a key. Should be called only as a Timer
         * callback.
         * @protected
         */
        _enableMouseOverItem : function () {
            this._ignoreMouseOverItemCallback = null;
        },

        /**
         * Callback called when the user moves the mouse on an item in the list. It changes the current selection
         * according to the mouse position.
         * @param {Object} evt object containing information about the item on which the mouse was moved (value and
         * index).
         * @protected
         */
        _mouseOverItem : function (evt) {
            if (!this._ignoreMouseOverItemCallback) {
                var dm = this.controller.getDataModel();
                aria.utils.Json.setValue(dm, "selectedIdx", evt.index);
            }
        },

        /**
         * @param {Object} evt object containing keyboard event information (charCode and keyCode). This is not an
         * aria.DomEvent object.
         * @return {Boolean}
         * @protected
         */
        _keyPressed : function (evt) {
            // restore the focus on the right item if it does not have the focus,
            // and propagate the key
            if (!this._hasFocus) {
                this.focus();
                this._handleKey({
                    charCode : evt.charCode,
                    keyCode : evt.keyCode
                });
                return true; // stop default action
            }
            return false;
        },

        /**
         * Internal function to render the content of the dropdown div
         * @param {aria.templates.MarkupWriter} out Markup writer which should receive the content of the popup.
         * @param {Object} arg Optional parameters
         * @protected
         */
        _renderDropdownContent : function (out, options) {
            options = options || {};
            var cfg = this._cfg;
            var dm = this.controller.getDataModel();
            var element = this._domElt.lastChild;
            var domUtil = aria.utils.Dom;
            var geometry = domUtil.getGeometry(element);
            if (geometry === null) {
                return;
            }

            domUtil.scrollIntoView(element);
            var top = geometry.y;
            var viewPort = aria.utils.Dom._getViewportSize();
            var bottom = viewPort.height - top - geometry.height;
            var maxHeight = (top > bottom) ? top : bottom;
            maxHeight = (maxHeight < this.MIN_HEIGHT) ? this.MIN_HEIGHT : maxHeight;
            maxHeight = (maxHeight > this.MAX_HEIGHT) ? this.MAX_HEIGHT : maxHeight - 2;
            var list = new aria.widgets.form.list.List({
                defaultTemplate : "defaultTemplate" in options ? options.defaultTemplate : cfg.listTemplate,
                block : true,
                sclass : "dropdown",
                onclick : {
                    fn : this._clickOnItem,
                    scope : this
                },
                onmouseover : {
                    fn : this._mouseOverItem,
                    scope : this
                },
                onkeyevent : {
                    fn : this._keyPressed,
                    scope : this
                },
                onclose : {
                    fn : this._closeDropdown,
                    scope : this
                },
                maxHeight : maxHeight,
                minWidth : "minWidth" in options ? options.minWidth : this._inputMarkupWidth + 15,
                width : this.__computeListWidth(cfg.popupWidth, this._inputMarkupWidth + 15),
                preselect : cfg.preselect,
                bind : {
                    items : {
                        to : "listContent",
                        inside : dm
                    },
                    selectedIndex : {
                        to : "selectedIdx",
                        inside : dm
                    }
                },
                scrollBarX : false
            }, this._context, this._lineNumber);
            list.$on({
                'widgetContentReady' : this._refreshPopup,
                scope : this
            });
            out.registerBehavior(list);
            list.writeMarkup(out);
            this.controller.setListWidget(list);
        },

        /**
         * Called after the dropdown is closed.
         * @protected
         */
        _afterDropdownClose : function () {
            this.controller.setListWidget(null);
            this.$DropDownTrait._afterDropdownClose.call(this);
        },

        /**
         * Compute the width that is passed as parameter to the List widget. If there is a fixed popupWidth, the
         * returned value is the maximum between this value and the input markup width.
         * @param {Number} popupWidth Popup width
         * @param {Number} inputMarkupWidth Text input width
         * @return {Number} List width
         */
        __computeListWidth : function (popupWidth, inputMarkupWidth) {
            if (popupWidth < 0) {
                // No width specified, let the widget decide
                return null;
            }

            return (popupWidth > inputMarkupWidth) ? popupWidth : inputMarkupWidth;
        }
    }
});