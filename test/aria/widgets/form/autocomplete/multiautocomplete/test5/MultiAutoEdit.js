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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test5.MultiAutoEdit",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.FireDomEvent"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            ac_airline_values : []
        };

        // setTestEnv has to be invoked before runTemplateTest fires
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.multiautocomplete.template.MultiAutoTpl",
            data : this.data
        });

    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("MultiAutoId"), {
                fn : this.typeSomething,
                scope : this
            });
        },

        typeSomething : function (evt, callback) {
            // give it the time to open a drop down
            this.synEvent.type(this.getInputField("MultiAutoId"), "air", {
                fn : this._wait,
                scope : this,
                args : this._selectVal
            });
        },
        _wait : function (evt, callback) {
            aria.core.Timer.addCallback({
                fn : callback,
                scope : this,
                delay : 500
            });
        },
        _selectVal : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[down][down][enter]", {
                fn : this._typeAgain,
                scope : this
            });
        },
        _typeAgain : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "a", {
                fn : this._wait,
                scope : this,
                args : this._selectSecondVal
            });

        },
        _selectSecondVal : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[down][down][enter]", {
                fn : this._editValues,
                scope : this
            });

        },
        _editValues : function () {
            var mainNode = this.getInputField("MultiAutoId").parentNode;
            var element = mainNode.childNodes[0].firstChild;
            // to simulate double click
            aria.utils.FireDomEvent.fireEvent('dblclick', element, {});
            this.synEvent.click(this.getInputField("MultiAutoId"), {
                fn : this._onAfterUserAction,
                scope : this
            });
        },
        _onAfterUserAction : function () {

            this.getWidgetInstance("MultiAutoId").setCaretPosition(11, 11);
            this.synEvent.type(this.getInputField("MultiAutoId"), "[backspace][backspace][backspace][backspace][backspace][backspace][backspace]", {
                fn : this._wait,
                scope : this,
                args : this._checkText
            });

        },
        _checkText : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[down][down][enter]", {
                fn : this._wait,
                scope : this,
                args : this._checkValue
            });

        },
        _checkValue : function () {
            var parentNode = this.getInputField("MultiAutoId").parentNode;
            var expectedVal = ["Air Canada", "Air France"];
            for (var i = 0; i < parentNode.childNodes.length - 1; i++) {
                var element = parentNode.childNodes[i].innerText || parentNode.childNodes[i].textContent;
                this.assertEquals(element, expectedVal[i], "The Wrong values are edited for Autocomplete.");
            }
            this.notifyTemplateTestEnd();
        }

    }
});
