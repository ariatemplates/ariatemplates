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

    // shortcut
    var typeUtil, arrayUtil;

    /**
     * Controller for the MultiAutoComplete widget. This controller manage the keystroke forwarded by the
     * multiautocomplete widget, and the resources handler.
     */
    Aria.classDefinition({
        $classpath : "aria.widgets.controllers.MultiAutoCompleteController",
        $extends : "aria.widgets.controllers.AutoCompleteController",
        $dependencies : ["aria.utils.Delegate", "aria.utils.Array", "aria.utils.Json", "aria.utils.String"],
        $onload : function () {
            typeUtil = aria.utils.Type;
            arrayUtil = aria.utils.Array;
        },
        $onunload : function () {
            typeUtil = null;
            arrayUtil = null;
        },
        $constructor : function () {
            this.$AutoCompleteController.constructor.call(this);

            /**
             * Freetext allowed, if it is set to true suggestion can be edited on double click
             * @type Boolean
             */
            this.freeText = false;
            /**
             * To edit the suggestion on double click
             * @type Boolean
             */
            this.editMode = false;
            /**
             * All the selected suggestions
             * @type Array
             */
            this.selectedSuggestions = [];
            /**
             * All selected suggestions labels
             * @type Array
             */
            this.selectedSuggestionsLabelsArray = [];
            /**
             * Keeps the suggestion which is being edited
             * @type Object
             */
            this.editedSuggestion;
            /**
             * Check if value is range of suggestions
             * @type Boolean
             */
            this._isRangeValue = false;

            // Inherited from aria.html.controllers.Suggestions
            this._init();

        },
        $prototype : {
            /**
             * override TextDataController.checkText
             * @param {String} text
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             */
            checkText : function (text, init) {
                var dataModel = this._dataModel, controller = this, addedValue;
                var trimText = aria.utils.String.trim(text);

                if (text !== '' && text !== dataModel.text) {
                    dataModel.text = trimText;
                    this._resourcesHandler.getSuggestions(trimText, {
                        fn : this._suggestionsCallback,
                        scope : this,
                        args : {
                            nextValue : trimText,
                            triggerDropDown : false
                        }
                    }, controller.selectedSuggestionsLabelsArray);
                    return null;
                }
                var report = new aria.widgets.controllers.reports.DropDownControllerReport();

                if (this.maxOptions && this.selectedSuggestions.length == this.maxOptions) {
                    trimText = "";
                }

                // an empty field is usually not considered as an error
                if (trimText === '') {
                    dataModel.value = null;
                    dataModel.text = '';
                    report.ok = true;
                    report.value = this.selectedSuggestions;
                } else {
                    if (this.freeText) {
                        report.ok = true;
                        if (this.editMode && trimText === this.editedSuggestion.label) {
                            addedValue = this.editedSuggestion;
                            dataModel.value = addedValue;
                        } else {
                            addedValue = trimText;
                        }
                        report.suggestionsToAdd = addedValue;
                        addedValue = this._checkValidSuggestion(addedValue);
                    } else {
                        if (!dataModel.value) {
                            report.ok = false;
                            report.value = null;
                            report.errorMessages.push(this.res.errors["40020_WIDGET_AUTOCOMPLETE_VALIDATION"]);
                        }

                    }
                    if (dataModel.value) {
                        report.value = addedValue;
                    }

                }
                return report;
            },

            /**
             * OVERRIDE Verify a given value
             * @param {Object} value
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             * @override
             */
            checkValue : function (value, init) {
                var report = new aria.widgets.controllers.reports.DropDownControllerReport(), dataModel = this._dataModel, rangeMatch = [], reportVal = [];
                var addedValue, isRangeValue = this._isRangeValue;
                if (value == null || aria.utils.Array.isEmpty(value)) {
                    // can be null either because it bound to null or because it is bind to value or request is in
                    // progress
                    dataModel.text = (this._pendingRequestNb > 0 && dataModel.text) ? dataModel.text : "";
                    dataModel.value = null;
                    report.ok = true;
                    reportVal = null;
                } else if (value && !typeUtil.isString(value)) {
                    if (this._checkWithSuggestionBean(value, this._resourcesHandler.SUGGESTION_BEAN)) {
                        var text = this._getLabelFromSuggestion(value);
                        dataModel.text = text;
                        report.ok = true;
                        reportVal = value;
                    } else {
                        dataModel.value = null;
                        report.ok = true;
                        this.$logError("Value does not match definition for this multiautocomplete: "
                                + this._resourcesHandler.SUGGESTION_BEAN, [], value);
                        reportVal = null;
                    }
                } else {
                    if (typeUtil.isString(value)) {
                        dataModel.text = value;
                        reportVal = value;
                    }
                    if (isRangeValue && dataModel.listContent) {
                        for (var k = 0, len = dataModel.listContent.length; k < len; k++) {
                            rangeMatch.push(dataModel.listContent[k].value);
                        }
                    }
                    if (!this.freeText) {
                        report.ok = false;
                        dataModel.value = null;
                    } else {
                        report.ok = true;
                        reportVal = value;

                    }
                }
                var suggestionsToAdd = rangeMatch.length > 0 ? rangeMatch : reportVal;
                if (this.editMode) {
                    suggestionsToAdd = "";
                }
                addedValue = this._checkValidSuggestion(suggestionsToAdd);
                report.value = addedValue;
                report.text = dataModel.text;
                report.suggestionsToAdd = suggestionsToAdd;
                return report;
            },
            /**
             * Checks if the suggestion to be added is an array or abject & pushes it to all suggestions
             * @protected
             * @param {Object} suggestionToBeAdded
             * @return {Array}
             */
            _checkValidSuggestion : function (suggestionToBeAdded) {
                var allSuggestions = aria.utils.Json.copy(this.selectedSuggestions);
                if (typeUtil.isObject(suggestionToBeAdded) || typeUtil.isString(suggestionToBeAdded)) {
                    allSuggestions.push(suggestionToBeAdded);
                }
                if (typeUtil.isArray(suggestionToBeAdded)) {
                    for (var k = 0; k < suggestionToBeAdded.length; k++) {
                        allSuggestions.push(suggestionToBeAdded[k]);
                    }
                }
                return allSuggestions;
            },
            /**
             * Callback after the asynchronous suggestions
             * @protected
             * @param {Array} suggestions
             * @param {Object} args nextValue and triggerDropDown properties
             */
            _suggestionsCallback : function (res, args) {

                this._pendingRequestNb -= 1;

                var suggestions = null;
                var error = null;
                var repositionDropDown = false;
                if (res != null) {
                    if ("suggestions" in res) {
                        suggestions = res.suggestions;
                        error = res.error;
                        repositionDropDown = res.repositionDropDown;
                        this._isRangeValue = res.multipleValues;
                    } else {
                        suggestions = res;
                        this._isRangeValue = false;
                    }
                }

                // default selection is first element
                var nextValue = args.nextValue, triggerDropDown = args.triggerDropDown, matchValueIndex = -1, dataModel = this._dataModel;

                // don't do anything if displayedValue has changed
                // -> user has typed something else before the callback returned
                if (dataModel && (nextValue == dataModel.text) || (args.keepSelectedValue)) {

                    // a null return is different from an empty array
                    // null : not enought letters
                    // empty array : no suggestions for this entry
                    var suggestionsAvailable = (suggestions !== null);

                    if (suggestionsAvailable) {
                        if (args.keepSelectedValue) {
                            var code = dataModel.value ? dataModel.value.code : null;
                            for (var i = 0; i < suggestions.length; i += 1) {
                                suggestions[i].exactMatch = (suggestions[i].code === code);
                            }
                        }
                        // reformat the suggestions to be compatible with the list widget
                        suggestions = this._filterSuggestions(suggestions);
                        matchValueIndex = this._prepareSuggestionsAndMatch(suggestions, nextValue);

                    } else {
                        suggestions = [];
                    }
                    var hasSuggestions = suggestions.length > 0;
                    // for resetting focus when suggestions are empty
                    this._resetFocus = suggestions.length > 0 || !(this.expandButton);
                    aria.templates.RefreshManager.stop();
                    // as item are changed, force datamodel to change to activate selection
                    var jsonUtils = aria.utils.Json;
                    jsonUtils.setValue(dataModel, 'selectedIdx', -1);

                    // update datamodel through setValue to update the list has well
                    jsonUtils.setValue(dataModel, 'listContent', suggestions);

                    if (this._isRangeValue) {
                        dataModel.value = nextValue;
                        var selectedValues = [];
                        for (var i = 0; i < dataModel.listContent.length; i++) {
                            selectedValues.push(dataModel.listContent[i].value);
                        }
                        jsonUtils.setValue(dataModel, 'isRangeValue', this._isRangeValue);
                        jsonUtils.setValue(dataModel, 'selectedValues', selectedValues);
                    } else {
                        if (matchValueIndex != -1) {
                            dataModel.value = dataModel.listContent[matchValueIndex].value;
                        } else {
                            if (this.freeText && nextValue) {
                                // return the text from the autocomplete
                                dataModel.value = nextValue;
                            } else {
                                dataModel.value = null;
                            }
                        }
                        jsonUtils.setValue(dataModel, 'selectedIdx', matchValueIndex);
                    }

                    var report = new aria.widgets.controllers.reports.DropDownControllerReport();
                    report.text = nextValue;
                    report.caretPosStart = args.caretPosStart;
                    report.caretPosEnd = args.caretPosEnd;

                    report.value = dataModel.value;
                    report.cancelKeyStroke = true;

                    if (error != null) {
                        report.ok = !error;
                    } else {
                        if (!this.freeText && suggestionsAvailable && !hasSuggestions) {
                            report.ok = false;
                            report.errorMessages.push(this.res.errors["40020_WIDGET_AUTOCOMPLETE_VALIDATION"]);
                        } else {
                            report.ok = true;
                        }
                    }
                    if (report.ok && suggestionsAvailable && !hasSuggestions) {
                        dataModel.value = nextValue;
                    }
                    report.displayDropDown = hasSuggestions && triggerDropDown;
                    report.repositionDropDown = repositionDropDown;
                    var arg = {};
                    arg.stopValueProp = true;
                    this._raiseReport(report, arg);
                    aria.templates.RefreshManager.resume();
                }
            },
            /**
             * Internal method to filter the suggestion with the added suggestions
             * @param {Array} suggestions
             * @return {Array}
             */
            _filterSuggestions : function (suggestions) {
                var filteredSuggestions = [];
                for (var i = 0; i < suggestions.length; i++) {
                    if (arrayUtil.indexOf(this.selectedSuggestionsLabelsArray, suggestions[i].label) == -1) {
                        filteredSuggestions.push(suggestions[i]);
                    }
                }
                return filteredSuggestions;
            },

            /**
             * Internal method to validate the value with suggestion bean
             * @param {Object} value
             * @param {aria.resources.handlers.LCResourcesHandlerBean.Suggestion} bean to validate with
             * @return {Boolean}
             */
            _checkWithSuggestionBean : function (value, beanName) {
                var valid = true, arrayOfSuggestions = [];
                if (typeUtil.isObject(value)) {
                    arrayOfSuggestions.push(value);
                } else if (typeUtil.isArray(value)) {
                    arrayOfSuggestions = value;
                }
                for (var k = 0; k < arrayOfSuggestions.length; k++) {
                    if (!typeUtil.isString(arrayOfSuggestions[k])
                            && !aria.core.JsonValidator.check(arrayOfSuggestions[k], beanName)) {
                        return false;
                    }
                }
                return valid;
            },

            /**
             * Check for the case when the displayedValue will change
             * @protected
             * @param {Integer} charCode
             * @param {Integer} keyCode
             * @param {String} nextValue the value that should be next in the textfield
             * @param {Integer} caretPos
             * @return {aria.widgets.controllers.reports.ControllerReport}
             */
            _checkInputKey : function (charCode, keyCode, nextValue, caretPosStart, caretPosEnd) {

                var checkMaxOptionsFlag = this.maxOptions ? this.maxOptions > this.selectedSuggestions.length : true;
                this._dataModel.value = this.freeText ? nextValue : null;
                this._dataModel.text = nextValue;
                if (this._typeTimeout) {
                    clearTimeout(this._typeTimeout);
                    this._typeTimeout = null;
                }
                var controller = this, domEvent = aria.DomEvent;

                if (keyCode == domEvent.KC_ARROW_DOWN && !nextValue && controller.expandButton) {
                    controller.toggleDropdown("", !!controller._listWidget);
                    return;
                }

                if (this.editMode) {
                    this.editMode = false;
                }

                this._typeTimeout = setTimeout(function () {
                    controller._typeTimeout = null;
                    controller._pendingRequestNb += 1;
                    if (checkMaxOptionsFlag) {
                        controller._resourcesHandler.getSuggestions(nextValue, {
                            fn : controller._suggestionsCallback,
                            scope : controller,
                            args : {
                                nextValue : nextValue,
                                triggerDropDown : true,
                                caretPosStart : caretPosStart,
                                caretPosEnd : caretPosEnd
                            }
                        }, controller.selectedSuggestionsLabelsArray);
                    }
                }, 10);
                return null;

            }
        }
    });
})();