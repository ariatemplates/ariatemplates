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
    $classpath : "test.aria.widgets.form.autocomplete.autoselect.OpenDropDownTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.FireDomEvent"],
    $prototype : {
        waitDropDown : function (evt, callback) {
            var testCase = this;
            this.waitFor({
                condition : function () {
                    return !!testCase.getWidgetDropDownPopup("ac");
                },
                callback : function () {
                    testCase.$callback({
                        fn : callback || evt,
                        scope : testCase
                    });
                }
            });
        },

        waitALittle : function (evt, callback) {
            // give it the time to open a drop down
            aria.core.Timer.addCallback({
                fn : callback,
                scope : this,
                delay : 200
            });
        },

        runTemplateTest : function () {
            // try to type in the Autocomplete
            this.clickAndType("ac", "text", {
                fn : this._checkFirstType,
                scope : this
            }, false);
        },

        _checkFirstType : function () {
            var text = this.getInputField("ac").value;

            this.assertEquals(text, "text", "Value of autocomplete should be 'text', got '" + text + "'");

            this.waitDropDown(this._goToTextField);
        },

        _goToTextField : function () {
            this.clickAndType("tf", "get ready", {
                fn : this._navigate,
                scope : this
            });
        },

        _navigate : function () {
            // wait a little to let the autoselect kick in
            Aria.getReady = true;
            this.synEvent.type(this.getInputField("tf"), "\t", {
                fn : this.waitALittle,
                scope : this,
                args : this._typeAgain
            });
        },

        _typeAgain : function () {
            // This should be done by a tab
            this.getInputField("ac").value = "";

            // this type should remove everything and keep only fun
            this.synEvent.type(this.getInputField("ac"), "fun", {
                fn : this.waitDropDown,
                scope : this,
                args : this._finishTyping
            });
        },

        _finishTyping : function () {
            this.synEvent.type(this.getInputField("ac"), "ny", {
                fn : this.waitALittle,
                scope : this,
                args : this._checkSecondType
            });
        },

        _checkSecondType : function () {
            var text = this.getInputField("ac").value;

            this.assertEquals(text, "funny", "Value of autocomplete should be 'funny', got '" + text + "'");

            this.clickAndType("tf", "end", {
                fn : this.end,
                scope : this
            });
        }
    }
});
