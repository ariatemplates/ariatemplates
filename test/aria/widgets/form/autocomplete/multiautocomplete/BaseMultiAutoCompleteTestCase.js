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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Type", "aria.utils.FireDomEvent"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = this.data || {
            ac_airline_values : [],
            freeText : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.multiautocomplete.template.MultiAutoTpl",
            data : this.data
        });

    },
    $prototype : {

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
            this.synEvent.type(this._getField(), args.text.shift(), {
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
            this.assertEquals(data.length, count, "The number of items in the data model is not correct.");
            if (expectedValues) {
                for (var j = 0; j < data.length; j++) {
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
            this.templateCtxt.$focus("justToFocusOut");
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
        _fireClickOnSuggestion : function (index) {
            var suggestionToBeHighlighted = this._suggestionToBeHighlighted(index);
            aria.utils.FireDomEvent.fireEvent('click', suggestionToBeHighlighted);
        },
        checkHighlightedElementsIndices : function (expectedHighlightedArray) {
            var widgetInstance = this._getWidgetInstance();
            var actualHighlightedArray = widgetInstance.getHighlight();
            this.assertJsonEquals(expectedHighlightedArray, actualHighlightedArray, "Expected higlighted elements indices are ["
                    + expectedHighlightedArray
                    + "] but actual highlighted elements indices are ["
                    + actualHighlightedArray + "]");
        }

    }
});
