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
    var typeUtil;

    /**
     * Controller for the AutoComplete widget. This controller manage the keystroke forwarded by the autocomplete
     * widget, and the resources handler.
     */
    Aria.classDefinition({
        $classpath : "aria.widgets.controllers.AutoCompleteController",
        $extends : "aria.widgets.controllers.DropDownListController",
        $dependencies : ["aria.DomEvent", "aria.utils.Json", "aria.templates.RefreshManager",
                "aria.widgets.controllers.reports.DropDownControllerReport", "aria.utils.Type",
                "aria.html.controllers.Suggestions"],
        $resources : {
            res : "aria.widgets.WidgetsRes"
        },
        $onload : function () {
            typeUtil = aria.utils.Type;
        },
        $onunload : function () {
            typeUtil = null;
        },
        $constructor : function () {
            this.$DropDownListController.constructor.call(this);

            /**
             * Autofill behaviour enabled
             * @type Boolean
             */
            this.autoFill = false;

            /**
             * Freetext allowed
             * @type Boolean
             */
            this.freeText = true;

            /**
             * Specifies if the Expand button is set
             * @type Boolean
             */
            this.expandButton = false;

            /**
             * Number of resource request in progress
             * @type Number
             * @protected
             */
            this._pendingRequestNb = 0;

            /**
             * Maximum allowed length for the autocomplete value. Infinite if negative
             * @type Number
             */
            this.maxlength = -1;

            /**
             * To Remove focus when call back has no suggestions.
             * @type Boolean
             */
            this._resetFocus = false;

            /**
             * Keys defined for submitting a selected item from autocomplete dropdown
             * @type aria.widgets.CfgBeans:AutoCompleteCfg.selectionKeys
             */
            this.selectionKeys = null;

            // Inherited from aria.html.controllers.Suggestions
            this._init();
        },
        $destructor : function () {
            this.dispose();
            this.$DropDownListController.$destructor.call(this);
        },
        $prototype : {
            /**
             * Override the $init method to be able to extend from multiple classes
             * @param {Object} p the prototype object being built
             */
            $init : function (p) {
                var parent = aria.html.controllers.Suggestions.prototype;
                for (var key in parent) {
                    if (parent.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                        p[key] = parent[key];
                    }
                }
            },

            /**
             * Return the template to use in the dropdown
             * @return {String}
             */
            getDefaultTemplate : function () {
                return this._resourcesHandler.getDefaultTemplate();
            },

            /**
             * override TextDataController.checkText
             * @param {String} text
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             */
            checkText : function (text) {

                var dataModel = this._dataModel;

                if (text !== '' && text !== dataModel.text) {
                    dataModel.text = text;

                    this._pendingRequestNb += 1;
                    this._resourcesHandler.getSuggestions(text, {
                        fn : this._suggestionsCallback,
                        scope : this,
                        args : {
                            nextValue : text,
                            triggerDropDown : false
                        }
                    });

                    // return null as there is asynchrone handling
                    return null;
                }

                // returned object
                var report = new aria.widgets.controllers.reports.DropDownControllerReport();

                // an empty field is usually not considered as an error
                if (text === '') {
                    dataModel.value = null;
                    dataModel.text = '';
                    report.ok = true;
                    report.value = null;
                } else {
                    if (this.freeText) {
                        report.ok = true;
                        if (this._pendingRequestNb > 0 && !dataModel.value) {
                            report.value = dataModel.text;
                        }
                    } else {
                        if (!dataModel.value) {

                            if (this.expandButton && dataModel.listContent && this._checkValueList()) {
                                report.ok = true;
                            } else {
                                report.ok = false;
                                report.value = null;
                                report.errorMessages.push(this.res.errors["40020_WIDGET_AUTOCOMPLETE_VALIDATION"]);
                            }
                        }

                    }
                    // if there is no value in the dataModel, user was just browsing selections
                    if (dataModel.value) {
                        report.value = dataModel.value;
                    }

                }
                return report;
            },
            /**
             * Checks the displayed text is available in the returned suggestion, this will apply only in case of
             * freetext is set to false
             * @param {Object} value
             * @return {Boolean}
             */
            _checkValueList : function () {
                var freeTxtStatus = false, dataListContent = this._dataModel.listContent;
                for (var i = 0, len = dataListContent.length; i < len; i += 1) {
                    if (this._dataModel.text === dataListContent[i].value.label) {
                        freeTxtStatus = true;
                        break;
                    }
                }
                return freeTxtStatus;
            },

            /**
             * OVERRIDE Verify a given value
             * @param {Object} value
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             * @override
             */
            checkValue : function (value) {
                var report = new aria.widgets.controllers.reports.DropDownControllerReport(), dataModel = this._dataModel;
                if (value == null) {
                    // can be null either because it bound to null or because a request is in progress
                    dataModel.text = (this._pendingRequestNb > 0 && dataModel.text) ? dataModel.text : "";
                    dataModel.value = null;
                    report.ok = true;
                } else if (value && !typeUtil.isString(value)) {
                    if (aria.core.JsonValidator.check(value, this._resourcesHandler.SUGGESTION_BEAN)) {
                        var text = this._getLabelFromSuggestion(value);
                        dataModel.text = text;
                        dataModel.value = value;
                        report.ok = true;
                    } else {
                        dataModel.value = null;
                        report.ok = false;
                        this.$logError("Value does not match definition for this autocomplete: "
                                + this._resourcesHandler.SUGGESTION_BEAN, [], value);
                    }
                } else {
                    if (typeUtil.isString(value)) {
                        dataModel.text = value;
                    }
                    if (!this.freeText) {
                        report.ok = false;
                        dataModel.value = null;
                    } else {
                        report.ok = true;
                        dataModel.value = value;
                    }
                }
                report.value = dataModel.value;
                report.text = dataModel.text;
                return report;
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

                // Before reacting to the controller report we check that the maxlength is not exceeded
                // It is done here because the report is asynchronous and will programmatically set the
                // value of the text input, thus bypassing maxlength attribute on text input
                if (this.maxlength > 0 && nextValue.length > this.maxlength) {
                    return;
                }
                // Setting the Data Model value to entered Text if the free text is allowed PTR05245510
                this._dataModel.value = this.freeText ? nextValue : null;
                this._dataModel.text = nextValue;
                // The timeout was moved from the _raiseReport method to here
                // so that we never send an old report after having received a new key
                // and so that it is possible to quickly cancel the display of suggestions when typing fast
                if (this._typeTimout) {
                    clearTimeout(this._typeTimout);
                    this._typeTimout = null;
                }
                var controller = this, domEvent = aria.DomEvent;

                if (keyCode == domEvent.KC_ARROW_DOWN && !nextValue && controller.expandButton) {
                    controller.toggleDropdown("", !!controller._listWidget);
                    return;
                }

                this._typeTimout = setTimeout(function () {
                    controller._typeTimout = null;

                    controller._pendingRequestNb += 1;
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
                }, 10);

                // return null as there is asynchrone handling
                return null;

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
                    } else {
                        suggestions = res;
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
                    jsonUtils.setValue(dataModel, 'selectedIdx', matchValueIndex);

                    var report = new aria.widgets.controllers.reports.DropDownControllerReport();
                    report.text = nextValue;
                    report.caretPosStart = args.caretPosStart;
                    report.caretPosEnd = args.caretPosEnd;

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
             * reformat the suggestions to be compatible with the list widget and search for perfect match
             * @protected
             * @param {Array} suggestions
             * @param {String} textEntry
             * @return {Number} index of the first exact match, or -1
             */
            _prepareSuggestionsAndMatch : function (suggestions, textEntry) {
                var matchValueIndex = -1, suggestion;
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
                    suggestions[index] = tmp;
                }
                return matchValueIndex;
            },

            /**
             * Retrieve the label to display in the textfield for a given suggestion.
             * @protected
             * @param {Object} value
             */
            _getLabelFromSuggestion : function (value) {
                return this._resourcesHandler.suggestionToLabel(value);
            },

            /**
             * Retrieve the label to display in the textfield for an element of the list in the datamodel. This element
             * may be different from the element in the 'value' parameter of the datamodel.
             * @protected
             * @param {Object} value
             * @return {String}
             */
            _getLabelFromListValue : function (listValue) {
                if (this.autoFill) {
                    return this._getLabelFromSuggestion(listValue.value);
                }
                return null;
            },

            /**
             * Public method that converts the suggestion object into the displayed text by relying on the protected
             * method _getLabelFromSuggestion
             * @param {Object} selectedValues
             * @return {String}
             */
            getDisplayTextFromValue : function (value) {
                var returnValue = (value) ? this._getLabelFromSuggestion(value) : "";
                return (returnValue) ? returnValue : value;
            },

            /**
             * Prepare the drop down list
             * @param {String} displayValue
             * @param {Boolean} currentlyOpen
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             */
            toggleDropdown : function (displayValue, currentlyOpen) {
                this._resourcesHandler.getAllSuggestions({
                    fn : this._suggestionsCallback,
                    scope : this,
                    args : {
                        nextValue : displayValue,
                        triggerDropDown : !currentlyOpen,
                        keepSelectedValue : true
                    }
                });
            },

            /**
             * Validates an event against a configuration
             * @param {Object} config
             * @param {aria.DomEvent} event
             * @protected
             */
            _validateModifiers : function (config, event) {
                return (event.altKey == !!config.alt) && (event.shiftKey == !!config.shift)
                        && (event.ctrlKey == !!config.ctrl);
            },

            /**
             * Checking against special key combinations that trigger a selection of the item in the dropdown
             * @param {aria.DomEvent} event
             * @return {Boolean} Whether the event corresponds to a selection key
             * @protected
             */
            _checkSelectionKeys : function (event) {
                var specialKey = false, keyCode = event.keyCode;
                for (var index = 0, keyMap; index < this.selectionKeys.length; index++) {
                    keyMap = this.selectionKeys[index];
                    if (this._validateModifiers(keyMap, event)) {
                        // case real key defined. For eg: 65 for a
                        if (aria.utils.Type.isNumber(keyMap.key)) {
                            if (keyMap.key === keyCode) {
                                specialKey = true;
                                break;
                            }
                        } else if (typeof(keyMap.key) !== "undefined"
                                && event["KC_" + keyMap.key.toUpperCase()] == keyCode) {
                            specialKey = true;
                            break;
                        } else if (typeof(keyMap.key) !== "undefined"
                                && String.fromCharCode(event.charCode) == keyMap.key) {
                            specialKey = true;
                            break;
                        }
                    }
                }
                return specialKey;
            }

        }
    });
})();
