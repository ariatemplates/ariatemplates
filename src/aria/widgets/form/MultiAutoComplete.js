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
            "aria.utils.Type", "aria.utils.Array", "aria.utils.Math"],
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
            var element = event.target;
            if (element.className === "closeBtn") {
                this._removeMultiselectValues(element, event);
            }
            this._textInputField.focus();
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
         * @param {aria.widgets.form.MultiAutoComplete} ref
         * @param {aria.widgets.controllers.reports.DropDownControllerReport} report
         * @param {Object} arg Optional parameters
         */

        _addMultiselectValues : function (report, arg) {
            var controller = this.controller, suggestionToBeAdded = controller._suggestionToBeAdded;
            var typeUtil = aria.utils.Type;

            var isValid;
            if (controller.editMode) {
                isValid = typeUtil.isString(suggestionToBeAdded);
            } else {
                isValid = typeUtil.isArray(suggestionToBeAdded) || typeUtil.isObject(suggestionToBeAdded);
            }

            if (controller.freeText && suggestionToBeAdded && arg && arg.eventName == "blur") {
                isValid = true;
            }
            if (isValid && suggestionToBeAdded && !this._dropdownPopup) {
                var suggestionsMarkup = "", domUtil = aria.utils.Dom;
                if (aria.utils.Type.isArray(suggestionToBeAdded)) {
                    var maxOptionsLength = (controller.maxOptions)
                            ? aria.utils.Math.min((controller.maxOptions - controller.selectedSuggestions.length), suggestionToBeAdded.length)
                            : suggestionToBeAdded.length;
                    for (var i = 0; i < maxOptionsLength; i++) {
                        suggestionsMarkup += this._generateSuggestionMarkup(suggestionToBeAdded[i], this);
                    }
                } else {
                    var lessThanMaxOptions = controller.maxOptions
                            ? controller.maxOptions > controller.selectedSuggestions.length
                            : false;
                    if (lessThanMaxOptions) {
                        suggestionsMarkup = this._generateSuggestionMarkup(suggestionToBeAdded);
                    }
                }
                domUtil.insertAdjacentHTML(this._textInputField, "beforeBegin", suggestionsMarkup);
                controller._suggestionToBeAdded = null;
                this._textInputField.value = "";
                if (this._frame.getChild(0).lastChild !== this._textInputField) {

                    domUtil.insertAdjacentHTML(this._frame.getChild(0).lastChild, "afterEnd", "<span></span>");
                    domUtil.replaceDomElement(this._frame.getChild(0).lastChild, this._textInputField);
                }
                if (controller.editMode) {
                    controller.editMode = false;
                }

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
         * Handling double click event for editing suggestion
         * @param {aria.utils.Event} event
         */
        _dom_ondblclick : function (event) {
            if (event.type == "dblclick" && this.controller.freeText) {
                var element = event.target;
                if (element.className == "xMultiAutoComplete_Option_Text") {
                    this._editMultiselectValue(element, event);
                }
            }
        },
        /**
         * To remove suggestion on click of close
         * @param {aria.utils.HTML} domElement
         * @param {aria.widgets.form.MultiAutoComplete} ref
         * @param {aria.utils.Event} event
         */
        _removeMultiselectValues : function (domElement, event) {
            var parent = domElement.parentNode, domUtil = aria.utils.Dom;
            var controller = this.controller;
            var label = parent.firstChild.innerText || parent.firstChild.textContent;
            this._removeValues(label);
            domUtil.removeElement(parent);
            if (event.type == "click") {
                this.getTextInputField().focus();
            }
            var newSuggestions = aria.utils.Json.copy(controller.selectedSuggestions);
            this.setProperty("value", newSuggestions);
        },
        /**
         * To edit suggestion on doubleclick
         * @param {aria.utils.HTML} domElement
         * @param {aria.utils.Event} event
         */
        _editMultiselectValue : function (domElement, event) {
            var domUtil = aria.utils.Dom, label, arg = {};
            label = domElement.textContent || domElement.innerText;
            domUtil.replaceDomElement(domElement.parentNode, this._textInputField);
            this.controller.editMode = true;
            this._removeValues(label);
            this._textInputField.focus();
            // to select the edited text.
            this._keepFocus = true;
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
         */
        _removeValues : function (label) {
            var indexToRemove, arrayUtil = aria.utils.Array, controller = this.controller;
            arrayUtil.forEach(controller.selectedSuggestions, function (obj, index) {
                var suggestionLabel = obj.label || obj;
                if (suggestionLabel == label) {
                    indexToRemove = index;
                    controller.editedSuggestion = obj;
                }
            });
            arrayUtil.removeAt(controller.selectedSuggestions, indexToRemove);
            arrayUtil.remove(controller.selectedSuggestionsLabelsArray, label);
        }
    }
});
