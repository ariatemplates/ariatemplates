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
 * MultiAutoComplete widget
 */
Aria.classDefinition({
    $classpath : "aria.widgets.form.MultiAutoComplete",
    $extends : "aria.widgets.form.AutoComplete",
    $dependencies : ["aria.widgets.controllers.MultiAutoCompleteController", "aria.utils.Event", "aria.utils.Dom",
            "aria.utils.Type", "aria.utils.Array", "aria.utils.Math", "aria.utils.String", "aria.utils.Caret"],
    $css : ["aria.widgets.form.MultiAutoCompleteStyle", "aria.widgets.form.list.ListStyle",
            "aria.widgets.container.DivStyle"],
    /**
     * MultiAutoComplete constructor
     * @param {aria.widgets.CfgBeans:MultiAutoCompleteCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     * @param {Number} controller the data controller object
     */
    $constructor : function (cfg, ctxt, lineNumber, controllerInstance) {
        var controller = controllerInstance || new aria.widgets.controllers.MultiAutoCompleteController();

        this.$AutoComplete.constructor.call(this, cfg, ctxt, lineNumber, controller);
        if (!cfg.expandButton) {
            this._hideIconNames = ["dropdown"];
        }
        controller.maxOptions = cfg.maxOptions;
    },

    $statics : {
        // ERROR MESSAGE:
        WIDGET_MULTIAUTOCOMPLETE_INVALID_HANDLER : "%1Could not create resources handler %2: dependency on this handler is missing.",
        INDEX_OUT_OF_BOUNDS : '%1Given index to highlight option is out of bounds [1, %2]: %3'
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "MultiAutoComplete",
        /**
         * Override to initialize a widget (e.g. to listen to DOM events)
         * @param {HTMLElement} elt the Input markup DOM elt - never null
         */
        _initInputMarkup : function () {
            this.$AutoComplete._initInputMarkup.apply(this, arguments);
            this._textInputField = this._frame.getChild(0).lastChild;
        },
        /**
         * Override internal method not to update the input width in case of multi autocomplete
         */
        _computeInputWidth : function () {
            return;
        },
        /**
         * Internal method to process the input block markup inside the frame
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _inputWithFrameMarkup : function (out) {
            out.write('<div class="xMultiAutoComplete_list">');
            this.$AutoComplete._inputWithFrameMarkup.call(this, out);
            out.write('</div>');
        },
        /**
         * Override $DropDownTextInput._reactToControllerReport
         * @protected
         * @param {aria.widgets.controllers.reports.DropDownControllerReport} report
         * @param {Object} arg Optional parameters
         */
        _reactToControllerReport : function (report, arg) {
            if (report && report.ok === false) {
                report.errorValue = this.controller.selectedSuggestions;
            }
            this.$AutoComplete._reactToControllerReport.call(this, report, arg);
            if (report) {
                this._updateMultiselectValues(report);
            }
        },

        /**
         * Internal function to render the content of the dropdown div
         * @protected
         * @param {aria.templates.MarkupWriter} out Markup writer which should receive the content of the popup.
         * @param {Object} arg Optional parameters
         */
        _renderDropdownContent : function (out, options) {
            options = options || {};
            var cfg = this._cfg;
            var controller = this.controller;
            var dm = controller.getDataModel();
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
            var referenceMaxHeight = options.maxHeight || this.MAX_HEIGHT;
            maxHeight = (maxHeight < this.MIN_HEIGHT) ? this.MIN_HEIGHT : maxHeight;
            maxHeight = (maxHeight > referenceMaxHeight) ? referenceMaxHeight : maxHeight - 2;
            var listObj = {
                id : cfg.id,
                defaultTemplate : "defaultTemplate" in options ? options.defaultTemplate : cfg.listTemplate,
                block : true,
                sclass : cfg.listSclass || this._skinObj.listSclass,
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
                    },
                    selectedValues : {
                        to : "selectedValues",
                        inside : dm
                    },
                    multipleSelect : {
                        to : "multipleSelect",
                        inside : dm
                    }
                },
                scrollBarX : false
            };
            if (controller._isExpanded) {
                listObj.defaultTemplate = controller.getExpandoTemplate();
                listObj.maxOptions = (this.controller.maxOptions) ? this.__returnMaxCount() : null;
                listObj.onchange = {
                    fn : this._changeOnItem,
                    scope : this
                };
            } else {
                listObj.onclick = {
                    fn : this._clickOnItem,
                    scope : this
                };
            }
            var list = new aria.widgets.form.list.List(listObj, this._context, this._lineNumber);
            list.$on({
                'widgetContentReady' : this._refreshPopup,
                scope : this
            });
            out.registerBehavior(list);
            list.writeMarkup(out);
            this.controller.setListWidget(list);
        },

        /**
         * Internal method to handle the click event to remove suggestion. This event is used to set focus on input
         * field
         * @param {aria.DomEvent} event Event object
         * @protected
         */
        _dom_onclick : function (event) {
            this.$AutoComplete._dom_onclick.call(this, event);
            var element = event.target;
            if (element.className === "closeBtn") {
                this._removeMultiselectValue(element, event);
                this._textInputField.focus();
            }
            if (element.className.indexOf("xMultiAutoComplete_Option_Text") != -1) {
                var highlightedSuggestions = this.getHighlight();
                var index = this._getIndexFromNode(element.parentNode);
                if (this.controller.freeText && aria.utils.Json.equals(highlightedSuggestions, [index])) {
                    this._editMultiselectValue(element);
                } else {
                    this.highlightOption(index);
                }
            }
            this.__resizeInput();
        },
        /**
         * Internal method to get the index of suggestion from suggestions container
         * @protected
         * @return {Integer} 1-based index
         */
        _getIndexFromNode : function (htmlElement) {
            var i = 1;
            while ((htmlElement = htmlElement.previousSibling) != null) {
                i++;
            }
            return i;
        },
        /**
         * Private method to increase the textInput width on focus
         * @private
         */
        __resizeInput : function () {
            var skinObj = this._skinObj, frame = this._frame, obj = this._textInputField;
            if (obj) {
                var frameWidth = frame.innerWidth - skinObj.innerPaddingLeft - skinObj.innerPaddingRight, inputWidth = obj.offsetLeft;
                obj.style.width = (frameWidth - inputWidth - 4) + "px";// tolerance of 1 character
            }

        },
        /**
         * Initialization method called by the delegate engine when the DOM is loaded
         */
        initWidget : function () {
            this.$AutoComplete.initWidget.call(this);
            var cfg = this._cfg;
            if (cfg.value) {
                var report = this.controller.checkValue(cfg.value);
                this._reactToControllerReport(report);
            }
        },
        /**
         * Add the selected suggestion(s) to widget
         * @protected
         * @param {aria.widgets.form.MultiAutoComplete} ref
         * @param {aria.widgets.controllers.reports.DropDownControllerReport} report
         */

        _updateMultiselectValues : function (report) {
            var inputField = this._textInputField;
            var inputFieldParent = inputField.parentNode;
            if (report.clearSuggestions) {
                this._makeInputFieldLastChild();
                while (inputFieldParent.firstChild != inputField) {
                    inputFieldParent.removeChild(inputFieldParent.firstChild);
                }
            }
            var suggestionsToAdd = report.suggestionsToAdd;
            if (suggestionsToAdd && suggestionsToAdd.length > 0) {
                var suggestionsMarkup = [];
                for (var i = 0, l = suggestionsToAdd.length; i < l; i++) {
                    suggestionsMarkup.push(this._generateSuggestionMarkup(suggestionsToAdd[i]));
                }
                aria.utils.Dom.insertAdjacentHTML(inputField, "beforeBegin", suggestionsMarkup.join(""));
                this.__createEllipsis(inputField);
                this._makeInputFieldLastChild();
                inputField.style.width = "0px";
                this.__resizeInput();
            }
        },
        /**
         * Generate markup for selected suggestion
         * @param {String} report
         * @param {aria.widgets.form.MultiAutoComplete} ref
         * @return {String}
         */
        _generateSuggestionMarkup : function (value) {
            var cfg = this._cfg;
            var label = aria.utils.String.escapeHTML(value.label || value);
            return '<div class="xMultiAutoComplete_' + cfg.sclass
                    + '_options"><span class="xMultiAutoComplete_Option_Text">' + label
                    + '</span><span class="closeBtn"></span></div>';
        },
        /**
         * Method to create ellipsis for an added Suggestion
         * @param {HTMLElement} input textInputField
         * @private
         */
        __createEllipsis : function (input) {
            var ellipsisContainer = input.previousSibling, elementoffsetWidth = ellipsisContainer.offsetWidth, frameWidth = this._frame.innerWidth;
            // 10 is to consider margin and padding
            if (elementoffsetWidth >= (frameWidth - 10)) {
                ellipsisContainer.firstChild.className += " ellipsisClass";
                var elementWidth = frameWidth - ellipsisContainer.offsetLeft
                        - (ellipsisContainer.firstChild.offsetLeft + ellipsisContainer.lastChild.offsetWidth) * 2;
                ellipsisContainer.firstChild.style.maxWidth = elementWidth + "px";
            }

        },
        /**
         * Handling double click event for editing suggestion
         * @param {aria.utils.Event} event
         * @protected
         */
        _dom_ondblclick : function (event) {
            if (event.type == "dblclick" && this.controller.freeText) {
                var element = event.target;
                if (element.className.indexOf("xMultiAutoComplete_Option_Text") != -1) {
                    this._editMultiselectValue(element, event);
                }
            }
        },

        /**
         * Handling blur event
         * @param {aria.utils.Event} event
         * @protected
         */
        _dom_onblur : function (event) {
            var inputField = this.getTextInputField();
            var blurredElement = event.target;

            if (blurredElement === inputField) {
                if (inputField.nextSibling != null && inputField.value === "") {
                    this._makeInputFieldLastChild();
                }
            } else if (blurredElement.parentNode.className.indexOf("highlight") != -1) {
                this.unhighlightOption(blurredElement.parentNode);
            }

            this.$TextInput._dom_onblur.call(this, event);
        },
        /**
         * Make the inputfield as last child of widget
         * @protected
         */
        _makeInputFieldLastChild : function () {
            var inputField = this._textInputField;
            var inputFieldParent = inputField.parentNode;
            if (inputFieldParent.lastChild !== inputField) {
                inputFieldParent.removeChild(inputField);
                inputFieldParent.appendChild(inputField);
                inputField.style.width = "0px";
                this.__resizeInput();
            }
        },
        /**
         * Handling keydow event for enter, backspace
         * @param {aria.utils.Event} event
         * @protected
         */
        _dom_onkeydown : function (event) {
            var domUtil = aria.utils.Dom;

            var inputField = this.getTextInputField();
            var inputFieldValue = inputField.value;
            var inputFieldIsEmpty = (aria.utils.String.trim(inputFieldValue) === "");

            switch (event.keyCode) {

                case event.KC_ARROW_LEFT :
                    if (this.hasInsertedOptions()) {

                        if (this.isInputFieldFocused()) {
                            var position = aria.utils.Caret.getPosition(inputField);
                            if (position.start === 0 && position.end === 0) {
                                event.preventDefault();

                                // Close the dropdown in order not to mess with focus events and so on
                                this._closeDropdown();

                                // Highlight last option
                                this.highlightOption(this.insertedOptionsCount());
                                break;
                            }
                        }

                        if (this.isInHighlightedMode()) {
                            event.preventDefault();

                            this.__navigateLeftInHighlightedMode();
                            break;
                        }
                    }

                    break;

                case event.KC_ARROW_RIGHT :
                    if (this.isInHighlightedMode()) {
                        event.preventDefault();

                        this.__navigateRightInHighlightedMode();
                    }

                    break;

                case event.KC_TAB :
                    if (this.isInputFieldFocused()) {
                        if (!inputFieldIsEmpty) {
                            if (this.controller.freeText) {
                                event.preventDefault();

                                var report = this.controller.checkText(inputFieldValue, false);
                                this._reactToControllerReport(report);
                                this.setHelpText(false);
                                inputField.focus();
                            }
                        } else {
                            if (inputField.nextSibling != null) {
                                event.preventDefault();

                                this._makeInputFieldLastChild();
                                this.setHelpText(false);
                                inputField.focus();
                            }
                        }
                    }

                    break;

                case event.KC_BACKSPACE :
                    if (inputFieldIsEmpty) {
                        var highlightedElementIndex = this.getHighlightedOptionIndex();
                        var highlightedElement = this.getHighlightedOption();

                        if (highlightedElement) {
                            var highlightedElementLabel = highlightedElement.textContent
                                    || highlightedElement.innerText;
                            domUtil.removeElement(highlightedElement);

                            var newIndex = highlightedElementIndex - 1;
                            if (newIndex >= 1) {
                                this.highlightOption(newIndex);
                            } else {
                                if (this.insertedOptionsCount() > 0) {
                                    this.highlightOption(1);
                                } else {
                                    this._enterInputField();
                                }
                            }

                            this._removeValue(highlightedElementLabel);
                        } else {
                            var previousSiblingElement = domUtil.getPreviousSiblingElement(inputField);
                            if (previousSiblingElement) {
                                var previousSiblingLabel = previousSiblingElement.firstChild.textContent
                                        || previousSiblingElement.firstChild.innerText;
                                domUtil.removeElement(previousSiblingElement);
                                this._removeValue(previousSiblingLabel);
                            }
                        }
                        event.preventDefault();
                    }

                    break;

                case event.KC_DELETE :
                    if (inputFieldIsEmpty) {
                        var highlightedElementIndex = this.getHighlightedOptionIndex();
                        var highlightedElement = this.getHighlightedOption();

                        if (highlightedElement) {
                            var highlightedElementLabel = highlightedElement.textContent
                                    || highlightedElement.innerText;
                            domUtil.removeElement(highlightedElement);

                            if (highlightedElementIndex <= this.insertedOptionsCount()) {
                                this.highlightOption(highlightedElementIndex);
                            } else {
                                this._enterInputField();
                            }

                            this._removeValue(highlightedElementLabel);
                        }
                    }

                    break;
            }

            if (this.isInputFieldFocused()) {
                this.$AutoComplete._dom_onkeydown.call(this, event);
            }
        },
        _dom_onkeypress : function (event) {
            if (this.isInputFieldFocused()) {
                this.$AutoComplete._dom_onkeypress.call(this, event);
            }
        },
        /**
         * To remove suggestion on click of close
         * @protected
         * @param {aria.utils.HTML} domElement
         * @param {aria.widgets.form.MultiAutoComplete} ref
         * @param {aria.utils.Event} event
         * @param {Boolean} if current element is a parent element itself
         */
        _removeMultiselectValue : function (domElement, event, isParent) {
            var parent = (!isParent) ? domElement.parentNode : domElement;
            var domUtil = aria.utils.Dom;
            var label = parent.firstChild.textContent || parent.firstChild.innerText;
            domUtil.removeElement(parent);
            this._removeValue(label);
            if (event && event.type == "click") {
                this.getTextInputField().focus();

            }

        },
        /**
         * To edit suggestion on doubleclick
         * @param {aria.utils.HTML} domElement
         * @param {aria.utils.Event} event
         * @protected
         */
        _editMultiselectValue : function (domElement, event) {
            var label;
            var domUtil = aria.utils.Dom;
            label = domElement.textContent || domElement.innerText;
            domUtil.replaceDomElement(domElement.parentNode, this._textInputField);
            var removedSuggestionInfo = this._removeValue(label);
            var removedSuggestion = removedSuggestionInfo.removedSuggestion;
            var removedSuggestionIndex = removedSuggestionInfo.removedSuggestionIndex;
            this._keepFocus = true;
            this._textInputField.focus();
            if (removedSuggestion) {
                var report = this.controller.editValue(removedSuggestion, removedSuggestionIndex);
                this._reactToControllerReport(report);
            }
            this._restoreKeepFocus();
        },

        /**
         * Sets _keepFocus back to false. This is done asynchronously on IE (because the focus event is raised
         * asynchronously on IE).
         */
        _restoreKeepFocus : aria.core.Browser.isIE ? function () {
            var self = this;
            // The focus is asynchronous on IE, so we need to set _keepFocus back to false
            // only after the _dom_onfocus method was called
            self._keepFocus = true;
            setTimeout(function () {
                self._keepFocus = false;
            }, 1);
        } : function () {
            this._keepFocus = false;
        },

        /**
         * To remove the label from widget
         * @param {String} label
         * @return {String|Object} the item removed from the controller.selectedValues array.
         * @protected
         */
        _removeValue : function (label) {
            var report = this.controller.removeValue(label);
            var removedSuggestion = report.removedSuggestion;
            var removedSuggestionIndex = report.removedSuggestionIndex;
            this._reactToControllerReport(report);
            this._textInputField.style.width = "0px";
            this.__resizeInput();
            return {
                removedSuggestion : removedSuggestion,
                removedSuggestionIndex : removedSuggestionIndex
            };
        },
        /**
         * Method used to get a dom reference for positioning the popup
         */
        getValidationPopupReference : function () {
            return this.getTextInputField();
        },

        // Highlighting management ---------------------------------------------

        /**
         * To remove the highlight class from the suggestion(s)
         * @param {Array|Integer} indices It can be an array of indices of suggestions or an index of suggestion. If
         * nothing is provided it will remove the highlight class from all the highlighted suggestions. Indexing starts
         * with 1.
         * @public
         */
        removeHighlight : function (indices) {
            if (indices == null) {
                indices = this.getHighlight();
            } else if (!aria.utils.Type.isArray(indices)) {
                indices = [indices];
            }

            var suggestionContainer = this._getSuggestionsContainer();
            for (var k = 0; k < indices.length; k++) {
                var suggestionNode = suggestionContainer.children[indices[k] - 1];
                if (suggestionNode) {
                    this.unhighlightOption(suggestionNode);
                }
            }
        },
        /**
         * To remove class from DomElement
         * @param {HTMLElement} suggestionNode
         * @param {String} className
         * @protected
         */
        _removeClass : function (suggestionNode, className) {
            var suggestionNodeClassList = new aria.utils.ClassList(suggestionNode);
            suggestionNodeClassList.remove(className);
            suggestionNodeClassList.$dispose();
        },

        /**
         * Removes the highlighted state from the given option.
         * @param[in] {HTMLElement} suggestionNode The HTML element corresponding to the highlighted option
         */
        unhighlightOption : function (suggestionNode) {
            if (suggestionNode == null) {
                suggestionNode = Aria.$window.document.activeElement;
                if (suggestionNode.className.indexOf("highlight") === -1) {
                    suggestionNode = this._getSuggestionsContainer().children[this.getHighlightedOptionIndex() - 1];
                }
                // TODO Get currently focused element and check this is an highlighted option...
            }

            if (suggestionNode != null) {
                this._removeClass(suggestionNode, 'highlight');
                suggestionNode.firstChild.removeAttribute('tabindex');
            }
        },

        /**
         * Retrieves the DOM element containing the inserted options
         * @return {DOMElement} The DOM element containing the inserted options.
         */
        _getSuggestionsContainer : function () {
            return this.getTextInputField().parentNode;
        },

        /**
         * To add the highlight class for the suggestion(s)
         * @param {Array|Integer} indices It can be an array of indices of suggestions or an index of suggestion to be
         * highlighted. Indexing starts with 1.
         * @public
         */
        addHighlight : function (indices) {
            if (!aria.utils.Type.isArray(indices)) {
                indices = [indices];
            }

            var suggestionsContainer = this._getSuggestionsContainer();
            var latestSuggestionNode;
            for (var k = 0; k < indices.length; k++) {
                var suggestionNode = suggestionsContainer.children[indices[k] - 1];
                if (suggestionNode) {
                    latestSuggestionNode = suggestionNode;
                    this._addClass(suggestionNode, 'highlight');
                }
            }

            if (latestSuggestionNode != null) {
                latestSuggestionNode.firstChild.setAttribute('tabindex', 0);
                latestSuggestionNode.firstChild.focus();
            }
        },

        /**
         * To add class for DomElement
         * @param {HTMLElement} suggestionNode
         * @param {String} className
         * @protected
         */
        _addClass : function (suggestionNode, className) {
            var suggestionNodeClassList = new aria.utils.ClassList(suggestionNode);
            suggestionNodeClassList.add(className);
            suggestionNodeClassList.$dispose();
        },

        /**
         * Exclusively highlights the inserted option located at the given index. That means that any other highlighted
         * option will not be highlighted anymore, and this even if the targeted option is already highlighted.
         * @param[in] {Number} index Index of the option to highlight. 1-based.
         * @see removeHighlight
         * @see addHighlight
         */
        highlightOption : function (index) {
            var count = this.insertedOptionsCount();

            if (index < 1 || index > count) {
                this.$logError(this.INDEX_OUT_OF_BOUNDS, [count, index]);
                return;
            }

            this.removeHighlight();

            var suggestionNode = this._getSuggestionsContainer().children[index - 1];

            this._addClass(suggestionNode, 'highlight');
            suggestionNode.firstChild.setAttribute('tabindex', 0);
            suggestionNode.firstChild.focus();
        },

        /**
         * Returns an array of indices of suggestions which have highlight class. Indexing starts with 1
         * @public
         * @return {Array}
         */
        getHighlight : function () {
            var suggestionContainer = this._textInputField.parentNode;
            var highlightedArray = [];
            for (var i = 0; i < suggestionContainer.children.length - 1; i++) {
                var suggestionNode = suggestionContainer.children[i];
                var suggestionNodeClassList = new aria.utils.ClassList(suggestionNode);
                if (suggestionNodeClassList.contains("highlight")) {
                    highlightedArray.push(i + 1);
                }
                suggestionNodeClassList.$dispose();
            }
            return highlightedArray;
        },

        /**
         * @return The currently highlighted option index (considering there is only one), or null otherwise
         */
        getHighlightedOptionIndex : function () {
            return this.getHighlight()[0];
        },

        getHighlightedOption : function () {
            return this._getSuggestionsContainer().children[this.getHighlightedOptionIndex() - 1];
        },

        /**
         * Tells whether the widget is currently in highlighted mode or not. Being in highlighted mode means that there
         * is at least one inserted option which is highlighted.
         * @return {Boolean} <code>true</code> if it is in highlighted mode, <code>false</code> otherwise.
         * @see getHighlight
         */
        isInHighlightedMode : function () {
            return this.getHighlight().length > 0;
        },

        /**
         * Internal method for calculating the maxOptions allowed for setting it in template
         * @return {Number}
         */
        __returnMaxCount : function () {
            var maxCount = 0, suggestion = this.controller.selectedSuggestions;
            if (suggestion.length < this.controller.maxOptions) {
                return this.controller.maxOptions;
            } else {
                for (var i = 0, len = suggestion.length; i < len; i++) {
                    if (aria.utils.Type.isObject(suggestion[i])) {
                        maxCount++;
                    }
                }
                return maxCount;
            }
        },
        /**
         * Callback called when the user clicks on a checkbox (or its label) on a dropdown list or
         * selectAll/deselectAll.
         * @protected
         * @param {Array} newVals array of values that will be selected after the change
         */
        _changeOnItem : function (values) {
            var report = this.controller.checkExpandedValues(values);
            this._reactToControllerReport(report);
        },

        // Input field management ----------------------------------------------

        /**
         * Tells whether the text input field has focus or not.
         * @return {Boolean} <code>true</code> if input field has focus, <code>false</code> otherwise.
         */
        isInputFieldFocused : function () {
            return Aria.$window.document.activeElement === this.getTextInputField();
        },

        /**
         * Enters the text input field by giving it the focus and placing the caret at its beginning.
         */
        _enterInputField : function () {
            var field = this.getTextInputField();
            field.focus();
            aria.utils.Caret.setPosition(field, 0, 0);
        },

        // Inserted options management -----------------------------------------

        /**
         * Gives the number of currently inserted options.
         * @return {Number} The number of inserted options.
         */
        insertedOptionsCount : function () {
            var count = this._getSuggestionsContainer().children.length - 1;

            if (count < 0) {
                count = 0;
            }

            return count;
        },

        /**
         * Tells whether there are some options inserted or not.
         * @return {Boolean} <code>true</code> if there are some, <code>false</code> otherwise.
         * @see insertedOptionsCount
         */
        hasInsertedOptions : function () {
            return this.insertedOptionsCount() > 0;
        },

        // Navigation ----------------------------------------------------------

        /**
         * Performs left navigation when the widget is in highlighted mode. What it means is that it highlights the
         * previous inserted option if there is one (otherwise does nothing).
         */
        __navigateLeftInHighlightedMode : function () {
            var indexes = this.getHighlight();
            var leftMostIndex = indexes[0];

            var index = leftMostIndex - 1;

            if (index >= 1) {
                this.highlightOption(index);
            }

        },

        /**
         * Performs right navigation when the widget is in highlighted mode. What it means is that it highlights the
         * next inserted option if there is one, otherwise it goes back to the text input field at its beginning.
         */
        __navigateRightInHighlightedMode : function () {
            var indexes = this.getHighlight();
            var rightMostIndex = indexes[indexes.length - 1];
            var limit = this.insertedOptionsCount();

            var index = rightMostIndex + 1;

            if (index <= limit) {
                this.highlightOption(index);
            } else {
                this.removeHighlight();
                this._enterInputField();
            }
        }
    }
});
