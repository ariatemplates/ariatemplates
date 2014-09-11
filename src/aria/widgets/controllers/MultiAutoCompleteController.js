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
var ariaUtilsArray = require("../../utils/Array");
var ariaUtilsJson = require("../../utils/Json");
var ariaUtilsString = require("../../utils/String");
var ariaWidgetsControllersAutoCompleteController = require("./AutoCompleteController");
var ariaUtilsType = require("../../utils/Type");
var ariaCoreJsonValidator = require("../../core/JsonValidator");


(function () {

    // shortcut
    var typeUtil, arrayUtil;

    /**
     * Controller for the MultiAutoComplete widget. This controller manage the keystroke forwarded by the
     * multiautocomplete widget, and the resources handler.
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.widgets.controllers.MultiAutoCompleteController",
        $extends : ariaWidgetsControllersAutoCompleteController,
        $onload : function () {
            typeUtil = ariaUtilsType;
            arrayUtil = ariaUtilsArray;
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
             * All the selected suggestions
             * @type Array
             */
            this.selectedSuggestions = [];

            /**
             * Check if expando is enabled
             * @type Boolean
             */
            this._isExpanded = false;
            /**
             * Edited Suggestion Index
             * @type Integer
             */
            this._editedSuggestionIndex = -1;

            // Inherited from aria.html.controllers.Suggestions
            this._init();

        },
        $prototype : {
            /**
             * override TextDataController.checkText
             * @param {String} text
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             */
            checkText : function (text) {
                var dataModel = this._dataModel;
                var trimText = ariaUtilsString.trim(text);

                if (text !== '' && text !== dataModel.text) {
                    dataModel.text = trimText;
                    this._resourcesHandler.getSuggestions(trimText, {
                        fn : this._suggestionsCallback,
                        scope : this,
                        args : {
                            nextValue : trimText,
                            triggerDropDown : false
                        }
                    });
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
                } else {
                    if (this.freeText) {
                        report.ok = true;
                        var valueToAdd;
                        valueToAdd = dataModel.value || trimText;
                        dataModel.value = null;
                        dataModel.text = '';
                        report.text = "";
                        report.suggestionsToAdd = this._checkNewSuggestions([valueToAdd]);
                    } else if (!dataModel.value) {
                        report.ok = false;
                        report.value = null;
                        report.errorMessages.push(this.res.errors["40020_WIDGET_AUTOCOMPLETE_VALIDATION"]);
                    }
                }
                report.value = this.selectedSuggestions;

                return report;
            },

            /**
             * Removal of a suggestion
             * @param {String} label
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             * @override
             */
            removeValue : function (label) {
                var report = new aria.widgets.controllers.reports.DropDownControllerReport();
                var newSuggestions = ariaUtilsJson.copy(this.selectedSuggestions, false);

                var indexToRemove = this._findSuggestion(newSuggestions, {
                    label : label
                });
                if (indexToRemove == -1) {
                    // try to find a free-text option
                    indexToRemove = ariaUtilsArray.indexOf(newSuggestions, label);
                }
                if (indexToRemove > -1) {
                    report.removedSuggestion = newSuggestions[indexToRemove];

                    ariaUtilsArray.removeAt(newSuggestions, indexToRemove);
                    this.selectedSuggestions = newSuggestions;
                }
                report.removedSuggestionIndex = indexToRemove;
                report.value = this.selectedSuggestions;
                return report;
            },

            /**
             * Start editing a value. The value is supposed to have already been removed from the selectedSuggestions
             * array.
             * @param {String|Object} value (normally coming from the selectedSuggestions array)
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             */
            editValue : function (value, removedSuggestionIndex) {
                var dataModel = this._dataModel;
                this._editedSuggestionIndex = removedSuggestionIndex;
                var report = new aria.widgets.controllers.reports.DropDownControllerReport();
                dataModel.value = value;
                dataModel.text = typeUtil.isString(value) ? value : value.label;
                report.text = dataModel.text;
                report.caretPosStart = 0;
                report.caretPosEnd = report.text.length;
                report.value = this.selectedSuggestions;
                return report;
            },

            /**
             * Updates selected values.
             * @param {Array} values
             */
            checkExpandedValues : function (selectedValues) {
                var selectedValuesCopy = ariaUtilsJson.copy(selectedValues, false);
                var selectedSuggestionsCopy = ariaUtilsJson.copy(this.selectedSuggestions, false);
                for (var i = 0, l = selectedSuggestionsCopy.length; i < l; i++) {
                    var curSelectedSuggestion = selectedSuggestionsCopy[i];
                    if (typeUtil.isObject(curSelectedSuggestion)) {
                        var index = this._findSuggestion(selectedValuesCopy, curSelectedSuggestion);
                        if (index > -1) {
                            arrayUtil.removeAt(selectedValuesCopy, index);
                        } else {
                            arrayUtil.removeAt(selectedSuggestionsCopy, i);
                            l--;
                            i--;
                        }
                    }
                }
                selectedSuggestionsCopy = selectedSuggestionsCopy.concat(selectedValuesCopy);
                var report = this.checkValue(selectedSuggestionsCopy);
                this._isExpanded = true;
                report.repositionDropDown = true;
                return report;
            },

            /**
             * Checks a value coming from the data model. The MultiAutoComplete only accepts arrays or null values from
             * the data model.
             * @param {Array} value
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             * @override
             */
            checkValue : function (value) {
                var report = new aria.widgets.controllers.reports.DropDownControllerReport(), dataModel = this._dataModel;

                if (value == null) {
                    dataModel.text = (this._pendingRequestNb > 0 && dataModel.text) ? dataModel.text : "";
                    dataModel.value = null;
                    report.ok = true;
                    this.selectedSuggestions = [];
                } else if (typeUtil.isArray(value)) {
                    if (this._checkWithSuggestionBean(value, this._resourcesHandler.SUGGESTION_BEAN)) {
                        dataModel.text = "";
                        dataModel.value = null;
                        report.ok = true;
                        this.selectedSuggestions = value;
                    } else {
                        report.ok = false;
                        this.$logError("Value does not match definition for this multiautocomplete: "
                                + this._resourcesHandler.SUGGESTION_BEAN, [], value);
                    }
                } else {
                    report.ok = false;
                    this.$logError("Wrong multiautocomplete value: " + value, [], value);
                }

                report.clearSuggestions = true;
                report.suggestionsToAdd = report.value = this.selectedSuggestions;
                report.text = dataModel.text;
                return report;
            },

            /**
             * Check the value selected by the user in the dropdown. It is called by checkKeyStroke.
             * @param {Object} value
             * @return {aria.widgets.controllers.reports.ControllerReport}
             */
            checkDropdownValue : function (value) {
                if (typeUtil.isString(value) || value == null) {
                    return new aria.widgets.controllers.reports.DropDownControllerReport();
                } else {
                    var report = new aria.widgets.controllers.reports.DropDownControllerReport();
                    var dataModel = this._dataModel;
                    var suggestionsToAdd = typeUtil.isArray(value) ? value : [value];
                    report.suggestionsToAdd = this._checkNewSuggestions(suggestionsToAdd);
                    report.value = this.selectedSuggestions;
                    report.text = "";
                    dataModel.text = "";
                    dataModel.value = null;
                    return report;
                }
            },

            /**
             * Pushes new suggestions to the array of selectedSuggestions and return the array of new suggestions.
             * @protected
             * @param {Object} suggestionToBeAdded
             * @return {Array}
             */
            _checkNewSuggestions : function (suggestionToBeAdded) {
                var allSuggestions = ariaUtilsJson.copy(this.selectedSuggestions, false);
                var res = [];
                var maxOptions = this.maxOptions;
                var length = suggestionToBeAdded.length;
                if (maxOptions && allSuggestions.length + length > maxOptions) {
                    length = maxOptions - allSuggestions.length;
                }
                if (length > 0) {
                    for (var k = 0; k < length; k++) {
                        if (this._editedSuggestionIndex != -1) {
                            allSuggestions.splice(this._editedSuggestionIndex, 0, suggestionToBeAdded[k]);
                            this._editedSuggestionIndex += 1;
                        } else {
                            allSuggestions.push(suggestionToBeAdded[k]);
                        }
                        res[k] = suggestionToBeAdded[k];
                    }
                    this._editedSuggestionIndex = -1;
                    this.selectedSuggestions = allSuggestions;
                }
                return res;
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
                var rangeValue = false;
                if (res != null) {
                    if ("suggestions" in res) {
                        suggestions = res.suggestions;
                        error = res.error;
                        repositionDropDown = res.repositionDropDown;
                        rangeValue = res.multipleValues;
                    } else {
                        suggestions = res;
                    }
                }

                // default selection is first element
                var nextValue = args.nextValue, triggerDropDown = args.triggerDropDown, matchValueIndex = -1, dataModel = this._dataModel;
                var allSuggestions = !!args.allSuggestions;

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
                        suggestions = allSuggestions ? suggestions : this._filterSuggestions(suggestions);
                        matchValueIndex = this._prepareSuggestionsAndMatch(suggestions, nextValue);

                    } else {
                        suggestions = [];
                    }
                    var hasSuggestions = suggestions.length > 0;
                    // for resetting focus when suggestions are empty
                    this._resetFocus = suggestions.length > 0 || !(this.expandButton);
                    aria.templates.RefreshManager.stop();
                    // as item are changed, force datamodel to change to activate selection
                    var jsonUtils = ariaUtilsJson;
                    jsonUtils.setValue(dataModel, 'selectedIdx', -1);

                    // update datamodel through setValue to update the list as well
                    jsonUtils.setValue(dataModel, 'listContent', suggestions);

                    if (rangeValue) {
                        var selectedValues = [];
                        for (var i = 0; i < dataModel.listContent.length; i++) {
                            selectedValues.push(dataModel.listContent[i].value);
                        }
                        jsonUtils.setValue(dataModel, 'multipleSelect', true);
                        jsonUtils.setValue(dataModel, 'selectedValues', selectedValues);
                        dataModel.value = selectedValues.length > 0 ? selectedValues : null;
                    } else if (allSuggestions) {
                        var selectedValues = [];
                        for (var i = 0; i < dataModel.listContent.length; i++) {
                            var index = this._findSuggestion(this.selectedSuggestions, dataModel.listContent[i].value);
                            if (index != -1) {
                                selectedValues.push(dataModel.listContent[i].value);
                            }
                        }
                        jsonUtils.setValue(dataModel, 'selectedValues', selectedValues);
                        jsonUtils.setValue(dataModel, 'multipleSelect', true);
                        dataModel.value = null;
                    } else {
                        if (matchValueIndex != -1) {
                            dataModel.value = dataModel.listContent[matchValueIndex].value;
                            jsonUtils.setValue(dataModel, 'selectedValues', [dataModel.value]);
                        } else {
                            jsonUtils.setValue(dataModel, 'selectedValues', []);
                            if (this.freeText && nextValue) {
                                // return the text from the autocomplete
                                dataModel.value = nextValue;
                            } else {
                                dataModel.value = null;
                            }
                        }
                        jsonUtils.setValue(dataModel, 'multipleSelect', false);
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
                    report.displayDropDown = hasSuggestions && triggerDropDown;
                    report.repositionDropDown = repositionDropDown || (this._isExpanded !== allSuggestions);
                    this._isExpanded = allSuggestions;
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
                var selectedSuggestions = this.selectedSuggestions;
                var filteredSuggestions = [];
                for (var i = 0; i < suggestions.length; i++) {
                    var curSuggestion = suggestions[i];
                    if (this._findSuggestion(selectedSuggestions, curSuggestion) == -1) {
                        filteredSuggestions.push(curSuggestion);
                    }
                }
                return filteredSuggestions;
            },

            /**
             * Returns the index of the given suggestion in the given array of suggestions. The comparison is based on
             * labels.
             * @param {Array} suggestionsList
             * @param {Object} suggestion
             * @return {Boolean}
             */
            _findSuggestion : function (suggestionsList, suggestion) {
                for (var i = 0, l = suggestionsList.length; i < l; i++) {
                    if (suggestion.label == suggestionsList[i].label) {
                        return i;
                    }
                }
                return -1;
            },

            /**
             * Internal method to validate the value with suggestion bean.
             * @param {Array} value
             * @param {String} bean to validate each item of the array with
             * @return {Boolean}
             */
            _checkWithSuggestionBean : function (arrayOfSuggestions, beanName) {
                for (var k = 0, l = arrayOfSuggestions.length; k < l; k++) {
                    var currentSuggestion = arrayOfSuggestions[k];
                    if (!typeUtil.isString(currentSuggestion)
                            && !ariaCoreJsonValidator.check(currentSuggestion, beanName)) {
                        return false;
                    }
                }
                return true;
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
                        });
                    }
                }, 10);
                return null;

            },
            /**
             * Return the template to use in the dropdown
             * @return {String}
             */
            getExpandoTemplate : function () {
                return this._resourcesHandler.getExpandoTemplate();
            }
        }
    });
})();
