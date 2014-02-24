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
            "aria.utils.Type", "aria.utils.Array", "aria.utils.Math", "aria.utils.String"],
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

        this._hideIconNames = ["dropdown"];
        controller.maxOptions = cfg.maxOptions;
    },

    $statics : {
        // ERROR MESSAGE:
        WIDGET_MULTIAUTOCOMPLETE_INVALID_HANDLER : "%1Could not create resources handler %2: dependency on this handler is missing."
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
         * Override internal method not to update the input width incase of multi autocomplete
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
            this.$AutoComplete._reactToControllerReport.call(this, report, arg);
            if (report && report.value !== null) {
                this._addMultiselectValues(report, arg);
            }
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
                this._removeMultiselectValues(element, event);
            }
            this.__resizeInput();
            this._textInputField.focus();
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
            var cfg = this._cfg, initWidget = true;
            if (cfg.value) {
                var report = this.controller.checkValue(cfg.value, initWidget);
                this._reactToControllerReport(report);
            }
        },
        /**
         * Add the selected suggestion(s) to widget
         * @protected
         * @param {aria.widgets.form.MultiAutoComplete} ref
         * @param {aria.widgets.controllers.reports.DropDownControllerReport} report
         * @param {Object} arg Optional parameters
         */

        _addMultiselectValues : function (report, arg) {
            var controller = this.controller, suggestionToBeAdded = report.suggestionsToAdd;
            var isValid;
            var typeUtil = aria.utils.Type;
            var domUtil = aria.utils.Dom;
            if (controller.editMode) {
                isValid = typeUtil.isString(suggestionToBeAdded);
            } else {
                isValid = typeUtil.isArray(suggestionToBeAdded) || typeUtil.isObject(suggestionToBeAdded);
            }

            if (controller.freeText && suggestionToBeAdded) {
                isValid = true;
            }
            if (controller.maxOptions && controller.selectedSuggestions.length == controller.maxOptions) {
                this._textInputField.value = "";
            }
            if (isValid && suggestionToBeAdded && !this._dropdownPopup) {
                var suggestionsMarkup = "";
                if (typeUtil.isArray(suggestionToBeAdded)) {
                    var maxOptionsLength = (controller.maxOptions)
                            ? aria.utils.Math.min((controller.maxOptions - controller.selectedSuggestions.length), suggestionToBeAdded.length)
                            : suggestionToBeAdded.length;
                    for (var i = 0; i < maxOptionsLength; i++) {
                        suggestionsMarkup += this._generateSuggestionMarkup(suggestionToBeAdded[i], this);
                    }
                } else {
                    var lessThanMaxOptions = controller.maxOptions
                            ? controller.maxOptions > controller.selectedSuggestions.length
                            : true;
                    if (lessThanMaxOptions) {
                        suggestionsMarkup = this._generateSuggestionMarkup(suggestionToBeAdded);
                    }
                }
                domUtil.insertAdjacentHTML(this._textInputField, "beforeBegin", suggestionsMarkup);
                this.__createEllipsis(this._textInputField);
                this._textInputField.value = "";
                this._makeInputFieldLastChild();
                if (controller.editMode) {
                    controller.editMode = false;
                }
                this._textInputField.style.width = "0px";
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
            var suggestionMarkup, checkExistingValue = false, cfg = this._cfg;
            var label = aria.utils.String.escapeHTML(value.label || value);
            for (var k = 0; k < this.controller.selectedSuggestions.length; k++) {
                if (this.controller.selectedSuggestions[k].label == value) {
                    checkExistingValue = true;
                    break;
                }
            }
            if (!checkExistingValue) {
                this.controller.selectedSuggestions.push(value);
                this.controller.selectedSuggestionsLabelsArray.push(label);
            }
            suggestionMarkup = "<div class='xMultiAutoComplete_" + cfg.sclass + "_options' "
                    + "><span class='xMultiAutoComplete_Option_Text' >" + label
                    + "</span><a href='javascript:void(0);' class='closeBtn'></a></div>";
            return suggestionMarkup;
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
            if (inputField.nextSibling != null && inputField.value === "") {
                this._makeInputFieldLastChild();
            }
            this.$TextInput._dom_onblur.call(this, event);
        },
        /**
         * Make the inputfield as last child of widget
         * @protected
         */
        _makeInputFieldLastChild : function () {
            var domUtil = aria.utils.Dom;
            if (this._frame.getChild(0).lastChild !== this._textInputField) {
                domUtil.insertAdjacentHTML(this._frame.getChild(0).lastChild, "afterEnd", "<span></span>");
                domUtil.replaceDomElement(this._frame.getChild(0).lastChild, this._textInputField);
                this._textInputField.style.width = "0px";
                this.__resizeInput();
            }
        },
        /**
         * Handling keydow event for enter, backspace
         * @param {aria.utils.Event} event
         * @protected
         */
        _dom_onkeydown : function (event) {
            var backspacePressed = (event.keyCode == event.KC_BACKSPACE);
            var tabPressed = (event.keyCode == event.KC_TAB);
            var inputField = this.getTextInputField();
            var inputFieldValue = inputField.value;
            var domUtil = aria.utils.Dom;
            var stringUtil = aria.utils.String;
            if (tabPressed && stringUtil.trim(inputFieldValue) !== "" && this.controller.freeText) {
                event.preventDefault();
                var report = this.controller.checkText(inputFieldValue, false);
                this._reactToControllerReport(report);
                this.setHelpText(false);
                inputField.focus();
            }
            if (tabPressed && stringUtil.trim(inputFieldValue) === "" && inputField.nextSibling != null) {
                event.preventDefault();
                this._makeInputFieldLastChild();
                this.setHelpText(false);
                inputField.focus();
                var newSuggestions = aria.utils.Json.copy(this.controller.selectedSuggestions);
                this.setProperty("value", newSuggestions);

            }
            if (backspacePressed && inputFieldValue === "") {
                var previousSiblingElement = domUtil.getPreviousSiblingElement(inputField);
                if (previousSiblingElement) {
                    var previousSiblingLabel = previousSiblingElement.firstChild.innerText
                            || previousSiblingElement.firstChild.textContent;
                    domUtil.removeElement(previousSiblingElement);
                    this._removeValues(previousSiblingLabel);
                }
            }
            this.$DropDownTextInput._dom_onkeydown.call(this, event);
        },
        /**
         * To remove suggestion on click of close
         * @protected
         * @param {aria.utils.HTML} domElement
         * @param {aria.widgets.form.MultiAutoComplete} ref
         * @param {aria.utils.Event} event
         */
        _removeMultiselectValues : function (domElement, event) {
            var parent = domElement.parentNode;
            var domUtil = aria.utils.Dom;
            var label = parent.firstChild.innerText || parent.firstChild.textContent;
            domUtil.removeElement(parent);
            this._removeValues(label);
            if (event.type == "click") {
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
            var label, arg = {};
            var domUtil = aria.utils.Dom;
            label = domElement.textContent || domElement.innerText;
            domUtil.replaceDomElement(domElement.parentNode, this._textInputField);
            this.controller.editMode = true;
            this._removeValues(label);
            this._textInputField.focus();
            // to select the edited text.
            this._keepFocus = true;
            // this._textInputField.style.width = "0px";
            var report = this.controller.checkValue(label);
            report.caretPosStart = 0;
            report.caretPosEnd = label.length;
            this.$TextInput._reactToControllerReport.call(this, report, arg);
            // after setting the value removing focus
            this._keepFocus = false;

        },
        /**
         * To remove the label from widget
         * @param {String} label
         * @protected
         */
        _removeValues : function (label) {
            var indexToRemove, controller = this.controller;
            var arrayUtil = aria.utils.Array;
            arrayUtil.forEach(controller.selectedSuggestions, function (obj, index) {
                var suggestionLabel = obj.label || obj;
                if (suggestionLabel == label) {
                    indexToRemove = index;
                    controller.editedSuggestion = obj;
                }
            });
            arrayUtil.removeAt(controller.selectedSuggestions, indexToRemove);
            arrayUtil.remove(controller.selectedSuggestionsLabelsArray, label);
            var newSuggestions = aria.utils.Json.copy(controller.selectedSuggestions);
            this.setProperty("value", newSuggestions);
            this._textInputField.style.width = "0px";
            this.__resizeInput();
        },
        /**
         * Method used to get a dom reference for positioning the popup
         */
        getValidationPopupReference : function () {
            return this.getTextInputField();
        },
        /**
         * To remove the highlight class from the suggestion(s)
         * @param {Array|Integer} indices It can be an array of indices of suggestions or an index of suggestion. If
         * nothing is provided it will remove the highlight class from all the highlighted suggestions. Indexing starts
         * with 1.
         * @public
         */
        removeHighlight : function (indices) {
            var suggestionContainer = this._textInputField.parentNode;
            var typeUtil = aria.utils.Type;
            if (typeof indices === "undefined") {
                indices = this.getHighlight();
            }
            if (typeUtil.isArray(indices)) {
                for (var k = 0; k < indices.length; k++) {
                    var suggestionNode = suggestionContainer.children[indices[k] - 1];
                    if (suggestionNode) {
                        this._removeClass(suggestionNode, 'highlight');
                    }
                }
            } else {
                this.removeHighlight([indices]);
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
         * To add the highlight class for the suggestion(s)
         * @param {Array|Integer} indices It can be an array of indices of suggestions or an index of suggestion to be
         * highlighted. Indexing starts with 1.
         * @public
         */
        addHighlight : function (indices) {
            var suggestionContainer = this._textInputField.parentNode;
            var typeUtil = aria.utils.Type;
            if (typeUtil.isArray(indices)) {
                for (var k = 0; k < indices.length; k++) {
                    var suggestionNode = suggestionContainer.children[indices[k] - 1];
                    if (suggestionNode) {
                        this._addClass(suggestionNode, 'highlight');
                    }
                }
            } else {
                this.addHighlight([indices]);
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
         * Returns an array of indices of suggestions which have highlight class.
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
        }
    }
});
