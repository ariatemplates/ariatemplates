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
    $classpath : "test.aria.widgets.form.autocomplete.expandbutton.test4.ExpandButtonCheck",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $destructor : function () {
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("ac1"), {
                fn : this._clickAC,
                scope : this
            });
        },

        _clickAC : function (id, continueWith) {
            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : this._openAC,
                scope : this
            });
        },

        _openAC : function (evt, args) {
            aria.core.Timer.addCallback({
                fn : this._selectFirstItem,
                scope : this,
                delay : 1000
            });
        },

        _selectFirstItem : function () {
            var ac = this.getInputField("ac1");
            ac.focus();
            aria.core.Timer.addCallback({
                fn : this._afterSelect,
                scope : this,
                delay : 1000
            });

        },

        _afterSelect : function () {
            this.synEvent.type(this.getInputField("ac1"), "[down][down][enter]", {
                fn : this._checkSelected,
                scope : this
            });
        },

        _checkSelected : function () {
            aria.core.Timer.addCallback({
                fn : this._checkSelectedEntry,
                scope : this,
                delay : 1000
            });

        },

        _checkSelectedEntry : function () {
            var value = this.getInputField("ac1").value;
            this.assertTrue(value == "Finnair", "The value of the autocomplete is " + value + ", but it should be Finnair");

            this.synEvent.click(this.getInputField("ac1"), {
                fn : this._clickAC2,
                scope : this
            });
        },

        _clickAC2 : function (id, continueWith) {
            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : this._openAC2,
                scope : this
            });
        },

        _openAC2 : function (evt, args) {
            aria.core.Timer.addCallback({
                fn : this._checkHighlighted,
                scope : this,
                delay : 1000
            });
        },

        _checkHighlighted : function () {
            var ac = this.getInputField("ac1");
            ac.focus();
            aria.core.Timer.addCallback({
                fn : this._afterSelect2,
                scope : this,
                delay : 1000
            });
        },

        _afterSelect2 : function () {
            var dropdownPopup = this.getWidgetInstance("ac1")._dropdownPopup;
            var selectedElt = this.getElementsByClassName(dropdownPopup.domElement, "xLISTSelectedItem_dropdown")[0];

            this.assertTrue(selectedElt.innerHTML.match(/<strong>Finnair<\/strong>/gi).length == 1, "The value of the selected element is " + selectedElt.innerHTML + ", but it should be \n<strong>Finnair</strong>\n");

            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : this._closeAC,
                scope : this
            });
        },

        _closeAC : function () {
            this.synEvent.type(this.getInputField("ac1"), "[backspace][backspace][backspace][backspace][backspace][backspace][backspace]", {
                fn : this._checkText,
                scope : this
            });
        },

        _checkText : function () {
            var value = this.getInputField("ac1").value;
            this.assertTrue(value === "", "The value of the autocomplete is " + value + ", but it should be empty");
            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : this._openAC3,
                scope : this
            });
        },

        _openAC3 : function () {
            var dropdownPopup = this.getWidgetInstance("ac1")._dropdownPopup;
            var selectedElt = this.getElementsByClassName(dropdownPopup.domElement, "xLISTSelectedItem_dropdown");

            this.assertTrue(selectedElt.length === 0, "There shouldn't be any highlighted element.");
            this.notifyTemplateTestEnd();
        }
    }
});
