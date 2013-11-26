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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test1.MultiAutoAdd",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        // setTestEnv has to be invoked before runTemplateTest fires
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.multiautocomplete.template.MultiAutoTpl"
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
            this.synEvent.type(this.getInputField("MultiAutoId"), "fi", {
                fn : this._wait,
                scope : this,
                args : this._selectVal2
            });

        },
        _selectVal2 : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[down][enter]", {
                fn : this._checkSelected,
                scope : this
            });
        },
        _checkSelected : function () {
            var parentNode = this.getInputField("MultiAutoId").parentNode;
            this.assertEquals(this.getInputField("MultiAutoId").value, "", "The Input Field should be empty.");
            this.assertEquals(parentNode.childNodes.length, 3, "The Wrong No. of elements are added.");
            var expectedVal = ["Air Canada", "Finnair"];
            for (var i = 0; i < parentNode.childNodes.length - 1; i++) {
                var element = parentNode.childNodes[i].innerText || parentNode.childNodes[i].textContent;
                this.assertEquals(element, expectedVal[i], "The Wrong values are added as for Autocomplete.");
            }
            this.notifyTemplateTestEnd();
        }

    }
});
