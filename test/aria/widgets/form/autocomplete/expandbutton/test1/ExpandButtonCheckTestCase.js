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
    $classpath : "test.aria.widgets.form.autocomplete.expandbutton.test1.ExpandButtonCheck",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        // this.defaultTestTimeout = 2000;
    },
    $destructor : function () {
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {

        /**
         * Helper to check a multiselect option
         * @param {String} id
         * @param {Number} index
         * @param {Function} continueWith what to do next
         */
        _toggleOption : function (id, index, continueWith) {
            aria.core.Timer.addCallback({
                fn : function () {
                    var checkBox = this._getCheckBox(id, index).getDom();
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
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("ac1"), {
                fn : this._clickIcon,
                scope : this
            });
        },

        _clickIcon : function (id, continueWith) {
            var msIcon = this.getMultiSelectIcon("ac1");
            this.synEvent.click(msIcon, {
                fn : this._openAc,
                scope : this
            });
        },

        _openAc : function (evt, args) {
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
                fn : this._checkFinalVal,
                scope : this,
                delay : 1000
            });

        },
        _checkFinalVal : function () {
            this.assertTrue(this.getInputField("ac1").value == "Finnair");
            this.notifyTemplateTestEnd();
        }

    }
});
