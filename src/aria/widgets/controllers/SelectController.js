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
    var jsonUtils;
    var domEvent;

    /**
     * The Select controller is the controller used in the Select widget.
     */
    Aria.classDefinition({
        $classpath : "aria.widgets.controllers.SelectController",
        $extends : "aria.widgets.controllers.TextDataController",
        $dependencies : ["aria.DomEvent", "aria.widgets.controllers.reports.DropDownControllerReport"],
        $constructor : function () {
            this.$TextDataController.constructor.call(this);
            this._dataModel = {
                // Available options:
                listContent : [],

                lastTypedKeys : null,
                pageSize : 20,

                displayIdx : -1,
                displayText : '',
                value : null,

                // Highlighted item in the list:
                selectedIdx : -1
            };
            this._reinitTypedKeysTimeout = null;
        },
        $destructor : function () {
            // cancel any remaining reinitTypedKeysTimeout:
            this._setLastTypedKeys(null);
            this.setListWidget(null);
            this.$TextDataController.$destructor.call(this);
        },
        $onload : function () {
            jsonUtils = aria.utils.Json;
            domEvent = aria.DomEvent;
        },
        $onunload : function () {
            jsonUtils = null;
            domEvent = null;
        },
        $statics : {
            /**
             * Meta data used to store labels
             * @type String
             */
            LABEL_META : Aria.FRAMEWORK_PREFIX + "lcLabel",

            /**
             * Delay (in milliseconds) during which last typed keys are saved.
             * @type Integer
             */
            LAST_TYPED_KEYS_DELAY : 800
        },
        $prototype : {
            /**
             * Set the list content
             * @param {aria.widgets.CfgBeans:SelectCfg.options} options
             */
            setListOptions : function (options) {
                var dataModel = this._dataModel;
                // normalize labels to lowerCase
                var sz = options.length, item;
                for (var i = 0; sz > i; i++) {
                    item = options[i];
                    item[this.LABEL_META] = item.label.toLowerCase();
                }
                jsonUtils.setValue(dataModel, 'listContent', options);
                this._setDisplayIdx(0);
            },

            /**
             * Create a report containing the current display value.
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             * @protected
             */
            _createReport : function (includeValue) {
                var dataModel = this._dataModel;
                var report = new aria.widgets.controllers.reports.DropDownControllerReport();
                report.ok = true;
                if (includeValue) {
                    report.value = dataModel.value;
                }
                report.text = dataModel.displayText;
                return report;
            },

            /**
             * Set the display index in the data model and update other dependent values.
             * @param {Number} displayIdx index (in listContent) of the new display text
             * @protected
             */
            _setDisplayIdx : function (displayIdx) {
                var dataModel = this._dataModel;
                var options = dataModel.listContent;
                if (options.length === 0) {
                    displayIdx = -1;
                } else if (displayIdx >= options.length) {
                    displayIdx = options.length - 1;
                } else if (displayIdx < 0) {
                    displayIdx = 0;
                }
                if (displayIdx == -1) {
                    jsonUtils.setValue(dataModel, 'selectedIdx', -1);
                    jsonUtils.setValue(dataModel, 'displayIdx', -1);
                    jsonUtils.setValue(dataModel, 'displayText', '');
                    jsonUtils.setValue(dataModel, 'value', null);
                } else {
                    jsonUtils.setValue(dataModel, 'selectedIdx', displayIdx);
                    jsonUtils.setValue(dataModel, 'displayIdx', displayIdx);
                    jsonUtils.setValue(dataModel, 'displayText', options[displayIdx].label);
                    jsonUtils.setValue(dataModel, 'value', options[displayIdx].value);
                }
            },

            /**
             * Changes the last typed keys string in the data model. All changes to the lastTypedKeys property in the
             * data model should go through this method (to set/cancel the associated timer callback).
             * @param {String} lastTypedKeys new string (or null if last typed keys must be reset)
             * @protected
             */
            _setLastTypedKeys : function (lastTypedKeys) {
                var dataModel = this._dataModel;
                jsonUtils.setValue(dataModel, "lastTypedKeys", lastTypedKeys);
                if (this._reinitTypedKeysTimeout) {
                    aria.core.Timer.cancelCallback(this._reinitTypedKeysTimeout);
                    this._reinitTypedKeysTimeout = null;
                }
                if (lastTypedKeys != null) {
                    this._reinitTypedKeysTimeout = aria.core.Timer.addCallback({
                        fn : this._reinitLastTypedKeys,
                        scope : this,
                        delay : this.LAST_TYPED_KEYS_DELAY
                    });
                }
            },

            /**
             * Method called from the timer callback to reset the last typed keys. Should only be called from the timer
             * callback (as it sets _reinitTypedKeysTimeout to null).
             * @protected
             */
            _reinitLastTypedKeys : function () {
                this._reinitTypedKeysTimeout = null;
                this._setLastTypedKeys(null);
            },

            /**
             * Search for an item matching the last typed keys in the options and return its index. An item is matching
             * if the whole lastTypedKeys string is a prefix of its label.
             * @param {String} lastTypedKeys
             * @param {Boolean} newMatch
             * @return {Number} index of the matching item or -1 if no matching item was found
             * @protected
             */
            _findMatch : function (lastTypedKeys, newMatch) {
                var LABEL_META = this.LABEL_META;
                var options = this._dataModel.listContent;
                var keyNbr = lastTypedKeys.length;
                var index = this._dataModel.selectedIdx + (newMatch ? 1 : 0); // start point to search for a match
                for (var ct = 0, optionsLength = options.length; ct < optionsLength; ct++, index++) {
                    if (index >= optionsLength) {
                        index = 0;
                    }
                    var opt = options[index];
                    var prefix = opt[LABEL_META].substr(0, keyNbr);
                    if (prefix == lastTypedKeys) {
                        return index;
                    }
                }
                return -1; // not found
            },

            /**
             * Search for an item matching the last typed key in the options and return its index. lastTypedKeys is
             * checked to be a string containing only one letter (repeated several times), an item is matching if its
             * label starts with that letter.
             * @param {String} lastTypedKeys
             * @param {Boolean} newMatch
             * @return {Number} index of the matching item or -1 if no matching item was found
             * @protected
             */
            _findLetterMatch : function (lastTypedKeys) {
                var length = lastTypedKeys.length;
                if (length <= 1) {
                    // It is useless to execute findLetterMatch in case lastTypedKeys contains only one character,
                    // because _findMatch has already done the job in that case
                    return -1;
                }
                // check that all the typed keys were the same:
                var letter = lastTypedKeys.charAt(0);
                for (var i = 1; i < length; i++) {
                    if (letter != lastTypedKeys.charAt(i)) {
                        return -1;
                    }
                }
                // look for a match for that key:
                return this._findMatch(letter, true);
            },

            /**
             * Verify a given keyStroke and return a report.
             * @param {Integer} charCode
             * @param {Integer} keyCode
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             */
            checkKeyStroke : function (charCode, keyCode) {
                var dataModel = this._dataModel;
                var report;
                if (domEvent.isNavigationKey(keyCode)) {
                    var newIdx;
                    var validationKey = false;
                    if (keyCode == domEvent.KC_LEFT || keyCode == domEvent.KC_UP) {
                        newIdx = dataModel.selectedIdx - 1;
                    } else if (keyCode == domEvent.KC_RIGHT || keyCode == domEvent.KC_DOWN) {
                        newIdx = dataModel.selectedIdx + 1;
                    } else if (keyCode == domEvent.KC_PAGE_UP) {
                        newIdx = dataModel.selectedIdx - (dataModel.pageSize - 1);
                    } else if (keyCode == domEvent.KC_PAGE_DOWN) {
                        newIdx = dataModel.selectedIdx + (dataModel.pageSize - 1);
                    } else if (keyCode == domEvent.KC_HOME) {
                        newIdx = 0;
                    } else if (keyCode == domEvent.KC_END) {
                        newIdx = dataModel.listContent.length - 1;
                    } else if (keyCode == domEvent.KC_ENTER) {
                        // when pressing enter, the currently highlighted item in the dropdown becomes the current
                        // value:
                        newIdx = dataModel.selectedIdx;
                        validationKey = true;
                    } else if (keyCode == domEvent.KC_ESCAPE) {
                        // pressing escape has no effect if the popup is not open
                        // it only closes the popup when it is open (does not update the data model)
                        if (this._listWidget) {
                            report = this._createReport(false);
                            report.displayDropDown = false;
                            report.cancelKeyStroke = true;
                            jsonUtils.setValue(dataModel, 'selectedIdx', dataModel.displayIdx);
                        }
                    } else if (keyCode == domEvent.KC_TAB) {
                        // when pressing tab, the currently selected item stays the current value:
                        newIdx = dataModel.displayIdx;
                        validationKey = true;
                    }
                    if (newIdx != null) {
                        this._setLastTypedKeys(null);
                        this._setDisplayIdx(newIdx);
                        report = this._createReport(validationKey);
                        // never cancel TAB keystroke, and ENTER should not be canceled when the list widget is no
                        // longer displayed
                        report.cancelKeyStroke = (keyCode != domEvent.KC_TAB && (keyCode != domEvent.KC_ENTER || this._listWidget != null));
                        if (this._listWidget && validationKey) {
                            report.displayDropDown = false;
                        }
                    }
                } else {
                    var lastTypedKeys = dataModel.lastTypedKeys;
                    var newMatch = (lastTypedKeys == null);
                    if (newMatch) {
                        lastTypedKeys = "";
                    }
                    var newLastTypedKeys;
                    if (keyCode == domEvent.KC_BACKSPACE) {
                        newLastTypedKeys = this._getTypedValueOnDelete(keyCode, lastTypedKeys, lastTypedKeys.length, lastTypedKeys.length).nextValue;
                        // we do not look for a new match when pressing backspace, only save the resulting lastTypedKeys
                    } else {
                        newLastTypedKeys = this._getTypedValue(charCode, lastTypedKeys, lastTypedKeys.length, lastTypedKeys.length).nextValue;
                        newLastTypedKeys = newLastTypedKeys.toLowerCase();
                        var matchingIndex = this._findMatch(newLastTypedKeys, newMatch);
                        if (matchingIndex == -1) {
                            matchingIndex = this._findLetterMatch(newLastTypedKeys);
                        }
                        if (matchingIndex > -1) {
                            this._setDisplayIdx(matchingIndex);
                        }
                    }
                    report = this._createReport(false);
                    report.cancelKeyStroke = true;
                    this._setLastTypedKeys(newLastTypedKeys);
                }
                return report;
            },

            /**
             * Verify a given value and return a report.
             * @param {String} internalValue value
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             */
            checkValue : function (internalValue) {
                var options = this._dataModel.listContent;
                var indexFound = -1;
                for (var i = 0, l = options.length; i < l; i++) {
                    if (options[i].value == internalValue) {
                        indexFound = i;
                        break;
                    }
                }
                this._setDisplayIdx(indexFound);
                return this._createReport(true);
            },

            /**
             * Verify a given text and return a report. Always returns null (as a select widget does not support setting
             * its displayed text directly).
             * @param {String} text
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             */
            checkText : function (text) {
                return null;
            },

            /**
             * Called when the user wants to toggle the display of the dropdown.
             * @return {aria.widgets.controllers.reports.DropDownControllerReport}
             */
            toggleDropdown : function () {
                var report = new aria.widgets.controllers.reports.DropDownControllerReport();
                report.displayDropDown = (this._listWidget == null);
                if (this._dataModel && this._dataModel.displayIdx !== this._dataModel.selectedIdx) {
                    this._setDisplayIdx(this._dataModel.displayIdx);
                }
                return report;
            },

            /**
             * Set the list widget (when the popup is opened).
             * @param {aria.widgets.form.list.List} listWidget
             */
            setListWidget : function (listWidget) {
                // Note that it is not the job of this method to dispose the previous
                // list widget, if any. This is done when the section containing the
                // list widget is disposed.
                this._listWidget = listWidget;
            }
        }
    });
})();