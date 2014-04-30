/*
 * Copyright 2013 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Type", "aria.utils.Math"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = this.data || {
            ac_airline_values : [],
            freeText : true,
            onChangeCalls : 0,
            onBlurCalls : 0,
            onFocusCalls : 0
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.multiautocomplete.template.MultiAutoTpl",
            data : this.data
        });

    },
    $prototype : {

        /**
         * @return The currently focused element in the page.
         */
        getFocusedElement : function () {
            return Aria.$window.document.activeElement;
        },

        clickAndType : function (text, cb, delay) {
            if (aria.utils.Type.isString(text)) {
                text = [text];
            }
            this.synEvent.click(this._getField(), {
                fn : this.type,
                scope : this,
                args : {
                    text : text,
                    cb : cb,
                    delay : delay || 800
                }
            });
        },

        type : function (evt, args) {
            args = args || evt;
            this.synEvent.type(this.getFocusedElement(), args.text.shift(), {
                fn : this.__wait,
                scope : this,
                args : args
            });
        },

        __wait : function (evt, args) {
            var cb;
            if (args.text.length === 0) {
                cb = args.cb;
            } else {
                cb = {
                    fn : this.type,
                    scope : this,
                    args : args
                };
            }
            cb.delay = args.delay;
            aria.core.Timer.addCallback(cb);
        },

        checkSelectedItems : function (count, labels) {
            var container = this._getContainer();
            var actualOptionCount = container.children.length - 1;
            this.assertEquals(actualOptionCount, count, "The number of selected options should be " + count
                    + ". It is " + actualOptionCount + " instead.");

            if (labels) {
                var element, text;
                for (var i = 0; i < labels.length; i++) {
                    element = container.childNodes[i];
                    text = element.textContent || element.innerText;
                    this.assertEquals(text, labels[i], "The Wrong values are added as for Autocomplete.");
                }
            }
        },

        checkDataModel : function (count, expectedValues) {
            var data = this.data.ac_airline_values, message;
            this.assertEquals(data.length, count, "The number of items in the data model should be " + count
                    + ". It is " + data.length + " instead.");
            if (expectedValues) {
                for (var j = 0, length = aria.utils.Math.min(data.length, expectedValues.length); j < length; j++) {
                    var message = "Wrong value in position " + j + " of the data model.";
                    if (aria.utils.Type.isString(data[j])) {
                        this.assertEquals(data[j], expectedValues[j], message);
                    } else {
                        this.assertEquals(data[j].code, expectedValues[j].code, message);
                        this.assertEquals(data[j].label, expectedValues[j].label, message);
                    }
                }
            }
        },

        focusOut : function (cb) {
            this.synEvent.click(this.getElementById("justToFocusOut"), {
                fn : this._onFocusOut,
                scope : this,
                args : cb
            });
        },

        _onFocusOut : function (evt, cb) {
            cb.delay = cb.delay || 10;
            aria.core.Timer.addCallback(cb);
        },

        checkInputValue : function (value) {
            var actualValue = this._getField().value;
            this.assertEquals(actualValue, value, "Input field should have value " + value + ". It has " + actualValue
                    + " instead.");
        },

        removeByCrossClick : function (index, cb) {
            this.synEvent.click(this._getSelectedItemElement(index).lastChild, cb);
        },

        _getField : function () {
            return this.getInputField("MultiAutoId");
        },

        _getContainer : function () {
            return this._getField().parentNode;
        },

        _getSelectedItemElement : function (index) {
            return this._getContainer().childNodes[index];
        },
        _getWidgetInstance : function () {
            return this.getWidgetInstance("MultiAutoId");
        },
        _suggestionToBeHighlighted : function (index) {
            var suggestionsContainer = this._getContainer();
            var suggestionToBeHighlighted = suggestionsContainer.children[index].firstChild;
            return suggestionToBeHighlighted;
        },
        _fireClickOnSuggestion : function (index, continueWith) {
            var suggestionToBeHighlighted = this._suggestionToBeHighlighted(index);
            this.synEvent.click(suggestionToBeHighlighted, {
                scope : this,
                fn : continueWith
            });
        },
        checkHighlightedElementsIndices : function (expectedHighlightedArray) {
            var widgetInstance = this._getWidgetInstance();
            var actualHighlightedArray = widgetInstance.getHighlight();
            this.assertJsonEquals(expectedHighlightedArray, actualHighlightedArray, "Expected highlighted elements indices are ["
                    + expectedHighlightedArray
                    + "] but actual highlighted elements indices are ["
                    + actualHighlightedArray + "]");
        },

        toggleOption : function (id, index, continueWith) {
            aria.core.Timer.addCallback({
                fn : function () {
                    var checkBox = this.getCheckBox(id, index).getDom();
                    if (checkBox) {
                        this.synEvent.click(checkBox, {
                            fn : continueWith,
                            scope : this
                        });
                    }
                },
                scope : this,
                delay : 1000
            });
        },
        getCheckBox : function (msId, index) {
            var ms = this.getWidgetInstance(msId), list = ms.controller.getListWidget();
            if (list._tplWidget) {
                return list._tplWidget.subTplCtxt._mainSection._content[1]._content[0].section._content[index].behavior;
            }
            return null;
        },
        isMultiAutoCompleteOpen : function (msId) {
            var listWidget = this.getWidgetInstance(msId).controller.getListWidget();
            return !!(listWidget && listWidget._tplWidget && listWidget._tplWidget.subTplCtxt);
        },
        clickonExpandoButton : function (callback) {
            var msIcon = this.getExpandButton("MultiAutoId");
            this.synEvent.click(msIcon, {
                fn : this.openAutoPopup,
                scope : this,
                args : {
                    fn : callback,
                    scope : this
                }
            });

        },
        openAutoPopup : function (evt, cb) {
            this.waitForDropdownState(true, cb);
        },

        waitForDropdownState : function (open, cb) {
            this.waitFor({
                condition : function () {
                    return this.isMultiAutoCompleteOpen("MultiAutoId") == open;
                },
                callback : cb
            });
        }

    }
});
